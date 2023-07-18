INSERT INTO department(department_name)
VALUES("Engineering"), ("Sales"), ("Finance"), ("Legal"), ("Bussiness");

INSERT INTO role(title, salary, department_id)
VALUES("Junior Engineer", 80000, 1), ("Senior Engineer", 145000, 1),
 ("CEO", 400000, 3), ("President", 5000000, 5);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Charles', 'Doll', 1, 2), ('Jonathan', 'Richards', 1, null),
 ('Jay', 'Cutler', 1, 2), ('Gordon', 'Ryan', 2, 2), ('John', 'Danaher', 4, null);