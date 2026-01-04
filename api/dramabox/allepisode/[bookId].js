export default async function handler(request, response) {
  const { bookId } = request.query;
  const accept = request.headers['accept'] || '';

  // 1. If Browser (navigate) -> Redirect to UI (Watch page seems appropriate for "all episodes")
  // Or keep it to Detail page if consistent. Let's redirect to Detail page as the main entry point.
  if (accept.includes('text/html')) {
    return response.redirect(307, `/detail/${bookId}`);
  }

  // 2. If API Fetch -> Proxy to Upstream
  if (!bookId) {
    return response.status(400).json({ error: 'Missing bookId' });
  }

  try {
    const upstreamUrl = `https://api.sansekai.my.id/api/dramabox/allepisode?bookId=${bookId}`;
    const apiRes = await fetch(upstreamUrl);
    
    if (!apiRes.ok) {
      return response.status(apiRes.status).json({ error: 'Upstream Error' });
    }

    const data = await apiRes.json();
    return response.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
