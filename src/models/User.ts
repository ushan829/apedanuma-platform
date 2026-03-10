import mongoose, { Schema, model, models, type Document, type Types } from "mongoose";
import bcrypt from "bcryptjs";

/* ─────────────────────────────────────────
   TypeScript interface
   ───────────────────────────────────────── */
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "student" | "admin";
  /** IDs of premium resources the student has purchased. */
  purchasedResources: Types.ObjectId[];
  /** ISO date string — when the account was created. Managed by Mongoose timestamps. */
  createdAt: Date;
  updatedAt: Date;
  /** Instance method: verify a plain-text password against the stored hash. */
  comparePassword(candidatePassword: string): Promise<boolean>;
  /** Optional fields for password reset functionality */
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  /** Email verification fields */
  emailVerified: boolean;
  verificationToken?: string;
}

/* ─────────────────────────────────────────
   Schema
   ───────────────────────────────────────── */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must be at least 2 characters."],
      maxlength: [80, "Name cannot exceed 80 characters."],
    },

    email: {
      type: String,
      required: [true, "Email address is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address.",
      ],
    },

    password: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: ["student", "admin"],
        message: "Role must be either 'student' or 'admin'.",
      },
      default: "student",
    },

    purchasedResources: {
      type: [{ type: Schema.Types.ObjectId, ref: "Resource" }],
      default: [],
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,

    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
  },
  {
    timestamps: true, // Adds createdAt + updatedAt automatically.
  }
);

/* ─────────────────────────────────────────
   Indexes
   ───────────────────────────────────────── */
// email already has a unique index from the schema definition.
UserSchema.index({ role: 1 });

/* ─────────────────────────────────────────
   Pre-save hook — hash password
   ───────────────────────────────────────── */
UserSchema.pre("save", async function () {
  // Only re-hash when the password field is actually modified.
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/* ─────────────────────────────────────────
   Instance method — compare passwords
   ───────────────────────────────────────── */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};

/* ─────────────────────────────────────────
   Export
   ─────────────────────────────────────────
   `models.User` guard prevents "Cannot overwrite model once compiled"
   errors that occur during Next.js hot-reloads.
   ───────────────────────────────────────── */
const User = (models.User as mongoose.Model<IUser>) ?? model<IUser>("User", UserSchema);

export default User;
