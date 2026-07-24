import { DataTypes, Model } from 'sequelize';
import db from '../config/database';

class AuditLog extends Model {
  public id!: string;
  public userId!: string | null;
  public action!:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'LOGOUT'
    | 'PASSWORD_CHANGE'
    | 'ROLE_CHANGE'
    | 'ADMISSION_VIEW'
    | 'ADMISSION_STATUS_CHANGE'
    | 'DOCUMENT_DOWNLOAD'
    | 'GENERATE_CREDENTIALS'
    | 'PASSWORD_RESET'
    | 'ADMISSION_STEP_EDIT'
    | 'DOCUMENT_UPLOAD'
    | 'ADMISSION_SUBMIT'
    | 'ADMISSION_ENROLL'
    | 'STUDENT_SUBMITTED_APPLICATION'
    | 'PARENT_RAISED_TICKET'
    | 'ADMIN_VERIFIED_DOCUMENTS'
    | 'ADMIN_APPROVED_ADMISSION'
    | 'SUPER_ADMIN_PUBLISHED_NOTICE'
    | 'HOD_APPOINTED'
    | 'NOTIFICATION_PUBLISHED'
    | 'TICKET_RESOLVED'
    | 'PRINCIPAL_APPROVED_ADMISSION'
    | 'PRINCIPAL_REJECTED_ADMISSION'
    | 'PRINCIPAL_APPROVED_BUDGET'
    | 'PRINCIPAL_REJECTED_BUDGET'
    | 'PRINCIPAL_APPROVED_LEAVE'
    | 'PRINCIPAL_REJECTED_LEAVE'
    | 'PRINCIPAL_APPROVED_CURRICULUM_CHANGE'
    | 'PRINCIPAL_REJECTED_CURRICULUM_CHANGE'
    | 'PRINCIPAL_APPROVED_EVALUATION'
    | 'PRINCIPAL_REJECTED_EVALUATION'
    | 'PRINCIPAL_DECIDED_FEE_WAIVER';
  public ipAddress!: string | null;
  public userAgent!: string | null;
  public details!: any | null;
  public readonly createdAt!: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    action: {
      type: DataTypes.ENUM(
        'LOGIN_SUCCESS',
        'LOGIN_FAILED',
        'LOGOUT',
        'PASSWORD_CHANGE',
        'ROLE_CHANGE',
        'ADMISSION_VIEW',
        'ADMISSION_STATUS_CHANGE',
        'DOCUMENT_DOWNLOAD',
        'GENERATE_CREDENTIALS',
        'PASSWORD_RESET',
        'ADMISSION_STEP_EDIT',
        'DOCUMENT_UPLOAD',
        'ADMISSION_SUBMIT',
        'ADMISSION_ENROLL',
        'STUDENT_SUBMITTED_APPLICATION',
        'PARENT_RAISED_TICKET',
        'ADMIN_VERIFIED_DOCUMENTS',
        'ADMIN_APPROVED_ADMISSION',
        'SUPER_ADMIN_PUBLISHED_NOTICE',
        'HOD_APPOINTED',
        'NOTIFICATION_PUBLISHED',
        'TICKET_RESOLVED',
        'PRINCIPAL_APPROVED_ADMISSION',
        'PRINCIPAL_REJECTED_ADMISSION',
        'PRINCIPAL_APPROVED_BUDGET',
        'PRINCIPAL_REJECTED_BUDGET',
        'PRINCIPAL_APPROVED_LEAVE',
        'PRINCIPAL_REJECTED_LEAVE',
        'PRINCIPAL_APPROVED_CURRICULUM_CHANGE',
        'PRINCIPAL_REJECTED_CURRICULUM_CHANGE',
        'PRINCIPAL_APPROVED_EVALUATION',
        'PRINCIPAL_REJECTED_EVALUATION',
        'PRINCIPAL_DECIDED_FEE_WAIVER'
      ),
      allowNull: false,
    },
    ipAddress: {
      type: DataTypes.STRING(45), // IPv6 length max is 45 chars
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: 'audit_logs',
    timestamps: true,
    updatedAt: false, // Audit logs don't get updated, only created
  }
);

export default AuditLog;
