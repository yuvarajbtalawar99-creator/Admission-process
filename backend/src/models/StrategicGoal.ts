import { DataTypes, Model } from 'sequelize';
import db from '../config/database';

class StrategicGoal extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public targetYear!: number;
  public currentValue!: number;
  public targetValue!: number;
  public status!: 'ON_TRACK' | 'DELAYED' | 'COMPLETED';
  public category!: 'ACADEMICS' | 'INFRASTRUCTURE' | 'PLACEMENTS' | 'ACCREDITATION';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

StrategicGoal.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    targetYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    targetValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
    status: {
      type: DataTypes.ENUM('ON_TRACK', 'DELAYED', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'ON_TRACK',
    },
    category: {
      type: DataTypes.ENUM('ACADEMICS', 'INFRASTRUCTURE', 'PLACEMENTS', 'ACCREDITATION'),
      allowNull: false,
      defaultValue: 'ACADEMICS',
    },
  },
  {
    sequelize: db,
    tableName: 'strategic_goals',
    timestamps: true,
  }
);

export default StrategicGoal;
