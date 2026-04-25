import { useState } from "react";

function ExtensionConnect() {
    const [copied, setCopied] = useState(false);
  
    function copyToken() {
      const token = localStorage.getItem("token");
      if (token) {
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  
    return (
      <button
        onClick={copyToken}
        className="text-xs text-slate-400 hover:text-indigo-500 transition-colors"
      >
        {copied ? "Token copied!" : "Connect browser extension"}
      </button>
    );
  }

export default ExtensionConnect;