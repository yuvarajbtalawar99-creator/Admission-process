import { DataTypes, Model } from 'sequelize';
import db from '../config/database';

class RejectionReason extends Model {
  public id!: string;
  public code!: string;
  public label!: string;
  public description!: string;
  public active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RejectionReason.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize: db,
    tableName: 'rejection_reasons',
    timestamps: true,
  }
);

export default RejectionReason;
