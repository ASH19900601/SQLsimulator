# CAIE 9618 Paper 1 SQL 证据审计

核验日期：2026-10-24。适用课程：Cambridge International AS & A Level Computer Science 9618，2026 与 2027–2029 考纲。本文是原创研究摘要，不是 Cambridge 官方材料或对未来评分的保证。

## 研究方法与计数

实际读取了下表 **20 份不同试卷的 SQL 题，以及各自匹配的 20 份评分标准**。资料为 Cambridge 编写的 PDF，使用 PapaCambridge 镜像获取，用 `pypdf` 从内存读取，并逐题对照题设、评分点和替代答案。评分标准没有作为额外试卷计数；同一道题的不同小问也没有单独计数。全部 20 份均含 SQL/DDL/DML 实际作答题，覆盖 2021–2025 年；选中的 SQL 任务内容互不重复。

2021 年部分变体实际重复：`9618_s21_13` 与 `9618_s21_11` 的对应内容相同，`9618_w21_13` 与 `9618_w21_11` 的对应题相同。本表只保留 11 变体，没有靠重复变体增加数量。另对 `9618_s23_13`、`9618_w23_12` 作过关键词筛查，但未纳入这份 SQL 实题审计清单。某些下载失败或未完成双文档核对的其他试卷同样没有计数。

页码为 PDF 的从 1 开始的页码，与这些文件的印刷页码一致。完整机器可读记录见 [as-papers.json](as-papers.json)，包括题号、两个来源链接、主题、原创分析和适用范围明确的评分写法。

## 逐卷记录

| 试卷 | SQL 题号 | QP / MS 页码 | 原创分析与实现影响 |
| --- | --- | --- | --- |
| [9618_s21_11 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s21_qp_11.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s21_ms_11.pdf) | 7(b)(iii) | 16 / 9 | 建数据库有独立评分要求；学习器须支持数据库级 DDL。 |
| [9618_s21_12 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s21_qp_12.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s21_ms_12.pdf) | 1(c)(i–ii) | 3 / 3 | 补全表类型、主键并关联查询未付押金者；评分允许两种连接结构。 |
| [9618_w21_11 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w21_qp_11.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w21_ms_11.pdf) | 5(c)(i–ii) | 9 / 7 | 按商店计数及插入完整车辆记录；需识别分组与字段顺序。 |
| [9618_w21_12 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w21_qp_12.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w21_ms_12.pdf) | 6(c)(i–ii) | 11 / 7 | 汇总购买数量并添加日期字段；求和与计数、结构与数据修改应分清。 |
| [9618_w22_11 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w22_qp_11.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w22_ms_11.pdf) | 4(c)(ii), 4(d) | 7–8 / 6 | 前缀匹配后计数；评分明确接受两种多字符通配符，并展示一次新增两列。 |
| [9618_w22_12 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w22_qp_12.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w22_ms_12.pdf) | 5(b) | 7 / 6 | 插入含字符串、实数与布尔值的数据；评分接受有无字段列表。 |
| [9618_w22_13 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w22_qp_13.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w22_ms_13.pdf) | 2(c–d) | 4–5 / 4 | 前缀过滤计数与添加分辨率字段；完整分辨率值应按文本保存。 |
| [9618_s23_11 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s23_qp_11.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s23_ms_11.pdf) | 2(b)(iii–iv) | 6–7 / 5 | 保留标识前导零，关联观察记录，按体型分组计数并命名结果列。 |
| [9618_s23_12 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s23_qp_12.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s23_ms_12.pdf) | 2(c)(ii–iii) | 6–7 / 5 | OR 查询与四项纠错；题目明确指出错误聚合、连接、逻辑条件和漏引号。 |
| [9618_w23_11 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w23_qp_11.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w23_ms_11.pdf) | 3(c)(i–ii) | 7 / 6 | 创建数据库并通过双表关联求客户订购总量；两类连接写法均被列出。 |
| [9618_w23_13 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w23_qp_13.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w23_ms_13.pdf) | 3(b)(ii) | 5 / 5 | 统计指定日期之后的课程；严格日期边界与聚合列标题分别重要。 |
| [9618_s24_11 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s24_qp_11.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s24_ms_11.pdf) | 6(c)(i–ii) | 14 / 7 | 给现有表添加外键，再按玩家统计事件；执行器要真正实现结构修改。 |
| [9618_s24_12 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s24_qp_12.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s24_ms_12.pdf) | 4(b–c) | 7–8 / 7 | 建考试表并补题目表引用；评分出现类型缩写和未指定长度的字符类型。 |
| [9618_s24_13 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s24_qp_13.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s24_ms_13.pdf) | 4(b–c) | 8–9 / 5 | 同时声明日期、时间、主外键，关联剧目后分组计数并设置别名。 |
| [9618_w24_11 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w24_qp_11.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w24_ms_11.pdf) | 2(b)(ii–iii) | 5–6 / 4–5 | 复合主键与适当约束必须支持；欠款查询同时过滤供应商和布尔状态。 |
| [9618_w24_12 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w24_qp_12.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w24_ms_12.pdf) | 6(b)(ii) | 9 / 7 | 按完整年度范围求已付款总额；Y/N 在此处是字符数据。 |
| [9618_w24_13 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w24_qp_13.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_w24_ms_13.pdf) | 4(b), 4(c)(i) | 5–6 / 4 | 年度数量聚合和批次建表；价格、小数数量、文本、日期不可混用类型。 |
| [9618_s25_11 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s25_qp_11.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s25_ms_11.pdf) | 5(e) | 9 / 9 | 按客户聚合未付款订单；题设使用 SQL 引擎常视为保留词的表名。 |
| [9618_s25_12 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s25_qp_12.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s25_ms_12.pdf) | 5(d)(i–ii) | 10 / 9 | 双表计数与限定目标记录的多字段更新；前导零标识必须保持。 |
| [9618_s25_13 QP](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s25_qp_13.pdf) · [MS](https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/9618_s25_ms_13.pdf) | 6(b–c) | 15 / 10–11 | 插入产品并按客户统计未领取订单；不同合法连接与插入形式均应判对。 |

## 与现行考纲的关系

考纲优先界定课程范围，历史试卷用于补充具体写法和判题边界，不能据某题没出现某项而删除考纲要求。官方来源：

- [9618 2026 syllabus](https://www.cambridgeinternational.org/Images/697372-2026-syllabus.pdf)，第 8.3 节，26–27 页。
- [9618 2027–2029 syllabus](https://www.cambridgeinternational.org/Images/721397-2027-2029-syllabus.pdf)，第 8.3 节，26–27 页。
- [9618 官方课程页面](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-computer-science-9618/) 提供按考试年份选择的版本。

两版 8.3 的 SQL 主范围一致：创建数据库、创建及修改表、主键、外键；类型 CHARACTER、VARCHAR(n)、BOOLEAN、INTEGER、REAL、DATE、TIME；最多两张表的查询，包括选择、过滤、排序、分组、内连接、求和、计数、平均值；以及插入、删除、更新。SQL 位于 AS 内容；完整 A Level 学习者继续使用这套基础，不能凭空添加一个所谓 A2 专属 SQL 方言。

这 20 份样本没有为每一个考纲关键字提供实题例证。例如 ORDER BY、AVG、DELETE FROM 仍必须依据考纲实现，不可因本次样本未出现而遗漏。对 HAVING、DISTINCT、子查询、外连接、窗口函数等，本文没有提供其属于目标考试要求的证据，不应在考试模式中把它们标成已经获得认证的考纲语法。未获得证据也不等于本文证明了所有年份都禁止它们。

## 执行器与判题必须落实的边界

1. **双表关联的等价写法。** 多份评分标准同时提供显式内连接和逗号表列表加连接条件。语义等价的答案应被接受；但填空题仍须符合题目已经给出的结构。见 s21/12、w23/11、s24/13、s25/11–13。
2. **建表之外的真实 DDL。** s24/11、s24/12 明确考已有表添加外键；w22/11 展示一次 ADD 添加两列。若底层数据库不直接支持，需要受控转换并验证结果，不能仅显示成功提示。
3. **主键可以由多列组成。** w24/11 要求复合主键。主键、非空与外键应体现在实际结构和合法数据行为上。
4. **考试文本引号。** 单引号与双引号文本都出现在评分示例。不能直接把底层引擎的双引号标识符规则当作考试标准，也不能自动替学生补所有缺失引号；s23/12 明确把漏引号列为错误。
5. **日期不是任意字符串比较。** s23/12、w24/12、w24/13 使用哈希定界的日/月/年日期；w23/13 还展示引号日期。需要按题目规定解释后以真实日期顺序比较，保留包含/排除边界的区别；不能把斜杠日期直接作字典序排序。
6. **布尔与文本状态分开。** TRUE/FALSE 广泛出现；s21/12 的布尔例子使用 Yes/No，而 w24/12 的 Y/N 是文本。兼容须依字段和题设处理，不可全局把 Y、N 或任意词转换为布尔。
7. **前缀 LIKE 的直接证据。** w22/11 明确接受星号和百分号的多字符通配符，w22/13 使用百分号。转换只作用于 LIKE 模式；字符串中的普通星号不应被全局替换。本文未由这些例子推导所有单字符通配符均为考试范围。
8. **可选字段列表与多字段赋值。** w22/12、s25/13 接受 INSERT 有无字段列表；s25/12 的 UPDATE 同时设置两列。学习器应检查值的落列与更新目标，不能只检查关键词是否齐全。
9. **题设名称不能被底层保留词限制误伤。** s25/11 与 s25/13 的表名包含 ORDER。内部可安全引用标识符，但不要强迫学生擅自改题设名字。转换必须基于语法位置，不能误改 ORDER BY。
10. **分组语义与输出列。** s25/11 按客户主键分组并显示客户姓名，这是依赖于主键确定姓名的题设。不能扩展为任意未分组字段都合法。s25/13 则明确允许按客户编号或姓名分组；练习应有数据覆盖同名不同客户等情形，并按题目实际要求判定。
11. **别名在要求时才成为评分条件。** 多道题要求给聚合结果合适标题；只得到相同数字不一定满足题目。未明确要求某个标题时，不应强制答案使用示例中的同一名称。
12. **类型别名应标注证据层级。** CHAR、INT、未写长度的 VARCHAR，以及 CURRENCY、TEXT、FLOAT 等均有某些题的评分证据。默认教学用现行考纲列出的类型；兼容替代形式时注明具体证据，不宣称它们在每一场考试都必定接受。
13. **结果比对不等于纯字符串比对。** 无排序要求的查询应允许合法行序差异；数值、列选择、分组、必要标题和数据修改后的状态应分别核验。要用额外数据防止遗漏条件的错误答案碰巧返回同样结果。

## 对本次实现的最小验证建议

- 将两个日期边界及相邻年份放入数据，验证年范围、严格晚于与包含边界。
- 用相同键值出现在不同表的记录验证关联，防止自等条件或笛卡尔积蒙混过关。
- 对插入、更新、添加字段、添加外键及复合主键检查实际数据库状态。
- 用保留前导零的字符标识、含双引号/单引号文本，以及布尔字段和 Y/N 文本字段分别验证。
- 以同一任务的显式连接与逗号连接分别提交，确认等价答案得分一致；对于要求列标题的题，缺少标题要有对应反馈。

本审计提供了可追溯的课程和兼容性依据。最终课程与执行器的覆盖声明应以实际已实现、已验证的能力为准，不把本文件中提出的要求当成实现已经完成。
