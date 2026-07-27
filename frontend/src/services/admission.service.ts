import API from './api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AdmissionStatus =
  | 'REGISTERED'
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ENROLLED';

export interface AdmissionApplication {
  id: string;
  applicationNumber: string;
  admissionType: string | null;
  aadhaar?: string;
  cetNumber?: string;
  dcetNumber?: string;
  applicationStatus: AdmissionStatus;
  documentsVerified?: boolean;
  feesVerified?: boolean;
  eligibilityVerified?: boolean;
  verificationRemarks?: string;
  adminRemarks?: string;
  rejectionReason?: string;
  rejectionReasonCode?: string;
  reviewedBy?: string;
  submittedAt: string | null;
  resubmittedAt?: string | null;
  reviewedAt: string | null;
  approvedByAdminId?: string | null;
  approvalRemarks?: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    profileImage: string | null;
    student?: {
      enrollmentNumber: string;
    } | null;
  } | null;
  branch: {
    id: string;
    name: string;
    code: string;
  } | null;
  studentpersonaldetails: {
    firstName: string;
    lastName: string;
    middleName: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    category: string | null;
    religion: string | null;
    phone: string | null;
    email: string | null;
    nationality: string | null;
  } | null;
  studentparentdetails: {
    fatherName: string | null;
    fatherOccupation: string | null;
    fatherPhone: string | null;
    fatherEmail: string | null;
    fatherAnnualIncome: number | null;
    motherName: string | null;
    motherOccupation: string | null;
    motherPhone: string | null;
    guardianName: string | null;
    guardianPhone: string | null;
  } | null;
  studentaddress: {
    currentAddressLine1: string | null;
    currentAddressLine2: string | null;
    currentCity: string | null;
    currentState: string | null;
    currentPincode: string | null;
    sameAsCurrent: boolean;
    permanentAddressLine1: string | null;
    permanentCity: string | null;
    permanentState: string | null;
    permanentPincode: string | null;
  } | null;
  studentacademicdetails: {
    tenthSchool: string | null;
    tenthBoard: string | null;
    tenthPassingYear: number | null;
    tenthPercentage: number | null;
    twelfthSchool: string | null;
    twelfthBoard: string | null;
    twelfthPassingYear: number | null;
    twelfthPercentage: number | null;
    twelfthStream: string | null;
    cetScore: number | null;
    cetRank: number | null;
    cetYear: number | null;
    hasGap: boolean;
    gapReason: string | null;
  } | null;
  studentdocuments: {
    photoUrl: string | null;
    signatureUrl: string | null;
    tenthMarksheetUrl: string | null;
    twelfthMarksheetUrl: string | null;
    cetScoreCardUrl: string | null;
    aadhaarUrl: string | null;
    casteCertificateUrl: string | null;
    domicileCertificateUrl: string | null;
    gapCertificateUrl: string | null;
  } | null;
}

export interface AdmissionListResult {
  total: number;
  page: number;
  totalPages: number;
  applications: AdmissionApplication[];
}

export interface AdmissionStats {
  total: number;
  registered: number;
  draft?: number;
  submitted: number;
  resubmitted?: number;
  underReview: number;
  approved: number;
  rejected: number;
  enrolled: number;
  recent: AdmissionApplication[];
}

// ─── Admin Admission Service ──────────────────────────────────────────────────

const admissionService = {
  /** GET /api/admin/admissions — paginated list with optional filters */
  async listApplications(params: {
    status?: string;
    branchId?: string;
    admissionType?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }): Promise<AdmissionListResult> {
    const query = new URLSearchParams();
    if (params.page)     query.set('page',     String(params.page));
    if (params.limit)    query.set('limit',    String(params.limit));
    if (params.status)   query.set('status',   params.status);
    if (params.search)   query.set('search',   params.search);
    if (params.branchId) query.set('branchId', params.branchId);
    if (params.admissionType) query.set('admissionType', params.admissionType);
    if (params.sortBy)    query.set('sortBy',    params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const res = await API.get(`/admin/admissions?${query.toString()}`);
    return res.data.data as AdmissionListResult;
  },

  /** GET /api/admin/admissions/:id — full application detail */
  async getApplication(id: string): Promise<AdmissionApplication> {
    const res = await API.get(`/admin/admissions/${id}`);
    return res.data.data as AdmissionApplication;
  },

  updateStatus: async (
    id: string,
    status: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ENROLLED',
    remarks?: string,
    rejectionReason?: string,
    rejectionReasonCode?: string
  ): Promise<void> => {
    await API.put(`/admin/admissions/${id}/status`, { status, remarks, rejectionReason, rejectionReasonCode });
    window.dispatchEvent(new CustomEvent('admissions-updated'));
  },

  /** PUT /api/admin/admissions/:id/verify */
  verifyChecklist: async (id: string, payload: { documentsVerified?: boolean, feesVerified?: boolean, eligibilityVerified?: boolean, verificationRemarks?: string }): Promise<void> => {
    await API.put(`/admin/admissions/${id}/verify`, payload);
    window.dispatchEvent(new CustomEvent('admissions-updated'));
  },

  /** GET /api/admin/stats — dashboard stats + recent applications */
  async getStats(): Promise<AdmissionStats> {
    const res = await API.get('/admin/stats');
    return res.data.data as AdmissionStats;
  },

  /** GET /api/branches */
  async getBranches(): Promise<{ id: string; name: string; code: string }[]> {
    const res = await API.get('/branches');
    return res.data.data;
  },
};

export default admissionService;
