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
    // push the latest task first
    tasks.unshift(task);

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

    // sorting tasks by priority
    tasks.sort((a, b) => {
        if (a.priority === 'high') {
            return -1;
        } else if (a.priority === 'medium' && b.priority === 'low') {
            return -1;
        } else if (a.priority === 'medium' && b.priority === 'high') {
            return 1;
        } else if (a.priority === 'low') {
            return 1;
        }
        return;
    });

    // sorting tasks by completion status
    tasks.sort((a, b) => {
        if (a.completed && !b.completed) {
            return 1;
        } else if (!a.completed && b.completed) {
            return -1;
        }
        return 0;
    });

    tasks.forEach(task => {
        let taskDom = document.createElement('div');
        taskDom.classList.add('task-item');
        taskDom.innerHTML = `            
            <h3 class="${task.completed ? 'task-completed ' : ''}">${task.title}</h3>
            <p class="${task.completed ? 'task-completed ' : ''}">${task.description}</p>
            <p class="${task.completed ? 'task-completed ' : ''}">${task.priority}</p>            
            <div class=task-actions>
                <button class="delete-btn" onclick="deleteTask(${task.taskId})">Delete</button>
                <button class="complete-btn" onclick="toggleTaskCompletion(${task.taskId})">${task.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
            </div>
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

