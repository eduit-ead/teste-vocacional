import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const CATALOG_URL = Deno.env.get("CATALOG_SUPABASE_URL") ?? "https://vtlbndvcgajcoajhcnnx.supabase.co/rest/v1";
const CATALOG_KEY = Deno.env.get("CATALOG_SUPABASE_KEY") ?? "";

const STOPWORDS = new Set(["de", "da", "do", "das", "dos", "e", "em", "a", "o", "para", "com", "no", "na", "nos", "nas", "um", "uma"]);

async function queryByPattern(pattern: string) {
  const url = `${CATALOG_URL}/cursos_catalogo_ia?curso=${encodeURIComponent(`ilike.${pattern}`)}&select=curso,raw_json&limit=1`;
  const res = await fetch(url, {
    headers: { apikey: CATALOG_KEY, Authorization: `Bearer ${CATALOG_KEY}`, Accept: "application/json" },
  });
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.length > 0 ? rows[0] : null;
}

function buildKeywordPattern(curso: string): string {
  const words = curso
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w.toLowerCase()));
  return `*${words.join("*")}*`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(req.url);
    const curso = url.searchParams.get("curso");

    if (!curso) {
      return new Response(JSON.stringify({ error: "Parâmetro 'curso' obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Busca exata (case-insensitive)
    let row = await queryByPattern(curso);

    // 2. Busca com wildcards nas palavras significativas
    if (!row) {
      const keywordPattern = buildKeywordPattern(curso);
      row = await queryByPattern(keywordPattern);
    }

    // 3. Busca pelas 2 primeiras palavras significativas
    if (!row) {
      const words = curso.split(/\s+/).filter(w => w.length > 2 && !STOPWORDS.has(w.toLowerCase()));
      if (words.length >= 2) {
        row = await queryByPattern(`*${words[0]}*${words[1]}*`);
      }
    }

    if (!row) {
      return new Response(JSON.stringify({ found: false }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawJson = typeof row.raw_json === "string" ? JSON.parse(row.raw_json) : row.raw_json;

    return new Response(JSON.stringify({ found: true, data: rawJson }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
