import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import Student from './Student';

class Performance extends Model {
  public id!: string;
  public studentId!: string;
  public semester!: number;
  public sgpa!: number;
  public cgpa!: number;
  public riskLevel!: 'AT_RISK' | 'AVERAGE' | 'GOOD' | 'EXCELLENT';
  public createdAt!: Date;
}

Performance.init(
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
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sgpa: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
    },
    cgpa: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
    },
    riskLevel: {
      type: DataTypes.ENUM('AT_RISK', 'AVERAGE', 'GOOD', 'EXCELLENT'),
      defaultValue: 'AVERAGE',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    tableName: 'performance',
    timestamps: false,
    indexes: [
      {
        fields: ['studentId', 'semester'],
      },
    ],
  }
);

Performance.belongsTo(Student, { foreignKey: 'studentId' });

export default Performance;