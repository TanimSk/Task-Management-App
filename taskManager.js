let tasks = [];

// --------- DOM elements ---------
let formDom = document.querySelector('#taskForm');
let taskListDom = document.querySelector('#taskList');


// --------- task manager functions ---------

const addTask = (title, description, priority, dueDate) => {
    // validate the task
    if (title === '' || description === '') {
        alert('Title and Description are required');
        return;
    }

    if (checkDuplicateTask(title)) {
        alert('Task already exists');
        return;
    }

    const task = {
        taskId: Date.now(),
        title: title,
        description: description,
        priority: priority,
        dueDate: dueDate,
        completed: false
    };
    // push the latest task first
    tasks.unshift(task);

    //   store the tasks in the local storage
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (e) {
        alert('Local storage is full. Please delete some tasks to add more tasks');
        return;
    }

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
    // validate the task id and updates
    if (!taskId) {
        alert('Invalid task id');
        return;
    }

    if (updates.title === '' || updates.description === '') {
        alert('Title and Description are required');
        return;
    }

    if (checkDuplicateTask(updates.title, taskId)) {
        alert('Task already exists');
        return;
    }


    const index = tasks.findIndex(task => task.taskId === taskId);

    console.log(taskId, index, updates);

    // override the existing task with the updates
    tasks[index] = {
        ...tasks[index],
        ...updates
    };

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

const checkDuplicateTask = (title, ignoreId = -1) => {
    return tasks.some(task => task.title === title && task.taskId !== ignoreId);
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
        taskDom.setAttribute("title", task.description);
        taskDom.innerHTML = `
            <input type="hidden" value="${task.taskId}" class="edit-task">
            <textarea class="edit-task" style="display: none;">${task.description}</textarea>
            <input type="text" value="${task.title}" class="edit-task" style="display: none;">            
            <select class="edit-task" style="display: none;">
                <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
            </select>
            <button class="edit-task update-btn" style="display: none;">Update</button>
            
            <h3 class="${task.completed ? 'task-completed ' : ''}">${task.title}</h3>            
            <p class="${task.completed ? 'task-completed ' : ''}">${task.priority}</p>      
            <p class="${task.completed ? 'task-completed ' : ''}">${task.dueDate}</p>      
            
            <div class=task-actions>
                <button class="delete-btn" onclick="deleteTask(${task.taskId})">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
                <button class="edit-btn">
                    <ion-icon name="create-outline"></ion-icon>
                </button>
                <button class="complete-btn" onclick="toggleTaskCompletion(${task.taskId})">
                    ${task.completed ? '<ion-icon name="reload-outline"></ion-icon>' : '<ion-icon name="checkmark-circle-outline"></ion-icon>'}
                </button>                
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
        console.log("Tasks loaded successfully");
        console.log(tasks);
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
    let dueDate = document.getElementById('taskDueDate').value;
    let priority = document.getElementById('taskPriority').value;

    addTask(title, description, priority, dueDate);
    formDom.reset();
});

// edit mode
taskListDom.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {

        let taskItem = e.target.closest('.task-item');
        let editElements = taskItem.querySelectorAll('.edit-task');

        editElements.forEach(element => {
            element.style.display = 'block';
        });

        let nonEditElements = taskItem.querySelectorAll('.task-actions, h3, p');
        nonEditElements.forEach(element => {
            element.style.display = 'none';
        });
    }
});

// update task
taskListDom.addEventListener('click', (e) => {
    if (e.target.classList.contains('update-btn')) {
        let taskId = e.target.closest('.task-item').querySelector('.edit-task[type="hidden"]').value;
        // convert task id to number
        taskId = Number(taskId);

        let title = e.target.closest('.task-item').querySelector('.edit-task[type="text"]').value;
        let description = e.target.closest('.task-item').querySelector('textarea.edit-task').value;
        let priority = e.target.closest('.task-item').querySelector('select.edit-task').value;


        updateTask(taskId, {
            title: title,
            description: description,
            priority: priority
        });
    }
});
