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
const { Op, Model, QueryError } = require('sequelize');
 const logger = require('../database-cli/utils/logger');
const { error } = require('console');


class QueryWritingError extends Error {
  constructor(message) {
    super(message);
    this.name = "Query Error";
  }
}

class SequelizeConnectionError extends Error{
  constructor(message){
    super(message);
    this.name = "Sequelize Error"
  }
}
class DataImportingError extends Error{
  constructor(message){
    super(message);
    this.name = "Importing Error"
  }
}

class UnknownError extends Error{
  constructor(message){
    super(message);
    this.name = "Unknown Error"
  }
}

// list of employees who are not part of any projects
program.command("employeeList").description("List of employees who are not part of any projects").action(
  function(){
    employeesWithoutProjects()
    .then((employeeNames) => {
      logger.info("---------------------------");
      employeeNames.forEach((employee) => {
      logger.info(employee.name);
      });
      logger.info("---------------------------");
    })
    .catch((error) => {
      logger.error(new QueryWritingError("Unable to fetch employees who are not part of any projects from the database. Please re-check the Sequelize query"));
    })
  }
);

function employeesWithoutProjects() {
  return new Promise((resolve, reject) => {
    resolve( employeeNames = Employee.findAll({
      include: [{
        model: ProjectEmployee,
      }],
      where: {
        "$ProjectEmployees.projectI$": null
      },
    }))
    reject(error);
  });
};



//list of projects
program.command('projectList').description("List of projects with information of employee, role, contribution percentage").action(
  function(){
    listOfProjects()
    .then((ProjectNames)=>{
      logger.info("-----------------------------------------------------------")
      ProjectNames.forEach((element)=>{
      logger.info((element.toJSON()).Project.name, " - " + (element.toJSON()).Employee.name, " - ", (element.toJSON()).role, " - ", + (element.toJSON()).contributionPercentage+"%");
    })
      logger.info("------------------------------------------------------------")
    }).catch((error)=>{
      logger.error(new QueryWritingError("Unable to fetch list of projects from database. Please recheck the query"));
    })
  }
)

function listOfProjects() {
  return new Promise((resolve, reject) => {
    resolve( ProjectNames =   ProjectEmployee.findAll({
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
    }))
    reject(error);
  });
};


// list of employees who are under utilized
program.command('underUtilizedEmployees').description("List of employees who are under utilized").action(
  function (){
    underutilizedEmployees()
      .then((employeeNames) => {
        logger.info("-----------------------------------------------------------")
        employeeNames.forEach((employee)=>{
        logger.info(employee.name);
        })
        console.log("------------------------------------------------------------")
      })
      .catch((error) => {
        logger.error(new QueryWritingError("Unable to fetch under utilized employees from database. Please recheck the query"));
      })
  } 
)


function underutilizedEmployees() {
  return new Promise((resolve, reject) => {
    resolve( employeeNames = Employee.findAll({
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
    }))
    reject(error);
  });
};



// import data from csv files to database
program.command('i').action(() => {
  sequelize
    .sync()
    .then(() => {
      return Promise.all([
        Employee.destroy({ where: {} }),
        Project.destroy({ where: {} }),
        ProjectEmployee.destroy({ where: {} }),
      ]);
    })
    .then(() => {
      logger.info("-------------------------------------------");
      logger.info('All rows have been deleted from all the tables.');
      logger.info("-------------------------------------------");
      const employeeFilePath = '/Users/mahender/Documents/database-cli/employees.csv';
      const projectFilePath = '/Users/mahender/Documents/database-cli/projects.csv';
      const projectEmployeeFilePath = '/Users/mahender/Documents/database-cli/projectEmployees.csv';
      
      return Promise.all([
        csvtojson().fromFile(employeeFilePath),
        csvtojson().fromFile(projectFilePath),
        csvtojson().fromFile(projectEmployeeFilePath),
      ]);
    })
    .then(([employeedata, projectdata, projectEmployeedata]) => {
      return Promise.all([
        Employee.bulkCreate(employeedata),
        Project.bulkCreate(projectdata),
        ProjectEmployee.bulkCreate(projectEmployeedata),
      ]);
    })
    .then(() => {
      logger.info("-------------------------------------------");
      logger.info('Data is imported into the database');
      logger.info("-------------------------------------------");
    })
    .catch((error) => {
      if (error.name === "SequelizeConnectionError") {
        logger.error(new SequelizeConnectionError("Error occurred while connecting to the database."));
      } else if (error.name === "DataImportingError") {
        logger.error(new DataImportingError("Error occurred while importing data into database."));
      } else {
        logger.error(new UnknownError("An unknown error occurred."));
      }
    });
});


program.parse(process.argv);
