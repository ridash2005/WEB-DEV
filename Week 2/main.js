// main.js

// Function to load saved to-dos from local storage
function loadToDos() {
    var savedToDos = localStorage.getItem('todos');
    return savedToDos ? JSON.parse(savedToDos) : [];
}

// Function to save to-dos to local storage
function saveToDos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Event listener for checkbox changes (using event delegation)
document.getElementById('toDoContainer').addEventListener('change', function (event) {
    if (event.target.type === 'checkbox') {
        var index = event.target.dataset.index;
        toggleDone(index);
    }
});


// Function to render to-dos
function renderToDos() 
{
    var toDoContainer = document.getElementById('toDoContainer');
    toDoContainer.innerHTML = ''; // Clear existing to-dos

    var todos = loadToDos();

    todos.forEach(function (todo, index) 
    {
        // Create a new to-do item
        var toDoItem = document.createElement('div');
        toDoItem.className = 'todo-item';
        
        // Add 'done' class if the task is completed
        if (todo.done) 
        {
            toDoItem.classList.add('done');
        }

       // Create a checkbox for marking as done
       var checkbox = document.createElement('input');
       checkbox.type = 'checkbox';
       checkbox.checked = todo.done;
       checkbox.dataset.index = index; // Store the index as a data attribute
       // Note: The event listener is now handled by event delegation

        // Create a span for the to-do text
        var toDoText = document.createElement('span');
        toDoText.textContent = todo.text;

        // Create a span for the priority
        var prioritySpan = document.createElement('span');
        prioritySpan.className = 'todo-priority';
        prioritySpan.textContent = todo.priority;

        // Create a span for the due date
        var dueDateSpan = document.createElement('span');
        dueDateSpan.textContent = 'Due Date: ' + todo.dueDate;

        // Create a span for the due time
        var dueTimeSpan = document.createElement('span');
        dueTimeSpan.textContent = 'Due Time: ' + todo.dueTime;

        // Create a button for deleting the to-do
        var deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
            // Remove the to-do from the array and save to local storage
            todos.splice(index, 1);
            saveToDos(todos);
            renderToDos();
        });

        // Create a button for editing the to-do
        var editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function () {
            showEditForm(todo, index);
        });

        // Append the elements to the to-do item
        toDoItem.appendChild(checkbox);
        toDoItem.appendChild(toDoText);
        toDoItem.appendChild(prioritySpan);
        toDoItem.appendChild(dueDateSpan);
        toDoItem.appendChild(dueTimeSpan);
        toDoItem.appendChild(deleteButton);
        toDoItem.appendChild(editButton);

        // Append the to-do item to the container
        toDoContainer.appendChild(toDoItem);
    });
}

// Function to handle adding a new to-do
function addToDo() {
    var inputField = document.getElementById('inputField');
    var prioritySelect = document.getElementById('prioritySelect');
    var dueDateInput = document.getElementById('dueDate');
    var dueTimeInput = document.getElementById('dueTime');

    var todos = loadToDos();

    var newToDo = {
        text: inputField.value,
        priority: prioritySelect.value,
        dueDate: dueDateInput.value || getCurrentDate(),
        dueTime: dueTimeInput.value || getCurrentTime(),
        done: false, // New property for marking as done
    };

    todos.push(newToDo);
    saveToDos(todos);

    inputField.value = '';
    dueDateInput.value = '';
    dueTimeInput.value = '';

    renderToDos();
}


// Function to toggle the 'done' status of a to-do
function toggleDone(index) {
    var todos = loadToDos();

    todos[index].done = !todos[index].done;
    saveToDos(todos);
    renderToDos();
}

// Function to get the current date
function getCurrentDate() {
    var currentDate = new Date();
    return currentDate.toISOString().slice(0, 10);
}

// Function to get the current time
function getCurrentTime() {
    var currentDate = new Date();
    return currentDate.toTimeString().slice(0, 5);
}

// Function to filter tasks based on priority
function filterTasks(priority) {
    var taskItems = document.getElementsByClassName('todo-item');

    for (var i = 0; i < taskItems.length; i++) {
        var taskPriority = taskItems[i].querySelector('.todo-priority').textContent.toLowerCase();

        if (priority === 'all' || taskPriority === priority) {
            taskItems[i].style.display = 'block';
        } else {
            taskItems[i].style.display = 'none';
        }
    }
}

// Live search functionality
document.getElementById('searchBar').addEventListener('input', function () {
    var searchTerm = this.value.toLowerCase();
    var toDoItems = document.querySelectorAll('.todo-item');

    toDoItems.forEach(function (item) {
        var text = item.innerText.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Event listener for adding a new to-do
document.getElementById('addToDo').addEventListener('click', addToDo);

// Render existing to-dos on page load
renderToDos();

// Function to show the edit form
function showEditForm(todo, index) {
    // Clear existing edit forms
    var existingEditForms = document.querySelectorAll('.edit-form');
    existingEditForms.forEach(function (form) {
        form.parentNode.removeChild(form);
    });

    var editForm = document.createElement('div');
    editForm.className = 'edit-form';
    editForm.innerHTML = `
        <label for="editText">Edit Text:</label>
        <input type="text" id="editText" value="${todo.text}">
        <label for="editPriority">Edit Priority:</label>
        <select id="editPriority">
            <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
            <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High</option>
        </select>
        <br>
        <label for="editDueDate">Edit Due Date:</label>
        <input type="date" id="editDueDate" value="${todo.dueDate}">
        <label for="editDueTime">Edit Due Time:</label>
        <input type="time" id="editDueTime" value="${todo.dueTime}">
        <br>
        <button onclick="updateToDo(${index})">Update</button>
    `;

    // Append the edit form to the container
    document.getElementById('toDoContainer').appendChild(editForm);
}

// Function to update a to-do
function updateToDo(index) {
    var editText = document.getElementById('editText').value;
    var editPriority = document.getElementById('editPriority').value;
    var editDueDate = document.getElementById('editDueDate').value;
    var editDueTime = document.getElementById('editDueTime').value;

    // Ensure that 'todos' is accessible here
    var todos = loadToDos();

    todos[index] = {
        text: editText,
        priority: editPriority,
        dueDate: editDueDate,
        dueTime: editDueTime,
        done: todos[index].done, // Preserve the 'done' status
    };

    saveToDos(todos);
    renderToDos(); // Re-render the to-dos after updating

    // Remove the edit form after updating
    var editForm = document.querySelector('.edit-form');
    if (editForm) {
        editForm.parentNode.removeChild(editForm);
    }
}