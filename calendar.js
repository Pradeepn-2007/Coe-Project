/* =========================================================
   CALENDAR
========================================================= */

function renderCalendar() {

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const monthLabel = calendarDate.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
    });

    document.getElementById("calendarMonth").textContent = monthLabel;

    const grid = document.getElementById("calendarGrid");
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let html = weekdays.map(day => `<div class="calendar-weekday">${day}</div>`).join("");

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
        html += calendarDayHTML(daysInPrevMonth - i, true, new Date(year, month - 1, daysInPrevMonth - i));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        html += calendarDayHTML(day, false, new Date(year, month, day));
    }

    const cellsUsed = firstDay + daysInMonth;
    const remaining = (7 - (cellsUsed % 7)) % 7;

    for (let day = 1; day <= remaining; day++) {
        html += calendarDayHTML(day, true, new Date(year, month + 1, day));
    }

    grid.innerHTML = html;
}

function calendarDayHTML(dayNumber, otherMonth, date) {
    const dateString = getLocalDateString(date);
    const dayTasks = tasks
        .filter(task => task.deadline === dateString)
        .sort((a, b) => (a.status === "completed") - (b.status === "completed"));

    const todayClass = dateString === getDateOffset(0) ? " today" : "";
    const otherClass = otherMonth ? " other-month" : "";

    let taskHTML = dayTasks.slice(0, 3).map(task => `
        <button type="button" class="calendar-task ${task.status === "completed" ? "completed" : ""}"
            onclick="editTask(${task.id})" title="${escapeHTML(task.name)}">
            ${escapeHTML(task.name)}
        </button>
    `).join("");

    if (dayTasks.length > 3) {
        taskHTML += `<div class="calendar-more">+${dayTasks.length - 3} more</div>`;
    }

    return `
        <div class="calendar-day${otherClass}${todayClass}">
            <div class="calendar-day-number">${dayNumber}</div>
            ${taskHTML}
        </div>
    `;
}

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

document.getElementById("prevMonth").addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
});

document.getElementById("todayMonth").addEventListener("click", () => {
    calendarDate = new Date();
    renderCalendar();
});

