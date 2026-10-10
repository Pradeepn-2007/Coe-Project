/* =========================================================
   NAVIGATION
========================================================= */

document
    .querySelectorAll(
        ".nav-item"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".nav-item"
                    )
                    .forEach(item =>
                        item.classList
                            .remove("active")
                    );


                button.classList
                    .add("active");


                const section =
                    button.dataset.section;


                document
                    .getElementById(
                        "dashboardSection"
                    )
                    .classList
                    .toggle(
                        "hidden",
                        section !==
                        "dashboard"
                    );


                document
                    .getElementById(
                        "tasksSection"
                    )
                    .classList
                    .toggle(
                        "hidden",
                        section !==
                        "tasks"
                    );

                document
                    .getElementById(
                        "calendarSection"
                    )
                    .classList
                    .toggle(
                        "hidden",
                        section !==
                        "calendar"
                    );

                document
                    .getElementById(
                        "analyticsSection"
                    )
                    .classList
                    .toggle(
                        "hidden",
                        section !==
                        "analytics"
                    );

                document
                    .getElementById(
                        "settingsSection"
                    )
                    .classList
                    .toggle(
                        "hidden",
                        section !==
                        "settings"
                    );

                document
                    .getElementById("focusSection")
                    .classList
                    .toggle("hidden", section !== "focus");

                document
                    .getElementById(
                        "pageTitle"
                    )
                    .textContent =

                    section === "dashboard"
                        ? getGreeting()
                        : section === "calendar"
                            ? "Academic Calendar"
                            : section === "analytics"
                                ? "Analytics"
                                : section === "settings"
                                    ? "Settings"
                                    : section === "focus"
                                        ? "Focus Mode"
                                        : "My Tasks";

                if (section === "calendar") {
                    renderCalendar();
                }

                if (section === "analytics") {
                    renderAnalytics();
                }

                if (section === "settings") {
                    renderSettings();
                }

            }

        );

    });


/* =========================================================
   FILTERS
========================================================= */

document
    .getElementById(
        "dashboardFilter"
    )
    .addEventListener(
        "change",
        renderTasks
    );


document
    .getElementById(
        "statusFilter"
    )
    .addEventListener(
        "change",
        renderAllTasks
    );


document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        renderAllTasks
    );


document
    .getElementById(
        "taskForm"
    )
    .addEventListener(
        "submit",
        addTask
    );


/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification(message) {

    const notification =
        document.createElement(
            "div"
        );


    notification.textContent =
        message;


    Object.assign(
        notification.style,
        {

            position: "fixed",

            bottom: "25px",

            right: "25px",

            background: "#191a25",

            color: "white",

            padding: "12px 17px",

            borderRadius: "9px",

            fontSize: "11px",

            zIndex: "999",

            boxShadow:
                "0 10px 30px rgba(0,0,0,.15)"

        }
    );


    document.body.appendChild(
        notification
    );


    setTimeout(
        () => notification.remove(),
        2200
    );

}


/* =========================================================
   DEADLINE REMINDERS
========================================================= */

function getReminderKey(task, type) {

    return `deadlineReminder_${currentUser ? currentUser.id : "guest"}_${task.id}_${task.deadline}_${type}`;

}

function sendBrowserReminder(title, body) {

    if ("Notification" in window && Notification.permission === "granted") {

        new Notification(title, {
            body: body
        });

    }
}

function checkDeadlineReminders() {

    if (!currentUser || !Array.isArray(tasks)) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach(task => {

        if (task.status === "completed") return;

        const deadline = new Date(`${task.deadline}T00:00:00`);
        if (Number.isNaN(deadline.getTime())) return;

        const difference = Math.round((deadline - today) / 86400000);
        let type = "";
        let message = "";

        if (difference < 0) {
            type = "overdue";
            message = `${task.name} is overdue.`;
        } else if (difference === 0) {
            type = "today";
            message = `${task.name} is due today.`;
        } else if (difference === 1) {
            type = "tomorrow";
            message = `${task.name} is due tomorrow.`;
        }

        if (!type) return;

        const key = getReminderKey(task, type);

        if (!sessionStorage.getItem(key)) {
            sessionStorage.setItem(key, "shown");
            showNotification(`Reminder: ${message}`);
            sendBrowserReminder("Deadline Drift Reminder", message);
        }

    });
}

async function enableReminders() {

    if (!("Notification" in window)) {
        showNotification("Browser notifications are not supported.");
        return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
        showNotification("Deadline reminders enabled.");
        sendBrowserReminder("Deadline Drift", "Your deadline reminders are enabled.");
        checkDeadlineReminders();
    } else {
        showNotification("Notification permission was not enabled.");
    }
}

const reminderButton = document.getElementById("enableRemindersBtn");
if (reminderButton) {
    reminderButton.addEventListener("click", enableReminders);
}

setInterval(checkDeadlineReminders, 60000);


/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


function applyTheme(theme) {
    const dark = theme === "dark";
    document.body.classList.toggle("theme-dark", dark);
    const toggle = document.getElementById("themeToggle");
    if (toggle) toggle.checked = dark;
    localStorage.setItem("deadlineDriftTheme", dark ? "dark" : "light");
}

function initTheme() {
    const saved = localStorage.getItem("deadlineDriftTheme") || "light";
    applyTheme(saved);
}

function renderSettings() {
    if (!currentUser) return;

    const name = currentUser.name || "Student";
    const email = currentUser.email || "";

    const nameEl = document.getElementById("settingsName");
    const emailEl = document.getElementById("settingsEmail");
    const avatarEl = document.getElementById("settingsAvatar");

    if (nameEl) nameEl.textContent = name;
    if (emailEl) emailEl.textContent = email;
    if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();

    const reminderToggle = document.getElementById("settingsReminderToggle");
    const compactToggle = document.getElementById("compactToggle");

    if (reminderToggle) {
        reminderToggle.checked = localStorage.getItem("deadlineDriftReminders") === "enabled";
    }

    if (compactToggle) {
        compactToggle.checked = localStorage.getItem("deadlineDriftCompact") === "enabled";
    }
}

function applyCompactMode(enabled) {
    document.body.classList.toggle("compact-mode", enabled);
    localStorage.setItem("deadlineDriftCompact", enabled ? "enabled" : "disabled");
}

const settingsReminderToggle = document.getElementById("settingsReminderToggle");
if (settingsReminderToggle) {
    settingsReminderToggle.addEventListener("change", async (event) => {
        if (event.target.checked) {
            localStorage.setItem("deadlineDriftReminders", "enabled");
            if ("Notification" in window && Notification.permission !== "granted") {
                try { await Notification.requestPermission(); } catch (e) {}
            }
            if (typeof showToast === "function") showToast("Deadline reminders enabled");
        } else {
            localStorage.setItem("deadlineDriftReminders", "disabled");
            if (typeof showToast === "function") showToast("Deadline reminders disabled");
        }
    });
}

const compactToggle = document.getElementById("compactToggle");
if (compactToggle) {
    compactToggle.addEventListener("change", (event) => {
        applyCompactMode(event.target.checked);
        if (typeof showToast === "function") showToast(event.target.checked ? "Compact mode enabled" : "Compact mode disabled");
    });
}

const settingsLogoutBtn = document.getElementById("settingsLogoutBtn");
if (settingsLogoutBtn) {
    settingsLogoutBtn.addEventListener("click", logout);
}

const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    themeToggle.addEventListener("change", () => applyTheme(themeToggle.checked ? "dark" : "light"));
}

initTheme();

applyCompactMode(localStorage.getItem("deadlineDriftCompact") === "enabled");

