const { DataTypes } = require('sequelize');
const sequelize = require('./dbConnection');

const Project = sequelize.define('Project', {
  
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  clientName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
    timestamps:false // to avoid all additional columns
});

module.exports = Project;

const Employee = require('./employee');
const ProjectEmployee = require('./projectEmployee');

Project.belongsToMany(Employee, {
  through: ProjectEmployee,
  foreignKey: 'projectId',
});

Project.hasMany(ProjectEmployee,{
    foreignKey :'projectId',
});

Employee.belongsToMany(Project, {
  through: ProjectEmployee,
  foreignKey: 'employeeId',
});

Project.sync({alter:true}).then(()=>{
    console.log("Table and model synced succesfully");
    }).catch(()=>{
    console.log("Error syncing the table and model!");
})