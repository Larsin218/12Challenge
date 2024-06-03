INSERT INTO department (name)
VALUES ('Engineering'),
       ('Finance'),
       ('Legal'),
       ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, (SELECT id FROM department WHERE name = 'Sales')),
       ('Salesperson', 80000, (SELECT id FROM department WHERE name = 'Sales')),
       ('Lead Engineer', 150000, (SELECT id FROM department WHERE name = 'Engineering')),
       ('Software Engineer', 120000, (SELECT id FROM department WHERE name = 'Engineering')),
       ('Account Manager', 160000, (SELECT id FROM department WHERE name = 'Finance')),
       ('Accountant', 125000, (SELECT id FROM department WHERE name = 'Finance')),
       ('Legal Team Lead', 250000, (SELECT id FROM department WHERE name = 'Legal')),
       ('Lawyer', 190000, (SELECT id FROM department WHERE name = 'Legal'));

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', (SELECT id FROM role WHERE title = 'Lead Engineer'), NULL),
       ('Mike', 'Chan', (SELECT id FROM role WHERE title = 'Software Engineer'), 1),
       ('Ashley', 'Rodriguez', (SELECT id FROM role WHERE title = 'Sales Lead'), NULL),
       ('Kevin', 'Tupik', (SELECT id FROM role WHERE title = 'Salesperson'), 3),
       ('Kunal', 'Singh', (SELECT id FROM role WHERE title = 'Account Manager'), NULL),
       ('Malia', 'Brown', (SELECT id FROM role WHERE title = 'Accountant'), 5),
       ('Sarah', 'Lourd', (SELECT id FROM role WHERE title = 'Legal Team Lead'), NULL),
       ('Tom', 'Allen', (SELECT id FROM role WHERE title = 'Lawyer'), 7);