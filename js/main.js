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

document.querySelector("#getDataBtn").addEventListener("click",function(){
    getServerData("http://localhost:3000/users").then(
        data => fillDataTable(data,"userTable")  
    );
});

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
        element.setAttribute(name,attributes[k]);
    }
    return element;
}

function createBtnGroup(){
    let group = createAnyElement("div",{class: "btn btn-group"});
    let infoBtn = createAnyElement("button",{class: "btn btn-info"});
    let delBtn = createAnyElement("button",{class: "btn btn-danger"});

    group.appendChild(infoBtn);
    group.appendChild(delBtn);

    let td = createAnyElement("td");
    td.appendChild(group);

    return td;
}