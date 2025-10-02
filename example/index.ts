import BXO, { z } from "../src";
import index from "./index.html";
import { openapi } from "../plugins/openapi";

async function main() {
    const bxo = new BXO({ serve: { port: 0 } });

    bxo.default("/", index);
    bxo.default("/*", index);

    // API routes with comprehensive metadata
    bxo.get("/api/get/:id", (ctx) => {
        return new Response(ctx.params.id + ctx.query.name, {
            headers: {
                "Content-Type": "text/html"
            }
        });
    }, {
        query: z.object({
            name: z.number()
        }),
        response: {
            200: z.object({
                name: z.string()
            })
        },
        detail: {
            tags: ["API"],
            summary: "Get data by ID",
            description: "Retrieve data using an ID and name query parameter",
            params: {
                id: z.string().describe("Unique identifier for the data")
            }
        }
    });

    bxo.post("/api/post", (ctx) => {
        console.log(ctx.body)
        return new Response("Hello" + ctx.body.name, {
            headers: {
                "Content-Type": "text/html"
            }
        });
    }, {
        detail: {
            tags: ["API"],
            summary: "Create new data",
            description: "Submit new data with name and avatar file",
            defaultContentType: "multipart/form-data"
        },
        body: z.object({
            name: z.string(),
            avatar: z.file()
        }),
        response: {
            200: z.object({
                name: z.string()
            }),
            400: z.object({
                error: z.string()
            })
        }
    });

    // Additional routes to showcase different features
    bxo.get("/api/users", (ctx) => {
        return ctx.json({ users: ["John", "Jane", "Bob"] });
    }, {
        detail: {
            tags: ["Users"],
            summary: "Get all users",
            description: "Retrieve a list of all users in the system"
        },
        response: {
            200: z.object({
                users: z.array(z.string())
            })
        }
    });

    bxo.get("/api/users/:id", (ctx) => {
        const id = ctx.params.id;
        return ctx.json({ user: { id, name: "John Doe", email: "john@example.com" } });
    }, {
        detail: {
            tags: ["Users"],
            summary: "Get user by ID",
            description: "Retrieve a specific user by their unique identifier",
            params: {
                id: z.string().describe("User's unique identifier")
            }
        },
        response: {
            200: z.object({
                user: z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string()
                })
            }),
            404: z.object({
                error: z.string()
            })
        }
    });

    bxo.post("/api/users", (ctx) => {
        const userData = ctx.body;
        return ctx.json({ message: "User created", user: userData });
    }, {
        detail: {
            tags: ["Users"],
            summary: "Create new user",
            description: "Create a new user account with the provided information"
        },
        body: z.object({
            name: z.string().min(1, "Name is required"),
            email: z.string().email("Invalid email format"),
            age: z.number().min(18, "Must be at least 18 years old").optional()
        }),
        response: {
            201: z.object({
                message: z.string(),
                user: z.object({
                    name: z.string(),
                    email: z.string(),
                    age: z.number().optional()
                })
            }),
            400: z.object({
                error: z.string(),
                issues: z.array(z.any()).optional()
            })
        }
    });

    // Health check route
    bxo.get("/health", (ctx) => {
        return ctx.json({
            status: "ok",
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    }, {
        detail: {
            tags: ["System"],
            summary: "Health check",
            description: "Check the health status of the API server"
        },
        response: {
            200: z.object({
                status: z.string(),
                timestamp: z.string(),
                uptime: z.number()
            })
        }
    });

    // Use OpenAPI plugin with enhanced configuration
    bxo.use(openapi({
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
        openapiConfig: {}
    }));

    bxo.start();
    console.log(`Server is running on http://localhost:${bxo.server?.port}`);
    console.log(`OpenAPI documentation available at http://localhost:${bxo.server?.port}/docs`);
    console.log(`OpenAPI JSON available at http://localhost:${bxo.server?.port}/openapi.json`);
}

main();