import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const CATALOG_URL = Deno.env.get("CATALOG_SUPABASE_URL") ?? "https://vtlbndvcgajcoajhcnnx.supabase.co/rest/v1";
const CATALOG_KEY = Deno.env.get("CATALOG_SUPABASE_KEY") ?? "";

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

    const encodedCurso = encodeURIComponent(`ilike.${curso}`);
    const apiUrl = `${CATALOG_URL}/cursos_catalogo_ia?curso=${encodedCurso}&select=curso,raw_json&limit=1`;

    const response = await fetch(apiUrl, {
      headers: {
        apikey: CATALOG_KEY,
        Authorization: `Bearer ${CATALOG_KEY}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Erro ao consultar catálogo" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows = await response.json();

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ found: false }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const row = rows[0];
    const rawJson = typeof row.raw_json === "string"
      ? JSON.parse(row.raw_json)
      : row.raw_json;

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
