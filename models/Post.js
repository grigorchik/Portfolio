import {DataTypes} from 'sequelize';
import sequelize from '../database/Database.js';

const PostSchema = sequelize.define('Post', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true
        },
        viewsCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        user: {
            type: DataTypes.INTEGER,
            ref: 'User',
            required: true
        },
        imageUrl: {
            type: DataTypes.STRING,
        },
    }, {
        timestamps: true,
        tableName: 'posts'
    },
);

export default PostSchema;
