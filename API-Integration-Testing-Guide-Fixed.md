# Deadline Drift API Integration Test — Setup Guide

The file `tests/api-integration.test.js` is a **standalone Node.js test script**. It is not a frontend JavaScript file and should not be opened in a browser or pasted into `index.html`.

## 1. Put the file in the correct folder

Save `api-integration.test.js` here:

```text
C:\xampp\htdocs\deadline-drift\tests\api-integration.test.js
```

Create the `tests` folder if it does not exist.

## 2. Check XAMPP first

Start **Apache** and **MySQL** in the XAMPP Control Panel. Then open this URL in Chrome:

```text
http://localhost/deadline-drift/api/me.php
```

It should return JSON. For example, an unauthenticated session may return:

```json
{"success":true,"logged_in":false}
```

If the URL does not open in Chrome, the Node test cannot connect either. Confirm that the project folder is inside `C:\xampp\htdocs\deadline-drift` and that Apache is running.

## 3. Run the script from the project root

Open VS Code Terminal or Command Prompt and run:

```bat
cd C:\xampp\htdocs\deadline-drift
node --version
node tests\api-integration.test.js
```

Use the command above exactly. This fixed script is self-running; do **not** use `node --test` for this version.

## 4. If Apache uses a different port

If the browser URL that works is, for example, `http://localhost:8080/deadline-drift/`, set the same base URL before running the test.

Command Prompt:

```bat
set DEADLINE_DRIFT_BASE_URL=http://127.0.0.1:8080/deadline-drift
node tests\api-integration.test.js
```

PowerShell:

```powershell
$env:DEADLINE_DRIFT_BASE_URL = "http://127.0.0.1:8080/deadline-drift"
node tests/api-integration.test.js
```

Replace `8080` with the port shown in the URL that works in your browser. If your URL uses the normal port, the default `http://127.0.0.1/deadline-drift` is correct.

## 5. Required backend/database setup

The script expects:

- Database name: `deadline_drift`
- Tables: `users` and `tasks`
- `tasks.user_id` column
- `tasks.notes` column
- API files: `db.php`, `register.php`, `login.php`, `me.php`, `logout.php`, and the notes-enabled `tasks.php`
- `tasks.php` supports GET, POST, PUT (full edit and status-only update), and DELETE

If the test fails on task creation and the error mentions an unknown column, check the `user_id` and `notes` columns in phpMyAdmin. Do not recreate the whole database.

## 6. What the script does

The script tests server reachability, unauthenticated access, registration, duplicate email rejection, invalid login, authenticated sessions, task creation/read/edit/status update, invalid status validation, user-to-user task isolation, unsupported methods, task deletion, and logout.

It creates two temporary test accounts and one task. It deletes the task at the end, but the two user accounts remain. Their unique email addresses are printed at the beginning of the run. Remove those accounts manually in phpMyAdmin only after checking the printed addresses.

## 7. Understand the first failure

- `ECONNREFUSED`: Apache is stopped, or the port/URL is wrong.
- `404`: wrong project folder or API path.
- `non-JSON content`: PHP may have emitted a warning/fatal error or an HTML error page; inspect the response and Apache/PHP error log.
- `Unknown column 'notes'` or `user_id`: the tasks table schema is missing the required column.
- `401` at authenticated task operations: the PHP session cookie was not retained or login did not succeed; inspect `login.php` and its response.
- Duplicate email test does not return `409`: inspect `register.php` validation and response status.

The script stops at the first failed check to avoid producing misleading follow-on failures. A passing result must be observed by running it against the user's own XAMPP/MySQL setup; syntax validation alone is not an integration test.
