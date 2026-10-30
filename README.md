# 再来一次 · S1可玩切片

从记事的那年开始，过一段不同的人生。

测试地址：https://mgdgs.github.io/if-you-were-ta/

新版从6岁开始，在三种出身中选择一处；日常逐条推进，重大选择暂停。真实的练习与联系，会改变多年后可参与和协商的条件。18岁时确认下一段方向并保存阶段记录。

**19岁后的内容尚未开放，这不是完整一生。** 当前没有成年理财、工资、婚育与最终结局称号。旧版成人游戏从网页底部或 `old.html` 进入，原有存档保留。

[项目文档](docs/README.md) · [S1设计](docs/s1-playable-slice.md) · [逐项实现状态](docs/implementation-status.md)

## 本地运行与验证

无需安装依赖。`python -m http.server 5186 --directory site`。

引擎检查：`node tests/s1-engine.mjs`。

浏览器检查：`node tests/s1-browser.cjs`（使用环境中的Playwright与Chromium，预览端口5186）。

GitHub Pages由`.github/workflows/pages.yml`发布`site/`。网站无外部字体依赖。浏览器本地保存进度；换域名或设备前导出JSON再导入。GitHub版不启用玩家人数统计，不能承诺中国大陆所有网络均可访问。

`docs/`在公开仓库可读，但不打包进Pages。不要提交密码、令牌、玩家身份资料或不适合公开的内容。
