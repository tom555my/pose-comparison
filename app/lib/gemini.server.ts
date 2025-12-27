import { Buffer } from 'node:buffer';
import { GoogleGenAI, type Schema } from '@google/genai';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const ResponseSchema = z.object({
	score: z.number().describe('Similarity score between 0 and 100'),
	feedback: z
		.string()
		.describe(
			'Short, fun, punchy feedback in Cantonese (HK). If score is high, praise them! If low, roast them gently but encourage a retry.',
		),
});

export async function comparePoses(
	targetImageUser: File,
	attemptImageUser: File,
	apiKey: string,
) {
	const genAI = new GoogleGenAI({ apiKey });
	const targetBuffer = await targetImageUser.arrayBuffer();
	const attemptBuffer = await attemptImageUser.arrayBuffer();

	// @ts-ignore
	const jsonSchema = zodToJsonSchema(ResponseSchema) as Schema;

	const prompt = `You are a judge in a high-energy party game called "Pose Off!".
  
  Your task is to compare two images:
  1. The TARGET POSE (the goal).
  2. The ATTEMPT (the player's recreation).

  Analyze the similarity based on:
  - Limb angles and positioning (arms, legs).
  - Body orientation.
  - Facial expression (if visible/relevant).
  
  Be lenient but fair. This is a fun party game.
  `;

	const result = await genAI.models.generateContent({
		model: 'gemini-3-flash-preview',
		contents: [
			{
				role: 'user',
				parts: [
					{ text: prompt },
					{
						inlineData: {
							data: Buffer.from(targetBuffer).toString('base64'),
							mimeType: targetImageUser.type,
						},
					},
					{
						inlineData: {
							data: Buffer.from(attemptBuffer).toString('base64'),
							mimeType: attemptImageUser.type,
						},
					},
				],
			},
		],
		config: {
			responseMimeType: 'application/json',
			responseSchema: jsonSchema,
		},
	});

	const responseText = result.text;

	if (!responseText) {
		throw new Error('No response from AI');
	}

	return JSON.parse(responseText);
}

export async function comparePosesStream(
	targetImageUser: File,
	attemptImageUser: File,
	apiKey: string,
) {
	const genAI = new GoogleGenAI({ apiKey });
	const targetBuffer = await targetImageUser.arrayBuffer();
	const attemptBuffer = await attemptImageUser.arrayBuffer();

	// @ts-ignore
	const jsonSchema = zodToJsonSchema(ResponseSchema) as Schema;

	const prompt = `You are a judge in a high-energy party game called "Pose Off!".
  
  Your task is to compare two images:
  1. The TARGET POSE (the goal).
  2. The ATTEMPT (the player's recreation).

  Analyze the similarity based on:
  - Limb angles and positioning (arms, legs).
  - Body orientation.
  - Facial expression (if visible/relevant).
  
  Be lenient but fair. This is a fun party game.
  `;

	const result = await genAI.models.generateContentStream({
		model: 'gemini-3-flash-preview',
		contents: [
			{
				role: 'user',
				parts: [
					{ text: prompt },
					{
						inlineData: {
							data: Buffer.from(targetBuffer).toString('base64'),
							mimeType: targetImageUser.type,
						},
					},
					{
						inlineData: {
							data: Buffer.from(attemptBuffer).toString('base64'),
							mimeType: attemptImageUser.type,
						},
					},
				],
			},
		],
		config: {
			responseMimeType: 'application/json',
			responseSchema: jsonSchema,
		},
	});

	return result;
}
