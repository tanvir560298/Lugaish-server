export function getYouTubeId(value = '') {
  const input = String(value).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;

  try {
    const url = new URL(input);
    const hostname = url.hostname.replace(/^(www\.|m\.)/, '');
    let videoId = '';

    if (hostname === 'youtu.be') {
      videoId = url.pathname.split('/').filter(Boolean)[0] || '';
    } else if (hostname === 'youtube.com' || hostname === 'youtube-nocookie.com') {
      videoId = url.searchParams.get('v') || '';

      if (!videoId) {
        const [type, id] = url.pathname.split('/').filter(Boolean);
        if (['embed', 'shorts', 'live'].includes(type)) videoId = id || '';
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null;
  } catch {
    return null;
  }
}
