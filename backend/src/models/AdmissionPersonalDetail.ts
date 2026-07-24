import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import Admission from './Admission';

class AdmissionPersonalDetail extends Model {
  public id!: string;
  public admissionId!: string;
  public firstName!: string;
  public lastName!: string;
  public middleName!: string | null;
  public dateOfBirth!: string | null;   // stored as "DD/MM/YYYY" string
  public gender!: string | null;
  public religion!: string | null;
  public caste!: string | null;
  public category!: string | null;      // GEN, OBC, C1, 2A, 2B, 3A, 3B, SC, ST, EWS, SEBC
  public areaType!: string | null;      // Urban, Rural, Semi-urban
  public phone!: string | null;
  public alternatePhone!: string | null;
  public email!: string | null;
  public nationality!: string | null;
  public studiedInKarnataka!: boolean | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AdmissionPersonalDetail.init(
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
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.STRING(12),  // DD/MM/YYYY
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
      allowNull: true,
    },
    religion: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    caste: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('GEN', 'OBC', 'C1', '2A', '2B', '3A', '3B', 'SC', 'ST', 'EWS', 'SEBC'),
      allowNull: true,
    },
    areaType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    alternatePhone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Indian',
    },
    studiedInKarnataka: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    tableName: 'admission_personal_details',
    timestamps: true,
  }
);

AdmissionPersonalDetail.belongsTo(Admission, { as: 'admission', foreignKey: 'admissionId' });
Admission.hasOne(AdmissionPersonalDetail, { as: 'studentpersonaldetails', foreignKey: 'admissionId' });

export default AdmissionPersonalDetail;
