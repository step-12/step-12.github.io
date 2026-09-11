(function () {
  var RESET_DELAY_MS = 1500;

  function isMac() {
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  }

  function getCodeText(codeEl) {
    return codeEl && codeEl.textContent ? codeEl.textContent : "";
  }

  function fallbackCopy(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "readonly");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    var copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(textArea);
    return copied;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard
        .writeText(text)
        .then(function () {
          return true;
        })
        .catch(function () {
          return fallbackCopy(text);
        });
    }

    return Promise.resolve(fallbackCopy(text));
  }

  function setButtonState(button, label, state) {
    button.textContent = label;
    button.setAttribute("data-state", state || "idle");
  }

  function attachButton(codeEl) {
    var preEl = codeEl.parentElement;
    if (!preEl || preEl.getAttribute("data-copy-ready") === "true") {
      return;
    }

    preEl.setAttribute("data-copy-ready", "true");
    var container = preEl.closest(".highlight") || preEl;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy-button";
    button.textContent = "Copy";
    button.setAttribute("aria-label", "Copy code");
    button.setAttribute("data-state", "idle");

    button.addEventListener("click", function () {
      var codeText = getCodeText(codeEl);
      copyText(codeText).then(function (copied) {
        if (copied) {
          setButtonState(button, "Copied", "copied");
        } else {
          setButtonState(
            button,
            isMac() ? "Press Cmd+C" : "Press Ctrl+C",
            "error",
          );
        }

        window.setTimeout(function () {
          setButtonState(button, "Copy", "idle");
        }, RESET_DELAY_MS);
      });
    });

    container.insertBefore(button, container.firstChild);
  }

  function initCopyButtons() {
    var codeBlocks = document.querySelectorAll("pre > code");
    for (var i = 0; i < codeBlocks.length; i += 1) {
      attachButton(codeBlocks[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCopyButtons);
  } else {
    initCopyButtons();
  }
})();
