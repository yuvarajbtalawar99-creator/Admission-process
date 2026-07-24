import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import Student from './Student';
import Subject from './Subject';

class Marks extends Model {
  public id!: string;
  public studentId!: string;
  public subjectId!: string;
  public examType!: 'IA1' | 'IA2' | 'SEMESTER';
  public marksObtained!: number;
  public maxMarks!: number;
  public semester!: number;
  public grade!: string;
  public Subject?: any;
  public createdAt!: Date;
}

Marks.init(
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
    examType: {
      type: DataTypes.ENUM('IA1', 'IA2', 'SEMESTER'),
      allowNull: false,
    },
    marksObtained: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    maxMarks: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 12
      }
    },
    grade: {
      type: DataTypes.CHAR(2),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    tableName: 'marks',
    timestamps: false,
    indexes: [
      {
        fields: ['studentId', 'subjectId'],
        unique: true,
        where: {
          examType: 'SEMESTER',
        },
      },
      {
        fields: ['studentId', 'semester'],
      },
    ],
  }
);

Marks.belongsTo(Student, { foreignKey: 'studentId' });
Marks.belongsTo(Subject, { foreignKey: 'subjectId' });

export default Marks;