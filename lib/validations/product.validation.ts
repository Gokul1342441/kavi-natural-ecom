import { z } from 'zod';

export const productSchema = z.object({
  product_name: z.string().min(1).max(200),
  category: z.enum(['PERSONAL_CARE', 'HOME_CARE']),
  type: z.string().min(1).max(150),
  description: z.string().min(1).max(500),
  ingredients: z.string().min(1).max(500),
  imageUrl: z.array(z.string().url()).nonempty(),
  sizePrice: z.record(z.string(), z.number().positive()),
  stock: z.boolean().default(true)
});