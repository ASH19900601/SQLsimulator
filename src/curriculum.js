// Original learning content for CAIE SQL Studio. All exercise datasets are fictional.
// Historical-paper evidence is linked in docs/research.
export const datasets = [
  {
    "id": "campus",
    "name": "School clubs",
    "description": "8 students and 4 clubs. Practise filtering, Boolean conditions, sorting and joins. Active is a Boolean field (1 means true; 0 means false).",
    "tables": [
      "STUDENT",
      "CLUB"
    ],
    "seed": "CREATE TABLE CLUB (ClubID CHARACTER(3) PRIMARY KEY, ClubName VARCHAR(30), Room VARCHAR(10));\nCREATE TABLE STUDENT (StudentID INTEGER PRIMARY KEY, Name VARCHAR(30), YearGroup INTEGER, House VARCHAR(10), Score REAL, Active BOOLEAN, ClubID CHARACTER(3), FOREIGN KEY (ClubID) REFERENCES CLUB(ClubID));\nINSERT INTO CLUB VALUES ('C01','Robotics','A12'),('C02','Debate','B04'),('C03','Chess','A07'),('C04','Orchestra','M02');\nINSERT INTO STUDENT VALUES (101,'Amina',10,'Cedar',78,1,'C01'),(102,'Ben',11,'Maple',65,1,'C02'),(103,'Chen',10,'Cedar',92,0,'C01'),(104,'Dina',12,'Willow',84,1,'C03'),(105,'Evan',11,'Maple',55,0,'C02'),(106,'Farah',12,'Cedar',73,1,'C03'),(107,'Grace',10,'Willow',88,1,'C04'),(108,'Hugo',11,'Cedar',65,0,'C04');"
  },
  {
    "id": "library",
    "name": "Book catalogue",
    "description": "8 books and 4 publishers. Stock is the number of copies, Price$ is the unit price, and Digital is a Boolean field.",
    "tables": [
      "BOOK",
      "PUBLISHER"
    ],
    "seed": "CREATE TABLE PUBLISHER (PublisherID INTEGER PRIMARY KEY, PublisherName VARCHAR(40), Country VARCHAR(20));\nCREATE TABLE BOOK (BookID INTEGER PRIMARY KEY, Title VARCHAR(50), Genre VARCHAR(20), Price$ REAL, Stock INTEGER, Digital BOOLEAN, PublisherID INTEGER);\nINSERT INTO PUBLISHER VALUES (1,'North Press','UK'),(2,'River Books','Singapore'),(3,'Maple House','Canada'),(4,'Cedar Press','UK');\nINSERT INTO BOOK VALUES (201,'River Code','Computing',12.5,8,1,1),(202,'Ocean Maps','Geography',18,0,0,2),(203,'Quiet Stars','Fiction',9.5,12,1,3),(204,'SQL Steps','Computing',15,5,1,1),(205,'Wild Trails','Geography',14,3,0,2),(206,'Paper Moon','Fiction',8,0,0,3),(207,'Data Atlas','Computing',20,4,1,4),(208,'Night Garden','Fiction',11,7,0,4);"
  },
  {
    "id": "shop",
    "name": "Customer orders",
    "description": "6 customers and 8 orders. A customer can have several orders. Paid is a Boolean field and Total is the order amount.",
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
    "title": "Tables, fields and primary keys",
    "subtitle": "Understand databases through a student list",
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
      "A table stores one kind of entity. In STUDENT, each row is one student's record and each column is a field. Column headings describe the fields and are excluded from the record count.",
      "A primary key must identify each record uniquely. Names can repeat, so a stable, unique StudentID is a better choice. Check the uniqueness of the data rather than relying on an ID suffix in the field name.",
      "INTEGER stores whole numbers, REAL stores fractional numbers, text/alphanumeric stores text, and BOOLEAN represents true or false. Date and time types store the corresponding values. Choose a type from the field's meaning and example data."
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
    "title": "Choose the fields to display",
    "subtitle": "SELECT and FROM form the query structure",
    "minutes": 7,
    "keywords": [
      "SELECT",
      "FROM",
      "field list"
    ],
    "dataset": "campus",
    "example": "SELECT Name, House\nFROM STUDENT;",
    "body": [
      "List output fields after SELECT, separated by commas, and name the table after FROM. Result columns follow the field-list order. Selecting two fields leaves all other stored fields unchanged.",
      "Field and table names are identifiers; text values belong in quotes. If only names and houses are requested, select exactly those fields.",
      "Put clauses on separate lines, capitalise SQL keywords and finish with a semicolon. Run the query and compare its output columns with the data table."
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
    "title": "Find records with conditions",
    "subtitle": "Compare text, numbers and Boolean values",
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
      "WHERE filters records and SELECT chooses output columns. A filter field can be omitted from the output. Quote text such as 'Cedar'; numeric values usually appear without quotes.",
      "Greater than or equal to includes the boundary; greater than excludes it. Use <> for not equal to. At least suggests >=, while more than suggests >.",
      "For BOOLEAN fields, write = TRUE or = FALSE explicitly. Historical papers also use representations such as YES/NO. The learner interprets these according to the field's Boolean type; ordinary text fields retain text comparisons."
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
    "title": "Combine conditions",
    "subtitle": "AND requires both; OR requires at least one",
    "minutes": 8,
    "keywords": [
      "AND",
      "OR",
      "WHERE"
    ],
    "dataset": "campus",
    "example": "SELECT Name\nFROM STUDENT\nWHERE Active = TRUE AND Score >= 80;",
    "body": [
      "AND requires both conditions, such as being active and meeting a score threshold. OR requires at least one condition, such as belonging to Maple or Willow.",
      "Write a complete comparison on each side: House = 'Maple' OR House = 'Willow'. Each alternative must state the field being compared.",
      "Check which records each individual condition selects, then take their intersection or union. Use parentheses to make the grouping of mixed conditions clear."
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
    "title": "Put results in order",
    "subtitle": "ORDER BY controls row order",
    "minutes": 8,
    "keywords": [
      "ORDER BY",
      "ASCENDING",
      "DESCENDING"
    ],
    "dataset": "library",
    "example": "SELECT Title, Price$\nFROM BOOK\nORDER BY Price$ ASCENDING;",
    "body": [
      "ORDER BY follows filtering. ASCENDING means lowest to highest and DESCENDING means highest to lowest. The learner also accepts the common abbreviations ASC and DESC.",
      "The default direction is ascending. Numbers are compared by value and text by its ordering. A field used for sorting can be omitted from the SELECT output.",
      "Use descending order when asked for highest to lowest. Without ORDER BY, a database's row order is not guaranteed. When values tie, check whether the task requires a second sorting field."
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
    "title": "Counts and totals",
    "subtitle": "COUNT counts; SUM adds",
    "minutes": 9,
    "keywords": [
      "SUM",
      "COUNT",
      "WHERE"
    ],
    "dataset": "library",
    "example": "SELECT SUM(Stock)\nFROM BOOK\nWHERE Genre = 'Computing';",
    "body": [
      "COUNT counts records or non-NULL field values. SUM adds numeric values. How many book titles and how many copies in stock ask for different calculations.",
      "WHERE filters the records before aggregation. To total computing stock, filter Genre first and then calculate SUM(Stock).",
      "An aggregate query usually returns a summary value. Combining an ordinary field with an overall total leaves its source record ambiguous. Grouped summaries are covered in AS lessons."
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
    "title": "Read SQL and predict its output",
    "subtitle": "Compare your reasoning with a real query",
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
      "To predict a result, identify the table, apply conditions, sort as required, and write values in SELECT column order. Keep field names, SQL punctuation and data values distinct.",
      "Prediction exercises use CSV: one record per line, comma-separated columns, and no header row. After submitting, you can inspect the expected result and explanation.",
      "Filter, sort and output fields may differ. Run the same SQL in the lab after predicting its output to check your understanding."
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
    "title": "Choose data types",
    "subtitle": "Turn field meanings into a table structure",
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
      "9618 uses CHARACTER, VARCHAR(n), BOOLEAN, INTEGER, REAL, DATE and TIME. CHARACTER suits character data; VARCHAR(n) describes variable-length text with a specified maximum length.",
      "Use INTEGER for whole quantities, REAL for measurements with fractional values, DATE for dates and TIME for times of day. An identifier made of digits may still be stored as text when its digits have no arithmetic meaning.",
      "CREATE TABLE takes a table name and parenthesised field definitions. Each field needs a name and type; separate definitions with commas. The exercises specify text lengths where these are part of the task."
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
    "title": "Create databases and tables",
    "subtitle": "Start with structure using CREATE",
    "minutes": 10,
    "keywords": [
      "CREATE DATABASE",
      "CREATE TABLE",
      "PRIMARY KEY"
    ],
    "dataset": "campus",
    "example": "CREATE TABLE AWARD (\n  AwardID INTEGER,\n  AwardName VARCHAR(40),\n  PRIMARY KEY (AwardID)\n);",
    "body": [
      "A database contains tables, and tables contain records. CREATE DATABASE declares a database; CREATE TABLE declares a table and its fields. A new table has no records until data is inserted.",
      "PRIMARY KEY declares a unique identifier whose values cannot repeat. Declare it inline after a field definition or as a table-level PRIMARY KEY (...) constraint.",
      "QueryPath implements CREATE DATABASE as a new empty local sandbox. Switching or resetting an exercise restores its initial data. Each student's data stays in their own browser."
    ],
    "exerciseIds": [
      "as-create-database",
      "as-create-award"
    ]
  },
  {
    "id": "as-alter",
    "level": "as",
    "title": "Change structures and define relationships",
    "subtitle": "Add fields and keys with ALTER TABLE",
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
      "To add a field, use ALTER TABLE table_name ADD field_name type. Existing records need values assigned separately for their new field.",
      "Existing data must meet uniqueness requirements before a primary key can be added. A foreign key references a key in another table; REFERENCES names the target table and field.",
      "BOOK.PublisherID references PUBLISHER.PublisherID, allowing several books to share a publisher. The foreign-key constraint checks that the publisher exists. A join combines information from the related tables."
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
    "title": "Add new records",
    "subtitle": "Match the field list to VALUES",
    "minutes": 8,
    "keywords": [
      "INSERT INTO",
      "VALUES"
    ],
    "dataset": "campus",
    "example": "INSERT INTO CLUB (ClubID, ClubName, Room)\nVALUES ('C05', 'Photography', 'D10');",
    "body": [
      "INSERT INTO adds records. An explicit field list identifies the purpose of each value. The VALUES order must match the field-list order.",
      "Quote text, dates and times appropriately. Enter numbers and TRUE/FALSE according to their types. Primary keys must be unique and foreign-key values must reference existing records.",
      "After inserting, check both the new record and the unchanged existing data. Each exercise starts from its own initial dataset."
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
    "title": "Update selected records",
    "subtitle": "SET changes values; WHERE selects records",
    "minutes": 9,
    "keywords": [
      "UPDATE",
      "SET",
      "WHERE"
    ],
    "dataset": "library",
    "example": "UPDATE BOOK\nSET Stock = 10\nWHERE BookID = 202;",
    "body": [
      "Use UPDATE table_name, SET for new values, and WHERE to select the records to change. A unique primary key is often the clearest way to target one record.",
      "Separate multiple field assignments with commas. WHERE identifies records and SET assigns values to their fields.",
      "Omitting WHERE affects the entire table. Use SELECT with the same condition to inspect the target records before updating them."
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
    "title": "Delete matching records",
    "subtitle": "DELETE FROM preserves the table structure",
    "minutes": 8,
    "keywords": [
      "DELETE FROM",
      "WHERE"
    ],
    "dataset": "library",
    "example": "DELETE FROM BOOK\nWHERE Stock = 0;",
    "body": [
      "DELETE FROM removes records matching WHERE while retaining the table and its field definitions. Deleting a row differs from removing a column or setting a field to zero.",
      "Express the complete condition, such as belonging to a given genre and having zero stock. Omitting either part may delete records that should remain.",
      "A foreign-key constraint can prevent deletion of a referenced record. Practise in the local sandbox and reset to restore the original data."
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
    "title": "Summarise by category",
    "subtitle": "AVG and GROUP BY",
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
      "AVG calculates the mean of numeric values. GROUP BY collects records with the same category and calculates SUM, COUNT or AVG separately for each group.",
      "When selecting grouped fields and aggregates, include the ordinary fields in GROUP BY. After grouping by Genre, an arbitrary book title would not identify the whole group.",
      "AS gives a result column a meaningful heading while preserving the source field name. WHERE filters the participating records before grouping."
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
    "title": "Search with text patterns",
    "subtitle": "Use LIKE and % for partial matches",
    "minutes": 9,
    "keywords": [
      "LIKE",
      "%",
      "WHERE"
    ],
    "dataset": "library",
    "example": "SELECT Title\nFROM BOOK\nWHERE Title LIKE '%Code%';",
    "body": [
      "LIKE matches text against a pattern. % represents zero or more characters. 'River%' matches text starting with River; '%Garden' matches text ending in Garden.",
      "To find text anywhere in a value, put % on both sides. Quote the pattern as a text value. Equality compares the whole value and treats % as an ordinary character.",
      "These lessons use % as the default wildcard. Other historical spellings are accepted only where supported and documented in the source evidence. Keep each query's wildcard convention consistent."
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
    "title": "Join related tables",
    "subtitle": "Match keys with INNER JOIN",
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
      "INNER JOIN combines records that satisfy the join condition. A customer with several orders appears several times in the joined result. A customer with no matching orders is excluded.",
      "Use table_name.field_name to identify fields clearly, especially when both tables contain CustomerID. ON states the key relationship; WHERE filters the joined records.",
      "9618 queries involve at most two tables. Combine joins with sorting, counting and totals, checking both the matching keys and the filter conditions."
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
    "title": "Fields and records",
    "prompt": "The STUDENT table has eight data rows and seven named columns. How many records and fields does it contain?",
    "brief": "A heading describes a field; each student occupies one data row.",
    "dataset": "campus",
    "options": [
      "8 records and 7 fields",
      "7 records and 8 fields",
      "9 records and 7 fields",
      "8 records and 8 fields"
    ],
    "answer": 0,
    "hints": [
      "First distinguish rows from columns.",
      "Each data row represents one record.",
      "8 data rows give 8 records; 7 column headings give 7 fields."
    ],
    "explanation": "Records are rows and fields are columns. The header describes the fields; the data contains 8 students.",
    "objectives": [
      "Distinguish fields and records"
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
    "title": "Choose a reliable primary key",
    "prompt": "Which field is the most suitable primary key for STUDENT, given that StudentID is unique and never reused?",
    "brief": "Names, houses and scores can all be repeated.",
    "dataset": "campus",
    "options": [
      "StudentID",
      "Name",
      "House",
      "Score"
    ],
    "answer": 0,
    "hints": [
      "A primary key must identify each record uniquely.",
      "Students with the same name are still different people.",
      "The question guarantees that StudentID is unique and is never reassigned."
    ],
    "explanation": "StudentID satisfies the stated uniqueness requirement. Names that happen to be unique in a sample may be repeated in future records.",
    "objectives": [
      "Choose a primary key"
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
    "title": "Choose a type for active status",
    "prompt": "Active stores only whether a student is active or inactive. Which data type best describes this field?",
    "brief": "There are exactly two possible states.",
    "dataset": "campus",
    "options": [
      "Boolean",
      "Real",
      "Date/time",
      "Integer because every field must be numeric"
    ],
    "answer": 0,
    "hints": [
      "Consider what the field means, rather than just its displayed 1 and 0 values.",
      "The field represents either true or false.",
      "Boolean is designed to represent true and false states."
    ],
    "explanation": "Active is declared as BOOLEAN. The interface displays the stored values as 1/0, representing TRUE/FALSE.",
    "objectives": [
      "Identify Boolean data"
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
    "title": "Create a house list",
    "prompt": "Display only Name and House, in that order, for every student.",
    "brief": "Select two columns and include every record.",
    "dataset": "campus",
    "solution": "SELECT Name, House FROM STUDENT;",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "Decide which fields to display first.",
      "Separate fields with a comma. The table is STUDENT.",
      "Write Name, House after SELECT and STUDENT after FROM."
    ],
    "explanation": "SELECT determines the result columns. Omitting WHERE includes all student records.",
    "objectives": [
      "SELECT",
      "FROM",
      "Field list"
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
    "title": "Create a book price list",
    "prompt": "Display only Title and Price$, in that order, for all books.",
    "brief": "Price$ is the full field name, including the dollar sign.",
    "dataset": "library",
    "solution": "SELECT Title, Price$ FROM BOOK;",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 7.5, 6, 0, 1), (210, 'Low Tide', 'Fiction', 22, 1, 1, 2);"
      }
    ],
    "hints": [
      "Check the field names in BOOK.",
      "The price field is named Price$.",
      "Write SELECT Title, Price$ followed by FROM BOOK."
    ],
    "explanation": "Exam questions may use field names such as Price$. Use each identifier exactly as given.",
    "objectives": [
      "Exact identifiers",
      "Select fields"
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
    "title": "List customer locations",
    "prompt": "Display only CustomerName and City, in that order, for all customers.",
    "brief": "Use the CUSTOMER table for this task.",
    "dataset": "shop",
    "solution": "SELECT CustomerName, City FROM CUSTOMER;",
    "checks": [
      {
        "seed": "INSERT INTO CUSTOMER VALUES (7, 'Zara Bell', 'York', 0);"
      }
    ],
    "hints": [
      "You need customer details from CUSTOMER.",
      "FROM should name CUSTOMER.",
      "The output columns are CustomerName, City."
    ],
    "explanation": "A database can contain several tables. A single-table query reads the table named in FROM.",
    "objectives": [
      "Choose the correct table"
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
    "title": "Find students in Cedar",
    "prompt": "Display only StudentID and Name for students whose House is Cedar.",
    "brief": "Cedar is a text value, so enclose it in quotes.",
    "dataset": "campus",
    "solution": "SELECT StudentID, Name FROM STUDENT WHERE House = 'Cedar';",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "Put the filter condition in WHERE.",
      "The condition uses the House field.",
      "Use House = 'Cedar'."
    ],
    "explanation": "A filtering field can be omitted from the output. Display the ID and name, and use House to decide which records to keep.",
    "objectives": [
      "Filter by text equality"
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
    "title": "Find scores of at least 80",
    "prompt": "Display only Name and Score for students with a score of at least 80.",
    "brief": "At least 80 includes a score of exactly 80.",
    "dataset": "campus",
    "solution": "SELECT Name, Score FROM STUDENT WHERE Score >= 80;",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Cedar', 80, 1, 'C01'),(110, 'Juno', 10, 'Maple', 79, 1, 'C02');"
      }
    ],
    "hints": [
      "Find the field that stores the score.",
      "At least means greater than or equal to.",
      "WHERE Score >= 80 includes the boundary value."
    ],
    "explanation": "Using > would exclude a score of exactly 80. Additional test data checks this boundary.",
    "objectives": [
      ">=",
      "Boundary values"
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
    "title": "Find books without a digital edition",
    "prompt": "Display only BookID and Title for books where Digital is false.",
    "brief": "Digital is a Boolean field.",
    "dataset": "library",
    "solution": "SELECT BookID, Title FROM BOOK WHERE Digital = FALSE;",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 7.5, 6, 0, 1), (210, 'Low Tide', 'Fiction', 22, 1, 1, 2);"
      }
    ],
    "hints": [
      "Find the field that indicates a digital edition.",
      "FALSE means there is no digital edition.",
      "Use WHERE Digital = FALSE and display only the two requested columns."
    ],
    "explanation": "Boolean fields represent true or false. An explicit TRUE/FALSE comparison makes the condition clear.",
    "objectives": [
      "Boolean filtering"
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
    "title": "Find active high scorers",
    "prompt": "Display only Name for students who are active and have Score at least 80.",
    "brief": "Both conditions must be true.",
    "dataset": "campus",
    "solution": "SELECT Name FROM STUDENT WHERE Active = TRUE AND Score >= 80;",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "Write a condition for active status and another for the score.",
      "Join the conditions with AND.",
      "Active = TRUE AND Score >= 80。"
    ],
    "explanation": "Chen has a high score but is inactive. AND requires both conditions to be satisfied.",
    "objectives": [
      "AND",
      "Combined conditions"
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
    "title": "Combine two house lists",
    "prompt": "Display only Name and House for students in either Maple or Willow.",
    "brief": "A student may belong to either house.",
    "dataset": "campus",
    "solution": "SELECT Name, House FROM STUDENT WHERE House = 'Maple' OR House = 'Willow';",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "A student only needs to belong to one of the two houses.",
      "Use OR and write both comparisons in full.",
      "House = 'Maple' OR House = 'Willow'。"
    ],
    "explanation": "OR keeps records satisfying at least one condition. Repeat House to form two complete comparisons.",
    "objectives": [
      "OR",
      "Text conditions"
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
    "title": "Find affordable books in stock",
    "prompt": "Display only Title and Price$ for books costing less than 15 with Stock not equal to 0.",
    "brief": "Check both price and stock. Use <> for not equal to.",
    "dataset": "library",
    "solution": "SELECT Title, Price$ FROM BOOK WHERE Price$ < 15 AND Stock <> 0;",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 15, 6, 0, 1),(210, 'Low Tide', 'Fiction', 7, 0, 1, 2),(211, 'Small Paths', 'Fiction', 7, 2, 0, 2);"
      }
    ],
    "hints": [
      "Less than 15 uses <.",
      "Use <> 0 for non-zero stock.",
      "Join Price$ < 15 and Stock <> 0 with AND."
    ],
    "explanation": "A cheap book with no stock is excluded. A price of exactly 15 is also excluded by less than.",
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
    "title": "Show the most expensive books first",
    "prompt": "Display Title and Price$ for all books, ordered from highest price to lowest.",
    "brief": "Sort prices in descending order.",
    "dataset": "library",
    "solution": "SELECT Title, Price$ FROM BOOK ORDER BY Price$ DESCENDING;",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 7.5, 6, 0, 1), (210, 'Low Tide', 'Fiction', 22, 1, 1, 2);"
      }
    ],
    "hints": [
      "Use ORDER BY to sort.",
      "Highest to lowest is descending order.",
      "Put DESCENDING after Price$."
    ],
    "explanation": "ORDER BY changes the order of result rows while leaving stored prices unchanged.",
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
    "title": "List books by title",
    "prompt": "Display only Title for all books in ascending alphabetical order.",
    "brief": "Display titles in ascending order.",
    "dataset": "library",
    "solution": "SELECT Title FROM BOOK ORDER BY Title ASCENDING;",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 7.5, 6, 0, 1), (210, 'Low Tide', 'Fiction', 22, 1, 1, 2);"
      }
    ],
    "hints": [
      "The result has one column.",
      "Title is also the sorting field.",
      "ORDER BY Title ASCENDING。"
    ],
    "explanation": "Text and numbers use the same sorting clause. The default direction is ascending.",
    "objectives": [
      "ASCENDING",
      "Sort text"
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
    "title": "Show names in score order",
    "prompt": "Display only Name for YearGroup 10, ordered by Score from lowest to highest.",
    "brief": "Use Score for sorting and display only names.",
    "dataset": "campus",
    "solution": "SELECT Name FROM STUDENT WHERE YearGroup = 10 ORDER BY Score ASCENDING;",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "Filter for YearGroup 10 first.",
      "SELECT should contain only Name.",
      "Write ORDER BY Score ASCENDING after WHERE."
    ],
    "explanation": "A sorting field can be omitted from the output. SELECT, WHERE and ORDER BY each have a separate role.",
    "objectives": [
      "Filter then sort",
      "Sort by a hidden field"
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
    "title": "Total the computing book stock",
    "prompt": "Return one value: the total Stock of books whose Genre is Computing.",
    "brief": "Add the number of copies across computing titles.",
    "dataset": "library",
    "solution": "SELECT SUM(Stock) FROM BOOK WHERE Genre = 'Computing';",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 7.5, 6, 0, 1), (210, 'Low Tide', 'Fiction', 22, 1, 1, 2);"
      }
    ],
    "hints": [
      "Add together the stock values.",
      "Use SUM(Stock).",
      "Filter with Genre = 'Computing' in WHERE first."
    ],
    "explanation": "The initial stock values 8, 5 and 4 total 17 copies. COUNT would count the 3 titles.",
    "objectives": [
      "SUM",
      "Filter before aggregation"
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
    "title": "Count active students",
    "prompt": "Return one value: the number of active students.",
    "brief": "Each student has one record. Count the unique IDs.",
    "dataset": "campus",
    "solution": "SELECT COUNT(StudentID) FROM STUDENT WHERE Active = TRUE;",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "Use COUNT to find the number of students.",
      "Every StudentID has a value.",
      "Combine COUNT(StudentID) with Active = TRUE."
    ],
    "explanation": "COUNT counts the matching student records. The initial data contains 5 active students.",
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
    "title": "Total unpaid order amounts",
    "prompt": "Return one value: the sum of Total for all orders where Paid is false.",
    "brief": "Add the amounts of unpaid orders only.",
    "dataset": "shop",
    "solution": "SELECT SUM(Total) FROM ORDERS WHERE Paid = FALSE;",
    "checks": [
      {
        "seed": "INSERT INTO ORDERS VALUES (309, 6, 25, 0, '2026-04-22');"
      }
    ],
    "hints": [
      "Total stores the order amount.",
      "Use SUM to calculate the total amount.",
      "Filter ORDERS with Paid = FALSE."
    ],
    "explanation": "The initial unpaid total is 20 + 35 + 55 = 110. The query should also work when new orders are added.",
    "objectives": [
      "SUM",
      "Boolean filtering"
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
    "title": "Predict the high-score list",
    "prompt": "Write the output of the SQL below as CSV rows, without a header.",
    "brief": "Write each row as Name,Score, separated by a comma.",
    "dataset": "campus",
    "solution": "SELECT Name, Score FROM STUDENT WHERE Score >= 80 ORDER BY Score DESCENDING;",
    "expected": "Chen,92\nGrace,88\nDina,84",
    "hints": [
      "Find the three records with scores of at least 80.",
      "The scores in descending order are 92, 88 and 84.",
      "Write only the name and score on each line, with no header."
    ],
    "explanation": "Filter, then sort by score descending to display Chen, Grace and Dina with their scores.",
    "objectives": [
      "Predict output",
      "Filtering",
      "Sorting"
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
    "title": "Predict the out-of-stock list",
    "prompt": "Write the output of the SQL below as CSV rows, without a header.",
    "brief": "Write each row as Title,Stock. Keep the spaces in book titles.",
    "dataset": "library",
    "solution": "SELECT Title, Stock FROM BOOK WHERE Stock = 0 ORDER BY Title;",
    "expected": "Ocean Maps,0\nPaper Moon,0",
    "hints": [
      "Two books have a stock value of 0.",
      "In ascending title order, Ocean comes before Paper.",
      "The second column is 0 in both rows."
    ],
    "explanation": "ORDER BY Title defaults to ascending order. Include only the books that match the filter.",
    "objectives": [
      "Predict output",
      "Default sort order"
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
    "title": "Predict an aggregate result",
    "prompt": "Write the single value returned by the SQL below.",
    "brief": "The aggregate returns a single number.",
    "dataset": "library",
    "solution": "SELECT COUNT(BookID) FROM BOOK WHERE Digital = TRUE;",
    "expected": "4",
    "hints": [
      "Find the records where Digital is true.",
      "BookID values 201, 203, 204 and 207 match.",
      "Count those records."
    ],
    "explanation": "COUNT returns 4 matching records. SUM would add their stock values.",
    "objectives": [
      "Predict COUNT output"
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
    "title": "Identify the roles of three clauses",
    "prompt": "Which description correctly explains SELECT, FROM and WHERE?",
    "brief": "Distinguish output fields, source tables and filter conditions.",
    "dataset": "campus",
    "options": [
      "SELECT chooses fields; FROM identifies the table; WHERE filters records.",
      "SELECT sorts records; FROM chooses fields; WHERE names the database.",
      "SELECT changes data; FROM filters rows; WHERE chooses columns.",
      "All three commands create a new table."
    ],
    "answer": 0,
    "hints": [
      "SELECT usually lists field names.",
      "FROM names the source table or joined tables.",
      "WHERE contains conditions that determine which records to keep."
    ],
    "explanation": "Use each clause's role to locate mistakes: check SELECT for wrong columns, FROM for the wrong source, and WHERE for wrong records.",
    "objectives": [
      "Roles of SQL clauses"
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
    "title": "Choose a type for measurements",
    "prompt": "A field stores a measured distance such as 2.75 metres. Which type from the course list is most suitable?",
    "brief": "The fractional part must be preserved.",
    "dataset": "campus",
    "options": [
      "REAL",
      "INTEGER",
      "BOOLEAN",
      "DATE"
    ],
    "answer": 0,
    "hints": [
      "An integer type cannot preserve 0.75.",
      "The value is a measurement with a fractional part.",
      "REAL stores numeric values with fractional parts."
    ],
    "explanation": "REAL represents real numbers. INTEGER is appropriate for whole quantities and cannot represent this fractional value exactly.",
    "objectives": [
      "REAL",
      "Data types"
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
    "title": "Distinguish dates and times",
    "prompt": "A field records the time of day at which a visit begins, such as 09:30:00. Which type is most suitable?",
    "brief": "Store the time of day, without a year, month or day.",
    "dataset": "campus",
    "options": [
      "TIME",
      "DATE",
      "BOOLEAN",
      "INTEGER"
    ],
    "answer": 0,
    "hints": [
      "The example contains hours, minutes and seconds.",
      "DATE stores a year, month and day.",
      "TIME represents a time of day."
    ],
    "explanation": "DATE and TIME are separate types. Choose the type that matches the meaning of the field.",
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
    "title": "Create a visitor register",
    "prompt": "Create VISIT with these fields in this order: VisitID INTEGER, Badge CHARACTER, Visitor VARCHAR(40), Consent BOOLEAN, Score REAL, VisitDate DATE, VisitTime TIME. Do not add a key or records.",
    "brief": "Use the specified names, types and lengths. Badge stores one character.",
    "dataset": "campus",
    "schemaCheck": true,
    "focusTables": [
      "VISIT"
    ],
    "solution": "CREATE TABLE VISIT (VisitID INTEGER, Badge CHARACTER, Visitor VARCHAR(40), Consent BOOLEAN, Score REAL, VisitDate DATE, VisitTime TIME);",
    "hints": [
      "Write VISIT and an opening parenthesis after CREATE TABLE.",
      "Define each field with a name and type. Separate definitions with commas.",
      "There are 7 fields. Visitor has a maximum length of 40."
    ],
    "explanation": "This task uses all seven syllabus data types in one new table. Define the structure with CREATE TABLE.",
    "objectives": [
      "CREATE TABLE",
      "Seven data types"
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
    "title": "Create a separate database",
    "prompt": "Create a new database named RevisionHub.",
    "brief": "The command opens a new empty practice database.",
    "dataset": "campus",
    "schemaCheck": true,
    "focusTables": [],
    "solution": "CREATE DATABASE RevisionHub;",
    "hints": [
      "A database contains tables.",
      "Use CREATE DATABASE.",
      "Name the database RevisionHub. This command takes a database name."
    ],
    "explanation": "CREATE DATABASE defines a new database. QueryPath models this with a separate sandbox and checks the database name.",
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
    "title": "Create an awards table with a primary key",
    "prompt": "Create AWARD with AwardID INTEGER, AwardName VARCHAR(40), and Points INTEGER, in that order. Set AwardID as the primary key. Do not insert records.",
    "brief": "The primary key makes AwardID unique. Set the text length to 40.",
    "dataset": "campus",
    "schemaCheck": true,
    "focusTables": [
      "AWARD"
    ],
    "solution": "CREATE TABLE AWARD (AwardID INTEGER, AwardName VARCHAR(40), Points INTEGER, PRIMARY KEY (AwardID));",
    "hints": [
      "Write the three field definitions first.",
      "Place the primary-key definition inside the same parentheses.",
      "Use PRIMARY KEY (AwardID) to declare the unique identifier."
    ],
    "explanation": "A table structure includes field types and constraints. Declare PRIMARY KEY explicitly to make an ID field the primary key.",
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
    "title": "Add an email field to students",
    "prompt": "Add Email VARCHAR(60) to STUDENT. Keep all existing fields and records.",
    "brief": "Modify the structure of the existing table.",
    "dataset": "campus",
    "schemaCheck": true,
    "focusTables": [
      "STUDENT"
    ],
    "solution": "ALTER TABLE STUDENT ADD Email VARCHAR(60);",
    "hints": [
      "Use ALTER TABLE for an existing table.",
      "Use ADD to add a field.",
      "The field name is Email and the type is VARCHAR(60)."
    ],
    "explanation": "Adding a field preserves existing records. Email is initially unassigned for the old rows. The task checks both structure and data.",
    "objectives": [
      "ALTER TABLE",
      "Add a field"
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
    "title": "Add two contact fields at once",
    "prompt": "Add GuardianName VARCHAR(40) and GuardianPhone CHARACTER(12), in that order, to STUDENT. Keep all current records.",
    "brief": "Separate the two new fields in the ALTER statement with a comma.",
    "dataset": "campus",
    "schemaCheck": true,
    "focusTables": [
      "STUDENT"
    ],
    "solution": "ALTER TABLE STUDENT ADD GuardianName VARCHAR(40), GuardianPhone CHARACTER(12);",
    "hints": [
      "Start with ALTER TABLE STUDENT ADD.",
      "Each new field needs its own type.",
      "GuardianName VARCHAR(40), GuardianPhone CHARACTER(12)。"
    ],
    "explanation": "This supported ALTER form adds several fields at once. Their definition order determines the new column order.",
    "objectives": [
      "ALTER TABLE",
      "Add multiple fields"
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
    "title": "Add a primary key to existing data",
    "prompt": "BADGE has been created without a key. Add a primary key on BadgeID and preserve its records.",
    "brief": "BADGE is already prepared. Add the constraint.",
    "dataset": "campus",
    "setup": "CREATE TABLE BADGE (BadgeID INTEGER, Label VARCHAR(30)); INSERT INTO BADGE VALUES (1, 'Helper'), (2, 'Mentor');",
    "schemaCheck": true,
    "focusTables": [
      "BADGE"
    ],
    "solution": "ALTER TABLE BADGE ADD PRIMARY KEY (BadgeID);",
    "hints": [
      "The target is the existing BADGE table.",
      "Define PRIMARY KEY after ADD.",
      "PRIMARY KEY (BadgeID) specifies the unique field."
    ],
    "explanation": "The existing BadgeID values are unique, so the primary key can be added. Duplicate or missing values need to be resolved first.",
    "objectives": [
      "ALTER TABLE",
      "Add a primary key"
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
    "title": "Constrain publisher references",
    "prompt": "Add a foreign key on BOOK.PublisherID that references PUBLISHER.PublisherID. Preserve every record.",
    "brief": "The foreign-key field is in BOOK. The referenced key is in PUBLISHER.",
    "dataset": "library",
    "schemaCheck": true,
    "focusTables": [
      "BOOK"
    ],
    "solution": "ALTER TABLE BOOK ADD FOREIGN KEY (PublisherID) REFERENCES PUBLISHER(PublisherID);",
    "hints": [
      "Modify the BOOK table.",
      "Put BOOK's PublisherID inside FOREIGN KEY parentheses.",
      "REFERENCES PUBLISHER(PublisherID) identifies the referenced key."
    ],
    "explanation": "Each book must reference an existing publisher ID. Several books can reference the same publisher.",
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
    "title": "Register a new club",
    "prompt": "Insert a club with ClubID C05, ClubName Photography, and Room D10 into CLUB. Keep existing clubs.",
    "brief": "Write the field list, then the three corresponding values.",
    "dataset": "campus",
    "focusTables": [
      "CLUB"
    ],
    "solution": "INSERT INTO CLUB (ClubID, ClubName, Room) VALUES ('C05', 'Photography', 'D10');",
    "hints": [
      "Use INSERT INTO CLUB.",
      "All three values are text.",
      "Match the VALUES order to ClubID, ClubName, Room."
    ],
    "explanation": "INSERT adds a record while preserving existing records. The new ID C05 is unique.",
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
    "title": "Register a new member",
    "prompt": "Insert StudentID 109, Name Imani, YearGroup 10, House Willow, Score 81, Active true, ClubID C01 into STUDENT.",
    "brief": "C01 is an existing club, so it is a valid foreign-key value.",
    "dataset": "campus",
    "focusTables": [
      "STUDENT"
    ],
    "solution": "INSERT INTO STUDENT (StudentID, Name, YearGroup, House, Score, Active, ClubID) VALUES (109, 'Imani', 10, 'Willow', 81, TRUE, 'C01');",
    "hints": [
      "List all seven fields.",
      "Use unquoted numbers and quoted text for the name and C01.",
      "Active is TRUE and ClubID is 'C01'."
    ],
    "explanation": "The field order must match the value order. Referencing an existing club produces a valid new record.",
    "objectives": [
      "Insert typed values",
      "Foreign-key values"
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
    "title": "Register a new book",
    "prompt": "Insert BookID 209, Title Small Signals, Genre Computing, Price$ 13.5, Stock 6, Digital false, PublisherID 2 into BOOK.",
    "brief": "Use the exact Price$ field name and the decimal price.",
    "dataset": "library",
    "focusTables": [
      "BOOK"
    ],
    "solution": "INSERT INTO BOOK (BookID, Title, Genre, Price$, Stock, Digital, PublisherID) VALUES (209, 'Small Signals', 'Computing', 13.5, 6, FALSE, 2);",
    "hints": [
      "BOOK has seven fields.",
      "Small Signals is one text value containing a space.",
      "The final three VALUES are 6, FALSE, 2."
    ],
    "explanation": "Match the book's text, integer, real and Boolean values to their corresponding fields.",
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
    "title": "Record a stock delivery",
    "prompt": "Set Stock to 10 for the book with BookID 202. Change nothing else.",
    "brief": "Target the unique ID 202.",
    "dataset": "library",
    "focusTables": [
      "BOOK"
    ],
    "solution": "UPDATE BOOK SET Stock = 10 WHERE BookID = 202;",
    "hints": [
      "Write BOOK after UPDATE.",
      "SET assigns the new stock value.",
      "WHERE BookID = 202 selects one record."
    ],
    "explanation": "BookID identifies the target uniquely. Omitting WHERE would set the stock of every book to 10.",
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
    "title": "Update price and stock together",
    "prompt": "For BookID 204, set Price$ to 16 and Stock to 9. Leave all other values unchanged.",
    "brief": "Separate the two assignments in SET with a comma.",
    "dataset": "library",
    "focusTables": [
      "BOOK"
    ],
    "solution": "UPDATE BOOK SET Price$ = 16, Stock = 9 WHERE BookID = 204;",
    "hints": [
      "Use a single UPDATE statement.",
      "Write each field followed by = and its new value.",
      "Use SET Price$ = 16, Stock = 9, then filter by BookID."
    ],
    "explanation": "Separate SET assignments with commas. AND combines conditions in WHERE.",
    "objectives": [
      "Update multiple fields"
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
    "title": "Record a customer's payment",
    "prompt": "Mark all orders for CustomerID 3 as paid. Keep every other order unchanged.",
    "brief": "The same customer may have several orders.",
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
      "Update the Paid field in ORDERS.",
      "Target the customer ID to select their orders.",
      "WHERE CustomerID = 3 should cover all of that customer's orders."
    ],
    "explanation": "A customer-based condition also covers future orders for that customer. Hard-coding a single order ID would miss other matching orders.",
    "objectives": [
      "Update multiple records",
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
    "title": "Remove a book record",
    "prompt": "Delete only the book with BookID 206 from BOOK. Keep the table and other records.",
    "brief": "Delete the record and keep the table.",
    "dataset": "library",
    "focusTables": [
      "BOOK"
    ],
    "solution": "DELETE FROM BOOK WHERE BookID = 206;",
    "hints": [
      "Use DELETE FROM.",
      "Select the target using its unique ID.",
      "WHERE BookID = 206。"
    ],
    "explanation": "The BOOK structure remains after deletion; only the selected record is removed.",
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
    "title": "Remove out-of-stock fiction",
    "prompt": "Delete every book whose Genre is Fiction and Stock is 0. Keep all other books.",
    "brief": "Both conditions must be true.",
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
      "Write a condition for the Fiction genre.",
      "Add a zero-stock condition and combine them with AND.",
      "Genre = 'Fiction' AND Stock = 0。"
    ],
    "explanation": "Filtering only by zero stock would also delete geography books. Filtering only by Fiction would delete novels still in stock.",
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
    "title": "Remove small unpaid orders",
    "prompt": "Delete orders that are unpaid and have Total less than 30. Preserve other orders.",
    "brief": "Keep orders with an amount of exactly 30.",
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
      "Unpaid means Paid = FALSE.",
      "Use < for less than 30.",
      "Combine the two conditions with AND."
    ],
    "explanation": "Check both the boundary and payment status. Small orders that have been paid must remain.",
    "objectives": [
      "DELETE",
      "Combined filtering",
      "Boundaries"
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
    "title": "Calculate the average active-student score",
    "prompt": "Return the average Score of active students. Give the result column a meaningful alias.",
    "brief": "Use AVG and name the result column with AS.",
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
      "Use AVG to calculate a mean.",
      "Filter with Active = TRUE first.",
      "Follow AVG(Score) with AS and a meaningful column name."
    ],
    "explanation": "AVG uses the five initially matching records. The alias changes the result heading while preserving the source field name.",
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
    "title": "Summarise books by genre",
    "prompt": "For each Genre, display Genre, the number of book titles, and total Stock, in that order. Give both aggregates meaningful aliases. Sort by Genre ascending.",
    "brief": "Return one row per genre, with separate columns for title count and total stock.",
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
      "Genre is both an output field and the grouping field.",
      "COUNT(BookID) counts titles; SUM(Stock) adds copies.",
      "Write GROUP BY Genre, followed by ORDER BY Genre."
    ],
    "explanation": "GROUP BY produces one summary row per genre. Aggregate the records within each genre rather than the entire catalogue or each individual book.",
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
    "title": "Summarise orders by payment status",
    "prompt": "For each Paid value, display Paid, the number of orders, and the sum of Total. Give both aggregates meaningful aliases and sort by Paid ascending.",
    "brief": "Boolean values can also be used for grouping.",
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
      "Group the records by Paid.",
      "Calculate COUNT(OrderID) and SUM(Total) separately.",
      "Use GROUP BY Paid and ORDER BY Paid to set the result order."
    ],
    "explanation": "Each group is calculated separately. The values 0 and 1 represent unpaid and paid status.",
    "objectives": [
      "Group by a Boolean field",
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
    "title": "Search by a title prefix",
    "prompt": "Display only BookID and Title for books whose Title begins with River.",
    "brief": "Put % after the prefix and compare with LIKE.",
    "dataset": "library",
    "solution": "SELECT BookID, Title FROM BOOK WHERE Title LIKE 'River%';",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'River', 'Fiction', 7, 1, 0, 1),(210, 'A River Story', 'Fiction', 8, 1, 0, 2),(211, 'River Paths', 'Fiction', 9, 1, 0, 2);"
      }
    ],
    "hints": [
      "LIKE compares text with a pattern.",
      "The fixed prefix is River.",
      "In 'River%', % can match zero or more characters."
    ],
    "explanation": "River itself matches because % can match zero characters. A River Story does not start with River.",
    "objectives": [
      "LIKE",
      "Prefixes",
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
    "title": "Search for a phrase within a title",
    "prompt": "Display only Title for books whose title contains the text ar.",
    "brief": "Put % on both sides to match any position.",
    "dataset": "library",
    "solution": "SELECT Title FROM BOOK WHERE Title LIKE '%ar%';",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'ar', 'Fiction', 7, 1, 0, 1),(210, 'Start Here', 'Computing', 8, 1, 0, 1),(211, 'Blue Sea', 'Fiction', 9, 1, 0, 2);"
      }
    ],
    "hints": [
      "The text may be at the beginning, middle or end.",
      "Any other characters may appear on either side.",
      "Use '%ar%'."
    ],
    "explanation": "Wildcards on both sides allow surrounding text. A wildcard on only one side restricts the search to a prefix or suffix.",
    "objectives": [
      "LIKE",
      "Contains matching"
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
    "title": "Find publishers ending in Press",
    "prompt": "Display only PublisherName for publishers whose name ends with Press.",
    "brief": "Put % before the fixed suffix.",
    "dataset": "library",
    "solution": "SELECT PublisherName FROM PUBLISHER WHERE PublisherName LIKE '%Press';",
    "checks": [
      {
        "seed": "INSERT INTO PUBLISHER VALUES (5, 'Press', 'UK'),(6, 'Press Works', 'UK'),(7, 'South Press', 'Canada');"
      }
    ],
    "hints": [
      "Query the PUBLISHER table.",
      "The fixed text belongs at the end.",
      "Use '%Press', with no % after Press."
    ],
    "explanation": "The suffix pattern includes South Press and excludes Press Works, which does not end in Press.",
    "objectives": [
      "LIKE",
      "Suffixes"
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
    "title": "Display each student's club name",
    "prompt": "Display STUDENT.Name and CLUB.ClubName for active students only. Join STUDENT to CLUB using ClubID.",
    "brief": "STUDENT stores the club ID. Read the club name from CLUB.",
    "dataset": "campus",
    "solution": "SELECT STUDENT.Name, CLUB.ClubName FROM STUDENT INNER JOIN CLUB ON STUDENT.ClubID = CLUB.ClubID WHERE STUDENT.Active = TRUE;",
    "checks": [
      {
        "seed": "INSERT INTO STUDENT VALUES (109, 'Imani', 10, 'Willow', 81, 1, 'C01'), (110, 'Juno', 12, 'Maple', 90, 0, 'C02');"
      }
    ],
    "hints": [
      "ClubID links the two tables.",
      "After INNER JOIN, compare the two ClubID fields in ON.",
      "WHERE STUDENT.Active = TRUE filters for active students after the join."
    ],
    "explanation": "Match students and clubs with equal IDs to pair each student with the correct club.",
    "objectives": [
      "INNER JOIN",
      "ON",
      "Qualified fields"
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
    "title": "Find books from UK publishers",
    "prompt": "Display BOOK.Title and PUBLISHER.PublisherName for books published by a publisher whose Country is UK. Sort by BOOK.Title ascending.",
    "brief": "The condition uses a publisher field and the result uses both tables.",
    "dataset": "library",
    "solution": "SELECT BOOK.Title, PUBLISHER.PublisherName FROM BOOK INNER JOIN PUBLISHER ON BOOK.PublisherID = PUBLISHER.PublisherID WHERE PUBLISHER.Country = 'UK' ORDER BY BOOK.Title;",
    "checks": [
      {
        "seed": "INSERT INTO BOOK VALUES (209, 'Patterns', 'Computing', 7.5, 6, 0, 1), (210, 'Low Tide', 'Fiction', 22, 1, 1, 2);"
      }
    ],
    "hints": [
      "Join on PublisherID.",
      "Country belongs to PUBLISHER.",
      "Filter for UK, then sort by BOOK.Title."
    ],
    "explanation": "Table prefixes identify the source of each field. A publisher can have several books, so its name may appear more than once.",
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
    "title": "Total paid amounts by customer",
    "prompt": "For each customer with at least one paid order, display CustomerName and the sum of paid order Total. Give the aggregate a meaningful alias. Sort by CustomerName ascending, then by CustomerID ascending when names match. Use no more than two tables.",
    "brief": "Join the tables, filter paid orders, then group by customer.",
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
      "CustomerID links CUSTOMER and ORDERS.",
      "WHERE Paid = TRUE selects the orders to include in the total.",
      "Group by customer ID and name. In ORDER BY, sort by name and then ID to order customers with identical names consistently."
    ],
    "explanation": "Filter before grouping. Grouping by the unique customer ID keeps customers with the same name separate. Break name ties using the ID. Customers without paid orders are excluded.",
    "objectives": [
      "Two-table queries",
      "GROUP BY",
      "SUM",
      "Customers with identical names"
    ]
  }
];

export const syllabusLinks = [
  {
    "id": "0478-2026",
    "level": "ig",
    "title": "IGCSE 0478 · 2026–2028",
    "url": "https://www.cambridgeinternational.org/Images/697167-2026-2028-syllabus.pdf",
    "note": "Section 9, page 30: single-table databases, basic types, primary keys, queries and output prediction."
  },
  {
    "id": "9618-2026",
    "level": "as",
    "title": "AS & A Level 9618 · 2026",
    "url": "https://www.cambridgeinternational.org/Images/697372-2026-syllabus.pdf",
    "note": "Section 8.3, pages 26–27: DDL, DML, two-table queries and summaries."
  },
  {
    "id": "9618-2027",
    "level": "as",
    "title": "AS & A Level 9618 · 2027–2029",
    "url": "https://www.cambridgeinternational.org/Images/721397-2027-2029-syllabus.pdf",
    "note": "Section 8.3: the SQL scope matches the 2026 syllabus. This AS foundation also applies to the full A Level."
  }
];
