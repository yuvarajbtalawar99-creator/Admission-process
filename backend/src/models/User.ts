import { DataTypes, Model } from 'sequelize';
import db from '../config/database';
import bcrypt from 'bcryptjs';

class User extends Model {
  public id!: string;
  public username!: string;
  public email!: string;
  public passwordHash!: string;
  public role!: 'SUPER_ADMIN' | 'ADMIN' | 'HOD' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'PRINCIPAL';
  public status!: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  public firstName!: string;
  public lastName!: string;
  public phone!: string;
  public profileImage!: string;
  public tokenVersion!: number;
  public mustChangePassword!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method to check password validity
  public comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('SUPER_ADMIN', 'ADMIN', 'HOD', 'TEACHER', 'STUDENT', 'PARENT', 'PRINCIPAL'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    mustChangePassword: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeSave: async (user: User) => {
        if (user.changed('passwordHash')) {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      },
    },
  }
);

export default User;
