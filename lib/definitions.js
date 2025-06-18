import { z } from 'zod'

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'İsim en az 2 karakter uzunluğunda olmalıdır.' })
    .trim(),
  email: z.string().email({ message: 'Lütfen geçerli bir e-posta adresi giriniz.' }).trim(),
  password: z
    .string()
    .min(6, { message: 'En az 6 karakter uzunluğunda olmalıdır' })
    // .regex(/[a-zA-Z]/, { message: 'En az bir harf içermelidir.' })
    // .regex(/[0-9]/, { message: 'En az bir rakam içermelidir.' })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: 'En az bir özel karakter içermelidir.',
    // })
    .trim(),
})

export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Lütfen geçerli bir e-posta adresi giriniz.' }).trim(),
  password: z
    .string()
    .min(1, { message: 'Parola zorunlu' })
    .trim(),
})
