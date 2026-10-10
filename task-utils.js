/* =========================================================
   TASK MODEL UTILITIES
   Pure helpers shared by dashboard, task, reminder and calendar views.
========================================================= */

function getDateOffset(days) {

    const date = new Date();

    date.setDate(
        date.getDate() + days
    );

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(date.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;
}
function parseDate(dateString) {

    return new Date(
        `${dateString}T23:59:59`
    );

}
function isToday(dateString) {

    return dateString ===
        getDateOffset(0);

}
function daysUntil(dateString) {

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const deadline =
        parseDate(dateString);

    deadline.setHours(
        0,
        0,
        0,
        0
    );

    return Math.ceil(
        (deadline - today) /
        (1000 * 60 * 60 * 24)
    );

}
function formatDate(dateString) {

    return new Date(
        `${dateString}T12:00:00`
    ).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short"
        }
    );

}
function priorityWeight(priority) {

    return {

        high: 3,

        medium: 2,

        low: 1

    }[priority] || 1;

}
function getStatusLabel(status) {

    return {

        todo: "To Do",

        progress: "In Progress",

        completed: "Completed"

    }[status];

}
