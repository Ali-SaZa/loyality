import toast from 'react-hot-toast'

export const API_ROUTES = {
  AUTH: {
    SEND_OTP: 'register',
    CHECK_OTP: (mobile: string) => `users/${mobile}/approve`,
    SEND_LOGIN_OTP: 'users/send-otp-to-mobile',
    CHECK_LOGIN_OTP: 'users/login-by-otp',
    LOGIN: 'login',
    LOGOUT: 'logout',
    CHANGE_PASSWORD: 'user/password',
    SEND_VERIFY_CODE: (mobile: string) => `users/${mobile}/send-verify-code`,
  },
  USER: {
    GET_USER: 'obs_user/profile',
    UPDATE_PROFILE: 'obs_user/profile',
    UPDATE_AVATAR: 'user/image',
    JOB_SIMULATION_EVALUATION: 'obs_user/profile/job-simulation-evaluation',
  },
  SIMULATIONS: {
    GET_ALL: 'job-simulations/visitor',
    GET_BY_ID: (simulationId: string) => `job-simulations/visitor/${simulationId}`,
    GET_ALL_REVIEW_QUESTIONS: 'job-simulation/review-questions/learner-all',
    GET_SIMULATION_QUIZ: (simulationId: string) => `job-simulation/${simulationId}/quiz`,
  },
  JOB_CATEGORIES: {
    GET_ALL_ROOT: (parentId?: string) => `job-categories/all/visitor${parentId ? `?parentId=${parentId}` : ''}`,
  },
  ORGANIZATIONS: {
    GET_ALL: 'organizations/visitor',
    GET_BY_ID: (organizationId: string) => `organization/${organizationId}/visitor`,
  },
  TASKS: {
    GET_ALL_TASKS_BY_SIMULATION_ID_FOR_VISITORS: (simulationId: string) =>
      `job-simulation-tasks/visitor-job-simulation-all-tasks/${simulationId}`,
    GET_ALL_TASKS_BY_SIMULATION_ID_FOR_LEARNERS: (simulationId: string) =>
      `job-simulation-tasks/learner-job-simulation-all-tasks/${simulationId}`,
  },
  SIMULATION_USER: {
    INSERT_TASK: (jobSimulationUserId: string) => `job-simulation-user/${jobSimulationUserId}/task`,
    REGISTER: 'job-simulation-user/register',
    GET_USER_SIMULATIONS: 'job-simulation-users/learner',
    GET_USER_SIMULATION_BY_ID: (jobSimulationUserId: string) => `job-simulation-user/${jobSimulationUserId}`,
    SAVE_USER_COMMENT: (jobSimulationUserId: string) => `job-simulation-user/${jobSimulationUserId}/comment`,
    CHAT_WITH_EVALUATOR: (jobSimulationUserId: string) => `job-simulation-user/${jobSimulationUserId}/chat`,
    SAVE_USER_REVIEW_FOR_SIMULATION: 'job-simulation-user/review',
    GET_SIMULATION_COMMENTS: (jobSimulationId: string) => `job-simulation-user/${jobSimulationId}/comments/visitor`,
    COMPLETE_QUIZ: (jobSimulationUserId: string) => `job-simulation-user/${jobSimulationUserId}/complete-quiz`,
    GET_EVALUATION_COST: (jobSimulationUserId: string) => `job-simulation-user/${jobSimulationUserId}/evaluation-cost`,
    START_EVALUATION_BANK_PAYMENT: (jobSimulationUserId: string) =>
      `job-simulation-user/${jobSimulationUserId}/start-evaluation-bank-payment`,
  },
  GEO: {
    PROVINCES: 'geo/states/country-code/IR',
    GET_PROVINCE_CITIES: 'geo/cities',
    COUNTRIES: 'geo/countries',
    GET_COUNTRY_BY_ID: (countryId: string) => `geo/country/${countryId}`,
  },
  MAJOR: {
    GET_ALL_MAJORS: 'majors',
  },
  DASHBOARD: {
    GET_INDEX_PAGE_DATA: 'dashboard/index-page-data',
  },
  SKILLS: {
    GET_ALL_SKILLS: 'skills/all',
  },
  JOB_SIMULATION_REQUEST: {
    CREATE: 'job-simulation-request',
  },
}

export const HANDLE_ERROR = (error: any) => {
  const message = error.response?.data?.message || 'خطایی در انجام درخواست پیش آمد.'

  toast.error(message)
}
