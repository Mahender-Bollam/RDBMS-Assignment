const { DataTypes } = require('sequelize');
const sequelize = require('./dbConnection');

const Employee = sequelize.define('Employee', {
  
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  joiningDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
},{
    timestamps:false // to avoid all additional columns
});

module.exports = Employee;

const Project = require('./project');
const ProjectEmployee = require('./projectEmployee');

Employee.belongsToMany(Project, {
  through: ProjectEmployee,
  foreignKey: 'employeeId',
});

Employee.hasMany(ProjectEmployee,{
    foreignKey :'employeeId',
})

Project.belongsToMany(Employee, {
  through: ProjectEmployee,
  foreignKey: 'projectId',
});

Employee.sync({alter:false}).then(()=>{
    console.log("Table and model synced succesfully");
    }).catch(()=>{
    console.log("Error syncing the table and model!");
})