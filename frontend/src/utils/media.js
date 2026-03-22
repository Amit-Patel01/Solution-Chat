export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  const safePath = path.startsWith('/') ? path : `/${path}`;
  const safeBase = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
  
  return `${safeBase}${safePath}`;
};
