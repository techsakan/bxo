import BXO, { z } from "../src";
import { openapi } from "../plugins/openapi";

// Create a BXO app with OpenAPI plugin
const app = new BXO()
    .use(openapi({
        path: "/docs",
        jsonPath: "/openapi.json",
        defaultTags: ["API"],
        securitySchemes: {
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
        globalSecurity: [
            { bearerAuth: [] },
            { apiKeyAuth: [] }
        ],
        openapiConfig: {
            info: {
                title: "My API with Security",
                version: "1.0.0",
                description: "An example API with OpenAPI documentation, tags, and security"
            }
        }
    }))

// Example routes with tags and security
app.get("/users", (ctx) => {
    return { users: [] }
}, {
    detail: {
        tags: ["Users"],
        summary: "Get all users",
        description: "Retrieve a list of all users",
        security: [{ bearerAuth: [] }]
    }
})

app.get("/users/:id", (ctx) => {
    const id = ctx.params.id
    return { user: { id, name: "John Doe" } }
}, {
    detail: {
        tags: ["Users"],
        summary: "Get user by ID",
        description: "Retrieve a specific user by their ID",
        params: {
            id: z.string().describe("User ID")
        },
        security: [{ apiKeyAuth: [] }]
    }
})

app.post("/users", (ctx) => {
    const body = ctx.body
    return { message: "User created", user: body }
}, {
    body: z.object({
        name: z.string(),
        email: z.string().email()
    }),
    detail: {
        tags: ["Users"],
        summary: "Create a new user",
        description: "Create a new user with the provided information",
        security: [{ bearerAuth: [] }]
    }
})

app.get("/products", (ctx) => {
    return { products: [] }
}, {
    detail: {
        tags: ["Products"],
        summary: "Get all products",
        description: "Retrieve a list of all products"
    }
})

app.get("/products/:id", (ctx) => {
    const id = ctx.params.id
    return { product: { id, name: "Sample Product" } }
}, {
    detail: {
        tags: ["Products"],
        summary: "Get product by ID",
        description: "Retrieve a specific product by its ID",
        params: {
            id: z.string().describe("Product ID")
        }
    }
})

// Admin routes with different security
app.get("/admin/users", (ctx) => {
    return { adminUsers: [] }
}, {
    detail: {
        tags: ["Admin"],
        summary: "Get all users (Admin)",
        description: "Admin-only endpoint to retrieve all users",
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }]
    }
})

// Health check route (no security required)
app.get("/health", (ctx) => {
    return { status: "ok", timestamp: new Date().toISOString() }
}, {
    detail: {
        tags: ["System"],
        summary: "Health check",
        description: "Check if the API is running"
    }
})

// Start the server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
    console.log("OpenAPI docs available at http://localhost:3000/docs")
    console.log("OpenAPI JSON available at http://localhost:3000/openapi.json")
})
