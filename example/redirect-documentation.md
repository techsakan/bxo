# Redirect Functionality in BXO

BXO provides multiple ways to handle HTTP redirects in your applications. This guide covers all the available methods and best practices.

## Available Redirect Methods

### 1. Using the `ctx.redirect()` Helper (Recommended)

The most convenient way to return redirects is using the built-in `ctx.redirect()` method:

```typescript
app.get("/old-page", (ctx) => {
    return ctx.redirect("/new-page"); // Default: 302 status
});

app.get("/permanent-redirect", (ctx) => {
    return ctx.redirect("/new-location", 301); // Permanent redirect
});
```

### 2. Using Standard Response with Location Header

For more control over headers, use the standard Response API:

```typescript
app.get("/custom-redirect", (ctx) => {
    return new Response(null, {
        status: 302,
        headers: {
            "Location": "/target",
            "Cache-Control": "no-cache"
        }
    });
});
```

### 3. Using Context Status Method

You can also use the existing `ctx.status()` method with manual header setting:

```typescript
app.get("/manual-redirect", (ctx) => {
    ctx.set.headers["Location"] = "/target";
    return ctx.status(302, null);
});
```

## HTTP Redirect Status Codes

BXO supports all standard HTTP redirect status codes:

| Status | Code | Name | Description | Method Preservation |
|--------|------|------|-------------|-------------------|
| 301 | 301 | Moved Permanently | Resource has permanently moved | No |
| 302 | 302 | Found | Temporary redirect (default) | No |
| 303 | 303 | See Other | Forces GET method after POST | No |
| 307 | 307 | Temporary Redirect | Preserves original method | Yes |
| 308 | 308 | Permanent Redirect | Preserves original method | Yes |

## Common Use Cases

### 1. Page Migration (301)
```typescript
app.get("/old-url", (ctx) => {
    return ctx.redirect("/new-url", 301);
});
```

### 2. Post-Redirect-Get Pattern (303)
```typescript
app.post("/form-submit", (ctx) => {
    // Process form data
    return ctx.redirect("/success", 303); // Forces GET
});
```

### 3. API Endpoint Migration (307)
```typescript
app.put("/api/old-endpoint", (ctx) => {
    return ctx.redirect("/api/new-endpoint", 307); // Preserves PUT method
});
```

### 4. Conditional Redirects
```typescript
app.get("/dashboard", (ctx) => {
    const userType = ctx.cookies.userType;
    
    if (userType === "admin") {
        return ctx.redirect("/admin-dashboard", 302);
    } else {
        return ctx.redirect("/user-dashboard", 302);
    }
});
```

### 5. Query Parameter Preservation
```typescript
app.get("/search", (ctx) => {
    const queryString = new URLSearchParams(ctx.query).toString();
    const redirectUrl = queryString ? `/new-search?${queryString}` : "/new-search";
    return ctx.redirect(redirectUrl, 301);
});
```

### 6. Authentication Redirects
```typescript
app.get("/protected", (ctx) => {
    const session = ctx.cookies.session;
    
    if (!session) {
        return ctx.redirect("/login", 302);
    }
    
    return ctx.json({ message: "Protected content" });
});
```

## Best Practices

### 1. Choose the Right Status Code
- **301**: Use for permanent moves (SEO-friendly)
- **302**: Use for temporary redirects (default)
- **303**: Use after POST to prevent resubmission
- **307/308**: Use for API endpoints to preserve HTTP methods

### 2. Handle Relative vs Absolute URLs
```typescript
// Relative URL (stays on same domain)
ctx.redirect("/new-path", 302);

// Absolute URL (can redirect to different domain)
ctx.redirect("https://example.com/new-path", 301);
```

### 3. Preserve Query Parameters When Needed
```typescript
app.get("/old-search", (ctx) => {
    const { q, page, filters } = ctx.query;
    const params = new URLSearchParams(ctx.query);
    const redirectUrl = params.toString() ? `/new-search?${params}` : "/new-search";
    return ctx.redirect(redirectUrl, 301);
});
```

### 4. Add Custom Headers When Necessary
```typescript
app.get("/redirect-with-cache", (ctx) => {
    return new Response(null, {
        status: 301,
        headers: {
            "Location": "/new-location",
            "Cache-Control": "public, max-age=3600"
        }
    });
});
```

## Testing Redirects

### Using curl
```bash
# Check redirect status and location
curl -I http://localhost:3000/old-page

# Follow redirects automatically
curl -L http://localhost:3000/old-page

# Test with different HTTP methods
curl -X POST http://localhost:3000/form-submit
curl -X PUT http://localhost:3000/api/update
```

### Using JavaScript fetch
```javascript
// Don't follow redirects automatically
fetch('/old-page', { redirect: 'manual' })
  .then(response => {
    console.log('Status:', response.status);
    console.log('Location:', response.headers.get('Location'));
  });

// Follow redirects automatically (default)
fetch('/old-page')
  .then(response => response.text())
  .then(data => console.log(data));
```

## Common Patterns

### 1. URL Shortening
```typescript
app.get("/s/:shortId", (ctx) => {
    const { shortId } = ctx.params;
    const longUrl = getLongUrl(shortId); // Your database lookup
    return ctx.redirect(longUrl, 302);
});
```

### 2. Language/Region Redirects
```typescript
app.get("/", (ctx) => {
    const acceptLanguage = ctx.headers["accept-language"];
    const region = detectRegion(acceptLanguage);
    return ctx.redirect(`/${region}/home`, 302);
});
```

### 3. Maintenance Mode
```typescript
app.get("*", (ctx) => {
    if (isMaintenanceMode()) {
        return ctx.redirect("/maintenance", 503);
    }
    // Continue with normal routing
});
```

### 4. HTTPS Redirect
```typescript
app.get("*", (ctx) => {
    if (ctx.request.url.startsWith("http://") && isProduction()) {
        const httpsUrl = ctx.request.url.replace("http://", "https://");
        return ctx.redirect(httpsUrl, 301);
    }
    // Continue with normal routing
});
```

## Error Handling

### 1. Invalid Redirect URLs
```typescript
app.get("/redirect", (ctx) => {
    const { url } = ctx.query;
    
    if (!url || !isValidUrl(url)) {
        return ctx.status(400, { error: "Invalid redirect URL" });
    }
    
    return ctx.redirect(url, 302);
});
```

### 2. Redirect Loops Prevention
```typescript
app.get("/redirect", (ctx) => {
    const redirectCount = parseInt(ctx.headers["x-redirect-count"] || "0");
    
    if (redirectCount > 5) {
        return ctx.status(400, { error: "Too many redirects" });
    }
    
    // Add redirect count header
    ctx.set.headers["x-redirect-count"] = (redirectCount + 1).toString();
    return ctx.redirect("/target", 302);
});
```

## Performance Considerations

1. **Minimize Redirect Chains**: Avoid multiple redirects in sequence
2. **Use 301 for Permanent Moves**: Helps with SEO and caching
3. **Consider CDN Caching**: Some CDNs cache redirects based on status codes
4. **Monitor Redirect Performance**: Track redirect success rates and response times

## Security Considerations

1. **Validate Redirect URLs**: Prevent open redirect vulnerabilities
2. **Use HTTPS**: Always redirect to HTTPS in production
3. **Sanitize User Input**: Clean any user-provided redirect URLs
4. **Implement Rate Limiting**: Prevent redirect abuse

```typescript
app.get("/redirect", (ctx) => {
    const { url } = ctx.query;
    
    // Security: Validate redirect URL
    if (!url || !isAllowedRedirect(url)) {
        return ctx.status(400, { error: "Invalid redirect URL" });
    }
    
    return ctx.redirect(url, 302);
});

function isAllowedRedirect(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        // Only allow redirects to same domain or trusted domains
        return parsedUrl.hostname === "localhost" || 
               parsedUrl.hostname === "example.com";
    } catch {
        return false;
    }
}
```

This comprehensive guide should help you implement redirects effectively in your BXO applications!
