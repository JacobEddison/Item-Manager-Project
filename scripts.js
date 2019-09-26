const itemSelect = document.getElementById("itemNumber");
const loadoutSelect = document.getElementById("loadoutDropdown");

function makeRequest(formObject, type, url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 201 || xhr.status === 202) {
                resolve(xhr.response);
            }
            else {
                reject(xhr.status);
                return xhr.status;
            }
        };
        if (type === "POST") {
            xhr.open(type, url);
            xhr.setRequestHeader("Content-Type", "application/json", "Access-Control-Allow-Origin");
            xhr.send(JSON.stringify(formObject));
        } else if (type === "GET") {
            xhr.open(type, url);
            xhr.send();
        } else if (type === "PUT") {
            xhr.open(type, url);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(formObject));
        } else if (type === "DELETE") {
            xhr.open(type, url);
            xhr.send();
        }
        //console.log(JSON.stringify(formObject));
    });
}

function handleFormSubmit(form, url) {
    //axample form submit update for relevant data and api
    alert("Form submitted!");
    let formObject = {};
    for (let element of form.elements) {
        if (element.value) {
            formObject[element.id] = element.value;
        }
    };
    if (itemSelect.value === "n") {
        type = "POST";
    } else {
        type = "PUT";
        url = url + itemSelect.value;
        console.log(url);
    };
    console.log(type);
    makeRequest(formObject, type, url)
        .then(() => {
            console.log("it worked");
            location.reload(true);
        })
        .catch((error) => {
            console.log("It failed" + error);
        })

    return false;
}

function loadoutFormSubmit(form, url) {
    //axample form submit update for relevant data and api
    alert("Form submitted!");
    let formObject = {};
    for (let element of form.elements) {
        if (element.value) {
            formObject[element.id] = element.value;
        }
    };
    if (loadoutSelect.value === "n") {
        type = "POST";
    } else {
        type = "PUT";
        url = url + loadoutSelect.value;
        console.log(url);
    };
    console.log(type);
    makeRequest(formObject, type, url)
        .then((data) => {
            console.log("it worked 2", data);
            location.reload(true);
            data = JSON.parse(data);
            lid = data.loadoutId;
            updateItemInLoadout(form,lid);
        })
        .catch((error) => {
            console.log("It failed" + error);
        })

    return false;
}

function updateItemInLoadout(form, lid){
    for (let i of form.elements){
        if (i.value){
            type = "GET";
            url = "http://35.189.78.116:9000/armour/" + i.value;
            console.log(i.value);
            makeRequest("",type,url)
                .then((data) => {
                    data = JSON.parse(data);
                    console.log(data);
                    data.loadoutId = lid;
                    type = "PUT";
                    console.log(data.loadoutId);
                    makeRequest(data,type,url)
                        .then((data) => {
                            console.log("It worked 3",data);
                        })
                })
        }
    }

}


function populateItems() {
    type = "GET";
    url = "http://35.189.78.116:9000/armour/";
    makeRequest("", type, url)
        .then((data) => {
            //console.log("It Worked", data);
            data = (JSON.parse(data));
            for (i = 0; i < data.length; i++) {
                var option = document.createElement('option');
                option.value = data[i].id;
                option.innerText = data[i].name;
                document.getElementById("itemNumber").appendChild(option);
                var tr = document.createElement('tr');
                tr.id = "row" + i;
                document.getElementById("invTable").appendChild(tr);
                var th = document.createElement('th');
                for (j = 0; j < 5; j++) {
                    var td = document.createElement('td');
                    switch (j) {
                        case 0:
                            td.innerText = data[i].id;
                            break;
                        case 1:
                            td.innerText = data[i].name;
                            break;
                        case 2:
                            td.innerText = data[i].light;
                            break;
                        case 3:
                            td.innerText = data[i].slot;
                            break;
                        case 4:
                            td.innerText = data[i].charClass;
                            break;
                    }
                    document.getElementById("row" + i).appendChild(td);
                }
                var td = document.createElement('td');
                td.innerHTML = "<button type='button' id='"+data[i].id+"' class='btn btn-primary' onclick=deleteItem(this)>Delete</button>";
                document.getElementById("row"+i).appendChild(td);
            }
        })
        .catch((error) => {
            console.log("It Failed", error);
        });
}

function populateLoadouts(){
    type = "GET";
    url = "http://35.189.78.116:9000/loadout/";
    makeRequest("",type,url)
    .then((data) => {
        data = JSON.parse(data);
        for (let i in data){
            var tr = document.createElement('tr');
            tr.id = "row" + i;
            document.getElementById("loadoutTable").appendChild(tr);
            var th = document.createElement('th');
            console.log(data);
            var td = document.createElement('td');
            td.innerText = "Loadout " + data[i].id;
            document.getElementById("row"+i).appendChild(td);
            var light = 0;
            var backupId = data[i].id;
            delete data[i].id;
            for (var j in data[i]) {
                let col = "";
                console.log("hello")
                if (data[i].hasOwnProperty(j)){
                    var itemValue = data[i][j];
                    console.log(itemValue);
                    url = "http://35.189.78.116:9000/armour/" + itemValue;
                    anotherMakeRequest(type, url, i, light)
                    .then((data) => {
                        console.log("nuyce");
                    })
                    .catch((error) => {
                        console.log("error");
                    })
                }
            }
            let lightLevel = light/5;
            var row = document.getElementById("row"+i);
            var c6 = row.insertCell(6);
            c6.innerText = lightLevel;
            var c7 = row.insertCell(7);
            c7.innerHTML = "<button type='button' id='"+backupId+"' class='btn btn-primary' onclick=deleteLoadout(this)>Delete</button>";
            light = 0;
            

        }
    })
}

function anotherMakeRequest(type, url, i, light){
    return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(type, url);
    xhr.send();
    xhr.onload = () => {
        callback(xhr);
        if (xhr.status === 200 || xhr.status === 201 || xhr.status === 202) {
            data = JSON.parse(xhr.response);
            var row = document.getElementById("row"+i);
            switch (data.slot) {
                case "Helmet":
                    var cell = row.insertCell(1);
                    break;
                case "Arm":
                    var cell = row.insertCell(2);
                    break;
                case "Chest":
                    var cell = row.insertCell(3);
                    break;
                case "Leg":
                    var cell = row.insertCell(4);
                    break;
                case "Mark":
                    var cell = row.insertCell(5);
                    break;
            }
            cell.innerText = data.name;
            // col = data.name;
            // console.log(col);
            light = light + data.light;
            // var td = document.createElement('td');
            // td.innerText = col;
            // console.log(col);
            // document.getElementById("row"+i).appendChild(td);
            resolve();
        }
        else {
            reject(xhr.status);
            return xhr.status;
        }
    }
    })

}

function loadoutForm() {
    type = "GET";
    url = "http://35.189.78.116:9000/armour/";
    makeRequest("", type, url)
        .then((data) => {
            //console.log("It worked", data)
            data = (JSON.parse(data));
            for (let i in data) {
                var option = document.createElement('option');
                loadoutSlot = data[i].slot.toLowerCase() + "Id";
                //console.log(loadoutSlot);
                option.value = data[i].id;
                option.innerText = data[i].name + ", " + data[i].light;
                document.getElementById(loadoutSlot).appendChild(option);
            }
        })
}

function populateLoadoutDropdown(){
    type = "GET";
    url = "http://35.189.78.116:9000/loadout/"
    makeRequest("",type,url)
        .then((data) => {
            //console.log("It worked",data);
            data = (JSON.parse(data));
            for (let i in data){
                var option = document.createElement('option');
                //option.setAttribute("class", "dropdown-item");
                //option.setAttribute("onclick", "");
                //option.setAttribute("id", "l"+data[i].id);
                option.id = data[i].id;
                option.value = data[i].id;
                option.innerText = "Loadout "+data[i].id;
                document.getElementById("loadoutDropdown").appendChild(option);


            }

        })
}

function populateLoadoutTable(){
    type = "GET";
    url = "http://35.189.78.116:9000/loadout/";
    makeRequest("",type,url)
        .then((data) => {
            data = (JSON.parse(data));
            for (let i in data){
                var row = document.createElement('tr');
                row.id = 'row'+i;
                //row.value = data[i].id;
                document.getElementById("loadoutTable").appendChild(row);
            }
        })
        .catch((error) => {
            console.log("It failed",error);
        })
        //itterate build table not sure how im tired
    type = "GET";
    url = "http://35.189.78.116:9000/armour/"
    makeRequest("",type,url)
        .then((data) => {
            data = (JSON.parse(data));
            for (let i in data){
                for (let j in 100){
                    var td = createElement('tr');
                }
            }

        })
}

function deleteItem(item){
    var id = item.id;
    console.log(id);
    type = "DELETE";
    url = "http://35.189.78.116:9000/armour/"+id;
    console.log(item);
    makeRequest("",type,url)
    .then((data) => {
        console.log("nuyce", data);
    })



}

function deleteLoadout(loadout){
    var id = loadout.id;
    type = "DELETE";
    url = "http://35.189.78.116:9000/loadout/"+id;
    makeRequest("",type,url)
    .then(() => {
        console.log("nuyce");
    })
}
