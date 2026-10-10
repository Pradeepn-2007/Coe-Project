/* =========================================================
   GREETING
========================================================= */

function getGreeting() {

    const hour =
        new Date().getHours();

    if (hour < 12) {

        return "Good morning";

    }

    if (hour < 17) {

        return "Good afternoon";

    }

    return "Good evening";

}


function updateGreeting() {

    document
        .getElementById("pageTitle")
        .textContent =
        getGreeting();

}


/* =========================================================
   DASHBOARD STATS
========================================================= */

function updateStats() {

    const activeTasks =
        tasks.filter(
            t => t.status !== "completed"
        );


    const today =
        activeTasks.filter(
            t => isToday(t.deadline)
        ).length;


    const upcoming =
        activeTasks.filter(t => {

            const days =
                daysUntil(t.deadline);

            return (
                days >= 0 &&
                days <= 7
            );

        }).length;


    const completed =
        tasks.filter(
            t => t.status === "completed"
        ).length;


    const progress =
        tasks.length
            ? Math.round(
                (completed / tasks.length) * 100
            )
            : 0;


    document
        .getElementById("todayCount")
        .textContent = today;


    document
        .getElementById("upcomingCount")
        .textContent = upcoming;


    document
        .getElementById("completedCount")
        .textContent = completed;


    document
        .getElementById("progressValue")
        .textContent = `${progress}%`;


    document
        .getElementById("progressFill")
        .style.width = `${progress}%`;

}


/* =========================================================
   SMART PRIORITY
========================================================= */

function getScoreBreakdown(task) {

    const days = daysUntil(task.deadline);
    let urgencyScore;

    if (days < 0) {
        urgencyScore = 10;
    } else if (days === 0) {
        urgencyScore = 9;
    } else if (days === 1) {
        urgencyScore = 7;
    } else if (days <= 3) {
        urgencyScore = 5;
    } else if (days <= 7) {
        urgencyScore = 3;
    } else {
        urgencyScore = 1;
    }

    const selectedPriorityWeight = priorityWeight(task.priority);
    const priorityScore = selectedPriorityWeight * 2;
    const effortScore = Math.min(
        Math.max(Number(task.effort) || 0, 0),
        5
    );

    return {
        days,
        urgencyScore,
        selectedPriorityWeight,
        priorityScore,
        effortScore,
        total: urgencyScore + priorityScore + effortScore
    };

}


function calculateScore(task) {
    return getScoreBreakdown(task).total;
}

function getRecommendation() {

    const activeTasks =
        tasks.filter(
            task =>
                task.status !==
                "completed"
        );


    if (
        activeTasks.length === 0
    ) {

        return null;

    }


    return [...activeTasks]
        .sort((a, b) => {
            const scoreDifference = calculateScore(b) - calculateScore(a);
            if (scoreDifference !== 0) return scoreDifference;

            // Tie-break: recommend the earlier deadline first.
            // If score and deadline are both equal, retain the existing task order.
            return String(a.deadline || "").localeCompare(String(b.deadline || ""));
        })[0];

}


function renderRecommendation() {

    const container =
        document.getElementById(
            "recommendationContent"
        );


    const task =
        getRecommendation();


    if (!task) {

        container.innerHTML = `
            <div class="empty-recommendation">
                All tasks are completed. Great work.
            </div>
        `;

        return;

    }


    const days =
        daysUntil(
            task.deadline
        );


    let deadlineText;


    if (days < 0) {

        deadlineText =
            "Overdue";

    } else if (days === 0) {

        deadlineText =
            "Due today";

    } else if (days === 1) {

        deadlineText =
            "Due tomorrow";

    } else {

        deadlineText =
            `Due in ${days} days`;

    }


    const breakdown = getScoreBreakdown(task);

    container.innerHTML = `

        <div class="recommended-task">

            <div>

                <div class="recommended-title">

                    ${escapeHTML(task.name)}

                </div>

                <div class="recommended-meta">

                    ${escapeHTML(task.subject)}
                    &bull; ${deadlineText}
                    &bull; ${task.effort} hr${task.effort > 1 ? "s" : ""}
                    &bull; ${task.priority} priority

                </div>

            </div>


            <button
                class="start-btn"
                onclick="startRecommendedTask(${task.id})">

                ${
                    task.status === "progress"
                    ? "CONTINUE TASK"
                    : "START TASK"
                }

            </button>

        </div>

        <div class="priority-explanation" aria-label="Smart Priority score explanation">
            <div class="priority-explanation-top">
                <strong>Why this task?</strong>
                <span class="priority-total">Total score: ${breakdown.total}</span>
            </div>
            <div class="priority-score-grid">
                <div class="priority-score-item">
                    <span>Deadline urgency</span>
                    <strong>${breakdown.urgencyScore} pts</strong>
                </div>
                <div class="priority-score-item">
                    <span>Selected priority</span>
                    <strong>${breakdown.priorityScore} pts</strong>
                </div>
                <div class="priority-score-item">
                    <span>Estimated effort</span>
                    <strong>${breakdown.effortScore} pts</strong>
                </div>
            </div>
            <p>Highest score among unfinished tasks. Effort adds up to 5 points; if scores tie, the earlier deadline is recommended.</p>
        </div>

    `;

}


async function startRecommendedTask(id) {

    const task =
        tasks.find(
            t => t.id === id
        );


    if (!task) return;


    if (
        task.status === "todo"
    ) {

        task.status =
            "progress";

        try {
            await saveTaskStatus(id, "progress");
            renderAll();
        } catch (error) {
            console.error(error);
            task.status = "todo";
            showNotification("Could not update the task.");
            return;
        }

    }


    showNotification(
        "Task marked as In Progress."
    );

}


