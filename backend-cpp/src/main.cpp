#include "crow.h"
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
    CROW_ROUTE(app, "/api/projects")
    ([]() {
        crow::json::wvalue::list projects;

        crow::json::wvalue project1;
        project1["id"] = 1;
        project1["name"] = "TeamForge";
        project1["domain"] = "Web Development";
        project1["required_skill"] = "React";

        crow::json::wvalue project2;
        project2["id"] = 2;
        project2["name"] = "Smart Food Waste Reduction";
        project2["domain"] = "AI/ML";
        project2["required_skill"] = "Python";

        projects.push_back(std::move(project1));
        projects.push_back(std::move(project2));

        return crow::json::wvalue(projects);
    });
    
CROW_ROUTE(app, "/api/status")
([]() {
    crow::json::wvalue response;

    response["app"] = "TeamForge";
    response["status"] = "running";
    response["phase"] = "Backend Development";

    return response;
});


    app.port(18080)
       .multithreaded()
       .run();
}
