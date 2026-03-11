import { z } from "zod";

/**
 * Shared validation rules to ensure consistency between frontend and backend.
 */

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be less than 50 characters.")
    .transform((val) => val.trim()),
  email: z
    .string()
    .email("Please provide a valid email address.")
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be less than 100 characters."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address.")
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(1, "Password is required."),
});

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be less than 80 characters.")
    .transform((val) => val.trim()),
  email: z
    .string()
    .email("Please provide a valid email address.")
    .transform((val) => val.trim().toLowerCase()),
  subject: z
    .string()
    .min(2, "Subject must be at least 2 characters.")
    .max(150, "Subject must be less than 150 characters.")
    .transform((val) => val.trim()),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message must be less than 2000 characters.")
    .transform((val) => val.trim()),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be less than 80 characters.")
    .transform((val) => val.trim())
    .optional(),
  currentPassword: z
    .string()
    .min(1, "Current password is required to update security settings.")
    .optional(),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters.")
    .max(100, "New password must be less than 100 characters.")
    .optional(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required to set a new password.",
  path: ["currentPassword"],
});

export const subscribeSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address.")
    .transform((val) => val.trim().toLowerCase()),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type SubscribeInput = z.infer<typeof subscribeSchema>;
