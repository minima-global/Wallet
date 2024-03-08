export function copyToClipboard(text) {
  // Check for Clipboard API support
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // console.log("Text successfully copied to clipboard");
      })
      .catch((err) => {
        console.error("Unable to copy text to clipboard", err);
      });
  } else {
    // Fallback for browsers that don't support Clipboard API
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      // console.log("Text successfully copied to clipboard");
    } catch (err) {
      console.error("Unable to copy text to clipboard", err);
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

export default copyToClipboard;
