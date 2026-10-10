# Manual regression checklist

Run these checks at `http://localhost/deadline-drift/` with Apache and MySQL running. Use actual outcomes only in the review report.

| # | Check | Expected result | Actual result |
|---:|---|---|---|
| 1 | Login with a registered account | Dashboard opens | Pending |
| 2 | Add a task with a note | Task appears in dashboard and task list | Pending |
| 3 | Refresh page | Task reloads from MySQL | Pending |
| 4 | Edit task fields and notes | Updated values persist after refresh | Pending |
| 5 | Change status | Status and analytics update | Pending |
| 6 | Delete task | Task disappears after refresh | Pending |
| 7 | Search and filter | Visible tasks match the criteria | Pending |
| 8 | Calendar navigation and task click | Month changes; task opens for editing | Pending |
| 9 | Smart Priority | Highest-scored active task is recommended | Pending |
| 10 | Focus Mode Start/Pause/Reset | Timer controls work | Pending |
| 11 | Enable reminders | Permission and reminders behave appropriately | Pending |
| 12 | Theme and compact mode | Preferences toggle and persist as implemented | Pending |
| 13 | Export CSV | CSV downloads with the available task fields | Pending |
| 14 | Test with three students | Record actual comments, ratings and observed issues | Pending |

Replace `Pending` with the real result and add brief evidence/notes after testing. Do not fill in outcomes before performing the checks.


## Smart Priority scoring checks

Use the cases in `smart-priority.md` with deadlines relative to the test date. Verify the score shown in the dashboard matches the formula for each case. In particular, test the effort cap with an 8-hour task (effort contribution should be 5 points) and create a tie to check that the earlier deadline is recommended. The app's score explanation should show urgency, priority, effort and total points.

## Student validation

Use `student-validation-form.md` with at least three real student testers. Record the actual selections, ratings, notes and any issues. Do not change the status from Pending until each item has actually been tested.
