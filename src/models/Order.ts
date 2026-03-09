import mongoose, { Schema, model, models, type Document, type Types } from "mongoose";

/* ─────────────────────────────────────────
   Enums
   ───────────────────────────────────────── */
export const PAYMENT_STATUS_VALUES = [
  "pending",    // Order created; awaiting payment confirmation.
  "completed",  // Payment verified; access granted.
  "failed",     // Payment attempt failed or was declined.
  "refunded",   // Amount returned to the buyer.
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUS_VALUES)[number];

export const PAYMENT_METHOD_VALUES = [
  "card",
  "payhere",   // PayHere — popular Sri Lankan payment gateway.
  "genie",     // Dialog Genie wallet.
  "frimi",     // FriMi wallet.
  "manual",    // Admin-granted access (e.g. promotional / scholarship).
] as const;

export type PaymentMethod = (typeof PAYMENT_METHOD_VALUES)[number];

/* ─────────────────────────────────────────
   TypeScript interface
   ───────────────────────────────────────── */
export interface IOrder extends Document {
  /** The student who placed the order. */
  user: Types.ObjectId;
  /** The premium resource being purchased. */
  resource: Types.ObjectId;
  /** Amount charged, in LKR. */
  amount: number;
  /** Currency code — defaults to LKR. */
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  /**
   * Gateway-provided transaction / payment reference ID.
   * Stored for reconciliation and dispute resolution.
   */
  transactionId?: string;
  /** ISO date when the payment was confirmed by the gateway. */
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/* ─────────────────────────────────────────
   Schema
   ───────────────────────────────────────── */
const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required."],
      index: true,
    },

    resource: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: [true, "Resource reference is required."],
      index: true,
    },

    amount: {
      type: Number,
      required: [true, "Order amount is required."],
      min: [0, "Amount cannot be negative."],
    },

    currency: {
      type: String,
      default: "LKR",
      uppercase: true,
      trim: true,
      maxlength: 3,
    },

    paymentStatus: {
      type: String,
      enum: {
        values: PAYMENT_STATUS_VALUES,
        message: "'{VALUE}' is not a valid payment status.",
      },
      default: "pending",
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: {
        values: PAYMENT_METHOD_VALUES,
        message: "'{VALUE}' is not a recognised payment method.",
      },
    },

    transactionId: {
      type: String,
      trim: true,
      sparse: true, // Allow multiple null values in the unique index.
      unique: true,
    },

    paidAt: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

/* ─────────────────────────────────────────
   Indexes
   ───────────────────────────────────────── */
// Prevent a user from buying the same resource twice.
OrderSchema.index({ user: 1, resource: 1 }, { unique: true });
// Admin dashboard: list orders by status + creation date.
OrderSchema.index({ paymentStatus: 1, createdAt: -1 });

/* ─────────────────────────────────────────
   Export
   ───────────────────────────────────────── */
const Order =
  (models.Order as mongoose.Model<IOrder>) ??
  model<IOrder>("Order", OrderSchema);

export default Order;
