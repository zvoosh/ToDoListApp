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
//search enable
document
  .getElementById("search-input")
  .addEventListener("input", function (event) {
    const query = event.value.toLowerCase();
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const filtered = tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(query) ||
        (task.descritpion && task.descritpion.toLowerCase().includes(query))
      );
    });

    onRenderTasks(filtered);
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

function listeners(tasks) {
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
}

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
function handleDrag(){
  let draggedIndex = null;

  document.querySelectorAll(".card-container").forEach((card) => {
    card.setAttribute("draggable", "true");
    const index = parseInt(card.dataset.index);

    card.addEventListener("dragstart", (e) => {
      draggedIndex = index;
      e.dataTransfer.setData("text/plain", index);
    });

    card.addEventListener("dragover", (e) => {
      e.preventDefault();
      card.classList.add("drag-hover"); 
    });

    card.addEventListener("dragleave", () => {
      card.classList.remove("drag-hover");
    });

    card.addEventListener("drop", (e) => {
      e.preventDefault();
      card.classList.remove("drag-hover");

      const dropIndex = index;
      if (draggedIndex === dropIndex) return; 

      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const [draggedTask] = tasks.splice(draggedIndex, 1);
      tasks.splice(dropIndex, 0, draggedTask);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      onRenderTasks();
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });
  });
}

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
    card.setAttribute("draggable", "true");
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
        <div>
          <div class="py-05 flex justify-space-between align-center user-text">
            📆${startDate}${task.endDate ? ` - ${endDate}` : ""}
            <div>
            ${task.completed === "on" ? "(Completed)" : ""}</div>
          </div>
        </div>
        <div class="text-next-line user-text">${task.descritpion || ""}</div>
      </div>
    `;
    container.appendChild(card);
  });

  listeners(tasks);
  editTask();
  handleDrag();

  if (tasks.length === 0) {
    const message = document.createElement("div");
    message.className = "no-tasks-message";
    message.textContent = "You have no tasks prepared.";
    container.appendChild(message);
    return;
  }
}

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
//Submit form
document.getElementById("task-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const taskData = {};
  formData.forEach((value, key) => {
    taskData[key] = value;
  });

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
