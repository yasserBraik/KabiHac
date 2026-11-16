interface DownloadsCapability {
  save(file: { filename: string; data: Blob }): Promise<unknown>;
}
interface HostRuntime {
  use(name: "downloads"): Promise<DownloadsCapability | null>;
}
declare global {
  interface Window {
    claude?: HostRuntime;
  }
}

export type DownloadOutcome = "saved" | "cancelled" | "navigated";

/**
 * Downloads a same-origin file. On hosts that sandbox downloads (such as the Claude artifact
 * viewer) it uses the host's downloads capability; everywhere else it falls back to navigation.
 */
export async function downloadFile(href: string, filename: string): Promise<DownloadOutcome> {
  const host = window.claude;
  const fallback = (): DownloadOutcome => {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    a.rel = "noopener";
    document.body.append(a);
    a.click();
    a.remove();
    return "navigated";
  };
  if (!host) return fallback();
  try {
    const downloads = await host.use("downloads");
    if (!downloads) return fallback();
    const response = await fetch(href);
    if (!response.ok) return fallback();
    await downloads.save({ filename, data: await response.blob() });
    return "saved";
  } catch (error) {
    if (error instanceof Error && /declin|cancel|abort/i.test(`${error.name} ${error.message}`))
      return "cancelled";
    return fallback();
  }
}
