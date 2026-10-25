const TF = {
  read(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  showMessage(element, message, type = "success") {
    if (!element) return;
    element.textContent = message;
    element.className = `message ${type}`;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    const saved = TF.read("tf_demo_profile", {});
    ["fullName", "email", "domain", "skills", "experience", "availability"].forEach(id => {
      const field = document.getElementById(id);
      if (field && saved[id]) field.value = saved[id];
    });
    profileForm.addEventListener("submit", event => {
      event.preventDefault();
      const profile = Object.fromEntries(new FormData(profileForm).entries());
      TF.write("tf_demo_profile", profile);
      TF.showMessage(document.getElementById("profileMessage"), "Profile saved in this browser (demo only).");
    });
  }

  ["teammateForm", "teamForm"].forEach(formId => {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", event => {
      event.preventDefault();
      const request = Object.fromEntries(new FormData(form).entries());
      request.kind = formId === "teammateForm" ? "find-teammate" : "find-team";
      request.createdAt = new Date().toISOString();
      TF.write("tf_latest_search", request);
      window.location.href = "../student/results.html";
    });
  });

  const resultsContainer = document.getElementById("resultsContainer");
  if (resultsContainer) {
    const request = TF.read("tf_latest_search", {});
    const heading = document.getElementById("resultsHeading");
    const description = document.getElementById("resultsDescription");
    if (heading) heading.textContent = request.kind === "find-team" ? "Teams you could explore" : "Potential teammates";
    if (description) {
      description.textContent = request.domain
        ? `Demo suggestions for the ${request.domain} domain. These are sample records, not real matched users.`
        : "These are sample suggestions to demonstrate the results layout.";
    }
    const samples = [
      {name: "Aarav Sharma", role: "Frontend Developer", domain: "Web Development", skills: ["HTML", "CSS", "JavaScript"], experience: "Intermediate"},
      {name: "Meera Joshi", role: "Backend Developer", domain: "Web Development", skills: ["C++", "MySQL", "REST APIs"], experience: "Beginner"},
      {name: "Rohan Verma", role: "Data / ML Enthusiast", domain: "AI / ML", skills: ["Python", "SQL", "Data Analysis"], experience: "Intermediate"}
    ];
    resultsContainer.innerHTML = "";
    samples.forEach(person => {
      const article = document.createElement("article");
      article.className = "list-item";
      const title = document.createElement("h3");
      title.textContent = person.name;
      const role = document.createElement("p");
      role.textContent = `${person.role} · ${person.domain}`;
      const skills = document.createElement("div");
      person.skills.forEach(skill => {
        const pill = document.createElement("span");
        pill.className = "pill";
        pill.textContent = skill;
        skills.appendChild(pill);
      });
      const exp = document.createElement("p");
      exp.textContent = `Experience: ${person.experience}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "secondary";
      button.textContent = "Send interest (demo)";
      button.addEventListener("click", () => {
        const applications = TF.read("tf_demo_applications", []);
        applications.push({name: person.name, role: person.role, status: "Pending", createdAt: new Date().toISOString()});
        TF.write("tf_demo_applications", applications);
        button.textContent = "Interest saved";
        button.disabled = true;
      });
      article.append(title, role, skills, exp, button);
      resultsContainer.appendChild(article);
    });
  }

  const applicationsContainer = document.getElementById("applicationsContainer");
  if (applicationsContainer) {
    const applications = TF.read("tf_demo_applications", []);
    if (!applications.length) {
      applicationsContainer.innerHTML = '<div class="empty-state">No demo applications yet. Visit the results page and send interest to see an item here.</div>';
    } else {
      applicationsContainer.innerHTML = "";
      applications.forEach(item => {
        const article = document.createElement("article");
        article.className = "list-item";
        const title = document.createElement("h3");
        title.textContent = item.name;
        const role = document.createElement("p");
        role.textContent = item.role;
        const status = document.createElement("span");
        status.className = "pill";
        status.textContent = item.status;
        article.append(title, role, status);
        applicationsContainer.appendChild(article);
      });
    }
  }
});
