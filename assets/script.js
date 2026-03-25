function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function setButtonTemporaryText(btn, text, ms = 1200) {
  const prev = btn.textContent;
  btn.textContent = text;
  btn.disabled = true;
  window.setTimeout(() => {
    btn.textContent = prev;
    btn.disabled = false;
  }, ms);
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  ta.remove();
}

function setYear() {
  const el = qs("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

function bindCopy() {
  qsa("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy") || "";
      try {
        await copyToClipboard(value);
        setButtonTemporaryText(btn, "Copied");
      } catch {
        setButtonTemporaryText(btn, "Copy failed");
      }
    });
  });
}

function bindPrint() {
  const btn = qs("[data-print]");
  if (!btn) return;
  btn.addEventListener("click", () => window.print());
}

function bindQaControls() {
  const qa = qs("[data-qa]");
  if (!qa) return;

  const expand = qs("[data-expand-all]");
  const collapse = qs("[data-collapse-all]");
  const items = qsa("details", qa);

  expand?.addEventListener("click", () => {
    items.forEach((d) => (d.open = true));
  });

  collapse?.addEventListener("click", () => {
    items.forEach((d) => (d.open = false));
  });
}

setYear();
bindCopy();
bindPrint();
bindQaControls();

