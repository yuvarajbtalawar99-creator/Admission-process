import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import Admission from './Admission';

class AdmissionAddress extends Model {
  public id!: string;
  public admissionId!: string;
  // Current Address
  public currentAddressLine1!: string | null;
  public currentAddressLine2!: string | null;
  public currentCity!: string | null;
  public currentState!: string | null;
  public currentPincode!: string | null;
  public currentCountry!: string | null;
  // Permanent Address
  public sameAsCurrent!: boolean;
  public permanentAddressLine1!: string | null;
  public permanentAddressLine2!: string | null;
  public permanentCity!: string | null;
  public permanentState!: string | null;
  public permanentPincode!: string | null;
  public permanentCountry!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AdmissionAddress.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    admissionId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: Admission, key: 'id' },
      onDelete: 'CASCADE',
    },
    currentAddressLine1: { type: DataTypes.STRING(200), allowNull: true },
    currentAddressLine2: { type: DataTypes.STRING(200), allowNull: true },
    currentCity: { type: DataTypes.STRING(100), allowNull: true },
    currentState: { type: DataTypes.STRING(100), allowNull: true },
    currentPincode: { type: DataTypes.STRING(10), allowNull: true },
    currentCountry: { type: DataTypes.STRING(50), allowNull: true, defaultValue: 'India' },
    sameAsCurrent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    permanentAddressLine1: { type: DataTypes.STRING(200), allowNull: true },
    permanentAddressLine2: { type: DataTypes.STRING(200), allowNull: true },
    permanentCity: { type: DataTypes.STRING(100), allowNull: true },
    permanentState: { type: DataTypes.STRING(100), allowNull: true },
    permanentPincode: { type: DataTypes.STRING(10), allowNull: true },
    permanentCountry: { type: DataTypes.STRING(50), allowNull: true, defaultValue: 'India' },
  },
  {
    sequelize: db,
    tableName: 'admission_addresses',
    timestamps: true,
  }
);

AdmissionAddress.belongsTo(Admission, { as: 'admission', foreignKey: 'admissionId' });
Admission.hasOne(AdmissionAddress, { as: 'studentaddress', foreignKey: 'admissionId' });

export default AdmissionAddress;
