(function () {
  // 1. 动态注入 hook.js 到页面上下文 (双重保障，确保拦截器在所有 Chromium 内核浏览器中 100% 生效)
  try {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("hook.js");
    (document.head || document.documentElement).appendChild(script);
    script.onload = () => script.remove();
  } catch (e) {
    console.warn("[Dola助手] 注入 hook.js 异常:", e);
  }

  const PANEL_ID = "watermark-free-media-panel";
  const items = new Map();
  let shadow = null;
  let list = null;
  let count = null;
  let statusText = "等待捕获资源";

  function initPanel() {
    if (document.getElementById(PANEL_ID)) {
      return;
    }

    const host = document.createElement("div");
    host.id = PANEL_ID;
    (document.body || document.documentElement).appendChild(host);

    shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host {
          all: initial;
          position: fixed;
          right: 16px;
          bottom: 16px;
          z-index: 2147483647;
          font-family: Arial, "Microsoft YaHei", sans-serif;
        }

        .panel {
          width: 336px;
          max-height: 420px;
          display: flex;
          flex-direction: column;
          color: #1f2937;
          background: #fff;
          border: 1px solid rgba(31, 41, 55, 0.16);
          border-radius: 8px;
          box-shadow: 0 14px 38px rgba(15, 23, 42, 0.2);
          overflow: hidden;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 10px 12px;
          background: #f8fafc;
          border-bottom: 1px solid rgba(31, 41, 55, 0.1);
        }

        .title {
          font-size: 14px;
          line-height: 20px;
          font-weight: 700;
        }

        .count {
          min-width: 22px;
          height: 20px;
          padding: 0 6px;
          border-radius: 999px;
          background: #166534;
          color: #fff;
          font-size: 12px;
          line-height: 20px;
          text-align: center;
        }

        .list {
          min-height: 76px;
          max-height: 350px;
          overflow: auto;
          padding: 8px;
        }

        .empty {
          padding: 18px 10px;
          color: #64748b;
          font-size: 13px;
          line-height: 20px;
          text-align: center;
        }

        .item {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          align-items: center;
          padding: 8px;
          border: 1px solid rgba(31, 41, 55, 0.12);
          border-radius: 6px;
          background: #fff;
        }

        .item + .item {
          margin-top: 8px;
        }

        .label {
          min-width: 0;
          color: #273444;
          font-size: 13px;
          line-height: 18px;
          font-weight: 700;
        }

        .tag {
          display: inline-block;
          min-width: 34px;
          margin-right: 8px;
          padding: 2px 6px;
          border-radius: 999px;
          color: #fff;
          font-size: 12px;
          line-height: 16px;
          text-align: center;
        }

        .tag.video {
          background: #6d28d9;
        }

        .tag.image {
          background: #0f766e;
        }

        button {
          height: 30px;
          padding: 0 10px;
          border: 0;
          border-radius: 6px;
          background: #2563eb;
          color: #fff;
          font-size: 12px;
          line-height: 30px;
          cursor: pointer;
        }

        button:hover {
          background: #1d4ed8;
        }
      </style>
      <section class="panel" aria-label="无水印资源面板">
        <div class="header">
          <div class="title">无水印资源</div>
          <div class="count">0</div>
        </div>
        <div class="list">
          <div class="empty">等待捕获资源</div>
        </div>
      </section>
    `;

    list = shadow.querySelector(".list");
    count = shadow.querySelector(".count");
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPanel);
  } else {
    initPanel();
  }

  // 监听来自 MAIN World (hook.js) 的消息
  window.addEventListener("message", async (event) => {
    if (event.source !== window || !event.data || event.data.source !== "DOLA_WATERMARK_EXT") {
      return;
    }

    if (event.data.type === "CHAIN_SINGLE_BODY") {
      const { platform, rawBody } = event.data;
      await processChainSingleBody(platform, rawBody);
    }
  });

  async function processChainSingleBody(platform, rawBody) {
    if (!rawBody || typeof rawBody !== "string") {
      return;
    }

    let json = null;
    try {
      json = JSON.parse(rawBody);
    } catch {
      json = parseLooseJson(rawBody);
    }

    const foundItems = [];
    const seenUrls = new Set();

    // 1. 提取所有无水印原图
    const imageUrls = findImageOriRawUrls(json || rawBody);
    for (const url of imageUrls) {
      if (isHttpUrl(url) && !seenUrls.has(url)) {
        seenUrls.add(url);
        foundItems.push({ type: "image", url });
      }
    }

    // 2. 提取 Dola 视频
    if (platform === "dola") {
      const videoUrls = findDolaEncodedVideoUrls(json || rawBody);
      for (const encoded of videoUrls) {
        const decoded = decodeBase64Url(encoded);
        if (isHttpUrl(decoded) && !seenUrls.has(decoded)) {
          seenUrls.add(decoded);
          foundItems.push({ type: "video", url: decoded });
        }
      }
    }

    // 3. 提取 豆包 视频
    if (platform === "doubao") {
      const fallbackApis = findDoubaoFallbackApis(json, rawBody);
      if (fallbackApis.length) {
        statusText = "正在解析豆包无水印视频...";
        render();

        try {
          const response = await new Promise((resolve) => {
            chrome.runtime.sendMessage(
              { type: "RESOLVE_DOUBAO_FALLBACKS", fallbackApis },
              (res) => resolve(res || { items: [] })
            );
          });
          if (response && Array.isArray(response.items)) {
            for (const item of response.items) {
              if (item && isHttpUrl(item.url) && !seenUrls.has(item.url)) {
                seenUrls.add(item.url);
                foundItems.push({ type: "video", url: item.url });
              }
            }
          }
        } catch (err) {
          console.warn("解析豆包视频失败:", err);
        }
      }
    }

    if (foundItems.length) {
      addItems(foundItems);
      statusText = "";
    } else if (!items.size) {
      statusText = "未提取到资源";
    }
    render();
  }

  function render() {
    if (!list || !count) return;

    count.textContent = String(items.size);
    list.textContent = "";

    if (!items.size) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = statusText || "等待捕获资源";
      list.appendChild(empty);
      return;
    }

    Array.from(items.values()).forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "item";

      const label = document.createElement("div");
      label.className = "label";
      label.title = item.url;

      const tag = document.createElement("span");
      tag.className = `tag ${item.type}`;
      tag.textContent = item.type === "image" ? "图片" : "视频";

      const indexText = document.createElement("span");
      indexText.textContent = String(index + 1);

      label.append(tag, indexText);

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "下载";
      button.addEventListener("click", () => {
        chrome.runtime.sendMessage({ type: "DOWNLOAD_MEDIA", url: item.url });
      });

      row.append(label, button);
      list.appendChild(row);
    });
  }

  function addItems(nextItems) {
    for (const item of nextItems) {
      if (!item || typeof item.url !== "string" || !isHttpUrl(item.url)) {
        continue;
      }
      items.set(item.url, {
        type: item.type === "image" ? "image" : "video",
        url: item.url
      });
    }
  }

  // -------------------------------------------------------------
  // 数据抽取辅助函数
  // -------------------------------------------------------------
  function findImageOriRawUrls(value) {
    const urls = [];
    walkJsonAndStrings(value, (node) => {
      if (node && typeof node === "object" && !Array.isArray(node)) {
        const image = node.image_ori_raw;
        if (image && typeof image === "object" && isHttpUrl(image.url)) {
          urls.push(image.url);
        }
      }
    });
    return urls;
  }

  function findDolaEncodedVideoUrls(value) {
    const values = [];
    for (const val of findValuesByKey(value, "man_url")) {
      values.push(val);
    }
    for (const val of findValuesByKey(value, "main_url")) {
      values.push(val);
    }
    return values;
  }

  function findDoubaoFallbackApis(json, rawBody) {
    const apis = new Set();
    if (json) {
      for (const value of findValuesByKey(json, "fallback_api")) {
        addFallbackApi(apis, value);
      }
    }
    if (typeof rawBody === "string") {
      const patterns = [
        /fallback_api\\":\\"(.*?)\\"/g,
        /"fallback_api"\s*:\s*"([^"]+)"/g
      ];
      for (const pattern of patterns) {
        let match = pattern.exec(rawBody);
        while (match) {
          addFallbackApi(apis, decodeJsonEscapedFragment(match[1]));
          match = pattern.exec(rawBody);
        }
      }
    }
    return Array.from(apis);
  }

  function addFallbackApi(apis, value) {
    if (typeof value !== "string" || !value) {
      return;
    }
    const url = decodeJsonEscapedFragment(value);
    if (isHttpUrl(url)) {
      apis.add(url);
    }
  }

  function decodeJsonEscapedFragment(value) {
    let text = value;
    for (let index = 0; index < 3; index += 1) {
      try {
        const decoded = JSON.parse(`"${text.replace(/"/g, '\\"')}"`);
        if (decoded === text) {
          break;
        }
        text = decoded;
      } catch {
        break;
      }
    }
    return text.replace(/\\u0026/g, "&").replace(/\\\//g, "/");
  }

  function findValuesByKey(value, targetKey) {
    const values = [];
    walkJsonAndStrings(value, (node) => {
      if (!node || typeof node !== "object" || Array.isArray(node)) {
        return;
      }
      if (Object.prototype.hasOwnProperty.call(node, targetKey)) {
        values.push(node[targetKey]);
      }
    });
    return values;
  }

  function walkJsonAndStrings(value, visitor, seen = new Set()) {
    if (value == null) {
      return;
    }

    if (typeof value === "string") {
      const parsed = parseJsonString(value);
      if (parsed !== null) {
        walkJsonAndStrings(parsed, visitor, seen);
      }
      return;
    }

    if (typeof value !== "object" || seen.has(value)) {
      return;
    }

    seen.add(value);
    visitor(value);

    if (Array.isArray(value)) {
      for (const item of value) {
        walkJsonAndStrings(item, visitor, seen);
      }
      return;
    }

    for (const key of Object.keys(value)) {
      walkJsonAndStrings(value[key], visitor, seen);
    }
  }

  function parseJsonString(text) {
    const trimmed = text.trim();
    if (!trimmed || (!trimmed.startsWith("{") && !trimmed.startsWith("["))) {
      return null;
    }
    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  }

  function parseLooseJson(text) {
    if (typeof text !== "string") return null;
    const lines = text.split("\n");
    const collected = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const clean = trimmed.startsWith("data:") ? trimmed.slice(5).trim() : trimmed;
      try {
        collected.push(JSON.parse(clean));
      } catch {}
    }
    return collected.length ? collected : null;
  }

  function decodeBase64Url(value) {
    if (typeof value !== "string" || !value) {
      return "";
    }
    if (isHttpUrl(value)) {
      return value;
    }
    try {
      const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
      const binary = atob(padded);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const decoded = new TextDecoder().decode(bytes);
      return isHttpUrl(decoded) ? decoded : "";
    } catch {
      return "";
    }
  }

  function isHttpUrl(url) {
    return typeof url === "string" && /^https?:\/\//i.test(url);
  }
})();
