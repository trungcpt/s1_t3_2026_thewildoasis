import { z } from 'zod';

interface FormatResponseParams<T = any> {
  errors?: null | Record<string, any>[];
  data?: T;
  message?: string;
  [key: string]: any;
}

export type { FormatResponseParams };

export const FormatResponseSchema = z.object({
  errors: z.array(z.any()).nullable().optional(),
  data: z.any().nullable().optional(),
  message: z.string().optional(),
});
