//Keys of users

let keys = ['id','name','email'];

//Get data from server
function getServerData(url) {
    let fetchOptions =
    {
        method: "GET",
        mode: "cors",
        cahce: "no-cache"
    };

    return fetch(url,fetchOptions).then(
        response => response.json(),
        err => console.error(err)
    )
}

function startGetUsers(){
    getServerData("http://localhost:3000/users").then(
        data => fillDataTable(data,"userTable")  
    );
}

document.querySelector("#getDataBtn").addEventListener("click",startGetUsers);

startGetUsers();

//Fill table with server data
function fillDataTable(data, tableID){
    
    let table = document.querySelector(`#${tableID}`);
    if (!table) {
        console.error(`Table "${tableID}" has not been found.`);
        return;
    }

    let tBody = table.querySelector("tbody");
    tBody.innerHTML = "";
    for (let row of data) {
        let tr = createAnyElement("tr");
        for (let k of keys){
            let td = createAnyElement("td");
            let input = createAnyElement("input",{
                class: "form-control",
                value: row[k],
                name: k
            });
            if (k == 'id'){
                  input.setAttribute("readonly",true);     
            }
            td.appendChild(input);
            tr.appendChild(td);
        }
        let btnGroup = createBtnGroup();
        tr.appendChild(btnGroup); 
        tBody.appendChild(tr);
    }

    //Add new user row to the table
    let newRow = newUserRow(data[0]);
    tBody.appendChild(newRow);
}

function createAnyElement(name,attributes){
    let element = document.createElement(name);
    for (let k in attributes){
        element.setAttribute(k, attributes[k]);
    }
    return element;
}

function createBtnGroup(){
    let group = createAnyElement("div", {class: "btn btn-group"});
    let infoBtn = createAnyElement("button", {type: "button", class: "btn btn-info", onclick: "setRow(this)"});
    infoBtn.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i>';
    let delBtn = createAnyElement("button", {type: "button", class: "btn btn-danger", onclick: "delRow(this)"});
    delBtn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';

    group.appendChild(infoBtn);
    group.appendChild(delBtn);

    let td = createAnyElement("td");
    td.appendChild(group);

    return td;
}

function delRow(btn){
    let tr = btn.parentElement.parentElement.parentElement;
    let data = getRowData(tr);
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache"
    };

    fetch(`http://localhost:3000/users/${data.id}`,fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => {
            startGetUsers();
        }
    )
}

//Create new user

function newUserRow(row){
    let tr = createAnyElement("tr");
    for (let k of keys){
        let td = createAnyElement("td");
        if (k == 'id'){
            td.innerHTML = "";
        }
        else{
            let input = createAnyElement("input",{
                class: "form-control",
                name: k
            });
            td.appendChild(input);
        }
        tr.appendChild(td);
    }
    let newBtn = createAnyElement("button",{
        class: "btn btn-success",
        onclick: "createUser(this)"
    });
    newBtn.innerHTML = '<i class = "fa fa-plus-circle aria-hidden="true"></i>';
    let td = createAnyElement("td");
    td.appendChild(newBtn);
    tr.appendChild(td);
    return tr;
}

function createUser(btn){
    let tr = btn.parentElement.parentElement;
    let data = getRowData(tr);
    delete data.id;
    let fetchOptions ={
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-type':'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch(`http://localhost:3000/users`,fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => {
            startGetUsers();
        }
    )
}

function getRowData(tr){
    let inputs = tr.querySelectorAll("input.form-control");
    let data = {};
    for (let i= 0;i<inputs.length; i++){
        data[inputs[i].name] = inputs[i].value;
    }
    return data;
}

//Set data
function setRow(btn){
    let tr = btn.parentElement.parentElement.parentElement;
    let data = getRowData(tr);

    console.log(data);

    let fetchOptions ={
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-type':'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch(`http://localhost:3000/users/${data.id}`,fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => {
            startGetUsers();
        }
    )
}