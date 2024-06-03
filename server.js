const mysql = require("mysql2");
const inquirer = require("inquirer");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Password",
  database: "company_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to company_db.");
  run();
});

function run() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add A Department",
        "Add A Role",
        "Add An Employee",
        "Update An Employee Role",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Departments":
          viewAllDepartments();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add A Department":
          addDepartment();
          break;
        case "Add A Role":
          addRole();
          break;
        case "Add An Employee":
          addEmployee();
          break;
        case "Update An Employee Role":
          updateEmployeeRole();
          break;
      }
    });
}

function viewAllDepartments() {
  db.query(`SELECT * FROM department;`, (err, res) => {
    if (err) throw err;
    console.table(res);
    run();
  });
}

function viewAllRoles() {
  db.query(
    `SELECT r.id, r.title, r.salary, d.name AS department
  FROM role r
  LEFT JOIN department d ON r.department_id = d.id`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      run();
    }
  );
}

function viewAllEmployees() {
  db.query(
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, 
  CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r ON e.role_id = r.id
  LEFT JOIN department d ON r.department_id = d.id
  LEFT JOIN employee m ON e.manager_id = m.id`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      run();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "What is the name of the department?",
    })
    .then((answer) => {
      db.query(
        `INSERT INTO department (name) VALUES (?)`,
        [answer.name],
        (err, res) => {
          if (err) throw err;
          console.log(`Added ${answer.name} to list of departments.`);
          run();
        }
      );
    });
}

function addRole() {
  db.query(`SELECT * FROM department`, (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the title of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          name: "department",
          message: "Which department will this role be part of?",
          choices: res.map((department) => department.name),
        },
      ])
      .then((answer) => {
        const department = res.find(
          (department) => department.name === answer.department
        );
        db.query(
          `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
          [answer.title, answer.salary, department.id],
          (err, res) => {
            if (err) throw err;
            console.log(`Added ${answer.title} to the list of roles.`);
            run();
          }
        );
      });
  });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "role_id",
        type: "input",
        message: "What is the employee's role ID?",
      },
      {
        name: "manager_id",
        type: "input",
        message: "What is the employee's manager's ID? (Leave blank if none)",
        default: null,
      },
    ])
    .then((answer) => {
      const manager_id = answer.manager_id === '' ? null : answer.manager_id;
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
        [
          answer.first_name,
          answer.last_name,
          answer.role_id,
          manager_id,
        ],
        (err, res) => {
          if (err) throw err;
          console.log("Employee added.");
          run();
        }
      );
    });
}

function updateEmployeeRole() {
  db.query(`SELECT * FROM employee`, (err, employees) => {
    if (err) throw err;
    db.query(`SELECT * FROM role`, (err, roles) => {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "employee_id",
            type: "list",
            message: "Which employee's role do you want to update?",
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            name: "role_id",
            type: "list",
            message: "What is the new role?",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answer) => {
          db.query(
            `UPDATE employee SET role_id = ? WHERE id = ?`,
            [answer.role_id, answer.employee_id],
            (err, res) => {
              if (err) throw err;
              console.log("Employee role updated.");
              run();
            }
          );
        });
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
