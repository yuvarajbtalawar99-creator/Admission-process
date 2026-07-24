import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import Fee from './Fee';

class FeePayment extends Model {
  public id!: string;
  public feeId!: string;
  public amountPaid!: number;
  public paymentDate!: Date;
  public paymentMethod!: 'CARD' | 'UPI' | 'NET_BANKING' | 'CASH';
  public transactionReference!: string;
  public status!: 'SUCCESS' | 'FAILED' | 'PENDING';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FeePayment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    feeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Fee,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    paymentMethod: {
      type: DataTypes.ENUM('CARD', 'UPI', 'NET_BANKING', 'CASH'),
      allowNull: false,
    },
    transactionReference: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('SUCCESS', 'FAILED', 'PENDING'),
      allowNull: false,
      defaultValue: 'SUCCESS',
    },
  },
  {
    sequelize: db,
    tableName: 'fee_payments',
    timestamps: true,
  }
);

FeePayment.belongsTo(Fee, { foreignKey: 'feeId', as: 'fee' });
Fee.hasMany(FeePayment, { foreignKey: 'feeId', as: 'payments' });

export default FeePayment;
