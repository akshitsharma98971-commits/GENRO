/**
 * Centralized API service for Genro Backend
 * Base: https://genro-backend.onrender.com
 */

const BASE_URL = 'https://genro-backend.onrender.com';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Syllabus API ──────────────────────────────────────────────────────────────

/**
 * Fetch chapters for a given class and subject.
 * GET /api/syllabus/:class_level/:subject_name
 * Returns array of chapter objects from the backend.
 */
export async function fetchSyllabus(classLevel, subjectName) {
  const encodedClass = encodeURIComponent(classLevel);
  const encodedSubject = encodeURIComponent(subjectName);
  return get(`/api/syllabus/${encodedClass}/${encodedSubject}`);
}

// ── User Dashboard API ────────────────────────────────────────────────────────

/**
 * Fetch dashboard data (XP, streak, progress) for a user.
 * GET /api/user/:user_id/dashboard
 */
export async function fetchUserDashboard(userId) {
  return get(`/api/user/${userId}/dashboard`);
}

// ── Test API ──────────────────────────────────────────────────────────────────

/**
 * Fetch test questions for a specific topic.
 * GET /api/test/:topic_id
 * Returns the questions array for that topic.
 */
export async function fetchTopicTest(topicId) {
  return get(`/api/test/${encodeURIComponent(topicId)}`);
}

// ── Progress API ──────────────────────────────────────────────────────────────

/**
 * Save test result progress for a user.
 * POST /api/user/:user_id/progress
 * Body: { chapter_id, subject, accuracy_percentage, status, xp_earned }
 */
export async function saveProgress(userId, progressData) {
  return post(`/api/user/${userId}/progress`, progressData);
}

// ── Chat API ──────────────────────────────────────────────────────────────────

/**
 * Fetch chat history for a user.
 * GET /api/chat/:user_id
 */
export async function fetchChatHistory(userId) {
  return get(`/api/chat/${userId}`);
}

/**
 * Save a chat message to the backend.
 * POST /api/chat/:user_id
 * Body: { message_text, sender_type }
 * sender_type: "user" | "Genro_AI"
 */
export async function saveChatMessage(userId, messageText, senderType) {
  return post(`/api/chat/${userId}`, {
    message_text: messageText,
    sender_type: senderType,
  });
}
