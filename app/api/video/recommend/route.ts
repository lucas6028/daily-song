import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const seed_artists = searchParams.get('seed_artists')?.split(',') || ['Taylor Swift'];
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const input = JSON.stringify({
    seed_artists,
    limit,
  });
  const systemContent = 'You are a music recommendation engine.';
  const userContent =
    "I will provide you with a list of artist names and a limit for the number of tracks to recommend *per artist*. Your task is to return a JSON array of recommended tracks that are influenced by the provided artists, but are not strictly limited to them. You should generate a list of diverse tracks that you believe someone who enjoys the specified artists might also like. The recommendations should cover a variety of genres and styles.\n\nEach track object in the JSON array should conform to the following structure and include the following information:\n\n*   `artist_name`: (String) The name of the artist.\n*   `title`: (String) The title of the track.\n*   `youtube_embed_id`: (String) The YouTube video ID that can be used to embed the track's video.\n\nThe number of tracks returned *per artist* should match the provided limit.\n\n**Input:**\n\nI will provide input in the following JSON input:\n\n" +
    input +
    '\n\n**Output:**\n\nYou should return a JSON array of recommended tracks that match the specified criteria.\n\n';

  const openai = new OpenAI({ apiKey: process.env.SECRET_OPENAI_API_KEY || '', timeout: 10000 });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemContent },
        {
          role: 'user',
          content: userContent,
        },
      ],
      store: true,
    });
    console.log(completion.choices[0].message);
    const response = completion.choices[0].message?.content;
    if (!response) {
      throw new Error('Response content is null');
    }
    const data = JSON.parse(response.slice(7, -4));
    console.log(data);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Error while get recommend videos: ' + err);
    return NextResponse.json({ message: err, status: 401 });
  }
}
