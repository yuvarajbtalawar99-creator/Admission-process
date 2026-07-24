import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import Student from './Student';
import Subject from './Subject';
import Teacher from './Teacher';

class Attendance extends Model {
  public id!: string;
  public studentId!: string;
  public subjectId!: string;
  public teacherId!: string;
  public classDate!: Date;
  public status!: 'PRESENT' | 'ABSENT' | 'LEAVE';
  public remarks!: string;
  public Subject?: any;
  public Teacher?: any;
  public createdAt!: Date;
}

Attendance.init(
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
        model: Student,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Subject,
        key: 'id',
      },
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Teacher,
        key: 'id',
      },
    },
    classDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PRESENT', 'ABSENT', 'LEAVE'),
      defaultValue: 'PRESENT',
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    tableName: 'attendance',
    timestamps: false,
    indexes: [
      {
        fields: ['studentId', 'classDate'],
      },
      {
        fields: ['studentId'],
      },
      {
        fields: ['subjectId'],
      },
    ],
  }
);

Attendance.belongsTo(Student, { foreignKey: 'studentId' });
Attendance.belongsTo(Subject, { foreignKey: 'subjectId' });
Attendance.belongsTo(Teacher, { foreignKey: 'teacherId' });

export default Attendance;