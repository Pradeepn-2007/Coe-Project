
function renderAll() {
    renderFocusTasks();
  renderAnalytics();

    updateStats();
    renderRecommendation();
    renderTasks();
    renderDeadlines();
    renderAllTasks();
    renderCalendar();

}


function exportTasksToCSV() {
    if (!Array.isArray(tasks) || tasks.length === 0) {
        showToast("No tasks available to export", "info");
        return;
    }

    const headers = ["Task Name", "Subject", "Type", "Deadline", "Estimated Effort (hours)", "Priority", "Status", "Notes"];
    const rows = tasks.map(task => [
        task.name || "", task.subject || "", task.type || "", task.deadline || "",
        task.effort || "", task.priority || "", task.status || "", task.notes || ""
    ]);

    const escapeCSV = value => {
        const text = String(value ?? "");
        return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };

    const csv = [headers, ...rows].map(row => row.map(escapeCSV).join(",")).join("\r\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `deadline-drift-tasks-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Task report exported successfully", "success");
}


const exportTasksButton = document.getElementById("exportTasksBtn");
if (exportTasksButton) exportTasksButton.addEventListener("click", exportTasksToCSV);

// Focus Mode controls
const focusStartBtn = document.getElementById("focusStartBtn");
const focusPauseBtn = document.getElementById("focusPauseBtn");
const focusResetBtn = document.getElementById("focusResetBtn");

if (focusStartBtn) focusStartBtn.addEventListener("click", startFocusTimer);
if (focusPauseBtn) focusPauseBtn.addEventListener("click", pauseFocusTimer);
if (focusResetBtn) focusResetBtn.addEventListener("click", resetFocusTimer);

updateFocusTimer();

checkSession();

