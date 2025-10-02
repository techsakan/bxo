import BXO from "../src/index";

export interface CorsOptions {
    origin?: string | string[] | boolean | ((origin: string) => boolean);
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
}

export function cors(options: CorsOptions = {}): BXO {
    const {
        origin = "*",
        methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
        allowedHeaders = ["Content-Type", "Authorization"],
        exposedHeaders = [],
        credentials = false,
        maxAge = 86400,
        preflightContinue = false
    } = options;

    const plugin = new BXO();

    // Handle CORS preflight requests
    plugin.beforeRequest(async (req) => {
        const requestOrigin = req.headers.get("origin");
        const requestMethod = req.method;

        // Handle preflight OPTIONS request
        if (requestMethod === "OPTIONS") {
            const response = new Response(null, { status: 204 });

            // Set CORS headers
            setCorsHeaders(response, {
                origin,
                methods,
                allowedHeaders,
                exposedHeaders,
                credentials,
                maxAge,
                requestOrigin
            });

            if (!preflightContinue) {
                return response;
            }
        }

        // Continue with normal request processing
        return req;
    });

    // Add CORS headers to all responses
    plugin.afterRequest(async (req, res) => {
        const requestOrigin = req.headers.get("origin");

        // Set CORS headers on the response
        setCorsHeaders(res, {
            origin,
            methods,
            allowedHeaders,
            exposedHeaders,
            credentials,
            maxAge,
            requestOrigin
        });

        return res;
    });

    return plugin;
}

function setCorsHeaders(
    response: Response,
    options: {
        origin: string | string[] | boolean | ((origin: string) => boolean);
        methods: string[];
        allowedHeaders: string[];
        exposedHeaders: string[];
        credentials: boolean;
        maxAge: number;
        requestOrigin?: string | null;
    }
) {
    const { origin, methods, allowedHeaders, exposedHeaders, credentials, maxAge, requestOrigin } = options;

    // Set Access-Control-Allow-Origin
    if (origin) {
        if (typeof origin === "string") {
            if (origin === "*") {
                response.headers.set("Access-Control-Allow-Origin", "*");
            } else {
                response.headers.set("Access-Control-Allow-Origin", origin);
            }
        } else if (Array.isArray(origin)) {
            // For array of origins, we need to check if the request origin is in the list
            // This is handled in the beforeRequest hook where we have access to the request origin
            if (options.requestOrigin && origin.includes(options.requestOrigin)) {
                response.headers.set("Access-Control-Allow-Origin", options.requestOrigin);
            }
        } else if (origin === true) {
            response.headers.set("Access-Control-Allow-Origin", "*");
        }
    }

    // Set Access-Control-Allow-Methods
    if (methods.length > 0) {
        response.headers.set("Access-Control-Allow-Methods", methods.join(", "));
    }

    // Set Access-Control-Allow-Headers
    if (allowedHeaders.length > 0) {
        response.headers.set("Access-Control-Allow-Headers", allowedHeaders.join(", "));
    }

    // Set Access-Control-Expose-Headers
    if (exposedHeaders.length > 0) {
        response.headers.set("Access-Control-Expose-Headers", exposedHeaders.join(", "));
    }

    // Set Access-Control-Allow-Credentials
    if (credentials) {
        response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    // Set Access-Control-Max-Age
    if (maxAge) {
        response.headers.set("Access-Control-Max-Age", maxAge.toString());
    }
}
