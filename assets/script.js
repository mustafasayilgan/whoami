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

function bindProjectModal() {
  const modal = qs("[data-modal]");
  if (!modal) return;

  const titleEl = qs("#modalTitle", modal);
  const subtitleEl = qs("[data-modal-subtitle]", modal);
  const bodyEl = qs("[data-modal-body]", modal);
  const closeEls = qsa("[data-close-modal]", modal);

  let lastActive = null;

  function openFrom(btn) {
    lastActive = document.activeElement;
    const title = btn.getAttribute("data-modal-title") || "";
    const subtitle = btn.getAttribute("data-modal-subtitle") || "";
    const body = btn.getAttribute("data-modal-body") || "";

    if (titleEl) titleEl.textContent = title;
    if (subtitleEl) subtitleEl.textContent = subtitle;
    if (bodyEl) bodyEl.textContent = body;

    modal.setAttribute("data-open", "true");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const focusTarget = qs("[data-close-modal]", modal) || qs("button, a, [tabindex]", modal);
    focusTarget?.focus?.();
  }

  function close() {
    modal.setAttribute("data-open", "false");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastActive && typeof lastActive.focus === "function") lastActive.focus();
    lastActive = null;
  }

  qsa("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => openFrom(btn));
  });

  closeEls.forEach((el) => el.addEventListener("click", close));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("data-open") === "true") {
      e.preventDefault();
      close();
    }
  });

  modal.addEventListener("click", (e) => {
    const card = qs(".modal-card", modal);
    if (card && !card.contains(e.target)) close();
  });
}

setYear();
bindCopy();
bindPrint();
bindQaControls();
bindProjectModal();

