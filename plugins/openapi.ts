import BXO, { z } from "../src";
import { createDocument, type CreateDocumentOptions, type ZodOpenApiPathItemObject, type ZodOpenApiPathsObject, type ZodOpenApiSecuritySchemeObject } from "zod-openapi";

interface SecurityScheme extends ZodOpenApiSecuritySchemeObject {
    type: "http" | "apiKey" | "oauth2" | "openIdConnect";
    scheme?: "bearer" | "basic" | "digest" | "apikey";
    bearerFormat?: string;
    description?: string;
    name?: string;
    in?: "header" | "query" | "cookie";
}

interface OpenApiPluginConfig {
    path: string;
    jsonPath: string;
    openapiConfig: CreateDocumentOptions;
    defaultTags?: string[];
    securitySchemes?: Record<string, SecurityScheme>;
    globalSecurity?: Array<Record<string, string[]>>;
}

const createOpenApiPaths = (app: BXO, config?: OpenApiPluginConfig): ZodOpenApiPathsObject => {
    const routes = app.getRoutes()
    let paths: ZodOpenApiPathsObject = {}
    for (const route of routes) {
        const openapiPath = "/" + route.path.replace(/:(\w+)/g, "{$1}").replace(/\*/g, "*").replace("/", "")
        const method = route.method.toLowerCase()
        if (method === "default") {
            continue
        }
        const contentType = route.schema?.detail?.defaultContentType || "application/json"
        if (config?.path && openapiPath === config?.path) {
            continue
        }
        if (config?.jsonPath && openapiPath === config?.jsonPath) {
            continue
        }
        if (route.schema?.detail?.hidden) {
            continue
        }

        // Extract tags from route metadata
        const tags = route.schema?.detail?.tags ||
            route.schema?.detail?.tag ||
            config?.defaultTags ||
            []

        // Extract security requirements from route metadata
        const routeSecurity = route.schema?.detail?.security ||
            route.schema?.detail?.auth ||
            undefined

        // Extract operation summary and description
        const summary = route.schema?.detail?.summary ||
            route.schema?.detail?.title ||
            `${method.toUpperCase()} ${route.path}`

        const description = route.schema?.detail?.description ||
            route.schema?.detail?.docs ||
            undefined

        // Extract parameters from route path
        const parameters = []
        const pathParams = route.path.match(/:\w+/g)
        if (pathParams) {
            for (const param of pathParams) {
                const paramName = param.slice(1) // Remove the colon
                const paramSchema = route.schema?.detail?.params?.[paramName] || z.string()
                parameters.push({
                    name: paramName,
                    in: "path",
                    required: true,
                    schema: paramSchema
                })
            }
        }

        // Add query parameters if defined
        if (route.schema?.query) {
            const querySchema = route.schema?.query
            if (querySchema && typeof querySchema === 'object' && 'shape' in querySchema) {
                const queryShape = (querySchema as any).shape
                for (const [key, schema] of Object.entries(queryShape)) {
                    const isOptional = schema instanceof z.ZodOptional
                    parameters.push({
                        name: key,
                        in: "query",
                        required: !isOptional, // Query params are typically optional
                        schema: schema as any
                    })
                }
            }
        }

        const response = Object.entries(route.schema?.response || {}).map(([status, schema]) => {
            return ({
                400: status === "400" && !route.schema?.response?.[status] ? {
                    content: {
                        "application/json": {
                            schema: z.object({
                                error: z.string(),
                                issues: z.any().optional()
                            })
                        }
                    }
                } : undefined,
                [status]: {
                    content: {
                        "application/json": {
                            schema: schema
                        }
                    }
                }
            })
        }).reduce((acc, curr) => ({ ...acc, ...curr }), {})

        paths[openapiPath] = {
            ...paths[openapiPath],
            [method]: {
                tags: tags.length > 0 ? tags : undefined,
                summary: summary,
                description: description,
                parameters: parameters.length > 0 ? parameters : undefined,
                security: routeSecurity,
                requestBody: {
                    content: {
                        [contentType]: {
                            schema: route.schema?.body || z.object({})
                        }
                    }
                },
                responses: response || {
                    200: {
                        content: {
                            "application/json": {
                                schema: z.object({})
                            }
                        }
                    }
                }
            }
        } satisfies ZodOpenApiPathItemObject
    }
    return paths
}

export function openapi(_config?: OpenApiPluginConfig) {
    let config = _config
    !config && (config = { path: "/docs", openapiConfig: {}, jsonPath: "/openapi.json" })
    config.path = config.path || "/docs"
    config.jsonPath = config.jsonPath || "/openapi.json"
    config.openapiConfig = config.openapiConfig || {}
    config.defaultTags = config.defaultTags || []
    config.securitySchemes = config.securitySchemes || {}
    config.globalSecurity = config.globalSecurity || []

    const bxo = new BXO()
        .get(config.jsonPath, (ctx, app) => {
            const paths = createDocument({
                openapi: "3.0.0",
                info: {
                    title: "My API",
                    version: "1.0.0"
                },
                paths: createOpenApiPaths(app, config),
                components: {
                    securitySchemes: Object.keys(config.securitySchemes || {}).length > 0 ? config.securitySchemes : undefined
                },
                security: (config.globalSecurity || []).length > 0 ? config.globalSecurity : undefined,
                ...config.openapiConfig
            })
            return new Response(JSON.stringify(paths), {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        })
        .get(config.path, (ctx, app) => {
            ctx.set.headers["Content-Type"] = "text/html"
            return `
            <!doctype html>
<html>
<head>
  <title>My Scalar API Reference</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <div id="app"></div>
  <!-- Load Scalar -->
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  <!-- Initialize Scalar -->
  <script>
    Scalar.createApiReference('#app', {
      url: '/openapi.json',
      proxyUrl: 'https://proxy.scalar.com'
    })
  </script>
</body>
</html>`
        })

    return bxo
}