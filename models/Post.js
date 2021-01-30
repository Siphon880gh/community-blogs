const { Model, DataTypes } = require('sequelize');
const sequelizeConnection = require('../config/connection');

// create our Post model
class Post extends Model {}

// create fields/columns for Post model
Post.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        }
    }
}, {
    sequelize: sequelizeConnection,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
});

module.exports = Post;