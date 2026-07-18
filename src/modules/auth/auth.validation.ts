import { z } from "zod";

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["TENANT", "LANDLORD"], {
      error: "Role must be either TENANT or LANDLORD",
    }),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
};