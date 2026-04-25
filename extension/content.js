function extractJobData() {
    const url = window.location.href;
  
    if (url.includes("linkedin.com/jobs")) {
      return {
        role: document.querySelector(".job-details-jobs-unified-top-card__job-title h1")?.innerText?.trim()
          || document.querySelector("h1.t-24")?.innerText?.trim()
          || "",
        company: document.querySelector(".job-details-jobs-unified-top-card__company-name a")?.innerText?.trim()
          || document.querySelector(".ember-view .t-black")?.innerText?.trim()
          || "",
        link: window.location.href,
        source: "linkedin",
      };
    }
  
    if (url.includes("greenhouse.io")) {
      return {
        role: document.querySelector("h1.app-title")?.innerText?.trim()
          || document.querySelector("h1")?.innerText?.trim()
          || "",
        company: document.querySelector(".company-name")?.innerText?.trim()
          || document.title.split(" at ")[1]?.trim()
          || "",
        link: window.location.href,
        source: "greenhouse",
      };
    }
  
    if (url.includes("lever.co")) {
      return {
        role: document.querySelector(".posting-headline h2")?.innerText?.trim()
          || document.querySelector("h2")?.innerText?.trim()
          || "",
        company: document.querySelector(".main-header-logo img")?.alt?.trim()
          || document.title.split(" - ")[1]?.trim()
          || "",
        link: window.location.href,
        source: "lever",
      };
    }
  
    if (url.includes("indeed.com")) {
      return {
        role: document.querySelector("h1.jobsearch-JobInfoHeader-title")?.innerText?.trim()
          || document.querySelector("h1")?.innerText?.trim()
          || "",
        company: document.querySelector("[data-company-name]")?.innerText?.trim()
          || document.querySelector(".jobsearch-InlineCompanyRating-companyHeader")?.innerText?.trim()
          || "",
        link: window.location.href,
        source: "indeed",
      };
    }
  

    if (url.includes("pnet.co.za")) {
        return {
          role: document.querySelector("h1.job-title")?.innerText?.trim()
            || document.querySelector("h1")?.innerText?.trim()
            || "",
          company: document.querySelector(".company-name")?.innerText?.trim()
            || document.querySelector("[class*='company']")?.innerText?.trim()
            || "",
          link: window.location.href,
          source: "pnet",
        };
      }
      
      if (url.includes("executiveplacements.com")) {
        return {
          role: document.querySelector("h1.job-title")?.innerText?.trim()
            || document.querySelector("h1")?.innerText?.trim()
            || "",
          company: document.querySelector(".company-name")?.innerText?.trim()
            || document.querySelector("[class*='company']")?.innerText?.trim()
            || "",
          link: window.location.href,
          source: "executiveplacements",
        };
      }
    // Generic fallback — try to get something useful
    return {
      role: document.querySelector("h1")?.innerText?.trim() || "",
      company: document.title || "",
      link: window.location.href,
      source: "other",
    };
  }
  
  // Send data to popup when requested
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getJobData") {
      sendResponse(extractJobData());
    }
  });

  chrome.runtime.sendMessage({
    type: "SAVE_JOB",
    payload: extractJobData()
  }, (response) => {
    console.log("Job saved:", response);
  });