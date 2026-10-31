# Deadline Drift — Code Comment and Module Map

## Purpose

This document explains where important frontend responsibilities live and how inline comments help readers follow the code. The comments added to the JavaScript files describe intent and decision points; they do not change application behavior.

## Frontend modules

| File | Responsibility | Key functions |
|---|---|---|
| `js/core.js` | PHP session, authentication, task loading, and API updates | `checkSession`, `handleLogin`, `handleRegister`, `logout`, `loadTasks`, `saveTaskStatus` |
| `js/app.js` | Shared rendering, CSV export, control wiring, and startup | `renderAll`, `exportTasksToCSV` |
| `js/models/task-utils.js` | Local date parsing, formatting, status labels, and priority weights | `getDateOffset`, `daysUntil`, `formatDate`, `priorityWeight` |
| `js/modules/dashboard.js` | Dashboard counters and explainable Smart Priority | `updateStats`, `getScoreBreakdown`, `getRecommendation`, `renderRecommendation` |
| `js/modules/tasks.js` | Task card/list rendering and CRUD form actions | `renderTaskCard`, `renderAllTasks`, `addTask`, `editTask`, `deleteTask` |
| `js/modules/calendar.js` | Monthly calendar generation and deadline markers | `renderCalendar`, `calendarDayHTML` |
| `js/modules/analytics.js` | Task status, priority, and subject summaries | `analyticsBar`, `renderAnalytics` |
| `js/modules/focus-mode.js` | 25-minute focus timer and task selection | `startFocusTimer`, `pauseFocusTimer`, `resetFocusTimer` |
| `js/modules/notifications-settings.js` | Navigation, reminders, safe text encoding, and preferences | `checkDeadlineReminders`, `escapeHTML`, `applyTheme`, `renderSettings` |

## Important code comments

- **Authentication:** Requests that depend on a login session use the browser's same-origin PHP session cookie. The PHP API remains responsible for enforcing authentication.
- **Task ownership:** The browser does not decide which user's tasks may be accessed. The PHP task endpoint must apply the authenticated `user_id` condition to reads and writes.
- **Smart Priority:** The score is calculated from deadline urgency, priority, and capped effort. The UI displays component scores so a recommendation can be explained. It is a heuristic, not a learned model.
- **Date handling:** Date-only values are parsed using local date/time construction to reduce UTC timezone shifts in deadline comparisons.
- **User-provided text:** Task names, subjects, and notes are HTML-escaped before being placed in generated markup.
- **CSV export:** Quotes are doubled and fields containing commas, quotes, or newlines are quoted according to CSV escaping rules.
- **Focus timer:** `focusInterval` prevents multiple countdown intervals from running at the same time. Pause keeps the remaining time; Reset returns it to 25 minutes.

## Commenting convention

Use comments to explain why a non-obvious operation exists, what a function is responsible for, or what an important boundary protects. Avoid comments that merely repeat the next line of code. Keep the comment close to the function or logic it explains. Update the comment whenever behavior changes.

## Verification note

The changes in this update add explanatory comments and reformat the Focus Mode module for readability. They are not intended to change the app's features or API contracts. Run the JavaScript syntax checks, Smart Priority unit tests, and browser regression checklist after installing the update.
