import { comparePosesStream } from '../lib/gemini.server';

// @ts-ignore
export async function action({ request, context }) {
	const formData = await request.formData();
	const targetImage = formData.get('targetImage') as File;
	const attemptImage = formData.get('attemptImage') as File;

	// @ts-ignore
	const apiKey = context.cloudflare.env.GEMINI_API_KEY;

	if (!apiKey) {
		return new Response('API Key not configured', { status: 500 });
	}

	if (!targetImage || !attemptImage) {
		return new Response('Images required', { status: 400 });
	}

	const result = await comparePosesStream(targetImage, attemptImage, apiKey);

	const stream = new ReadableStream({
		async start(controller) {
			for await (const chunk of result) {
				const chunkText = chunk.text || '';
				controller.enqueue(new TextEncoder().encode(chunkText));
			}
			controller.close();
		},
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/plain',
			'Transfer-Encoding': 'chunked',
			'X-Content-Type-Options': 'nosniff',
		},
	});
}
