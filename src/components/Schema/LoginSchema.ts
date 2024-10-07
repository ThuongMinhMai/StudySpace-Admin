import { z } from 'zod'
const roleEnum = z.enum(['admin', 'supplier'])
export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, 'Bắt buộc').email('Email invalid'),
  password: z.string().trim().min(1, 'Bắt buộc'),
  role: roleEnum
})



export type TSignInSchema = z.infer<typeof signInSchema>
