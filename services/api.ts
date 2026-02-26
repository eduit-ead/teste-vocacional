const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function proxyWebhook(webhookPath: string, payload: Record<string, unknown>) {
  let url: string;
  let headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (import.meta.env.PROD) {
    url = `${SUPABASE_URL}/functions/v1/n8n-proxy/${webhookPath}`;
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
  } else {
    url = `/api/proxy/${webhookPath}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}
