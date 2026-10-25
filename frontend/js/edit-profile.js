/* TeamForge Edit Profile — local browser demo, ready to swap to backend API later. */
(() => {
    const form = document.getElementById("editProfileForm");
    if (!form) return;

    const message = document.getElementById("formMessage");
    const emailInput = document.getElementById("email");
    const fullNameInput = document.getElementById("fullName");
    const bioInput = document.getElementById("bio");
    const bioCount = document.getElementById("bioCount");
    const avatarPreview = document.getElementById("avatarPreview");

    const PROFILE_KEY = "teamforgeProfile";
    const PROFILES_KEY = "teamforgeProfiles";

    function readJSON(key, fallback) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return value ?? fallback;
        } catch {
            return fallback;
        }
    }

    function currentEmail() {
        return sessionStorage.getItem("teamforgeDemoEmail") || "";
    }

    function setAvatar(name) {
        const trimmed = (name || "").trim();
        avatarPreview.textContent = trimmed ? trimmed.charAt(0).toUpperCase() : "S";
    }

    function updateBioCount() {
        bioCount.textContent = String(bioInput.value.length);
    }

    function showMessage(text, isError = false) {
        message.textContent = text;
        message.classList.toggle("error", isError);
    }

    function loadProfile() {
        const current = currentEmail();
        const savedProfile = readJSON(PROFILE_KEY, {});
        const allProfiles = readJSON(PROFILES_KEY, []);
        const fromList = allProfiles.find(profile =>
            current && String(profile.email || "").toLowerCase() === current.toLowerCase()
        );
        const profile = (current && savedProfile.email &&
            savedProfile.email.toLowerCase() === current.toLowerCase())
            ? savedProfile
            : (fromList || savedProfile || {});

        const fields = [
            "fullName", "email", "college", "course", "year", "location",
            "skills", "proficiency", "preferredRole", "bio", "hours", "workMode"
        ];
        fields.forEach(name => {
            const input = form.elements.namedItem(name);
            if (input && profile[name] !== undefined && profile[name] !== null) {
                input.value = profile[name];
            }
        });
        if (!emailInput.value && current) emailInput.value = current;
        setAvatar(fullNameInput.value);
        updateBioCount();
    }
    fullNameInput.addEventListener("input", () => setAvatar(fullNameInput.value));
    bioInput.addEventListener("input", updateBioCount);
    form.addEventListener("submit", event => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const data = Object.fromEntries(new FormData(form).entries());
        data.fullName = data.fullName.trim();
        data.email = data.email.trim().toLowerCase();
        data.skills = (data.skills || "").trim();
        data.bio = (data.bio || "").trim();
        data.updatedAt = new Date().toISOString();
        localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
        const profiles = readJSON(PROFILES_KEY, []);
        const existingIndex = profiles.findIndex(profile =>
            String(profile.email || "").toLowerCase() === data.email
        );
        if (existingIndex >= 0) profiles[existingIndex] = { ...profiles[existingIndex], ...data };
        else profiles.push(data);
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));

       sessionStorage.setItem("teamforgeDemoEmail", data.email);
        showMessage("Profile saved successfully on this browser.");
        window.setTimeout(() => {
            window.location.href = "profile.html";
        }, 700);
    });
    loadProfile();
})();
