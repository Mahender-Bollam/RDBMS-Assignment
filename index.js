#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const mysql = require('mysql2');
const csvtojson = require('csvtojson');
const sequelize = require('./dbConnection');
const Employee = require('./employee');
const Project = require('./project');
const ProjectEmployee = require('./projectEmployee');
const { Op } = require('sequelize');
  


// list of employees who are not part of any projects
program.command("e").action(
async function employeesWithoutProjects() {
    Employee.findAll({
      include: [{
        model: ProjectEmployee,
        }],
        where: {
          "$ProjectEmployees.projectId$":null
          },
    })
      .then((result) => {
        // Handle the query result here
        console.log("---------------------------")
        result.forEach((element)=>{
          console.log(element.name);
        })
        console.log("-----------------------------")
      })
      .catch((error) => {
        // Handle any errors that occur during the query
        console.error(error);
      });
});

//list of projects
program.command('p').action(
  async function getAllProjects() {
      ProjectEmployee.findAll({
        attributes: ['role','contributionPercentage'],
        include: [
          {
            model: Employee,
            attributes: ['name'],
            required:true,
          },
          {
            model:Project,
            attributes:['name'],
            required:true,
          }
        ],
      }).then((result) => {
        // Handle the query result here
        console.log("-----------------------------------------------------------")
        result.forEach((element)=>{
        console.log((element.toJSON()).Project.name, " - " + (element.toJSON()).Employee.name, " - ", (element.toJSON()).role, " - ", + (element.toJSON()).contributionPercentage+"%");
        })
        console.log("------------------------------------------------------------")
      })
      .catch((error) => {
        // Handle any errors that occur during the query
        console.error(error);
      });
  }
)


// list of employees who are under utilized
program.command('u').action(
  async function underutilizedEmployees() {
      Employee.findAll({
        attributes: ['name', 'employeeId',[sequelize.fn('SUM', sequelize.col('contributionPercentage')), 'total']],
        group: 'Employee.employeeId',
        include: [{
          model: ProjectEmployee,
          attributes: [],
          required: false,
        }],
        having:{
          total:{
            [Op.lt]: 100
          }
        }
      }).then((result) => {
        // Handle the query result here
        console.log("-----------------------------------------------------------")
        result.forEach((element)=>{
        console.log(element.name);
        })
        console.log("------------------------------------------------------------")
      })
      .catch((error) => {
        // Handle any errors that occur during the query
        console.error(error);
      });
  }
)

// import data from csv files to database
program.command('i').action(
  async ()=> {
    try {
      //destroy method to delete all rows from all the tables
      await sequelize.sync();
      await Employee.destroy({
        where: {},
      });
      await Project.destroy({
        where: {},
      })
      await ProjectEmployee.destroy({
        where:{},
      })
      console.log("-------------------------------------------")
      console.log('All rows have been deleted from the all the tables.');
      console.log("-------------------------------------------")
      const employeeFilePath = '/Users/mahender/Documents/database-cli/employees.csv'
      const projectFilePath = '/Users/mahender/Documents/database-cli/projects.csv'
      const projectEmployeeFilePath = '/Users/mahender/Documents/database-cli/projectEmployees.csv'
      const employeedata= await csvtojson().fromFile(employeeFilePath);
      await Employee.bulkCreate(employeedata); 
      const projectdata= await csvtojson().fromFile(projectFilePath);
      await Project.bulkCreate(projectdata); 
      const projectEmployeedata= await csvtojson().fromFile(projectEmployeeFilePath);
      await ProjectEmployee.bulkCreate(projectEmployeedata); 
      console.log("-------------------------------------------")
      console.log('Data is imported into database');
      console.log("-------------------------------------------")
    } catch (error) {
      console.error('Error occurred while deleting rows:', error);
    }
  }
);

program.parse(process.argv);






