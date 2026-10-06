import { z } from 'zod'

export const createGroupSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
})

export const joinGroupSchema = z.object({
  inviteCode: z.string().min(1, 'Introduce un código de invitación'),
})