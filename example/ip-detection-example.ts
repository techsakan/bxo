import BXO from "../src";

async function main() {
    const app = new BXO({ serve: { port: 3000, hostname: '0.0.0.0' } });

    // Enhanced IP detection function
    function getClientIP(req: Request): string {
        // Check proxy headers first
        const forwardedFor = req.headers.get("x-forwarded-for");
        const realIP = req.headers.get("x-real-ip");
        const clientIP = req.headers.get("x-client-ip");
        const cfConnectingIP = req.headers.get("cf-connecting-ip"); // Cloudflare

        if (forwardedFor) {
            // X-Forwarded-For can contain multiple IPs: "client, proxy1, proxy2"
            // The first IP is usually the original client
            return forwardedFor.split(',')[0].trim();
        }

        if (realIP) return realIP;
        if (clientIP) return clientIP;
        if (cfConnectingIP) return cfConnectingIP;

        // If no proxy headers, try to get from connection
        // Note: This is a workaround since Bun doesn't expose connection IP directly
        // In production, you should always use a reverse proxy that sets proper headers

        // For localhost development, return localhost
        const host = req.headers.get("host");
        if (host?.includes("localhost") || host?.includes("127.0.0.1")) {
            return "127.0.0.1";
        }

        return "unknown";
    }

    // HTTP route with enhanced IP detection
    app.get("/api/ip", (ctx) => {
        const ip = getClientIP(ctx.request);

        return ctx.json({
            ip: ip,
            headers: {
                "x-forwarded-for": ctx.headers["x-forwarded-for"],
                "x-real-ip": ctx.headers["x-real-ip"],
                "x-client-ip": ctx.headers["x-client-ip"],
                "cf-connecting-ip": ctx.headers["cf-connecting-ip"],
                "host": ctx.headers["host"]
            },
            allHeaders: ctx.headers,
            message: ip === "unknown" ?
                "IP detection failed. In production, use a reverse proxy (nginx, Cloudflare, etc.) that sets X-Forwarded-For headers." :
                "IP detected successfully!"
        });
    });

    // WebSocket route with enhanced IP detection
    app.ws("/ws", {
        open(ws) {
            // For WebSocket, we need to get IP from the original request
            // This is a workaround since BXO's WebSocket data might show "unknown"
            const ip = ws.data.ip !== "unknown" ? ws.data.ip : "127.0.0.1";

            console.log(`WebSocket client connected from IP: ${ip}`);
            ws.send(`Hello! Your IP is: ${ip}`);
        },
        message(ws, message) {
            const ip = ws.data.ip !== "unknown" ? ws.data.ip : "127.0.0.1";
            console.log(`Message from ${ip}: ${message}`);
            ws.send(`Echo: ${message} (from IP: ${ip})`);
        }
    });

    // Debug route to see all headers
    app.get("/debug", (ctx) => {
        return ctx.json({
            message: "Debug information",
            headers: ctx.headers,
            cookies: ctx.cookies,
            userAgent: ctx.headers["user-agent"]
        });
    });

    // Home page with test interface
    app.get("/", (ctx) => {
        return ctx.html(`
<!DOCTYPE html>
<html>
<head>
    <title>BXO IP Detection Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        button { padding: 10px 20px; margin: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .result { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px; }
        pre { background: #e9ecef; padding: 10px; border-radius: 3px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>BXO IP Detection Test</h1>
    
    <div>
        <button onclick="checkIP()">Check My IP</button>
        <button onclick="checkDebug()">Debug Headers</button>
        <button onclick="connectWebSocket()">Connect WebSocket</button>
    </div>
    
    <div id="result" class="result" style="display: none;">
        <h3>Result:</h3>
        <pre id="resultContent"></pre>
    </div>
    
    <div id="wsMessages" class="result" style="display: none;">
        <h3>WebSocket Messages:</h3>
        <div id="wsContent"></div>
    </div>
    
    <script>
        let ws = null;
        
        async function checkIP() {
            try {
                const res = await fetch('/api/ip');
                const data = await res.json();
                showResult(data);
            } catch (error) {
                showResult({ error: error.message });
            }
        }
        
        async function checkDebug() {
            try {
                const res = await fetch('/debug');
                const data = await res.json();
                showResult(data);
            } catch (error) {
                showResult({ error: error.message });
            }
        }
        
        function connectWebSocket() {
            if (ws) {
                ws.close();
            }
            
            ws = new WebSocket('ws://localhost:3000/ws');
            
            ws.onopen = function() {
                addWSMessage('Connected to WebSocket');
            };
            
            ws.onmessage = function(event) {
                addWSMessage('Received: ' + event.data);
            };
            
            ws.onclose = function() {
                addWSMessage('Disconnected from WebSocket');
            };
            
            ws.onerror = function(error) {
                addWSMessage('Error: ' + error);
            };
        }
        
        function showResult(data) {
            document.getElementById('result').style.display = 'block';
            document.getElementById('resultContent').textContent = JSON.stringify(data, null, 2);
        }
        
        function addWSMessage(message) {
            document.getElementById('wsMessages').style.display = 'block';
            const div = document.createElement('div');
            div.textContent = new Date().toLocaleTimeString() + ': ' + message;
            document.getElementById('wsContent').appendChild(div);
        }
    </script>
</body>
</html>
        `);
    });

    console.log("🚀 BXO IP Detection Example");
    console.log("📡 Server running on http://localhost:3000");
    console.log("🔍 Visit http://localhost:3000 to test IP detection");
    console.log("\n💡 Tips for getting real IP addresses:");
    console.log("1. Use a reverse proxy (nginx, Apache) that sets X-Forwarded-For headers");
    console.log("2. Deploy behind Cloudflare (sets CF-Connecting-IP header)");
    console.log("3. Use AWS ALB/ELB (sets X-Forwarded-For header)");
    console.log("4. For local development, IP will show as 127.0.0.1 or unknown");

    app.start();
}

main().catch(console.error);
