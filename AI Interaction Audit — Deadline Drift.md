# AI Interaction Audit
## Project Better Tomorrow — Deadline Drift

### 1. Purpose of AI Usage

AI was used as a **divergence partner** during the Design Thinking process.

The purpose was not to allow AI to independently decide the final solution. Instead, AI was used to generate alternatives, explore possibilities, organize ideas, and assist with prototype development.

The final project direction was selected based on relevance, feasibility, simplicity, and suitability for college students.

---

## 2. AI Interaction Log

### Interaction 1 — Problem Discovery

**Prompt:**

> Suggest real-world problems commonly faced by college students that could be addressed through a simple software solution. Focus on problems that have clear users, practical impact, and can be prototyped quickly.

**AI Output / Direction:**

AI suggested several areas including:

- Time management
- Assignment tracking
- Attendance management
- Study planning
- Campus communication
- Exam preparation
- Group project coordination

**Decision:** ADOPTED

**Reason:**

Academic workload and deadline management appeared to be a focused problem that could be addressed without building a complex system.

---

### Interaction 2 — Problem Exploration

**Prompt:**

> Explore why college students may struggle to keep track of assignments, projects, tests, and academic deadlines. Identify possible causes and consequences.

**AI Output / Direction:**

The discussion identified potential causes such as:

- Information being distributed across multiple sources
- Multiple subjects having overlapping deadlines
- Manual reminder systems
- Difficulty judging which task should be completed first
- Lack of a single academic workload view

**Decision:** PARTIALLY ADOPTED

**Reason:**

These points were used as hypotheses for the problem rather than being treated as automatically proven facts.

---

### Interaction 3 — Solution Ideation

**Prompt:**

> Generate different software solutions for students who have difficulty managing multiple academic deadlines.

**Ideas Generated:**

1. Academic calendar
2. Mobile reminder application
3. Assignment tracker
4. AI study assistant
5. Academic dashboard
6. Smart task prioritization system
7. Collaborative student planner

**Decision:** ADOPTED

The academic dashboard with task prioritization was selected.

**Reason:**

It directly addressed the defined problem while remaining feasible as a student-level prototype.

---

### Interaction 4 — Feature Selection

**Prompt:**

> What features would be useful in a simple academic deadline management dashboard without making the application unnecessarily complex?

**Suggestions considered:**

- Dashboard
- Task creation
- Deadline
- Subject
- Priority
- Estimated effort
- Task status
- Progress
- Search
- Filtering
- Notifications
- Calendar

**Decision:**

The core features were adopted:

- Task creation
- Subject
- Deadline
- Priority
- Estimated effort
- Task status
- Progress
- Search/filter
- Smart Priority

Complex features such as external university integration and advanced notifications were postponed.

---

### Interaction 5 — Smart Priority Concept

**Prompt:**

> Design a simple prioritization method for academic tasks using deadline, task priority, and estimated effort.

**AI Direction:**

A scoring approach was suggested in which tasks receive greater importance when they:

- Have an approaching deadline
- Have higher priority
- Require significant effort

**Decision:** ADOPTED WITH SIMPLIFICATION

The concept was implemented as a simple recommendation system rather than a complex machine-learning model.

**Reason:**

A transparent rule-based approach was more appropriate for the prototype and easier for users to understand.

---

### Interaction 6 — UI/UX Development

**Prompt:**

> Design a professional, student-friendly dashboard for an academic task management application. Keep the interface simple and make deadlines, progress, and recommended tasks easy to understand.

**AI Suggestions:**

- Sidebar navigation
- Dashboard cards
- Task lists
- Status indicators
- Priority indicators
- Smart recommendation section
- Add-task modal

**Decision:** ADOPTED

These suggestions were incorporated into the prototype interface.

---

### Interaction 7 — Prototype Development

**Prompt:**

> Create a single-file HTML, CSS, and JavaScript prototype for an academic deadline management dashboard. It should work without external dependencies and store tasks locally in the browser.

**AI Output:**

A complete single-page prototype structure was generated.

**Decision:** ADOPTED AND REVIEWED

The generated implementation was reviewed and adjusted to match the project's requirements.

---

## 3. Ideas Rejected

Not every AI suggestion was implemented.

### Rejected: Full AI Study Assistant

**Reason:**  
It would expand the project beyond the core deadline-management problem.

### Rejected: University LMS Integration

**Reason:**  
Integration with external academic systems would require APIs, authentication, and additional infrastructure.

### Rejected: Social Student Network

**Reason:**  
It was not directly required to solve the defined problem.

### Rejected: Complex Machine Learning Prediction

**Reason:**  
A rule-based prioritization system was sufficient for the prototype and easier to explain and validate.

### Rejected: Large Backend System

**Reason:**  
The current goal was to create a functional prototype quickly without unnecessary technical complexity.

---

## 4. AI Output Verification

AI-generated information was treated as a source of possibilities rather than unquestioned evidence.

The general problem direction was compared against secondary research concerning student organization, fragmented academic information, deadlines, and task management.

Claims that could not be independently established were not presented as direct user findings.

---

## 5. Hallucination Handling

AI-generated assumptions were identified as assumptions when they had not been directly validated.

For example:

**AI assumption:**

> Students definitely forget assignments because information is spread across multiple platforms.

**Treatment:**

This was not presented as a verified fact about all students. Instead, it was treated as a problem hypothesis that requires validation with actual users.

---

## 6. Human Decision-Making

The final decisions were made based on:

- Problem relevance
- Feasibility
- Prototype complexity
- Expected usefulness
- Ability to demonstrate the solution
- Suitability for the Design Thinking assignment

AI generated possibilities, but the final problem, feature set, and prototype scope were selected through human judgment.

---

## 7. Summary

AI played three major roles in the project:

**Divergence → Evaluation → Development**

### Divergence

AI generated multiple possible student problems and solution ideas.

### Evaluation

The ideas were compared based on feasibility and relevance to the defined problem.

### Development

AI assisted with interface planning and prototype implementation.

The final solution was intentionally kept focused:

> **Deadline Drift helps students centralize academic tasks and identify what they should work on first.**