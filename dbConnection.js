const { Sequelize, DataTypes } = require('sequelize');
const nconf = require("nconf");
nconf.file({file:"config.json"}) //loads environmental variables from the config.json file (which is in the same directory)

const db_host = nconf.get("host");
const db_port = nconf.get("port");
const db_user = nconf.get("user");
const db_password = nconf.get("password");
const db_name = nconf.get("database_name");

const db_url = `mysql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`;
const sequelize = new Sequelize(db_url);

async function testConnection() {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
  
testConnection();


// sequelize.authenticate().then(()=>{
//     console.log("Connection established");
// }).catch((err)=>{
//     console.log("Error connecting to database", err);
// }) //returns a promise

module.exports = sequelize