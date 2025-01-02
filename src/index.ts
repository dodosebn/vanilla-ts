import { v4 as uuidV4 } from "uuid";
const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("new-task-form") as HTMLFormElement | null;
const input = document.getElementById("new-task-title") as HTMLInputElement;
const totalTodos = document.querySelector<HTMLDivElement>("#total-todos");
const completedTodos = document.querySelector<HTMLDivElement>("#completed-todos");
const toggleButton = document.querySelector<HTMLButtonElement>("#toggle-theme");

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const tasks: Task[] = loadTasks();

tasks.forEach(addListItem);
updateTaskCount();

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input?.value === "" || input?.value == null) return;

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };
  tasks.push(newTask);
  saveTasks();

  addListItem(newTask);
  updateTaskCount();
  input.value = "";
});

function addListItem(task: Task) {
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveTasks();
    updateTaskCount();
    toggleStrikeAll(label, task.completed);
  });

  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  label.append(checkbox, task.title);
  item.append(label);
  list?.append(item);

  toggleStrikeAll(label, task.completed);
}

function toggleStrikeAll(label: HTMLLabelElement, isCompleted: boolean) {
  if (isCompleted) {
    label.style.textDecoration = "line-through";
  } else {
    label.style.textDecoration = "none";
  }
}

function updateTaskCount() {
  const totalCount = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;
  if (totalTodos) totalTodos.textContent = `Total Todos: ${totalCount}`;
  if (completedTodos)
    completedTodos.textContent = `Completed Todos: ${completedCount}`;
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON == null) return [];
  return JSON.parse(taskJSON);
}

toggleButton?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  saveThemePref();
});

function saveThemePref() {
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("DARK_MODE", JSON.stringify(isDarkMode));
}

function loadThemePref() {
  const isDarkMode = JSON.parse(localStorage.getItem("DARK_MODE") || "false");
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }
}

loadThemePref();
