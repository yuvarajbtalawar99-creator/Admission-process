import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import User from './User';
import Department from './Department';

class Grievance extends Model {
  public id!: string;
  public studentId!: string;
  public departmentId!: string;
  public title!: string;
  public description!: string;
  public category!: 'ACADEMICS' | 'INFRASTRUCTURE' | 'HOSTEL' | 'FINANCE' | 'OTHER';
  public priority!: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  public status!: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  public workflowStage!: 'HOD_REVIEW' | 'PRINCIPAL_REVIEW' | 'FINALIZED';
  public resolution!: string | null;
  public resolvedById!: string | null;
  public resolvedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Grievance.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Department,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('ACADEMICS', 'INFRASTRUCTURE', 'HOSTEL', 'FINANCE', 'OTHER'),
      allowNull: false,
      defaultValue: 'OTHER',
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
      allowNull: false,
      defaultValue: 'MEDIUM',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    workflowStage: {
      type: DataTypes.ENUM('HOD_REVIEW', 'PRINCIPAL_REVIEW', 'FINALIZED'),
      allowNull: false,
      defaultValue: 'HOD_REVIEW',
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resolvedById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: 'grievances',
    timestamps: true,
  }
);

Grievance.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
Grievance.belongsTo(Department, { as: 'department', foreignKey: 'departmentId' });
Grievance.belongsTo(User, { as: 'resolver', foreignKey: 'resolvedById' });

export default Grievance;
