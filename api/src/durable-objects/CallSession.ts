import { DurableObject } from "cloudflare:workers";

export class CallSession extends DurableObject {
  async fetch(request: Request) {
    const url = new URL(request.url);
    
    // WebSocket Upgrade for Real-time streaming
    if (request.headers.get("Upgrade") === "websocket") {
      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);
      
      this.ctx.acceptWebSocket(server);
      return new Response(null, { status: 101, webSocket: client });
    }

    // Accept webhook chunks from Elevenlabs HTTP requests
    if (request.method === "POST" && url.pathname.endsWith("/chunk")) {
      const payload = await request.text();
      // Broadcast to all connected clients
      this.ctx.getWebSockets().forEach(ws => {
        ws.send(payload);
      });
      return new Response(JSON.stringify({ status: "chunk_received" }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not found", { status: 404 });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    // We only broadcast outbound, client usually doesn't send transcript chunks
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
    ws.close(code, reason);
  }
}
