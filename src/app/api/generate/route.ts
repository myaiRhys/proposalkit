import Anthropic from '@anthropic-ai/sdk'
import { buildPrompt } from '@/lib/prompts'
import { ProposalBrief, BrandSettings } from '@/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { brief, settings } = (await req.json()) as {
      brief: ProposalBrief
      settings: BrandSettings
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const prompt = buildPrompt(brief, settings)

    const stream = client.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })

    // Convert to readable stream for the client
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Generate error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate proposal' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
