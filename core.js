

/* =========================================================
   DEADLINE DRIFT APPLICATION
========================================================= */

const API_URL = "api/tasks.php";
const AUTH_URL = "api";

let tasks = [];
let currentUser = null;
let editingTaskId = null;
let calendarDate = new Date();
let focusSeconds = 25 * 60;
let focusInterval = null;
let selectedFocusTaskId = null;

async function checkSession() {
    try {
        const response = await fetch(`${AUTH_URL}/me.php`, {
            credentials: "same-origin"
        });
        const data = await response.json();

        if (data.success && data.logged_in && data.user) {
            showApp(data.user);
        } else {
            showAuth();
        }
    } catch (error) {
        console.error("Session check error:", error);
        showAuth();
    }
}

function showApp(user) {
    currentUser = user;

    document.getElementById("authScreen").classList.add("hidden");
    document.getElementById("appShell").classList.remove("hidden");

    const name = user.name || "Student";
    const email = user.email || "";

    document.getElementById("profileName").textContent = name;
    document.getElementById("profileEmail").textContent = email;
    document.getElementById("profileAvatar").textContent = name.charAt(0).toUpperCase();

    updateGreeting();
    loadTasks();
}

function showAuth() {
    document.getElementById("appShell").classList.add("hidden");
    document.getElementById("authScreen").classList.remove("hidden");
}

async function handleLogin(event) {
    event.preventDefault();

    const errorBox = document.getElementById("loginError");
    errorBox.textContent = "";

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${AUTH_URL}/login.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!data.success) {
            errorBox.textContent = data.message || "Login failed";
            return;
        }

        document.getElementById("loginForm").reset();
        showApp(data.user);
    } catch (error) {
        console.error("Login error:", error);
        errorBox.textContent = "Could not connect to the server.";
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const errorBox = document.getElementById("registerError");
    errorBox.textContent = "";

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    try {
        const response = await fetch(`${AUTH_URL}/register.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!data.success) {
            errorBox.textContent = data.message || "Registration failed";
            return;
        }

        document.getElementById("registerForm").reset();
        document.getElementById("registerView").classList.add("hidden");
        document.getElementById("loginView").classList.remove("hidden");
        document.getElementById("loginEmail").value = email;
        document.getElementById("loginError").textContent = "Account created. Please sign in.";
    } catch (error) {
        console.error("Registration error:", error);
        errorBox.textContent = "Could not connect to the server.";
    }
}

async function logout() {
    try {
        await fetch(`${AUTH_URL}/logout.php`, {
            method: "POST",
            credentials: "same-origin"
        });
    } catch (error) {
        console.error("Logout error:", error);
    }

    currentUser = null;
    tasks = [];
    showAuth();
}

document.getElementById("loginForm").addEventListener("submit", handleLogin);
document.getElementById("registerForm").addEventListener("submit", handleRegister);
document.getElementById("logoutBtn").addEventListener("click", logout);

document.getElementById("showRegister").addEventListener("click", () => {
    document.getElementById("loginError").textContent = "";
    document.getElementById("loginView").classList.add("hidden");
    document.getElementById("registerView").classList.remove("hidden");
});

document.getElementById("showLogin").addEventListener("click", () => {
    document.getElementById("registerError").textContent = "";
    document.getElementById("registerView").classList.add("hidden");
    document.getElementById("loginView").classList.remove("hidden");
});

async function loadTasks() {

    try {

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.success) {
            if (response.status === 401) {
                showAuth();
                throw new Error("Please log in");
            }
            throw new Error(data.message || "Failed to load tasks");
        }

        tasks = Array.isArray(data.tasks) ? data.tasks : [];

        renderAll();
        checkDeadlineReminders();

    } catch (error) {

        console.error("Load tasks error:", error);

        tasks = [];
        renderAll();

        showNotification(error.message || "Could not load tasks.");
    }
}

/* =========================================================
   UTILITIES
========================================================= */



async function saveTaskStatus(id, status) {

    const task = tasks.find(t => Number(t.id) === Number(id));

    if (!task) {
        throw new Error("Task not found");
    }

    const response = await fetch(API_URL, {
        credentials: "same-origin",
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: Number(id),
            name: task.name,
            subject: task.subject,
            type: task.type,
            deadline: task.deadline,
            effort: Number(task.effort),
            priority: task.priority,
            status,
            notes: task.notes || ""
        })
    });

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.message || "Failed to update task");
    }
}













