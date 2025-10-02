import BXO, { z } from "../src";

async function main() {
    const app = new BXO({ serve: { port: 3001 } });

    // Example 1: Simple cookie setting
    app.get("/set-simple-cookie", (ctx) => {
        // Set a simple cookie
        ctx.set.cookie("theme", "dark");
        
        return ctx.json({ message: "Simple cookie set!" });
    });

    // Example 2: Cookie with options
    app.get("/set-secure-cookie", (ctx) => {
        // Set a secure cookie with various options
        ctx.set.cookie("sessionId", "abc123", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 3600, // 1 hour
            path: "/"
        });
        
        return ctx.json({ message: "Secure cookie set!" });
    });

    // Example 3: Multiple cookies
    app.get("/set-multiple-cookies", (ctx) => {
        // Set multiple cookies
        ctx.set.cookie("user", "john_doe", {
            httpOnly: true,
            maxAge: 86400 // 1 day
        });
        
        ctx.set.cookie("preferences", "dark_mode", {
            maxAge: 604800 // 1 week
        });
        
        ctx.set.cookie("lastVisit", new Date().toISOString(), {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });
        
        return ctx.json({ message: "Multiple cookies set!" });
    });

    // Example 4: Reading cookies
    app.get("/read-cookies", (ctx) => {
        return ctx.json({
            message: "Current cookies:",
            cookies: ctx.cookies,
            theme: ctx.cookies.theme || "not set",
            sessionId: ctx.cookies.sessionId || "not set",
            user: ctx.cookies.user || "not set"
        });
    });

    // Example 5: Login with cookie validation
    app.post("/login", (ctx) => {
        const { username, password } = ctx.body;
        
        // Simple validation (in real app, check against database)
        if (username === "admin" && password === "password") {
            // Set session cookie
            ctx.set.cookie("sessionId", `session_${Date.now()}`, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 3600 // 1 hour
            });
            
            ctx.set.cookie("username", username, {
                maxAge: 3600
            });
            
            return ctx.json({ 
                message: "Login successful!",
                username 
            });
        }
        
        return ctx.status(401, { error: "Invalid credentials" });
    }, {
        body: z.object({
            username: z.string(),
            password: z.string()
        })
    });

    // Example 6: Protected route with cookie validation
    app.get("/profile", (ctx) => {
        const sessionId = ctx.cookies.sessionId;
        const username = ctx.cookies.username;
        
        if (!sessionId) {
            return ctx.status(401, { error: "Not authenticated" });
        }
        
        return ctx.json({ 
            message: "Welcome to your profile!",
            username,
            sessionId: sessionId.substring(0, 10) + "..." // Don't expose full session ID
        });
    }, {
        cookies: z.object({
            sessionId: z.string().optional(),
            username: z.string().optional()
        })
    });

    // Example 7: Logout (clear cookies)
    app.post("/logout", (ctx) => {
        // Clear cookies by setting them with maxAge: 0
        ctx.set.cookie("sessionId", "", {
            maxAge: 0,
            path: "/"
        });
        
        ctx.set.cookie("username", "", {
            maxAge: 0,
            path: "/"
        });
        
        return ctx.json({ message: "Logged out successfully" });
    });

    // Example 8: Cookie with domain and path
    app.get("/set-domain-cookie", (ctx) => {
        ctx.set.cookie("globalPref", "enabled", {
            domain: "localhost", // or your domain
            path: "/api",
            maxAge: 86400
        });
        
        return ctx.json({ message: "Domain-specific cookie set!" });
    });

    app.start();
    console.log(`Cookie example server running on http://localhost:${app.server?.port}`);
    console.log("\nTry these endpoints:");
    console.log("GET  /set-simple-cookie");
    console.log("GET  /set-secure-cookie");
    console.log("GET  /set-multiple-cookies");
    console.log("GET  /read-cookies");
    console.log("POST /login (with body: {\"username\": \"admin\", \"password\": \"password\"})");
    console.log("GET  /profile");
    console.log("POST /logout");
    console.log("GET  /set-domain-cookie");
}

main().catch(console.error);
