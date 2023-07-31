const { DataTypes } = require('sequelize');
const sequelize = require('./dbConnection');

const ProjectEmployee = sequelize.define('ProjectEmployee', {
  
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contributionPercentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
    timestamps:false // to avoid all additional columns
});

module.exports = ProjectEmployee;

const Employee = require('./employee');
const Project = require('./project');

ProjectEmployee.belongsTo(Employee, {
  foreignKey: 'employeeId',
});
ProjectEmployee.belongsTo(Project, {
  foreignKey: 'projectId',
});

ProjectEmployee.sync({alter:true}).then(()=>{
    console.log("Table and model synced succesfully");
    }).catch(()=>{
    console.log("Error syncing the table and model!");
})