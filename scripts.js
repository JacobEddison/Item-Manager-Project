const itemSelect = document.getElementById("itemNumber");
const loadoutSelect = document.getElementById("loadoutDropdown");

function makeRequest(formObject, type, url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 201) {
                resolve(xhr.response);
            }
            else {
                reject(xhr.status);
                return xhr.status;
            }
        };
        if (type === "POST") {
            xhr.open(type, url);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(formObject));
        } else if (type === "GET") {
            xhr.open(type, url);
            xhr.send();
        } else if (type === "PUT") {
            xhr.open(type, url);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(formObject));
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
        url = url + "/" + itemSelect.value;
        console.log(url);
    };
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

function populateItems() {
    type = "GET";
    url = "http://localhost:9000/armour";
    makeRequest("", type, url)
        .then((data) => {
            console.log("It Worked", data);
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
                for (j = 0; j < 6; j++) {
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
                        case 5:
                            td.innerText = data[i].loadoutId;
                            break;
                    }
                    document.getElementById("row" + i).appendChild(td);
                }
            }
        })
        .catch((error) => {
            console.log("It Failed", error);
        });
}

function loadoutForm() {
    type = "GET";
    url = "http://localhost:9000/armour";
    makeRequest("", type, url)
        .then((data) => {
            console.log("It worked", data)
            data = (JSON.parse(data));
            for (let i in data) {
                var option = document.createElement('option');
                loadoutSlot = data[i].slot + "IdForm";
                console.log(loadoutSlot);
                option.value = data[i].id;
                option.innerText = data[i].name + ", " + data[i].light;
                document.getElementById(loadoutSlot).appendChild(option);
            }
        })
}

function populateLoadout(){
    type = "GET";
    url = "http://localhost:9000/loadout"
    makeRequest("",type,url)
        .then((data) => {
            console.log("It worked",data);
            data = (JSON.parse(data));
            for (let i in data){
                var option = document.createElement('a');
                option.setAttribute("class", "dropdown-item");
                option.setAttribute("onclick", "");
                option.setAttribute("id", "l"+data[i].id);
                option.setAttribute("value", data[i].loadoutId);
                option.innerText = "Loadout "+data[i].id;
                document.getElementById("loadoutDropdown").appendChild(option);


            }

        })
}

function populateLoadoutTable(){
    type = "GET";
    url = "http://localhost:9000/loadout";
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
    url = "http://localhost:9000/armour"
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

function editItem() {
    //use button and form submit
}

function selectLoadout(num) {
    //console.log(num);
    //document.getElementById(num)
    //Build table on page for specific loadout
    //use hidden vars for class specific loadouts store all in 1 table
}

