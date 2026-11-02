
CREATE DATABASE IF NOT EXISTS teamforge_db;
USE teamforge_db;
CREATE TABLE IF NOT EXISTS users(user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL,
 email VARCHAR(280) NOT NULL, password_hash VARCHAR(200) NOT NULL, bio TEXT, github_url VARCHAR(70)
NOT NULL, linkedin_url VARCHAR(70) NOT NULL, exp_yrs INT NOT NULL, status ENUM('free','busy'),
role ENUM('student','admin') NOT NULL DEFAULT 'student', created_at TIMESTAMP 
NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS user_skills (
    user_id BIGINT UNSIGNED NOT NULL,
    skill_id BIGINT UNSIGNED NOT NULL,
    proficiency ENUM('beginner', 'intermediate', 'advanced')
        NOT NULL DEFAULT 'beginner',
    PRIMARY KEY (user_id, skill_id),
    CONSTRAINT fk_user_skills_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_skills_skill
        FOREIGN KEY (skill_id) REFERENCES skills(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE projects(
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL, description TEXT NOT NULL, domain VARCHAR(100) NOT NULL,
    created_by BIGINT UNSIGNED NOT NULL,max_members INT UNSIGNED NOT NULL DEFAULT 4,
    status ENUM('open', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT chk_project_capacity
    CHECK (max_members >= 1), CONSTRAINT fk_projects_creator FOREIGN KEY (created_by) 
    REFERENCES users(user_id) ON DELETE RESTRICT,   INDEX idx_projects_status_created (status, created_at),
    INDEX idx_projects_creator (created_by) 
)ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS project_skills (
    project_id BIGINT UNSIGNED NOT NULL,
    skill_id BIGINT UNSIGNED NOT NULL,
    required_level ENUM('beginner', 'intermediate', 'advanced')
        NOT NULL DEFAULT 'beginner',
    PRIMARY KEY (project_id, skill_id),
    CONSTRAINT fk_project_skills_project
        FOREIGN KEY (project_id) REFERENCES projects(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_project_skills_skill
        FOREIGN KEY (skill_id) REFERENCES skills(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    message TEXT,
    status ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_application_project_user
        UNIQUE (project_id, user_id),
    CONSTRAINT fk_applications_project
        FOREIGN KEY (project_id) REFERENCES projects(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_applications_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    INDEX idx_applications_project_status (project_id, status),
    INDEX idx_applications_user_created (user_id, created_at)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS team_members (
    project_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    member_role ENUM('owner', 'member')
        NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id),
    CONSTRAINT fk_team_members_project
        FOREIGN KEY (project_id) REFERENCES projects(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_team_members_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    INDEX idx_team_members_user (user_id)
) ENGINE=InnoDB;
