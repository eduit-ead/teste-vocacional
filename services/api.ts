const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface CourseInfo {
  curso: string;
  sobre_o_curso: string;
  grau: string;
  modalidade: string;
  faixa_salarial: { inicio: string; medio: string; especialista: string };
  carreiras_possiveis: string[];
  areas_de_atuacao: string[];
  mercado_de_trabalho: string[];
  perfil: string;
}

export async function fetchCourseInfo(courseName: string): Promise<CourseInfo | null> {
  const url = import.meta.env.PROD
    ? `${SUPABASE_URL}/functions/v1/course-catalog?curso=${encodeURIComponent(courseName)}`
    : `/api/catalog?curso=${encodeURIComponent(courseName)}`;

  const headers: Record<string, string> = {};
  if (import.meta.env.PROD) {
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
    headers['apikey'] = SUPABASE_ANON_KEY;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) return null;

  const json = await response.json();
  if (!json.found) return null;

  return json.data as CourseInfo;
}

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
