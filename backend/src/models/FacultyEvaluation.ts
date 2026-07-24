import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import Teacher from './Teacher';
import Department from './Department';
import User from './User';

class FacultyEvaluation extends Model {
  public id!: string;
  public teacherId!: string;
  public departmentId!: string;
  public evaluatorId!: string;
  public rating!: number;
  public comments!: string;
  public academicYear!: string;
  public status!: 'PENDING' | 'APPROVED' | 'REJECTED';
  public workflowStage!: 'HOD_REVIEW' | 'PRINCIPAL_REVIEW' | 'FINALIZED';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FacultyEvaluation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Teacher,
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
    evaluatorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    academicYear: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-indexed: 0 = Jan, 5 = June
        if (month >= 5) {
          return `${year}-${year + 1}`;
        } else {
          return `${year - 1}-${year}`;
        }
      },
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
  },
  {
    sequelize: db,
    tableName: 'faculty_evaluations',
    timestamps: true,
  }
);

FacultyEvaluation.belongsTo(Teacher, { as: 'teacher', foreignKey: 'teacherId' });
FacultyEvaluation.belongsTo(Department, { as: 'department', foreignKey: 'departmentId' });
FacultyEvaluation.belongsTo(User, { as: 'evaluator', foreignKey: 'evaluatorId' });

export default FacultyEvaluation;
