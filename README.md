# Coe-Project
# Deadline Drift — Academic Planner

### Project Better Tomorrow

A simple web-based academic planner designed to help college students organize deadlines, manage academic tasks, and identify what they should work on first.

---

## Overview

College students often manage multiple assignments, projects, laboratory work, tests, presentations, and submissions at the same time.

Deadline Drift provides a centralized dashboard where students can record their academic tasks, track deadlines, monitor progress, and prioritize their workload.

The project was developed as part of the **Project Better Tomorrow** Design Thinking activity.

---

## Problem Statement

Students may struggle to manage multiple academic responsibilities when deadlines and task information are distributed across different sources.

This can make it difficult to determine:

* Which task needs immediate attention
* Which deadline is approaching
* How much work remains
* Which task should be completed first

### Defined Problem

> **Students need a simple way to centralize academic deadlines and prioritize their workload so that important tasks are less likely to be forgotten or delayed.**

---

## Solution

**Deadline Drift** provides a single academic task-management dashboard.

Students can:

* Add academic tasks
* Set deadlines
* Select subjects
* Set task priority
* Estimate required effort
* Track task status
* Search and filter tasks
* Monitor overall progress
* View upcoming deadlines
* Receive a Smart Priority recommendation

---

## Key Feature — Smart Priority

The Smart Priority system recommends which task should receive attention first.

The recommendation considers:

**Deadline + Priority + Estimated Effort**

Tasks with greater urgency and importance receive a higher priority score.

The feature is intentionally rule-based so that the recommendation remains simple and understandable.

---

## Design Thinking Process

### 1. Empathize

The initial problem exploration focused on difficulties students may experience when managing multiple academic responsibilities.

Secondary research was also considered to understand the broader problem of fragmented academic information and deadline management.

### 2. Define

The problem was narrowed to:

> Students need a simple way to centralize academic deadlines and prioritize their workload.

### 3. Ideate

Multiple solutions were considered:

* Academic calendar
* Reminder application
* Assignment tracker
* Study planner
* Academic dashboard
* Smart task prioritization system

The academic dashboard with smart prioritization was selected.

### 4. Prototype

A functional web prototype was developed using HTML, CSS, and JavaScript.

The prototype uses browser Local Storage, allowing tasks to remain available when the page is reopened in the same browser.

### 5. Validate

The prototype is intended to be tested with real college students.

Testing focuses on:

* Ease of adding tasks
* Deadline visibility
* Understanding of priorities
* Usefulness of Smart Priority
* Overall dashboard usability

Actual tester feedback will be documented after testing.

---

## Technology Stack

| Technology    | Purpose                            |
| ------------- | ---------------------------------- |
| HTML          | Page structure                     |
| CSS           | UI design and responsive layout    |
| JavaScript    | Application logic and interactions |
| Local Storage | Browser-based task persistence     |
| GitHub Pages  | Website hosting                    |

No backend server or database is required for the current prototype.

---

## Project Structure

```text
project-better-tomorrow/
│
├── index.html
└── README.md
```

The entire application is contained in a single `index.html` file.

---

## How to Run Locally

### Option 1 — Directly Open

Download or clone the repository and open:

```text
index.html
```

in a web browser.

### Option 2 — GitHub Pages

The project can be hosted using GitHub Pages.

Live Demo:

```text
https://YOUR-GITHUB-USERNAME.github.io/project-better-tomorrow/
```

---

## How to Use

### Add a Task

1. Open the dashboard.
2. Click **Add Academic Task**.
3. Enter the task name.
4. Select the subject.
5. Choose the task type.
6. Set the deadline.
7. Select estimated effort.
8. Choose priority.
9. Save the task.

### Manage a Task

Tasks can be moved between:

```text
To Do
   ↓
In Progress
   ↓
Completed
```

### Smart Priority

Open the Smart Priority section to see which task the system recommends working on first.

---

## AI Interaction

AI was used as a **divergence and development partner** during the project.

AI assistance was used for:

* Exploring possible student problems
* Generating alternative solution ideas
* Feature ideation
* UI/UX brainstorming
* Prioritization logic
* Prototype development
* Refining the project structure

AI suggestions were evaluated before being incorporated into the project.

Ideas that were unnecessarily complex or outside the project's core scope were rejected.

---

## Validation

The prototype should be evaluated with at least three real student testers.

Suggested testing tasks:

1. Create an assignment.
2. Set a deadline.
3. Set its priority.
4. Add another academic task.
5. View upcoming deadlines.
6. Check Smart Priority.
7. Mark a task as completed.

### Feedback Questions

* Was the dashboard easy to understand?
* Was adding a task easy?
* Was the Smart Priority recommendation useful?
* Was anything difficult to find?
* Which feature was most useful?
* What should be improved?

**Note:** Tester feedback should only be added after conducting actual testing.

---

## Current Limitations

The current prototype:

* Stores data locally in the browser
* Does not have user accounts
* Does not synchronize data between devices
* Does not connect to university LMS platforms
* Does not provide server-side notifications
* Does not automatically import academic deadlines

---

## Future Improvements

Possible future versions could include:

* User authentication
* Cloud database
* Mobile application
* Push notifications
* Google Calendar integration
* University LMS integration
* Automatic deadline extraction
* Weekly workload analysis
* AI-assisted study planning
* Multi-device synchronization

---

## Project Goal

The goal of Deadline Drift is not to replace existing academic systems.

Instead, it provides a **simple personal planning layer** that helps students answer one important question:

> **"What should I work on right now?"**

---

## License

This project was developed for educational purposes as part of the **Project Better Tomorrow** Design Thinking activity.
