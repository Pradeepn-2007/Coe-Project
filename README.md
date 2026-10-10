[README.md](https://github.com/user-attachments/files/33281972/README.md)
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

### PHP API endpoints expected by the frontend

| Endpoint | Purpose |
|---|---|
| `api/db.php` | Connects to the `deadline_drift` database |
| `api/register.php` | Creates an account |
| `api/login.php` | Starts a user session |
| `api/me.php` | Reports the current session state |
| `api/logout.php` | Ends the user session |
| `api/tasks.php` | Reads and changes the signed-in user's tasks |

The frontend makes same-origin requests to these endpoints. The task API should enforce authentication and restrict each read/write operation to the currently signed-in user's records.

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

## Testing and validation

Use `docs/testing-checklist.md` to record the result of each check, any issue found, and evidence such as a screenshot. Test task creation, persistence after refresh, editing, status updates, deletion, calendar, analytics, Focus Mode, reminders, settings, CSV export, and login/logout.

Structured usability testing with at least three student participants has **not yet been documented as complete**. `docs/student-validation-form.md` is a blank template for recording genuine, anonymized responses. Do not present invented ratings or comments as test results. Update `docs/review2-validation-status.md` only when new checks or participant sessions have actually occurred.

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
- [`docs/testing-checklist.md`](docs/testing-checklist.md) — manual feature test checklist.
- [`docs/student-validation-form.md`](docs/student-validation-form.md) — form for recording genuine student feedback.
- [`docs/review2-validation-status.md`](docs/review2-validation-status.md) — current implementation and validation status.

## License

No license has been specified for this prototype. Add a license file if you intend to distribute or reuse the project publicly.
