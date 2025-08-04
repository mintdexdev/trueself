import { z } from 'zod'

export const usernameValidation = z
  .string()
  .min(3, "Username must be at least 2 characters")
  .max(20, "Username must be less than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: 'invalid email address' }),
  password: z.string().min(8, { message: 'password must be at least 6 characters' }),
})