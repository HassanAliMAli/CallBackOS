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
      const payloadText = await request.text();
      let normalizedPayload = payloadText;
      
      try {
         const data = JSON.parse(payloadText);
         // Build normalized chunk
         const chunk = {
           type: 'transcript_chunk',
           source: (data.role === 'user' || data.source === 'user') ? 'user' : 'agent',
           text: data.message || data.text || data.transcript || ''
         };
         // Only broadcast if there's actual text
         if (chunk.text) {
           normalizedPayload = JSON.stringify(chunk);
         }
      } catch (e) {
         console.error("Failed to parse webhook chunk for DO broadcast", e);
      }

      // Broadcast to all connected clients
      this.ctx.getWebSockets().forEach(ws => {
        ws.send(normalizedPayload);
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
