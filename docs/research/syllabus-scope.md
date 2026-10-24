# SQL curriculum scope and evidence rules

Research date: 2026-10-24. This is an independent learning product, not an official Cambridge product. Original exercises are aligned to the examined skills, not copied past-paper questions.

## Primary sources

- [0478, examinations 2026–2028, section 9, page 30](https://www.cambridgeinternational.org/Images/697167-2026-2028-syllabus.pdf)
- [0478 update, version 5, December 2025](https://www.cambridgeinternational.org/Images/711263-2026-2028-syllabus-update.pdf): the latest update changes a web link; preceding amendments do not alter this SQL scope.
- [9618, examination 2026, section 8.3, pages 26–27](https://www.cambridgeinternational.org/Images/697372-2026-syllabus.pdf)
- [9618, examinations 2027–2029, section 8.3, pages 26–27](https://www.cambridgeinternational.org/Images/721397-2027-2029-syllabus.pdf)
- [9618 2027–2029 update, version 2, December 2025](https://www.cambridgeinternational.org/Images/747147-2027-2029-syllabus-update.pdf): clarification of papers/calculators, not SQL changes.

The official website intermittently returned maintenance/403/404 during research. Indexed Cambridge primary-document text and Cambridge-authored PDFs on mirrors were cross-checked; the original official URLs remain the authoritative references. Past-paper detail is recorded separately in the IG and AS audits, with actual QP and MS URLs and question/page locators. Historical examiner acceptance is evidence for that question, not a promise about every future examination.

## IG: 0478

Single-table query reading, completion and output prediction. Core keywords: SELECT, FROM, WHERE, ORDER BY with ascending/descending direction, SUM, COUNT, AND, OR. Teach fields, records, appropriate basic types and primary keys alongside the queries. No joins, GROUP BY, AVG or write statements in IG core practice.

Teach full SELECT statements, ordinary comparison operators, correctly quoted text and contextual Boolean conditions. Canonical ordering uses ASCENDING/DESCENDING; execution accepts the standard abbreviations as equivalent. A missing direction means ascending. A sort field need not appear in the projection. Preserve field names including underscores and dollar signs.

Past-paper evidence adds narrowly explained alternatives: single/double text quotes, TRUE/FALSE and contextual YES/NO/Y/N/T/F data, a bare Boolean field and NOT BooleanField. A specific mark scheme accepts LIKE for exact equality; this does not expand IG core teaching into wildcard matching. A printed incomplete aggregate expression is not a model for writing a complete SQL statement.

## AS and full A Level: 9618

SQL belongs to AS section 8 and Paper 1, and remains part of the full A Level qualification. There is no separately invented A2 SQL dialect. Both selected syllabus windows use the same SQL scope.

Queries use at most two tables: SELECT/FROM, WHERE, ORDER BY, GROUP BY, INNER JOIN, SUM, COUNT and AVG. Maintenance includes INSERT INTO, UPDATE and DELETE FROM. DDL includes CREATE DATABASE, CREATE TABLE and ALTER TABLE, primary keys and foreign keys. Canonical types: CHARACTER, VARCHAR(n), BOOLEAN, INTEGER, REAL, DATE, TIME.

Past papers additionally demonstrate LIKE patterns, comma joins with equality in WHERE, table-qualified fields, aliases, multiple SET assignments, and hash-delimited dates. Canonical examples prefer INNER JOIN, unambiguous qualified fields, % wildcards, ISO dates and syllabus types; each historical variation is labelled. Real paper identifiers may be reserved words such as ORDER; executor adaptation must preserve that name. GROUP BY examples may project a name functionally determined by the grouped primary key.

## Implementation contract

1. Separate syllabus scope checking from execution correctness. Out-of-scope messages say that the learning mode does not cover the construct, never that all SQL engines or all Cambridge examiners reject it.
2. Keep learners' original SQL visible. Explain any compatibility translation.
3. Use a real local SQL engine with explicit adapters for Cambridge spelling/DDL differences; SQLite errors must not masquerade as exam rules.
4. Grade SELECT answers by ordered columns and values, ignoring row order unless the task requests sorting. Use additional datasets to reduce accidental correct answers; do not compare SQL strings for equivalence.
5. Grade writes/DDL using resulting data/schema on fresh isolated exercise databases. Failed attempts must not damage subsequent attempts.
6. Original practice feedback is formative, not an official mark or a grade prediction.
7. Retain evidence links, exam windows, curriculum boundaries and known simulation limits in the product.

## Delivery and acceptance

Responsive English-language web/PWA with lessons, exercises, hints, feedback and syntax references in English. Local drafts/progress, mistake review, lesson path, free SQL lab, timed practice and export/import. Phone/tablet/desktop visual checks and keyboard checks; 31 documented usability issues resolved. Available through GitHub Pages, with local static source that runs directly with Node.
