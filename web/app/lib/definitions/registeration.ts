import { z } from "zod";

export const RegisterFormSchema = z.object({
    fullname: z
        .string({ message: "Full name is required" })
        .min(4, { message: "Full name must be at least 4 characters" }),
    username: z
        .string({ message: "Username is required" })
        .min(4, { message: "Username must be at least 4 characters" }),
    email: z
        .string({ message: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: z
        .string({ message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" }),
    agreeTerms: z
        .boolean({
            message: "You must agree to the terms and conditions",
        })
});
