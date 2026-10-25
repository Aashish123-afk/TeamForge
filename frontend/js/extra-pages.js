
/* TeamForge extra pages — local demo only; replace storage calls with API calls when backend is ready. */
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const read = (key, fallback = []) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const id = () => `tf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const safe = (value = "") => String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));
  const currentEmail = () => sessionStorage.getItem("teamforgeDemoEmail") || "demo.student@teamforge.local";
  const showMessage = (element, message, type = "success") => {
    if (!element) return;
    element.textContent = message;
    element.className = `message ${type}`;
  };

  document.querySelectorAll("[data-logout]").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    sessionStorage.removeItem("teamforgeDemoEmail");
    window.location.href = "../auth.html";
  }));

  // Create project
  const createForm = $("#createProjectForm");
  if (createForm) createForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!createForm.reportValidity()) return;
    const form = new FormData(createForm);
    const projects = read("teamforgeProjects");
    const project = {
      id: id(), title: String(form.get("title")).trim(),
      description: String(form.get("description")).trim(),
      domain: String(form.get("domain")), techStack: String(form.get("techStack")).trim(),
      skills: String(form.get("skills")).trim(), teamSize: Number(form.get("teamSize")),
      commitment: String(form.get("commitment")), visibility: String(form.get("visibility")),
      ownerEmail: currentEmail(), createdAt: new Date().toISOString()
    };
    projects.unshift(project);
    write("teamforgeProjects", projects);
    showMessage($("#formMessage"), "Project saved in this browser. You can now view it in Find a Team / admin Manage Projects.");
    createForm.reset();
  });

  // Team / project details. Supports ?id=project-id; without it, shows the newest project.
  const detailFields = $("#detailFields");
  if (detailFields) {
    const params = new URLSearchParams(window.location.search);
    const projects = read("teamforgeProjects");
    const project = projects.find(item => item.id === params.get("id")) || projects[0];
    if (project) {
      $("#detailTitle").textContent = project.title;
      $("#detailDescription").textContent = project.description;
      detailFields.innerHTML = [
        ["Domain", project.domain], ["Tech stack", project.techStack],
        ["Skills needed", project.skills], ["Team size", `${project.teamSize} members`],
        ["Commitment", project.commitment], ["Visibility", project.visibility]
      ].map(([label, value]) => `<div class="detail-row"><strong>${safe(label)}</strong><span>${safe(value)}</span></div>`).join("");
      const applyButton = $("#applyButton");
      applyButton.addEventListener("click", () => {
        const applications = read("teamforgeApplications");
        const email = currentEmail();
        if (applications.some(app => app.projectId === project.id && app.applicantEmail === email)) {
          showMessage($("#detailMessage"), "You have already applied to this project.", "error");
          return;
        }
        applications.unshift({
          id: id(), projectId: project.id, projectTitle: project.title,
          applicantEmail: email, status: "Pending", createdAt: new Date().toISOString()
        });
        write("teamforgeApplications", applications);
        showMessage($("#detailMessage"), "Application submitted in demo mode. Check Applications to see its status.");
      });
    } else {
      $("#detailTitle").textContent = "No project available";
      $("#detailDescription").textContent = "Create a project first, or open this page from a project result.";
      $("#applyButton").disabled = true;
    }
  }

  // Application details
  const applicationFields = $("#applicationFields");
  if (applicationFields) {
    const params = new URLSearchParams(window.location.search);
    const app = read("teamforgeApplications").find(item => item.id === params.get("id"));
    if (app) {
      $("#applicationTitle").textContent = app.projectTitle || "Application";
      applicationFields.innerHTML = [
        ["Project", app.projectTitle], ["Applicant", app.applicantEmail],
        ["Submitted", app.createdAt ? new Date(app.createdAt).toLocaleString() : "—"],
        ["Status", `<span class="status ${String(app.status).toLowerCase()}">${safe(app.status)}</span>`]
      ].map(([label, value]) => `<div class="detail-row"><strong>${safe(label)}</strong><span>${label === "Status" ? value : safe(value)}</span></div>`).join("");
    }
  }

  // My Team: accepted applications are treated as joined memberships in the demo.
  const myTeamList = $("#myTeamList");
  if (myTeamList) {
    const email = currentEmail();
    const apps = read("teamforgeApplications").filter(app => app.applicantEmail === email && app.status === "Accepted");
    const projects = read("teamforgeProjects");
    if (apps.length) {
      myTeamList.innerHTML = apps.map(app => {
        const project = projects.find(p => p.id === app.projectId);
        return `<article class="list-item"><h3>${safe(app.projectTitle || project?.title || "Team project")}</h3><p>${safe(project?.domain || "Project team")}</p><span class="status accepted">Joined</span><div class="page-actions"><a class="action-link secondary" href="team-details.html?id=${encodeURIComponent(app.projectId)}">View project</a></div></article>`;
      }).join("");
    } else {
      myTeamList.innerHTML = '<div class="empty-state">You have no accepted team applications yet. Apply to a project and, for demo testing, an admin can mark your application as Accepted from the Applications workflow when available.</div>';
    }
  }

  // Admin: users are based on demo profiles created by this app; current login shown as a fallback row.
  const usersBody = $("#usersTableBody");
  const renderUsers = () => {
    if (!usersBody) return;
    const query = ($("#userSearch")?.value || "").toLowerCase();
    const profiles = read("teamforgeProfiles");
    const users = profiles.length ? profiles : [{ name: "Demo Student", email: currentEmail(), skills: "Not added yet" }];
    const filtered = users.filter(u => `${u.name || ""} ${u.email || ""} ${u.skills || ""}`.toLowerCase().includes(query));
    usersBody.innerHTML = filtered.length ? filtered.map(u => `<tr><td>${safe(u.name || "Student")}</td><td>${safe(u.email || "—")}</td><td>${safe(u.skills || "—")}</td><td><button type="button" class="small-button danger" data-remove-user="${safe(u.email || "")}">Remove demo profile</button></td></tr>`).join("") : '<tr><td colspan="4">No matching demo users.</td></tr>';
  };
  if (usersBody) {
    renderUsers();
    $("#userSearch").addEventListener("input", renderUsers);
    usersBody.addEventListener("click", event => {
      const button = event.target.closest("[data-remove-user]");
      if (!button) return;
      const email = button.dataset.removeUser;
      write("teamforgeProfiles", read("teamforgeProfiles").filter(u => u.email !== email));
      showMessage($("#adminUserMessage"), "Demo profile removed from this browser.");
      renderUsers();
    });
  }

  // Admin: project list and removal.
  const projectsBody = $("#adminProjectsBody");
  const renderProjects = () => {
    if (!projectsBody) return;
    const query = ($("#projectSearch")?.value || "").toLowerCase();
    const projects = read("teamforgeProjects");
    const filtered = projects.filter(p => `${p.title} ${p.domain} ${p.techStack}`.toLowerCase().includes(query));
    projectsBody.innerHTML = filtered.length ? filtered.map(p => `<tr><td><strong>${safe(p.title)}</strong><br><span class="help">${safe(p.description || "")}</span></td><td>${safe(p.domain)}</td><td>${safe(p.techStack)}</td><td>${safe(p.visibility)}</td><td><button type="button" class="small-button danger" data-remove-project="${safe(p.id)}">Remove</button></td></tr>`).join("") : '<tr><td colspan="5">No matching projects.</td></tr>';
  };
  if (projectsBody) {
    renderProjects();
    $("#projectSearch").addEventListener("input", renderProjects);
    projectsBody.addEventListener("click", event => {
      const button = event.target.closest("[data-remove-project]");
      if (!button) return;
      const projectId = button.dataset.removeProject;
      write("teamforgeProjects", read("teamforgeProjects").filter(p => p.id !== projectId));
      showMessage($("#adminProjectMessage"), "Project removed from this browser.");
      renderProjects();
    });
  }
})();
