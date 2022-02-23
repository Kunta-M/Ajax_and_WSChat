const table = document.querySelector('#table');
const tbody = document.querySelector('#tbody');
const btnLabels = {
    edit: 'editBtn',
    delete: 'deleteBtn',
    save: 'saveBtn',
    cancel: 'cancelBtn'
}
const spinner = document.querySelector('.spinner');
let userList = [];

function showSpinner () {
    spinner.style.display = 'block';
}

function hideSpinner () {
    spinner.style.display = 'none';
}

function getUsers () {
    showSpinner();
    return fetch('https://jsonplaceholder.typicode.com/users')
        .then((response) => {
            return response.json();
        });
}

function deleteUser (id) {
    showSpinner();
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE'
    }).then(response => response.json())
}

function updateUser (payload, id) {
    showSpinner();
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    }).then((response) => {
        return response.json();
    })
}

function drawTable (id) {
    tbody.innerHTML = '';
    userList.forEach((user) => {
        if (id && id === user.id) {
            tbody.insertAdjacentHTML('beforeend', drawEditRow(user, id))
        } else {
            tbody.insertAdjacentHTML('beforeend', drawRow(user, id))
        }
    });
}

function drawRow (user) {
    return `<tr scope="row">
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td><button class="btn btn-warning" id="${btnLabels.edit}${user.id}" type="button">Edit</button></td>
        <td><button class="btn btn-danger" id="${btnLabels.delete}${user.id}" type="button">Delete</button></td>
        </tr>`
}

function drawEditRow (user) {
    return `<tr scope="row">
        <td>${user.id}</td>
        <td>
            <input class="form-control" name="name" form="my_form" value="${user.name}">
        </td>
        <td>
            <input class="form-control" name="username" form="my_form" value="${user.username}">
        </td>
        <td>
            <input class="form-control" name="email" form="my_form" value="${user.email}">
        </td>
        <td>
            <input class="form-control" name="phone" form="my_form" value="${user.phone}">
        </td>
        <td><button class="btn btn-success" id="${btnLabels.save}${user.id}" type="button">Save</button></td>
        <td><button class="btn btn-danger" id="${btnLabels.cancel}${user.id}" type="button">Cancel</button></td>
        </tr>`
}

table.addEventListener('click', (event) => {
    let isEditClick = event.target.id.includes(btnLabels.edit);
    let isDeleteClick = event.target.id.includes(btnLabels.delete);
    let isCancelClick = event.target.id.includes(btnLabels.cancel);
    let isSaveClick = event.target.id.includes(btnLabels.save);

    if (isEditClick) {
        let id = +event.target.id.slice(btnLabels.edit.length);
        drawTable(id);
    } else if (isDeleteClick) {
        let id = +event.target.id.slice(btnLabels.delete.length);
        deleteUser(id).then(() => {
            userList = userList.filter((user) => id !== user.id);
            drawTable();
            hideSpinner();
        })
    } else if (isCancelClick) {
        drawTable();
    } else if (isSaveClick) {
        let id = +event.target.id.slice(btnLabels.save.length);
        let formData = new FormData(document.querySelector('.my_form'));
        let payload = {}
        for (let key of formData.keys()) {
            payload[key] = formData.get(key);
        }

        updateUser(payload, id).then(() => {
            let user = userList.find(user => id === user.id);
            for (let key of Object.keys(payload)) {
                user [key] = payload[key];
            }
            drawTable();
            hideSpinner();
        })
    }
})

getUsers().then((users) => {
    userList = users;
    drawTable();
    hideSpinner();
})