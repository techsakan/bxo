import BXO from "../src/index";
import { cors } from "../plugins";

const app = new BXO();

// Use the CORS plugin
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Add some routes
app.get("/api/users", async (ctx) => {
  return ctx.json([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" }
  ]);
});

app.post("/api/users", async (ctx) => {
  const user = ctx.body as { name: string };
  return ctx.json({ id: 3, name: user.name }, 201);
});

// Custom beforeRequest hook example
app.beforeRequest(async (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  return req; // Continue with the request
});

// Custom afterRequest hook example
app.afterRequest(async (req, res) => {
  console.log(`[${new Date().toISOString()}] Response: ${res.status}`);
  return res; // Return the modified response
});

// Custom error handler
app.onError(async (error, req) => {
  console.error(`Error handling ${req.method} ${req.url}:`, error);
  return new Response("Something went wrong", { status: 500 });
});

// Start the server
app.start();

console.log("Server running on http://localhost:3000");
console.log("Try making a CORS request from another origin!");
