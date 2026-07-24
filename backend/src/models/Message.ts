import { DataTypes, Model } from 'sequelize';
import db from '../config/database';

class Message extends Model {
  public id!: string;
  public senderId!: string;
  public receiverId!: string | null;
  public category!: 'ADMISSION' | 'FEES' | 'ACADEMIC' | 'GENERAL';
  public priority!: 'LOW' | 'MEDIUM' | 'HIGH';
  public subject!: string;
  public body!: string;
  public status!: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  public handledByAdminId!: string | null;
  public isRead!: boolean;
  public readAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('ADMISSION', 'FEES', 'ACADEMIC', 'GENERAL'),
      allowNull: false,
      defaultValue: 'GENERAL',
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
      allowNull: false,
      defaultValue: 'LOW',
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'CLOSED'),
      allowNull: false,
      defaultValue: 'OPEN',
    },
    handledByAdminId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: 'messages',
    timestamps: true,
  }
);

import User from './User';

Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });
Message.belongsTo(User, { as: 'handledBy', foreignKey: 'handledByAdminId' });

export default Message;
