# QueryPath implementation design

The main journey is learning a small concept, inspecting actual table data, writing SQL, reading specific feedback, and returning to mistakes. Home shows genuine local progress, not invented streaks or rankings.

## Navigation

Five areas: overview; learning path; exercises; SQL lab; syllabus evidence. Progress and backup settings are always accessible. Desktop uses a quiet fixed sidebar; tablets use a compact sidebar; phones use a bottom navigation bar and single-column content. Wide result tables scroll within their card rather than forcing the page wider. No interaction relies on hover.

## Learning and assessment

Original Chinese explanations accompany English question prompts and SQL. IG and AS/full AL paths remain separate. A study session exposes dataset schema/rows, a plain accessible editor with keyword insertion, run and submit actions, progressive hints, a labelled reference answer, and a next-exercise action. Seeing a reference solution is recorded as assisted; it does not count as independent mastery. Drafts persist per exercise.

SELECT answers compare shape and values with the reference result and additional data where provided; order matters only when requested. Schema/write tasks compare the resulting database rather than just a success message. Prediction and concept tasks have explicit answer controls. Timed practice uses a small selected set of questions, a wall-clock deadline saved locally, and a report; timing does not claim to replicate a complete official paper.

## Local state

Versioned localStorage holds drafts, attempts, successes, bookmarks, notes and settings. The lab database is exported from SQLite into browser storage after successful changes. JSON export/import supports transferring progress; imports are validated and merged, with clear counts. Storage failures are shown. No sign-in, backend, telemetry or remote answer execution.

## Delivery

Buildless ES modules, locally vendored sql.js WebAssembly, CSS and service worker. `npm start` serves the application. All learning assets are local. HTTPS/localhost enables offline caching and home-screen installation; ordinary LAN HTTP still supports live use on phones/tablets while the local server runs. A server URL is not falsely presented as an internet deployment.

## Acceptance

Execute every model answer, test grading against wrong-but-plausible answers and engine compatibility, then use actual Chromium rendering at phone/tablet/desktop sizes with interactions. Maintain an evidence-based log of at least20 usability improvements and verify each. Report browser/device verification limits honestly; no finite testing can prove that no future modification could ever be useful.
