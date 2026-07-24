import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import User from './User';

class Announcement extends Model {
  public id!: string;
  public title!: string;
  public content!: string;
  public audience!: string;
  public priority!: 'NORMAL' | 'HIGH' | 'CRITICAL';
  public channels!: any; // JSON array of channels
  public status!: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  public date!: Date;
  public senderId!: string;
  public sentCount!: number;
  public deliveredCount!: number;
  public openedCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Announcement.init(
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    audience: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'All Students',
    },
    priority: {
      type: DataTypes.ENUM('NORMAL', 'HIGH', 'CRITICAL'),
      allowNull: false,
      defaultValue: 'NORMAL',
    },
    channels: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: ['DASHBOARD'],
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
      allowNull: false,
      defaultValue: 'PUBLISHED',
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    sentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    deliveredCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    openedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize: db,
    tableName: 'announcements',
    timestamps: true,
  }
);

Announcement.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });

export default Announcement;
