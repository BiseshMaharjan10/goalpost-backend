const {DataTypes} = require ("sequelize");
const {sequelize} = require ("../database/database");

const Register = sequelize.define(
    "Users",
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true
        },

        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },

        email:{
            type: DataTypes.STRING,
            unique: true,
            allowNull: false

        },

        password:{
            type: DataTypes.STRING,
            allowNull: false
        },

        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue:false
        },

        verificationToken: {
            type:DataTypes.STRING,
            allowNull:true
        },

        verificationTokenExpires:{
            type: DataTypes.DATE,
            allowNull:true
        }

    },
    {
        timestamps: true,
        tableName: "users"
    }
);

module.exports = Register;