# QueryPath

[English](#english) · [简体中文](#简体中文)

## English

QueryPath is a browser-based SQL learning studio for Cambridge IGCSE Computer Science 0478 (2026–2028) and AS & A Level Computer Science 9618 (2026 and 2027–2029). Exam knowledge is the learning path: write queries, run them against real data, inspect the results, and practise the skills used in written examinations.

The interface and explanations are primarily in Simplified Chinese, with English exercise prompts and SQL. The responsive layout supports desktop, phone, and tablet browsers. No learning account is required.

### What you can do

- Follow 16 lessons and complete 49 original exercises: 22 IG and 27 AS tasks, covering SQL writing, output prediction, and database concepts.
- Run SQL against three datasets: school clubs, a book catalogue, and customer orders. Explore freely in the SQL lab, inspect tables, export results as CSV, and reset the database.
- Check answers, reveal progressive hints and explained solutions, bookmark tasks, and revisit incorrect attempts. Query answers are checked by results; data maintenance and schema tasks are checked by the resulting database state. Selected queries also use additional test data.
- Take a 15-minute practice challenge. Answers and the deadline survive a page refresh. This is a short learning exercise, not a complete official mock paper or a grade prediction.
- Keep drafts, progress, and lab data in your browser; transfer learning records through JSON backups. Use light or dark mode, keyboard shortcuts, and offline learning where supported.

### Start locally

Install **Node.js 22 or later**. With access to this repository, download its source or clone it:

```sh
git clone https://github.com/ASH19900601/SQLsimulator.git
cd SQLsimulator
npm start
```

Open **http://localhost:4173** in your browser. On Windows, you can also double-click [启动学习器.cmd](启动学习器.cmd) inside the project folder. Keep the terminal window open while using the server; press `Ctrl+C` to stop it.

The SQL engine is included in `public/vendor/`. Starting the application requires neither a build step nor `npm install`. Development and test dependencies are installed separately as described below.

#### Connect a phone or iPad

1. Connect the computer and mobile device to the same Wi-Fi network.
2. Start the server on the computer.
3. Open the network address printed by the server that matches the computer's Wi-Fi interface. It has the form `http://<computer-address>:4173`.

The computer must remain running, and its firewall must permit the connection. `localhost` on a mobile device refers to that device, not to the computer running QueryPath. The server listens on all network interfaces, so use it on a trusted network.

#### Offline use and installation

Service Worker caching requires **HTTPS or localhost**. Wait for the “离线学习已就绪” (“Offline learning is ready”) indicator before relying on offline access. Cached core lessons and SQL execution then work without a network connection; external syllabus and past-paper links still require one.

Ordinary LAN HTTP supports online use but cannot enable Service Worker caching. PWA installation depends on the browser. On iPad, an HTTPS deployment can be added through Safari's **Share → Add to Home Screen** menu. The local server itself provides HTTP, not HTTPS.

### Learning and exam scope

| Mode | Coverage |
| --- | --- |
| IG — 0478 | Single-table queries with `SELECT`, `FROM`, `WHERE`, `ORDER BY`, `SUM`, `COUNT`, `AND`, and `OR`; fields, records, types, and primary keys. |
| AS / full A Level — 9618 | Queries involving at most two tables, joins, grouping, aggregates, `INSERT INTO`, `UPDATE`, `DELETE FROM`, `CREATE DATABASE`, `CREATE TABLE`, `ALTER TABLE`, and primary/foreign keys. |

SQL is part of the AS foundation within the full A Level qualification; QueryPath does not introduce a separate A2 SQL dialect. The selected syllabus windows define the main scope. Past-paper evidence explains specific accepted alternatives without treating every historical allowance as a rule for future examinations.

The research records cover **21 IG Paper 2 question papers and their mark schemes**, plus **20 AS Paper 1 papers with distinct SQL question content and their mark schemes**. Entries include source links, question numbers, page references, and syntax observations.

- [Syllabus scope and primary sources](docs/research/syllabus-scope.md)
- [IG paper-by-paper audit](docs/research/ig-paper-audit.md)
- [AS paper-by-paper audit](docs/research/as-paper-audit.md)

QueryPath is an independent learning product, not affiliated with or endorsed by Cambridge. Its exercises are original. Automated feedback supports practice and does not replace an examiner's marking of an official paper.

### Data, grading, and simulation limits

- SQL runs locally through **sql.js / SQLite**, with compatibility handling for the supported CAIE syntax. Mode restrictions describe this learner's scope, not every SQL database's capabilities.
- Each exercise run starts from its original dataset. In the free lab, changes persist locally. `CREATE DATABASE` enters a new empty sandbox; resetting restores the sample data.
- SQLite's type behaviour differs from some server databases. For example, `VARCHAR(n)` does not automatically enforce a maximum length. Account permissions, multi-user transactions, and database-server administration are outside the simulator's scope.
- Revealing a reference answer marks subsequent completion of that task as assisted. A hint alone does not complete the task. Query checking considers column order and values, and checks row order when the task requires sorting.
- Records belong to the current browser and site address. Switching browser, port, or device does not synchronise them. Export a JSON backup from the progress page to transfer records; imports merge progress and bookmarks while retaining current drafts and lab data. Clearing browser storage removes local records.

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

The recorded validation covers 104 passing unit/integration tests and 29 passing browser checks in each of Edge and Playwright WebKit. Layout checks include 360/390 px phones, 768/1024 px tablets, and 1440 px desktops. WebKit was tested on Windows; these results are not a physical iPad/Safari test.

See the [validation report](qa/acceptance.md) and [31 documented fixes](qa/ux-fixes.md) for evidence and limitations. Supporting research and QA documents retain their original languages.

### Project files and third-party notices

| Path | Purpose |
| --- | --- |
| `public/` | Browser entry point, styles, PWA files, and bundled SQL engine. |
| `src/` | Application, curriculum, SQL execution, grading, and local state. |
| `scripts/server.mjs` | Local static HTTP server. |
| `docs/research/` | Syllabus references and past-paper audit records. |
| `tests/` and `qa/` | Automated tests, browser checks, and validation records. |

The bundled sql.js library is distributed under its [MIT licence](public/vendor/sql.js-LICENSE). That third-party licence applies to sql.js and does not establish a licence for the rest of this project.

## 简体中文

QueryPath 是面向 Cambridge IGCSE Computer Science 0478（2026–2028）和 AS & A Level Computer Science 9618（2026、2027–2029）的浏览器 SQL 学习器。考试知识是学习主线：编写查询、在真实数据上运行、观察结果，再通过练习掌握笔试所需的知识。

界面和讲解以简体中文为主，练习题干与 SQL 使用英文。响应式布局支持电脑、手机和平板浏览器，无需注册学习账号。

### 可以做什么

- 学习 16 节指南，完成 49 道原创练习：22 道 IG、27 道 AS，覆盖编写 SQL、预测输出和数据库概念。
- 使用校园社团、图书库存、客户订单三套数据集。在 SQL 实验室中自由操作、查看表格、导出 CSV 结果并重置数据库。
- 检查答案、逐步查看提示与参考解析、收藏题目、复习错题。查询题按结果判定，数据维护和表结构题按执行后的数据库状态判定；部分查询还使用补充数据检查。
- 参加 15 分钟小挑战，刷新页面后保留答案和截止时间。这是短时学习练习，不是完整官方模拟卷，也不提供考试等级预测。
- 在浏览器中保存草稿、进度和实验室数据，通过 JSON 备份迁移学习记录。支持深浅主题、键盘快捷操作和符合条件时的离线学习。

### 在本机启动

安装 **Node.js 22 或更新版本**。获得仓库访问权限后，下载源码或克隆仓库：

```sh
git clone https://github.com/ASH19900601/SQLsimulator.git
cd SQLsimulator
npm start
```

在浏览器中打开 **http://localhost:4173**。Windows 用户也可以双击项目文件夹中的 [启动学习器.cmd](启动学习器.cmd)。使用服务期间保持终端窗口开启，按 `Ctrl+C` 停止服务。

SQL 引擎已包含在 `public/vendor/` 中，启动应用不需要构建，也不需要运行 `npm install`。开发和测试依赖按下文单独安装。

#### 连接手机或 iPad

1. 将电脑和移动设备连接到同一个 Wi-Fi。
2. 在电脑上启动服务。
3. 在移动设备上打开启动日志中对应电脑 Wi-Fi 网卡的地址，形式为 `http://<电脑地址>:4173`。

电脑必须保持运行，防火墙也需要允许连接。移动设备上的 `localhost` 指向它自己，并不指向运行 QueryPath 的电脑。服务会监听所有网络接口，请在可信网络中使用。

#### 离线使用与安装

Service Worker 缓存要求 **HTTPS 或 localhost**。看到“离线学习已就绪”后，再依赖离线访问。已缓存的核心课程与 SQL 执行功能可以在没有网络时使用；外部考纲和真题链接仍需联网。

普通局域网 HTTP 可以在线使用，但无法启用 Service Worker 缓存。PWA 安装方式取决于浏览器。在 iPad 上，HTTPS 部署可通过 Safari 的“**分享 → 添加到主屏幕**”安装。本地服务本身提供 HTTP，不提供 HTTPS。

### 学习与考试范围

| 模式 | 覆盖内容 |
| --- | --- |
| IG — 0478 | 单表查询：`SELECT`、`FROM`、`WHERE`、`ORDER BY`、`SUM`、`COUNT`、`AND`、`OR`，以及字段、记录、类型和主键。 |
| AS / 完整 A Level — 9618 | 最多两表查询、连接、分组、聚合、`INSERT INTO`、`UPDATE`、`DELETE FROM`、`CREATE DATABASE`、`CREATE TABLE`、`ALTER TABLE`，以及主键和外键。 |

SQL 属于完整 A Level 资格中的 AS 基础内容，QueryPath 不另设 A2 SQL 方言。主要范围由所选年份的考纲决定；真题证据用于说明具体题目接受的替代写法，不将每项历史评分许可视为未来考试的通用规则。

研究记录包括 **21 份 IG Paper 2 试卷及其评分方案**，以及 **20 份 SQL 题目内容不同的 AS Paper 1 试卷及其评分方案**。每项记录包含来源链接、题号、页码和语法分析。

- [考纲范围与原始来源](docs/research/syllabus-scope.md)
- [IG 逐卷分析](docs/research/ig-paper-audit.md)
- [AS 逐卷分析](docs/research/as-paper-audit.md)

QueryPath 是独立学习产品，不隶属于 Cambridge，也未获得其官方认可。练习题均为原创。自动反馈用于辅助学习，不能替代考官对正式试卷的评分。

### 数据、判题与模拟限制

- SQL 通过本地 **sql.js / SQLite** 执行，并为支持的 CAIE 写法提供兼容处理。学习模式的限制描述本学习器的范围，不代表所有 SQL 数据库的能力。
- 练习每次运行都从原始数据开始；自由实验室中的修改会在本机保留。`CREATE DATABASE` 会进入新的空沙盒，重置可恢复示例数据。
- SQLite 的类型行为与部分服务器数据库不同，例如 `VARCHAR(n)` 不会自动限制最大长度。本学习器不模拟账号权限、多用户事务和数据库服务器管理。
- 查看参考答案后，该任务后续完成会标记为辅助完成；仅查看提示不会完成任务。查询判题检查列顺序和值，并在题目要求排序时检查行顺序。
- 记录属于当前浏览器和站点地址。更换浏览器、端口或设备不会自动同步。可从学习记录页面导出 JSON 备份进行迁移；导入会合并进度和收藏，保留当前草稿及实验室数据。清除浏览器存储会删除本机记录。

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

验证记录包含 104 项通过的单元/集成测试，以及 Edge 和 Playwright WebKit 各 29 项通过的浏览器检查。布局检查覆盖 360/390 像素手机、768/1024 像素平板和 1440 像素电脑。WebKit 测试运行于 Windows，这些结果不等同于实机 iPad/Safari 测试。

证据与限制详见[验收报告](qa/acceptance.md)和 [31 项问题修复记录](qa/ux-fixes.md)。配套研究与 QA 文档保留其原有语言。

### 项目文件与第三方声明

| 路径 | 用途 |
| --- | --- |
| `public/` | 浏览器入口、样式、PWA 文件和随附 SQL 引擎。 |
| `src/` | 应用、课程、SQL 执行、判题与本机状态模块。 |
| `scripts/server.mjs` | 本地静态 HTTP 服务。 |
| `docs/research/` | 考纲引用与真题分析记录。 |
| `tests/` 和 `qa/` | 自动化测试、浏览器检查与验证记录。 |

随附的 sql.js 库采用 [MIT 许可证](public/vendor/sql.js-LICENSE)。该第三方许可证适用于 sql.js，不构成本项目其余部分的许可证。
