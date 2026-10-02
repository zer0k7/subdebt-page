const downloadButton = document.querySelector("[data-download]");
const status = document.querySelector("[data-download-status]");

downloadButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const label = downloadButton.querySelector("span");
  const originalLabel = label.textContent;
  label.textContent = "Preparing download...";
  status.textContent = "Preparing the APK...";
  status.dataset.state = "ready";

  try {
    const response = await fetch(downloadButton.href, { mode: "cors" });
    if (!response.ok) throw new Error("Download unavailable");

    const blobUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "SubDebt-arm64-v8a.apk";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
    status.textContent = "Download started · v2.14.1";
  } catch (error) {
    status.textContent = "Starting direct download...";
    window.location.assign(downloadButton.href);
  } finally {
    label.textContent = originalLabel;
  }
});
