# Project Better Tomorrow
## Deadline Drift — Academic Planner

### 1. Project Overview

Deadline Drift is a web-based academic task management system designed to help students organize assignments, tests, projects, submissions, and other academic responsibilities in one place.

The system focuses on a common student problem: academic tasks and deadlines can become difficult to track when they are spread across different subjects, classroom announcements, messaging platforms, notes, and personal reminders.

The prototype provides a centralized dashboard where students can add academic tasks, view upcoming deadlines, track completion, and receive a smart recommendation about which task should receive attention first.

---

## 2. Problem Statement

Students often manage multiple academic responsibilities simultaneously. Assignments, laboratory records, examinations, projects, presentations, and submissions may have different deadlines and priorities.

When this information is fragmented across different sources, students may find it difficult to determine:

- What needs to be completed first
- Which deadline is approaching
- How much work remains
- Which task deserves immediate attention
- How much progress they have made

### Defined Problem

**Students need a simple way to centralize academic deadlines and prioritize their workload so that important tasks are less likely to be forgotten or delayed.**

---

## 3. Target Users

The primary users are:

- College students
- Undergraduate students
- Students handling multiple subjects simultaneously
- Students managing assignments, projects, tests, and submissions

---

## 4. Ideation

Several possible solutions were considered:

1. Mobile reminder application
2. Digital academic calendar
3. Student task-management dashboard
4. Assignment deadline notification system
5. AI-based study planner
6. Centralized academic planner with task prioritization

The selected idea was **Deadline Drift — Academic Planner** because it combines deadline tracking with prioritization while remaining simple enough to prototype and use immediately.

---

## 5. Proposed Solution

Deadline Drift provides students with a centralized academic planning interface.

The prototype includes:

- Dashboard
- Task creation
- Subject classification
- Task type classification
- Deadline tracking
- Estimated effort
- Priority levels
- Task status
- Search and filtering
- Progress tracking
- Upcoming deadlines
- Smart Priority recommendation
- Browser-based data persistence

---

## 6. Prototype

The prototype was developed as a single-page web application using:

- HTML
- CSS
- JavaScript
- Browser Local Storage

No external database or backend server is required for the prototype.

### Main Screens

#### Dashboard

The dashboard provides an overview of the student's academic workload.

It displays:

- Tasks due today
- Upcoming tasks
- Completed tasks
- Overall progress
- Recommended task

#### Add Task

Students can create a task by entering:

- Task name
- Subject
- Task type
- Deadline
- Estimated effort
- Priority

#### Task Management

Each task can be tracked through three states:

**To Do → In Progress → Completed**

#### Smart Priority

The prototype calculates task urgency using factors such as:

- Deadline
- Priority
- Estimated effort

The system then recommends which task should receive attention first.

---

## 7. AI Interaction Audit

AI was used as a divergence and development partner rather than as a replacement for user decision-making.

### AI Usage

AI assistance was used for:

- Generating possible problem areas
- Exploring student productivity problems
- Developing alternative solution ideas
- Structuring the project concept
- Suggesting interface features
- Improving the prioritization concept
- Generating and refining prototype code
- Identifying possible usability improvements

### Example AI Prompt

> "Suggest real-world problems faced by college students that could be solved through a simple software prototype for a Design Thinking project."

### AI Suggestions Adopted

The following ideas were adopted:

- Centralized academic task management
- Deadline tracking
- Task priority
- Estimated effort
- Progress tracking
- Smart task recommendation

### Ideas Rejected

Some possible ideas were rejected because they increased project complexity or were not necessary for the core problem.

Examples include:

- Complex social networking features
- Full learning management system integration
- Automated university timetable integration
- Large-scale AI chatbot functionality
- Complex backend authentication

The project was intentionally kept focused on the core student problem.

### Hallucination / Verification

AI-generated suggestions were treated as ideas rather than automatically accepted facts.

The general problem of fragmented academic task and deadline management was cross-checked against secondary research before finalizing the problem direction.

---

## 8. Validation Plan

The prototype should be tested with at least three real students.

Each tester should be asked to perform simple tasks such as:

1. Add an academic assignment.
2. Set its deadline.
3. Set its priority.
4. Add another task.
5. View upcoming deadlines.
6. Identify the task recommended by Smart Priority.
7. Mark a task as completed.

### Questions for Testers

After testing, ask:

1. Was the dashboard easy to understand?
2. Was adding a task straightforward?
3. Did the priority recommendation make sense?
4. Was any information difficult to find?
5. Which feature was most useful?
6. What would you change?
7. Would you use a tool like this for managing academic work?

---

## 9. Validation Results

This section should be completed using feedback from three actual testers.

| Tester | What Worked | Problem Found | Suggested Improvement |
|---|---|---|---|
| Tester 1 | To be filled after testing | To be filled | To be filled |
| Tester 2 | To be filled after testing | To be filled | To be filled |
| Tester 3 | To be filled after testing | To be filled | To be filled |

**Important:** The table should contain real feedback. No fabricated responses should be presented as actual user testing.

---

## 10. Iteration

Based on tester feedback, the prototype can be improved by:

- Simplifying task creation
- Improving deadline visibility
- Making priority levels more obvious
- Improving mobile responsiveness
- Adding clearer task status indicators
- Improving the Smart Priority explanation

The exact changes should be selected based on the actual feedback received.

---

## 11. Limitations

The current prototype is a low-to-mid fidelity software prototype.

Current limitations include:

- Data is stored locally in the browser.
- There is no user account system.
- There is no cloud synchronization.
- There are no real-time notifications.
- Academic platforms are not integrated.
- Validation is limited until real student testing is completed.

---

## 12. Future Improvements

Future versions could include:

- Mobile application
- Cloud synchronization
- User accounts
- Push notifications
- Calendar integration
- University/LMS integration
- AI-assisted workload planning
- Automatic deadline extraction
- Weekly workload analytics
- Collaborative project management

---

## 13. Conclusion

Deadline Drift addresses a practical student productivity problem by providing a centralized environment for managing academic responsibilities.

Instead of relying on multiple disconnected reminders and notes, students can use one dashboard to understand their workload, track deadlines, monitor progress, and identify which task deserves attention first.

The prototype demonstrates how a relatively simple software intervention can be developed from problem identification through ideation and prototyping, while allowing further improvement through real user validation.