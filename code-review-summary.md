# Deadline Drift — Code Review Update

**Date:** 31 October 2026

## Improvements made

1. Added file-level headers to the frontend JavaScript files to explain each module's purpose and dependencies.
2. Added function-level documentation for authentication, task loading and updates, date utilities, dashboard calculations, Smart Priority, task CRUD, calendar rendering, analytics, Focus Mode, reminders, and settings.
3. Reformatted `js/modules/focus-mode.js` into readable multi-line code and documented the timer lifecycle. The timer remains a 25-minute countdown with Start, Pause, and Reset behavior.
4. Added `docs/code-comment-map.md`, which maps modules to responsibilities and describes important implementation boundaries.
5. Updated the root README with a section explaining the code-comment convention and module guide.

## Verification performed for this update

| Check | Result |
|---|---|
| `node --check` for every frontend JavaScript file | Passed |
| Smart Priority unit tests (`node --test tests/smart-priority.test.js`) | 14 passed, 0 failed |
| PHP/MySQL integration test against the user's local XAMPP setup | Not run from this environment; run locally |
| Full browser regression after installing this update | Not run; perform locally |

## Scope and limitation

This update is primarily a readability and documentation improvement. No intended feature or API behavior was changed. The Focus Mode source was reformatted without changing its countdown logic. The syntax and Smart Priority unit checks passed in the authoring environment; this does not prove that every browser feature or the local PHP/MySQL integration works on the user's computer.
