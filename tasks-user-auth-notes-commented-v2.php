<?php

session_start();
header("Content-Type: application/json");

require_once "db.php";

// Authentication boundary: task data is available only to a signed-in user.
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Please log in"
    ]);
    exit;
}

$userId = (int) $_SESSION["user_id"];
$method = $_SERVER["REQUEST_METHOD"];

function sendError($code, $message) {
    http_response_code($code);
    echo json_encode([
        "success" => false,
        "message" => $message
    ]);
    exit;
}

// Reject unsupported methods before trying to decode a request body.
// This ensures methods such as PATCH consistently return HTTP 405.
if (!in_array($method, ["GET", "POST", "PUT", "DELETE"], true)) {
    sendError(405, "Method not allowed");
}

// GET: return only the tasks owned by this session's user ID.
if ($method === "GET") {
    $stmt = $conn->prepare(
        "SELECT id, name, subject, type, deadline, effort, priority, status, notes, created_at
         FROM tasks
         WHERE user_id = ?
         ORDER BY deadline ASC, id DESC"
    );

    $stmt->bind_param("i", $userId);
    $stmt->execute();

    $result = $stmt->get_result();
    $tasks = [];

    while ($row = $result->fetch_assoc()) {
        $row["id"] = (int) $row["id"];
        $row["effort"] = (int) $row["effort"];
        $tasks[] = $row;
    }

    echo json_encode([
        "success" => true,
        "tasks" => $tasks
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    sendError(400, "Invalid request data");
}

// POST: validate user input before inserting a new task for the current user.
if ($method === "POST") {
    $name = trim($data["name"] ?? "");
    $subject = trim($data["subject"] ?? "");
    $type = trim($data["type"] ?? "");
    $deadline = trim($data["deadline"] ?? "");
    $effort = (int) ($data["effort"] ?? 0);
    $priority = strtolower(trim($data["priority"] ?? "medium"));
    $status = strtolower(trim($data["status"] ?? "todo"));
    $notes = trim($data["notes"] ?? "");

    if ($name === "" || $subject === "" || $type === "" || $deadline === "") {
        sendError(400, "Required task fields are missing");
    }

    if ($effort < 1) {
        $effort = 1;
    }

    if (!in_array($priority, ["high", "medium", "low"], true)) {
        sendError(400, "Invalid priority");
    }

    if (!in_array($status, ["todo", "progress", "completed"], true)) {
        sendError(400, "Invalid status");
    }

    $stmt = $conn->prepare(
        "INSERT INTO tasks (user_id, name, subject, type, deadline, effort, priority, status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "issssisss",
        $userId,
        $name,
        $subject,
        $type,
        $deadline,
        $effort,
        $priority,
        $status,
        $notes
    );

    if (!$stmt->execute()) {
        sendError(500, "Failed to create task");
    }

    echo json_encode([
        "success" => true,
        "message" => "Task created successfully",
        "id" => $stmt->insert_id
    ]);
    exit;
}

// PUT: accept either a status-only update or a complete task edit.
if ($method === "PUT") {
    $id = (int) ($data["id"] ?? 0);

    if ($id <= 0) {
        sendError(400, "Invalid task ID");
    }

    // Supports the existing status-only update used by the dashboard.
    $isStatusOnly = array_key_exists("status", $data)
        && !array_key_exists("name", $data)
        && !array_key_exists("subject", $data)
        && !array_key_exists("type", $data)
        && !array_key_exists("deadline", $data)
        && !array_key_exists("effort", $data)
        && !array_key_exists("priority", $data);

    if ($isStatusOnly) {
        $status = strtolower(trim($data["status"] ?? ""));

        if (!in_array($status, ["todo", "progress", "completed"], true)) {
            sendError(400, "Invalid status");
        }

        $stmt = $conn->prepare(
            "UPDATE tasks
             SET status = ?
             WHERE id = ? AND user_id = ?"
        );

        $stmt->bind_param("sii", $status, $id, $userId);

        if (!$stmt->execute()) {
            sendError(500, "Failed to update task status");
        }

        echo json_encode([
            "success" => true,
            "message" => "Task status updated"
        ]);
        exit;
    }

    // Full edit update.
    $name = trim($data["name"] ?? "");
    $subject = trim($data["subject"] ?? "");
    $type = trim($data["type"] ?? "");
    $deadline = trim($data["deadline"] ?? "");
    $effort = (int) ($data["effort"] ?? 0);
    $priority = strtolower(trim($data["priority"] ?? "medium"));
    $status = strtolower(trim($data["status"] ?? "todo"));
    $notes = trim($data["notes"] ?? "");

    if ($name === "" || $subject === "" || $type === "" || $deadline === "") {
        sendError(400, "Invalid task data");
    }

    if ($effort < 1) {
        sendError(400, "Effort must be at least 1");
    }

    if (!in_array($priority, ["high", "medium", "low"], true)) {
        sendError(400, "Invalid priority");
    }

    if (!in_array($status, ["todo", "progress", "completed"], true)) {
        sendError(400, "Invalid status");
    }

    $stmt = $conn->prepare(
        "UPDATE tasks
         SET name = ?, subject = ?, type = ?, deadline = ?, effort = ?, priority = ?, status = ?, notes = ?
         WHERE id = ? AND user_id = ?"
    );

    $stmt->bind_param(
        "ssssisssii",
        $name,
        $subject,
        $type,
        $deadline,
        $effort,
        $priority,
        $status,
        $notes,
        $id,
        $userId
    );

    if (!$stmt->execute()) {
        sendError(500, "Failed to update task");
    }

    echo json_encode([
        "success" => true,
        "message" => "Task updated successfully"
    ]);
    exit;
}

// DELETE: the ID and session user ID are both required in the SQL predicate.
if ($method === "DELETE") {
    $id = (int) ($data["id"] ?? 0);

    if ($id <= 0) {
        sendError(400, "Invalid task ID");
    }

    $stmt = $conn->prepare(
        "DELETE FROM tasks
         WHERE id = ? AND user_id = ?"
    );

    $stmt->bind_param("ii", $id, $userId);

    if (!$stmt->execute()) {
        sendError(500, "Failed to delete task");
    }

    echo json_encode([
        "success" => true,
        "message" => "Task deleted successfully"
    ]);
    exit;
}

// All supported methods are handled above. This is a defensive fallback.
sendError(405, "Method not allowed");

?>
