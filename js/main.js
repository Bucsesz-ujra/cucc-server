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

//Fill table with server data
function fillDataTable(data, tableID){
    let table = document.querySelector(`#${tableID}`);
    if (!table) {
        console.error(`Table "${tableID}" has not been found.`);
        return;
    }

    let tBody = table.querySelector("tbody");
    for (let row of data) {
        let tr = createAnyElement("tr");
        for (let k in row){
            let td = createAnyElement("td");
            td.innerHTML = row[k];
            tr.appendChild(td);
        }
        let btnGroup = createBtnGroup();
        tr.appendChild(btnGroup); 
        tBody.appendChild(tr);
    }
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
    let infoBtn = createAnyElement("button", {type: "button", class: "btn btn-info", onclick: "getInfo(this)"});
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
    let id = tr.querySelector("td:first-child").innerHTML;
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache"
    };

    fetch(`http://localhost:3000/users/${id}`,fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => {
            startGetUsers();
        }
    )
}