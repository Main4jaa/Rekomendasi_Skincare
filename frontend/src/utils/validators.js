import { z } from 'zod';
export const patientSchema = z.object({
  name: z.string().max(120, 'Nama terlalu panjang').optional().or(z.literal('')),
  age: z.coerce.number().min(0, 'Umur minimal 0').max(120, 'Umur maksimal 120').optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
});
