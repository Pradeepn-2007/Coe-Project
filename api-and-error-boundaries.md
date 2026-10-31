# API Contract and Error-Boundary Test Notes

This document supplements the root README. These are expected API contracts for the current Deadline Drift PHP backend. Execute each test against the local XAMPP application and record the observed result before marking it passed.

## Request conventions

- Base path: `http://localhost/deadline-drift/api/`
- JSON request bodies use `Content-Type: application/json`.
- Same-origin browser requests use the PHP session cookie.
- Task routes require a valid session and scope each record to `$_SESSION["user_id"]`.

## Endpoint summary

| Endpoint | Method | Body | Expected purpose/result |
|---|---|---|---|
| `register.php` | POST | `{ "name": "...", "email": "...", "password": "..." }` | Validate and create a user; password is hashed before insertion. |
| `login.php` | POST | `{ "email": "...", "password": "..." }` | Verify credentials and create a PHP session. |
| `me.php` | GET | None | Return whether a session is active and, when active, basic user details. |
| `logout.php` | POST | None | Clear session data and the session cookie. |
| `tasks.php` | GET | None | Return the signed-in user's task array. |
| `tasks.php` | POST | Full task object including required `name`, `subject`, `type`, `deadline`; optional `notes` | Insert a task owned by the current user. |
| `tasks.php` | PUT | `{ "id": n, "status": "todo\|progress\|completed" }` or full editable task object | Update status only or update all task fields. |
| `tasks.php` | DELETE | `{ "id": n }` | Delete only a task owned by the current user. |

## Error boundaries to exercise

| Case | Expected HTTP status | Expected effect on stored data |
|---|---:|---|
| Missing or invalid registration fields | 400 | No account created |
| Duplicate registration email | 409 | Existing account unchanged |
| Invalid login credentials | 401 | No session created |
| Unauthenticated task API request | 401 | No task data exposed or changed |
| Malformed/missing task JSON body | 400 | No task change |
| Invalid task ID, priority, or status | 400 | No invalid task change |
| Unsupported task API method | 405 | No task change |
| Database connection/query failure | 500 | Operation fails; client receives generic error |
| Cross-user task ID supplied | Varies by current endpoint response | The other user's row must not be changed or deleted because the SQL includes the session user ID |

The current task DELETE handler returns success if the SQL statement executes, even if no row matched the supplied ID and user ID. A future backend improvement can inspect `affected_rows` and return a separate not-found response.

## Execution log template

| Date | Test ID | Actual status / message | Passed? | Screenshot or notes |
|---|---|---|---|---|
|  |  |  | Pending |  |
|  |  |  | Pending |  |
|  |  |  | Pending |  |

Do not fill in results before executing the requests.
