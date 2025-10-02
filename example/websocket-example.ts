import BXO from "../src";

async function main() {
    const app = new BXO({ serve: { port: 3000 } });

    // HTTP routes
    app.get("/", (ctx) => {
        return ctx.text(`
<!DOCTYPE html>
<html>
<head>
    <title>BXO WebSocket Example</title>
</head>
<body>
    <h1>BXO WebSocket Example</h1>
    <div id="messages"></div>
    <input type="text" id="messageInput" placeholder="Type a message...">
    <button onclick="sendMessage()">Send</button>
    <button onclick="connect()">Connect</button>
    <button onclick="disconnect()">Disconnect</button>
    
    <script>
        let ws = null;
        
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
        `, 200, {
            "Content-Type": "text/html"
        });
    });

    // WebSocket route
    app.ws("/ws", {
        open(ws) {
            console.log("WebSocket connection opened");
            ws.send("Welcome to BXO WebSocket!");
        },
        
        message(ws, message) {
            console.log("Received message:", message);
            // Echo the message back
            ws.send(`Echo: ${message}`);
        },
        
        close(ws, code, reason) {
            console.log(`WebSocket connection closed: ${code} ${reason}`);
        },
        
        ping(ws, data) {
            console.log("Ping received:", data);
        },
        
        pong(ws, data) {
            console.log("Pong received:", data);
        }
    });

    // Another WebSocket route with parameters
    app.ws("/chat/:room", {
        open(ws) {
            console.log(`WebSocket connection opened for room: ${ws.data?.room || 'unknown'}`);
            ws.send(`Welcome to chat room: ${ws.data?.room || 'unknown'}`);
        },
        
        message(ws, message) {
            const room = ws.data?.room || 'unknown';
            console.log(`Message in room ${room}:`, message);
            ws.send(`[${room}] Echo: ${message}`);
        },
        
        close(ws, code, reason) {
            const room = ws.data?.room || 'unknown';
            console.log(`WebSocket connection closed for room ${room}: ${code} ${reason}`);
        }
    });

    app.start();
    console.log(`Server is running on http://localhost:${app.server?.port}`);
    console.log(`WebSocket available at ws://localhost:${app.server?.port}/ws`);
    console.log(`Chat WebSocket available at ws://localhost:${app.server?.port}/chat/:room`);
}

main().catch(console.error);
