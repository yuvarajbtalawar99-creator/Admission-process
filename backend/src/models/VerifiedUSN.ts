import { DataTypes, Model } from 'sequelize';
import db from '../config/database';

class VerifiedUSN extends Model {
  public id!: string;
  public usn!: string;
  public semester!: number;
  public department!: string;
  public admissionYear!: number;
  public section!: string;
  public status!: 'APPROVED' | 'USED';
  public uploadedBy!: string;
  public uploadedAt!: Date;
  public usedAt!: Date;
}

VerifiedUSN.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    usn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admissionYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('APPROVED', 'USED'),
      defaultValue: 'APPROVED',
      allowNull: false,
    },
    uploadedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploadedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: 'verified_usns',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['usn'],
      },
      {
        fields: ['semester'],
      },
      {
        fields: ['department'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default VerifiedUSN;
