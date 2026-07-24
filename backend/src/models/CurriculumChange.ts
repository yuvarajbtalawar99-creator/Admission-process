import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import User from './User';
import Department from './Department';

class CurriculumChange extends Model {
  public id!: string;
  public courseCode!: string;
  public courseName!: string;
  public proposedBy!: string;
  public departmentId!: string;
  public credits!: number;
  public type!: 'NEW' | 'MODIFY' | 'DELETE';
  public status!: 'PENDING' | 'APPROVED' | 'REJECTED';
  public workflowStage!: 'HOD_REVIEW' | 'PRINCIPAL_REVIEW' | 'FINALIZED';
  public outcomes!: string;
  public remarks!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CurriculumChange.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    courseCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    courseName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    proposedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Department,
        key: 'id',
      },
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
    },
    type: {
      type: DataTypes.ENUM('NEW', 'MODIFY', 'DELETE'),
      allowNull: false,
      defaultValue: 'NEW',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    workflowStage: {
      type: DataTypes.ENUM('HOD_REVIEW', 'PRINCIPAL_REVIEW', 'FINALIZED'),
      allowNull: false,
      defaultValue: 'HOD_REVIEW',
    },
    outcomes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: 'curriculum_changes',
    timestamps: true,
  }
);

CurriculumChange.belongsTo(User, { as: 'proposer', foreignKey: 'proposedBy' });
CurriculumChange.belongsTo(Department, { as: 'department', foreignKey: 'departmentId' });

export default CurriculumChange;
