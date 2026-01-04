export default async function handler(request, response) {
  const { bookId } = request.query;
  const accept = request.headers['accept'] || '';

  // 1. If Browser (navigate) -> Redirect to UI
  if (accept.includes('text/html')) {
    // 307 Temporary Redirect preserves method, but for simple GET 302/307 is fine.
    // Redirect to the frontend route: /detail/:bookId
    return response.redirect(307, `/detail/${bookId}`);
  }

  // 2. If API Fetch -> Proxy to Upstream
  // Upstream: https://api.sansekai.my.id/api/dramabox/detail?bookId=...
  if (!bookId) {
    return response.status(400).json({ error: 'Missing bookId' });
  }

  try {
    const upstreamUrl = `https://api.sansekai.my.id/api/dramabox/detail?bookId=${bookId}`;
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
