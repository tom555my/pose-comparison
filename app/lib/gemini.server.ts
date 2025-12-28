import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Output, streamText } from 'ai';
import { ResponseSchema } from './schema';

const PROMPT = `You are a judge in a high-energy party game called "Pose Off!".
  
  Your task is to compare two images:
  1. The TARGET POSE (the goal).
  2. The ATTEMPT (the player's recreation).

  Analyze the similarity based on:
  - Limb angles and positioning (arms, legs).
  - Body orientation.
  - Facial expression (if visible/relevant).
  
  Be lenient but fair. This is a fun party game.
  `;

export function comparePosesStream(
	targetImageBase64: string,
	targetImageType: string,
	attemptImageBase64: string,
	attemptImageType: string,
	apiKey: string,
): Response {
	const google = createGoogleGenerativeAI({ apiKey });

	const result = streamText({
		model: google('gemini-3-flash-preview'),
		output: Output.object({ schema: ResponseSchema }),
		messages: [
			{
				role: 'user',
				content: [
					{ type: 'text', text: PROMPT },
					{
						type: 'file',
						data: targetImageBase64,
						mediaType: targetImageType,
					},
					{
						type: 'file',
						data: attemptImageBase64,
						mediaType: attemptImageType,
					},
				],
			},
		],
	});

	return result.toTextStreamResponse();
}
