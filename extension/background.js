chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "SAVE_JOB") {
      fetch("http://127.0.0.1:8000/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(msg.payload)
      })
        .then(res => res.json())
        .then(data => sendResponse({ ok: true, data }))
        .catch(err => sendResponse({ ok: false, error: err.message }));
  
      return true; // keep async alive
    }
  });