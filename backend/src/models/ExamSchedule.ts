import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import Subject from './Subject';

class ExamSchedule extends Model {
  public id!: string;
  public subjectId!: string;
  public examDate!: Date;
  public examTime!: string;
  public hallNumber!: string;
  public invigilators!: string[];
  public Subject?: any;
  public createdAt!: Date;
}

ExamSchedule.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Subject,
        key: 'id',
      },
    },
    examDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    examTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hallNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invigilators: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    tableName: 'exam_schedules',
    timestamps: false,
    indexes: [
      {
        fields: ['examDate'],
      },
    ],
  }
);

ExamSchedule.belongsTo(Subject, { foreignKey: 'subjectId' });

export default ExamSchedule;