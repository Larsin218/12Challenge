const mysql = require("mysql2");
const inquirer = require("inquirer");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "yourUsername",
    password: "yourPassword",
    database: "company_db",
  },
  console.log("Connected to the database.")
);

function initApp() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "Add an employee",
        "Update an employee role",
        "View all roles",
        "Add a role",
        "View all departments",
        "Add a department",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all employees":
          viewEmployees();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "Add a role":
          addRole();
          break;
        case "View all departments":
          viewDepartments();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Exit":
          db.end();
          process.exit();
      }
    });
}

function viewDepartments() {
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) throw err;
    console.table(results);
    initApp();
  });
}

function viewRoles() {
  db.query("SELECT * FROM roles", (err, results) => {
    if (err) throw err;
    console.table(results);
    initApp();
  });
}

function viewEmployees() {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) throw err;
    console.table(results);
    initApp();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      name: "name",
      type: "input",
      message: "Enter the name of the department:",
    })
    .then((answer) => {
      db.query(
        "INSERT INTO departments (name) VALUES (?)",
        [answer.name],
        (err, result) => {
          if (err) throw err;
          console.log("Added " + answer.name + " to departments");
          initApp();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "Enter the title of the role:",
      },
      {
        name: "salary",
        type: "input",
        message: "Enter the salary for the role:",
      },
      {
        name: "department_id",
        type: "input",
        message: "Enter the department ID for the role:",
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
        [answer.title, answer.salary, answer.department_id],
        (err, result) => {
          if (err) throw err;
          console.log("Role Added: " + answer.title);
          initApp();
        }
      );
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "Enter the first name of the employee:",
      },
      {
        name: "last_name",
        type: "input",
        message: "Enter the last name of the employee:",
      },
      {
        name: "role_id",
        type: "input",
        message: "Enter the department ID for the employee:",
      },
      {
        name: "manager_id",
        type: "input",
        message: "Enter the manager ID for the employee (leave blank if none):",
      },
    ])
    .then((answer) => {
      db.query(
        "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [
          answer.first_name,
          answer.last_name,
          answer.role_id,
          answer.manager_id || null,
        ],
        (err, result) => {
          if (err) throw err;
          console.log(
            "Employee Added: " + answer.first_name + " " + answer.last_name
          );
          initApp();
        }
      );
    });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        name: "employee_id",
        type: "input",
        message: "Enter the ID of the employee whose role you want to update:",
      },
      {
        name: "new_role_id",
        type: "input",
        message: "Enter the new role ID for the employee:",
      },
    ])
    .then((answer) => {
      db.query(
        "UPDATE employees SET role_id = ? WHERE id = ?",
        [answer.new_role_id, answer.employee_id],
        (err, result) => {
          if (err) throw err;
          console.log("Employee role updates: " + answer.employee_id);
          initApp();
        }
      );
    });
}

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to the Company Management System.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
