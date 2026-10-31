[README-Deadline-Drift-Updated.md](https://github.com/user-attachments/files/34211311/README-Deadline-Drift-Updated.md)
# Deadline Drift — Academic Planner

Deadline Drift is a student-focused academic planning web application. It helps students record coursework, track deadlines, review progress, and decide which unfinished task to work on next. This project is a prototype built with HTML, CSS, JavaScript, PHP, and MySQL.

> **Project status:** The modular frontend is implemented and has been opened successfully in the local XAMPP environment. Core task operations were confirmed during earlier testing. A full regression pass after every recent change and structured testing with at least three students are still pending. This README does not claim those activities are complete.

## Features

- **Account access:** Register, log in, check the session, and log out using PHP sessions.
- **Task management:** Add, view, edit, update status, and delete academic tasks.
- **Task details:** Task name, subject, type, deadline, estimated effort, priority, status, and notes.
- **Dashboard:** Due-today and upcoming counts, completion progress, and a Smart Priority recommendation.
- **Smart Priority explanation:** Displays the recommendation score and the points contributed by urgency, priority, and effort.
- **Calendar:** View tasks by deadline and navigate between months.
- **Analytics:** Review completion and workload summaries.
- **Focus Mode:** Use a focus timer and choose an active task.
- **Deadline reminders:** In-app reminders and optional browser notifications, subject to browser permission and session availability.
- **Settings:** Appearance and task-display preferences.
- **CSV export:** Export task data, including notes, for personal review.
- **Responsive interface:** Layout designed for desktop and smaller screens.

## Technology stack

| Layer | Technology |
|---|---|
| Frontend structure | HTML5 |
| Styling | CSS3 |
| Frontend logic | Vanilla JavaScript |
| Server-side API | PHP |
| Database | MySQL / MariaDB |
| Local development environment | XAMPP (Apache and MySQL) |
| Browser-to-server communication | `fetch()` requests with JSON |
| Authentication | PHP sessions and password hashing in the PHP backend |

No JavaScript framework or package manager is required for the current frontend.

## Project structure

```text
deadline-drift/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── core.js
│   ├── app.js
│   ├── models/
│   │   └── task-utils.js
│   └── modules/
│       ├── dashboard.js
│       ├── tasks.js
│       ├── analytics.js
│       ├── calendar.js
│       ├── focus-mode.js
│       └── notifications-settings.js
├── api/                          # Keep in the local XAMPP project
│   ├── db.php
│   ├── register.php
│   ├── login.php
│   ├── me.php
│   ├── logout.php
│   └── tasks.php
└── docs/
    ├── smart-priority.md
    ├── testing-checklist.md
    ├── student-validation-form.md
    └── review2-validation-status.md
```

**Important:** The modular ZIP contains the frontend and documentation. It does not replace the PHP API folder. Keep the existing working `api` folder in your XAMPP project when installing the frontend update.

### Main JavaScript responsibilities

- `core.js`: Authentication/session handling, loading tasks, and API updates.
- `models/task-utils.js`: Reusable task, date, status, and priority helpers.
- `modules/dashboard.js`: Dashboard counters and Smart Priority recommendation.
- `modules/tasks.js`: Task list, form, edit, delete, and task status interactions.
- `modules/analytics.js`: Progress and workload summaries.
- `modules/calendar.js`: Calendar rendering and date navigation.
- `modules/focus-mode.js`: Focus timer and task selection.
- `modules/notifications-settings.js`: Navigation, reminders, and user preferences.
- `app.js`: Shared rendering, CSV export, event wiring, and application startup.

The files currently load as classic scripts in a defined order to remain compatible with the prototype's shared functions.

## Requirements

- Windows with XAMPP installed, or an equivalent environment with Apache, PHP, and MySQL/MariaDB.
- A modern browser such as Chrome, Edge, or Firefox.
- The project database and the PHP API files listed above.

## Installation with XAMPP

1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. Back up the existing folder `C:\xampp\htdocs\deadline-drift` before replacing files.
3. Extract the modular ZIP.
4. Copy `index.html`, `css/`, `js/`, and `docs/` into `C:\xampp\htdocs\deadline-drift\`. Replace `index.html` and merge the folders if Windows asks.
5. **Keep the existing `api/` folder and PHP files.** If setting up from scratch, create the required PHP API files and configure `api/db.php` for your local database first.
6. Make sure the database is named `deadline_drift` and contains the `users` and `tasks` tables described below. If the existing database already has the columns, do not run duplicate `ALTER TABLE` commands.
7. Open `http://localhost/deadline-drift/` in a browser. Do not open `index.html` directly with `file:///`, because the PHP API requires an HTTP server.
8. Register an account, sign in, and test the features using `docs/testing-checklist.md`.

### PHP API endpoints and request contracts

All API responses use JSON. The frontend calls the PHP files on the same origin and includes the PHP session cookie for authenticated requests. The `db.php` file is included by the other PHP scripts; it is not an application screen.

| Endpoint | Method | Request body / inputs | Authentication | Successful response |
|---|---|---|---|---|
| `api/db.php` | Included by PHP | Database settings are configured inside this file | N/A | Opens the MySQL connection; connection failure returns HTTP `500` with a JSON error |
| `api/register.php` | `POST` | JSON: `name`, `email`, `password` | No | `success`, `message`, and the new `user_id` |
| `api/login.php` | `POST` | JSON: `email`, `password` | No | `success`, `message`, and a `user` object (`id`, `name`, `email`); creates a PHP session |
| `api/me.php` | `GET` | None | Checks the current session | `success` plus `logged_in`; includes `user` when signed in |
| `api/logout.php` | `POST` | None | Uses the current session | `success` and a logout message; clears the session |
| `api/tasks.php` | `GET` | None | Yes | `success` and a `tasks` array for the signed-in user |
| `api/tasks.php` | `POST` | JSON task: `name`, `subject`, `type`, `deadline`, `effort`, `priority`, `status`, optional `notes` | Yes | `success`, message, and inserted task `id` |
| `api/tasks.php` | `PUT` | JSON: `id` plus either `status` only or the full editable task fields | Yes | `success` and update message |
| `api/tasks.php` | `DELETE` | JSON: `id` | Yes | `success` and delete message |

**Allowed task values:** `priority` is `high`, `medium`, or `low`; `status` is `todo`, `progress`, or `completed`. A task's `effort` is stored as an integer number of hours. The current task API reads the DELETE ID from the JSON body, not from the query string.

**Task ownership boundary:** Every task read and write must use the authenticated session's `user_id`. The task API uses `WHERE user_id = ?` for listing and `WHERE id = ? AND user_id = ?` for edits/deletes, so a user cannot change another user's task by guessing its ID. Keep this ownership condition in future API changes.

#### API error responses

| HTTP status | Boundary / condition | Expected behavior |
|---:|---|---|
| `400` | Missing fields, malformed JSON, invalid task ID, invalid priority/status, or invalid full-edit data | JSON response with `success: false` and a validation message |
| `401` | Task endpoint called without a valid login session; login credentials are invalid | Request is rejected; task data is not returned or changed |
| `409` | Registration email already exists | Registration is rejected with a duplicate-account message |
| `405` | Unsupported HTTP method on `tasks.php` | JSON response indicates that the method is not allowed |
| `500` | Database connection or SQL operation fails | JSON error response; do not display credentials or SQL details to the user |

For the current task API, a DELETE request that refers to a task outside the signed-in user's account does not delete that row. The endpoint currently reports success when the SQL statement executes even if zero rows match; a future refinement can return a distinct not-found response using `affected_rows`.

## Database setup

The PHP backend expects a database named `deadline_drift`. For a fresh database, create the account table first, followed by the task table:

```sql
CREATE DATABASE IF NOT EXISTS deadline_drift;
USE deadline_drift;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    deadline DATE NOT NULL,
    effort INT NOT NULL DEFAULT 1,
    priority ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
    status ENUM('todo', 'progress', 'completed') NOT NULL DEFAULT 'todo',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tasks_user_deadline (user_id, deadline),
    CONSTRAINT fk_tasks_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);
```

### Database column reference

**`users` table**

| Column | Type | Purpose / constraint |
|---|---|---|
| `id` | `INT` | Primary key; auto-increment account identifier |
| `name` | `VARCHAR(100)` | Required display name |
| `email` | `VARCHAR(150)` | Required email address; unique to prevent duplicate accounts |
| `password` | `VARCHAR(255)` | Required password hash created by PHP `password_hash()`; never store the plain password |
| `created_at` | `TIMESTAMP` | Account creation time, defaulting to the current timestamp |

**`tasks` table**

| Column | Type | Purpose / constraint |
|---|---|---|
| `id` | `INT` | Primary key; auto-increment task identifier |
| `user_id` | `INT` | Owner account ID; references `users.id` in a fresh schema |
| `name` | `VARCHAR(255)` | Required task title |
| `subject` | `VARCHAR(100)` | Required subject/module name |
| `type` | `VARCHAR(50)` | Required category such as assignment, lab, exam, or project |
| `deadline` | `DATE` | Required due date |
| `effort` | `INT` | Estimated effort in hours; default `1` |
| `priority` | `ENUM('high','medium','low')` | User-selected priority; default `medium` |
| `status` | `ENUM('todo','progress','completed')` | Workflow state; default `todo` |
| `notes` | `TEXT` | Optional instructions or task details; may be `NULL` |
| `created_at` | `TIMESTAMP` | Task creation time, defaulting to the current timestamp |

The fresh-install SQL above also creates an index on `(user_id, deadline)` to support a user's deadline-ordered task list and a foreign key that removes a user's tasks when the corresponding user is deleted. Older local databases may have `user_id` nullable because it was added by a migration after the original task table was created. Do not change that column or assign old rows to an account until ownership of those records is confirmed.

### If you already have the database

Do **not** drop or recreate existing tables. In phpMyAdmin, open `deadline_drift` and inspect the `users` and `tasks` columns. The current authenticated task API uses `tasks.user_id` and `tasks.notes`. If either column is missing, run only the migration for the missing column:

```sql
ALTER TABLE tasks ADD COLUMN user_id INT NULL AFTER id;
ALTER TABLE tasks ADD COLUMN notes TEXT NULL AFTER status;
```

The two statements above are separate migrations; skip any statement whose column already exists. Tasks created before user accounts were added may have `user_id = NULL`. Such records are not automatically assigned to a signed-in account. Only assign records to an account deliberately if they belong to that user.

Configure the database host, username, password, and database name in `api/db.php` for your local XAMPP setup. Do not commit real credentials to a public repository.

## Smart Priority logic

Smart Priority is a transparent, rule-based heuristic. It is **not** a trained AI or machine-learning model.

```text
Task Score = Urgency Score + (Priority Weight × 2) + Effort Contribution
Effort Contribution = min(max(Estimated Effort Hours, 0), 5)
```

### Deadline urgency

| Deadline | Points |
|---|---:|
| Overdue | 10 |
| Due today | 9 |
| Due tomorrow | 7 |
| Due in 2–3 days | 5 |
| Due in 4–7 days | 3 |
| Due in more than 7 days | 1 |

### Priority and effort

| Selected priority | Weight | Points added |
|---|---:|---:|
| High | 3 | 6 |
| Medium | 2 | 4 |
| Low | 1 | 2 |

Estimated effort adds one point per estimated hour, capped at five points. For example, a task due today with High priority and an estimated effort of 3 hours scores `9 + (3 × 2) + 3 = 18`.

Completed tasks are excluded. The highest-scoring unfinished task is recommended. If scores tie, the earlier deadline wins; if both score and deadline are equal, the current task-list order is retained.

These weights are initial design assumptions, not experimentally established values. A long task can receive more points because of its effort estimate; user testing should determine whether that behavior is useful. See `docs/smart-priority.md` for test cases and rationale.

## Unit-level checks, integration tests, and error boundaries

The current project uses a lightweight manual test plan rather than an installed JavaScript/PHP test framework. The cases below are **test specifications**. Mark them as passed only after executing them and recording the actual result in `docs/testing-checklist.md`.

### Pure JavaScript helper and Smart Priority checks

| Test ID | Unit under test | Input / condition | Expected result |
|---|---|---|---|
| `DATE-01` | `getDateOffset(0)` | Current local date | Returns today's date as `YYYY-MM-DD` |
| `DATE-02` | `daysUntil()` | Yesterday / today / tomorrow | Returns `-1` / `0` / `1` |
| `DATE-03` | `priorityWeight()` | `high`, `medium`, `low` | Returns `3`, `2`, `1` |
| `SCORE-01` | `getScoreBreakdown()` | Yesterday, High, 2 hours | Total score `18` |
| `SCORE-02` | `getScoreBreakdown()` | Today, Medium, 1 hour | Total score `14` |
| `SCORE-03` | `getScoreBreakdown()` | Tomorrow, Low, 4 hours | Total score `13` |
| `SCORE-04` | Effort cap | In 10 days, High, 8 hours | Effort contribution is `5`; total score `12` |
| `SCORE-05` | `getRecommendation()` | All tasks completed | Returns no recommendation (`null`) |
| `SCORE-06` | Recommendation tie-break | Equal scores, different deadlines | Earlier deadline is selected |

### API validation and failure-boundary checks

| Test ID | Request / fault injection | Expected boundary behavior |
|---|---|---|
| `AUTH-01` | Register with a missing field | HTTP `400`; account is not created |
| `AUTH-02` | Register with an invalid email | HTTP `400`; account is not created |
| `AUTH-03` | Register with password shorter than 6 characters | HTTP `400`; account is not created |
| `AUTH-04` | Register an email that already exists | HTTP `409`; existing account remains unchanged |
| `AUTH-05` | Login with wrong email or password | HTTP `401`; no authenticated user data is returned |
| `TASK-01` | Call `tasks.php` without login | HTTP `401`; task data is not returned |
| `TASK-02` | POST a task with a missing required field | HTTP `400`; no task is inserted |
| `TASK-03` | POST invalid priority or status | HTTP `400`; no invalid enum value is stored |
| `TASK-04` | PUT with an invalid ID or invalid status | HTTP `400`; existing task remains unchanged |
| `TASK-05` | DELETE with ID `0` or missing ID | HTTP `400`; no task is deleted |
| `TASK-06` | Try to update/delete another user's task ID | No row belonging to the other user is changed or deleted |
| `TASK-07` | Call `tasks.php` using an unsupported HTTP method | HTTP `405` |
| `DB-01` | Stop MySQL and call a database-backed endpoint | HTTP `500` JSON error; no credentials or SQL details shown |
| `NET-01` | Stop Apache or open the page using `file:///` | Frontend reports a connection failure; restore Apache and use the localhost URL |

**Input boundary notes:** Task creation normalizes effort values below one hour to `1`; full task editing rejects effort below one hour with HTTP `400`. Both paths validate priority and status against their allowed values. The API uses prepared statements and the session's user ID for task ownership.

### Integration / regression checks

Use `docs/testing-checklist.md` to test the complete browser-to-PHP-to-MySQL flow: register, log in, add a task, refresh, edit the task and notes, change status, delete it, log out, and verify that another account cannot see or alter it. Then test calendar, analytics, Focus Mode, reminders, preferences, and CSV export. Confirm that the modular frontend still loads after a hard refresh.

Structured usability testing with at least three student participants has **not yet been documented as complete**. `docs/student-validation-form.md` is a blank template for genuine, anonymized responses. Do not present invented ratings or comments as test results. Update `docs/review2-validation-status.md` only when new checks or participant sessions have actually occurred.

## Known limitations

- This is a local academic prototype, not a production-hosted service.
- The Smart Priority weights have not yet been validated through structured student testing.
- Browser notifications depend on permission and browser behavior; reminders need the application to be open and active for its periodic checks.
- Appearance and display preferences are stored in the browser, while tasks and accounts are stored through the PHP/MySQL backend.
- A complete regression test across every feature after all modular changes remains to be recorded.

## Future improvements

- Conduct and document usability testing with students, then refine the recommendation logic using evidence.
- Add automated regression tests for task operations and scoring.
- Consider converting the classic scripts to ES modules after confirming compatibility.
- Improve accessibility, form validation, and deployment configuration.
- Deploy the PHP/MySQL backend to a suitable host if online access is required; GitHub Pages alone cannot run PHP.

## Documentation

- [`docs/smart-priority.md`](docs/smart-priority.md) — scoring rule, rationale, examples, and test plan.
- [`docs/testing-checklist.md`](docs/testing-checklist.md) — manual feature regression checklist.
- [`docs/api-and-error-boundaries.md`](docs/api-and-error-boundaries.md) — endpoint contracts and API failure-boundary test notes.
- [`docs/student-validation-form.md`](docs/student-validation-form.md) — form for recording genuine student feedback.
- [`docs/review2-validation-status.md`](docs/review2-validation-status.md) — current implementation and validation status.

## License

No license has been specified for this prototype. Add a license file if you intend to distribute or reuse the project publicly.
