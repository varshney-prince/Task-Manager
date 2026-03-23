import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let currentExcelFile = path.join(process.cwd(), "projects.xlsx");

// Helper functions to safely read/write Excel files regardless of the loaded xlsx build
function readExcelFile(filePath: string) {
  const buffer = fs.readFileSync(filePath);
  return XLSX.read(buffer, { type: "buffer" });
}

function writeExcelFile(workbook: any, filePath: string) {
  const data = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  fs.writeFileSync(filePath, Buffer.from(data));
}

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ensure default Excel file exists with headers
function ensureExcelExists(filePath: string) {
  if (!fs.existsSync(filePath)) {
    const wb = XLSX.utils.book_new();
    
    // Projects Sheet
    const wsProjects = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(wsProjects, [["id", "name", "description", "status", "createdAt"]], { origin: "A1" });
    XLSX.utils.book_append_sheet(wb, wsProjects, "Projects");
    
    // Tasks Sheet
    const wsTasks = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(wsTasks, [["id", "title", "description", "status", "priority", "project", "category", "time", "isCompleted", "createdAt"]], { origin: "A1" });
    XLSX.utils.book_append_sheet(wb, wsTasks, "Tasks");
    
    writeExcelFile(wb, filePath);
  } else {
    // Check if Sheets exist, if not add them
    const workbook = readExcelFile(filePath);
    let modified = false;
    
    if (!workbook.SheetNames.includes("Projects")) {
      const ws = XLSX.utils.json_to_sheet([]);
      XLSX.utils.sheet_add_aoa(ws, [["id", "name", "description", "status", "createdAt"]], { origin: "A1" });
      XLSX.utils.book_append_sheet(workbook, ws, "Projects");
      modified = true;
    }
    
    if (!workbook.SheetNames.includes("Tasks")) {
      const ws = XLSX.utils.json_to_sheet([]);
      XLSX.utils.sheet_add_aoa(ws, [["id", "title", "description", "status", "priority", "project", "category", "time", "isCompleted", "createdAt"]], { origin: "A1" });
      XLSX.utils.book_append_sheet(workbook, ws, "Tasks");
      modified = true;
    }
    
    if (modified) {
      writeExcelFile(workbook, filePath);
    }
  }
}

ensureExcelExists(currentExcelFile);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/database-status", (req, res) => {
    res.json({ 
      exists: fs.existsSync(currentExcelFile),
      path: currentExcelFile
    });
  });

  app.post("/api/create-excel", (req, res) => {
    try {
      const { folderPath, fileName } = req.body;
      const targetFolder = folderPath || process.cwd();
      const targetFile = fileName || "projects.xlsx";
      const fullPath = path.isAbsolute(targetFolder) ? path.join(targetFolder, targetFile) : path.join(process.cwd(), targetFolder, targetFile);

      if (fs.existsSync(fullPath)) {
        return res.status(400).json({ error: "File already exists at this location." });
      }

      // Ensure directory exists
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      ensureExcelExists(fullPath);
      currentExcelFile = fullPath;

      res.json({ message: "Excel file created successfully", path: fullPath });
    } catch (error) {
      console.error("Create error:", error);
      res.status(500).json({ error: "Failed to create Excel file" });
    }
  });

  app.post("/api/set-database-path", (req, res) => {
    const { path: newPath } = req.body;
    if (!newPath) return res.status(400).json({ error: "Path is required" });
    
    const fullPath = path.isAbsolute(newPath) ? newPath : path.join(process.cwd(), newPath);
    currentExcelFile = fullPath;
    res.json({ message: "Database path updated", path: currentExcelFile, exists: fs.existsSync(currentExcelFile) });
  });

  // Projects Endpoints
  app.get("/api/projects", (req, res) => {
    try {
      if (!fs.existsSync(currentExcelFile)) {
        return res.json([]);
      }
      const workbook = readExcelFile(currentExcelFile);
      const sheetName = "Projects";
      if (!workbook.SheetNames.includes(sheetName)) return res.json([]);
      
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to read projects" });
    }
  });

  app.post("/api/projects", (req, res) => {
    try {
      const { name, description, status } = req.body;
      if (!name) return res.status(400).json({ error: "Name is required" });

      ensureExcelExists(currentExcelFile);
      const workbook = readExcelFile(currentExcelFile);
      const sheetName = "Projects";
      const worksheet = workbook.Sheets[sheetName];
      const data: any[] = XLSX.utils.sheet_to_json(worksheet);

      const newProject = {
        id: Date.now().toString(),
        name,
        description: description || "",
        status: status || "Active",
        createdAt: new Date().toISOString(),
      };

      data.push(newProject);
      const newWs = XLSX.utils.json_to_sheet(data);
      workbook.Sheets[sheetName] = newWs;
      writeExcelFile(workbook, currentExcelFile);

      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).json({ error: "Failed to save project" });
    }
  });

  // Tasks Endpoints
  app.get("/api/tasks", (req, res) => {
    try {
      if (!fs.existsSync(currentExcelFile)) {
        return res.json([]);
      }
      const workbook = readExcelFile(currentExcelFile);
      const sheetName = "Tasks";
      if (!workbook.SheetNames.includes(sheetName)) return res.json([]);
      
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to read tasks" });
    }
  });

  app.post("/api/tasks", (req, res) => {
    try {
      const { title, description, status, priority, project, category, time } = req.body;
      if (!title) return res.status(400).json({ error: "Title is required" });

      ensureExcelExists(currentExcelFile);
      const workbook = readExcelFile(currentExcelFile);
      const sheetName = "Tasks";
      const worksheet = workbook.Sheets[sheetName];
      const data: any[] = XLSX.utils.sheet_to_json(worksheet);

      const newTask = {
        id: Date.now().toString(),
        title,
        description: description || "",
        status: status || "Upcoming",
        priority: priority || "Medium",
        project: project || "None",
        category: category || "Work Ritual",
        time: time || "",
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };

      data.push(newTask);
      const newWs = XLSX.utils.json_to_sheet(data);
      workbook.Sheets[sheetName] = newWs;
      writeExcelFile(workbook, currentExcelFile);

      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: "Failed to save task" });
    }
  });

  app.patch("/api/tasks/:id", (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const workbook = readExcelFile(currentExcelFile);
      const sheetName = "Tasks";
      const worksheet = workbook.Sheets[sheetName];
      let data: any[] = XLSX.utils.sheet_to_json(worksheet);

      const taskIndex = data.findIndex(t => t.id === id);
      if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });

      data[taskIndex] = { ...data[taskIndex], ...updates };
      
      const newWs = XLSX.utils.json_to_sheet(data);
      workbook.Sheets[sheetName] = newWs;
      writeExcelFile(workbook, currentExcelFile);

      res.json(data[taskIndex]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.get("/api/activities", (req, res) => {
    try {
      if (!fs.existsSync(currentExcelFile)) {
        return res.json([]);
      }
      const workbook = readExcelFile(currentExcelFile);
      
      let projects: any[] = [];
      if (workbook.SheetNames.includes("Projects")) {
        projects = XLSX.utils.sheet_to_json(workbook.Sheets["Projects"]);
      }
      
      let tasks: any[] = [];
      if (workbook.SheetNames.includes("Tasks")) {
        tasks = XLSX.utils.sheet_to_json(workbook.Sheets["Tasks"]);
      }

      const activities: any[] = [];

      // Add project creation activities
      projects.forEach(p => {
        activities.push({
          id: `p-${p.id}`,
          title: "New Project Initiated",
          content: `Project "${p.name}" was added to the architectural portfolio.`,
          type: "Milestone",
          timeAgo: new Date(p.createdAt).toLocaleDateString(),
          timestamp: new Date(p.createdAt).getTime(),
          project: p.name
        });
      });

      // Add task activities
      tasks.forEach(t => {
        if (t.isCompleted) {
          activities.push({
            id: `t-comp-${t.id}`,
            title: "Ritual Completed",
            content: `Task "${t.title}" was successfully executed.`,
            type: "Completion",
            timeAgo: new Date(t.createdAt).toLocaleDateString(),
            timestamp: new Date(t.createdAt).getTime(),
            project: t.project
          });
        } else {
          activities.push({
            id: `t-new-${t.id}`,
            title: "New Focus Defined",
            content: `Task "${t.title}" was added to the daily ritual.`,
            type: "Update",
            timeAgo: new Date(t.createdAt).toLocaleDateString(),
            timestamp: new Date(t.createdAt).getTime(),
            project: t.project
          });
        }
      });

      // Sort by timestamp descending
      activities.sort((a, b) => b.timestamp - a.timestamp);

      res.json(activities.slice(0, 20));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.post("/api/import-excel", upload.single("file"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      
      // Process Projects
      let projectsData: any[] = [];
      if (workbook.SheetNames.includes("Projects")) {
        projectsData = XLSX.utils.sheet_to_json(workbook.Sheets["Projects"]);
      } else if (workbook.SheetNames.length > 0) {
        // Fallback to first sheet if Projects doesn't exist
        projectsData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      }

      // Process Tasks
      let tasksData: any[] = [];
      if (workbook.SheetNames.includes("Tasks")) {
        tasksData = XLSX.utils.sheet_to_json(workbook.Sheets["Tasks"]);
      }

      const processedProjects = projectsData.map(row => ({
        id: row.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
        name: row.name || row.title || "Untitled Project",
        description: row.description || "",
        status: row.status || "Active",
        createdAt: row.createdAt || new Date().toISOString(),
      }));

      const processedTasks = tasksData.map(row => ({
        id: row.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
        title: row.title || row.name || "Untitled Task",
        description: row.description || "",
        status: row.status || "Upcoming",
        priority: row.priority || "Medium",
        project: row.project || "None",
        category: row.category || "Work Ritual",
        time: row.time || "",
        isCompleted: row.isCompleted === true || row.isCompleted === "true",
        createdAt: row.createdAt || new Date().toISOString(),
      }));

      // Overwrite the existing file
      const newWb = XLSX.utils.book_new();
      
      const wsProjects = XLSX.utils.json_to_sheet(processedProjects);
      XLSX.utils.book_append_sheet(newWb, wsProjects, "Projects");
      
      const wsTasks = XLSX.utils.json_to_sheet(processedTasks);
      XLSX.utils.book_append_sheet(newWb, wsTasks, "Tasks");
      
      writeExcelFile(newWb, currentExcelFile);

      res.json({ 
        message: "Import successful", 
        projectsCount: processedProjects.length,
        tasksCount: processedTasks.length
      });
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ error: "Failed to import Excel file" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
