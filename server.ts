import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import { readFileSync } from "fs";

try {
  const env = readFileSync(".env", "utf-8");
  for (const line of env.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch {}

const CATALOG_URL = process.env.CATALOG_SUPABASE_URL ?? "https://vtlbndvcgajcoajhcnnx.supabase.co/rest/v1";
const CATALOG_KEY = process.env.CATALOG_SUPABASE_KEY ?? "";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Proxy for n8n webhooks to avoid CORS "Network Error"
  app.post("/api/proxy/:path", async (req, res) => {
    const { path } = req.params;
    const targetUrl = `https://n8n-new-n8n.ca31ey.easypanel.host/webhook/${path}`;
    
    console.log(`Proxying request to: ${targetUrl}`);
    
    try {
      const response = await axios.post(targetUrl, req.body, {
        timeout: 60000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      res.status(response.status).json(response.data);
    } catch (error: any) {
      const status = error.response?.status || 500;
      const data = error.response?.data || { message: error.message };
      
      console.error(`Proxy error for ${path} [${status}]:`, JSON.stringify(data));
      
      res.status(status).json({
        error: "Failed to proxy request",
        targetStatus: status,
        targetData: data
      });
    }
  });

  const STOPWORDS = new Set(["de", "da", "do", "das", "dos", "e", "em", "a", "o", "para", "com", "no", "na", "nos", "nas", "um", "uma"]);

  async function queryByPattern(pattern: string) {
    const url = `${CATALOG_URL}/cursos_catalogo_ia?curso=ilike.${encodeURIComponent(pattern)}&select=curso,raw_json&limit=1`;
    const r = await axios.get(url, { headers: { apikey: CATALOG_KEY, Authorization: `Bearer ${CATALOG_KEY}` } });
    return r.data?.length > 0 ? r.data[0] : null;
  }

  function buildKeywordPattern(curso: string): string {
    const words = curso.split(/\s+/).filter((w: string) => w.length > 2 && !STOPWORDS.has(w.toLowerCase()));
    return `*${words.join("*")}*`;
  }

  // Proxy for course catalog (keeps secret key server-side)
  app.get("/api/catalog", async (req, res) => {
    const curso = req.query.curso as string;
    if (!curso) { res.status(400).json({ error: "Parâmetro 'curso' obrigatório" }); return; }

    try {
      // 1. Busca exata
      let row = await queryByPattern(curso);

      // 2. Palavras significativas com wildcard
      if (!row) row = await queryByPattern(buildKeywordPattern(curso));

      // 3. Primeiras 2 palavras significativas
      if (!row) {
        const words = curso.split(/\s+/).filter((w: string) => w.length > 2 && !STOPWORDS.has(w.toLowerCase()));
        if (words.length >= 2) row = await queryByPattern(`*${words[0]}*${words[1]}*`);
      }

      if (!row) { res.json({ found: false }); return; }

      const rj = typeof row.raw_json === "string" ? JSON.parse(row.raw_json) : row.raw_json;
      res.json({ found: true, data: rj });
    } catch (error: any) {
      console.error("Catalog proxy error:", error.message);
      res.status(500).json({ found: false, error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
