# 再来一次 · 完整可玩版

从记事的那年开始，过一段不同的人生。

https://mgdgs.github.io/if-you-were-ta/

从6岁到生命终点，经历学习、工作、经营、相处、婚育、照护、住房、理财、退休与回望。8个出身中选一个，早年的选择与真实积累在多年后改变条件。

不评人生总分，不授予称号，不展示未选路线。最终回顾呈现真实经历、记录得到的时间安排和重要的人，玩家选择片段分享。

进度自动保存在浏览器，无需数据导出。清除站点数据或更换设备不会自动同步，请留意保存状态。原S1进度可接入成年；`s1.html`保留旧阶段页面，`old.html`保留成人职业旧版。

[文档目录](docs/README.md) · [具体实现与模型边界](docs/implementation-status.md)

本地：`python -m http.server 5187 --directory site`。

验证：`node tests/full-engine.mjs`；浏览器：`node tests/full-browser.cjs`（Playwright、Chromium和5187预览）。

GitHub Pages发布site/；docs/不打包到网页，但公开仓库里的文档仍可读取。GitHub版不运行人数统计，原站使用既有计数服务。不承诺任何托管在所有地区可达。
