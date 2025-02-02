import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const seed_artists = searchParams.get('seed_artists')?.split(',') || ['Taylor Swift'];
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const genAI = new GoogleGenerativeAI(process.env.SECRET_GEMINI_API_KEY || '');

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  };

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(
      "You are a music recommendation engine. I will provide you with a list of artist names and a limit for the number of tracks to recommend *per artist*. Your task is to return a JSON array of recommended tracks that are influenced by the provided artists, but are not strictly limited to them. You should generate a list of diverse tracks that you believe someone who enjoys the specified artists might also like. The recommendations should cover a variety of genres and styles.\n\nEach track object in the JSON array should conform to the following structure and include the following information:\n\n*   `artist_name`: (String) The name of the artist.\n*   `title`: (String) The title of the track.\n*   `track_uri`: (String) **A valid and publicly accessible URL that directly points to an image resource (JPG, PNG, etc.). This URL should be usable within an HTML `<img>` tag's `src` attribute. Ensure that the URL is correct and does not return a 404 error.** *   `img_url`: (String) The URL for an image representing the track or its album.\n\nThe number of tracks returned *per artist* should match the provided limit.\n\n**Input **:\nartists=" +
        seed_artists +
        ',\nlimit=' +
        limit +
        '\n. **Output Format**:\nYour output should be a JSON array of tracks, adhering to the structure described above.\n: '
    );
    const data = JSON.parse(result.response.text().slice(7, -4));
    console.log(data);

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error while get recommend tracks: ' + err);
    return NextResponse.json({ message: err, status: 401 });
  }
}
