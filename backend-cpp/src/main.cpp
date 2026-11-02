
#include "crow.h"
#include <mysql.h>

#include <cstdint>
#include <cstdlib>
#include <iostream>
#include <string>
#include <utility>

crow::response json_response(int status, crow::json::wvalue body)
{
    crow::response response(status, body.dump());
    response.set_header("Content-Type", "application/json; charset=utf-8");
    return response;
}

int main()
{
    crow::SimpleApp app;

    CROW_ROUTE(app, "/health")
    ([]() {
        crow::json::wvalue response;
        response["status"] = "ok";
        response["message"] = "TeamForge backend live";
        return response;
    });

    CROW_ROUTE(app, "/api/status")
    ([]() {
        crow::json::wvalue response;
        response["app"] = "TeamForge";
        response["status"] = "running";
        response["phase"] = "Backend Development";
        return response;
    });

    CROW_ROUTE(app, "/api/projects")
    ([]() -> crow::response {

        const char* password = std::getenv("TEAMFORGE_DB_PASSWORD");

        if (password == nullptr) {
            crow::json::wvalue error;
            error["error"] = "Database password is not configured";
            return json_response(500, std::move(error));
        }

        MYSQL* connection = mysql_init(nullptr);

        if (connection == nullptr) {
            crow::json::wvalue error;
            error["error"] = "Could not initialize MySQL";
            return json_response(500, std::move(error));
        }

        if (mysql_real_connect(
                connection,
                "127.0.0.1",
                "root",
                password,
                "teamforge_db",
                3306,
                nullptr,
                0) == nullptr) {

            std::cerr << "MySQL connection failed: "
                      << mysql_error(connection) << '\n';

            mysql_close(connection);

            crow::json::wvalue error;
            error["error"] = "Database connection failed";
            return json_response(500, std::move(error));
        }

        mysql_set_character_set(connection, "utf8mb4");

        const char* query =
            "SELECT id, title, description, domain, created_by, "
            "max_members, status, created_at "
            "FROM projects ORDER BY id";

        if (mysql_query(connection, query) != 0) {
            std::cerr << "MySQL query failed: "
                      << mysql_error(connection) << '\n';

            mysql_close(connection);

            crow::json::wvalue error;
            error["error"] = "Could not retrieve projects";
            return json_response(500, std::move(error));
        }

        MYSQL_RES* result = mysql_store_result(connection);

        if (result == nullptr) {
            std::cerr << "Could not read query result: "
                      << mysql_error(connection) << '\n';

            mysql_close(connection);

            crow::json::wvalue error;
            error["error"] = "Could not read project records";
            return json_response(500, std::move(error));
        }

        crow::json::wvalue::list projects;

        MYSQL_ROW row;

        while ((row = mysql_fetch_row(result)) != nullptr) {
            crow::json::wvalue project;

            project["id"] = static_cast<std::uint64_t>(
                std::strtoull(row[0], nullptr, 10));

            project["title"] = row[1] ? row[1] : "";
            project["description"] = row[2] ? row[2] : "";
            project["domain"] = row[3] ? row[3] : "";

            project["created_by"] = static_cast<std::uint64_t>(
                std::strtoull(row[4], nullptr, 10));

            project["max_members"] = std::atoi(row[5]);
            project["status"] = row[6] ? row[6] : "";
            project["created_at"] = row[7] ? row[7] : "";

            projects.push_back(std::move(project));
        }

        mysql_free_result(result);
        mysql_close(connection);

        crow::json::wvalue response;
        response["count"] = static_cast<int>(projects.size());
        response["projects"] = std::move(projects);

        return json_response(200, std::move(response));
    });

    app.port(18080)
       .multithreaded()
       .run();
}
