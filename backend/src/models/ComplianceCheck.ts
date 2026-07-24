import { DataTypes, Model } from 'sequelize';
import db from '../config/database';

class ComplianceCheck extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public status!: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';
  public checkedAt!: Date;
  public remarks!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ComplianceCheck.init(
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
    status: {
      type: DataTypes.ENUM('COMPLIANT', 'NON_COMPLIANT', 'UNDER_REVIEW'),
      allowNull: false,
      defaultValue: 'UNDER_REVIEW',
    },
    checkedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: 'compliance_checks',
    timestamps: true,
  }
);

export default ComplianceCheck;
