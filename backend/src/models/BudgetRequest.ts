import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import Department from './Department';

class BudgetRequest extends Model {
  public id!: string;
  public title!: string;
  public amount!: number;
  public department!: string;
  public departmentId!: string | null;
  public priority!: 'LOW' | 'MEDIUM' | 'HIGH';
  public status!: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DEFERRED';
  public workflowStage!: 'HOD_REVIEW' | 'PRINCIPAL_REVIEW' | 'ADMIN_REVIEW' | 'FINALIZED';
  public justification!: string;
  public hodRecommendation!: 'APPROVED' | 'REJECTED';
  public financeReview!: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  public deadline!: Date;
  public remarks!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BudgetRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Department,
        key: 'id',
      },
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
      allowNull: false,
      defaultValue: 'MEDIUM',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'DEFERRED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    workflowStage: {
      type: DataTypes.ENUM('HOD_REVIEW', 'PRINCIPAL_REVIEW', 'ADMIN_REVIEW', 'FINALIZED'),
      allowNull: false,
      defaultValue: 'HOD_REVIEW',
    },
    justification: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hodRecommendation: {
      type: DataTypes.ENUM('APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'APPROVED',
    },
    financeReview: {
      type: DataTypes.ENUM('UNDER_REVIEW', 'APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'UNDER_REVIEW',
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: 'budget_requests',
    timestamps: true,
  }
);

BudgetRequest.belongsTo(Department, { as: 'dept', foreignKey: 'departmentId' });

export default BudgetRequest;
