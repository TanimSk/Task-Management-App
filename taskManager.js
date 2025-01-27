let tasks = [];

// --------- DOM elements ---------
let formDom = document.querySelector('#taskForm');
let taskListDom = document.querySelector('#taskList');


// --------- task manager functions ---------

const addTask = (title, description, priority) => {
    const task = {
        taskId: Date.now(),
        title: title,
        description: description,
        priority: priority,
        completed: false
    };
    tasks.push(task);

    //   store the tasks in the local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    console.log("Task added successfully");
    console.log(tasks);
    renderTasks();
}

const deleteTask = (taskId) => {
    const index = tasks.findIndex(task => task.taskId === taskId);
    tasks.splice(index, 1);

    //   update the local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    console.log("Task deleted successfully");
    console.log(tasks);
    renderTasks();
}

const updateTask = (taskId, updates) => {
    const index = tasks.findIndex(task => task.taskId === taskId);

    // override the existing task with the updates
    tasks[index] = { ...tasks[index], ...updates };

    //   update the local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    console.log("Task updated successfully");
    console.log(tasks);
    renderTasks();
}

const toggleTaskCompletion = (taskId) => {
    const index = tasks.findIndex(task => task.taskId === taskId);
    tasks[index].completed = !tasks[index].completed;

    //   update the local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    console.log("Task completion status updated successfully");
    console.log(tasks);
    renderTasks();
}

// render the tasks on the DOM
const renderTasks = () => {
    taskListDom.innerHTML = '';
    tasks.forEach(task => {
        let taskDom = document.createElement('div');
        taskDom.classList.add('task-item');
        taskDom.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>${task.priority}</p>
            <button onclick="deleteTask(${task.taskId})">Delete</button>
            <button onclick="toggleTaskCompletion(${task.taskId})">${task.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
        `;
        taskListDom.appendChild(taskDom);
    });
}


//  load the tasks from the local storage
const loadTasks = async () => {
    const tasksString = localStorage.getItem('tasks');

    //  check if the tasks exist in the local storage
    if (tasksString) {
        tasks = JSON.parse(tasksString);
        renderTasks();
    }
}


// --------- Event listeners ---------
window.addEventListener('load', loadTasks);

// add task
formDom.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(formDom);
    let title = document.getElementById('taskTitle').value;
    let description = document.getElementById('taskDescription').value;
    let priority = document.getElementById('taskPriority').value;

    addTask(title, description, priority);
    formDom.reset();
});

