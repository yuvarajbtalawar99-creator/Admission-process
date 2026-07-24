import API from './api';

export interface HODDashboardData {
  department: {
    id: string;
    name: string;
    code: string;
    activeSemester: number;
  };
  kpis: {
    students: number;
    faculty: number;
    passRate: number;
    avgCgpa: number;
    placementRate: number;
    budgetUtilized: number;
    budgetAllocated: number;
  };
  ranking: {
    passRatePlace: string;
    cgpaPlace: string;
    placementPlace: string;
    overallPlace: string;
    trend: string;
  };
  pendingActionsCount: number;
  performanceTrends: {
    month: string;
    passRate: number;
    cgpa: number;
    placementRate: number;
    studentCount: number;
  }[];
  insights: string[];
  goals: {
    id: string;
    title: string;
    target: number;
    current: number;
    status: 'EXCEEDED' | 'IN_PROGRESS' | 'BEHIND';
  }[];
  upcomingEvents: {
    date: string;
    title: string;
  }[];
}

export interface HODPendingActions {
  leaves: any[];
  budgetRequests: any[];
  grievances: any[];
}

export interface HODFacultyData {
  faculty: any[];
  stats: {
    total: number;
    permanent: number;
    contract: number;
    onLeave: number;
    vacancies: number;
  };
  fpip: any[];
}

export interface HODStudentData {
  students: any[];
  stats: {
    total: number;
    onTrack: number;
    atRisk: number;
    excellence: number;
  };
  atRisk: any[];
}

export interface HODSubjectData {
  courses: any[];
  proposedChanges: any[];
}

export interface HODBudgetData {
  allocated: number;
  spent: number;
  requests_pending: number;
  requests: any[];
}

export interface HODGrievanceData {
  grievances: any[];
  pending_count: number;
}

const hodService = {
  getDashboardData: async (): Promise<HODDashboardData> => {
    const res = await API.get('/hod/dashboard');
    return res.data.data;
  },

  getPendingActions: async (): Promise<HODPendingActions> => {
    const res = await API.get('/hod/pending-actions');
    return res.data.data;
  },

  getFaculty: async (): Promise<HODFacultyData> => {
    const res = await API.get('/hod/faculty');
    return res.data.data;
  },

  approveLeave: async (id: string, status: 'APPROVED' | 'REJECTED' | 'DEFERRED', remarks?: string): Promise<any> => {
    const res = await API.put(`/hod/leaves/${id}/approve`, { status, remarks });
    return res.data;
  },

  submitEvaluation: async (id: string, rating: number, comments: string): Promise<any> => {
    const res = await API.post(`/hod/faculty/${id}/evaluation`, { rating, comments });
    return res.data;
  },

  getStudents: async (): Promise<HODStudentData> => {
    const res = await API.get('/hod/students');
    return res.data.data;
  },

  getSubjects: async (): Promise<HODSubjectData> => {
    const res = await API.get('/hod/courses');
    return res.data.data;
  },

  approveCurriculumChange: async (id: string, status: 'APPROVED' | 'REJECTED' | 'DEFERRED', remarks?: string): Promise<any> => {
    const res = await API.put(`/hod/courses/${id}/approve-change`, { status, remarks });
    return res.data;
  },

  getBudget: async (): Promise<HODBudgetData> => {
    const res = await API.get('/hod/budget');
    return res.data.data;
  },

  submitBudgetRequest: async (payload: { title: string; amount: number; priority: string; justification: string; deadline?: string }): Promise<any> => {
    const res = await API.post('/hod/budget/request', payload);
    return res.data;
  },

  getGrievances: async (): Promise<HODGrievanceData> => {
    const res = await API.get('/hod/grievances');
    return res.data.data;
  },

  resolveGrievance: async (id: string, resolution: string, status?: 'RESOLVED' | 'REJECTED'): Promise<any> => {
    const res = await API.put(`/hod/grievances/${id}/resolve`, { resolution, status });
    return res.data;
  }
};

export default hodService;
