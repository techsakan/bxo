import BXO from "../src/index";
import { z } from "zod";

const app = new BXO();

// Define Zod schema for the form data structure
const UserFormSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    is_active: z.string().transform(val => val === "1"),
    profile: z.object({
        name: z.string()
    }),
    id: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    idx: z.string().transform(val => parseInt(val, 10))
});

// Route to handle multipart/form-data with nested objects
app.post("/users", async (ctx) => {
    // The form data is automatically parsed into nested objects
    // ctx.body will contain the structured data based on the schema
    console.log("Parsed form data:", ctx.body);

    return ctx.json({
        message: "User created successfully",
        data: ctx.body
    });
}, {
    body: UserFormSchema,
    detail: {
        summary: "Create user with multipart/form-data",
        description: "Handles form data with nested objects and arrays",
        tags: ["Users"]
    }
});

// Example with arrays
const ArrayFormSchema = z.object({
    items: z.array(z.string()),
    tags: z.array(z.string()),
    profile: z.object({
        name: z.string(),
        age: z.string().transform(val => parseInt(val, 10))
    })
});

app.post("/items", async (ctx) => {
    console.log("Parsed array form data:", ctx.body);

    return ctx.json({
        message: "Items processed successfully",
        data: ctx.body
    });
}, {
    body: ArrayFormSchema,
    detail: {
        summary: "Process items with arrays",
        description: "Handles form data with arrays like items[0], items[1]",
        tags: ["Items"]
    }
});

// Example with deep nested array objects (like workspace_items[0][id])
const WorkspaceFormSchema = z.object({
    id: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    updated_by: z.string(),
    doc_status: z.string().transform(val => parseInt(val, 10)),
    idx: z.string().transform(val => parseInt(val, 10)),
    workspace_items: z.array(z.object({
        id: z.string(),
        type: z.string(),
        value: z.string(),
        options: z.string(),
        workspaceId: z.string(),
        owner: z.string(),
        created_at: z.string(),
        updated_at: z.string(),
        created_by: z.string(),
        updated_by: z.string(),
        doc_status: z.string().transform(val => parseInt(val, 10)),
        label: z.string()
    }))
});

app.post("/workspace", async (ctx) => {
    console.log("Parsed workspace form data:", ctx.body);

    return ctx.json({
        message: "Workspace processed successfully",
        data: ctx.body
    });
}, {
    body: WorkspaceFormSchema,
    detail: {
        summary: "Process workspace with deep nested array objects",
        description: "Handles form data like workspace_items[0][id], workspace_items[0][type]",
        tags: ["Workspace"]
    }
});

// Test route to show how the parsing works
app.get("/test-parsing", async (ctx) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Multipart Form Data Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .form-group { margin: 20px 0; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea { width: 300px; padding: 8px; margin-bottom: 10px; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; cursor: pointer; }
        .result { margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Multipart Form Data Parsing Test</h1>
    
    <h2>Test 1: Nested Objects (like your image example)</h2>
    <form id="userForm" enctype="multipart/form-data">
        <div class="form-group">
            <label>Name:</label>
            <input type="text" name="name" value="John Doe" required>
        </div>
        <div class="form-group">
            <label>Email:</label>
            <input type="email" name="email" value="john@example.com" required>
        </div>
        <div class="form-group">
            <label>Password:</label>
            <input type="password" name="password" value="password123" required>
        </div>
        <div class="form-group">
            <label>Is Active:</label>
            <input type="text" name="is_active" value="1">
        </div>
        <div class="form-group">
            <label>Profile Name:</label>
            <input type="text" name="profile[name]" value="John Profile" required>
        </div>
        <div class="form-group">
            <label>ID:</label>
            <input type="text" name="id" value="UUID()">
        </div>
        <div class="form-group">
            <label>Created At:</label>
            <input type="text" name="created_at" value="NOW()">
        </div>
        <div class="form-group">
            <label>Updated At:</label>
            <input type="text" name="updated_at" value="NOW()">
        </div>
        <div class="form-group">
            <label>Index:</label>
            <input type="text" name="idx" value="0">
        </div>
        <button type="submit">Submit User Form</button>
    </form>
    
    <h2>Test 2: Arrays</h2>
    <form id="itemsForm" enctype="multipart/form-data">
        <div class="form-group">
            <label>Item 1:</label>
            <input type="text" name="items[0]" value="Apple">
        </div>
        <div class="form-group">
            <label>Item 2:</label>
            <input type="text" name="items[1]" value="Banana">
        </div>
        <div class="form-group">
            <label>Item 3:</label>
            <input type="text" name="items[2]" value="Cherry">
        </div>
        <div class="form-group">
            <label>Tag 1:</label>
            <input type="text" name="tags[0]" value="fruit">
        </div>
        <div class="form-group">
            <label>Tag 2:</label>
            <input type="text" name="tags[1]" value="healthy">
        </div>
        <div class="form-group">
            <label>Profile Name:</label>
            <input type="text" name="profile[name]" value="Test Profile">
        </div>
        <div class="form-group">
            <label>Profile Age:</label>
            <input type="text" name="profile[age]" value="25">
        </div>
        <button type="submit">Submit Items Form</button>
    </form>
    
    <h2>Test 3: Deep Nested Array Objects (workspace_items[0][id])</h2>
    <form id="workspaceForm" enctype="multipart/form-data">
        <div class="form-group">
            <label>ID:</label>
            <input type="text" name="id" value="01993f54-758e-7000-9f98-4533a7cf8ce9">
        </div>
        <div class="form-group">
            <label>Created At:</label>
            <input type="text" name="created_at" value="2025-09-13 02:08:43">
        </div>
        <div class="form-group">
            <label>Updated At:</label>
            <input type="text" name="updated_at" value="2025-09-13 02:08:43">
        </div>
        <div class="form-group">
            <label>Updated By:</label>
            <input type="text" name="updated_by" value="01995120-fae9-7000-8d46-8f3502e901b6">
        </div>
        <div class="form-group">
            <label>Doc Status:</label>
            <input type="text" name="doc_status" value="0">
        </div>
        <div class="form-group">
            <label>Index:</label>
            <input type="text" name="idx" value="0">
        </div>
        
        <h3>Workspace Item 1:</h3>
        <div class="form-group">
            <label>Item ID:</label>
            <input type="text" name="workspace_items[0][id]" value="temp_1758097169599">
        </div>
        <div class="form-group">
            <label>Item Type:</label>
            <input type="text" name="workspace_items[0][type]" value="Link - URL">
        </div>
        <div class="form-group">
            <label>Item Value:</label>
            <input type="text" name="workspace_items[0][value]" value="asd">
        </div>
        <div class="form-group">
            <label>Item Options:</label>
            <input type="text" name="workspace_items[0][options]" value="asdasd">
        </div>
        <div class="form-group">
            <label>Item Label:</label>
            <input type="text" name="workspace_items[0][label]" value="asdasd">
        </div>
        
        <h3>Workspace Item 2:</h3>
        <div class="form-group">
            <label>Item ID:</label>
            <input type="text" name="workspace_items[1][id]" value="temp_1758097169600">
        </div>
        <div class="form-group">
            <label>Item Type:</label>
            <input type="text" name="workspace_items[1][type]" value="Text">
        </div>
        <div class="form-group">
            <label>Item Value:</label>
            <input type="text" name="workspace_items[1][value]" value="Another item">
        </div>
        <div class="form-group">
            <label>Item Options:</label>
            <input type="text" name="workspace_items[1][options]" value="More options">
        </div>
        <div class="form-group">
            <label>Item Label:</label>
            <input type="text" name="workspace_items[1][label]" value="Second item">
        </div>
        
        <button type="submit">Submit Workspace Form</button>
    </form>
    
    <div id="result" class="result" style="display: none;">
        <h3>Result:</h3>
        <pre id="resultContent"></pre>
    </div>

    <script>
        async function submitForm(form, endpoint) {
            const formData = new FormData(form);
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                document.getElementById('result').style.display = 'block';
                document.getElementById('resultContent').textContent = JSON.stringify(result, null, 2);
            } catch (error) {
                document.getElementById('result').style.display = 'block';
                document.getElementById('resultContent').textContent = 'Error: ' + error.message;
            }
        }
        
        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            submitForm(e.target, '/users');
        });
        
        document.getElementById('itemsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            submitForm(e.target, '/items');
        });
        
        document.getElementById('workspaceForm').addEventListener('submit', (e) => {
            e.preventDefault();
            submitForm(e.target, '/workspace');
        });
    </script>
</body>
</html>
  `;

    return new Response(html, {
        headers: { "Content-Type": "text/html" }
    });
});

app.get("/test-file", async (ctx) => {
    if (!ctx.query.file) {
        return new Response("File not found", { status: 404 });
    }
    return Bun.file("test.txt");
});

app.start();

console.log("🚀 Server running at http://localhost:3000");
console.log("📝 Test the multipart parsing at http://localhost:3000/test-parsing");
