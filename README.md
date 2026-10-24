# QueryPath

[English](#english) · [简体中文](#简体中文)

## English

QueryPath is a browser-based SQL learning studio for Cambridge IGCSE Computer Science 0478 (2026–2028) and AS & A Level Computer Science 9618 (2026 and 2027–2029). Exam knowledge is the learning path: write queries, run them against real data, inspect the results, and practise the skills used in written examinations.

The interface and explanations are primarily in Simplified Chinese, with English exercise prompts and SQL. The responsive layout supports desktop, phone, and tablet browsers. Open the app and start learning.

### What you can do

- Follow 16 lessons and complete 49 original exercises: 22 IG and 27 AS tasks, covering SQL writing, output prediction, and database concepts.
- Run SQL against three datasets: school clubs, a book catalogue, and customer orders. Explore freely in the SQL lab, inspect tables, export results as CSV, and reset the database.
- Check answers, reveal progressive hints and explained solutions, bookmark tasks, and revisit incorrect attempts. Query answers are checked by results; data maintenance and schema tasks are checked by the resulting database state. Selected queries also use additional test data.
- Take a 15-minute practice challenge. Answers and the deadline survive a page refresh.
- Keep drafts, progress, and lab data in your browser; transfer learning records through JSON backups. Use light or dark mode, keyboard shortcuts, and offline learning where supported.

### Use online

**[Open QueryPath](https://ash19900601.github.io/SQLsimulator/)** to start learning directly in your browser.

### Start locally

Install **Node.js 22 or later**. With access to this repository, download its source or clone it:

```sh
git clone https://github.com/ASH19900601/SQLsimulator.git
cd SQLsimulator
npm start
```

Open **http://localhost:4173** in your browser. On Windows, you can also double-click [启动学习器.cmd](启动学习器.cmd) inside the project folder. Keep the terminal window open while using the server; press `Ctrl+C` to stop it.

The SQL engine is included in `public/vendor/`, so you can start the application directly with `npm start`. Development and test dependencies are installed separately as described below.

#### Connect a phone or iPad

1. Connect the computer and mobile device to the same Wi-Fi network.
2. Start the server on the computer.
3. Open the network address printed by the server that matches the computer's Wi-Fi interface. It has the form `http://<computer-address>:4173`.

Keep the computer running and allow the connection through its firewall. Use the computer's network address on your mobile device.

#### Offline use and installation

Service Worker caching works over **HTTPS or localhost**. Once the “离线学习已就绪” (“Offline learning is ready”) indicator appears, cached core lessons and SQL execution are available offline. Open external syllabus and past-paper links while connected to the internet.

The local server provides HTTP for online use across your LAN. For PWA installation, use your browser's installation menu. On iPad, open an HTTPS deployment in Safari and choose **Share → Add to Home Screen**.

### Learning and exam scope

| Mode | Coverage |
| --- | --- |
| IG — 0478 | Single-table queries with `SELECT`, `FROM`, `WHERE`, `ORDER BY`, `SUM`, `COUNT`, `AND`, and `OR`; fields, records, types, and primary keys. |
| AS / full A Level — 9618 | Queries involving at most two tables, joins, grouping, aggregates, `INSERT INTO`, `UPDATE`, `DELETE FROM`, `CREATE DATABASE`, `CREATE TABLE`, `ALTER TABLE`, and primary/foreign keys. |

SQL is part of the AS foundation within the full A Level qualification. The selected syllabus windows define the main scope, with past-paper examples illustrating syntax and accepted alternatives.

The research records cover **21 IG Paper 2 question papers and their mark schemes**, plus **20 AS Paper 1 papers with distinct SQL question content and their mark schemes**. Entries include source links, question numbers, page references, and syntax observations.

- [Syllabus scope and primary sources](docs/research/syllabus-scope.md)
- [IG paper-by-paper audit](docs/research/ig-paper-audit.md)
- [AS paper-by-paper audit](docs/research/as-paper-audit.md)

QueryPath provides original exercises and immediate feedback to support independent study.

### SQL execution and learning records

- SQL runs locally through **sql.js / SQLite**, with compatibility handling for CAIE syntax.
- Each exercise run starts from its original dataset. In the free lab, changes persist locally. `CREATE DATABASE` enters a new empty sandbox; resetting restores the sample data.
- Revealing a reference answer marks subsequent completion of that task as assisted. Hints guide you through solving the task. Query checking considers column order and values, and checks row order when the task requires sorting.
- Records are stored in the current browser for the current site address. Export a JSON backup from the progress page to transfer records between browsers or devices. Imports merge progress and bookmarks while retaining current drafts and lab data.

### Tests and compatibility

Install test dependencies and run the automated suite:

```sh
npm ci
npm test
```

For browser checks, keep `npm start` running on port 4173 in another terminal. The default test command uses an installed Microsoft Edge:

```sh
npm run test:ui
```

To use Playwright WebKit in PowerShell:

```powershell
npx playwright install webkit
$env:BROWSER_ENGINE = 'webkit'
npm run test:ui
Remove-Item Env:BROWSER_ENGINE
```

The recorded validation covers 104 passing unit/integration tests and 29 passing browser checks in each of Edge and Playwright WebKit. Layout checks include 360/390 px phones, 768/1024 px tablets, and 1440 px desktops. The browser tests ran on Windows.

See the [validation report](qa/acceptance.md) and [31 documented fixes](qa/ux-fixes.md) for details.

### Project files and third-party notices

| Path | Purpose |
| --- | --- |
| `public/` | Browser entry point, styles, PWA files, and bundled SQL engine. |
| `src/` | Application, curriculum, SQL execution, grading, and local state. |
| `scripts/server.mjs` | Local static HTTP server. |
| `docs/research/` | Syllabus references and past-paper audit records. |
| `tests/` and `qa/` | Automated tests, browser checks, and validation records. |

The bundled sql.js library is distributed under its [MIT licence](public/vendor/sql.js-LICENSE).

## 简体中文

QueryPath 是面向 Cambridge IGCSE Computer Science 0478（2026–2028）和 AS & A Level Computer Science 9618（2026、2027–2029）的浏览器 SQL 学习器。考试知识是学习主线：编写查询、在真实数据上运行、观察结果，再通过练习掌握笔试所需的知识。

界面和讲解以简体中文为主，练习题干与 SQL 使用英文。响应式布局支持电脑、手机和平板浏览器，打开即可开始学习。

### 可以做什么

- 学习 16 节指南，完成 49 道原创练习：22 道 IG、27 道 AS，覆盖编写 SQL、预测输出和数据库概念。
- 使用校园社团、图书库存、客户订单三套数据集。在 SQL 实验室中自由操作、查看表格、导出 CSV 结果并重置数据库。
- 检查答案、逐步查看提示与参考解析、收藏题目、复习错题。查询题按结果判定，数据维护和表结构题按执行后的数据库状态判定；部分查询还使用补充数据检查。
- 参加 15 分钟小挑战，刷新页面后保留答案和截止时间。
- 在浏览器中保存草稿、进度和实验室数据，通过 JSON 备份迁移学习记录。支持深浅主题、键盘快捷操作和符合条件时的离线学习。

### 在线使用

**[打开 QueryPath](https://ash19900601.github.io/SQLsimulator/)**，在浏览器中直接开始学习。

### 在本机启动

安装 **Node.js 22 或更新版本**。获得仓库访问权限后，下载源码或克隆仓库：

```sh
git clone https://github.com/ASH19900601/SQLsimulator.git
cd SQLsimulator
npm start
```

在浏览器中打开 **http://localhost:4173**。Windows 用户也可以双击项目文件夹中的 [启动学习器.cmd](启动学习器.cmd)。使用服务期间保持终端窗口开启，按 `Ctrl+C` 停止服务。

SQL 引擎已包含在 `public/vendor/` 中，运行 `npm start` 即可启动应用。开发和测试依赖按下文单独安装。

#### 连接手机或 iPad

1. 将电脑和移动设备连接到同一个 Wi-Fi。
2. 在电脑上启动服务。
3. 在移动设备上打开启动日志中对应电脑 Wi-Fi 网卡的地址，形式为 `http://<电脑地址>:4173`。

保持电脑运行，并在防火墙中允许连接。移动设备使用电脑的局域网地址访问。

#### 离线使用与安装

Service Worker 缓存通过 **HTTPS 或 localhost** 启用。看到“离线学习已就绪”后，即可离线使用已缓存的核心课程与 SQL 执行功能。外部考纲和真题链接可在联网时打开。

本地服务通过 HTTP 支持局域网在线使用。安装 PWA 时，使用浏览器的安装入口。在 iPad 上，用 Safari 打开 HTTPS 部署，选择“**分享 → 添加到主屏幕**”。

### 学习与考试范围

| 模式 | 覆盖内容 |
| --- | --- |
| IG — 0478 | 单表查询：`SELECT`、`FROM`、`WHERE`、`ORDER BY`、`SUM`、`COUNT`、`AND`、`OR`，以及字段、记录、类型和主键。 |
| AS / 完整 A Level — 9618 | 最多两表查询、连接、分组、聚合、`INSERT INTO`、`UPDATE`、`DELETE FROM`、`CREATE DATABASE`、`CREATE TABLE`、`ALTER TABLE`，以及主键和外键。 |

SQL 属于完整 A Level 资格中的 AS 基础内容。主要范围由所选年份的考纲决定，结合真题示例讲解语法和可接受的替代写法。

研究记录包括 **21 份 IG Paper 2 试卷及其评分方案**，以及 **20 份 SQL 题目内容不同的 AS Paper 1 试卷及其评分方案**。每项记录包含来源链接、题号、页码和语法分析。

- [考纲范围与原始来源](docs/research/syllabus-scope.md)
- [IG 逐卷分析](docs/research/ig-paper-audit.md)
- [AS 逐卷分析](docs/research/as-paper-audit.md)

QueryPath 通过原创练习和即时反馈支持自主学习。

### SQL 执行与学习记录

- SQL 通过本地 **sql.js / SQLite** 执行，并为 CAIE 写法提供兼容处理。
- 练习每次运行都从原始数据开始；自由实验室中的修改会在本机保留。`CREATE DATABASE` 会进入新的空沙盒，重置可恢复示例数据。
- 查看参考答案后，该任务后续完成会标记为辅助完成。提示用于引导解题。查询判题检查列顺序和值，并在题目要求排序时检查行顺序。
- 记录保存在当前浏览器的站点存储中。可从学习记录页面导出 JSON 备份，在浏览器或设备之间迁移记录。导入会合并进度和收藏，保留当前草稿及实验室数据。

### 测试与兼容性

安装测试依赖并运行自动化测试：

```sh
npm ci
npm test
```

运行浏览器检查时，在另一个终端保持 `npm start` 运行，并使用 4173 端口。默认检查命令使用本机已安装的 Microsoft Edge：

```sh
npm run test:ui
```

在 PowerShell 中使用 Playwright WebKit：

```powershell
npx playwright install webkit
$env:BROWSER_ENGINE = 'webkit'
npm run test:ui
Remove-Item Env:BROWSER_ENGINE
```

验证记录包含 104 项通过的单元/集成测试，以及 Edge 和 Playwright WebKit 各 29 项通过的浏览器检查。布局检查覆盖 360/390 像素手机、768/1024 像素平板和 1440 像素电脑。浏览器测试运行于 Windows。

详细记录见[验收报告](qa/acceptance.md)和 [31 项问题修复记录](qa/ux-fixes.md)。

### 项目文件与第三方声明

| 路径 | 用途 |
| --- | --- |
| `public/` | 浏览器入口、样式、PWA 文件和随附 SQL 引擎。 |
| `src/` | 应用、课程、SQL 执行、判题与本机状态模块。 |
| `scripts/server.mjs` | 本地静态 HTTP 服务。 |
| `docs/research/` | 考纲引用与真题分析记录。 |
| `tests/` 和 `qa/` | 自动化测试、浏览器检查与验证记录。 |

随附的 sql.js 库采用 [MIT 许可证](public/vendor/sql.js-LICENSE)。
