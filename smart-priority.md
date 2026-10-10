# Smart Priority — Rule, Explanation, and Test Plan

## Purpose

Smart Priority is a transparent, deterministic heuristic. It is **not** a trained machine-learning model. The application scores each task that is not marked `completed`, then recommends the task with the highest score.

## Formula implemented in `js/modules/dashboard.js`

`Task Score = Urgency Score + (Priority Weight × 2) + Effort Contribution`

`Effort Contribution = min(max(Estimated Effort Hours, 0), 5)`

### Urgency score

| Deadline | Score |
|---|---:|
| Overdue | 10 |
| Due today | 9 |
| Due tomorrow | 7 |
| Due in 2–3 days | 5 |
| Due in 4–7 days | 3 |
| Due in more than 7 days | 1 |

### Priority weight

| Selected priority | Weight | Added to score |
|---|---:|---:|
| High | 3 | 6 |
| Medium | 2 | 4 |
| Low | 1 | 2 |

### Effort contribution

The estimated effort contributes its number of hours, capped at 5 points. For example, 3 estimated hours adds 3 points, while 8 estimated hours adds only 5 points. The cap prevents effort from increasing the score without limit.

### Example

A task due today, with High priority and an estimated effort of 3 hours receives:

`9 + (3 × 2) + 3 = 18`

The dashboard now displays the urgency, priority, effort and total-score components under **“Why this task?”**, so users and reviewers can inspect the recommendation.

## Tie-breaking rule

1. Higher total score is recommended first.
2. If scores tie, the task with the earlier deadline is recommended.
3. If both score and deadline are equal, the current task-list order is retained.

Completed tasks are excluded from recommendations.

## Rationale and limitation

Deadline urgency and user-selected priority are the primary signals. Estimated effort is included to make larger tasks visible, but this can over-rank long tasks. The weights are initial design assumptions, not empirically proven weights. User testing should establish whether the recommendations match students' real decisions. Change the weights only after documenting evidence and the reason for the change.

## Suggested manual score checks

Use dates relative to the day of testing so results remain valid on any date.

| Case | Deadline | Priority | Effort | Expected calculation | Expected score |
|---|---|---|---:|---|---:|
| A | Yesterday | High | 2 h | 10 + 6 + 2 | 18 |
| B | Today | Medium | 1 h | 9 + 4 + 1 | 14 |
| C | Tomorrow | Low | 4 h | 7 + 2 + 4 | 13 |
| D | In 2 days | High | 3 h | 5 + 6 + 3 | 14 |
| E | In 5 days | Medium | 5 h | 3 + 4 + 5 | 12 |
| F | In 10 days | High | 8 h | 1 + 6 + 5 (effort capped) | 12 |

Case A should rank above the others. With equal scores, an earlier deadline should win. Manually verify these cases in the interface and record actual outcomes in `student-validation-form.md` or your test log.

## Validation requirement

Test the prototype with at least three real student users. Ask each person to choose what they would work on **before** revealing the app's recommendation, then compare their choice and reasoning with Smart Priority. Record anonymized notes and actual ratings; do not invent results. See `student-validation-form.md` for the protocol.
