import BXO, { z } from "../src";

async function main() {
    const app = new BXO({ serve: { port: 3002 } });

    // Example 1: Header validation with passthrough
    app.get("/api/headers", (ctx) => {
        return ctx.json({
            message: "Headers received",
            // All headers are available, including extra ones not in schema
            allHeaders: ctx.headers,
            // Schema-validated headers are typed
            contentType: ctx.headers["content-type"],
            authorization: ctx.headers["authorization"]
        });
    }, {
        headers: z.object({
            "content-type": z.string().optional(),
            "authorization": z.string().optional()
        }).passthrough() // This allows extra headers to pass through
    });

    // Example 2: Cookie validation with passthrough
    app.get("/api/cookies", (ctx) => {
        return ctx.json({
            message: "Cookies received",
            // All cookies are available, including extra ones not in schema
            allCookies: ctx.cookies,
            // Schema-validated cookies are typed
            sessionId: ctx.cookies.sessionId,
            theme: ctx.cookies.theme
        });
    }, {
        cookies: z.object({
            sessionId: z.string().optional(),
            theme: z.enum(["light", "dark"]).optional()
        }).passthrough() // This allows extra cookies to pass through
    });

    // Example 3: Both headers and cookies with passthrough
    app.post("/api/auth", (ctx) => {
        return ctx.json({
            message: "Authentication successful",
            headers: {
                // Only the required headers are typed
                contentType: ctx.headers["content-type"],
                authorization: ctx.headers["authorization"],
                // But all headers are available
                allHeaders: ctx.headers
            },
            cookies: {
                // Only the required cookies are typed
                sessionId: ctx.cookies.sessionId,
                theme: ctx.cookies.theme,
                // But all cookies are available
                allCookies: ctx.cookies
            }
        });
    }, {
        headers: z.object({
            "content-type": z.string(),
            "authorization": z.string()
        }).passthrough(),
        cookies: z.object({
            sessionId: z.string(),
            theme: z.enum(["light", "dark"])
        }).passthrough(),
        body: z.object({
            username: z.string(),
            password: z.string()
        })
    });

    // Example 4: Without passthrough (strict validation)
    app.get("/api/strict", (ctx) => {
        return ctx.json({
            message: "Strict validation - only schema fields available",
            headers: ctx.headers,
            cookies: ctx.cookies
        });
    }, {
        headers: z.object({
            "content-type": z.string().optional()
        }), // No passthrough - will fail if extra headers are present
        cookies: z.object({
            sessionId: z.string().optional()
        }) // No passthrough - will fail if extra cookies are present
    });

    // Example 5: Demonstrating the difference
    app.get("/api/demo", (ctx) => {
        // Set some cookies to demonstrate
        ctx.set.cookie("sessionId", "abc123");
        ctx.set.cookie("theme", "dark");
        ctx.set.cookie("extraCookie", "this-will-be-available-with-passthrough");
        
        return ctx.json({
            message: "Check the cookies in your browser dev tools",
            note: "extraCookie will be available in /api/cookies but not in /api/strict"
        });
    });

    app.start();
    console.log(`Passthrough validation example server running on http://localhost:${app.server?.port}`);
    console.log("\nTry these endpoints:");
    console.log("GET  /api/headers (with extra headers)");
    console.log("GET  /api/cookies (with extra cookies)");
    console.log("POST /api/auth (with both headers and cookies)");
    console.log("GET  /api/strict (strict validation - may fail with extra fields)");
    console.log("GET  /api/demo (sets some cookies for testing)");
    console.log("\nExample with curl:");
    console.log('curl -H "Content-Type: application/json" -H "Authorization: Bearer token123" -H "X-Custom-Header: value" -b "sessionId=abc123; theme=dark; extraCookie=test" http://localhost:3002/api/headers');
}

main().catch(console.error);
