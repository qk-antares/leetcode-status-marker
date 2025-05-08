// ==UserScript==
// @name         LeetCode 灵神题单状态标记
// @namespace    https://github.com/qk-antares
// @version      0.2
// @description  请求用户所有题目的状态，匹配HTML页面上相应的题目超链接进行展示，适用于灵神的讨论帖题单场景（也可用于其他题单）
// @author       qk-antares
// @match        https://leetcode.cn/discuss/post/*
// @grant        GM_xmlhttpRequest
// @connect      leetcode.cn
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzQ2NjcxNzM5NTU1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY3MDIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTEwMjEuMDUgOTE0LjU5TDY1NC4yMSAxMTkuNzdBOTYuMjcgOTYuMjcgMCAwIDAgNTY3LjA1IDY0SDQ4MGEzMiAzMiAwIDAgMC0yOSAxOC41OWwtMzg0IDgzMkEzMiAzMiAwIDAgMCA5NiA5NjBoMjE1LjA1YTk2LjI3IDk2LjI3IDAgMCAwIDg3LjE2LTU1Ljc3bDQxLTg4Ljg0IDI1NS40NSAxMjcuNzJBMTYwLjg0IDE2MC44NCAwIDAgMCA3NjYuMjIgOTYwSDk5MmEzMiAzMiAwIDAgMCAyOS00NS40MXogbS02ODAuOTQtMzcuMThBMzIuMTEgMzIuMTEgMCAwIDEgMzExLjA1IDg5NkgyNzRsNjEuMjEtMTMyLjYxTDM4MiA3ODYuNzV6IG0zODMuMTcgOC40NUw0MzguNDEgNzQzLjQzbC0wLjE2LTAuMDgtMTAzLjc3LTUxLjg5LTAuODEtMC4zOWEzMS44MyAzMS44MyAwIDAgMC0yNC0xLjM3aC0wLjA1YTMxLjg0IDMxLjg0IDAgMCAwLTE4LjUzIDE2LjU5Yy0wLjA2IDAuMTItMC4xMiAwLjI1LTAuMTcgMC4zN0wyMDMuNTMgODk2SDE0NmwzNTQuNDctNzY4SDU1OEwzMzkgNjAyLjU5Yy0wLjA1IDAuMDktMC4wOCAwLjE4LTAuMTIgMC4yN2EzMiAzMiAwIDAgMCAxNC44NiA0MS43NmwyOTEuMiAxNDUuNmEzMiAzMiAwIDAgMCA0NS45MS0zMy42M2MxLTAuNDYgMC4yMi0yLjQtMi41NS04LjRMNTc5LjI0IDUxMiA2MDggNDQ5LjcgODE0IDg5NmgtNDcuNzhhOTYuNDEgOTYuNDEgMCAwIDEtNDIuOTQtMTAuMTR6TTU0NCA1ODguMzZsNDcuOTIgMTAzLjgyLTc3Ljg3LTM4Ljkzek04ODQuNDcgODk2TDYzNy4wNSAzNTkuOTJhMzIgMzIgMCAwIDAtNTgtMC4ybC0wLjEgMC4yLTEyMi4xNyAyNjQuNjktNDYuNzMtMjMuMzZMNjA4IDE3Mi4zNiA5NDIgODk2eiIgZmlsbD0iI0ZGN0E1OCIgcC1pZD0iNjcwMyI+PC9wYXRoPjwvc3ZnPg==
// @license      MIT
// @downloadURL  https://update.greasyfork.org/scripts/535287/LeetCode%20%E7%81%B5%E7%A5%9E%E9%A2%98%E5%8D%95%E7%8A%B6%E6%80%81%E6%A0%87%E8%AE%B0.user.js
// @updateURL    https://update.greasyfork.org/scripts/535287/LeetCode%20%E7%81%B5%E7%A5%9E%E9%A2%98%E5%8D%95%E7%8A%B6%E6%80%81%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("🚀 [题单状态标记] 脚本启动");

    function fetchAllProblemStatuses() {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://leetcode.cn/api/problems/all/",
                onload: function (res) {
                    try {
                        const json = JSON.parse(res.responseText);
                        const map = new Map();
                        json.stat_status_pairs.forEach(item => {
                            const slug = item.stat.question__title_slug;
                            const status = item.status; // "ac", "notac", or null
                            map.set(slug, status);
                        });
                        console.log(`✅ 共获取 ${map.size} 道题目的状态`);
                        resolve(map);
                    } catch (e) {
                        console.error("❌ 解析题目状态失败", e);
                        resolve(new Map());
                    }
                },
                onerror: function (err) {
                    console.error("❌ 请求题目状态失败", err);
                    resolve(new Map());
                }
            });
        });
    }

    function getStatusIcon(status) {
        switch (status) {
            case 'ac': return '✅';
            case 'notac': return '❌';
            case null: return '🕓';
            default: return '❓';
        }
    }

    function updatePageWithStatus(map) {
        const links = document.querySelectorAll("ul li > a[href*='/problems/']");
        console.log(`🔍 开始处理 ${links.length} 个题目超链接`);
        links.forEach(link => {
            const match = link.href.match(/problems\/([^/]+)\//);
            if (!match) return;

            const slug = match[1];
            const status = map.get(slug) ?? null;
            const icon = getStatusIcon(status);

            const span = document.createElement('span');
            span.textContent = icon + ' ';
            link.parentNode.insertBefore(span, link);
        });
    }

    // 启动
    fetchAllProblemStatuses().then(statusMap => {
        updatePageWithStatus(statusMap);
    });
})();
