import BXO from "../src";

// Example configurations for different deployment scenarios

// 1. Development - Local only
export const developmentConfig = new BXO({
    serve: {
        hostname: "127.0.0.1",  // Only localhost
        port: 3000,
        development: true
    }
});

// 2. Local Network - Accessible from other devices on same network
export const localNetworkConfig = new BXO({
    serve: {
        hostname: "0.0.0.0",    // All interfaces
        port: 3000,
        development: true
    }
});

// 3. Production - External access with security
export const productionConfig = new BXO({
    serve: {
        hostname: "0.0.0.0",    // All interfaces
        port: 8080,
        development: false
    }
});

// 4. Docker Container - Internal network
export const dockerConfig = new BXO({
    serve: {
        hostname: "0.0.0.0",    // All interfaces (required for Docker)
        port: 3000,
        development: false
    }
});

// 5. Cloud Deployment (AWS, GCP, Azure)
export const cloudConfig = new BXO({
    serve: {
        hostname: "0.0.0.0",    // All interfaces
        port: process.env.PORT || 8080,  // Use environment port
        development: false
    }
});

// 6. Specific IP binding
export const specificIPConfig = new BXO({
    serve: {
        hostname: "192.168.1.100",  // Specific IP
        port: 3000
    }
});

// 7. Domain binding (if you have a specific domain)
export const domainConfig = new BXO({
    serve: {
        hostname: "api.yourdomain.com",  // Specific domain
        port: 80
    }
});

// Example usage function
async function runExample() {
    console.log("🚀 BXO Deployment Configuration Examples\n");
    
    // Choose which configuration to use
    const app = localNetworkConfig; // Change this to test different configs
    
    // Add some routes
    app.get("/", (ctx) => {
        return ctx.json({
            message: "BXO Server Running",
            hostname: app.server?.hostname || "default",
            port: app.server?.port,
            environment: process.env.NODE_ENV || "development",
            accessible: app.server?.hostname === "0.0.0.0" ? "External networks" : "Local only"
        });
    });
    
    app.get("/health", (ctx) => {
        return ctx.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            hostname: app.server?.hostname,
            port: app.server?.port
        });
    });
    
    // WebSocket example with hostname info
    app.ws("/ws", {
        open(ws) {
            const data = ws.data;
            console.log(`🔌 WebSocket connected from ${data.ip} to hostname: ${app.server?.hostname}`);
            ws.send(`Connected to server on ${app.server?.hostname}:${app.server?.port}`);
        },
        
        message(ws, message) {
            const data = ws.data;
            console.log(`💬 Message from ${data.ip}: ${message}`);
            ws.send(`Echo from ${app.server?.hostname}: ${message}`);
        }
    });
    
    app.start();
    
    console.log(`✅ Server started successfully!`);
    console.log(`📍 Hostname: ${app.server?.hostname}`);
    console.log(`🔌 Port: ${app.server?.port}`);
    console.log(`🌐 Access URLs:`);
    
    if (app.server?.hostname === "0.0.0.0") {
        console.log(`   • http://localhost:${app.server.port}`);
        console.log(`   • http://127.0.0.1:${app.server.port}`);
        console.log(`   • http://your-server-ip:${app.server.port}`);
        console.log(`   • http://your-domain.com:${app.server.port}`);
    } else if (app.server?.hostname === "127.0.0.1") {
        console.log(`   • http://localhost:${app.server.port}`);
        console.log(`   • http://127.0.0.1:${app.server.port}`);
    } else {
        console.log(`   • http://${app.server?.hostname}:${app.server?.port}`);
    }
    
    console.log(`\n📋 Configuration Guide:`);
    console.log(`   • Development: hostname: "127.0.0.1" (localhost only)`);
    console.log(`   • Local Network: hostname: "0.0.0.0" (all interfaces)`);
    console.log(`   • Production: hostname: "0.0.0.0" + reverse proxy`);
    console.log(`   • Docker: hostname: "0.0.0.0" (required for container networking)`);
    console.log(`   • Cloud: hostname: "0.0.0.0" + environment port`);
}

// Run the example
runExample().catch(console.error);
