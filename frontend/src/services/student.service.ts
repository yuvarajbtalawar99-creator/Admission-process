import API from './api';

export interface StudentDashboard {
  student: {
    id: string;
    name: string;
    email: string;
    phone: string;
    enrollmentNumber: string;
    rollNumber: string;
    department: string;
    semester: number;
    profileImage: string;
  };
  attendance: {
    overallPercentage: string;
    status: 'GOOD' | 'WARNING';
    subjects: Array<{
      subjectId: string;
      subjectName: string;
      subjectCode: string;
      totalClasses: number;
      classesPresent: number;
      classesAbsent: number;
      percentage: string;
    }>;
  };
  academicInfo: {
    cgpa: number;
    sgpa: number;
    riskLevel: 'AT_RISK' | 'AVERAGE' | 'GOOD' | 'EXCELLENT';
    failedSubjects: number;
  };
  recentMarks: Array<{
    id: string;
    subjectName: string;
    subjectCode: string;
    examType: 'IA1' | 'IA2' | 'SEMESTER';
    marksObtained: number;
    maxMarks: number;
    percentage: string;
    grade: string;
  }>;
  fees: {
    totalDue: number;
    totalPaid: number;
    totalAmount: number;
    fees: Array<any>;
  };
  upcomingExams: Array<{
    id: string;
    subjectName: string;
    subjectCode: string;
    examDate: string;
    examTime: string;
    hallNumber: string;
    daysUntilExam: number;
  }>;
}

class StudentService {
  async getStudentDashboard(): Promise<StudentDashboard> {
    const response = await API.get('/students/dashboard');
    return response.data.data;
  }

  async getStudentProfile() {
    const response = await API.get('/students/profile');
    return response.data.data;
  }

  async getOverallAttendance() {
    const response = await API.get('/students/attendance');
    return response.data.data;
  }

  async getSubjectAttendance(subjectId: string) {
    const response = await API.get(`/students/attendance/${subjectId}`);
    return response.data.data;
  }

  async getOverallMarks(semester?: number) {
    const url = semester ? `/students/marks?semester=${semester}` : '/students/marks';
    const response = await API.get(url);
    return response.data.data;
  }

  async getMarksHistory(subjectId: string) {
    const response = await API.get(`/students/marks/${subjectId}`);
    return response.data.data;
  }

  async updateProfile(data: { phone: string; address: string }) {
    const response = await API.put('/students/profile', data);
    return response.data;
  }

  async downloadHallTicket(examId: string) {
    const response = await API.get(`/students/exam/hallticket/${examId}`);
    return response.data.data;
  }

  async getStudentFees() {
    const response = await API.get('/fees');
    return response.data.data;
  }

  async payFee(feeId: string, payload: { amount: number; paymentMethod: string; transactionReference: string; headers?: any }) {
    const response = await API.post(`/fees/${feeId}/pay`, payload, { headers: payload.headers });
    return response.data;
  }

  async getStudentGrievances(page: number = 1, limit: number = 5) {
    const response = await API.get(`/grievances?page=${page}&limit=${limit}`);
    return response.data.data;
  }

  async lodgeGrievance(payload: { category: string; subject: string; description: string }) {
    const response = await API.post('/grievances/lodge', payload);
    return response.data;
  }
}

export default new StudentService();