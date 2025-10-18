import type { BunFile } from "bun";
import { z } from "zod";

type Method =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | "OPTIONS"
    | "HEAD"
    | "WS";

type PickWildcardName<S extends string> = S extends "" ? "wildcard" : S;

type PathParams<S extends string> =
    S extends `${string}*${infer W}`
    ? { [K in PickWildcardName<W>]: string }
    : S extends `${string}:${infer P}/${infer R}`
    ? ({ [K in P]: string } & PathParams<`/${R}`>)
    : S extends `${string}:${infer P}`
    ? { [K in P]: string }
    : {};

type InferOr<T, Fallback> = T extends z.ZodTypeAny ? z.infer<T> : Fallback;

type ResponseSchemas = Record<number, z.ZodTypeAny>;

type InferResponse<S extends RouteSchema | undefined, Status extends number> =
    S extends RouteSchema
    ? S["response"] extends Record<Status, z.ZodTypeAny>
    ? z.infer<S["response"][Status]>
    : unknown
    : unknown;

export type RouteSchema = {
    headers?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    cookies?: z.ZodTypeAny;
    body?: z.ZodTypeAny;
    response?: ResponseSchemas;
    detail?: {
        defaultContentType?: "multipart/form-data" | "application/json" | "application/x-www-form-urlencoded" | "text/plain" | "application/octet-stream";
        description?: string;
        hidden?: boolean;
        summary?: string;
        tags?: string[];
        [k: string]: any;
    }
};

type QueryObject = Record<string, string | string[]>;
type CookieObject = Record<string, string>;
type HeaderObject = Record<string, string>;

export type CookieOptions = {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: "strict" | "lax" | "none";
    secure?: boolean;
};

// Lifecycle hook types
export type BeforeRequestHook = (req: Request, ctx?: Partial<Context<any, any>>) => Request | Response | Promise<Request | Response | void>;
export type AfterRequestHook = (req: Request, res: Response, ctx?: Partial<Context<any, any>>) => Response | Promise<Response | void>;
export type BeforeResponseHook = (res: Response, ctx?: Partial<Context<any, any>>) => Response | Promise<Response | void>;
export type OnErrorHook = (error: Error, req: Request, ctx?: Partial<Context<any, any>>) => Response | Promise<Response | void>;

export type Context<P extends string = string, S extends RouteSchema | undefined = undefined> = {
    request: Request;
    params: PathParams<P>;
    query: S extends RouteSchema ? InferOr<S["query"], QueryObject> : QueryObject;
    headers: S extends RouteSchema ? InferOr<S["headers"], HeaderObject> : HeaderObject;
    cookies: S extends RouteSchema ? InferOr<S["cookies"], CookieObject> : CookieObject;
    body: S extends RouteSchema ? InferOr<S["body"], unknown> : unknown;
    set: {
        headers: Record<string, string | string[]>;
        cookie: (name: string, value: string, options?: CookieOptions) => void;
    };
    json: <T>(data: T, status?: number) => Response;
    text: (data: string, status?: number) => Response;
    html: (data: string, status?: number) => Response;
    status: <T extends number>(status: T, data: InferResponse<S, T>) => Response;
    redirect: (url: string, status?: 301 | 302 | 303 | 307 | 308) => Response;
};

type AnyHandler = (ctx: Context<any, any>, app: BXO) => Response | string | BunFile | Promise<Response | string | BunFile>;
type Handler<P extends string, S extends RouteSchema | undefined = undefined> = (
    ctx: Context<P, S>,
    app: BXO
) => Response | string | BunFile | Promise<Response | string | BunFile>

// WebSocket client information type
export type WebSocketClientInfo = {
    id: string; // Short, unique identifier for the WebSocket connection
    path: string;
    ip: string;
    userAgent: string;
    origin: string;
    host: string;
    connectionId: string; // Longer, more detailed connection identifier
    cookies: Record<string, string>; // Parsed cookies from the handshake
    searchParams: Record<string, string | string[]>; // Query parameters from the URL
    authorization?: string; // Authorization header (Bearer token, Basic auth, etc.)
};

// WebSocket data interface - this is what you get when accessing ws.data
export interface WebSocketData extends WebSocketClientInfo {
    // Simple interface with just the data properties
    // No convenience methods - use direct property access
}

// WebSocket handler types
export type WebSocketHandler<T = WebSocketData> = {
    message?(ws: Bun.ServerWebSocket<T>, message: string | Buffer): void | Promise<void>;
    open?(ws: Bun.ServerWebSocket<T>): void | Promise<void>;
    close?(ws: Bun.ServerWebSocket<T>, code: number, reason: string): void | Promise<void>;
    drain?(ws: Bun.ServerWebSocket<T>): void | Promise<void>;
    ping?(ws: Bun.ServerWebSocket<T>, data: Buffer): void | Promise<void>;
    pong?(ws: Bun.ServerWebSocket<T>, data: Buffer): void | Promise<void>;
};

type InternalRoute = {
    method: Method | "DEFAULT";
    path: string;
    matcher: RegExp | null;
    paramNames: string[];
    schema?: RouteSchema;
    handler: AnyHandler;
    websocketHandler?: WebSocketHandler;
};

type ServeOptions = Partial<Parameters<typeof Bun.serve>[0]>;

function toHeaderObject(headers: Headers): HeaderObject {
    const obj: HeaderObject = {};
    headers.forEach((value, key) => {
        obj[key.toLowerCase()] = value;
    });
    return obj;
}

function parseCookies(cookieHeader: string | null): CookieObject {
    const out: CookieObject = {};
    if (!cookieHeader) return out;
    const parts = cookieHeader.split(";");
    for (const part of parts) {
        const [k, ...rest] = part.trim().split("=");
        if (!k) continue;
        out[k] = decodeURIComponent(rest.join("="));
    }
    return out;
}

function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
    let cookie = `${name}=${encodeURIComponent(value)}`;

    if (options.domain) {
        cookie += `; Domain=${options.domain}`;
    }

    if (options.path) {
        cookie += `; Path=${options.path}`;
    } else {
        cookie += `; Path=/`;
    }

    if (options.expires) {
        cookie += `; Expires=${options.expires.toUTCString()}`;
    }

    if (options.maxAge !== undefined) {
        cookie += `; Max-Age=${options.maxAge}`;
    }

    if (options.httpOnly) {
        cookie += `; HttpOnly`;
    }

    if (options.secure) {
        cookie += `; Secure`;
    }

    if (options.sameSite) {
        cookie += `; SameSite=${options.sameSite}`;
    }

    return cookie;
}

function parseQuery(searchParams: URLSearchParams): QueryObject;
function parseQuery<T extends z.ZodTypeAny>(searchParams: URLSearchParams, schema: T): z.infer<T>;
function parseQuery(searchParams: URLSearchParams, schema?: z.ZodTypeAny): any {
    const out: QueryObject = {};
    for (const [k, v] of searchParams.entries()) {
        // Handle array notation like fields[] -> fields
        const key = k.endsWith('[]') ? k.slice(0, -2) : k;
        
        if (key in out) {
            const existing = out[key];
            if (Array.isArray(existing)) out[key] = [...existing, v];
            else out[key] = [existing as string, v];
        } else out[key] = v;
    }
    if (schema) {
        return (schema as any).parse ? (schema as any).parse(out) : out;
    }
    return out;
}

function formDataToObject(fd: FormData): Record<string, any> {
    const obj: Record<string, any> = {};

    for (const [key, value] of fd.entries()) {
        setNestedValue(obj, key, value);
    }

    return obj;
}

function setNestedValue(obj: Record<string, any>, key: string, value: any): void {
    // Handle deeply nested array objects like workspace_items[0][id], workspace_items[0][type]
    const deepArrayMatch = key.match(/^(.+)\[(\d+)\]\[([^\]]+)\]$/);
    if (deepArrayMatch) {
        const [, arrayKey, index, propertyKey] = deepArrayMatch;
        const arrayIndex = parseInt(index, 10);

        if (!obj[arrayKey]) {
            obj[arrayKey] = [];
        }

        // Ensure it's an array
        if (!Array.isArray(obj[arrayKey])) {
            obj[arrayKey] = [];
        }

        // Ensure the object at the index exists
        if (!obj[arrayKey][arrayIndex]) {
            obj[arrayKey][arrayIndex] = {};
        }

        // Ensure it's an object
        if (typeof obj[arrayKey][arrayIndex] !== 'object' || Array.isArray(obj[arrayKey][arrayIndex])) {
            obj[arrayKey][arrayIndex] = {};
        }

        obj[arrayKey][arrayIndex][propertyKey] = value;
        return;
    }

    // Handle array notation like items[0], items[1]
    const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
        const [, arrayKey, index] = arrayMatch;
        const arrayIndex = parseInt(index, 10);

        if (!obj[arrayKey]) {
            obj[arrayKey] = [];
        }

        // Ensure it's an array
        if (!Array.isArray(obj[arrayKey])) {
            obj[arrayKey] = [];
        }

        // Set the value at the specific index
        obj[arrayKey][arrayIndex] = value;
        return;
    }

    // Handle nested object notation like profile[name], profile[age]
    const nestedMatch = key.match(/^(.+)\[([^\]]+)\]$/);
    if (nestedMatch) {
        const [, parentKey, nestedKey] = nestedMatch;

        if (!obj[parentKey]) {
            obj[parentKey] = {};
        }

        // Ensure it's an object
        if (typeof obj[parentKey] !== 'object' || Array.isArray(obj[parentKey])) {
            obj[parentKey] = {};
        }

        obj[parentKey][nestedKey] = value;
        return;
    }

    // Handle simple keys - check for duplicates to convert to arrays
    if (key in obj) {
        const existing = obj[key];
        if (Array.isArray(existing)) {
            obj[key] = [...existing, value];
        } else {
            obj[key] = [existing, value];
        }
    } else {
        obj[key] = value;
    }
}

function buildMatcher(path: string): { regex: RegExp | null; names: string[] } {
    if (!path.includes(":") && !path.includes("*")) return { regex: null, names: [] };
    const names: string[] = [];
    const pattern = path
        .split("/")
        .map((seg, idx, arr) => {
            if (!seg) return "";
            if (seg.startsWith(":")) {
                names.push(seg.slice(1));
                return "([^/]+)";
            }
            if (seg.startsWith("*")) {
                const name = seg.slice(1) || "wildcard";
                names.push(name);
                // wildcard must be terminal
                return idx === arr.length - 1 ? "(.*)" : "(.*)";
            }
            return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        })
        .join("/");
    const regex = new RegExp(`^${pattern}$`);
    return { regex, names };
}

function mergeHeaders(base: HeadersInit | undefined, extra: Record<string, string | string[]>): Headers {
    const h = new Headers(base);
    for (const [k, v] of Object.entries(extra)) {
        if (Array.isArray(v)) {
            // For arrays (like Set-Cookie), append each value as a separate header
            for (const value of v) {
                h.append(k, value);
            }
        } else {
            h.set(k, v);
        }
    }
    return h;
}

function toResponse(body: unknown, init?: ResponseInit): Response {
    if (body instanceof Response) return new Response(body.body, { headers: mergeHeaders(body.headers, {}), status: body.status, statusText: body.statusText });
    if (
        typeof body === "string" ||
        body instanceof Uint8Array ||
        body instanceof ArrayBuffer ||
        body instanceof Blob ||
        body instanceof ReadableStream
    ) {
        return new Response(body as BodyInit, { ...init, headers: init?.headers });
    }
    // Fallback: stringify unknown values
    return new Response(String(body), { ...init, headers: init?.headers });
}

export default class BXO {
    private routes: InternalRoute[] = [];
    private serveOptions: ServeOptions;
    public server?: ReturnType<typeof Bun.serve>;

    // Lifecycle hooks
    protected beforeRequestHooks: BeforeRequestHook[] = [];
    protected afterRequestHooks: AfterRequestHook[] = [];
    protected beforeResponseHooks: BeforeResponseHook[] = [];
    protected onErrorHooks: OnErrorHook[] = [];

    constructor(options?: { serve?: ServeOptions }) {
        this.serveOptions = options?.serve ?? {};
    }

    getRoutes(): InternalRoute[] {
        return this.routes;
    }

    getBXO(): this {
        return this;
    }

    use(plugin: BXO): this {
        // Merge routes from another BXO instance
        this.routes.push(...plugin.routes);

        // Merge lifecycle hooks from plugin
        this.beforeRequestHooks.push(...plugin.beforeRequestHooks);
        this.afterRequestHooks.push(...plugin.afterRequestHooks);
        this.beforeResponseHooks.push(...plugin.beforeResponseHooks);
        this.onErrorHooks.push(...plugin.onErrorHooks);

        return this;
    }

    get<P extends string>(path: P, handler: Handler<P, undefined>): this;
    get<P extends string, S extends RouteSchema>(path: P, handler: Handler<P, S>, schema: S): this;
    get<P extends string, S extends RouteSchema | undefined>(path: P, handler: Handler<P, S>, schema?: S): this {
        return this.add("GET", path, handler as AnyHandler, schema as RouteSchema | undefined);
    }

    post<P extends string>(path: P, handler: Handler<P, undefined>): this;
    post<P extends string, S extends RouteSchema>(path: P, handler: Handler<P, S>, schema: S): this;
    post<P extends string, S extends RouteSchema | undefined>(path: P, handler: Handler<P, S>, schema?: S): this {
        return this.add("POST", path, handler as AnyHandler, schema as RouteSchema | undefined);
    }

    put<P extends string>(path: P, handler: Handler<P, undefined>): this;
    put<P extends string, S extends RouteSchema>(path: P, handler: Handler<P, S>, schema: S): this;
    put<P extends string, S extends RouteSchema | undefined>(path: P, handler: Handler<P, S>, schema?: S): this {
        return this.add("PUT", path, handler as AnyHandler, schema as RouteSchema | undefined);
    }

    patch<P extends string>(path: P, handler: Handler<P, undefined>): this;
    patch<P extends string, S extends RouteSchema>(path: P, handler: Handler<P, S>, schema: S): this;
    patch<P extends string, S extends RouteSchema | undefined>(path: P, handler: Handler<P, S>, schema?: S): this {
        return this.add("PATCH", path, handler as AnyHandler, schema as RouteSchema | undefined);
    }

    delete<P extends string>(path: P, handler: Handler<P, undefined>): this;
    delete<P extends string, S extends RouteSchema>(path: P, handler: Handler<P, S>, schema: S): this;
    delete<P extends string, S extends RouteSchema | undefined>(path: P, handler: Handler<P, S>, schema?: S): this {
        return this.add("DELETE", path, handler as AnyHandler, schema as RouteSchema | undefined);
    }

    ws<P extends string>(path: P, handler: WebSocketHandler): this {
        return this.addWebSocket("WS", path, handler);
    }

    // default can accept a handler OR static content (including Bun HTML bundle)
    default<P extends string>(path: P, handler: Handler<P, undefined>): this;
    default<P extends string, S extends RouteSchema>(path: P, handler: (req: Request) => Response, schema: S): this;
    default<P extends string>(path: P, content: Bun.HTMLBundle): this;
    default<P extends string, S extends RouteSchema | undefined>(path: P, arg2: unknown, schema?: S): this {
        return this.add("DEFAULT", path, arg2 as AnyHandler, schema as RouteSchema | undefined);
    }

    start(): void {
        // Check if we have any WebSocket routes
        const hasWebSocketRoutes = this.routes.some(r => r.method === "WS");

        // Build a basic routes map for Bun's native routes (exact paths only)
        const nativeRoutes: Record<string, Record<string, (req: Request) => Promise<Response> | Response>> = {};

        for (const r of this.routes) {
            switch (r.method) {
                case "DEFAULT":
                    nativeRoutes[r.path] = r.handler as any;
                    break;
                case "WS":
                    // Skip WebSocket routes in native routes - they'll be handled in websocket config
                    break;
                default:
                    nativeRoutes[r.path] ||= {} as Record<string, (req: Request) => Promise<Response> | Response>;
                    nativeRoutes[r.path][r.method] = (req: Request) => this.dispatch(r, req);
                    break;
            }
        }

        this.serveOptions.port = this.serveOptions.port === undefined ? 3000 : this.serveOptions.port;

        // Create WebSocket configuration if we have WebSocket routes
        const websocketConfig = hasWebSocketRoutes ? {
            message: (ws: Bun.ServerWebSocket<WebSocketData>, message: string | Buffer) => {
                this.handleWebSocketMessage(ws, message);
            },
            open: (ws: Bun.ServerWebSocket<WebSocketData>) => {
                this.handleWebSocketOpen(ws);
            },
            close: (ws: Bun.ServerWebSocket<WebSocketData>, code: number, reason: string) => {
                this.handleWebSocketClose(ws, code, reason);
            },
            drain: (ws: Bun.ServerWebSocket<WebSocketData>) => {
                this.handleWebSocketDrain(ws);
            },
            ping: (ws: Bun.ServerWebSocket<WebSocketData>, data: Buffer) => {
                this.handleWebSocketPing(ws, data);
            },
            pong: (ws: Bun.ServerWebSocket<WebSocketData>, data: Buffer) => {
                this.handleWebSocketPong(ws, data);
            }
        } : undefined;

        if (hasWebSocketRoutes) {
            this.server = Bun.serve({
                ...this.serveOptions,
                routes: nativeRoutes as any,
                websocket: websocketConfig as any,
                fetch: (req: Request, server: Bun.Server) => {
                    // Handle WebSocket upgrade requests
                    if (req.headers.get("upgrade") === "websocket") {
                        const url = new URL(req.url);
                        const wsRoute = this.findWebSocketRoute(url.pathname);
                        if (wsRoute) {
                            // Capture client information during handshake
                            const shortId = Math.random().toString(36).substr(2, 8);
                            const connectionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                            const cookieHeader = req.headers.get("cookie");
                            const authHeader = req.headers.get("authorization");
                            
                            // Parse search parameters from URL
                            const searchParams: Record<string, string | string[]> = {};
                            for (const [key, value] of url.searchParams.entries()) {
                                if (key in searchParams) {
                                    const existing = searchParams[key];
                                    if (Array.isArray(existing)) {
                                        existing.push(value);
                                    } else {
                                        searchParams[key] = [existing as string, value];
                                    }
                                } else {
                                    searchParams[key] = value;
                                }
                            }
                            
                            const baseClientInfo = {
                                id: shortId, // Short, easy-to-use ID
                                path: url.pathname,
                                ip: req.headers.get("x-forwarded-for") || 
                                    req.headers.get("x-real-ip") || 
                                    "unknown",
                                userAgent: req.headers.get("user-agent") || "unknown",
                                origin: req.headers.get("origin") || "unknown",
                                host: req.headers.get("host") || "unknown",
                                connectionId: connectionId, // Longer, more detailed ID
                                cookies: cookieHeader ? parseCookies(cookieHeader) : {},
                                searchParams: searchParams, // Query parameters from URL
                                authorization: authHeader || undefined // Authorization header
                            };

                            // Create simple WebSocket data object
                            const clientInfo: WebSocketData = {
                                ...baseClientInfo
                            };
                            
                            const success = server.upgrade(req, {
                                data: clientInfo
                            });
                            if (success) {
                                return; // WebSocket upgrade successful
                            }
                        }
                    }

                    // Handle regular HTTP requests
                    return this.dispatchAny(req, nativeRoutes);
                }
            } as any);
        } else {
            this.server = Bun.serve({
                ...this.serveOptions,
                routes: nativeRoutes as any,
                fetch: (req: Request) => {
                    return this.dispatchAny(req, nativeRoutes);
                }
            });
        }
    }

    // Lifecycle hook methods
    beforeRequest(hook: BeforeRequestHook): this {
        this.beforeRequestHooks.push(hook);
        return this;
    }

    afterRequest(hook: AfterRequestHook): this {
        this.afterRequestHooks.push(hook);
        return this;
    }

    beforeResponse(hook: BeforeResponseHook): this {
        this.beforeResponseHooks.push(hook);
        return this;
    }

    onError(hook: OnErrorHook): this {
        this.onErrorHooks.push(hook);
        return this;
    }

    // WebSocket handler methods
    private findWebSocketRoute(pathname: string): InternalRoute | null {
        for (const route of this.routes) {
            if (route.method === "WS") {
                if (route.matcher === null) {
                    // Exact match
                    if (route.path === pathname) {
                        return route;
                    }
                } else {
                    // Pattern match
                    const match = pathname.match(route.matcher);
                    if (match) {
                        return route;
                    }
                }
            }
        }
        return null;
    }

    private handleWebSocketMessage(ws: Bun.ServerWebSocket<WebSocketData>, message: string | Buffer): void {
        const route = this.findWebSocketRoute(ws.data?.path || "");
        if (route?.websocketHandler?.message) {
            try {
                (route.websocketHandler as any).message(ws, message);
            } catch (error) {
                console.error("WebSocket message handler error:", error);
            }
        }
    }

    private handleWebSocketOpen(ws: Bun.ServerWebSocket<WebSocketData>): void {
        const route = this.findWebSocketRoute(ws.data?.path || "");
        if (route?.websocketHandler?.open) {
            try {
                (route.websocketHandler as any).open(ws);
            } catch (error) {
                console.error("WebSocket open handler error:", error);
            }
        }
    }

    private handleWebSocketClose(ws: Bun.ServerWebSocket<WebSocketData>, code: number, reason: string): void {
        const route = this.findWebSocketRoute(ws.data?.path || "");
        if (route?.websocketHandler?.close) {
            try {
                (route.websocketHandler as any).close(ws, code, reason);
            } catch (error) {
                console.error("WebSocket close handler error:", error);
            }
        }
    }

    private handleWebSocketDrain(ws: Bun.ServerWebSocket<WebSocketData>): void {
        const route = this.findWebSocketRoute(ws.data?.path || "");
        if (route?.websocketHandler?.drain) {
            try {
                (route.websocketHandler as any).drain(ws);
            } catch (error) {
                console.error("WebSocket drain handler error:", error);
            }
        }
    }

    private handleWebSocketPing(ws: Bun.ServerWebSocket<WebSocketData>, data: Buffer): void {
        const route = this.findWebSocketRoute(ws.data?.path || "");
        if (route?.websocketHandler?.ping) {
            try {
                (route.websocketHandler as any).ping(ws, data);
            } catch (error) {
                console.error("WebSocket ping handler error:", error);
            }
        }
    }

    private handleWebSocketPong(ws: Bun.ServerWebSocket<WebSocketData>, data: Buffer): void {
        const route = this.findWebSocketRoute(ws.data?.path || "");
        if (route?.websocketHandler?.pong) {
            try {
                (route.websocketHandler as any).pong(ws, data);
            } catch (error) {
                console.error("WebSocket pong handler error:", error);
            }
        }
    }

    // Internal
    private add(method: Method | "DEFAULT", path: string, handler: AnyHandler, schema?: RouteSchema): this {
        const { regex, names } = buildMatcher(path);
        this.routes.push({ method, path, handler, matcher: regex, paramNames: names, schema });
        return this;
    }

    private addWebSocket(method: "WS", path: string, handler: WebSocketHandler): this {
        const { regex, names } = buildMatcher(path);
        this.routes.push({ method, path, handler: () => new Response("WebSocket route", { status: 400 }), matcher: regex, paramNames: names, websocketHandler: handler });
        return this;
    }

    private async dispatch(route: InternalRoute, req: Request, pathname?: string): Promise<Response> {
        // Run beforeRequest hooks
        for (const hook of this.beforeRequestHooks) {
            try {
                const result = await hook(req);
                if (result instanceof Response) {
                    return result;
                }
                if (result instanceof Request) {
                    req = result;
                }
            } catch (error) {
                // Run error hooks
                for (const errorHook of this.onErrorHooks) {
                    try {
                        const errorResponse = await errorHook(error as Error, req);
                        if (errorResponse instanceof Response) {
                            return errorResponse;
                        }
                    } catch {
                        // Ignore errors in error hooks
                    }
                }
                return new Response("Internal Server Error", { status: 500 });
            }
        }

        const url = new URL(req.url);
        const actualPathname = pathname || url.pathname;
        const params = this.extractParams(route, actualPathname);
        let queryObj: any;
        let bodyObj: any = undefined;
        const cookieObj = parseCookies(req.headers.get("cookie"));
        const headerObj = toHeaderObject(req.headers);

        // Parse query using schema if provided
        try {
            queryObj = route.schema?.query ? parseQuery(url.searchParams, route.schema.query as any) : parseQuery(url.searchParams);
        } catch (err: any) {
            const payload = err?.issues ? { error: "Validation Error", issues: err.issues } : { error: "Validation Error", issues: [], message: err.message };
            return new Response(JSON.stringify(payload), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        // Parse body (best-effort) and validate with schema if provided
        try {
            const contentType = req.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                const raw = await req.json().catch(() => undefined);
                bodyObj = route.schema?.body ? (route.schema.body as any).parse(raw) : raw;
            } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
                const fd = await req.formData().catch(() => undefined);
                const raw = formDataToObject(fd || new FormData());
                bodyObj = route.schema?.body ? (route.schema.body as any).parse(raw) : raw;
            } else if (contentType.includes("text/")) {
                const raw = await req.text().catch(() => undefined);
                bodyObj = route.schema?.body ? (route.schema.body as any).parse(raw) : raw;
            } else if (contentType) {
                // Unknown content-type: provide ArrayBuffer
                const raw = await req.arrayBuffer().catch(() => undefined);
                bodyObj = route.schema?.body ? (route.schema.body as any).parse(raw) : raw;
            } else {
                // No content-type: try JSON then text, otherwise undefined
                try {
                    const raw = await req.json().catch(() => undefined);
                    bodyObj = route.schema?.body ? (route.schema.body as any).parse(raw) : raw;
                } catch {
                    try {
                        const raw = await req.text().catch(() => undefined);
                        bodyObj = route.schema?.body ? (route.schema.body as any).parse(raw) : raw;
                    } catch {
                        bodyObj = undefined;
                    }
                }
            }
            if (!bodyObj && route.schema?.body) {
                return new Response(JSON.stringify({ error: "Body is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
            }
        } catch (err: any) {
            const payload = err?.issues ? { error: "Validation Error", issues: err.issues } : { error: "Validation Error", issues: [], message: err.message };
            return new Response(JSON.stringify(payload), { status: 400, headers: { "Content-Type": "application/json" } });
        }



        // Prepare ctx with lazy helpers and header merging
        const ctx: Context<any, any> = {
            request: req,
            params,
            query: queryObj,
            headers: headerObj,
            cookies: cookieObj,
            body: bodyObj,
            set: {
                headers: {},
                cookie: (name: string, value: string, options: CookieOptions = {}) => {
                    const cookieString = serializeCookie(name, value, options);
                    const existingCookies = ctx.set.headers["Set-Cookie"];
                    if (existingCookies) {
                        if (Array.isArray(existingCookies)) {
                            existingCookies.push(cookieString);
                        } else {
                            ctx.set.headers["Set-Cookie"] = [existingCookies, cookieString];
                        }
                    } else {
                        ctx.set.headers["Set-Cookie"] = [cookieString];
                    }
                }
            },
            json: (data, status = 200) => {
                // Response validation if declared
                if (route.schema?.response?.[status]) {
                    const sch = route.schema.response[status]!;
                    const res = (sch as any).safeParse ? (sch as any).safeParse(data) : { success: true };
                    if (!res.success) {
                        return new Response(JSON.stringify({ error: "Invalid response", issues: res.error?.issues ?? [] }), { status: 500, headers: { "Content-Type": "application/json" } });
                    }
                }
                return new Response(JSON.stringify(data), {
                    status,
                    headers: { "Content-Type": "application/json" }
                });
            },
            text: (data, status = 200) => {
                if (route.schema?.response?.[status]) {
                    const sch = route.schema.response[status]!;
                    const res = (sch as any).safeParse ? (sch as any).safeParse(data) : { success: true };
                    if (!res.success) {
                        return new Response(JSON.stringify({ error: "Invalid response", issues: res.error?.issues ?? [] }), { status: 500, headers: { "Content-Type": "application/json" } });
                    }
                }
                return new Response(String(data), {
                    status,
                    headers: { "Content-Type": "text/plain" }
                });
            },
            html: (data, status = 200) => {
                if (route.schema?.response?.[status]) {
                    const sch = route.schema.response[status]!;
                    const res = (sch as any).safeParse ? (sch as any).safeParse(data) : { success: true };
                    if (!res.success) {
                        return new Response(JSON.stringify({ error: "Invalid response", issues: res.error?.issues ?? [] }), { status: 500, headers: { "Content-Type": "application/json" } });
                    }
                }
                return new Response(String(data), {
                    status,
                    headers: { "Content-Type": "text/html; charset=utf-8" }
                });
            },
            status: (status, data) => {
                // Response validation if declared
                if (route.schema?.response?.[status]) {
                    const sch = route.schema.response[status]!;
                    const res = (sch as any).safeParse ? (sch as any).safeParse(data) : { success: true };
                    if (!res.success) {
                        return new Response(JSON.stringify({ error: "Invalid response", issues: res.error?.issues ?? [] }), { status: 500, headers: { "Content-Type": "application/json" } });
                    }
                }

                return toResponse(data, { status });
            },
            redirect: (url, status = 302) => {
                return new Response(null, {
                    status,
                    headers: {
                        "Location": url
                    }
                });
            }
        };

        // Validation
        if (route.schema) {
            try {
                if (route.schema.headers) {
                    const headerSchema = route.schema.headers as any;
                    if (headerSchema.passthrough) {
                        headerSchema.passthrough().parse(headerObj);
                    } else {
                        headerSchema.parse(headerObj);
                    }
                }
                if (route.schema.cookies) {
                    const cookieSchema = route.schema.cookies as any;
                    if (cookieSchema.passthrough) {
                        cookieSchema.passthrough().parse(cookieObj);
                    } else {
                        cookieSchema.parse(cookieObj);
                    }
                }
            } catch (err: any) {
                const payload = err?.issues ? { error: "Validation Error", issues: err.issues } : { error: "Validation Error", issues: [], message: err.message };
                return new Response(JSON.stringify(payload), { status: 400, headers: { "Content-Type": "application/json" } });
            }
        }

        const result = await route.handler(ctx, this);
        const resp = toResponse(result);
        // Merge ctx.set.headers into final response
        let merged = new Response(resp.body, {
            status: resp.status,
            statusText: resp.statusText,
            headers: mergeHeaders(resp.headers, ctx.set.headers)
        });

        // Run beforeResponse hooks
        for (const hook of this.beforeResponseHooks) {
            try {
                const result = await hook(merged, ctx);
                if (result instanceof Response) {
                    merged = result;
                }
            } catch (error) {
                // Run error hooks
                for (const errorHook of this.onErrorHooks) {
                    try {
                        const errorResponse = await errorHook(error as Error, req, ctx);
                        if (errorResponse instanceof Response) {
                            return errorResponse;
                        }
                    } catch {
                        // Ignore errors in error hooks
                    }
                }
                return new Response("Internal Server Error", { status: 500 });
            }
        }

        // Run afterRequest hooks
        for (const hook of this.afterRequestHooks) {
            try {
                const result = await hook(req, merged, ctx);
                if (result instanceof Response) {
                    merged = result;
                }
            } catch (error) {
                // Run error hooks
                for (const errorHook of this.onErrorHooks) {
                    try {
                        const errorResponse = await errorHook(error as Error, req, ctx);
                        if (errorResponse instanceof Response) {
                            return errorResponse;
                        }
                    } catch {
                        // Ignore errors in error hooks
                    }
                }
                return new Response("Internal Server Error", { status: 500 });
            }
        }

        return merged;
    }

    private async dispatchAny(req: Request, nativeRoutes: Record<string, Record<string, (req: Request) => Promise<Response> | Response>>): Promise<Response> {
        // Run beforeRequest hooks for unmatched routes
        for (const hook of this.beforeRequestHooks) {
            try {
                const result = await hook(req);
                if (result instanceof Response) {
                    return result;
                }
                if (result instanceof Request) {
                    req = result;
                }
            } catch (error) {
                // Run error hooks
                for (const errorHook of this.onErrorHooks) {
                    try {
                        const errorResponse = await errorHook(error as Error, req);
                        if (errorResponse instanceof Response) {
                            return errorResponse;
                        }
                    } catch {
                        // Ignore errors in error hooks
                    }
                }
                return new Response("Internal Server Error", { status: 500 });
            }
        }

        const url = new URL(req.url);
        const method = req.method.toUpperCase() as Method;

        // 1) If native routes contain exact match, prefer that
        const exact = nativeRoutes[url.pathname];
        if (exact) {
            const h = exact[method] || exact["DEFAULT"];
            if (h) return await h(req);
        }

        // 1.5) Try URL-decoded pathname for exact matches
        const decodedPathname = decodeURIComponent(url.pathname);
        if (decodedPathname !== url.pathname) {
            const exactDecoded = nativeRoutes[decodedPathname];
            if (exactDecoded) {
                const h = exactDecoded[method] || exactDecoded["DEFAULT"];
                if (h) return await h(req);
            }
        }

        // 2) Fallback to our matcher list
        for (const r of this.routes) {
            if (r.matcher === null) continue; // exact paths handled above
            if (r.method !== method && r.method !== "DEFAULT") continue;
            const m = url.pathname.match(r.matcher);
            if (m) return this.dispatch(r, req, url.pathname);
        }

        // 2.5) Try URL-decoded pathname for pattern matches
        if (decodedPathname !== url.pathname) {
            for (const r of this.routes) {
                if (r.matcher === null) continue; // exact paths handled above
                if (r.method !== method && r.method !== "DEFAULT") continue;
                const m = decodedPathname.match(r.matcher);
                if (m) return this.dispatch(r, req, decodedPathname);
            }
        }

        // Create 404 response
        let notFoundResponse = new Response("Not Found", { status: 404 });

        // Run beforeResponse hooks for 404
        for (const hook of this.beforeResponseHooks) {
            try {
                const result = await hook(notFoundResponse);
                if (result instanceof Response) {
                    notFoundResponse = result;
                }
            } catch (error) {
                // Run error hooks
                for (const errorHook of this.onErrorHooks) {
                    try {
                        const errorResponse = await errorHook(error as Error, req);
                        if (errorResponse instanceof Response) {
                            return errorResponse;
                        }
                    } catch {
                        // Ignore errors in error hooks
                    }
                }
                return new Response("Internal Server Error", { status: 500 });
            }
        }

        // Run afterRequest hooks for 404
        for (const hook of this.afterRequestHooks) {
            try {
                const result = await hook(req, notFoundResponse);
                if (result instanceof Response) {
                    notFoundResponse = result;
                }
            } catch (error) {
                // Run error hooks
                for (const errorHook of this.onErrorHooks) {
                    try {
                        const errorResponse = await errorHook(error as Error, req);
                        if (errorResponse instanceof Response) {
                            return errorResponse;
                        }
                    } catch {
                        // Ignore errors in error hooks
                    }
                }
                return new Response("Internal Server Error", { status: 500 });
            }
        }

        return notFoundResponse;
    }

    private extractParams(route: InternalRoute, pathname: string): Record<string, string> {
        if (!route.matcher) return {};
        const match = pathname.match(route.matcher);
        if (!match) return {};
        const params: Record<string, string> = {};
        for (let i = 0; i < route.paramNames.length; i++) {
            const name = route.paramNames[i];
            const value = match[i + 1] ?? "";
            params[name] = decodeURIComponent(value);
        }
        return params;
    }
}

export { z }

export function createRoute<P extends string, S extends RouteSchema | undefined>(
    handler: Handler<P, S>,
    schema?: S
): {
    handler: Handler<P, S>;
    schema: S | undefined;
} {
    return {
        handler,
        schema
    };
}