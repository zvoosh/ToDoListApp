const cancelCreate = document.getElementById("create-cancel");
const createTask = document.getElementById("create-task");
const typecheckboxes = document.querySelectorAll(
  'input[name="personal"], input[name="work"], input[name="other"]'
);
const priocheckboxes = document.querySelectorAll(
  'input[name="high"], input[name="medium"], input[name="low"]'
);
typecheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      typecheckboxes.forEach((other) => {
        if (other !== checkbox) {
          other.disabled = true;
        }
      });
    } else {
      typecheckboxes.forEach((other) => {
        other.disabled = false;
      });
    }
  });
});
priocheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      priocheckboxes.forEach((other) => {
        if (other !== checkbox) {
          other.disabled = true;
        }
      });
    } else {
      priocheckboxes.forEach((other) => {
        other.disabled = false;
      });
    }
  });
});
function formatDate(date) {
  const newDate = new Date(date);
  const y = newDate.getFullYear();
  const m = String(newDate.getMonth() + 1).padStart(2, "0");
  const d = String(newDate.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}
function getCircleClass(task) {
  if (task.completed === "on") return "card-circle-green";
  return "card-circle-gray";
}
function getCardHeaderClass(task) {
  if (task.high) return "card-header-high";
  if (task.medium) return "card-header-medium";
  return "card-header-low";
}
function toggleMenu() {
  const menu = document.querySelector(".menu");
  menu.classList.toggle("hidden");
}
function onRenderTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const container = document.getElementById("task-list");
  container.innerHTML = "";

  tasks.forEach((task, index) => {
    const circleClass = getCircleClass(task);
    const headerClass = getCardHeaderClass(task);
    const startDate = formatDate(task.startDate);
    const endDate = formatDate(task.endDate);
    // ${
    //             task.personal
    //               ? "Personal"
    //               : task.work
    //               ? "Work"
    //               : task.other
    //               ? "Other"
    //               : ""
    //           }
    const card = document.createElement("div");
    card.className = "card-container";
    card.innerHTML = `
      <div class="card-header user-text ${headerClass}">
        <div class="card-title">
          <span class="card-circle pointer ${circleClass}" data-index="${index}"></span>
          <span class="px-1 bold">${task.title || "Untitled"}</span>
        </div>
          <div class="card-category py-05">
            <div class="burger-wrapper" onclick="toggleMenu()">
              <div class="flex flex-column p-05 ml-05">
                <div class="burger"></div>
                <div class="burger"></div>
                <div class="burger"></div>
              </div>
              <div class="menu hidden">
                <div>Edit</div>
                <div>Delete</div>
                <div>Type</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-content">
          <div>
            <div class="py-05 flex justify-space-between align-center user-text">
              ${startDate}${task.endDate ? ` - ${endDate}` : ""}
              <div>
              ${task.completed === "on" ? "(Completed)" : ""}</div>
            </div>
          </div>
          <div class="text-next-line user-text">${task.descritpion || ""}</div>
        </div>
    `;
    container.appendChild(card);
  });

  // ✅ Attach click listeners only once
  document.querySelectorAll(".card-circle").forEach((circle) => {
    circle.addEventListener("click", () => {
      const index = circle.getAttribute("data-index");
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const task = tasks[index];

      // Toggle completion
      task.completed = task.completed === "on" ? "off" : "on";
      localStorage.setItem("tasks", JSON.stringify(tasks));

      // Re-render
      onRenderTasks();
    });
  });
}

function onOpenCreate() {
  const container = document.getElementById("create-container");
  container.classList.add("open-create");
}
function onCloseCreate() {
  const container = document.getElementById("create-container");
  container.classList.remove("open-create");
}
document.getElementById("task-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const taskData = {};
  formData.forEach((value, key) => {
    taskData[key] = value;
  });

  const storage = JSON.parse(localStorage.getItem("tasks")) || [];
  storage.push(taskData);
  localStorage.setItem("tasks", JSON.stringify(storage));

  onRenderTasks();
  this.reset();
});
window.onload = onRenderTasks;
