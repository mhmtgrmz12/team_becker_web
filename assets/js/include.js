/* Client-side HTML partial injector.
   Usage: <div data-include="/partials/header.html"></div>
   Emits a `partials:ready` event once every include is resolved. */

export async function resolveIncludes (root = document) {
  const nodes = [...root.querySelectorAll("[data-include]")];
  console.log("[include] Found nodes:", nodes.length);
  await Promise.all(nodes.map(async (node) => {
    const url = node.getAttribute("data-include");
    console.log("[include] Loading:", url);
    try {
      const res = await fetch(url, { credentials: "same-origin" });
      console.log("[include] Response:", url, res.status, res.headers.get("content-type"));
      if (!res.ok) throw new Error(`${url} → ${res.status}`);
      const html = await res.text();
      console.log("[include] Loaded:", url, html.length, "chars");
      const tpl = document.createElement("template");
      tpl.innerHTML = html.trim();
      node.replaceWith(tpl.content.cloneNode(true));
    } catch (err) {
      console.error("[include] ERROR:", url, err);
      node.innerHTML = `<!-- failed to load ${url} -->`;
    }
  }));
  console.log("[include] All partials resolved");
  document.dispatchEvent(new CustomEvent("partials:ready"));
}

// Export the promise so app.js can await it before starting i18n
export const partialsReady = resolveIncludes();
