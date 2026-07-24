import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import Admission from './Admission';

class AdmissionAcademicDetail extends Model {
  public id!: string;
  public admissionId!: string;
  // 10th
  public tenthSchool!: string | null;
  public tenthBoard!: string | null;
  public tenthPassingYear!: number | null;
  public tenthPercentage!: number | null;
  public tenthRegisterNumber!: string | null;
  public tenthMarksObtained!: number | null;
  public tenthMaxMarks!: number | null;
  public tenthAttempts!: number | null;
  public tenthSubjectMarks!: any | null;
  // 12th / Diploma
  public twelfthSchool!: string | null;
  public twelfthBoard!: string | null;
  public twelfthPassingYear!: number | null;
  public twelfthPercentage!: number | null;
  public twelfthStream!: string | null;
  public twelfthRegisterNumber!: string | null;
  public physicsMarks!: number | null;
  public mathsMarks!: number | null;
  public optionalSubject!: string | null;
  public optionalMarks!: number | null;
  public twelfthMaxMarks!: number | null;
  public twelfthAggregate!: number | null;
  public twelfthAttempts!: number | null;
  // Diploma
  public diplomaUniversity!: string | null;
  public diplomaYear!: number | null;
  public diplomaRegisterNumber!: string | null;
  public diplomaFinalYearMaxMarks!: number | null;
  public diplomaFinalYearObtained!: number | null;
  public diplomaPercentage!: number | null;
  public diplomaAttempts!: number | null;
  // CET Score / Rank
  public cetScore!: number | null;
  public cetRank!: number | null;
  public cetYear!: number | null;
  // Gap Year
  public hasGap!: boolean;
  public gapReason!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AdmissionAcademicDetail.init(
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
    tenthSchool: { type: DataTypes.STRING(200), allowNull: true },
    tenthBoard: { type: DataTypes.STRING(50), allowNull: true },
    tenthPassingYear: { type: DataTypes.INTEGER, allowNull: true },
    tenthPercentage: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    tenthRegisterNumber: { type: DataTypes.STRING(50), allowNull: true },
    tenthMarksObtained: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
    tenthMaxMarks: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
    tenthAttempts: { type: DataTypes.INTEGER, allowNull: true },
    tenthSubjectMarks: { type: DataTypes.JSONB, allowNull: true },
    twelfthSchool: { type: DataTypes.STRING(200), allowNull: true },
    twelfthBoard: { type: DataTypes.STRING(50), allowNull: true },
    twelfthPassingYear: { type: DataTypes.INTEGER, allowNull: true },
    twelfthPercentage: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    twelfthStream: { type: DataTypes.STRING(50), allowNull: true },
    twelfthRegisterNumber: { type: DataTypes.STRING(50), allowNull: true },
    physicsMarks: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
    mathsMarks: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
    optionalSubject: { type: DataTypes.STRING(50), allowNull: true },
    optionalMarks: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
    twelfthMaxMarks: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
    twelfthAggregate: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
    twelfthAttempts: { type: DataTypes.INTEGER, allowNull: true },
    diplomaUniversity: { type: DataTypes.STRING(100), allowNull: true },
    diplomaYear: { type: DataTypes.INTEGER, allowNull: true },
    diplomaRegisterNumber: { type: DataTypes.STRING(50), allowNull: true },
    diplomaFinalYearMaxMarks: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
    diplomaFinalYearObtained: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
    diplomaPercentage: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    diplomaAttempts: { type: DataTypes.INTEGER, allowNull: true },
    cetScore: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
    cetRank: { type: DataTypes.INTEGER, allowNull: true },
    cetYear: { type: DataTypes.INTEGER, allowNull: true },
    hasGap: { type: DataTypes.BOOLEAN, defaultValue: false },
    gapReason: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize: db,
    tableName: 'admission_academic_details',
    timestamps: true,
  }
);

AdmissionAcademicDetail.belongsTo(Admission, { as: 'admission', foreignKey: 'admissionId' });
Admission.hasOne(AdmissionAcademicDetail, { as: 'studentacademicdetails', foreignKey: 'admissionId' });

export default AdmissionAcademicDetail;
