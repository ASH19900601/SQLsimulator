// Original learning content for CAIE SQL Studio. All exercise datasets are fictional.
// Historical-paper evidence lives in docs/research; no past-paper questions are reproduced here.
export const datasets = [
  {
    "id": "campus",
    "name": "校园社团",
    "description": "8 名学生、4 个社团。练习筛选、布尔条件、排序与关联。Active 是布尔字段（1 为真、0 为假）。",
    "tables": [
      "STUDENT",
      "CLUB"
    ],
    "seed": "CREATE TABLE CLUB (ClubID CHARACTER(3) PRIMARY KEY, ClubName VARCHAR(30), Room VARCHAR(10));\nCREATE TABLE STUDENT (StudentID INTEGER PRIMARY KEY, Name VARCHAR(30), YearGroup INTEGER, House VARCHAR(10), Score REAL, Active BOOLEAN, ClubID CHARACTER(3), FOREIGN KEY (ClubID) REFERENCES CLUB(ClubID));\nINSERT INTO CLUB VALUES ('C01','Robotics','A12'),('C02','Debate','B04'),('C03','Chess','A07'),('C04','Orchestra','M02');\nINSERT INTO STUDENT VALUES (101,'Amina',10,'Cedar',78,1,'C01'),(102,'Ben',11,'Maple',65,1,'C02'),(103,'Chen',10,'Cedar',92,0,'C01'),(104,'Dina',12,'Willow',84,1,'C03'),(105,'Evan',11,'Maple',55,0,'C02'),(106,'Farah',12,'Cedar',73,1,'C03'),(107,'Grace',10,'Willow',88,1,'C04'),(108,'Hugo',11,'Cedar',65,0,'C04');"
  },
  {
    "id": "library",
    "name": "图书库存",
    "description": "8 种书、4 家出版社。Stock 是库存件数，Price$ 是单价，Digital 是布尔字段。",
    "tables": [
      "BOOK",
      "PUBLISHER"
    ],
    "seed": "CREATE TABLE PUBLISHER (PublisherID INTEGER PRIMARY KEY, PublisherName VARCHAR(40), Country VARCHAR(20));\nCREATE TABLE BOOK (BookID INTEGER PRIMARY KEY, Title VARCHAR(50), Genre VARCHAR(20), Price$ REAL, Stock INTEGER, Digital BOOLEAN, PublisherID INTEGER);\nINSERT INTO PUBLISHER VALUES (1,'North Press','UK'),(2,'River Books','Singapore'),(3,'Maple House','Canada'),(4,'Cedar Press','UK');\nINSERT INTO BOOK VALUES (201,'River Code','Computing',12.5,8,1,1),(202,'Ocean Maps','Geography',18,0,0,2),(203,'Quiet Stars','Fiction',9.5,12,1,3),(204,'SQL Steps','Computing',15,5,1,1),(205,'Wild Trails','Geography',14,3,0,2),(206,'Paper Moon','Fiction',8,0,0,3),(207,'Data Atlas','Computing',20,4,1,4),(208,'Night Garden','Fiction',11,7,0,4);"
  },
  {
    "id": "shop",
    "name": "客户订单",
    "description": "6 位客户、8 张订单。一个客户可有多张订单；Paid 是布尔字段，Total 是订单金额。",
    "tables": [
      "CUSTOMER",
      "ORDERS"
    ],
    "seed": "CREATE TABLE CUSTOMER (CustomerID INTEGER PRIMARY KEY, CustomerName VARCHAR(40), City VARCHAR(30), Member BOOLEAN);\nCREATE TABLE ORDERS (OrderID INTEGER PRIMARY KEY, CustomerID INTEGER, Total REAL, Paid BOOLEAN, OrderDate DATE, FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID));\nINSERT INTO CUSTOMER VALUES (1,'Lina Shah','London',1),(2,'Omar Ali','Doha',0),(3,'Mei Lin','Singapore',1),(4,'Sam Reed','London',0),(5,'Noah Kim','Seoul',1),(6,'Ada Cole','York',1);\nINSERT INTO ORDERS VALUES (301,1,45.5,1,'2026-04-03'),(302,2,20,0,'2026-04-04'),(303,1,70,1,'2026-04-08'),(304,3,120,1,'2026-04-10'),(305,4,35,0,'2026-04-12'),(306,3,55,0,'2026-04-15'),(307,5,80,1,'2026-04-18'),(308,2,15,1,'2026-04-20');"
  }
];

export const lessons = [
  {
    "id": "ig-foundations",
    "level": "ig",
    "title": "认识表、字段与主键",
    "subtitle": "从一张学生名单看懂数据库",
    "minutes": 6,
    "keywords": [
      "table",
      "field",
      "record",
      "primary key",
      "data type"
    ],
    "dataset": "campus",
    "example": "SELECT StudentID, Name, Active\nFROM STUDENT;",
    "body": [
      "一张表保存同一类事物。STUDENT 中一行是一名学生的记录，一列是一个字段。表头说明字段名，不计入记录数。",
      "主键要能唯一识别每条记录。姓名可能重复，稳定且唯一的 StudentID 更合适。真实数据的唯一性比字段名字是否含 ID 更重要。",
      "INTEGER 存整数，REAL 存小数，文字用 text/alphanumeric，BOOLEAN 表示真假，日期时间用于相应信息。先看字段含义和示例，再选择类型。"
    ],
    "exerciseIds": [
      "ig-fields",
      "ig-key",
      "ig-type"
    ]
  },
  {
    "id": "ig-select",
    "level": "ig",
    "title": "选择要显示的字段",
    "subtitle": "SELECT 与 FROM 是查询的骨架",
    "minutes": 7,
    "keywords": [
      "SELECT",
      "FROM",
      "field list"
    ],
    "dataset": "campus",
    "example": "SELECT Name, House\nFROM STUDENT;",
    "body": [
      "SELECT 后写要显示的字段，用逗号分隔；FROM 后写数据表。结果列按字段列表排列。选两列不会删除原表的其他字段。",
      "字段名和表名是标识符，文字值才放在引号里。只需显示名字和分院时，不要额外选出编号或分数。",
      "建议把子句分行、关键字大写，并以分号结束。执行查询后，对照右侧数据表检查返回的是哪些列。"
    ],
    "exerciseIds": [
      "ig-select-names",
      "ig-select-books",
      "ig-select-customers"
    ]
  },
  {
    "id": "ig-where",
    "level": "ig",
    "title": "用条件找到记录",
    "subtitle": "文字、数字与布尔值分别比较",
    "minutes": 9,
    "keywords": [
      "WHERE",
      "=",
      "<>",
      ">",
      "<",
      ">=",
      "<="
    ],
    "dataset": "campus",
    "example": "SELECT Name, Score\nFROM STUDENT\nWHERE Score >= 80;",
    "body": [
      "WHERE 筛选记录，SELECT 选择输出列。用于筛选的字段不必出现在结果中。文字值如 'Cedar' 加引号，数字通常不加。",
      "大于等于包含边界值，大于不包含；不等于使用 <>。看到“至少”先考虑 >=，看到“超过”先考虑 >。",
      "对 BOOLEAN 字段建议显式写 = TRUE 或 = FALSE。历史试卷也会出现 YES/NO 等表示；本工具按布尔字段类型解释这些写法，普通文本仍按文本比较。"
    ],
    "exerciseIds": [
      "ig-where-house",
      "ig-where-score",
      "ig-where-boolean"
    ]
  },
  {
    "id": "ig-logic",
    "level": "ig",
    "title": "组合多个条件",
    "subtitle": "AND 同时满足，OR 至少满足一个",
    "minutes": 8,
    "keywords": [
      "AND",
      "OR",
      "WHERE"
    ],
    "dataset": "campus",
    "example": "SELECT Name\nFROM STUDENT\nWHERE Active = TRUE AND Score >= 80;",
    "body": [
      "AND 要求两个条件都成立，例如既活跃又达到分数线。OR 要求至少一个条件成立，例如属于 Maple 或 Willow。",
      "每一侧都写完整条件。House = 'Maple' OR 'Willow' 没有完整表达第二次字段比较，不是本课采用的规范写法。",
      "先分别核对每个条件能选出谁，再求交集或并集。混合条件可用括号明确分组，避免依赖记忆顺序。"
    ],
    "exerciseIds": [
      "ig-and-active",
      "ig-or-houses",
      "ig-and-stock"
    ]
  },
  {
    "id": "ig-sort",
    "level": "ig",
    "title": "让结果按顺序出现",
    "subtitle": "ORDER BY 控制行顺序",
    "minutes": 8,
    "keywords": [
      "ORDER BY",
      "ASCENDING",
      "DESCENDING"
    ],
    "dataset": "library",
    "example": "SELECT Title, Price$\nFROM BOOK\nORDER BY Price$ ASCENDING;",
    "body": [
      "ORDER BY 位于筛选之后。ASCENDING 表示递增，DESCENDING 表示递减。本工具同时理解常见 SQL 缩写 ASC 和 DESC。",
      "没有写方向时采用递增。数字按大小比较，文字按顺序比较；排序字段不一定需要显示在 SELECT 的结果列中。",
      "要求从高到低时必须体现递减；没有 ORDER BY 的查询不能保证通用数据库会以你期待的顺序返回。遇到并列值，题目应说明是否需要第二排序条件。"
    ],
    "exerciseIds": [
      "ig-sort-price",
      "ig-sort-title",
      "ig-sort-hidden"
    ]
  },
  {
    "id": "ig-aggregate",
    "level": "ig",
    "title": "区分总数与总量",
    "subtitle": "COUNT 计数，SUM 累加",
    "minutes": 9,
    "keywords": [
      "SUM",
      "COUNT",
      "WHERE"
    ],
    "dataset": "library",
    "example": "SELECT SUM(Stock)\nFROM BOOK\nWHERE Genre = 'Computing';",
    "body": [
      "COUNT 计算参与统计的记录或非空字段值数量。SUM 把数字字段累加。“有多少种书”和“库存一共有多少本”是不同问题。",
      "WHERE 先筛选记录，再做统计。计算计算机类库存时，要先限定 Genre，再对 Stock 求和。",
      "聚合查询通常返回一个汇总值；不能把一个普通字段和整体总和随意放在一起，否则该字段属于哪条记录就不明确。分组汇总在 AS 内容中学习。"
    ],
    "exerciseIds": [
      "ig-sum-stock",
      "ig-count-active",
      "ig-sum-unpaid"
    ]
  },
  {
    "id": "ig-read",
    "level": "ig",
    "title": "读 SQL，写出结果",
    "subtitle": "把纸面推演和真实运行对照",
    "minutes": 10,
    "keywords": [
      "output prediction",
      "projection",
      "filter",
      "order"
    ],
    "dataset": "campus",
    "example": "SELECT Name, Score\nFROM STUDENT\nWHERE Score >= 80\nORDER BY Score DESCENDING;",
    "body": [
      "预测结果时依次处理：找到表，应用条件，按要求排序，最后按 SELECT 的列次序写值。不要把字段名、引号或 SQL 逗号误当成数据内容。",
      "本工具的预测题用 CSV 表示结果：每行一条记录，列之间用逗号分隔，不写表头。提交后可以查看标准结果与解释。",
      "实际查询中筛选字段、排序字段和输出字段可以不同。完成推演后在实验室运行同一条 SQL，能直接检查自己的理解。"
    ],
    "exerciseIds": [
      "ig-predict-score",
      "ig-predict-zero",
      "ig-predict-count",
      "ig-concept-clauses"
    ]
  },
  {
    "id": "as-types",
    "level": "as",
    "title": "为数据选择类型",
    "subtitle": "从字段含义写出表结构",
    "minutes": 9,
    "keywords": [
      "CHARACTER",
      "VARCHAR",
      "BOOLEAN",
      "INTEGER",
      "REAL",
      "DATE",
      "TIME"
    ],
    "dataset": "campus",
    "example": "CREATE TABLE ROOM (\n  RoomID INTEGER,\n  RoomName VARCHAR(30),\n  Capacity INTEGER\n);",
    "body": [
      "9618 使用 CHARACTER、VARCHAR(n)、BOOLEAN、INTEGER、REAL、DATE、TIME。CHARACTER 适合字符数据，VARCHAR(n) 用于有长度上限的变长文字。",
      "数量通常用 INTEGER，允许小数的测量值用 REAL，日期与时刻分别用 DATE 和 TIME。不要因为一个编号只含数字就必须把它作为可计算的整数。",
      "CREATE TABLE 需要表名和括号内的字段定义，每个字段包含名字与类型，字段之间用逗号。下面任务会明确给出长度，便于检查结构。"
    ],
    "exerciseIds": [
      "as-type-amount",
      "as-type-time",
      "as-create-types"
    ]
  },
  {
    "id": "as-create",
    "level": "as",
    "title": "建立数据库与新表",
    "subtitle": "CREATE 从结构开始",
    "minutes": 10,
    "keywords": [
      "CREATE DATABASE",
      "CREATE TABLE",
      "PRIMARY KEY"
    ],
    "dataset": "campus",
    "example": "CREATE TABLE AWARD (\n  AwardID INTEGER,\n  AwardName VARCHAR(40),\n  PRIMARY KEY (AwardID)\n);",
    "body": [
      "数据库容纳多张表，表再保存记录。CREATE DATABASE 声明数据库；CREATE TABLE 声明表及字段。新表尚未插入数据时没有记录。",
      "PRIMARY KEY 指定唯一标识，字段值不能重复。可在字段定义后写主键，也可用表级 PRIMARY KEY (...) 表达。",
      "本工具把 CREATE DATABASE 实现为新的空白本地沙盒。切换或重置练习可以恢复初始数据，不会修改其他学生的数据。"
    ],
    "exerciseIds": [
      "as-create-database",
      "as-create-award"
    ]
  },
  {
    "id": "as-alter",
    "level": "as",
    "title": "修改结构与建立关联",
    "subtitle": "ALTER TABLE 添加字段和键",
    "minutes": 12,
    "keywords": [
      "ALTER TABLE",
      "ADD",
      "PRIMARY KEY",
      "FOREIGN KEY",
      "REFERENCES"
    ],
    "dataset": "library",
    "example": "ALTER TABLE BOOK\nADD FOREIGN KEY (PublisherID)\nREFERENCES PUBLISHER(PublisherID);",
    "body": [
      "已有表需要新字段时，用 ALTER TABLE 表名 ADD 字段名 类型。结构改变不会自动替你提供每条旧记录的新字段内容。",
      "添加主键前，已有数据必须能满足唯一性。外键保存另一张表的键，用 REFERENCES 指明目标表与字段。",
      "BOOK 的 PublisherID 关联 PUBLISHER 的 PublisherID；许多书可以由同一出版社出版。外键约束会阻止不存在出版社的编号，连接查询则负责把两表信息组合展示。"
    ],
    "exerciseIds": [
      "as-alter-email",
      "as-alter-two",
      "as-alter-primary",
      "as-alter-foreign"
    ]
  },
  {
    "id": "as-insert",
    "level": "as",
    "title": "增加新记录",
    "subtitle": "字段列表和 VALUES 一一对应",
    "minutes": 8,
    "keywords": [
      "INSERT INTO",
      "VALUES"
    ],
    "dataset": "campus",
    "example": "INSERT INTO CLUB (ClubID, ClubName, Room)\nVALUES ('C05', 'Photography', 'D10');",
    "body": [
      "INSERT INTO 增加记录。写出字段列表能明确每个值的含义；VALUES 中的顺序必须与字段列表对应。",
      "文字、日期和时刻使用合适的引号，数字与 TRUE/FALSE 按各自类型输入。主键不能与已有记录冲突，外键值必须指向已有记录。",
      "提交后不仅检查新记录出现，还要确认旧数据没有改变。每道练习从独立的初始数据开始。"
    ],
    "exerciseIds": [
      "as-insert-club",
      "as-insert-student",
      "as-insert-book"
    ]
  },
  {
    "id": "as-update",
    "level": "as",
    "title": "更新指定记录",
    "subtitle": "SET 修改值，WHERE 限定目标",
    "minutes": 9,
    "keywords": [
      "UPDATE",
      "SET",
      "WHERE"
    ],
    "dataset": "library",
    "example": "UPDATE BOOK\nSET Stock = 10\nWHERE BookID = 202;",
    "body": [
      "UPDATE 表名后用 SET 指定新值，再用 WHERE 找到要修改的记录。只改一条记录时，唯一主键常是最清晰的条件。",
      "可以用逗号分隔多个字段更新。查询条件与更新内容承担不同角色：WHERE 找记录，SET 改字段。",
      "漏掉 WHERE 会影响整张表。先用相同条件 SELECT 查看目标，再执行更新，是理解影响范围的好习惯。"
    ],
    "exerciseIds": [
      "as-update-stock",
      "as-update-two",
      "as-update-paid"
    ]
  },
  {
    "id": "as-delete",
    "level": "as",
    "title": "删除符合条件的记录",
    "subtitle": "DELETE FROM 保留表结构",
    "minutes": 8,
    "keywords": [
      "DELETE FROM",
      "WHERE"
    ],
    "dataset": "library",
    "example": "DELETE FROM BOOK\nWHERE Stock = 0;",
    "body": [
      "DELETE FROM 删除满足 WHERE 的记录，表和字段定义仍然存在。它与删去某一列、把某字段设为零是不同操作。",
      "条件要表达完整意图，例如既属于指定类别又库存为零。只写其中一个条件可能删掉仍需保留的数据。",
      "有关联约束时，删除被其他表引用的记录可能失败。本课在独立沙盒中练习；重置会恢复原始数据。"
    ],
    "exerciseIds": [
      "as-delete-one",
      "as-delete-fiction",
      "as-delete-orders"
    ]
  },
  {
    "id": "as-group",
    "level": "as",
    "title": "按类别生成统计",
    "subtitle": "AVG 与 GROUP BY",
    "minutes": 11,
    "keywords": [
      "AVG",
      "GROUP BY",
      "COUNT",
      "SUM",
      "AS"
    ],
    "dataset": "library",
    "example": "SELECT Genre, SUM(Stock) AS TotalStock\nFROM BOOK\nGROUP BY Genre\nORDER BY Genre;",
    "body": [
      "AVG 求数字字段平均值。GROUP BY 把相同类别的记录分组，每组分别计算 SUM、COUNT 或 AVG。",
      "选择分组字段和聚合结果时，普通字段应列在 GROUP BY 中。例如按 Genre 分组后，不能任意附上一条书名。",
      "AS 为结果列提供有意义的名称。聚合别名方便阅读，不会重命名原表字段。WHERE 在分组之前筛选参与记录。"
    ],
    "exerciseIds": [
      "as-average",
      "as-group-stock",
      "as-group-payment"
    ]
  },
  {
    "id": "as-like",
    "level": "as",
    "title": "按文字模式查找",
    "subtitle": "LIKE 与 % 表达不完整线索",
    "minutes": 9,
    "keywords": [
      "LIKE",
      "%",
      "WHERE"
    ],
    "dataset": "library",
    "example": "SELECT Title\nFROM BOOK\nWHERE Title LIKE '%Code%';",
    "body": [
      "LIKE 用模式匹配文字，% 表示零个或多个字符。'River%' 表示以 River 开头，'%Garden' 表示以 Garden 结束。",
      "包含某段文字时，模式两侧都放 %。模式本身是文字值，要加引号；等号比较完整值，不把 % 当通配符。",
      "本课使用 % 作为默认模式写法。历史题中的其他通配符写法只在有具体来源和工具支持时兼容，不能随意混用不同数据库方言。"
    ],
    "exerciseIds": [
      "as-like-prefix",
      "as-like-contains",
      "as-like-suffix"
    ]
  },
  {
    "id": "as-join",
    "level": "as",
    "title": "连接两张关联表",
    "subtitle": "INNER JOIN 与键的匹配",
    "minutes": 13,
    "keywords": [
      "INNER JOIN",
      "ON",
      "table.field",
      "GROUP BY"
    ],
    "dataset": "shop",
    "example": "SELECT CUSTOMER.CustomerName, ORDERS.OrderID, ORDERS.Total\nFROM CUSTOMER\nINNER JOIN ORDERS ON CUSTOMER.CustomerID = ORDERS.CustomerID\nWHERE ORDERS.Paid = TRUE;",
    "body": [
      "INNER JOIN 只组合连接条件匹配的记录。一个客户有多张订单，就会在连接结果中出现多次；没有订单的客户不会出现在内连接结果中。",
      "用 表名.字段名 消除歧义，尤其是两表都有 CustomerID 时。ON 表达关联键条件，WHERE 再筛选已关联的记录。",
      "9618 查询范围最多两张表。本课把连接与排序、计数、求和结合，检查键是否正确以及是否遗漏筛选条件。"
    ],
    "exerciseIds": [
      "as-join-clubs",
      "as-join-publishers",
      "as-join-summary"
    ]
  }
];

export const exercises = [
  {
    "level": "ig",
    "kind": "concept",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-fields",
    "lessonId": "ig-foundations",
    "title": "分清字段与记录",
    "prompt": "The STUDENT table has eight data rows and seven named columns. How many records and fields does it contain?",
    "brief": "表头不算记录；一名学生占一行。",
    "dataset": "campus",
    "options": [
      "8 records and 7 fields",
      "7 records and 8 fields",
      "9 records and 7 fields",
      "8 records and 8 fields"
    ],
    "answer": 0,
    "hints": [
      "先把行和列分开。",
      "每一条数据行对应一条记录。",
      "8 条数据行是 8 条记录；7 个列名对应 7 个字段。"
    ],
    "explanation": "记录是行，字段是列；表头描述字段，不是第九名学生。",
    "objectives": [
      "区分字段与记录"
    ]
  },
  {
    "level": "ig",
    "kind": "concept",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-key",
    "lessonId": "ig-foundations",
    "title": "选一个可靠的主键",
    "prompt": "Which field is the most suitable primary key for STUDENT, given that StudentID is unique and never reused?",
    "brief": "姓名、分院和分数都可能重复。",
    "dataset": "campus",
    "options": [
      "StudentID",
      "Name",
      "House",
      "Score"
    ],
    "answer": 0,
    "hints": [
      "主键必须区分每一条记录。",
      "名字相同的学生仍然是两个人。",
      "题目保证 StudentID 唯一且不会被重新分配。"
    ],
    "explanation": "StudentID 满足给定唯一性条件。仅因为当前样本的姓名没有重复，不能保证姓名始终适合主键。",
    "objectives": [
      "选择主键"
    ]
  },
  {
    "level": "ig",
    "kind": "concept",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-type",
    "lessonId": "ig-foundations",
    "title": "是否活跃用什么类型",
    "prompt": "Active stores only whether a student is active or inactive. Which data type best describes this field?",
    "brief": "只存在两种状态。",
    "dataset": "campus",
    "options": [
      "Boolean",
      "Real",
      "Date/time",
      "Integer because every field must be numeric"
    ],
    "answer": 0,
    "hints": [
      "考虑字段的含义，不只看屏幕上的 1 和 0。",
      "这个字段只有真与假两种情况。",
      "Boolean 专门表示两种真假状态。"
    ],
    "explanation": "Active 在表结构中声明为 BOOLEAN。界面用 1/0 展示存储值，语义仍然是 TRUE/FALSE。",
    "objectives": [
      "识别布尔类型"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-select-names",
    "lessonId": "ig-select",
    "title": "制作分院名单",
    "prompt": "Display only Name and House, in that order, for every student.",
    "brief": "不用筛选，选择两列即可。",
    "dataset": "campus",
    "solution": "SELECT Name, House FROM STUDENT;",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "先决定输出字段。",
      "字段间使用逗号；表名是 STUDENT。",
      "SELECT 后写 Name, House，FROM 后写 STUDENT。"
    ],
    "explanation": "SELECT 决定结果列；没有 WHERE 时读取所有学生记录。",
    "objectives": [
      "SELECT",
      "FROM",
      "字段列表"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-select-books",
    "lessonId": "ig-select",
    "title": "制作书价清单",
    "prompt": "Display only Title and Price$, in that order, for all books.",
    "brief": "Price$ 是完整字段名，包含美元符号。",
    "dataset": "library",
    "solution": "SELECT Title, Price$ FROM BOOK;",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 7.5, 6, 0, 1), (210, 'Low Tide', 'Fiction', 22, 1, 1, 2);"
      }
    ],
    "hints": [
      "查看 BOOK 的字段名称。",
      "单价字段不是 Price，而是 Price$。",
      "SELECT Title, Price$ 后接 FROM BOOK。"
    ],
    "explanation": "真实题面可能含 Price$ 这类字段名；应精确使用给定标识符。",
    "objectives": [
      "精确标识符",
      "选择字段"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-select-customers",
    "lessonId": "ig-select",
    "title": "导出客户所在地",
    "prompt": "Display only CustomerName and City, in that order, for all customers.",
    "brief": "本题只使用 CUSTOMER 一张表。",
    "dataset": "shop",
    "solution": "SELECT CustomerName, City FROM CUSTOMER;",
    "checks": [
      {
        "seed": "INSERT INTO CUSTOMER VALUES (7, 'Zara Bell', 'York', 0);"
      }
    ],
    "hints": [
      "需要的是客户资料，不是订单。",
      "FROM 指向 CUSTOMER。",
      "输出列是 CustomerName, City。"
    ],
    "explanation": "一个数据库可以有多张表，单表查询只从 FROM 指定的表读取数据。",
    "objectives": [
      "选择正确数据表"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-where-house",
    "lessonId": "ig-where",
    "title": "找到 Cedar 学生",
    "prompt": "Display only StudentID and Name for students whose House is Cedar.",
    "brief": "Cedar 是文字值，需要引号。",
    "dataset": "campus",
    "solution": "SELECT StudentID, Name FROM STUDENT WHERE House = 'Cedar';",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "筛选条件放在 WHERE。",
      "条件字段是 House，而不是 Name。",
      "使用 House = 'Cedar'。"
    ],
    "explanation": "筛选字段不必成为输出字段。本题输出编号和姓名，用 House 决定是否保留记录。",
    "objectives": [
      "文字等值筛选"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-where-score",
    "lessonId": "ig-where",
    "title": "找出达到 80 分的人",
    "prompt": "Display only Name and Score for students with a score of at least 80.",
    "brief": "“至少 80”包含恰好 80。",
    "dataset": "campus",
    "solution": "SELECT Name, Score FROM STUDENT WHERE Score >= 80;",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Cedar', 80, 1, 'C01'),(110, 'Juno', 10, 'Maple', 79, 1, 'C02');"
      }
    ],
    "hints": [
      "找出分数字段。",
      "至少表示大于或等于。",
      "WHERE Score >= 80 会包含边界分数。"
    ],
    "explanation": "使用 > 会遗漏恰好 80 分的学生；额外检查数据包含边界值，防止偶然通过。",
    "objectives": [
      ">=",
      "边界值"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-where-boolean",
    "lessonId": "ig-where",
    "title": "列出没有电子版的书",
    "prompt": "Display only BookID and Title for books where Digital is false.",
    "brief": "Digital 是 Boolean 字段。",
    "dataset": "library",
    "solution": "SELECT BookID, Title FROM BOOK WHERE Digital = FALSE;",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 7.5, 6, 0, 1), (210, 'Low Tide', 'Fiction', 22, 1, 1, 2);"
      }
    ],
    "hints": [
      "先找到表示电子版的字段。",
      "FALSE 表示没有电子版。",
      "WHERE Digital = FALSE 之后只保留两列输出。"
    ],
    "explanation": "布尔字段表达真假，显式 TRUE/FALSE 比较清晰地说明查询意图。",
    "objectives": [
      "布尔筛选"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 2,
    "minutes": 3,
    "id": "ig-and-active",
    "lessonId": "ig-logic",
    "title": "筛出活跃高分学生",
    "prompt": "Display only Name for students who are active and have Score at least 80.",
    "brief": "两个条件必须同时成立。",
    "dataset": "campus",
    "solution": "SELECT Name FROM STUDENT WHERE Active = TRUE AND Score >= 80;",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "分别写活跃条件与分数条件。",
      "两个条件之间用 AND。",
      "Active = TRUE AND Score >= 80。"
    ],
    "explanation": "Chen 分数很高但不活跃，所以不能入选；AND 要求两边都满足。",
    "objectives": [
      "AND",
      "复合条件"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 2,
    "minutes": 3,
    "id": "ig-or-houses",
    "lessonId": "ig-logic",
    "title": "合并两个分院的名单",
    "prompt": "Display only Name and House for students in either Maple or Willow.",
    "brief": "属于任一分院即可。",
    "dataset": "campus",
    "solution": "SELECT Name, House FROM STUDENT WHERE House = 'Maple' OR House = 'Willow';",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "同一个学生不需要同时属于两个分院。",
      "使用 OR，把两次比较都写完整。",
      "House = 'Maple' OR House = 'Willow'。"
    ],
    "explanation": "OR 保留至少满足一个条件的记录。重复写 House 能清楚表达两个完整条件。",
    "objectives": [
      "OR",
      "文字条件"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 2,
    "minutes": 3,
    "id": "ig-and-stock",
    "lessonId": "ig-logic",
    "title": "找出便宜且有库存的书",
    "prompt": "Display only Title and Price$ for books costing less than 15 with Stock not equal to 0.",
    "brief": "同时检查价格与库存；不等于用 <>。",
    "dataset": "library",
    "solution": "SELECT Title, Price$ FROM BOOK WHERE Price$ < 15 AND Stock <> 0;",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 15, 6, 0, 1),(210, 'Low Tide', 'Fiction', 7, 0, 1, 2),(211, 'Small Paths', 'Fiction', 7, 2, 0, 2);"
      }
    ],
    "hints": [
      "低于 15 使用 <，不是 <=。",
      "非零库存使用 <> 0。",
      "把 Price$ < 15 和 Stock <> 0 用 AND 连接。"
    ],
    "explanation": "便宜但缺货的书不符合要求，恰好 15 的书也不符合“less than”。",
    "objectives": [
      "<",
      "<>",
      "AND"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": true,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-sort-price",
    "lessonId": "ig-sort",
    "title": "最贵的书排在前面",
    "prompt": "Display Title and Price$ for all books, ordered from highest price to lowest.",
    "brief": "价格递减排列。",
    "dataset": "library",
    "solution": "SELECT Title, Price$ FROM BOOK ORDER BY Price$ DESCENDING;",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 7.5, 6, 0, 1), (210, 'Low Tide', 'Fiction', 22, 1, 1, 2);"
      }
    ],
    "hints": [
      "排序使用 ORDER BY。",
      "从高到低是递减。",
      "在 Price$ 后指定 DESCENDING。"
    ],
    "explanation": "ORDER BY 改变结果行次序，不会更改原表中任何价格。",
    "objectives": [
      "ORDER BY",
      "DESCENDING"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": true,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-sort-title",
    "lessonId": "ig-sort",
    "title": "按书名建立索引",
    "prompt": "Display only Title for all books in ascending alphabetical order.",
    "brief": "按书名递增，只显示书名。",
    "dataset": "library",
    "solution": "SELECT Title FROM BOOK ORDER BY Title ASCENDING;",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 7.5, 6, 0, 1), (210, 'Low Tide', 'Fiction', 22, 1, 1, 2);"
      }
    ],
    "hints": [
      "结果只有一列。",
      "排序字段也是 Title。",
      "ORDER BY Title ASCENDING。"
    ],
    "explanation": "文字排序与数值排序使用相同子句；省略方向时默认递增。",
    "objectives": [
      "ASCENDING",
      "文字排序"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": true,
    "difficulty": 2,
    "minutes": 3,
    "id": "ig-sort-hidden",
    "lessonId": "ig-sort",
    "title": "只显示姓名，按成绩排列",
    "prompt": "Display only Name for YearGroup 10, ordered by Score from lowest to highest.",
    "brief": "Score 用于排序，但不要输出分数。",
    "dataset": "campus",
    "solution": "SELECT Name FROM STUDENT WHERE YearGroup = 10 ORDER BY Score ASCENDING;",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "先筛选 10 年级。",
      "SELECT 只保留 Name。",
      "WHERE 后再写 ORDER BY Score ASCENDING。"
    ],
    "explanation": "排序字段不必出现在结果里；SELECT、WHERE 和 ORDER BY 各自承担不同职责。",
    "objectives": [
      "筛选后排序",
      "未输出字段排序"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-sum-stock",
    "lessonId": "ig-aggregate",
    "title": "计算计算机类总库存",
    "prompt": "Return one value: the total Stock of books whose Genre is Computing.",
    "brief": "统计本数总量，不是书种数量。",
    "dataset": "library",
    "solution": "SELECT SUM(Stock) FROM BOOK WHERE Genre = 'Computing';",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 7.5, 6, 0, 1), (210, 'Low Tide', 'Fiction', 22, 1, 1, 2);"
      }
    ],
    "hints": [
      "需要把库存数字相加。",
      "使用 SUM(Stock)。",
      "先在 WHERE 中限定 Genre = 'Computing'。"
    ],
    "explanation": "初始数据中 8、5、4 本合计 17 本；COUNT 只会数出 3 种书。",
    "objectives": [
      "SUM",
      "聚合前筛选"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-count-active",
    "lessonId": "ig-aggregate",
    "title": "统计活跃学生人数",
    "prompt": "Return one value: the number of active students.",
    "brief": "每名学生一条记录，用唯一编号计数。",
    "dataset": "campus",
    "solution": "SELECT COUNT(StudentID) FROM STUDENT WHERE Active = TRUE;",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "求人数用 COUNT。",
      "StudentID 每条记录都有值。",
      "COUNT(StudentID) 配合 Active = TRUE。"
    ],
    "explanation": "COUNT 统计符合条件的学生记录。初始数据有 5 名活跃学生。",
    "objectives": [
      "COUNT",
      "Boolean"
    ]
  },
  {
    "level": "ig",
    "kind": "sql",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-sum-unpaid",
    "lessonId": "ig-aggregate",
    "title": "合计尚未支付的金额",
    "prompt": "Return one value: the sum of Total for all orders where Paid is false.",
    "brief": "只计算未支付订单金额。",
    "dataset": "shop",
    "solution": "SELECT SUM(Total) FROM ORDERS WHERE Paid = FALSE;",
    "checks": [
      {
        "seed": "INSERT INTO ORDERS VALUES (309, 6, 25, 0, '2026-04-22');"
      }
    ],
    "hints": [
      "订单金额字段是 Total。",
      "总金额应使用 SUM，不是 COUNT。",
      "在 ORDERS 中用 Paid = FALSE 筛选。"
    ],
    "explanation": "初始未支付金额为 20 + 35 + 55 = 110，新增订单后答案应随数据变化。",
    "objectives": [
      "SUM",
      "布尔筛选"
    ]
  },
  {
    "level": "ig",
    "kind": "predict",
    "starter": "SELECT Name, Score\nFROM STUDENT\nWHERE Score >= 80\nORDER BY Score DESCENDING;",
    "ordered": true,
    "difficulty": 2,
    "minutes": 3,
    "id": "ig-predict-score",
    "lessonId": "ig-read",
    "title": "预测高分榜",
    "prompt": "Write the output of the SQL below as CSV rows, without a header.",
    "brief": "每行按 Name,Score 顺序，使用逗号分隔。",
    "dataset": "campus",
    "solution": "SELECT Name, Score FROM STUDENT WHERE Score >= 80 ORDER BY Score DESCENDING;",
    "expected": "Chen,92\nGrace,88\nDina,84",
    "hints": [
      "先找出达到 80 分的三条记录。",
      "分数从高到低为 92、88、84。",
      "每行只写姓名和分数，不写表头。"
    ],
    "explanation": "筛选后按分数递减排列，输出 Chen、Grace、Dina 的姓名和分数。",
    "objectives": [
      "输出预测",
      "筛选",
      "排序"
    ]
  },
  {
    "level": "ig",
    "kind": "predict",
    "starter": "SELECT Title, Stock\nFROM BOOK\nWHERE Stock = 0\nORDER BY Title;",
    "ordered": true,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-predict-zero",
    "lessonId": "ig-read",
    "title": "预测缺货清单",
    "prompt": "Write the output of the SQL below as CSV rows, without a header.",
    "brief": "每行按 Title,Stock 顺序；保留书名中的空格。",
    "dataset": "library",
    "solution": "SELECT Title, Stock FROM BOOK WHERE Stock = 0 ORDER BY Title;",
    "expected": "Ocean Maps,0\nPaper Moon,0",
    "hints": [
      "库存为 0 的书有两种。",
      "按书名递增，Ocean 在 Paper 之前。",
      "两行的第二列都为 0。"
    ],
    "explanation": "ORDER BY Title 没有方向时按递增排列；不能把所有书名都输出。",
    "objectives": [
      "输出预测",
      "默认排序"
    ]
  },
  {
    "level": "ig",
    "kind": "predict",
    "starter": "SELECT COUNT(BookID)\nFROM BOOK\nWHERE Digital = TRUE;",
    "ordered": false,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-predict-count",
    "lessonId": "ig-read",
    "title": "预测聚合结果",
    "prompt": "Write the single value returned by the SQL below.",
    "brief": "聚合输出只有一个数字，不列出书名。",
    "dataset": "library",
    "solution": "SELECT COUNT(BookID) FROM BOOK WHERE Digital = TRUE;",
    "expected": "4",
    "hints": [
      "先找出 Digital 为真的记录。",
      "BookID 201、203、204、207 都符合。",
      "统计这些记录的数量。"
    ],
    "explanation": "COUNT 返回记录数量 4，不是它们的库存总和。",
    "objectives": [
      "COUNT 输出预测"
    ]
  },
  {
    "level": "ig",
    "kind": "concept",
    "starter": "SELECT \nFROM ;",
    "ordered": false,
    "difficulty": 1,
    "minutes": 3,
    "id": "ig-concept-clauses",
    "lessonId": "ig-read",
    "title": "辨认三个子句的职责",
    "prompt": "Which description correctly explains SELECT, FROM and WHERE?",
    "brief": "把输出字段、数据表和筛选条件区分开。",
    "dataset": "campus",
    "options": [
      "SELECT chooses fields; FROM identifies the table; WHERE filters records.",
      "SELECT sorts records; FROM chooses fields; WHERE names the database.",
      "SELECT changes data; FROM filters rows; WHERE chooses columns.",
      "All three commands create a new table."
    ],
    "answer": 0,
    "hints": [
      "SELECT 后面通常列出字段名。",
      "FROM 后面通常只有表名或连接来源。",
      "WHERE 后面写条件来决定保留哪些记录。"
    ],
    "explanation": "理解子句职责能帮助定位错误：错误的列看 SELECT，错误的数据源看 FROM，错误的记录看 WHERE。",
    "objectives": [
      "SQL 子句作用"
    ]
  },
  {
    "level": "as",
    "kind": "concept",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-type-amount",
    "lessonId": "as-types",
    "title": "给测量值选择类型",
    "prompt": "A field stores a measured distance such as 2.75 metres. Which type from the course list is most suitable?",
    "brief": "需要保留小数部分。",
    "dataset": "campus",
    "options": [
      "REAL",
      "INTEGER",
      "BOOLEAN",
      "DATE"
    ],
    "answer": 0,
    "hints": [
      "整数类型不能保留 0.75。",
      "这不是日期，也不是真假状态。",
      "REAL 用于带小数的数值。"
    ],
    "explanation": "REAL 表示实数。INTEGER 适用于完整数量，但会丢失或拒绝该小数信息。",
    "objectives": [
      "REAL",
      "数据类型"
    ]
  },
  {
    "level": "as",
    "kind": "concept",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-type-time",
    "lessonId": "as-types",
    "title": "区分日期与时刻",
    "prompt": "A field records the time of day at which a visit begins, such as 09:30:00. Which type is most suitable?",
    "brief": "这里只存一天中的时刻，不存年月日。",
    "dataset": "campus",
    "options": [
      "TIME",
      "DATE",
      "BOOLEAN",
      "INTEGER"
    ],
    "answer": 0,
    "hints": [
      "例子包含小时、分钟和秒。",
      "DATE 记录年月日。",
      "TIME 表示一天中的时刻。"
    ],
    "explanation": "DATE 与 TIME 是不同类型；根据字段含义选择，而不是把所有日期时间信息都当作文字。",
    "objectives": [
      "TIME",
      "DATE"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-create-types",
    "lessonId": "as-types",
    "title": "创建访客登记结构",
    "prompt": "Create VISIT with these fields in this order: VisitID INTEGER, Badge CHARACTER, Visitor VARCHAR(40), Consent BOOLEAN, Score REAL, VisitDate DATE, VisitTime TIME. Do not add a key or records.",
    "brief": "按给定名称、类型和长度建表；Badge 保存一个字符。",
    "dataset": "campus",
    "schemaCheck": true,
    "focusTables": [
      "VISIT"
    ],
    "solution": "CREATE TABLE VISIT (VisitID INTEGER, Badge CHARACTER, Visitor VARCHAR(40), Consent BOOLEAN, Score REAL, VisitDate DATE, VisitTime TIME);",
    "hints": [
      "CREATE TABLE 后写 VISIT 和括号。",
      "每个字段由名字及类型组成，字段间加逗号。",
      "共有 7 个字段；Visitor 的最大长度是 40。"
    ],
    "explanation": "本题把七种课程类型放在同一个新表中。只定义结构，不需要 INSERT。",
    "objectives": [
      "CREATE TABLE",
      "七种数据类型"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-create-database",
    "lessonId": "as-create",
    "title": "建立独立数据库",
    "prompt": "Create a new database named RevisionHub.",
    "brief": "执行后进入一个新的空白练习数据库。",
    "dataset": "campus",
    "schemaCheck": true,
    "focusTables": [],
    "solution": "CREATE DATABASE RevisionHub;",
    "hints": [
      "数据库不是一张表。",
      "使用 CREATE DATABASE。",
      "命名为 RevisionHub，不需要字段列表。"
    ],
    "explanation": "CREATE DATABASE 定义新的数据库。本工具用独立沙盒模拟这一操作，并检查数据库名称。",
    "objectives": [
      "CREATE DATABASE"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-create-award",
    "lessonId": "as-create",
    "title": "建立有主键的奖项表",
    "prompt": "Create AWARD with AwardID INTEGER, AwardName VARCHAR(40), and Points INTEGER, in that order. Set AwardID as the primary key. Do not insert records.",
    "brief": "主键保证奖项编号唯一；文字长度明确为 40。",
    "dataset": "campus",
    "schemaCheck": true,
    "focusTables": [
      "AWARD"
    ],
    "solution": "CREATE TABLE AWARD (AwardID INTEGER, AwardName VARCHAR(40), Points INTEGER, PRIMARY KEY (AwardID));",
    "hints": [
      "先写三个字段定义。",
      "主键放在同一对括号内。",
      "用 PRIMARY KEY (AwardID) 指定唯一标识。"
    ],
    "explanation": "表结构包含字段类型和约束。只写一个名字含 ID 的字段并不会自动把它变成主键。",
    "objectives": [
      "CREATE TABLE",
      "PRIMARY KEY"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-alter-email",
    "lessonId": "as-alter",
    "title": "为学生增加邮箱字段",
    "prompt": "Add Email VARCHAR(60) to STUDENT. Keep all existing fields and records.",
    "brief": "修改现有表结构，不要重新创建空表。",
    "dataset": "campus",
    "schemaCheck": true,
    "focusTables": [
      "STUDENT"
    ],
    "solution": "ALTER TABLE STUDENT ADD Email VARCHAR(60);",
    "hints": [
      "已有表使用 ALTER TABLE。",
      "新增字段用 ADD。",
      "字段名为 Email，类型为 VARCHAR(60)。"
    ],
    "explanation": "添加字段后原记录保留；旧行的 Email 尚未赋值。本题验证结构和数据都保留。",
    "objectives": [
      "ALTER TABLE",
      "添加字段"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-alter-two",
    "lessonId": "as-alter",
    "title": "一次加入两个联系字段",
    "prompt": "Add GuardianName VARCHAR(40) and GuardianPhone CHARACTER(12), in that order, to STUDENT. Keep all current records.",
    "brief": "同一条 ALTER 中的两个新增字段用逗号分隔。",
    "dataset": "campus",
    "schemaCheck": true,
    "focusTables": [
      "STUDENT"
    ],
    "solution": "ALTER TABLE STUDENT ADD GuardianName VARCHAR(40), GuardianPhone CHARACTER(12);",
    "hints": [
      "用 ALTER TABLE STUDENT ADD 开始。",
      "每个新字段都需要自己的类型。",
      "GuardianName VARCHAR(40), GuardianPhone CHARACTER(12)。"
    ],
    "explanation": "这个课程兼容的 ALTER 形式可以一次添加多个字段，新增列的先后由定义顺序决定。",
    "objectives": [
      "ALTER TABLE",
      "多字段添加"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-alter-primary",
    "lessonId": "as-alter",
    "title": "给已有数据加主键",
    "prompt": "BADGE has been created without a key. Add a primary key on BadgeID and preserve its records.",
    "brief": "系统已准备 BADGE；只需要添加约束。",
    "dataset": "campus",
    "setup": "CREATE TABLE BADGE (BadgeID INTEGER, Label VARCHAR(30)); INSERT INTO BADGE VALUES (1, 'Helper'), (2, 'Mentor');",
    "schemaCheck": true,
    "focusTables": [
      "BADGE"
    ],
    "solution": "ALTER TABLE BADGE ADD PRIMARY KEY (BadgeID);",
    "hints": [
      "目标是已有的 BADGE 表。",
      "ADD 后定义 PRIMARY KEY。",
      "PRIMARY KEY (BadgeID) 指定唯一字段。"
    ],
    "explanation": "已有 BadgeID 值互不重复，因此可以建立主键；有重复或缺失值时应先处理数据。",
    "objectives": [
      "ALTER TABLE",
      "添加主键"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-alter-foreign",
    "lessonId": "as-alter",
    "title": "约束图书的出版社编号",
    "prompt": "Add a foreign key on BOOK.PublisherID that references PUBLISHER.PublisherID. Preserve every record.",
    "brief": "外键列属于 BOOK，目标键属于 PUBLISHER。",
    "dataset": "library",
    "schemaCheck": true,
    "focusTables": [
      "BOOK"
    ],
    "solution": "ALTER TABLE BOOK ADD FOREIGN KEY (PublisherID) REFERENCES PUBLISHER(PublisherID);",
    "hints": [
      "被修改的表是 BOOK。",
      "FOREIGN KEY 括号中写本表的 PublisherID。",
      "REFERENCES PUBLISHER(PublisherID) 指向目标键。"
    ],
    "explanation": "每本书只能引用存在的出版社编号；多本书仍然可以引用同一个出版社。",
    "objectives": [
      "ALTER TABLE",
      "FOREIGN KEY",
      "REFERENCES"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-insert-club",
    "lessonId": "as-insert",
    "title": "登记新社团",
    "prompt": "Insert a club with ClubID C05, ClubName Photography, and Room D10 into CLUB. Keep existing clubs.",
    "brief": "先写字段列表，再写对应的三个值。",
    "dataset": "campus",
    "focusTables": [
      "CLUB"
    ],
    "solution": "INSERT INTO CLUB (ClubID, ClubName, Room) VALUES ('C05', 'Photography', 'D10');",
    "hints": [
      "使用 INSERT INTO CLUB。",
      "这三个值都是文字。",
      "字段顺序 ClubID, ClubName, Room 要与 VALUES 一致。"
    ],
    "explanation": "插入不会替换旧记录。新编号 C05 不与已有社团冲突。",
    "objectives": [
      "INSERT INTO",
      "VALUES"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-insert-student",
    "lessonId": "as-insert",
    "title": "登记新成员",
    "prompt": "Insert StudentID 109, Name Imani, YearGroup 10, House Willow, Score 81, Active true, ClubID C01 into STUDENT.",
    "brief": "C01 是已存在的社团，可以作为外键。",
    "dataset": "campus",
    "focusTables": [
      "STUDENT"
    ],
    "solution": "INSERT INTO STUDENT (StudentID, Name, YearGroup, House, Score, Active, ClubID) VALUES (109, 'Imani', 10, 'Willow', 81, TRUE, 'C01');",
    "hints": [
      "列出七个字段。",
      "数字不用文字引号，姓名和编号 C01 要引号。",
      "Active 的值为 TRUE，ClubID 的值为 'C01'。"
    ],
    "explanation": "列顺序与值顺序必须对应，外键引用已有社团，才能得到有效的新记录。",
    "objectives": [
      "带类型插入",
      "外键值"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-insert-book",
    "lessonId": "as-insert",
    "title": "登记新到图书",
    "prompt": "Insert BookID 209, Title Small Signals, Genre Computing, Price$ 13.5, Stock 6, Digital false, PublisherID 2 into BOOK.",
    "brief": "注意 Price$ 字段名及小数价格。",
    "dataset": "library",
    "focusTables": [
      "BOOK"
    ],
    "solution": "INSERT INTO BOOK (BookID, Title, Genre, Price$, Stock, Digital, PublisherID) VALUES (209, 'Small Signals', 'Computing', 13.5, 6, FALSE, 2);",
    "hints": [
      "BOOK 有七个字段。",
      "Small Signals 是含空格的一个文字值。",
      "VALUES 的最后三个值为 6, FALSE, 2。"
    ],
    "explanation": "新书的文字、整数、小数与布尔信息要与对应字段类型匹配。",
    "objectives": [
      "INSERT INTO",
      "REAL",
      "Boolean"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-update-stock",
    "lessonId": "as-update",
    "title": "记录补货数量",
    "prompt": "Set Stock to 10 for the book with BookID 202. Change nothing else.",
    "brief": "只定位唯一编号 202。",
    "dataset": "library",
    "focusTables": [
      "BOOK"
    ],
    "solution": "UPDATE BOOK SET Stock = 10 WHERE BookID = 202;",
    "hints": [
      "UPDATE 后写 BOOK。",
      "SET 负责新库存值。",
      "WHERE BookID = 202 限定一条记录。"
    ],
    "explanation": "BookID 唯一标识目标。省略条件会错误地把所有图书库存改成 10。",
    "objectives": [
      "UPDATE",
      "SET",
      "WHERE"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-update-two",
    "lessonId": "as-update",
    "title": "同时调整售价和库存",
    "prompt": "For BookID 204, set Price$ to 16 and Stock to 9. Leave all other values unchanged.",
    "brief": "SET 内可使用逗号分隔两个赋值。",
    "dataset": "library",
    "focusTables": [
      "BOOK"
    ],
    "solution": "UPDATE BOOK SET Price$ = 16, Stock = 9 WHERE BookID = 204;",
    "hints": [
      "只需要一条 UPDATE。",
      "每个字段分别写 = 新值。",
      "SET Price$ = 16, Stock = 9，之后限制 BookID。"
    ],
    "explanation": "逗号连接 SET 中的多个赋值；AND 用于条件，不能代替这里的逗号。",
    "objectives": [
      "多字段更新"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-update-paid",
    "lessonId": "as-update",
    "title": "登记一位客户的付款",
    "prompt": "Mark all orders for CustomerID 3 as paid. Keep every other order unchanged.",
    "brief": "同一客户可能有不止一张订单。",
    "dataset": "shop",
    "focusTables": [
      "ORDERS"
    ],
    "solution": "UPDATE ORDERS SET Paid = TRUE WHERE CustomerID = 3;",
    "checks": [
      {
        "seed": "INSERT INTO ORDERS VALUES (309, 3, 22, 0, '2026-04-22'), (310, 6, 25, 0, '2026-04-22');"
      }
    ],
    "hints": [
      "修改 ORDERS 的 Paid 字段。",
      "目标是客户编号，不是某一订单编号。",
      "WHERE CustomerID = 3 应覆盖该客户所有订单。"
    ],
    "explanation": "使用客户条件能适应未来新增的同客户订单；硬编码当前某一张订单会漏改。",
    "objectives": [
      "多记录更新",
      "Boolean"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-delete-one",
    "lessonId": "as-delete",
    "title": "移除一条图书记录",
    "prompt": "Delete only the book with BookID 206 from BOOK. Keep the table and other records.",
    "brief": "删除记录，不删除表。",
    "dataset": "library",
    "focusTables": [
      "BOOK"
    ],
    "solution": "DELETE FROM BOOK WHERE BookID = 206;",
    "hints": [
      "使用 DELETE FROM。",
      "通过唯一编号选中目标。",
      "WHERE BookID = 206。"
    ],
    "explanation": "删除后 BOOK 的字段结构仍存在，只有目标记录消失。",
    "objectives": [
      "DELETE FROM"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-delete-fiction",
    "lessonId": "as-delete",
    "title": "清理缺货的小说记录",
    "prompt": "Delete every book whose Genre is Fiction and Stock is 0. Keep all other books.",
    "brief": "两个条件需要同时成立。",
    "dataset": "library",
    "focusTables": [
      "BOOK"
    ],
    "solution": "DELETE FROM BOOK WHERE Genre = 'Fiction' AND Stock = 0;",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Old Paths', 'Fiction', 7, 0, 0, 1), (210, 'Old Maps', 'Geography', 7, 0, 0, 2);"
      }
    ],
    "hints": [
      "先写小说类别条件。",
      "再加零库存条件，用 AND 连接。",
      "Genre = 'Fiction' AND Stock = 0。"
    ],
    "explanation": "仅按零库存删除会误删地理类书；仅按 Fiction 删除会误删仍有库存的小说。",
    "objectives": [
      "DELETE",
      "AND"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-delete-orders",
    "lessonId": "as-delete",
    "title": "清理低金额未支付订单",
    "prompt": "Delete orders that are unpaid and have Total less than 30. Preserve other orders.",
    "brief": "金额恰好 30 不应删除。",
    "dataset": "shop",
    "focusTables": [
      "ORDERS"
    ],
    "solution": "DELETE FROM ORDERS WHERE Paid = FALSE AND Total < 30;",
    "checks": [
      {
        "seed": "INSERT INTO ORDERS VALUES (309, 6, 29, 0, '2026-04-22'),(310, 6, 30, 0, '2026-04-22'),(311, 6, 29, 1, '2026-04-22');"
      }
    ],
    "hints": [
      "未支付对应 Paid = FALSE。",
      "低于 30 用 <。",
      "两个条件用 AND 组合。"
    ],
    "explanation": "边界值和付款状态都重要；已支付的小额订单必须保留。",
    "objectives": [
      "DELETE",
      "复合筛选",
      "边界"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-average",
    "lessonId": "as-group",
    "title": "计算活跃学生平均分",
    "prompt": "Return the average Score of active students. Give the result column a meaningful alias.",
    "brief": "使用 AVG，并用 AS 为结果列命名。",
    "dataset": "campus",
    "aliasColumns": [
      0
    ],
    "solution": "SELECT AVG(Score) AS AverageScore FROM STUDENT WHERE Active = TRUE;",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "平均值使用 AVG。",
      "先筛选 Active = TRUE。",
      "在 AVG(Score) 后加 AS 和有意义的名称。"
    ],
    "explanation": "AVG 在筛选后的五条初始记录上计算；别名只改变显示标题，不改变源字段。",
    "objectives": [
      "AVG",
      "AS"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": true,
    "difficulty": 3,
    "minutes": 4,
    "id": "as-group-stock",
    "lessonId": "as-group",
    "title": "按类别汇总图书",
    "prompt": "For each Genre, display Genre, the number of book titles, and total Stock, in that order. Give both aggregates meaningful aliases. Sort by Genre ascending.",
    "brief": "一类一行；数量与库存总量分列展示。",
    "dataset": "library",
    "aliasColumns": [
      1,
      2
    ],
    "solution": "SELECT Genre, COUNT(BookID) AS TitleCount, SUM(Stock) AS TotalStock FROM BOOK GROUP BY Genre ORDER BY Genre;",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 7.5, 6, 0, 1), (210, 'Low Tide', 'Fiction', 22, 1, 1, 2);"
      }
    ],
    "hints": [
      "普通输出字段 Genre 也是分组字段。",
      "COUNT(BookID) 数书种，SUM(Stock) 加库存。",
      "GROUP BY Genre 后再 ORDER BY Genre。"
    ],
    "explanation": "GROUP BY 产生每类一条汇总行。不能只求整个书库的总和，也不能把每本书单独作为一组。",
    "objectives": [
      "GROUP BY",
      "COUNT",
      "SUM",
      "AS"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": true,
    "difficulty": 3,
    "minutes": 4,
    "id": "as-group-payment",
    "lessonId": "as-group",
    "title": "按付款状态汇总订单",
    "prompt": "For each Paid value, display Paid, the number of orders, and the sum of Total. Give both aggregates meaningful aliases and sort by Paid ascending.",
    "brief": "真假状态也可以作为分组字段。",
    "dataset": "shop",
    "aliasColumns": [
      1,
      2
    ],
    "solution": "SELECT Paid, COUNT(OrderID) AS OrderCount, SUM(Total) AS TotalValue FROM ORDERS GROUP BY Paid ORDER BY Paid;",
    "checks": [
      {
        "seed": "INSERT INTO ORDERS VALUES (309, 6, 25, 0, '2026-04-22');"
      }
    ],
    "hints": [
      "按 Paid 分成两组。",
      "分别 COUNT(OrderID) 与 SUM(Total)。",
      "GROUP BY Paid，并用 ORDER BY Paid 控制输出顺序。"
    ],
    "explanation": "每组独立统计。结果中的 0 和 1 分别代表未支付与已支付，不是订单金额。",
    "objectives": [
      "Boolean 分组",
      "GROUP BY"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-like-prefix",
    "lessonId": "as-like",
    "title": "按书名前缀搜索",
    "prompt": "Display only BookID and Title for books whose Title begins with River.",
    "brief": "前缀后放 %；不要写成完整值相等。",
    "dataset": "library",
    "solution": "SELECT BookID, Title FROM BOOK WHERE Title LIKE 'River%';",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'River', 'Fiction', 7, 1, 0, 1),(210, 'A River Story', 'Fiction', 8, 1, 0, 2),(211, 'River Paths', 'Fiction', 9, 1, 0, 2);"
      }
    ],
    "hints": [
      "LIKE 比较模式。",
      "固定前缀是 River。",
      "模式 'River%' 中 % 可以匹配零个或多个字符。"
    ],
    "explanation": "River 本身也符合，因为 % 可代表零个字符；A River Story 不以 River 开头。",
    "objectives": [
      "LIKE",
      "前缀",
      "%"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-like-contains",
    "lessonId": "as-like",
    "title": "搜索包含指定片段的书名",
    "prompt": "Display only Title for books whose title contains the text ar.",
    "brief": "要匹配任意位置，模式两侧都放 %。",
    "dataset": "library",
    "solution": "SELECT Title FROM BOOK WHERE Title LIKE '%ar%';",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'ar', 'Fiction', 7, 1, 0, 1),(210, 'Start Here', 'Computing', 8, 1, 0, 1),(211, 'Blue Sea', 'Fiction', 9, 1, 0, 2);"
      }
    ],
    "hints": [
      "片段可能在开头、中间或结尾。",
      "左右两边的其他字符都可以变化。",
      "使用 '%ar%'。"
    ],
    "explanation": "两侧通配符表示片段两边允许任意文字；只放一侧会把搜索限制为前缀或后缀。",
    "objectives": [
      "LIKE",
      "包含匹配"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 2,
    "minutes": 4,
    "id": "as-like-suffix",
    "lessonId": "as-like",
    "title": "搜索以 Press 结尾的出版社",
    "prompt": "Display only PublisherName for publishers whose name ends with Press.",
    "brief": "% 放在固定后缀之前。",
    "dataset": "library",
    "solution": "SELECT PublisherName FROM PUBLISHER WHERE PublisherName LIKE '%Press';",
    "checks": [
      {
        "seed": "INSERT INTO PUBLISHER VALUES (5, 'Press', 'UK'),(6, 'Press Works', 'UK'),(7, 'South Press', 'Canada');"
      }
    ],
    "hints": [
      "查询 PUBLISHER 表。",
      "固定部分在最后。",
      "使用 '%Press'，不要在 Press 后面再加 %。"
    ],
    "explanation": "后缀匹配会包括 South Press，但排除 Press Works，因为后者没有以 Press 结束。",
    "objectives": [
      "LIKE",
      "后缀"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": false,
    "difficulty": 3,
    "minutes": 4,
    "id": "as-join-clubs",
    "lessonId": "as-join",
    "title": "显示学生的社团名称",
    "prompt": "Display STUDENT.Name and CLUB.ClubName for active students only. Join STUDENT to CLUB using ClubID.",
    "brief": "学生表保存社团编号，名称需要从 CLUB 读取。",
    "dataset": "campus",
    "solution": "SELECT STUDENT.Name, CLUB.ClubName FROM STUDENT INNER JOIN CLUB ON STUDENT.ClubID = CLUB.ClubID WHERE STUDENT.Active = TRUE;",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "两表共同关联字段是 ClubID。",
      "INNER JOIN 后用 ON 比较两边 ClubID。",
      "WHERE STUDENT.Active = TRUE 在连接后筛选活跃学生。"
    ],
    "explanation": "只把编号相等的学生与社团配对，避免生成学生与每个社团的所有组合。",
    "objectives": [
      "INNER JOIN",
      "ON",
      "限定字段"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": true,
    "difficulty": 3,
    "minutes": 4,
    "id": "as-join-publishers",
    "lessonId": "as-join",
    "title": "找英国出版社的图书",
    "prompt": "Display BOOK.Title and PUBLISHER.PublisherName for books published by a publisher whose Country is UK. Sort by BOOK.Title ascending.",
    "brief": "条件字段来自出版社表，结果同时使用两表。",
    "dataset": "library",
    "solution": "SELECT BOOK.Title, PUBLISHER.PublisherName FROM BOOK INNER JOIN PUBLISHER ON BOOK.PublisherID = PUBLISHER.PublisherID WHERE PUBLISHER.Country = 'UK' ORDER BY BOOK.Title;",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 7.5, 6, 0, 1), (210, 'Low Tide', 'Fiction', 22, 1, 1, 2);"
      }
    ],
    "hints": [
      "通过 PublisherID 连接。",
      "Country 属于 PUBLISHER。",
      "筛选 UK 后按 BOOK.Title 排序。"
    ],
    "explanation": "表名前缀明确字段来源。同一出版社可以对应多本书，所以名称在结果中可能重复。",
    "objectives": [
      "INNER JOIN",
      "WHERE",
      "ORDER BY"
    ]
  },
  {
    "level": "as",
    "kind": "sql",
    "starter": "",
    "ordered": true,
    "difficulty": 3,
    "minutes": 6,
    "id": "as-join-summary",
    "lessonId": "as-join",
    "title": "按客户汇总已支付金额",
    "prompt": "For each customer with at least one paid order, display CustomerName and the sum of paid order Total. Give the aggregate a meaningful alias. Sort by CustomerName ascending, then by CustomerID ascending when names match. Use no more than two tables.",
    "brief": "先连接、筛选已支付订单，再按客户分组。",
    "dataset": "shop",
    "aliasColumns": [
      1
    ],
    "solution": "SELECT CUSTOMER.CustomerName, SUM(ORDERS.Total) AS PaidTotal FROM CUSTOMER INNER JOIN ORDERS ON CUSTOMER.CustomerID = ORDERS.CustomerID WHERE ORDERS.Paid = TRUE GROUP BY CUSTOMER.CustomerID, CUSTOMER.CustomerName ORDER BY CUSTOMER.CustomerName, CUSTOMER.CustomerID;",
    "checks": [
      {
        "seed": "INSERT INTO CUSTOMER VALUES (7, 'Lina Shah', 'York', 1); INSERT INTO ORDERS VALUES (309, 6, 25, 1, '2026-04-22'), (310, 7, 19, 1, '2026-04-22');"
      }
    ],
    "hints": [
      "CUSTOMER 与 ORDERS 通过 CustomerID 连接。",
      "WHERE Paid = TRUE 决定哪些订单参与总额。",
      "按客户编号和姓名分组；ORDER BY 先写姓名，再写编号，使同名行的顺序确定。"
    ],
    "explanation": "先过滤再分组；按客户唯一编号分组可防止同名客户错误合并。姓名相同时再按编号排序，结果顺序确定。无已支付订单的客户不出现在结果中。",
    "objectives": [
      "两表查询",
      "GROUP BY",
      "SUM",
      "同名客户"
    ]
  }
];

export const syllabusLinks = [
  {
    "id": "0478-2026",
    "level": "ig",
    "title": "IGCSE 0478 · 2026–2028",
    "url": "https://www.cambridgeinternational.org/Images/697167-2026-2028-syllabus.pdf",
    "note": "第 9 节，第 30 页：单表数据库、基本类型、主键、查询与输出预测。"
  },
  {
    "id": "9618-2026",
    "level": "as",
    "title": "AS & A Level 9618 · 2026",
    "url": "https://www.cambridgeinternational.org/Images/697372-2026-syllabus.pdf",
    "note": "第 8.3 节，第 26–27 页：DDL、DML、两表查询和汇总。"
  },
  {
    "id": "9618-2027",
    "level": "as",
    "title": "AS & A Level 9618 · 2027–2029",
    "url": "https://www.cambridgeinternational.org/Images/721397-2027-2029-syllabus.pdf",
    "note": "第 8.3 节：本工具所用 SQL 范围与 2026 版一致；完整 A Level 继承这一基础。"
  }
];

