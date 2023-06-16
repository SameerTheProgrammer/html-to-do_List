

const taskInput = document.querySelector(".input-container input");
let todos = JSON.parse(localStorage.getItem("todo-list"));
let taskBox = document.querySelector(".list");
let filters = document.querySelectorAll(".filters span");
const clearAll = document.querySelector(".clr-btn");
let searchBox = document.querySelector("#searchtextbox");
let isEditedTask = false;
let editId;


showTodo = (filter_id) => {
    let li = "";
    if (todos) {

        todos.forEach((todo, id) => {
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if(filter_id == todo.status || filter_id == "all") {
              li += `<li class="items">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" name="" id="${id}" ${isCompleted} />
                        <p class="${isCompleted}" >${todo.name}</p>
                    </label>
                    <div class="setting">
                        <i onClick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="setting-menu">
                            <li onClick='editTask(${id}, "${todo.name}")'><i onClick="edit(this)" class="uil uil-pen"></i>Edit</li>
                            <li onClick="deleteTask(${id})"><i class="uil uil-trash"></i>Delete</li>
                        </ul>
                    </div>
                </li>`;  
            }
            
        });
    }
    taskBox.innerHTML = li || `<span class= "span-empty">You don't have any task here.</span>`;
    let checkTask = taskBox.querySelectorAll(".items");
    !checkTask.length ? clearAll.classList.remove("actived") : clearAll.classList.add("actived");
    // taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}


showTodo("all");

clearAll.addEventListener("click", () => {
    isEditedTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all")
});

filters.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
        searchBox.value= "";
    })
})

searchBox.addEventListener("input", ()=>{
    let liItem= document.querySelectorAll(".items");
    liItem.forEach((e)=>{
        let searchedText = e.firstElementChild.innerText;
        let searchValue = searchBox.value;
        
        let re = new RegExp(searchValue,`gi`);
        if (!searchedText.match(re)) {
            e.classList.add("none")
        }
        else{
            e.classList.remove("none")
        }
    })
})

editTask = (taskId, taskName) => {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}
deleteTask = (deleteId) => {
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

showMenu = (selectedTask) => {
    console.log(selectedTask);
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    })
}

updateStatus = (selectedTask) => {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskInput.addEventListener("keyup", (e) => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask ) {

        if (!isEditedTask) {
            if (!todos) {
                todos = [];
            }
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
        } else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo("all");
    }
});
