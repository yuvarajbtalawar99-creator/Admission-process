import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import User from './User';
import Department from './Department';

export type AdmissionStatus =
  | 'DRAFT'         // just registered, form in progress (replaces REGISTERED)
  | 'SUBMITTED'     // student submitted all 7 steps
  | 'UNDER_REVIEW'  // admin is reviewing
  | 'APPROVED'      // admin approved
  | 'REJECTED'      // admin rejected
  | 'ENROLLED'      // fully enrolled in ERP (locked)
  | 'CANCELLATION_REQUESTED' // student requested cancellation
  | 'CANCELLED';    // admission cancelled

export type AdmissionType = 'KCET' | 'DCET' | 'MANAGEMENT';

class Admission extends Model {
  public id!: string;
  public userId!: string;
  public applicationNumber!: string;
  public admissionType!: AdmissionType | null;
  public branchId!: string | null;
  public qualification!: 'PUC' | 'DIPLOMA' | null;
  public aadhaar!: string | null;
  public cetNumber!: string | null;
  public dcetNumber!: string | null;
  public applicationStatus!: AdmissionStatus;
  public adminRemarks!: string | null;
  public rejectionReason!: string | null;
  public rejectionReasonCode!: string | null;
  
  // Validation Checklist
  public documentsVerified!: boolean;
  public feesVerified!: boolean;
  public eligibilityVerified!: boolean;
  public verificationRemarks!: string | null;
  public verifiedByAdminId!: string | null;
  public verifiedAt!: Date | null;
  
  // Approval Accountability
  public approvedByAdminId!: string | null;
  public approvalRemarks!: string | null;

  // Cancellation Accountability
  public cancellationReason!: string | null;
  public cancellationRemarks!: string | null;
  public cancellationRequestedAt!: Date | null;
  public cancellationRequestedById!: string | null;
  public cancellationApprovedAt!: Date | null;
  public cancellationApprovedById!: string | null;
  public cancellationRejectedAt!: Date | null;
  public cancellationRejectedById!: string | null;
  public cancellationAdminRemarks!: string | null;

  public reviewedBy!: string | null;  // legacy admin userId
  public reviewedAt!: Date | null;
  public submittedAt!: Date | null;
  public resubmittedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public get status(): string {
    if (this.applicationStatus === 'DRAFT' || this.applicationStatus === 'REJECTED') {
      return 'DRAFT';
    }
    return this.applicationStatus;
  }

  // Associations (eager loaded)
  public user?: any;
  public branch?: any;
  public studentpersonaldetails?: any;
  public studentparentdetails?: any;
  public studentaddress?: any;
  public studentacademicdetails?: any;
  public studentdocuments?: any;
}

Admission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: User, key: 'id' },
      onDelete: 'CASCADE',
    },
    applicationNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    admissionType: {
      type: DataTypes.ENUM('KCET', 'DCET', 'MANAGEMENT'),
      allowNull: true,
    },
    branchId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: Department, key: 'id' },
    },
    qualification: {
      type: DataTypes.ENUM('PUC', 'DIPLOMA'),
      allowNull: true,
    },
    aadhaar: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    cetNumber: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    dcetNumber: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    applicationStatus: {
      type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ENROLLED', 'CANCELLATION_REQUESTED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    adminRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rejectionReasonCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    documentsVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    feesVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    eligibilityVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verificationRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    verifiedByAdminId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approvedByAdminId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    approvalRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reviewedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resubmittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancellationReason: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    cancellationRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancellationRequestedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancellationRequestedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    cancellationApprovedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancellationApprovedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    cancellationRejectedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancellationRejectedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    cancellationAdminRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: 'admissions',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['applicationStatus'] },
      { fields: ['applicationNumber'] },
      { fields: ['branchId'] },
    ],
  }
);

Admission.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Admission.belongsTo(Department, { as: 'branch', foreignKey: 'branchId' });

export default Admission;
