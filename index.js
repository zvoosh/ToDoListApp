// createToogle
const cancelCreate = document.getElementById("create-cancel");
const createTask = document.getElementById("create-task");
// checkboxes
const typecheckboxes = document.querySelectorAll(
  'input[name="personal"], input[name="work"], input[name="other"]'
);
const priocheckboxes = document.querySelectorAll(
  'input[name="high"], input[name="medium"], input[name="low"]'
);

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
function getTaskType(task) {
  if (task.work) return "Work";
  if (task.personal) return "Personal";
  return "Other";
}
//create modal
function onOpenCreate() {
  document.getElementById("add-title").textContent = "Add new task";
  document.getElementById("task-form").reset();
  typecheckboxes.forEach((checkbox) => {
    checkbox.disabled = false;
  });
  priocheckboxes.forEach((checkbox) => {
    checkbox.disabled = false;
  });
  const container = document.getElementById("create-container");
  container.classList.add("open-create");
}

function onCloseCreate() {
  const container = document.getElementById("create-container");
  container.classList.remove("open-create");
}
function handleUncheckedCheckboxes(checkboxes) {
  const oneChecked = Array.from(checkboxes).some((cb) => cb.checked);

  checkboxes.forEach((cb) => {
    cb.disabled = oneChecked && !cb.checked;
  });
}

// disable unchecked checkboxes
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
// disable unchecked checkboxes
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
//edit preload tasks
function editTask() {
  document.querySelectorAll(".edit-task").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.currentTarget.getAttribute("data-index");
      document.getElementById("add-title").textContent = "Edit task";
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

      const container = document.getElementById("create-container");
      container.classList.add("open-create");

      document.getElementById("title").value = tasks[index].title || "";
      document.getElementById("descritpion").value =
        tasks[index].descritpion || "";
      document.getElementById("personal").checked =
        tasks[index].personal === "on";
      document.getElementById("work").checked = tasks[index].work === "on";
      document.getElementById("other").checked = tasks[index].other === "on";
      document.getElementById("completed").checked =
        tasks[index].completed === "on";
      document.getElementById("high").checked = tasks[index].high === "on";
      document.getElementById("medium").checked = tasks[index].medium === "on";
      document.getElementById("low").checked = tasks[index].low === "on";
      document.getElementById("startDate").value = tasks[index].startDate || "";
      document.getElementById("endDate").value = tasks[index].endDate || "";
      document.getElementById("task-form").setAttribute("data-mode", "edit");
      document.getElementById("task-form").setAttribute("data-index", index);

      handleUncheckedCheckboxes(typecheckboxes);
      handleUncheckedCheckboxes(priocheckboxes);
    });
  });
}
//search enable
document
  .getElementById("search-input")
  .addEventListener("input", function (event) {
    const query = event.target.value.toLowerCase();
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const filtered = tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(query) ||
        (task.descritpion && task.descritpion.toLowerCase().includes(query))
      );
    });

    onRenderTasks(filtered);
  });
function onRenderTasks(taskArray = null) {
  const tasks = taskArray || JSON.parse(localStorage.getItem("tasks")) || [];
  const container = document.getElementById("task-list");
  container.innerHTML = "";

  tasks.forEach((task, index) => {
    const circleClass = getCircleClass(task);
    const headerClass = getCardHeaderClass(task);
    const startDate = formatDate(task.startDate);
    const endDate = formatDate(task.endDate);
    const card = document.createElement("div");
    card.className = "card-container";
    card.dataset.index = index;
    card.innerHTML = `
      <div class="card-header user-text ${headerClass}">
        <div class="card-title">
          <span class="card-circle pointer ${circleClass}" data-index="${index}"></span>
          <span class="px-1 bold">${task.title || "Untitled"}</span>
        </div>
        <div class="card-category py-05">
          <div class="menu-item edit-task" data-index="${index}"><span class="p-05">✎</span></div>
          <div class="menu-item delete-task" data-index="${index}"><span class="p-05">✖</span></div>
        </div>         
      </div>
      <div class="card-content">
        <div class="card-category">
          <div class="" data-index="${index}">${getTaskType(
      task
    )}</div>
        <div>
          ${task.completed === "on" ? "(Completed)" : ""}</div>
        </div>
        <div>
          <div class="py-05 flex justify-space-between align-center user-text">
            📆${startDate}${task.endDate ? ` - ${endDate}` : ""}
          </div>
        </div>
        <div class="text-next-line user-text">${task.descritpion || ""}</div>
      </div>
    `;
    container.appendChild(card);
  });

  //toggle card-circle change
  document.querySelectorAll(".card-circle").forEach((circle) => {
    circle.addEventListener("click", () => {
      const index = circle.getAttribute("data-index");
      tasks[index].completed = tasks[index].completed === "on" ? "off" : "on";
      localStorage.setItem("tasks", JSON.stringify(tasks));
      onRenderTasks();
    });
  });

  // delete task
  document.querySelectorAll(".delete-task").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.currentTarget.getAttribute("data-index");
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      onRenderTasks();
    });
  });
  editTask();
  if (tasks.length === 0) {
    const message = document.createElement("div");
    message.className = "no-tasks-message";
    message.textContent = "You have no tasks prepared.";
    container.appendChild(message);
    return;
  }
}

//Submit form
document.getElementById("task-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const taskData = {};
  formData.forEach((value, key) => {
    taskData[key] = value;
  });

  let valid = true;
  let errorMsg = "";

  const titleField = document.getElementById("title").value.trim();
  const startDateField = document.getElementById("startDate").value;
  const endDateField = document.getElementById("endDate").value;

  const typeChecked = Array.from(typecheckboxes).some((cb) => cb.checked);
  const prioChecked = Array.from(priocheckboxes).some((cb) => cb.checked);

  if (!titleField) {
    valid = false;
    errorMsg += "Title is required.\n";
  }

  if (!typeChecked) {
    valid = false;
    errorMsg += "Type of task is required.\n";
  }

  if (!prioChecked) {
    valid = false;
    errorMsg += "Priority of task is required.\n";
  }
  if (!startDateField) {
    valid = false;
    errorMsg += "Starting date of task is required.\n";
  }
  if (!endDateField) {
    valid = false;
    errorMsg += "Ending date of task is required.\n";
  }

  if (new Date(endDateField) < new Date(startDateField)) {
    valid = false;
    errorMsg += "End date can't be before the starting date.\n";
  }

  if (!valid) {
    e.preventDefault();
    alert(errorMsg);
    return;
  }

  const mode = this.getAttribute("data-mode");
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (mode === "edit") {
    const index = this.getAttribute("data-index");
    tasks[index] = taskData;
    this.setAttribute("data-mode", "create");
    this.removeAttribute("data-index");
  } else {
    tasks.push(taskData);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  onRenderTasks();
  const container = document.getElementById("create-container");
  container.classList.remove("open-create");
  this.reset();

  typecheckboxes.forEach((checkbox) => {
    checkbox.disabled = false;
  });
  priocheckboxes.forEach((checkbox) => {
    checkbox.disabled = false;
  });
});

//Initial Tasks render
document.addEventListener("DOMContentLoaded", () => {
  onRenderTasks();
});
