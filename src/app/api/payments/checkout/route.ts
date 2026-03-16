import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-cookie";
import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";
import Order from "@/models/Order";
import User from "@/models/User";
import crypto from "crypto";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.sub) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { resourceId } = await req.json();
    
    // 1. Strict Input Validation
    if (!resourceId || !mongoose.isValidObjectId(resourceId)) {
      return NextResponse.json({ success: false, message: "A valid Resource ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    // 2. Security: Always fetch price from DB, never trust client-provided price
    const resource = await Resource.findById(resourceId).select("price title isPremium");
    if (!resource || !resource.isPremium) {
      return NextResponse.json({ success: false, message: "This resource is not available for purchase" }, { status: 400 });
    }

    if (typeof resource.price !== 'number' || resource.price < 0) {
      return NextResponse.json({ success: false, message: "Resource has no valid price configuration" }, { status: 400 });
    }

    const user = await User.findById(session.sub).select("name email purchasedResources emailVerified");
    if (!user) {
      return NextResponse.json({ success: false, message: "User account not found" }, { status: 404 });
    }

    // 3. Auth Check: Ensure verified for payments
    if (!user.emailVerified) {
      return NextResponse.json({ success: false, message: "Please verify your email to purchase premium materials." }, { status: 403 });
    }

    // 4. Idempotency Check: Prevent duplicate purchases
    const hasPurchased = user.purchasedResources.some(id => id.toString() === resourceId);
    if (hasPurchased) {
       return NextResponse.json({ success: false, message: "You have already purchased this resource." }, { status: 400 });
    }

    const currency = "LKR";

    // 5. Atomic Order Handling: Ensure we don't create multiple pending orders for the same user/resource
    const order = await Order.findOneAndUpdate(
      { user: user._id, resource: resource._id, paymentStatus: { $ne: "completed" } },
      {
        $set: {
          amount: resource.price,
          currency: currency,
          paymentStatus: "pending",
          paymentMethod: "payhere",
        }
      },
      { upsert: true, new: true }
    );

    const merchantId = (process.env.PAYHERE_MERCHANT_ID || "").trim();
    const merchantSecret = (process.env.PAYHERE_SECRET || "").trim();
    const environment = (process.env.PAYHERE_ENV || "sandbox").trim();

    if (!merchantId || !merchantSecret) {
      console.error("[Checkout POST] Critical Error: PayHere credentials missing in environment variables.");
      return NextResponse.json({ success: false, message: "Payment system is currently unavailable." }, { status: 500 });
    }

    const orderId = String(order._id);
    const formattedAmount = Number(resource.price).toFixed(2);

    // 6. Security: HMAC MD5 Hash Calculation
    const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
    const hashString = `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`;
    const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    const nameParts = user.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "Student";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "User";
    
    const baseUrl = (
      process.env.NEXT_PUBLIC_APP_URL || 
      process.env.NEXTAUTH_URL || 
      req.nextUrl.origin || 
      ""
    ).trim().replace(/\/$/, "");
    
    return NextResponse.json({
      success: true,
      orderId: orderId,
      hash: hash,
      amount: formattedAmount,
      currency,
      merchantId,
      environment,
      return_url: `${baseUrl}/dashboard`,
      cancel_url: `${baseUrl}/premium-store`,
      notify_url: `${baseUrl}/api/payments/notify`,
      user: {
        first_name: firstName,
        last_name: lastName,
        email: user.email,
        phone: "0000000000", // Required by PayHere, but we don't collect it
      },
      itemTitle: resource.title,
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("[Checkout POST] Unhandled Exception:", error);
    return NextResponse.json({ success: false, message: "An unexpected error occurred during checkout initialization." }, { status: 500 });
  }
}
