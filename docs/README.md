# 《再来一次》项目文档

更新：2026-10-30。这里存放方案、事件制作资料、历史记录和可下载阅读版。

**新版入口为《再来一次》S1（6～18岁）；旧成年职业版本保留在 old.html。完整人生方案尚未全部实现。**

[查看逐项实现状态](implementation-status.md) · [S1可玩切片策划](s1-playable-slice.md) 文档里的“建议默认值”“待定参数”没有自动成为开发要求。

## 当前文档与阅读顺序

| 顺序 | 文档 | 状态 | 主要内容 |
| --- | --- | --- | --- |
| 1 | [产品方向与回响定义](product-direction.md) | v0.5 设计稿 | 从童年开始、出身三选一、无评分回顾；早年选择多年后产生实际影响 |
| 2 | [游戏进程与事件策划](game-progress-events.md) | v1.0 内容制作稿 | 年龄进程、46张关键事件卡、10条回响链、8类宏观环境、50条日常 |
| 3 | [站点设计](site-design.md) | v1.0 页面设计稿 | 页面、面板、时间控制、理财表单、回顾分享和异常处理 |
| 4 | [决策记录](decisions.md) | 持续维护 | 区分用户明确方向、建议与线上实现 |
| 5 | [事件制作数据](data/README.md) | 设计数据 | 策划卡，不直接作为当前线上运行数据 |

## 阅读与批注文件

| 文档 | Word | PDF |
| --- | --- | --- |
| 产品方向 | [下载](exports/product-direction-v0.5.docx) | [阅读](exports/product-direction-v0.5.pdf) |
| 进程与事件 | [下载](exports/game-progress-events-v1.0.docx) | [阅读](exports/game-progress-events-v1.0.pdf) |
| 站点设计 | [下载](exports/site-design-v1.0.docx) | [阅读](exports/site-design-v1.0.pdf) |

## 维护约定

- 当前源文件名固定，用 Git 提交记录保存修改历史；大版本被替代后才放入 archive。
- Markdown 是正式维护源；Word 接收批注，PDF 用于阅读。批注确认后须同步回源文档，再更新对应导出文件。
- 本次归档的导出文件对应归档源内容（Markdown额外包含状态说明）；暂不声明已经建立自动导出流水线。
- 用户明确的新决定优先于旧稿；文档相互矛盾时写入决策记录并澄清，不静默选择。
- 每次实现时同步注明已完成的条目与限制，不能把整个设计稿直接标为“已上线”。
- 本仓库公开，文档也公开。不要提交令牌、密码、实名玩家信息或其他不适合公开的资料。
- GitHub Pages 仅发布 site/，docs/ 不打包进站点，但仍能从公开仓库读取。

## 历史资料

- [用户提供的v0.3设计原稿](archive/v0.3-user-source/user-design-v0.3.docx)：方向来源，保持原件。
- [成年职业版本内容快照](archive/2026-10-29-current-site/current-game-snapshot.md)：2026-10-29整理，含当时83个事件，不是新版事件清单。
- [最初v0.4整合稿](archive/v0.4-direction/original-title-direction-v0.4.md)：当时仍称《如果你是ta》。
- [更名后的v0.4整合稿](archive/v0.4-direction/renamed-direction-v0.4.md)：已由v0.5回响修订稿替代。

仅归档项目资料，没有更改仓库可见性、站点玩法或既有存档。
