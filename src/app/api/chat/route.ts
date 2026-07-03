import { groq } from '@ai-sdk/groq';
import { streamText, convertToCoreMessages, UIMessage } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'), // nom du modèle, jamais affiché à l'utilisateur
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
