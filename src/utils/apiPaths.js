export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    LOGOUT: "/api/auth/logout",
  },

  USERS: {
    GET_ALL_USERS: "/api/users",
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`,
    CREATE_USER: "/api/users",
    UPDATE_USER_BY_ID: (userId) => `/api/users/${userId}`,
    DELETE_USER_BY_ID: (userId) => `/api/users/${userId}`,
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",
    GET_ALL_TASKS: "/api/tasks",
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,
    GET_TASK_BY_TYPE: (taskType) => `/api/tasks/${taskType}`,
    CREATE_TASK: "/api/tasks",
    UPDATE_TASK_BY_ID: (taskId, taskType) => `/api/tasks/${taskType}/${taskId}`,
    DELETE_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,

    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`,
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`,

    CREATE_TASK_BY_TYPE: (taskType) => `/api/tasks/${taskType}`,
    DELETE_QUESTION_BY_ID_TYPE: (taskId, questionType, questionId) => `/api/tasks/${taskId}/questions/${questionId}?type=${questionType}`,
    POST_SUBMISSION_BY_TASK_ID: (taskId) => `/api/task-submissions/${taskId}`,
  },

  REPORTS: {
    EXPORT_TASK: "/api/reports/export/tasks",
    EXPORT_USERS: "/api/reports/export/users",
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};
