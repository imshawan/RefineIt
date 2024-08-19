import { z } from "zod";

export const SigninFormSchema = z.object({
    email: z
        .string()
        .nonempty({ message: "Username or email is required" })
        .min(3, { message: "Enter a valid username or email" }),
    password: z
        .string()
        .nonempty({ message: "Password is required" })
        .min(5, { message: "Password must be at least 5 characters" }),
    rememberMe: z.boolean().optional(),
});