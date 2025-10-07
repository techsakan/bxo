import BXO from "../src";

async function main() {
    // Configure hostname for external access
    const app = new BXO({ 
        serve: { 
            hostname: "0.0.0.0",  // Listen on all interfaces for external access
            port: 3000 
        } 
    });

    // HTTP routes
    app.get("/", (ctx) => {
        return ctx.text(`
<!DOCTYPE html>
<html>
<head>
    <title>BXO WebSocket Example with Client ID & Cookies</title>
</head>
<body>
    <h1>BXO WebSocket Example with Client ID, Cookies, Search Params & Auth</h1>
    <div id="messages"></div>
    <input type="text" id="messageInput" placeholder="Type a message...">
    <button onclick="sendMessage()">Send</button>
    <button onclick="connect()">Connect</button>
    <button onclick="connectWithParams()">Connect with Search Params</button>
    <button onclick="connectWithAuth()">Connect with Auth</button>
    <button onclick="disconnect()">Disconnect</button>
    <button onclick="setCookie()">Set Test Cookie</button>
    
    <script>
        let ws = null;
        
        function setCookie() {
            document.cookie = "testCookie=hello_from_client; path=/";
            document.cookie = "sessionId=abc123; path=/";
            addMessage('Cookies set! Refresh and reconnect to see them in server logs.');
        }
        
        function connect() {
            ws = new WebSocket('ws://localhost:3000/ws');
            
            ws.onopen = function() {
                addMessage('Connected to WebSocket');
            };
            
            ws.onmessage = function(event) {
                addMessage('Received: ' + event.data);
            };
            
            ws.onclose = function() {
                addMessage('Disconnected from WebSocket');
            };
            
            ws.onerror = function(error) {
                addMessage('Error: ' + error);
            };
        }
        
        function connectWithParams() {
            ws = new WebSocket('ws://localhost:3000/ws?room=test&user=john&theme=dark');
            
            ws.onopen = function() {
                addMessage('Connected to WebSocket with search params');
            };
            
            ws.onmessage = function(event) {
                addMessage('Received: ' + event.data);
            };
            
            ws.onclose = function() {
                addMessage('Disconnected from WebSocket');
            };
            
            ws.onerror = function(error) {
                addMessage('Error: ' + error);
            };
        }
        
        function connectWithAuth() {
            // Note: Browser WebSocket API doesn't support custom headers directly
            // This would typically be done server-side or with a library
            ws = new WebSocket('ws://localhost:3000/ws?token=abc123&auth=Bearer%20token123');
            
            ws.onopen = function() {
                addMessage('Connected to WebSocket with auth params');
            };
            
            ws.onmessage = function(event) {
                addMessage('Received: ' + event.data);
            };
            
            ws.onclose = function() {
                addMessage('Disconnected from WebSocket');
            };
            
            ws.onerror = function(error) {
                addMessage('Error: ' + error);
            };
        }
        
        function disconnect() {
            if (ws) {
                ws.close();
                ws = null;
            }
        }
        
        function sendMessage() {
            const input = document.getElementById('messageInput');
            if (ws && input.value) {
                ws.send(input.value);
                addMessage('Sent: ' + input.value);
                input.value = '';
            }
        }
        
        function addMessage(message) {
            const messages = document.getElementById('messages');
            const div = document.createElement('div');
            div.textContent = new Date().toLocaleTimeString() + ': ' + message;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }
        
        // Allow Enter key to send message
        document.getElementById('messageInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
        `, 200);
    });

    // WebSocket route with enhanced client identification and typed interface
    app.ws("/ws", {
        open(ws) {
            const data = ws.data; // Now fully typed with WebSocketData interface
            console.log("🔌 WebSocket connection opened:");
            console.log(`  🆔 Client ID: ${data.id}`);
            console.log(`  🔗 Connection ID: ${data.connectionId}`);
            console.log(`  🌐 Client IP: ${data.ip}`);
            console.log(`  🖥️  User Agent: ${data.userAgent}`);
            console.log(`  🎯 Origin: ${data.origin}`);
            console.log(`  🏠 Host: ${data.host}`);
            console.log(`  📍 Path: ${data.path}`);
            console.log(`  🍪 Cookies:`, data.cookies);
            console.log(`  🔍 Search Params:`, data.searchParams);
            console.log(`  🔐 Authorization:`, data.authorization || 'None');
            
            // Use direct property access
            console.log(`  🍪 Session Cookie:`, data.cookies.sessionId);
            console.log(`  🔍 Room Param:`, data.searchParams.room);
            console.log(`  👤 Username:`, data.searchParams.user || data.searchParams.username);
            console.log(`  🏠 Room:`, data.searchParams.room);
            console.log(`  🔐 Has Auth:`, !!(data.authorization || data.searchParams.token || data.searchParams.auth));
            console.log(`  🔑 Auth Type:`, data.authorization ? (data.authorization.toLowerCase().startsWith('bearer ') ? 'bearer' : 'basic') : 'none');
            console.log(`  🎫 Token:`, data.searchParams.token || data.searchParams.auth);
            
            // Check for authentication using direct property access
            if (data.authorization || data.searchParams.token || data.searchParams.auth) {
                console.log(`  ✅ Authenticated user detected`);
                ws.send(`Welcome authenticated user! Your WebSocket ID is: ${data.id}`);
            } else {
                ws.send(`Welcome! Your WebSocket ID is: ${data.id}`);
            }
        },
        
        message(ws, message) {
            const data = ws.data; // Fully typed WebSocketData
            console.log(`💬 Message from ${data.id} (${data.ip}):`, message);
            console.log(`   🍪 Client cookies:`, data.cookies);
            console.log(`   🔍 Search params:`, data.searchParams);
            console.log(`   🔐 Auth:`, data.authorization || 'None');
            
            // Use direct property access
            const username = data.searchParams.user || data.searchParams.username || 'Anonymous';
            const room = data.searchParams.room;
            const sessionId = data.cookies.sessionId;
            
            console.log(`   👤 Username: ${username}`);
            console.log(`   🏠 Room: ${room || 'None'}`);
            console.log(`   🍪 Session: ${sessionId || 'None'}`);
            
            // Echo the message back with client ID and context
            let response = `[${data.id}] Echo: ${message}`;
            
            // Add context using direct property access
            if (room) {
                response += ` (Room: ${room})`;
            }
            if (username && username !== 'Anonymous') {
                response += ` (User: ${username})`;
            }
            
            ws.send(response);
        },
        
        close(ws, code, reason) {
            const data = ws.data;
            console.log(`❌ WebSocket connection closed for ${data.id}: ${code} ${reason}`);
        },
        
        ping(ws, data) {
            const wsData = ws.data;
            console.log(`🏓 Ping received from ${wsData.id}:`, data);
        },
        
        pong(ws, data) {
            const wsData = ws.data;
            console.log(`🏓 Pong received from ${wsData.id}:`, data);
        }
    });

    // Chat room WebSocket with typed client identification
    app.ws("/chat/:room", {
        open(ws) {
            const data = ws.data; // Fully typed WebSocketData
            const room = data.path.split('/').pop() || 'unknown';
            console.log(`🏠 Chat room connection opened for room: ${room}`);
            console.log(`  🆔 Client: ${data.id} (${data.ip})`);
            console.log(`  🍪 Cookies:`, data.cookies);
            console.log(`  🔍 Search Params:`, data.searchParams);
            console.log(`  🔐 Authorization:`, data.authorization || 'None');
            
            // Use direct property access
            const username = data.searchParams.user || data.searchParams.username || 'Anonymous';
            const sessionId = data.cookies.sessionId;
            const hasAuth = !!(data.authorization || data.searchParams.token || data.searchParams.auth);
            
            console.log(`  👤 Username: ${username}`);
            console.log(`  🍪 Session: ${sessionId || 'None'}`);
            console.log(`  🔐 Authenticated: ${hasAuth}`);
            
            ws.send(`Welcome to chat room: ${room}! Your ID is: ${data.id}, Username: ${username}`);
        },
        
        message(ws, message) {
            const data = ws.data; // Fully typed WebSocketData
            const room = data.path.split('/').pop() || 'unknown';
            const username = data.searchParams.user || data.searchParams.username || 'Anonymous';
            const sessionId = data.cookies.sessionId;
            
            console.log(`💬 Message in room ${room} from ${data.id} (${username}):`, message);
            console.log(`   🍪 Client cookies:`, data.cookies);
            console.log(`   🔍 Search params:`, data.searchParams);
            console.log(`   🍪 Session: ${sessionId || 'None'}`);
            
            ws.send(`[${room}] [${username}] [${data.id}] Echo: ${message}`);
        },
        
        close(ws, code, reason) {
            const data = ws.data;
            const room = data.path.split('/').pop() || 'unknown';
            console.log(`❌ Chat room connection closed for room ${room} (${data.id}): ${code} ${reason}`);
        }
    });

    app.start();
    console.log(`🚀 Server is running:`);
    console.log(`📍 Hostname: ${app.server?.hostname || 'default'}`);
    console.log(`🔌 Port: ${app.server?.port}`);
    console.log(`🌐 HTTP: http://localhost:${app.server?.port}`);
    console.log(`🔌 WebSocket: ws://localhost:${app.server?.port}/ws`);
    console.log(`💬 Chat WebSocket: ws://localhost:${app.server?.port}/chat/:room`);
    
    if (app.server?.hostname === "0.0.0.0") {
        console.log(`\n🌍 External Access Available:`);
        console.log(`   • http://your-server-ip:${app.server.port}`);
        console.log(`   • http://your-domain.com:${app.server.port}`);
        console.log(`   • ws://your-server-ip:${app.server.port}/ws`);
    }
    console.log(`\n📝 Features demonstrated:`);
    console.log(`   • ws.data.id - Short, unique client identifier`);
    console.log(`   • ws.data.connectionId - Detailed connection ID`);
    console.log(`   • ws.data.cookies - Parsed cookies from handshake`);
    console.log(`   • ws.data.searchParams - Query parameters from URL`);
    console.log(`   • ws.data.authorization - Authorization header`);
    console.log(`   • Client IP, User Agent, Origin tracking`);
    console.log(`\n🔧 Direct Property Access:`);
    console.log(`   • ws.data.cookies.name - Get specific cookie`);
    console.log(`   • ws.data.searchParams.name - Get specific search param`);
    console.log(`   • ws.data.authorization - Check authorization header`);
    console.log(`   • ws.data.id - Short client identifier`);
    console.log(`   • ws.data.connectionId - Detailed connection ID`);
    console.log(`\n🧪 Test URLs:`);
    console.log(`   • Basic: ws://localhost:${app.server?.port}/ws`);
    console.log(`   • With params: ws://localhost:${app.server?.port}/ws?room=test&user=john&theme=dark`);
    console.log(`   • With auth: ws://localhost:${app.server?.port}/ws?token=abc123&auth=Bearer%20token123`);
    console.log(`   • Chat room: ws://localhost:${app.server?.port}/chat/general?user=alice&theme=light`);
}

main().catch(console.error);