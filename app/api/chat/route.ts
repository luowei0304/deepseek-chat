import { deepSeek } from '@ai-sdk/deepseek';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const client = new deepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY!,
  });

  const stream = await client.chat.completions.create({
    model: "deepseek-chat",
    messages,
    stream: true
  });

  // 创建可读流
  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(encoder.encode(chunk.choices[0]?.delta?.content || ""));
      }
      controller.close();
    }
  });

  return new Response(readableStream);
}