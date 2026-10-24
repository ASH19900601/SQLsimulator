# IGCSE 0478 Paper 2 SQL 逐卷审计

研究日期：2026-10-24。目标课程：Cambridge IGCSE Computer Science 0478，2026–2028 考纲。

## 研究范围与方法

实际读取了 **21 份不同题号的 question paper（QP）与 21 份对应 mark scheme（MS）**，覆盖 2023、2024、2025 各年的 February/March 22、May/June 21/22/23、October/November 21/22/23。MS 没有重复计算为独立试卷；这 21 份试卷全部含 SQL 子题，没有以不含 SQL 的试卷充数。

先检索公开资料，再用只读 HTTP GET 获取 Cambridge/UCLES 编写的 PDF 镜像，以 pypdf 在内存中提取整卷文本、定位数据库/SQL 题，阅读相关题干、数据表及对应评分段落。关注 SQL 子题，**没有声称分析每卷中无关 SQL 的全部算法题**。关键词检索没有结果的评分文件也继续按题号与数据表名称定位，避免把填空答案没有 SELECT 的评分页漏掉。0478_w24_qp_21 的直接请求一度失败，改用网页 PDF 文本读取，最终核实了第 10–11 页。

来源均为 Cambridge 编写的原试卷/评分文件；镜像站不作为语法主张的作者。下表链接指向实际已读取的 PDF。只保存原创分析与定位信息，没有复制整题、完整数据集或评分全文。

**重复检查**：以年份、考季、变体、题号及 SQL 情境核对，21 个 QP 编号唯一，所审 SQL 子题没有完全重复的题面。不同试卷存在相似结构，例如缺货状态与零库存的等价筛选；它们仍是独立试卷，不被解释为 21 种不同语法。此处没有进行全卷文件 SHA 去重，也不声称不同变体的每一道非 SQL 题均不同。

机器可读版本见 [ig-papers.json](./ig-papers.json)。其中 `pages.qp`、`pages.ms` 是 PDF 的一基页码，与所审纸面页码一致。

## 考纲核心与历史评分例的边界

[官方 2026–2028 考纲第 30 页，第 9.4 节](https://www.cambridgeinternational.org/Images/697167-2026-2028-syllabus.pdf) 将查询限定为**单表**，核心包括选择字段、指定表、筛选、递增/递减排序、求和、计数、AND、OR，以及阅读查询结果。数据库基础还包括字段/记录、基本数据类型、主键和给定数据需求。考纲采用完整的 ASCENDING / DESCENDING 术语。

历史试卷不能替代当前考纲：本样本未出现显式排序方向或 SQL OR 的考题，但它们仍是当前考纲要求。反过来，样本评分出现的 NOT 与一次完整字符串 LIKE 等价答案，也不自动成为当前 IG 的核心教学清单。

建议将内容分为三个层次：

1. **核心教学**：以当前第 9.4 节为准，使用完整 SELECT 语句、明确列名、单表、带引号文字常量、数值比较、显式布尔比较、SUM / COUNT、AND / OR、ORDER BY。递减和递增按考纲术语提供，若执行引擎使用 ASC / DESC，需明确做语义映射。
2. **有来源的评分兼容**：根据练习的字段类型接受真假别名、裸布尔条件、AND 条件换序，以及特定题目认可的等价条件。NOT 标记为历史评分兼容；LIKE 的证据仅限 m23/22 的完整作者名匹配，不扩张为 IG 通配符课程。
3. **范围提示**：多表连接、DDL、修改数据、GROUP BY、AVG/MIN/MAX、通配符 LIKE 等不由这份 IG 核心清单支持。应用可以在 AS 课程提供；在 IG 中应提示“超出本课程范围”，不能把“超纲”直接说成所有考试场景都必然不给分。

## 逐卷记录

### 2023（7 份 QP + 7 份 MS）

| 试卷及来源 | 子题与页码 | 原创分析 | 评分许可及注意事项 |
|---|---|---|---|
| 0478_m23 / 22 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_m23_qp_22.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_m23_ms_22.pdf) | 9(d), 9(e)；QP 10、11；MS 10 | 图书库存情境同时要求追踪数值等值筛选的结果和补全按作者检索。选择的字段与筛选字段不同，不能把 WHERE 字段自动加入输出。评分分别检查结果记录与三个语句部分。 | 评分示例允许文字常量使用单引号或双引号。 该题还接受用 LIKE 匹配完整作者名；这只证明这道题的等价答案获准，不证明 IG 要求通配符 LIKE。 |
| 0478_s23 / 21 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s23_qp_21.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s23_ms_21.pdf) | 10(c)；QP 12、13；MS 13 | 电视产品情境要求选择指定三个字段并筛选智能电视。字段含货币符号，执行器若仅允许字母数字下划线会拒绝真实试卷标识符。填空四个位置各有评分点。 | 评分示例使用未加引号的 YES 作为布尔值；该表的 SmartTV 由数据类型题确认为 Boolean。 |
| 0478_s23 / 22 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s23_qp_22.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s23_ms_22.pdf) | 10(c)；QP 10；MS 10 | 音乐目录以同一类别条件对比时长求和与歌曲计数，重点在分清总量与记录数量。题面抽取文本的两个表达式未出现 SELECT；评分要求解释含义，而非把省略形式作为可执行 SQL。 | 这是一道解释题，评分未给出完整可执行改写；教学示例仍应写完整 SELECT。 |
| 0478_s23 / 23 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s23_qp_23.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s23_ms_23.pdf) | 10(d)；QP 10、11；MS 13 | 度假屋数据考查包含边界值的筛选以及指定列的结果抄写。评分关注三条正确记录和横纵排列，说明输出题还需要练习列次序与按题面展示结果。 | 本题没有提供额外 SQL 写法许可。 Rate$ 是题面原有字段名；不能视为非法标识符。 |
| 0478_w23 / 21 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w23_qp_21.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w23_ms_21.pdf) | 9(c)；QP 10；MS 9 | 模型商店题要求解释三个基本子句的职责：输出哪些字段、数据来自哪张表、按什么条件筛选。适合用作 SQL 结构理解题，而非只训练记忆一整条答案。 | 没有特别替代语法；评分区分字段选择、表名和筛选条件。 |
| 0478_w23 / 22 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w23_qp_22.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w23_ms_22.pdf) | 10(d)；QP 10、11；MS 9 | 马匹登记表要求补全关键字、表名和产地条件字段。检索条件中的产地与要显示的品种是不同字段，数据面板应支持学习者检查这一区别。 | 评分的完整语句使用双引号文字常量。 题面抽取中字段列表末尾有逗号，评分的完整语句没有；不得将尾逗号推广成合法教学语法。 |
| 0478_w23 / 23 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w23_qp_23.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w23_ms_23.pdf) | 9(c), 9(d)；QP 12、13；MS 11 | 雉鸟资料先考查严格大于阈值的输出，后要求同时满足繁殖状态和幼鸟数量条件。此题把单条件查询推进到布尔与数值条件组合。 | 评分允许直接把 Boolean 字段用作条件。 两个 AND 条件交换次序在该题评分中明确列为等价答案。 |

### 2024（7 份 QP + 7 份 MS）

| 试卷及来源 | 子题与页码 | 原创分析 | 评分许可及注意事项 |
|---|---|---|---|
| 0478_m24 / 22 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_m24_qp_22.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_m24_ms_22.pdf) | 9(c)；QP 11；MS 11 | 仓储租赁题要求只输出代码、价格、面积并按升降设备状态筛选。评分给字段列表部分分，并独立检查数据表和布尔条件，支持教学时分项反馈。 | 评分示例显式将 Hoist 与 TRUE 比较。 数据类型小题同时允许该属性以 Boolean 或文字表示；执行时必须以当前练习声明的类型为准。 |
| 0478_s24 / 21 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s24_qp_21.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s24_ms_21.pdf) | 9(b)；QP 10；MS 14 | 饮料库存问的是罐装商品的库存数量总和，不是有多少条罐装商品记录。此例直接支持在 SUM 与 COUNT 间提供针对性纠错提示。 | 评分示例使用单引号字符串。 SUM 的参数是库存数字字段，筛选字段是包装类型。 |
| 0478_s24 / 22 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s24_qp_22.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s24_ms_22.pdf) | 10(c), 10(d)；QP 10、11；MS 11 | 电视订阅题区分所有合约的月份累计与订阅新闻的合约数，再要求筛出同时订阅新闻和体育者。COUNT 仍由 WHERE 控制哪些记录参与计算。 | 评分接受裸 Boolean 条件和显式与 TRUE 比较。 评分接受交换两个 AND 条件的次序。 |
| 0478_s24 / 23 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s24_qp_23.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s24_ms_23.pdf) | 8(b), 8(c)；QP 10、11；MS 12 | 航空收藏查询先过滤多发动机飞机，再按年份递增排列指定列。后续补全只显示标识与型号的可飞行记录。排序是独立于筛选和输出列的步骤。 | ORDER BY 未写方向时，评分结果按年份从小到大排列。 评分接受可飞行字段与 Y 比较，或直接使用该布尔字段作为条件。 |
| 0478_w24 / 21 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w24_qp_21.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w24_ms_21.pdf) | 10(c), 10(d)(i–ii)；QP 10、11；MS 11 | 奶酪库存题先追踪供货商筛选，再要求检索缺货商品并提出使用另一字段的等价条件。数据中的缺货状态与零库存重量形成题目限定的等价关系。 | 本题评分接受 NOT 加布尔字段、与 FALSE/No/带引号 No 比较，或以库存重量等于零筛选。 NOT 是已见评分许可，未列入 2026–2028 IG 数据库核心关键字名单。 两个条件只在题目给定的数据约束下等价，不能作为一般数据库定律。 |
| 0478_w24 / 22 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w24_qp_22.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w24_ms_22.pdf) | 11(d)；QP 10、11；MS 10 | 酒店预订题以不等于真值查找星期一可用客房，要求四列输出。此卷证明不等比较、短布尔写法与货币符号字段会出现在结果追踪题中。 | 题面直接使用未加引号的 T，而表中对应字段由数据类型小题确认为 Boolean。 评分检查四个正确输出列、记录排列和无额外内容。 |
| 0478_w24 / 23 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w24_qp_23.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w24_ms_23.pdf) | 4, 11(a), 11(b)(i–ii)；QP 3、10；MS 5、9、10 | 建材库存先按重量筛选再按未显示的价格排序，后用状态或数量判断缺货。另有数据库术语题。适合练习排序字段不必出现在输出字段中，以及场景约束下的等价条件。 | 评分给出默认递增的 ORDER BY 结果。 缺货筛选接受 NOT 布尔字段、FALSE/No/带引号 No，或袋数等于零；均为本题明确许可。 |

### 2025（7 份 QP + 7 份 MS）

| 试卷及来源 | 子题与页码 | 原创分析 | 评分许可及注意事项 |
|---|---|---|---|
| 0478_m25 / 22 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_m25_qp_22.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_m25_ms_22.pdf) | 8(c), 8(d)；QP 8、9；MS 14 | 城市资料先筛选指定洲并按人口排序，后补全只列出四个指定属性的首都查询。评分同时要求结果内容、三列布局及正确顺序。 | 默认 ORDER BY 按人口递增。 首都查询的评分示例显式比较 TRUE。 |
| 0478_s25 / 21 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s25_qp_21.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s25_ms_21.pdf) | 8(b), 8(c)；QP 8、9；MS 12 | 公交时刻表先按司机文字条件追踪结果，再按是否返程筛选只显示目的地。不同子题使用不同输出字段，练习不能仅比较返回的行数。 | 评分示例使用未加引号的 Yes；Return 在前一小题明确为 Boolean。 |
| 0478_s25 / 22 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s25_qp_22.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s25_ms_22.pdf) | 9(b)；QP 12；MS 12 | 首都资料要求列出指定洲的城市、国家、人口。四个评分点分别覆盖输出字段集合、FROM、条件字段与条件文字，适合逐项显示错误原因。 | 评分明确接受单引号或双引号包围相同洲名。 |
| 0478_s25 / 23 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s25_qp_23.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_s25_ms_23.pdf) | 5(b)；QP 7；MS 13 | 电脑零件表按是否已补货筛选，显示标识、名称、订货日期。字段来自不同语义类别，要求精确读取表结构，而不是选择全部字段。 | 本题评分明确允许 SELECT 中三个正确字段采用任意次序。 评分示例显式比较 TRUE；不要把其他输出题的列次序要求机械移植到本题。 |
| 0478_w25 / 21 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w25_qp_21.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w25_ms_21.pdf) | 1, 8(d)；QP 2、12；MS 7、16 | 一题把表来源、筛选、排序、计数与关键字配对，另一题补全尚未获得出行许可的学生姓名查询。既检查概念理解，也检查布尔假值过滤。 | 评分示例显式比较 False。 关键字配对的评分页含连线图；线性 PDF 文本顺序不能当作配对结果。 |
| 0478_w25 / 22 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w25_qp_22.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w25_ms_22.pdf) | 7(c), 7(d)；QP 10、11；MS 16 | 水鸟资料的输出题按寿命排序，但输出只含种类、体长、翼展；写查询题再要求包含边界的寿命过滤并按种类排序。排序字段与输出字段解耦是重要验收项。 | ORDER BY 未写方向时，给定答案按寿命递增。 写查询的评分示例使用大于等于关系，并把 ORDER BY 接在筛选条件之后。 |
| 0478_w25 / 23 · [QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w25_qp_23.pdf) / [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/0478_w25_ms_23.pdf) | 8(b)；QP 10；MS 15 | 设备借用题筛选未归还物品，只展示描述与借用者。题面使用 Yes/No 值，评分采用带引号文字比较，提醒执行器不能强制所有此类表示只接受一种书写。 | 评分示例使用双引号包围 No。 若应用把 Returned 建模为 Boolean，应仅针对该字段将题面布尔别名与文字表示归一，避免改写普通文字常量。 |

## 对学习器的实现要求

- **数值总和与记录数分开教**：s24/21 的罐装库存要累计库存字段；COUNT 不能代替 SUM。s23/22、s24/22 支持用同一情境直接比较两者。
- **布尔归一必须知道字段类型**：YES/NO、Y/N、T/F、TRUE/FALSE 以及部分带引号写法在试卷中出现。只有已声明为 Boolean 的字段才做这种归一；普通文本中的 “No” 不能被全局改写为数字或假值。
- **识别真实字段名**：Price$、Rate$ 这类标识符出现在多卷中。不能因美元符号拒绝用户答案。
- **筛选、投影、排序相互独立**：用于 WHERE 或 ORDER BY 的字段不必出现在 SELECT 中。w24/23 与 w25/22 是明确的排序证据。
- **结果与答案判断分开**：输出预测题可以按题面/评分要求检查行列顺序；写查询题应根据问题要求决定是否比较字段顺序、是否强制排序。s25/23 明确允许指定字段以任意次序出现。没有 ORDER BY 时，不应向学生宣称通用 SQL 标准保证输入顺序；本练习数据的展示顺序可以保持稳定。
- **不要只比较一个数据集的结果**：硬编码常量、遗漏条件和错误聚合可能偶然返回相同结果。原创 SQL 题应以结构要求和额外测试数据共同验证。题目明确要求仅显示的列不得偷偷增加。
- **不把排版异常变成规范**：s23/22 的题面抽取缺 SELECT，w23/22 的填空行末出现多余逗号；其教学版本采用完整、正常的 SQL 语法。w25/21 的连线图不能依赖 PDF 文本顺序恢复答案。
- **评分兼容有界**：官方 MS 给出的有效答案不一定穷尽所有有效写法；本应用的反馈属于学习反馈，不冒充 Cambridge 官方阅卷结论。每个兼容规则都应回溯到上表的具体题目。

## 样本所见与未见

直接读到的关系比较包括 =、>、>=、<>；默认递增 ORDER BY 多次出现；未在本 21 卷 SQL 子题中读到显式 ASC/DESC/ASCENDING/DESCENDING、OR、通配符 LIKE、多表 JOIN 或数据定义/更新语句。未出现只是本样本事实，不能据此删除当前考纲已有内容，也不能据此推断任何年份绝不考查。

