const API_URL = "http://127.0.0.1:8000";

const SOURCE_LABELS = {
  linkedin:             "via LinkedIn",
  greenhouse:           "via Greenhouse",
  lever:                "via Lever",
  indeed:               "via Indeed",
  workday:              "via Workday",
  pnet:                 "via PNet",
  executiveplacements:  "via Executive Placements",
  other:                "",
};

function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get("jobflow_token", (result) => {
      resolve(result.jobflow_token || null);
    });
  });
}

function setToken(token) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ jobflow_token: token }, resolve);
  });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function showError(msg) {
  const el = document.getElementById("error");
  el.textContent = msg;
  el.style.display = "block";
}

function showSuccess() {
  document.getElementById("success").style.display = "block";
  document.getElementById("save-btn").disabled = true;
  setTimeout(() => window.close(), 1500);
}

async function init() {
  const token = await getToken();

  if (!token) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("not-logged-in").style.display = "block";

    // Check if the user just logged in via the web app
    // Poll localStorage from the web app isn't possible cross-origin
    // so we show a "I've logged in" button instead
    const loginLink = document.createElement("button");
    loginLink.textContent = "I've logged in →";
    loginLink.style.cssText = "margin-top:8px;background:#6366f1;border:none;border-radius:6px;padding:8px 16px;color:#fff;font-size:13px;cursor:pointer;width:100%";
    loginLink.onclick = () => promptForToken();
    document.getElementById("not-logged-in").appendChild(loginLink);
    return;
  }

  loadJobData(token);
}

async function promptForToken() {
  const token = prompt("Paste your token from JobFlow (open DevTools → Application → localStorage → token):");
  if (token) {
    await setToken(token);
    location.reload();
  }
}

async function loadJobData(token) {
  // Try to get job data from the content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  let jobData = { role: "", company: "", link: tab.url, source: "other" };

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: "getJobData" });
    if (response) jobData = response;
  } catch {
    // Content script not loaded on this page — that's fine, user fills manually
  }

  document.getElementById("loading").style.display = "none";
  document.getElementById("main").style.display = "block";

  document.getElementById("company").value = jobData.company;
  document.getElementById("role").value = jobData.role;
  document.getElementById("date").value = today();

  if (jobData.source && jobData.source !== "other") {
    const badge = document.getElementById("source-badge");
    badge.textContent = SOURCE_LABELS[jobData.source] || jobData.source;
    badge.style.display = "inline-flex";
  }

  document.getElementById("save-btn").onclick = () => saveApplication(token, jobData.link);
}

async function saveApplication(token, link) {
  const company = document.getElementById("company").value.trim();
  const role = document.getElementById("role").value.trim();
  const date = document.getElementById("date").value;

  if (!company || !role) {
    showError("Company and role are required.");
    return;
  }

  document.getElementById("save-btn").disabled = true;
  document.getElementById("error").style.display = "none";

  try {
    const res = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        company,
        role,
        date_applied: date,
        link: link || undefined,
        status: "Applied",
      }),
    });

    if (res.status === 401) {
      await setToken(null);
      showError("Session expired. Please sign in again.");
      return;
    }

    if (!res.ok) {
      const err = await res.json();
      showError(err.detail || "Failed to save.");
      return;
    }

    showSuccess();
  } catch {
    showError("Could not reach JobFlow. Is the backend running?");
  } finally {
    document.getElementById("save-btn").disabled = false;
  }
}

init();