export const getApiBaseUrl = () => {
  const configuredUrl = (import.meta.env.VITE_API_URL || '').trim();

  if (configuredUrl) {
    const normalized = configuredUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
    return `${normalized}/api/v1`;
  }

  return '/api/v1';
};
