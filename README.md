# bxo

A fast, lightweight web framework for Bun with built-in Zod validation and lifecycle hooks.

## Features

- **Type-safe routing** with Zod schema validation
- **WebSocket support** with clean API
- **Lifecycle hooks** for middleware and plugins
- **Plugin system** for extending functionality
- **Built-in CORS support** via plugin
- **Fast performance** leveraging Bun's native HTTP server

## Installation

```bash
bun install
```

## Quick Start

```typescript
import BXO from "./src/index";
import { cors } from "./plugins";

const app = new BXO();

// Use CORS plugin
app.use(cors());

// Define routes
app.get("/", (ctx) => ctx.json({ message: "Hello World!" }));

app.start();
```

## WebSocket Support

BXO provides built-in WebSocket support with a clean, intuitive API:

```typescript
import BXO from "./src";

const app = new BXO();

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

// WebSocket with path parameters
app.ws("/chat/:room", {
    open(ws) {
        const room = ws.data?.room || 'unknown';
        console.log(`WebSocket connection opened for room: ${room}`);
        ws.send(`Welcome to chat room: ${room}`);
    },
    
    message(ws, message) {
        const room = ws.data?.room || 'unknown';
        console.log(`Message in room ${room}:`, message);
        ws.send(`[${room}] Echo: ${message}`);
    }
});

app.start();
```

### WebSocket Handler Events

- `open(ws)` - Called when a WebSocket connection is established
- `message(ws, message)` - Called when a message is received
- `close(ws, code, reason)` - Called when the connection is closed
- `drain(ws)` - Called when the WebSocket is ready for more data
- `ping(ws, data)` - Called when a ping is received
- `pong(ws, data)` - Called when a pong is received

### WebSocket Features

- **Path parameters** - Support for dynamic routes like `/chat/:room`
- **Automatic upgrade** - HTTP requests to WebSocket routes are automatically upgraded
- **Type safety** - Full TypeScript support with proper typing
- **Error handling** - Built-in error handling for WebSocket events
- **Data attachment** - Access to path information via `ws.data`

## Lifecycle Hooks

BXO provides powerful lifecycle hooks that allow you to intercept and modify requests and responses at different stages:

### beforeRequest
Runs before any route processing. Can modify the request or return a response to short-circuit processing.

```typescript
app.beforeRequest(async (req) => {
  console.log(`${req.method} ${req.url}`);
  return req; // Continue with request
});
```

### afterRequest
Runs after route processing but before the response is sent. Can modify the final response.

```typescript
app.afterRequest(async (req, res) => {
  res.headers.set("X-Response-Time", Date.now().toString());
  return res;
});
```

### beforeResponse
Runs after the route handler but before response headers are merged. Useful for modifying response metadata.

```typescript
app.beforeResponse(async (res) => {
  res.headers.set("X-Custom-Header", "value");
  return res;
});
```

### onError
Runs when an error occurs during request processing. Can return a custom error response.

```typescript
app.onError(async (error, req) => {
  console.error(`Error: ${error.message}`);
  return new Response("Internal Server Error", { status: 500 });
});
```

## Plugins

### CORS Plugin

The CORS plugin provides comprehensive Cross-Origin Resource Sharing support:

```typescript
import { cors } from "./plugins";

app.use(cors({
  origin: ["http://localhost:3000", "https://myapp.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
```

### OpenAPI Plugin

The OpenAPI plugin automatically generates OpenAPI 3.0 documentation with support for tags, security schemes, and comprehensive route metadata:

```typescript
import { openapi } from "./plugins";

app.use(openapi({
  path: "/docs",                    // Swagger UI endpoint
  jsonPath: "/openapi.json",        // OpenAPI JSON endpoint
  defaultTags: ["API"],             // Default tags for routes
  securitySchemes: {                // Define security schemes
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "JWT token for authentication"
    },
    apiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "X-API-Key",
      description: "API key for authentication"
    }
  },
  globalSecurity: [                 // Global security requirements
    { bearerAuth: [] },
    { apiKeyAuth: [] }
  ],
  openapiConfig: {                  // Additional OpenAPI config
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API description"
    }
  }
}));
```

#### Route Metadata

Routes can include detailed metadata for better OpenAPI documentation:

```typescript
app.get("/users/:id", (ctx) => {
  const id = ctx.params.id
  return { user: { id, name: "John Doe" } }
}, {
  detail: {
    tags: ["Users"],                    // Route tags for grouping
    summary: "Get user by ID",          // Operation summary
    description: "Retrieve user details", // Detailed description
    security: [{ bearerAuth: [] }],     // Route-specific security
    params: {                           // Parameter documentation
      id: z.string().describe("User ID")
    }
  }
})
```

#### Supported Metadata Fields

- `tags`: Array of tags for grouping operations
- `summary`: Short description of the operation
- `description`: Detailed description of the operation
- `security`: Security requirements for the route
- `params`: Path parameter schemas and descriptions
- `query`: Query parameter schemas
- `hidden`: Set to `true` to exclude from OpenAPI docs

### Creating Custom Plugins

Plugins are just BXO instances with lifecycle hooks:

```typescript
function loggingPlugin() {
  const plugin = new BXO();
  
  plugin.beforeRequest(async (req) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    return req;
  });
  
  return plugin;
}

app.use(loggingPlugin());
```

## Route Validation

Define Zod schemas for request validation:

```typescript
import { z } from "bxo";

const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
});

app.post("/users", async (ctx) => {
  const user = ctx.body; // Already validated by UserSchema
  return ctx.json({ id: 1, ...user });
}, {
  body: UserSchema
});
```

## Multipart/Form-Data Parsing

BXO automatically parses multipart/form-data into nested objects and arrays before Zod validation:

### Nested Objects
Form fields like `profile[name]` are automatically converted to nested objects:

```typescript
const UserFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  profile: z.object({
    name: z.string()
  })
});

app.post("/users", async (ctx) => {
  // Form data: profile[name]="John" becomes { profile: { name: "John" } }
  console.log(ctx.body); // { name: "...", email: "...", profile: { name: "John" } }
  return ctx.json({ success: true, data: ctx.body });
}, {
  body: UserFormSchema
});
```

### Arrays
Form fields like `items[0]`, `items[1]` are automatically converted to arrays:

```typescript
const ItemsSchema = z.object({
  items: z.array(z.string()),
  tags: z.array(z.string()),
  profile: z.object({
    name: z.string(),
    age: z.string().transform(val => parseInt(val, 10))
  })
});

app.post("/items", async (ctx) => {
  // Form data: items[0]="Apple", items[1]="Banana" becomes { items: ["Apple", "Banana"] }
  console.log(ctx.body); // { items: ["Apple", "Banana"], tags: [...], profile: {...} }
  return ctx.json({ success: true, data: ctx.body });
}, {
  body: ItemsSchema
});
```

### Deep Nested Array Objects
Form fields like `workspace_items[0][id]`, `workspace_items[0][type]` are automatically converted to arrays of objects:

```typescript
const WorkspaceSchema = z.object({
  id: z.string(),
  workspace_items: z.array(z.object({
    id: z.string(),
    type: z.string(),
    value: z.string(),
    options: z.string(),
    label: z.string()
  }))
});

app.post("/workspace", async (ctx) => {
  // Form data: workspace_items[0][id]="item1", workspace_items[0][type]="Link" 
  // becomes { workspace_items: [{ id: "item1", type: "Link", ... }] }
  console.log(ctx.body); // { id: "...", workspace_items: [{ id: "item1", type: "Link", ... }] }
  return ctx.json({ success: true, data: ctx.body });
}, {
  body: WorkspaceSchema
});
```

### Supported Patterns
- **Nested objects**: `profile[name]`, `settings[theme]` → `{ profile: { name: "..." }, settings: { theme: "..." } }`
- **Arrays**: `items[0]`, `items[1]` → `{ items: ["...", "..."] }`
- **Deep nested array objects**: `workspace_items[0][id]`, `workspace_items[0][type]` → `{ workspace_items: [{ id: "...", type: "..." }] }`
- **Duplicate keys**: Multiple values with same key → `{ tags: ["tag1", "tag2"] }`

## Running

```bash
bun run ./src/index.ts
```

Or run the examples:

```bash
# CORS example
bun run ./example/cors-example.ts

# Multipart form data parsing example
bun run ./example/multipart-example.ts
```

## Examples

Check out the `example/` directory for more usage examples:

- `cors-example.ts` - Demonstrates CORS plugin and lifecycle hooks
- `openapi-example.ts` - Demonstrates OpenAPI plugin with tags and security
- `websocket-example.ts` - Demonstrates WebSocket functionality with interactive HTML client
- `multipart-example.ts` - Demonstrates multipart/form-data parsing with nested objects and arrays
- `index.ts` - Basic routing example

This project was created using `bun init` in bun v1.2.3. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
