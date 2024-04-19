import { z } from 'zod';

// Schema for user login
export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Schema for user registration
export const RegisterSchema = z.object({
  username: z.string({
    required_error: "User Name is required",
    invalid_type_error: "Name must be a string"
  }),
  display_name: z.string({
    required_error: "Display Name is required",
    invalid_type_error: "Display Name must be a string"
  }).min(2, { message: "Display name must be 2 or more characters long" }),
  gender: z.enum(["Male", "Female"]).default('Male'),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  passwordConfirmation: z.string({
    required_error: "Password Confirmation must not be empty",
    invalid_type_error: "Password Confirmation must be a string"
  }).min(6, { message: "Password Confirmation must be at least 6 characters long" }),
})
/*.refine(data => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"]
});
*/

export type loginBody = z.infer<typeof LoginSchema>;

export type registerBody = z.infer<typeof RegisterSchema>;