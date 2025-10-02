import BXO from "../src";

async function main() {
    const app = new BXO({ serve: { port: 3002 } });

    // Example 1: Simple temporary redirect (302) - default
    app.get("/old-page", (ctx) => {
        return ctx.redirect("/new-page");
    });

    // Example 2: Permanent redirect (301)
    app.get("/permanent-redirect", (ctx) => {
        return ctx.redirect("/new-location", 301);
    });

    // Example 3: Temporary redirect (302) - explicit
    app.get("/temp-redirect", (ctx) => {
        return ctx.redirect("/target", 302);
    });

    // Example 4: See Other redirect (303) - forces GET method
    app.post("/form-submit", (ctx) => {
        // After POST, redirect to success page with GET
        return ctx.redirect("/success", 303);
    });

    // Example 5: Temporary redirect preserving method (307)
    app.put("/api/update", (ctx) => {
        // Preserves PUT method in redirect
        return ctx.redirect("/api/updated", 307);
    });

    // Example 6: Permanent redirect preserving method (308)
    app.patch("/api/patch", (ctx) => {
        // Preserves PATCH method in redirect
        return ctx.redirect("/api/patched", 308);
    });

    // Example 7: External redirect
    app.get("/external", (ctx) => {
        return ctx.redirect("https://example.com", 301);
    });

    // Example 8: Conditional redirect based on query parameters
    app.get("/conditional", (ctx) => {
        const { type } = ctx.query;
        
        if (type === "admin") {
            return ctx.redirect("/admin-dashboard", 302);
        } else if (type === "user") {
            return ctx.redirect("/user-dashboard", 302);
        } else {
            return ctx.redirect("/default-page", 302);
        }
    });

    // Example 9: Redirect with path parameters
    app.get("/user/:id", (ctx) => {
        const { id } = ctx.params;
        return ctx.redirect(`/profile/${id}`, 301);
    });

    // Example 10: Redirect with query string preservation
    app.get("/search", (ctx) => {
        const { q, page } = ctx.query;
        const queryString = new URLSearchParams(ctx.query).toString();
        const redirectUrl = queryString ? `/new-search?${queryString}` : "/new-search";
        return ctx.redirect(redirectUrl, 301);
    });

    // Example 11: Redirect with custom headers
    app.get("/custom-redirect", (ctx) => {
        // You can still use the standard Response approach for custom headers
        return new Response(null, {
            status: 302,
            headers: {
                "Location": "/target",
                "Cache-Control": "no-cache",
                "X-Custom-Header": "redirect-value"
            }
        });
    });

    // Example 12: Redirect after authentication
    app.post("/login", (ctx) => {
        const { username, password } = ctx.body;
        
        // Simple authentication check
        if (username === "admin" && password === "password") {
            // Set session cookie
            ctx.set.cookie("session", "authenticated", {
                httpOnly: true,
                maxAge: 3600
            });
            
            // Redirect to dashboard
            return ctx.redirect("/dashboard", 303);
        } else {
            // Redirect back to login with error
            return ctx.redirect("/login?error=invalid-credentials", 303);
        }
    });

    // Example 13: Redirect with status code validation
    app.get("/validated-redirect", (ctx) => {
        const { status } = ctx.query;
        
        // Validate status code
        const validStatuses = [301, 302, 303, 307, 308];
        const redirectStatus = validStatuses.includes(Number(status)) ? Number(status) : 302;
        
        return ctx.redirect("/target", redirectStatus as 301 | 302 | 303 | 307 | 308);
    });

    // Example 14: Redirect with relative and absolute URLs
    app.get("/relative-redirect", (ctx) => {
        // Relative URL redirect
        return ctx.redirect("./relative-path", 302);
    });

    app.get("/absolute-redirect", (ctx) => {
        // Absolute URL redirect
        return ctx.redirect("/absolute-path", 302);
    });

    // Example 15: Redirect with fragment (hash)
    app.get("/fragment-redirect", (ctx) => {
        return ctx.redirect("/page#section", 302);
    });

    // Target pages for testing redirects
    app.get("/new-page", (ctx) => {
        return ctx.json({ message: "Welcome to the new page!" });
    });

    app.get("/new-location", (ctx) => {
        return ctx.json({ message: "This is the new permanent location!" });
    });

    app.get("/target", (ctx) => {
        return ctx.json({ message: "Redirect target reached!" });
    });

    app.get("/success", (ctx) => {
        return ctx.json({ message: "Form submitted successfully!" });
    });

    app.get("/dashboard", (ctx) => {
        const session = ctx.cookies.session;
        if (session === "authenticated") {
            return ctx.json({ message: "Welcome to the dashboard!" });
        } else {
            return ctx.redirect("/login", 302);
        }
    });

    app.get("/login", (ctx) => {
        const { error } = ctx.query;
        return ctx.json({ 
            message: "Login page",
            error: error || null
        });
    });

    app.get("/new-search", (ctx) => {
        return ctx.json({ 
            message: "New search page",
            query: ctx.query
        });
    });

    app.get("/profile/:id", (ctx) => {
        return ctx.json({ 
            message: `Profile page for user ${ctx.params.id}`
        });
    });

    app.get("/admin-dashboard", (ctx) => {
        return ctx.json({ message: "Admin dashboard" });
    });

    app.get("/user-dashboard", (ctx) => {
        return ctx.json({ message: "User dashboard" });
    });

    app.get("/default-page", (ctx) => {
        return ctx.json({ message: "Default page" });
    });

    app.get("/page", (ctx) => {
        return ctx.json({ message: "Page with section" });
    });

    app.start();
    console.log(`Redirect example server running on http://localhost:${app.server?.port}`);
    console.log("\nTry these redirect endpoints:");
    console.log("GET  /old-page                    -> /new-page (302)");
    console.log("GET  /permanent-redirect          -> /new-location (301)");
    console.log("GET  /temp-redirect               -> /target (302)");
    console.log("POST /form-submit                -> /success (303)");
    console.log("PUT  /api/update                 -> /api/updated (307)");
    console.log("PATCH /api/patch                 -> /api/patched (308)");
    console.log("GET  /external                   -> https://example.com (301)");
    console.log("GET  /conditional?type=admin     -> /admin-dashboard (302)");
    console.log("GET  /conditional?type=user       -> /user-dashboard (302)");
    console.log("GET  /conditional                -> /default-page (302)");
    console.log("GET  /user/123                   -> /profile/123 (301)");
    console.log("GET  /search?q=test&page=1        -> /new-search?q=test&page=1 (301)");
    console.log("GET  /custom-redirect             -> /target (302) with custom headers");
    console.log("POST /login (admin/password)     -> /dashboard (303)");
    console.log("GET  /validated-redirect?status=301 -> /target (301)");
    console.log("GET  /relative-redirect           -> ./relative-path (302)");
    console.log("GET  /absolute-redirect           -> /absolute-path (302)");
    console.log("GET  /fragment-redirect          -> /page#section (302)");
    console.log("\nTest with curl:");
    console.log("curl -I http://localhost:3002/old-page");
    console.log("curl -I http://localhost:3002/permanent-redirect");
    console.log("curl -X POST http://localhost:3002/form-submit");
    console.log("curl -X PUT http://localhost:3002/api/update");
}

main().catch(console.error);
