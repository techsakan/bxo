import BXO from "../src";

async function main() {
    console.log("🌐 BXO Hostname Configuration Examples\n");

    // Example 1: Serve on all interfaces (0.0.0.0) - accessible from external networks
    console.log("1. Serving on all interfaces (0.0.0.0) - accessible from external networks");
    const app1 = new BXO({
        serve: {
            hostname: "0.0.0.0",  // Listen on all network interfaces
            port: 3000
        }
    });

    app1.get("/", (ctx) => {
        return ctx.json({
            message: "Hello from BXO!",
            hostname: "0.0.0.0",
            accessible: "From any network interface",
            examples: [
                "http://localhost:3000",
                "http://127.0.0.1:3000", 
                "http://your-server-ip:3000",
                "http://your-domain.com:3000"
            ]
        });
    });

    // Example 2: Serve on specific hostname/IP
    console.log("2. Serving on specific hostname/IP");
    const app2 = new BXO({
        serve: {
            hostname: "127.0.0.1",  // Only localhost
            port: 3001
        }
    });

    app2.get("/", (ctx) => {
        return ctx.json({
            message: "Hello from BXO!",
            hostname: "127.0.0.1",
            accessible: "Only from localhost",
            examples: [
                "http://localhost:3001",
                "http://127.0.0.1:3001"
            ]
        });
    });

    // Example 3: Production configuration with external access
    console.log("3. Production configuration with external access");
    const app3 = new BXO({
        serve: {
            hostname: "0.0.0.0",  // Listen on all interfaces
            port: 8080,
            // Additional production options
            development: false,
            // You can add more Bun.serve options here
        }
    });

    app3.get("/", (ctx) => {
        return ctx.json({
            message: "Production BXO Server",
            hostname: "0.0.0.0",
            port: 8080,
            accessible: "From external networks",
            deployment: "Production ready"
        });
    });

    // Example 4: Custom hostname for specific deployment
    console.log("4. Custom hostname for specific deployment");
    const app4 = new BXO({
        serve: {
            hostname: "192.168.1.100",  // Specific IP address
            port: 4000
        }
    });

    app4.get("/", (ctx) => {
        return ctx.json({
            message: "BXO on specific IP",
            hostname: "192.168.1.100",
            accessible: "From network 192.168.1.x",
            examples: [
                "http://192.168.1.100:4000"
            ]
        });
    });

    // Start the server you want to test
    const selectedApp = app1; // Change this to app1, app2, app3, or app4
    
    selectedApp.start();
    
    console.log(`🚀 Server started!`);
    console.log(`📍 Hostname: ${selectedApp.server?.hostname || 'default'}`);
    console.log(`🔌 Port: ${selectedApp.server?.port}`);
    console.log(`🌐 Accessible at:`);
    
    if (selectedApp === app1) {
        console.log(`   • http://localhost:3000`);
        console.log(`   • http://127.0.0.1:3000`);
        console.log(`   • http://your-server-ip:3000`);
        console.log(`   • http://your-domain.com:3000`);
    } else if (selectedApp === app2) {
        console.log(`   • http://localhost:3001`);
        console.log(`   • http://127.0.0.1:3001`);
    } else if (selectedApp === app3) {
        console.log(`   • http://localhost:8080`);
        console.log(`   • http://your-server-ip:8080`);
        console.log(`   • http://your-domain.com:8080`);
    } else if (selectedApp === app4) {
        console.log(`   • http://192.168.1.100:4000`);
    }
    
    console.log(`\n📝 Configuration Options:`);
    console.log(`   • hostname: "0.0.0.0" - Listen on all interfaces (external access)`);
    console.log(`   • hostname: "127.0.0.1" - Only localhost access`);
    console.log(`   • hostname: "192.168.1.100" - Specific IP address`);
    console.log(`   • hostname: "your-domain.com" - Specific domain`);
    console.log(`   • port: 3000 - Custom port number`);
    console.log(`   • development: false - Production mode`);
}

main().catch(console.error);
