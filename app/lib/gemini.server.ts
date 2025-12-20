import { Buffer } from 'node:buffer';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function comparePoses(
	targetImageUser: File,
	attemptImageUser: File,
	apiKey: string,
) {
	const genAI = new GoogleGenerativeAI(apiKey);
	const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

	const targetBuffer = await targetImageUser.arrayBuffer();
	const attemptBuffer = await attemptImageUser.arrayBuffer();

	const prompt = `You are a judge in a high-energy party game called "Pose Off!".
  
  Your task is to compare two images:
  1. The TARGET POSE (the goal).
  2. The ATTEMPT (the player's recreation).

  Analyze the similarity based on:
  - Limb angles and positioning (arms, legs).
  - Body orientation.
  - Facial expression (if visible/relevant).
  
  Be lenient but fair. This is a fun party game.
  
  Return ONLY a valid JSON object with the following structure:
  {
    "score": <number between 0 and 100>,
    "feedback": "<short, fun, punchy feedback string. If score is high, praise them! If low, roast them gently but encourage a retry.>"
  }
  `;

	const result = await model.generateContent([
		prompt,
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
	]);

	const responseText = result.response.text();

	try {
		// Clean up markdown block if present
		const cleanedText = responseText
			.replace(/```json/g, '')
			.replace(/```/g, '')
			.trim();
		return JSON.parse(cleanedText);
	} catch (e) {
		console.error('Failed to parse Gemini response', responseText, e);
		return { score: 0, feedback: 'Oops! The AI got confused. Try again!' };
	}
}
