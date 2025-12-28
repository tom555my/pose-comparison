import { z } from 'zod';

export const ResponseSchema = z.object({
	score: z.number().describe('Similarity score between 0 and 100'),
	feedback: z
		.string()
		.describe(
			'Short, fun, punchy feedback in Cantonese (HK). If score is high, praise them! If low, roast them gently but encourage a retry.',
		),
});

export type PoseComparisonResult = z.infer<typeof ResponseSchema>;
