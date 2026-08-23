// hook.js - 运行在网页原生上下文 (MAIN World) 的底层拦截器
(function () {
  if (window.__DOLA_HOOK_INJECTED__) {
    return;
  }
  window.__DOLA_HOOK_INJECTED__ = true;

  const DOUBAO_SKILL_PACK_DATA = {
  "code": 0,
  "msg": "",
  "data": {
    "deep_search": {
      "template": {}
    },
    "video_generation": {
      "meta": {
        "title": "视频生成",
        "desc": "自由运镜，图片文字一键成片",
        "option_list": [
          {
            "type": 3,
            "value": "duration",
            "show_name": "",
            "options": [
              {
                "show_name": "5s",
                "value": "5",
                "is_default": false,
                "sub_display": ""
              },
              {
                "show_name": "10s",
                "value": "10",
                "is_default": true,
                "sub_display": ""
              },
              {
                "show_name": "30s",
                "value": "30",
                "is_default": false,
                "sub_display": ""
              }
            ]
          },
          {
            "type": 3,
            "value": "model",
            "show_name": "",
            "options": [
              {
                "show_name": "Seedance2.0",
                "value": "seedance_v2.0_std",
                "is_default": false,
                "after_key": "https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/samantha/creation/member_badge_enhanced.svg",
                "sub_display": "",
                "icon_url": "https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/samantha/creation/member_badge_enhanced.svg",
                "subscription_tag": "none"
              },
              {
                "show_name": "Seedance2.0Fast",
                "value": "seedance_v2.0",
                "is_default": false,
                "sub_display": "",
                "subscription_tag": "none"
              },
              {
                "show_name": "Seedance2.0Mini",
                "value": "seedance_v2.0_mini",
                "is_default": true,
                "sub_display": "",
                "subscription_tag": "none"
              }
            ]
          },
          {
            "type": 3,
            "value": "movement",
            "show_name": "",
            "options": [
              {
                "show_name": "固定镜头",
                "value": "固定镜头",
                "is_default": false,
                "sub_display": ""
              },
              {
                "show_name": "镜头环绕",
                "value": "镜头环绕${cameraMove_panAround_subject}拍摄",
                "is_default": false,
                "sub_display": ""
              },
              {
                "show_name": "镜头移动",
                "value": "镜头往${cameraMove_moveTowards_direction}移动",
                "is_default": false,
                "sub_display": ""
              },
              {
                "show_name": "镜头变焦",
                "value": "镜头聚焦在${cameraMove_focusOn_subject}",
                "is_default": false,
                "sub_display": ""
              }
            ]
          },
          {
            "type": 1,
            "value": "shot_newShot_desc",
            "show_name": "",
            "placeholder": {
              "placeholder": "[描述下一幕的画面]",
              "default_text": ""
            }
          },
          {
            "type": 1,
            "value": "story_board",
            "show_name": "",
            "placeholder": {
              "placeholder": "镜头切换，${shot_newShot_desc}",
              "default_text": ""
            }
          },
          {
            "type": 1,
            "value": "cameraMove_moveTowards_direction",
            "show_name": "",
            "placeholder": {
              "placeholder": "[方向]",
              "default_text": ""
            }
          },
          {
            "type": 1,
            "value": "cameraMove_panAround_subject",
            "show_name": "",
            "placeholder": {
              "placeholder": "[主体]",
              "default_text": ""
            }
          },
          {
            "type": 3,
            "value": "ratio",
            "show_name": "",
            "options": [
              {
                "show_name": "1:1",
                "value": "1:1",
                "is_default": true,
                "sub_display": ""
              },
              {
                "show_name": "3:4",
                "value": "3:4",
                "is_default": false,
                "sub_display": ""
              },
              {
                "show_name": "4:3",
                "value": "4:3",
                "is_default": false,
                "sub_display": ""
              },
              {
                "show_name": "9:16",
                "value": "9:16",
                "is_default": false,
                "sub_display": ""
              },
              {
                "show_name": "16:9",
                "value": "16:9",
                "is_default": false,
                "sub_display": ""
              },
              {
                "show_name": "21:9",
                "value": "21:9",
                "is_default": false,
                "sub_display": ""
              }
            ]
          },
          {
            "type": 1,
            "value": "cameraMove_focusOn_subject",
            "show_name": "",
            "placeholder": {
              "placeholder": "[主体]",
              "default_text": ""
            }
          }
        ],
        "model_capability": {
          "seedance_v2.0": {
            "supported_durations": [
              "5",
              "10",
              "30"
            ],
            "supported_resolutions": [
              "720p"
            ],
            "support_video_ref": false
          },
          "seedance_v2.0_mini": {
            "supported_durations": [
              "5",
              "10",
              "30"
            ],
            "supported_resolutions": [
              "720p"
            ],
            "support_video_ref": false
          },
          "seedance_v2.0_std": {
            "supported_durations": [
              "5",
              "10",
              "30"
            ],
            "supported_resolutions": [
              "720p"
            ],
            "support_video_ref": false
          }
        }
      },
      "template": {
        "item_list": []
      }
    }
  }
};
  const DOLA_SKILL_PACK_DATA = {
  "code": 0,
  "msg": "",
  "data": {
    "deep_search": {
      "template": {}
    },
    "video_generation": {
      "meta": {
        "title": "视频生成",
        "desc": "自由运镜，图片文字一键成片",
        "option_list": [
          {
            "type": 3,
            "value": "ratio",
            "show_name": "",
            "options": [
              {
                "show_name": "1:1",
                "value": "1:1",
                "is_default": true,
                "sub_display": ""
              },
              {
                "show_name": "3:4",
                "value": "3:4",
                "is_default": false,
                "sub_display": ""
              },
              {
                "show_name": "4:3",
                "value": "4:3",
                "is_default": false,
                "sub_display": ""
              },
              {
                "show_name": "9:16",
                "value": "9:16",
                "is_default": false,
                "sub_display": ""
              },
              {
                "show_name": "16:9",
                "value": "16:9",
                "is_default": false,
                "sub_display": ""
              },
              {
                "show_name": "21:9",
                "value": "21:9",
                "is_default": false,
                "sub_display": ""
              }
            ]
          },
          {
            "type": 3,
            "value": "duration",
            "show_name": "",
            "options": [
              {
                "show_name": "5s",
                "value": "5",
                "is_default": false,
                "sub_display": ""
              },
              {
                "show_name": "10s",
                "value": "10",
                "is_default": true,
                "sub_display": ""
              },
              {
                "show_name": "30s",
                "value": "30",
                "is_default": false,
                "sub_display": ""
              }
            ]
          },
          {
            "type": 3,
            "value": "model",
            "show_name": "",
            "options": [
              {
                "show_name": "Seedance2.0Fast",
                "value": "seedance_v2.0",
                "is_default": true,
                "sub_display": "DreaminaSeedance2.0",
                "subscription_tag": "none"
              },
              {
                "show_name": "Seedance1.0Fast",
                "value": "ic_mini",
                "is_default": false,
                "sub_display": "DreaminaSeedance1.0Fast",
                "subscription_tag": "none"
              }
            ]
          }
        ],
        "model_capability": {
          "ic_mini": {
            "supported_durations": [
              "5",
              "10",
              "30"
            ],
            "supported_resolutions": [
              "720p"
            ],
            "support_video_ref": false
          },
          "seedance_v2.0": {
            "supported_durations": [
              "5",
              "10",
              "30"
            ],
            "supported_resolutions": [
              "720p"
            ],
            "support_video_ref": false
          }
        }
      }
    }
  }
};

  console.log("[Dola助手] 网络拦截器 (MAIN World) 已就绪");

  // -------------------------------------------------------------
  // 1. URL 规范化与匹配工具函数
  // -------------------------------------------------------------
  function matchUrl(rawInput, pattern) {
    if (!rawInput) return false;
    const rawStr = typeof rawInput === "string" ? rawInput : (rawInput.url || rawInput.href || String(rawInput || ""));
    if (rawStr.includes(pattern)) return true;
    try {
      const absUrl = new URL(rawStr, window.location.origin).href;
      return absUrl.includes(pattern);
    } catch {
      return false;
    }
  }

  // -------------------------------------------------------------
  // 2. 强大的通用 30s 时长与模型注入函数
  // -------------------------------------------------------------
  function patchAnyDuration(value, seen = new Set()) {
    if (value == null || typeof value !== "object" || seen.has(value)) {
      return false;
    }
    seen.add(value);
    let changed = false;

    if (Array.isArray(value)) {
      for (const item of value) {
        changed = patchAnyDuration(item, seen) || changed;
      }
      return changed;
    }

    // 针对 option_list 的时长项（Action Bar 及各类配置）
    const label = String(value.label || value.name || value.title || value.show_name || value.value || "");
    const isDuration = label.includes("时长") || label.includes("鏃堕暱") || label.toLowerCase().includes("duration");

    if (Array.isArray(value.option_list)) {
      const hasDurationLikeOptions = isDuration || value.option_list.some((opt) =>
        opt && (String(opt.option_key) === "5" || String(opt.option_key) === "10" || String(opt.display_text || "").toLowerCase().includes("5s"))
      );
      if (hasDurationLikeOptions) {
        const has30 = value.option_list.some((opt) =>
          opt && (String(opt.option_key) === "30" || String(opt.value) === "30" || String(opt.display_text) === "30s")
        );
        if (!has30) {
          const maxId = value.option_list.reduce((max, opt) => {
            const id = Number(opt?.id);
            return Number.isFinite(id) ? Math.max(max, id) : max;
          }, 0);
          const tenIndex = value.option_list.findIndex((opt) => opt && (String(opt.option_key) === "10" || String(opt.value) === "10"));
          const insertIdx = tenIndex >= 0 ? tenIndex + 1 : value.option_list.length;
          value.option_list.splice(insertIdx, 0, {
            id: maxId + 1,
            display_text: "30s",
            show_name: "30s",
            message_text: "",
            option_key: "30",
            value: "30",
            is_default: false,
            sub_display: ""
          });
          changed = true;
        }
      }
    }

    // 针对 options 数组的时长项
    if (Array.isArray(value.options)) {
      const hasDurationLikeOptions = isDuration || value.options.some((opt) =>
        opt && (String(opt.value) === "5" || String(opt.value) === "10" || String(opt.show_name || "").toLowerCase().includes("5s"))
      );
      if (hasDurationLikeOptions) {
        const has30 = value.options.some((opt) =>
          opt && (String(opt.value) === "30" || String(opt.option_key) === "30" || String(opt.show_name) === "30s")
        );
        if (!has30) {
          const tenIndex = value.options.findIndex((opt) => opt && (String(opt.value) === "10" || String(opt.option_key) === "10"));
          const insertIdx = tenIndex >= 0 ? tenIndex + 1 : value.options.length;
          value.options.splice(insertIdx, 0, {
            show_name: "30s",
            display_text: "30s",
            value: "30",
            option_key: "30",
            is_default: false,
            sub_display: ""
          });
          changed = true;
        }
      }
    }

    // 针对 supported_durations（模型支持列表）
    if (Array.isArray(value.supported_durations)) {
      if (!value.supported_durations.includes("30") && !value.supported_durations.includes(30)) {
        value.supported_durations.push("30");
        changed = true;
      }
    }

    // 递归遍历子对象及嵌套的 JSON 字符串
    for (const key of Object.keys(value)) {
      const child = value[key];
      if (typeof child === "string") {
        const trimmed = child.trim();
        if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
          try {
            const parsed = JSON.parse(trimmed);
            if (patchAnyDuration(parsed, seen)) {
              value[key] = JSON.stringify(parsed);
              changed = true;
            }
          } catch {}
        }
      } else {
        changed = patchAnyDuration(child, seen) || changed;
      }
    }

    return changed;
  }

  function patchResponseText(rawText) {
    if (!rawText || typeof rawText !== "string") return rawText;
    try {
      const json = JSON.parse(rawText);
      const changed = patchAnyDuration(json);
      return changed ? JSON.stringify(json) : rawText;
    } catch {
      return rawText;
    }
  }

  // -------------------------------------------------------------
  // 3. 异步读取流式响应并通知 content-panel.js
  // -------------------------------------------------------------
  async function handleChainSingleStream(clonedResponse, platform) {
    try {
      if (clonedResponse.body && typeof clonedResponse.body.getReader === "function") {
        const reader = clonedResponse.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          accumulatedText += decoder.decode(value, { stream: true });
        }
        accumulatedText += decoder.decode();

        window.postMessage({
          source: "DOLA_WATERMARK_EXT",
          type: "CHAIN_SINGLE_BODY",
          platform,
          rawBody: accumulatedText
        }, "*");
      } else {
        const text = await clonedResponse.text();
        window.postMessage({
          source: "DOLA_WATERMARK_EXT",
          type: "CHAIN_SINGLE_BODY",
          platform,
          rawBody: text
        }, "*");
      }
    } catch (error) {
      console.warn("[Dola助手] 读取生成响应失败:", error);
    }
  }

  // -------------------------------------------------------------
  // 4. 重写原生 window.fetch
  // -------------------------------------------------------------
  const originalFetch = window.fetch;
  window.fetch = async function (input, init) {
    const method = (init && init.method ? init.method : (input && input.method ? input.method : "GET")).toUpperCase();
    const isDola = window.location.hostname.includes("dola.com") || matchUrl(input, "dola.com");

    // 1. 拦截 samantha/skill/pack (直接返回包含 30s 和扩展模型的完整技能包)
    if (matchUrl(input, "samantha/skill/pack") || matchUrl(input, "skill/pack")) {
      if (method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          statusText: "No Content",
          headers: new Headers({
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, POST, OPTIONS",
            "access-control-allow-headers": "*"
          })
        });
      }
      const packData = isDola ? DOLA_SKILL_PACK_DATA : DOUBAO_SKILL_PACK_DATA;
      return new Response(JSON.stringify(packData), {
        status: 200,
        statusText: "OK",
        headers: new Headers({
          "content-type": "application/json; charset=utf-8",
          "access-control-allow-origin": "*"
        })
      });
    }

    // 2. 拦截 Action Bar / Slot / Item Conf 配置接口 (动态注入 30s 选项)
    if (
      matchUrl(input, "action_bar_v3/get_item_conf") ||
      matchUrl(input, "get_item_conf") ||
      matchUrl(input, "slot/action_bar") ||
      matchUrl(input, "samantha/creation")
    ) {
      const response = await originalFetch.apply(this, arguments);
      try {
        const rawText = await response.text();
        const patchedText = patchResponseText(rawText);
        return new Response(patchedText, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } catch (err) {
        console.warn("[Dola助手] 配置注入失败:", err);
        return response;
      }
    }

    // 3. 拦截生成流式接口 /im/chain/single
    if (matchUrl(input, "im/chain/single") || matchUrl(input, "chain/single")) {
      const platform = isDola ? "dola" : "doubao";
      const response = await originalFetch.apply(this, arguments);
      try {
        const clone = response.clone();
        handleChainSingleStream(clone, platform);
      } catch (err) {
        console.warn("[Dola助手] 克隆生成响应失败:", err);
      }
      return response;
    }

    return originalFetch.apply(this, arguments);
  };

  // -------------------------------------------------------------
  // 5. 重写原生 window.XMLHttpRequest
  // -------------------------------------------------------------
  const OriginalXHR = window.XMLHttpRequest;
  function HookedXHR() {
    const xhr = new OriginalXHR();
    let requestUrl = "";
    let requestMethod = "GET";

    const originalOpen = xhr.open;
    xhr.open = function (method, url) {
      requestMethod = (method || "GET").toUpperCase();
      requestUrl = typeof url === "string" ? url : String(url || "");
      return originalOpen.apply(xhr, arguments);
    };

    const originalSend = xhr.send;
    xhr.send = function (body) {
      const isDola = window.location.hostname.includes("dola.com") || matchUrl(requestUrl, "dola.com");

      if (matchUrl(requestUrl, "samantha/skill/pack") || matchUrl(requestUrl, "skill/pack")) {
        const packData = isDola ? DOLA_SKILL_PACK_DATA : DOUBAO_SKILL_PACK_DATA;
        setTimeout(() => {
          try {
            Object.defineProperty(xhr, "readyState", { value: 4, writable: true, configurable: true });
            Object.defineProperty(xhr, "status", { value: 200, writable: true, configurable: true });
            Object.defineProperty(xhr, "statusText", { value: "OK", writable: true, configurable: true });
            Object.defineProperty(xhr, "responseText", { value: JSON.stringify(packData), writable: true, configurable: true });
            Object.defineProperty(xhr, "response", { value: JSON.stringify(packData), writable: true, configurable: true });
            if (typeof xhr.onreadystatechange === "function") xhr.onreadystatechange();
            if (typeof xhr.onload === "function") xhr.onload();
          } catch (e) {}
        }, 0);
        return;
      }

      xhr.addEventListener("load", function () {
        try {
          if (
            matchUrl(requestUrl, "action_bar_v3/get_item_conf") ||
            matchUrl(requestUrl, "get_item_conf") ||
            matchUrl(requestUrl, "slot/action_bar") ||
            matchUrl(requestUrl, "samantha/creation")
          ) {
            const patched = patchResponseText(xhr.responseText);
            Object.defineProperty(xhr, "responseText", { value: patched, configurable: true });
            Object.defineProperty(xhr, "response", { value: patched, configurable: true });
          } else if (matchUrl(requestUrl, "im/chain/single") || matchUrl(requestUrl, "chain/single")) {
            const platform = isDola ? "dola" : "doubao";
            window.postMessage({
              source: "DOLA_WATERMARK_EXT",
              type: "CHAIN_SINGLE_BODY",
              platform,
              rawBody: xhr.responseText
            }, "*");
          }
        } catch (e) {}
      });

      return originalSend.apply(xhr, arguments);
    };

    return xhr;
  }

  HookedXHR.prototype = OriginalXHR.prototype;
  window.XMLHttpRequest = HookedXHR;

})();
