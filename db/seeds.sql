\c employee_db

INSERT INTO department (department_name)
VALUES
('janitorial');

INSERT INTO roles (title,salary,department_id)
VALUES
('janitor',30000,1);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES
('bill','james',1,NULL);

