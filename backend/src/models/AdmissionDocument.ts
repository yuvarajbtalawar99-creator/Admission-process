import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import Admission from './Admission';

class AdmissionDocument extends Model {
  public id!: string;
  public admissionId!: string;
  // Document URLs (local disk paths)
  public photoUrl!: string | null;
  public signatureUrl!: string | null;
  public tenthMarksheetUrl!: string | null;
  public twelfthMarksheetUrl!: string | null;
  public cetScoreCardUrl!: string | null;
  public aadhaarUrl!: string | null;
  public casteCertificateUrl!: string | null;
  public domicileCertificateUrl!: string | null;
  public gapCertificateUrl!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AdmissionDocument.init(
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
    photoUrl: { type: DataTypes.STRING(500), allowNull: true },
    signatureUrl: { type: DataTypes.STRING(500), allowNull: true },
    tenthMarksheetUrl: { type: DataTypes.STRING(500), allowNull: true },
    twelfthMarksheetUrl: { type: DataTypes.STRING(500), allowNull: true },
    cetScoreCardUrl: { type: DataTypes.STRING(500), allowNull: true },
    aadhaarUrl: { type: DataTypes.STRING(500), allowNull: true },
    casteCertificateUrl: { type: DataTypes.STRING(500), allowNull: true },
    domicileCertificateUrl: { type: DataTypes.STRING(500), allowNull: true },
    gapCertificateUrl: { type: DataTypes.STRING(500), allowNull: true },
  },
  {
    sequelize: db,
    tableName: 'admission_documents',
    timestamps: true,
  }
);

AdmissionDocument.belongsTo(Admission, { as: 'admission', foreignKey: 'admissionId' });
Admission.hasOne(AdmissionDocument, { as: 'studentdocuments', foreignKey: 'admissionId' });

export default AdmissionDocument;
