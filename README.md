# Command Line Tool - Database Reports

This is a command-line tool that allows to manage a database and generate various reports related to employees and projects. The tool is built using the `commander.js` package and reads the required configuration data from a property file, allowing you to provide the URL of the DB and user credentials without hardcoding them in the code.

## Installation

To install the tool, follow these steps:

1. Clone the repository: `git clone <repository_url>`
2. Navigate to the project directory: `cd <project_directory>`
3. Install dependencies: `npm install`

## Configuration

Before using the command-line tool, you need to provide the necessary configuration information in a property file (e.g., `config.json`). The property file should include the following information:

json
{
  "dbURL": "your_db_url_here",
  "dbUser": "your_db_username_here",
  "dbPassword": "your_db_password_here",
  "csvPath": "path_to_csv_files_directory"
}

Replace `"your_db_url_here"`, `"your_db_username_here"`, and `"your_db_password_here"` with your actual database URL, username, and password, respectively. Also, specify the `"csvPath"` where the CSV files containing data for each table are stored.

## Schema Design

The database schema includes the following tables:

1. `employees`: Stores information about employees.
2. `projects`: Stores information about projects.
3. `project_employees`: Acts as a junction table between employees and projects, storing role and contribution % information.

## Usage

To run the command-line tool, use the following command:

bash
node file_name.js [command] [options]


Replace `filename.js` with the filename of your script.

### Commands and Options

1. *Import Data:*

   This command allows you to clean up the database by removing all rows from all tables and load data from CSV files into the tables.

   bash
   node filename.js import
   

2. *Print Reports:*

   This command provides various options to print reports.

   - *List of employees not part of any project:*

     To get a list of employees who are not part of any project, use the following command:

     bash
     node filename.js e
     

   - *List of all projects with team members and role information:*

     To get a list of all projects along with their team members, role information, and contribution percentages, use the following command:

     bash
     node filename.js p
     

   - *List of underutilized employees:*

     To get a list of employees whose time is not 100% occupied with projects, use the following command:

     bash
     node filename.js u
     

