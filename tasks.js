/* =========================================================
   TASK CARDS
========================================================= */



function renderTaskCard(task) {

    const completed =
        task.status === "completed";


    return `

        <div class="task-card">

            <div class="task-main">

                <button
                    class="task-check ${completed ? "done" : ""}"
                    onclick="toggleTask(${task.id})">

                    ${completed ? "&#10003;" : ""}

                </button>


                <div>

                    <div class="task-title ${completed ? "completed" : ""}">

                        ${escapeHTML(task.name)}

                    </div>


                    <div class="task-meta">

                        ${escapeHTML(task.subject)}
                        &bull; ${escapeHTML(task.type)}
                        &bull; ${formatDate(task.deadline)}
                        &bull; ${task.effort} hr${task.effort > 1 ? "s" : ""}
                        &bull; ${getStatusLabel(task.status)}

                    </div>

                    ${task.notes ? `
                        <div class="task-notes-preview">${escapeHTML(task.notes)}</div>
                    ` : ""}

                </div>

            </div>


            <div class="task-right">

                <span
                    class="priority-badge priority-${task.priority}">

                    ${task.priority}

                </span>


                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                    title="Edit task">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">

                    &times;

                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   DASHBOARD TASKS
========================================================= */

function renderTasks() {

    const filter =
        document.getElementById(
            "dashboardFilter"
        ).value;


    let filtered =
        tasks.filter(
            task =>
                task.status !==
                "completed"
        );


    if (filter === "high") {

        filtered =
            filtered.filter(
                task =>
                    task.priority ===
                    "high"
            );

    }


    if (filter === "today") {

        filtered =
            filtered.filter(
                task =>
                    isToday(
                        task.deadline
                    )
            );

    }


    filtered.sort(
        (a, b) =>
            parseDate(a.deadline) -
            parseDate(b.deadline)
    );


    const container =
        document.getElementById(
            "taskList"
        );


    if (
        filtered.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                No tasks match this filter.

            </div>

        `;

        return;

    }


    container.innerHTML =
        filtered
            .map(renderTaskCard)
            .join("");

}


/* =========================================================
   ALL TASKS
========================================================= */

function renderAllTasks() {

    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase()
            .trim();


    const status =
        document
            .getElementById(
                "statusFilter"
            )
            .value;


    let filtered =
        [...tasks];


    if (search) {

        filtered =
            filtered.filter(task =>

                task.name
                    .toLowerCase()
                    .includes(search)

                ||

                task.subject
                    .toLowerCase()
                    .includes(search)

            );

    }


    if (status !== "all") {

        filtered =
            filtered.filter(
                task =>
                    task.status ===
                    status
            );

    }


    filtered.sort(
        (a, b) =>
            parseDate(a.deadline) -
            parseDate(b.deadline)
    );


    const container =
        document.getElementById(
            "allTasksList"
        );


    if (
        filtered.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                No tasks found.

            </div>

        `;

        return;

    }


    container.innerHTML =
        filtered
            .map(renderTaskCard)
            .join("");

}


/* =========================================================
   DEADLINES
========================================================= */

function renderDeadlines() {

    const activeTasks =
        tasks
            .filter(
                t =>
                    t.status !==
                    "completed"
            )
            .sort(
                (a, b) =>
                    parseDate(a.deadline) -
                    parseDate(b.deadline)
            )
            .slice(0, 5);


    const container =
        document.getElementById(
            "deadlineList"
        );


    if (
        activeTasks.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                No upcoming deadlines.

            </div>

        `;

        return;

    }


    container.innerHTML =
        activeTasks
            .map(task => {

                const date =
                    new Date(
                        `${task.deadline}T12:00:00`
                    );


                const day =
                    date.getDate();


                const month =
                    date
                        .toLocaleDateString(
                            "en-IN",
                            {
                                month: "short"
                            }
                        )
                        .toUpperCase();


                return `

                    <div class="deadline-item">

                        <div class="date-box">

                            <strong>
                                ${day}
                            </strong>

                            <small>
                                ${month}
                            </small>

                        </div>


                        <div class="deadline-info">

                            <strong>

                                ${escapeHTML(task.name)}

                            </strong>

                            <span>

                                ${escapeHTML(task.subject)}
                                &bull; ${task.priority} priority

                            </span>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   ADD TASK
========================================================= */

async function addTask(event) {

    event.preventDefault();

    const name = document.getElementById("taskName").value.trim();
    const subject = document.getElementById("taskSubject").value.trim();
    const type = document.getElementById("taskType").value;
    const deadline = document.getElementById("taskDeadline").value;
    const notes = document.getElementById("taskNotes").value.trim();
    const effort = Number(document.getElementById("taskEffort").value);
    const priorityInput = document.querySelector('input[name="priority"]:checked');
    const priority = priorityInput ? priorityInput.value : "medium";

    if (!name || !subject || !deadline) return;

    try {

        if (editingTaskId !== null) {

            const existingTask = tasks.find(t => t.id === editingTaskId);
            if (!existingTask) return;

            const response = await fetch(API_URL, {
                credentials: "same-origin",
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: editingTaskId,
                    name,
                    subject,
                    type,
                    deadline,
                    effort,
                    priority,
                    status: existingTask.status,
                    notes
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Failed to update task");
            }

            existingTask.name = name;
            existingTask.subject = subject;
            existingTask.type = type;
            existingTask.deadline = deadline;
            existingTask.effort = effort;
            existingTask.priority = priority;
            existingTask.notes = notes;

            closeModal();
            document.getElementById("taskForm").reset();
            editingTaskId = null;
            document.getElementById("modalTitle").textContent = "Add Academic Task";
            document.getElementById("modalSubmitBtn").textContent = "Add Task";
            renderAll();
            showNotification("Task updated successfully.");
            return;
        }

        const newTask = {
            name,
            subject,
            type,
            deadline,
            effort,
            priority,
            notes,
            status: "todo"
        };

        const response = await fetch(API_URL, {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTask)
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Failed to add task");
        }

        newTask.id = Number(data.id);
        tasks.push(newTask);

        document.getElementById("taskForm").reset();
        closeModal();
        renderAll();
        showNotification("Task added successfully.");

    } catch (error) {

        console.error("Task save error:", error);
        showNotification(error.message || "Could not save the task.");
    }

}

function editTask(id) {

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    editingTaskId = id;

    document.getElementById("modalTitle").textContent = "Edit Academic Task";
    document.getElementById("modalSubmitBtn").textContent = "Save Changes";

    document.getElementById("taskName").value = task.name;
    document.getElementById("taskSubject").value = task.subject;
    document.getElementById("taskType").value = task.type;
    document.getElementById("taskDeadline").value = task.deadline;
    document.getElementById("taskNotes").value = task.notes || "";
    document.getElementById("taskEffort").value = task.effort;

    const priorityRadio = document.querySelector(
        `input[name="priority"][value="${task.priority}"]`
    );

    if (priorityRadio) priorityRadio.checked = true;

    openModal();
}

/* =========================================================
   TASK ACTIONS
========================================================= */

async function toggleTask(id) {

    const task = tasks.find(t => Number(t.id) === Number(id));

    if (!task) return;

    const oldStatus = task.status;
    const newStatus = oldStatus === "completed" ? "todo" : "completed";

    task.status = newStatus;
    renderAll();

    try {
        await saveTaskStatus(id, newStatus);
    } catch (error) {
        console.error("Update task error:", error);
        task.status = oldStatus;
        renderAll();
        showNotification("Could not update the task.");
    }
}


async function deleteTask(id) {

    const task = tasks.find(t => Number(t.id) === Number(id));

    if (!task) return;

    try {

        const response = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Failed to delete task");
        }

        tasks = tasks.filter(t => Number(t.id) !== Number(id));
        renderAll();

        showNotification("Task removed.");

    } catch (error) {

        console.error("Delete task error:", error);
        showNotification("Could not delete the task.");
    }
}


/* =========================================================
   MODAL
========================================================= */

const modalOverlay =
    document.getElementById(
        "modalOverlay"
    );


function openModal() {

    modalOverlay
        .classList
        .add("show");


    document
        .getElementById(
            "taskName"
        )
        .focus();


    document
        .getElementById(
            "taskDeadline"
        )
        .min =
        getDateOffset(0);

}


function closeModal() {

    modalOverlay
        .classList
        .remove("show");

    editingTaskId = null;
    document.getElementById("modalTitle").textContent = "Add Academic Task";
    document.getElementById("modalSubmitBtn").textContent = "Add Task";

}


document
    .getElementById(
        "openModal"
    )
    .addEventListener(
        "click",
        () => {
            editingTaskId = null;
            document.getElementById("modalTitle").textContent = "Add Academic Task";
            document.getElementById("modalSubmitBtn").textContent = "Add Task";
            document.getElementById("taskForm").reset();
            openModal();
        }
    );


document
    .getElementById(
        "closeModal"
    )
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById(
        "cancelModal"
    )
    .addEventListener(
        "click",
        closeModal
    );


modalOverlay
    .addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modalOverlay
            ) {

                closeModal();

            }

        }
    );


