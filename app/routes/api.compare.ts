import { comparePosesStream } from '../lib/gemini.server';

// @ts-ignore
export async function action({ request, context }) {
	const body = await request.json();
	const { targetImage, attemptImage } = body;

	// @ts-ignore
	const apiKey = context.cloudflare.env.GEMINI_API_KEY;

	if (!apiKey) {
		return new Response('API Key not configured', { status: 500 });
	}

	if (!targetImage || !attemptImage) {
		return new Response('Images required', { status: 400 });
	}

	return comparePosesStream(
		targetImage.data,
		targetImage.type,
		attemptImage.data,
		attemptImage.type,
		apiKey,
	);
}
