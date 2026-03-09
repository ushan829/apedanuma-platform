import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-cookie";
import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";
import Order from "@/models/Order";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.sub) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { resourceId } = await req.json();
    if (!resourceId) {
      return NextResponse.json({ success: false, message: "Resource ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const resource = await Resource.findById(resourceId).select("price title isPremium");
    if (!resource || !resource.isPremium) {
      return NextResponse.json({ success: false, message: "Invalid premium resource" }, { status: 400 });
    }

    if (resource.price === undefined || resource.price === null) {
      return NextResponse.json({ success: false, message: "Resource has no valid price" }, { status: 400 });
    }

    const user = await User.findById(session.sub).select("name email purchasedResources");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Check if user already purchased the resource to avoid duplicate purchases
    const hasPurchased = user.purchasedResources.some(id => id.toString() === resourceId);
    if (hasPurchased) {
       return NextResponse.json({ success: false, message: "Already purchased" }, { status: 400 });
    }

    // 1. Check for any existing order for this user/resource combination
    let order = await Order.findOne({ user: user._id, resource: resource._id });
    const currency = "LKR";

    if (order) {
      // 2. If the order is already completed, return 400 error
      if (order.paymentStatus === "completed") {
        return NextResponse.json({ success: false, message: "Already purchased" }, { status: 400 });
      }
      
      // 3. If it's PENDING or FAILED, update it and use it
      order.amount = resource.price;
      order.paymentStatus = "pending";
      await order.save();
    } else {
      // 4. If no order exists, create a new one
      order = await Order.create({
        user: user._id,
        resource: resource._id,
        amount: resource.price,
        currency: currency,
        paymentStatus: "pending",
        paymentMethod: "payhere",
      });
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_SECRET;
    const environment = process.env.PAYHERE_ENV || "sandbox";

    if (!merchantId || !merchantSecret) {
      console.error("[Checkout POST] Missing PayHere credentials in ENV");
      return NextResponse.json({ success: false, message: "Server misconfiguration" }, { status: 500 });
    }

    const orderId = String(order._id);
    const formattedAmount = Number(resource.price).toFixed(2);

    const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
    const hashString = `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`;
    const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    console.log("🟢 PAYHERE HASH DEBUG:", { merchantId, orderId, formattedAmount, currency, hashString, hash });

    const nameParts = user.name.split(" ");
    
    return NextResponse.json({
      success: true,
      orderId: orderId,
      hash: hash,
      amount: formattedAmount,
      currency,
      merchantId,
      environment,
      user: {
        first_name: nameParts[0] || "Student",
        last_name: nameParts.slice(1).join(" ") || "User",
        email: user.email,
        phone: "0000000000",
      },
      itemTitle: resource.title,
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("[Checkout POST] Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
