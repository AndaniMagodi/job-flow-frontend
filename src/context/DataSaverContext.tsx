import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

/**
 * Data-light mode.
 *
 * A large share of South African users browse on capped, prepaid mobile data,
 * where every megabyte is a real cost. This is not a visual preference — it
 * changes what the app actually downloads:
 *
 *   - the variable webfont (~120KB) is never requested
 *   - fewer jobs per page, so fewer bytes per request
 *   - description snippets are dropped from list views
 *
 * Defaults ON when the browser reports a slow connection or the user has asked
 * their OS to save data, so the people who need it get it without knowing to
 * look for a setting.
 */

const STORAGE_KEY = "jobflow.dataSaver";
const FONT_ID = "jobflow-webfont";

// Loaded at runtime rather than imported in CSS, so data-light mode can
// genuinely skip the download instead of merely not using the font.
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

function browserPrefersLessData(): boolean {
  const connection = (
    navigator as Navigator & { connection?: NetworkInformation }
  ).connection;
  if (!connection) return false;

  if (connection.saveData) return true;
  return ["slow-2g", "2g", "3g"].includes(connection.effectiveType ?? "");
}

function readStored(): boolean | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === null ? null : raw === "true";
  } catch {
    return null;
  }
}

type DataSaverValue = {
  dataSaver: boolean;
  setDataSaver: (on: boolean) => void;
  /** Jobs per request — fewer means a smaller response. */
  pageSize: number;
};

const DataSaverContext = createContext<DataSaverValue | null>(null);

export function DataSaverProvider({ children }: { children: ReactNode }) {
  const [dataSaver, setDataSaverState] = useState<boolean>(
    () => readStored() ?? browserPrefersLessData()
  );

  useEffect(() => {
    const existing = document.getElementById(FONT_ID);

    if (dataSaver) {
      existing?.remove();
      return;
    }

    if (!existing) {
      const link = document.createElement("link");
      link.id = FONT_ID;
      link.rel = "stylesheet";
      link.href = FONT_HREF;
      document.head.appendChild(link);
    }
  }, [dataSaver]);

  useEffect(() => {
    document.documentElement.dataset.dataSaver = String(dataSaver);
  }, [dataSaver]);

  function setDataSaver(on: boolean) {
    setDataSaverState(on);
    try {
      localStorage.setItem(STORAGE_KEY, String(on));
    } catch {
      /* preference just won't persist — the mode still works this session */
    }
  }

  return (
    <DataSaverContext.Provider
      value={{ dataSaver, setDataSaver, pageSize: dataSaver ? 10 : 20 }}
    >
      {children}
    </DataSaverContext.Provider>
  );
}

export function useDataSaver(): DataSaverValue {
  const ctx = useContext(DataSaverContext);
  if (!ctx) throw new Error("useDataSaver must be used inside DataSaverProvider");
  return ctx;
}
