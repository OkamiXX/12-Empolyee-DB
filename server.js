// Connects the server.js to the database.
const connection = require('./config/connection');

// Imports all the important packages for the project.
const inquirer = require('inquirer');
const validate = require('./public/validate'); // Used to validate if str are the same to str or num to num.

// Packages for aesthetic purposes.
const chalk = require('chalk');
const figlet = require('figlet');

// Database Connect and Starter Title
connection.connect((err) => {
  if (err) throw err;
  console.log(chalk.white.bold(`====================================================================================`));
  console.log(``);
  console.log(chalk.cyan.bold(figlet.textSync('Employee Tracker')));
  console.log(``);
  console.log(``);
  console.log(chalk.white.bold(`====================================================================================`));
  displayQuestions();
});

// Choices for the user.
const displayQuestions = () => {
  inquirer.prompt([
      {
        name: 'choices',
        type: 'list',
        message: 'Please select an option:',
        choices: [
          'View All Employees',
          'View All Roles',
          'View All Departments',
          'View All Employees By Department',
          'View Department Budgets',
          'Update Employee Role',
          'Add Employee',
          'Add Role',
          'Add Department',
          'Exit'
          ]
      }
    ])
    .then((answers) => {
      const {choices} = answers;

        if (choices === 'View All Employees') {
            viewAllEmployees();
        }

        if (choices === 'View All Departments') {
          viewAllDepartments();
      }

        if (choices === 'View All Employees By Department') {
            viewEmployeesByDepartment();
        }

        if (choices === 'Add Employee') {
            addEmployee();
        }

        if (choices === 'Update Employee Role') {
            updateEmployeeRole();
        }

        if (choices === 'View All Roles') {
            viewAllRoles();
        }

        if (choices === 'Add Role') {
            addRole();
        }

        if (choices === 'Add Department') {
            addDepartment();
        }

        if (choices === 'View Department Budgets') {
            viewDepartmentBudget();
        }

        if (choices === 'Exit') {
            connection.end();
        }
  });
};

/////////////////////////////////////////////////////////////////////////////////////
// ALL VIEW OPTIONS 
/////////////////////////////////////////////////////////////////////////////////////

// View All employees
const viewAllEmployees = () => {
  let sql =     `SELECT employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title, 
                department.department_name AS 'department', 
                role.salary
                FROM employee, role, department 
                WHERE department.id = role.department_id 
                AND role.id = employee.role_id
                ORDER BY employee.id ASC`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.log(chalk.whiteBright.bold(`====================================================================================`));
    console.log(`                              ` + chalk.cyanBright.bold(`Current Employees:`));
    console.log(chalk.whiteBright.bold(`====================================================================================`));
    console.table(res);
    console.log(chalk.whiteBright.bold(`====================================================================================`));
    displayQuestions();
  });
};

// View ALL roles
const viewAllRoles = () => {
  console.log(chalk.whiteBright.bold(`====================================================================================`));
  console.log(`                              ` + chalk.cyanBright.bold(`Current Employee Roles:`));
  console.log(chalk.whiteBright.bold(`====================================================================================`));
  const sql =     `SELECT role.id, role.title, department.department_name AS department
                  FROM role
                  INNER JOIN department ON role.department_id = department.id`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    res.forEach((role) => {console.log(role.title);});
    console.log(chalk.whiteBright.bold(`====================================================================================`));
    displayQuestions();
  });
};

// View ALL departments
const viewAllDepartments = () => {
  const sql =   `SELECT department.id AS id, department.department_name AS department FROM department`; 
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.log(chalk.whiteBright.bold(`====================================================================================`));
    console.log(`                              ` + chalk.cyanBright.bold(`All Departments:`));
    console.log(chalk.whiteBright.bold(`====================================================================================`));
    console.table(res);
    console.log(chalk.whiteBright.bold(`====================================================================================`));
    displayQuestions();
  });
};

// View ALL employees by department
const viewEmployeesByDepartment = () => {
  const sql =     `SELECT employee.first_name, 
                  employee.last_name, 
                  department.department_name AS department
                  FROM employee 
                  LEFT JOIN role ON employee.role_id = role.id 
                  LEFT JOIN department ON role.department_id = department.id`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
      console.log(chalk.whiteBright.bold(`====================================================================================`));
      console.log(`                              ` + chalk.cyanBright.bold(`Employees by Department:`));
      console.log(chalk.whiteBright.bold(`====================================================================================`));
      console.table(res);
      console.log(chalk.whiteBright.bold(`====================================================================================`));
      displayQuestions();
    });
};

//View ALL departments by budget
const viewDepartmentBudget = () => {
  console.log(chalk.whiteBright.bold(`====================================================================================`));
  console.log(`                              ` + chalk.cyanBright.bold(`Budget By Department:`));
  console.log(chalk.whiteBright.bold(`====================================================================================`));
  const sql =     `SELECT department_id AS id, 
                  department.department_name AS department,
                  SUM(salary) AS budget
                  FROM  role  
                  INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
      console.table(res);
      console.log(chalk.whiteBright.bold(`====================================================================================`));
      displayQuestions();
  });
};

/////////////////////////////////////////////////////////////////////////////////////
// ALL ADD OPTIONS
/////////////////////////////////////////////////////////////////////////////////////

// ADD a new employee
const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fistName',
      message: "What is the employee's first name?",
      validate: addFirstName => {
        if (addFirstName) {
            return true;
        } else {
            console.log('Please enter a first name');
            return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLastName => {
        if (addLastName) {
            return true;
        } else {
            console.log('Please enter a last name');
            return false;
        }
      }
    }
  ])
    .then(answer => {
    const crit = [answer.fistName, answer.lastName]
    const roleSql = `SELECT role.id, role.title FROM role`;
    connection.query(roleSql, (err, data) => {
      if (err) throw err; 
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));
      inquirer.prompt([
            {
              type: 'list',
              name: 'role',
              message: "What is the employee's role?",
              choices: roles
            }
          ])
            .then(roleChoice => {
              const role = roleChoice.role;
              crit.push(role);
              const managerSql =  `SELECT * FROM employee`;
              connection.query(managerSql, (err, data) => {
                if (err) throw err;
                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                  .then(managerChoice => {
                    const manager = managerChoice.manager;
                    crit.push(manager);
                    const sql =   `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                    connection.query(sql, crit, (err) => {
                    if (err) throw err;
                    console.log("Employee has been added!")
                    viewAllEmployees();
              });
            });
          });
        });
     });
  });
};

// ADD a new role
const addRole = () => {
  const sql = 'SELECT * FROM department'
  connection.query(sql, (err, res) => {
      if (err) throw err;
      let deptNamesArray = [];
      res.forEach((department) => {deptNamesArray.push(department.department_name);});
      deptNamesArray.push('Create Department');
      inquirer
        .prompt([
          {
            name: 'departmentName',
            type: 'list',
            message: 'Which department is this new role in?',
            choices: deptNamesArray
          }
        ])
        .then((answer) => {
          if (answer.departmentName === 'Create Department') {
            this.addDepartment();
          } else {
            addRoleResume(answer);
          }
        });

      const addRoleResume = (departmentData) => {
        inquirer
          .prompt([
            {
              name: 'newRole',
              type: 'input',
              message: 'What is the name of your new role?',
              validate: validate.validateString
            },
            {
              name: 'salary',
              type: 'input',
              message: 'What is the salary of this new role?',
              validate: validate.validateSalary
            }
          ])
          .then((answer) => {
            let createdRole = answer.newRole;
            let departmentId;

            res.forEach((department) => {
              if (departmentData.departmentName === department.department_name) {departmentId = department.id;}
            });

            let sql =   `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            let crit = [createdRole, answer.salary, departmentId];

            connection.query(sql, crit, (err) => {
              if (err) throw err;
              console.log(chalk.yellow.bold(`====================================================================================`));
              console.log(chalk.greenBright(`Role successfully created!`));
              console.log(chalk.yellow.bold(`====================================================================================`));
              viewAllRoles();
            });
          });
      };
    });
  };

// ADD a new department
const addDepartment = () => {
    inquirer
      .prompt([
        {
          name: 'newDepartment',
          type: 'input',
          message: 'What is the name of your new Department?',
          validate: validate.validateString
        }
      ])
      .then((answer) => {
        let sql =     `INSERT INTO department (department_name) VALUES (?)`;
        connection.query(sql, answer.newDepartment, (err, res) => {
          if (err) throw err;
          console.log(``);
          console.log(chalk.greenBright(answer.newDepartment + ` Department successfully created!`));
          console.log(``);
          viewAllDepartments();
        });
      });
};

/////////////////////////////////////////////////////////////////////////////////////
// UPDATE OPTION
/////////////////////////////////////////////////////////////////////////////////////

// UPDATE an employee's role
const updateEmployeeRole = () => {
    let sql =       `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
                    FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
    connection.query(sql, (err, res) => {
      if (err) throw err;
      let employeeNamesArray = [];
      res.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

      let sql =     `SELECT role.id, role.title FROM role`;
      connection.query(sql, (err, res) => {
        if (err) throw err;
        let rolesArray = [];
        res.forEach((role) => {rolesArray.push(role.title);});

        inquirer
          .prompt([
            {
              name: 'chosenEmployee',
              type: 'list',
              message: 'Which employee has a new role?',
              choices: employeeNamesArray
            },
            {
              name: 'chosenRole',
              type: 'list',
              message: 'What is their new role?',
              choices: rolesArray
            }
          ])
          .then((answer) => {
            let newTitleId, employeeId;

            res.forEach((role) => {
              if (answer.chosenRole === role.title) {
                newTitleId = role.id;
              }
            });

            res.forEach((employee) => {
              if (
                answer.chosenEmployee ===
                `${employee.first_name} ${employee.last_name}`
              ) {
                employeeId = employee.id;
              }
            });

            let sql_0 =    `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
            connection.query(
            sql_0,
            [newTitleId, employeeId],
            (err) => {
            if (err) throw err;
            console.log(chalk.greenBright.bold(`====================================================================================`));
            console.log(chalk.greenBright(`Employee Role Updated`));
            console.log(chalk.greenBright.bold(`====================================================================================`));
            displayQuestions();
            }
            );
          });
      });
    });
  };