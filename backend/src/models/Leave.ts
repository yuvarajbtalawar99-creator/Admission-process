import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import User from './User';
import Department from './Department';

class Leave extends Model {
  public id!: string;
  public userId!: string;
  public departmentId!: string;
  public role!: 'TEACHER' | 'STUDENT' | 'HOD';
  public type!: 'SICK' | 'CASUAL' | 'SABBATICAL' | 'MATERNITY' | 'OTHER';
  public startDate!: Date;
  public endDate!: Date;
  public reason!: string;
  public status!: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DEFERRED';
  public workflowStage!: 'HOD_REVIEW' | 'PRINCIPAL_REVIEW' | 'ADMIN_REVIEW' | 'FINALIZED';
  public reviewedById!: string | null;
  public remarks!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Leave.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
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
    role: {
      type: DataTypes.ENUM('TEACHER', 'STUDENT', 'HOD'),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('SICK', 'CASUAL', 'SABBATICAL', 'MATERNITY', 'OTHER'),
      allowNull: false,
      defaultValue: 'CASUAL',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    reviewedById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: 'leaves',
    timestamps: true,
  }
);

Leave.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Leave.belongsTo(Department, { as: 'department', foreignKey: 'departmentId' });
Leave.belongsTo(User, { as: 'reviewer', foreignKey: 'reviewedById' });

export default Leave;
