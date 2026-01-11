# 📋 Development To-Do List

## ToDo

- [x] **Delete Extra Unwanted Components** `resources/js/components/custom/*`

## 🚀 Core Features

- [ ] **Slug-based RUD:** Enable Single Item Read, Update, and Delete using `slug`.
- [x] **Configurable Sorting:** Implemented custom column-wise sorting, controlled by `ModuleConfig`
- [x] **Custom Multi Search** Implemented custom multi search by base controller
- [ ] **Generic Multi-Filter System:** _Example Case:_ Filter by Author Name + Genres.
    - [x] Make filter optional
    - [x] Implement single generic filtering.
    - [x] For each filter, multiple selection have to implement.
    - [ ] Implement multiple generic filtering.
    - [ ] Customize by `ModuleConfig`.
- [x] **Controller Customization:** Find a way to optionally override/customize controllers.

---

## 🔧 Bug Fixes & Stability

- [ ] **TinyMCE Options Fix:** Resolve the issue of TinyMCE's "tool options not working".
- [ ] **Fake Filler Fix:** Resolve the glitch upon filling data with Fake Filler.
- [x] **Open Glitch:** Fix the bug occurring during the "Open" edit/add form.
- [x] **Latest Fixes:** Fix data organization with latest.
- [x] **Pagination Eclipse:** Have to add pagination eclipse. Only 3 pages will show.
- [ ] **Redirect:** When there is no data, after deletion should go back to ?page=1

---

> **Status Tip:** Use `[x]` to mark a task as completed!
