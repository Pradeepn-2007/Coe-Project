[README-Deadline-Drift-Testing-Updated.md](https://github.com/user-attachments/files/34211402/README-Deadline-Drift-Testing-Updated.md)
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
├── api/
│   ├── README.md
│   └── tasks.php                  # Updated endpoint; other API files remain local
├── docs/
│   ├── smart-priority.md
│   ├── testing-checklist.md
│   ├── student-validation-form.md
│   ├── review2-validation-status.md
│   ├── api-and-error-boundaries.md
│   └── unit-testing-and-error-boundaries.md
└── tests/
    └── smart-priority.test.js
```

**Important:** The ZIP contains the updated `api/tasks.php` endpoint but not database credentials or the other PHP API files. Keep your existing `api/db.php`, `login.php`, `register.php`, `me.php`, and `logout.php`. Back up the old `api/tasks.php` before replacing it with the packaged version. This endpoint requires the existing `tasks.user_id` and `tasks.notes` columns.

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

## Automated unit tests

A no-dependency Node.js test suite exercises the production Smart Priority functions. Install Node.js 18 or later, open a terminal in the project root, and run:

```bash
node --test tests/smart-priority.test.js
```

The suite covers deadline urgency boundaries, priority points, effort limits, total-score calculation, completed-task exclusion, highest-score selection, tie-breaking, and the no-active-task case. The packaged test suite was executed with Node.js v22.16.0 on 31 October 2026: **14 passed, 0 failed**. This is a unit-test result only; it does not replace local PHP/MySQL or browser regression testing. See `docs/unit-testing-and-error-boundaries.md` for individual test IDs and the manual API integration plan.

## Requirements

- Windows with XAMPP installed, or an equivalent environment with Apache, PHP, and MySQL/MariaDB.
- A modern browser such as Chrome, Edge, or Firefox.
- The project database and the PHP API files listed above.

## Installation with XAMPP

1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. Back up the existing folder `C:\xampp\htdocs\deadline-drift` before replacing files.
3. Extract the modular ZIP.
4. Copy `index.html`, `css/`, `js/`, `docs/`, and `tests/` into `C:\xampp\htdocs\deadline-drift\`. Replace `index.html` and merge folders if Windows asks.
5. Back up the existing `api/tasks.php`, then copy the packaged `api/tasks.php` into the same folder. Keep the existing `db.php`, `login.php`, `register.php`, `me.php`, and `logout.php` unchanged. Configure `db.php` locally; do not overwrite it with a sample file.
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

The project now includes a no-dependency automated JavaScript unit suite for Smart Priority, plus a separate manual test plan for PHP/MySQL and browser integration. The automated suite was run with Node.js v22.16.0 on 31 October 2026 and returned **14 passed, 0 failed**. This result covers only the tested Smart Priority functions; it does not mark the API or full application regression tests as passed.

Run the automated tests from the project root:

```bash
node --test tests/smart-priority.test.js
```

The automated cases cover each deadline urgency bucket, High/Medium/Low priority contributions, the effort cap and invalid effort boundary, total score, completed-task exclusion, highest-score selection, tie-breaking by earlier deadline, and the no-active-task case.

The manual integration checklist covers registration, login, session enforcement, create/read/update/delete task operations, notes, task ownership, database persistence, unsupported methods, invalid inputs, and database/network failures. Run those cases against the XAMPP application and record the actual response and database effect before marking them as passed. For an authenticated session, the updated task endpoint checks supported methods before decoding the request body, so an unsupported method returns HTTP `405` consistently. An unauthenticated call is rejected first with HTTP `401`.

See:
- `docs/unit-testing-and-error-boundaries.md` — individual automated test IDs, execution result, and manual API/error-boundary test matrix.
- `docs/api-and-error-boundaries.md` — API methods, request formats, and expected error responses.
- `docs/testing-checklist.md` — browser and regression checklist.
- `docs/student-validation-form.md` — form for recording genuine student feedback.

Structured usability testing with at least three student participants has **not yet been documented as complete**. Do not present invented ratings or comments as test results.

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
- [`docs/api-and-error-boundaries.md`](docs/api-and-error-boundaries.md) — API contracts and response boundaries.
- [`docs/unit-testing-and-error-boundaries.md`](docs/unit-testing-and-error-boundaries.md) — automated unit tests and manual integration test matrix.
- [`docs/testing-checklist.md`](docs/testing-checklist.md) — manual feature regression checklist.
- [`docs/api-and-error-boundaries.md`](docs/api-and-error-boundaries.md) — endpoint contracts and API failure-boundary test notes.
- [`docs/student-validation-form.md`](docs/student-validation-form.md) — form for recording genuine student feedback.
- [`docs/review2-validation-status.md`](docs/review2-validation-status.md) — current implementation and validation status.

## License

No license has been specified for this prototype. Add a license file if you intend to distribute or reuse the project publicly.
