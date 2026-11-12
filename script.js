(() => {
  const KEY = "todo.v2";
  const $ = (id) => document.getElementById(id);
  const list = $("list-container"), input = $("input-box"), empty = $("empty");
  let tasks = [], filter = "all";

  try { tasks = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { tasks = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch (e) {} };

  $("date").textContent = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

  function render() {
    list.textContent = "";
    const shown = tasks.filter((t) => filter === "all" || (filter === "done" ? t.done : !t.done));
    for (const t of shown) {
      const li = document.createElement("li");
      li.className = t.done ? "done" : "";
      li.dataset.id = t.id;
      const chk = document.createElement("button");
      chk.className = "chk"; chk.textContent = "✓"; chk.setAttribute("aria-label", t.done ? "Mark as not done" : "Mark as done");
      const txt = document.createElement("span");
      txt.className = "txt"; txt.textContent = t.text;
      const del = document.createElement("button");
      del.className = "del"; del.textContent = "×"; del.setAttribute("aria-label", "Delete task");
      li.append(chk, txt, del);
      list.append(li);
    }
    empty.hidden = shown.length > 0;
    const left = tasks.filter((t) => !t.done).length, done = tasks.length - left;
    $("count").textContent = left === 1 ? "1 task left" : left + " tasks left";
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    $("pct").textContent = pct + "%";
    $("ring").style.strokeDashoffset = 100 - pct;
    $("clear").hidden = done === 0;
  }

  $("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    tasks.unshift({ id: Date.now() + Math.random(), text, done: false });
    input.value = ""; save(); render();
  });

  list.addEventListener("click", (e) => {
    const li = e.target.closest("li"); if (!li) return;
    const t = tasks.find((x) => String(x.id) === li.dataset.id); if (!t) return;
    if (e.target.closest(".del")) {
      li.classList.add("out");
      setTimeout(() => { tasks = tasks.filter((x) => x !== t); save(); render(); }, 200);
    } else { t.done = !t.done; save(); render(); }
  });

  document.querySelector(".filters").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    filter = b.dataset.f;
    document.querySelectorAll(".filters button").forEach((x) => x.classList.toggle("on", x === b));
    render();
  });

  $("clear").addEventListener("click", () => { tasks = tasks.filter((t) => !t.done); save(); render(); });
  render();
})();
