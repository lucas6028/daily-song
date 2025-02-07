import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const mbid = searchParams.get('mbid') || '650e7db6-b795-4eb5-a702-5ea2fc46c848';

  const url = 'https://musicbrainz.org/ws/2/artist/' + mbid + '?inc=url-rels&fmt=json';
  // const url = 'https://musicbrainz.org/ws/2/artist/381086ea-f511-4aba-bdf9-71c753dc5077?inc=url-rels&fmt=json';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'daily-song',
      },
    });
    const data = await response.json();
    const relations = data.relations;
    for (let i = 0; i < relations.length; i++) {
      if (relations[i].type === 'image') {
        let image_url = relations[i].url.resource;
        if (image_url.startsWith('https://commons.wikimedia.org/wiki/File:')) {
          const filename = image_url.substring(image_url.lastIndexOf('/') + 1);
          image_url = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + filename;
        }
        // console.log(image_url);
      }
    }

    return NextResponse.json({ data: data.relations, status: 200 });
  } catch (err) {
    console.error('Error while get images of artist with mbid: ' + err);
    return NextResponse.json({ message: err, status: 401 });
  }
}
