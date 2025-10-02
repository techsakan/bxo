import BXO from "../src";

async function main() {
    const app = new BXO({ serve: { port: 3000 } });

    // Route with space in the path
    app.get("/api/resources/Workspace Item", (ctx) => {
        return ctx.json({ 
            message: "Found Workspace Item resource!",
            path: ctx.request.url,
            pathname: new URL(ctx.request.url).pathname
        });
    });

    // Route with URL-encoded space
    app.get("/api/resources/Workspace%20Item", (ctx) => {
        return ctx.json({ 
            message: "Found URL-encoded Workspace Item resource!",
            path: ctx.request.url,
            pathname: new URL(ctx.request.url).pathname
        });
    });

    // Route with path parameter (recommended approach)
    app.get("/api/resources/:resourceType", (ctx) => {
        return ctx.json({ 
            message: `Found resource type: ${ctx.params.resourceType}`,
            path: ctx.request.url,
            pathname: new URL(ctx.request.url).pathname,
            params: ctx.params
        });
    });

    // Route with multiple path parameters including URL-encoded spaces
    app.get("/api/resources/:resourceType/:id", (ctx) => {
        return ctx.json({ 
            message: `Found resource: ${ctx.params.resourceType} with ID: ${ctx.params.id}`,
            path: ctx.request.url,
            pathname: new URL(ctx.request.url).pathname,
            params: ctx.params
        });
    });

    // Test route to show the difference
    app.get("/test", (ctx) => {
        return ctx.text(`
<!DOCTYPE html>
<html>
<head>
    <title>URL Encoding Test</title>
</head>
<body>
    <h1>URL Encoding Test</h1>
    <p>Test the following URLs:</p>
    <ul>
        <li><a href="/api/resources/Workspace Item">/api/resources/Workspace Item</a> (with space)</li>
        <li><a href="/api/resources/Workspace%20Item">/api/resources/Workspace%20Item</a> (URL encoded)</li>
        <li><a href="/api/resources/My%20Resource">/api/resources/My%20Resource</a> (URL encoded with params)</li>
        <li><a href="/api/resources/Doctype%20Permission/01992af8-1c69-7000-9219-9b83c2feb2d6">/api/resources/Doctype%20Permission/01992af8-1c69-7000-9219-9b83c2feb2d6</a> (URL encoded with ID)</li>
    </ul>
    
    <h2>Test with JavaScript fetch:</h2>
    <button onclick="testFetch('/api/resources/Workspace Item')">Test with space</button>
    <button onclick="testFetch('/api/resources/Workspace%20Item')">Test URL encoded</button>
    <button onclick="testFetch('/api/resources/My%20Resource')">Test with params</button>
    <button onclick="testFetch('/api/resources/Doctype%20Permission/01992af8-1c69-7000-9219-9b83c2feb2d6')">Test with ID</button>
    
    <div id="result"></div>
    
    <script>
        async function testFetch(url) {
            try {
                const response = await fetch(url);
                const data = await response.json();
                document.getElementById('result').innerHTML = 
                    '<h3>Result:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    '<h3>Error:</h3><pre>' + error.message + '</pre>';
            }
        }
    </script>
        `, 200, {
            "Content-Type": "text/html"
        });
    });

    app.start();
    console.log(`Server is running on http://localhost:${app.server?.port}`);
    console.log(`Test URL encoding at http://localhost:${app.server?.port}/test`);
}

main().catch(console.error);
