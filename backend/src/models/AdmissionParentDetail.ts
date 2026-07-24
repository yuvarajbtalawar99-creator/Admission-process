import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import Admission from './Admission';

class AdmissionParentDetail extends Model {
  public id!: string;
  public admissionId!: string;
  public fatherName!: string | null;
  public fatherOccupation!: string | null;
  public fatherPhone!: string | null;
  public fatherEmail!: string | null;
  public fatherAnnualIncome!: number | null;
  public motherName!: string | null;
  public motherOccupation!: string | null;
  public motherPhone!: string | null;
  public guardianName!: string | null;
  public guardianRelation!: string | null;
  public guardianPhone!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AdmissionParentDetail.init(
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
    fatherName: { type: DataTypes.STRING(100), allowNull: true },
    fatherOccupation: { type: DataTypes.STRING(100), allowNull: true },
    fatherPhone: { type: DataTypes.STRING(15), allowNull: true },
    fatherEmail: { type: DataTypes.STRING(100), allowNull: true },
    fatherAnnualIncome: { type: DataTypes.INTEGER, allowNull: true },
    motherName: { type: DataTypes.STRING(100), allowNull: true },
    motherOccupation: { type: DataTypes.STRING(100), allowNull: true },
    motherPhone: { type: DataTypes.STRING(15), allowNull: true },
    guardianName: { type: DataTypes.STRING(100), allowNull: true },
    guardianRelation: { type: DataTypes.STRING(50), allowNull: true },
    guardianPhone: { type: DataTypes.STRING(15), allowNull: true },
  },
  {
    sequelize: db,
    tableName: 'admission_parent_details',
    timestamps: true,
  }
);

AdmissionParentDetail.belongsTo(Admission, { as: 'admission', foreignKey: 'admissionId' });
Admission.hasOne(AdmissionParentDetail, { as: 'studentparentdetails', foreignKey: 'admissionId' });

export default AdmissionParentDetail;
