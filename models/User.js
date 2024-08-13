import {DataTypes} from 'sequelize';
import sequelize from '../database/Database.js';

const UserSchema = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatarUrl: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    }, {
        timestamps: true,
        tableName: 'users'
    },
);


export default UserSchema;
//module.exports = UserSchema;