# 如果你是ta · GitHub Pages 测试版

12 种随机职业、姓名、开局资产、生活重心、婚育、理财、逐条事件和图文结局。无需安装依赖。

`site/` 是可直接托管的静态网页。GitHub Pages 由 `.github/workflows/pages.yml` 发布。

首次启用：仓库 Settings → Pages → Source 选择 GitHub Actions，然后在 Actions 运行 Deploy game to GitHub Pages。仓库默认分支为 main。

测试版不启用全站玩家人数统计，也不会向原站点发送统计请求。存档保存在当前浏览器；新域名不会自动读取原站点存档，可在原站点导出后导入。不要清除浏览器数据，或及时导出备份。

分享链接和二维码会使用当前托管地址。GitHub Pages 的中国大陆可达性需要实际网络测试，本版本不保证所有地区均可访问。

本地预览：`python -m http.server 5183 --directory site`，浏览器打开 `http://127.0.0.1:5183`。

保留的 `site/vendor/qrcode.js` 包含其 MIT 许可。`scripts/prepare-site.mjs` 可从原站点 dist 重新生成静态版，排除服务端输出和托管配置。

## 项目策划与设计文档

[查看文档目录](docs/README.md)：产品方向、进程事件策划、站点设计、决策记录、Word/PDF及历史资料。新方向《再来一次》尚未实施，当前site/仍为《如果你是ta》成年职业测试版。
