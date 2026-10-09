const notificationButton = document.getElementById("notification-button");
const notificationPanel = document.getElementById("notification-panel");
if (notificationButton && notificationPanel) {
  notificationButton.addEventListener("click", () => {
    const isExpanded = notificationButton.getAttribute("aria-expanded") === "true";
    notificationButton.setAttribute("aria-expanded", String(!isExpanded));
    notificationPanel.hidden = isExpanded;
  });
  document.addEventListener("click", (event) => {
    if (!notificationButton.contains(event.target) && !notificationPanel.contains(event.target)) {
      notificationButton.setAttribute("aria-expanded", "false");
      notificationPanel.hidden = true;
    }
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then((registration) => {
        let updatePromptShown = false;
        let reloadAfterUpdate = false;

        function showUpdatePrompt(worker) {
          if (updatePromptShown || !navigator.serviceWorker.controller) return;
          updatePromptShown = true;

          const prompt = document.createElement("aside");
          prompt.className = "pwa-update-prompt";
          prompt.setAttribute("role", "status");

          const message = document.createElement("span");
          message.textContent = "新しいバージョンがあります";

          const reloadButton = document.createElement("button");
          reloadButton.type = "button";
          reloadButton.textContent = "再読み込み";
          reloadButton.addEventListener("click", () => {
            reloadAfterUpdate = true;
            worker.postMessage("SKIP_WAITING");
          });

          const laterButton = document.createElement("button");
          laterButton.type = "button";
          laterButton.className = "pwa-update-later";
          laterButton.textContent = "後で";
          laterButton.setAttribute("aria-label", "後で更新する");
          laterButton.addEventListener("click", () => prompt.remove());

          prompt.append(message, reloadButton, laterButton);
          document.body.append(prompt);
        }

        function checkForWaitingWorker() {
          if (registration.waiting) showUpdatePrompt(registration.waiting);
        }

        checkForWaitingWorker();
        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener("statechange", () => {
            if (installingWorker.state === "installed") checkForWaitingWorker();
          });
        });

        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (reloadAfterUpdate) window.location.reload();
        });

        registration.update()
          .catch((error) => console.error("PWA service worker update check failed:", error));
      })
      .catch((error) => console.error("PWA service worker registration failed:", error));
  });
}
