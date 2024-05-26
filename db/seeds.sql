USE company_db;

INSERT INTO departments (name) VALUES ('Engineering'), ('Human Resources'), ('Marketing');

INSERT INTO roles (title, salary, department_id) VALUES 
('Software Engineer', 70000, 1), 
('HR Manager', 65000, 2), 
('Marketing Coordinator', 60000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
('Link', 'Stance', 1, Null),
('John', 'Smith', 2, Null),
('Jack', 'Radke', 3, Null);