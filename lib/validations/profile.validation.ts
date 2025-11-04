import { z } from 'zod';

// Schema for profile update
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits').optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
