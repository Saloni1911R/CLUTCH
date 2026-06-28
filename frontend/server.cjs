const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================
// FOLDERS
// =============================

const UPLOADS = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS)) {
    fs.mkdirSync(UPLOADS);
}

app.use("/uploads", express.static(UPLOADS));

// =============================
// DATABASE
// =============================

const DB_FILE = path.join(__dirname, "db.json");

function readDatabase() {
    if (!fs.existsSync(DB_FILE)) {
        const initial = {
            profile: {
                username: "anya",
                displayName: "",
                timeZone: "GMT+5:30",
                phone: "",
                avatarUrl: ""
            },
            tasks: []
        };

        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
        return initial;
    }

    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDatabase(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// =============================
// MULTER
// =============================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS);
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname +
                "-" +
                Date.now() +
                path.extname(file.originalname)
        );
    }
});

const upload = multer({
    storage
});

// =============================
// PROFILE
// =============================

app.get("/api/user/profile", (req, res) => {
    const db = readDatabase();
    res.json(db.profile);
});

app.put(
    "/api/user/profile",
    upload.single("avatar"),
    (req, res) => {
        try {
            const db = readDatabase();

            db.profile.username =
                req.body.newUsername || req.body.username;

            db.profile.displayName =
                req.body.displayName || "";

            db.profile.timeZone =
                req.body.timeZone || "GMT+5:30";

            db.profile.phone =
                req.body.phone || "";

            if (req.file) {
                db.profile.avatarUrl =
                    `http://localhost:5001/uploads/${req.file.filename}`;
            }

            writeDatabase(db);

            res.json({
                success: true,
                profile: db.profile
            });

        } catch (err) {
            console.error(err);

            res.status(500).json({
                error: "Profile update failed"
            });
        }
    }
);

// =============================
// GET TASKS
// =============================

app.get("/api/tasks", (req, res) => {

    const db = readDatabase();

    let tasks = db.tasks || [];

    if (req.query.username) {
        tasks = tasks.filter(
            t =>
                !t.username ||
                t.username === req.query.username
        );
    }

    res.json(tasks);
});

// =============================
// ADD TASK
// =============================

app.post("/api/tasks", (req, res) => {

    const db = readDatabase();

    const task = {
        id: Date.now(),

        username: req.body.username || "default_gamer",

        objective: req.body.objective || "",

        deadline: req.body.deadline || "",

        workload: req.body.workload || "Medium",

        status: "pending",

        subtasks:
            req.body.subtasks ||
            req.body.tactical_subtasks ||
            []
    };

    db.tasks.push(task);

    writeDatabase(db);

    res.json(task);
});

// =============================
// UPDATE TASK
// =============================

app.put("/api/tasks/:id", (req, res) => {

  console.log("PUT HIT");
    console.log("ID:", req.params.id);
    console.log("BODY:", req.body);

    const db = readDatabase();

    const id = String(req.params.id);

    const task = db.tasks.find(
        t => String(t.id) === id
    );

    if (!task) {

        return res.status(404).json({
            error: "Task not found"
        });

    }

    if (req.body.objective !== undefined)
        task.objective = req.body.objective;

    if (req.body.deadline !== undefined)
        task.deadline = req.body.deadline;

    if (req.body.workload !== undefined)
        task.workload = req.body.workload;

    if (req.body.status !== undefined)
        task.status = req.body.status;

    if (req.body.subtasks !== undefined)
        task.subtasks = req.body.subtasks;

    writeDatabase(db);

    res.json(task);

});

// =============================
// DELETE TASK
// =============================

app.delete("/api/tasks/:id", (req, res) => {

    const db = readDatabase();

    const id = String(req.params.id);

    db.tasks = db.tasks.filter(
        t => String(t.id) !== id
    );

    writeDatabase(db);

    res.json({
        success: true
    });

});

// =============================
// HEALTH CHECK
// =============================

app.get("/", (req, res) => {
    res.send("✅ CLUTCH Backend Running");
});

// =============================
// START SERVER
// =============================

const PORT = 5001;

app.listen(PORT, () => {
    console.log(`🚀 CLUTCH Backend running on http://localhost:${PORT}`);
});