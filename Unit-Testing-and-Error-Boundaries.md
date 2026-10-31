# Unit Testing and Error-Boundary Documentation

This document separates automated JavaScript unit checks from manual PHP/MySQL integration checks. A passing JavaScript test does not prove that the PHP API or MySQL database is working; those parts must be tested through the local XAMPP application.

## 1. Automated unit tests

### Scope

The automated tests execute the project's actual `task-utils.js` and `dashboard.js` scripts in an isolated JavaScript context. They cover the Smart Priority scoring and task recommendation rules without requiring a browser, PHP, or a database.

### Requirements and command

- Node.js 18 or later (the tests use Node's built-in `node:test`, `node:assert`, and `node:vm` modules).
- No third-party packages and no `npm install` are required.
- Open a terminal in the `deadline-drift` project root and run:

```bash
node --test tests/smart-priority.test.js
```

### Automated cases

| Test ID | Function/behavior | Input boundary | Expected result |
|---|---|---|---|
| SP-01 | Overdue urgency | Deadline = yesterday | 10 urgency points |
| SP-02 | Due-today urgency | Deadline = today | 9 urgency points |
| SP-03 | Tomorrow urgency | Deadline = tomorrow | 7 urgency points |
| SP-04 | 2–3 day urgency | Deadlines = 2 and 3 days away | 5 urgency points |
| SP-05 | 4–7 day urgency | Deadlines = 4 and 7 days away | 3 urgency points |
| SP-06 | Beyond-one-week urgency | Deadline = 8 days away | 1 urgency point |
| SP-07 | Priority contribution | High / Medium / Low | 6 / 4 / 2 points |
| SP-08 | Effort upper boundary | 8 estimated hours | Effort contribution is capped at 5 |
| SP-09 | Effort lower/invalid boundary | Negative or non-numeric effort | 0 effort points |
| SP-10 | Score calculation | Due today, High, 3 hours | Total score = 18 |
| SP-11 | Completed-task exclusion | A completed task has a higher possible score | Completed task is not recommended |
| SP-12 | Highest-score selection | Two active tasks with different scores | Higher-scoring task is recommended |
| SP-13 | Score tie-break | Equal total scores, different deadlines | Earlier deadline is recommended |
| SP-14 | No active tasks | All tasks are completed | Recommendation is `null` |

### Execution result

The automated suite was executed against the packaged JavaScript files on 31 October 2026 using Node.js v22.16.0. Result: **14 tests passed, 0 failed**.

This result applies only to SP-01 through SP-14. It is not a claim that the complete web application or PHP/MySQL integration passed all tests.

## 2. Manual API and database integration tests

Run these through the XAMPP application at `http://localhost/deadline-drift/`. Use a test account and non-sensitive sample data. Record the actual HTTP status, JSON message, and database effect before marking any row as passed.

| Test ID | Test action / boundary | Expected response | Expected data effect | Status |
|---|---|---|---|---|
| API-01 | Register with all valid fields | Success JSON | One user row is created; password is stored as a hash | Pending local run |
| API-02 | Register with a missing field or invalid email | HTTP 400 | No user row is created | Pending local run |
| API-03 | Register an already-used email | HTTP 409 | Existing user is unchanged | Pending local run |
| API-04 | Login with incorrect credentials | HTTP 401 | No authenticated session is created | Pending local run |
| API-05 | Request `tasks.php` without login | HTTP 401 | No task data is returned | Previously observed; recheck after changes |
| API-06 | Create a valid task | Success JSON | Row is inserted with the current session's `user_id` | Pending local run |
| API-07 | Create task with missing required fields | HTTP 400 | No task row is inserted | Pending local run |
| API-08 | Submit invalid priority or status | HTTP 400 | No invalid task row is inserted/updated | Pending local run |
| API-09 | Change only task status using PUT | Success JSON | Only the owned task's status changes | Pending local run |
| API-10 | Edit all task fields, including notes | Success JSON | Owned task fields are updated | Pending local run |
| API-11 | Send invalid or non-positive task ID | HTTP 400 | No task is changed or deleted | Pending local run |
| API-12 | Delete an owned task | Success JSON | Only that user's matching task is deleted | Pending local run |
| API-13 | Use another user's task ID | Request must not alter another user's row | Other account's record remains unchanged | Pending local run |
| API-14 | As an authenticated user, send an unsupported method to `tasks.php` | HTTP 405 | No task data is changed | Pending local run; use updated endpoint |
| API-15 | Refresh after creating/updating a task | Task list loads successfully | Database-backed values remain visible | Previously observed for core tasks; recheck full flow |

## 3. Error boundaries and handling

| Boundary | Handling in the API | Verification |
|---|---|---|
| Authentication missing | Task API checks `$_SESSION['user_id']` and returns HTTP 401 | API-05 |
| Required input missing | Request fields are checked before database insert/update | API-02, API-07 |
| Duplicate account | Registration checks the email and returns HTTP 409 | API-03 |
| Invalid task ID | PUT/DELETE reject IDs less than or equal to zero with HTTP 400 | API-11 |
| Invalid task priority/status | API restricts values to the supported enum values | API-08 |
| Unsupported HTTP method | Updated task endpoint checks allowed methods before decoding the body and returns HTTP 405 | API-14 |
| Database connection failure | `db.php` returns a generic JSON error with HTTP 500; detailed credentials should not be exposed | Requires controlled local test |
| Record ownership | Task queries include both task ID and session user ID in write predicates | API-13 |
| Browser notification permission denied | App should continue without browser notifications; in-app functionality should remain usable | Manual UI check |
| Network/API unavailable | Frontend should show an error message and should not silently treat a failed save as successful | Manual UI check |

## 4. Recording actual results

Use this log during the local test run. Replace `Pending` only after performing the action and checking the response and database effect.

| Date | Test ID | Actual status/message | Passed / Failed | Evidence / notes |
|---|---|---|---|---|
|  |  |  | Pending |  |
|  |  |  | Pending |  |
|  |  |  | Pending |  |
|  |  |  | Pending |  |

## 5. Current limitations

- The automated suite currently focuses on the Smart Priority calculation and recommendation logic.
- PHP endpoint and MySQL integration cases are documented for manual execution; they are not represented as automated or passed by the JavaScript suite.
- Browser-specific behavior such as notifications, downloads, layout, and the focus timer needs manual browser testing.
- Student usability validation is separate from unit/integration testing and still requires genuine participants and recorded feedback.
