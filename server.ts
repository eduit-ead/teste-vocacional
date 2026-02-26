import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import axios from "axios";

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
