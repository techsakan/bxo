import BXO from "./src";

async function testDefaultContentType() {
    const bxo = new BXO({ serve: { port: 0 } });

    // Test route that returns a string without explicit content type
    bxo.get("/test-string", (ctx) => {
        return "Hello World";
    });

    // Test route that returns a string with explicit content type
    bxo.get("/test-string-explicit", (ctx) => {
        return new Response("Hello World", {
            headers: { "Content-Type": "text/plain" }
        });
    });

    // Test route that uses ctx.json (should be application/json)
    bxo.get("/test-json", (ctx) => {
        return ctx.json({ message: "Hello World" });
    });

    // Test route that uses ctx.text (should be text/plain)
    bxo.get("/test-text", (ctx) => {
        return ctx.text("Hello World");
    });

    bxo.start();
    
    const baseUrl = `http://localhost:${bxo.server?.port}`;
    
    console.log("Testing default content type...");
    
    // Test 1: String response should default to text/html
    try {
        const response1 = await fetch(`${baseUrl}/test-string`);
        const contentType1 = response1.headers.get('Content-Type');
        console.log(`✓ String response Content-Type: ${contentType1} (should be text/html)`);
    } catch (error) {
        console.error("✗ Error testing string response:", error);
    }

    // Test 2: Explicit content type should be preserved
    try {
        const response2 = await fetch(`${baseUrl}/test-string-explicit`);
        const contentType2 = response2.headers.get('Content-Type');
        console.log(`✓ Explicit Content-Type: ${contentType2} (should be text/plain)`);
    } catch (error) {
        console.error("✗ Error testing explicit content type:", error);
    }

    // Test 3: ctx.json should be application/json
    try {
        const response3 = await fetch(`${baseUrl}/test-json`);
        const contentType3 = response3.headers.get('Content-Type');
        console.log(`✓ ctx.json Content-Type: ${contentType3} (should be application/json)`);
    } catch (error) {
        console.error("✗ Error testing ctx.json:", error);
    }

    // Test 4: ctx.text should be text/plain
    try {
        const response4 = await fetch(`${baseUrl}/test-text`);
        const contentType4 = response4.headers.get('Content-Type');
        console.log(`✓ ctx.text Content-Type: ${contentType4} (should be text/plain)`);
    } catch (error) {
        console.error("✗ Error testing ctx.text:", error);
    }

    // Close the server
    bxo.server?.stop();
    console.log("Test completed!");
}

testDefaultContentType().catch(console.error);
