
CREATE DATABASE IF NOT EXISTS teamforge_db;
USE teamforge_db;

INSERT INTO users (user_id,name,email,password_hash,bio,github_url,linkedin_url,exp_yrs,status,role)
VALUES
(1,'Aarav Sharma','aarav@example.com','TEST_HASH_NOT_FOR_LOGIN','C++ and backend development enthusiast.','https://github.com/aarav-demo','https://linkedin.com/in/aarav-demo',1,'free','student'),
(2,'Diya Verma','diya@example.com','TEST_HASH_NOT_FOR_LOGIN','Frontend developer interested in React.','https://github.com/diya-demo','https://linkedin.com/in/diya-demo',1,'free','student'),
(3,'Kabir Singh','kabir@example.com','TEST_HASH_NOT_FOR_LOGIN','Interested in databases and machine learning.','https://github.com/kabir-demo','https://linkedin.com/in/kabir-demo',2,'busy','student'),
(4,'Admin Demo','admin@example.com','TEST_HASH_NOT_FOR_LOGIN','Development administrator account.',NULL,NULL,2,'free','admin')
ON DUPLICATE KEY UPDATE
name=VALUES(name),
email=VALUES(email),
bio=VALUES(bio),
github_url=VALUES(github_url),
linkedin_url=VALUES(linkedin_url),
exp_yrs=VALUES(exp_yrs),
status=VALUES(status),
role=VALUES(role);

INSERT INTO skills (name)
VALUES
('C++'),
('MySQL'),
('HTML'),
('CSS'),
('JavaScript'),
('React'),
('Machine Learning'),
('Python'),
('Crow'),
('Git')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO user_skills (user_id,skill_id,proficiency)
SELECT u.user_id,s.id,x.proficiency
FROM (
SELECT 1 AS user_id,'C++' AS skill_name,'intermediate' AS proficiency
UNION ALL SELECT 1,'MySQL','beginner'
UNION ALL SELECT 1,'Crow','beginner'
UNION ALL SELECT 1,'Git','intermediate'
UNION ALL SELECT 2,'HTML','intermediate'
UNION ALL SELECT 2,'CSS','intermediate'
UNION ALL SELECT 2,'JavaScript','intermediate'
UNION ALL SELECT 2,'React','beginner'
UNION ALL SELECT 3,'MySQL','intermediate'
UNION ALL SELECT 3,'Machine Learning','intermediate'
UNION ALL SELECT 3,'Python','intermediate'
UNION ALL SELECT 4,'MySQL','advanced'
) AS x
JOIN users u ON u.user_id=x.user_id
JOIN skills s ON s.name=x.skill_name
ON DUPLICATE KEY UPDATE proficiency=VALUES(proficiency);

INSERT INTO projects (id,title,description,domain,created_by,max_members,status)
VALUES
(1,'TeamForge','A platform for students to discover projects and teammates.','Web Development',1,4,'open'),
(2,'Smart Price Predictor','Predict property prices using historical data.','Machine Learning',3,3,'open'),
(3,'Campus Task Manager','A web application for managing student tasks.','Web Development',2,4,'in_progress')
ON DUPLICATE KEY UPDATE
title=VALUES(title),
description=VALUES(description),
domain=VALUES(domain),
created_by=VALUES(created_by),
max_members=VALUES(max_members),
status=VALUES(status);

INSERT INTO project_skills (project_id,skill_id,required_level)
SELECT x.project_id,s.id,x.required_level
FROM (
SELECT 1 AS project_id,'C++' AS skill_name,'intermediate' AS required_level
UNION ALL SELECT 1,'MySQL','beginner'
UNION ALL SELECT 1,'HTML','beginner'
UNION ALL SELECT 1,'JavaScript','beginner'
UNION ALL SELECT 2,'Machine Learning','intermediate'
UNION ALL SELECT 2,'Python','intermediate'
UNION ALL SELECT 2,'MySQL','beginner'
UNION ALL SELECT 3,'HTML','intermediate'
UNION ALL SELECT 3,'CSS','intermediate'
UNION ALL SELECT 3,'React','beginner'
) AS x
JOIN skills s ON s.name=x.skill_name
ON DUPLICATE KEY UPDATE required_level=VALUES(required_level);

INSERT INTO team_members (project_id,user_id,member_role)
VALUES
(1,1,'owner'),
(1,2,'member'),
(2,3,'owner'),
(3,2,'owner')
ON DUPLICATE KEY UPDATE member_role=VALUES(member_role);

INSERT INTO applications (project_id,user_id,message,status)
VALUES
(1,3,'I can help with MySQL and backend development.','pending'),
(2,1,'I am interested in ML and can contribute C++ skills.','pending'),
(3,4,'I would like to review this project.','rejected')
ON DUPLICATE KEY UPDATE
message=VALUES(message),
status=VALUES(status);

SELECT user_id,name,email,role FROM users;
SELECT id,name FROM skills;
SELECT id,title,status FROM projects;
SELECT project_id,user_id,status FROM applications;
SELECT project_id,user_id,member_role FROM team_members;
