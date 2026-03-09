import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const merchant_id = formData.get("merchant_id") as string;
    const order_id = formData.get("order_id") as string;
    const payhere_amount = formData.get("payhere_amount") as string;
    const payhere_currency = formData.get("payhere_currency") as string;
    const status_code = formData.get("status_code") as string;
    const md5sig = formData.get("md5sig") as string;
    const payment_id = formData.get("payment_id") as string;

    const merchantSecret = process.env.PAYHERE_SECRET!;
    
    if (!merchantSecret) {
      console.error("[PayHere Notify] Secret missing");
      return new NextResponse("Server configuration error", { status: 500 });
    }

    // Verify hash
    const hashedSecret = crypto.createHash("md5").update(merchantSecret).digest("hex").toUpperCase();
    const hashString = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`;
    const generatedHash = crypto.createHash("md5").update(hashString).digest("hex").toUpperCase();

    if (generatedHash !== md5sig) {
      console.error("[PayHere Notify] Invalid Signature for order:", order_id);
      return new NextResponse("Invalid Signature", { status: 400 });
    }

    await connectToDatabase();
    const order = await Order.findById(order_id);
    
    if (!order) {
      console.error("[PayHere Notify] Order not found:", order_id);
      return new NextResponse("Order not found", { status: 404 });
    }

    // Success code '2' = successful payment
    if (status_code === "2") {
      if (order.paymentStatus !== "completed") {
        order.paymentStatus = "completed";
        order.paidAt = new Date();
        if (payment_id) {
            order.transactionId = payment_id;
        }
        await order.save();

        // Grant resource to user
        await User.findByIdAndUpdate(order.user, {
          $addToSet: { purchasedResources: order.resource }
        });
        
        console.log(`[PayHere Notify] Order ${order_id} completed successfully`);
      }
    } else if (status_code === "-1" || status_code === "-2" || status_code === "-3") {
        // Failed / Canceled / Charged back
        if (order.paymentStatus === "pending") {
            order.paymentStatus = "failed";
            await order.save();
            console.log(`[PayHere Notify] Order ${order_id} failed`);
        }
    }

    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("[PayHere Notify] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
