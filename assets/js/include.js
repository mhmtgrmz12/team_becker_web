/* Client-side HTML partial injector.
   Usage: <div data-include="/partials/header.html"></div>
   Emits a `partials:ready` event once every include is resolved. */

export async function resolveIncludes (root = document) {
  const nodes = [...root.querySelectorAll("[data-include]")];
  await Promise.all(nodes.map(async (node) => {
    const url = node.getAttribute("data-include");
    try {
      const res = await fetch(url, { credentials: "same-origin" });
      if (!res.ok) throw new Error(`${url} → ${res.status}`);
      const html = await res.text();
      const tpl = document.createElement("template");
      tpl.innerHTML = html.trim();
      node.replaceWith(tpl.content.cloneNode(true));
    } catch (err) {
      console.error("[include]", err);
      node.innerHTML = `<!-- failed to load ${url} -->`;
    }
  }));
  document.dispatchEvent(new CustomEvent("partials:ready"));
}

resolveIncludes();
