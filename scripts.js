// function createInv(){
//     for (let element in inventory){

//     }
// }

function handleFormSubmit(form){
    alert("Form submitted!");
    console.log(form);
    let formObject = {};
    for (let element of form.elements){
        if (element.value){
        formObject[element.id]=element.value;
    }};
    type="POST";
    url="https://us-central1-qac-sandbox-c347f.cloudfunctions.net/setUser";
    console.log(JSON.stringify(formObject));
    makeRequest(formObject,type,url)
        .then(()=>{
            console.log("it worked");
            location.href="login.html";
        })
        .catch((error)=>{
            console.log("It failed"+error);
        })
    return false;
}

function handleLoadout(){
    
}

function makeRequest(formObject,type,url){
    return new Promise((resolve,reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.status ==200) {
                resolve(xhr.response);}
            else {reject(xhr.status);    
                return xhr.status;}
        };
        if (type=="POST"){
            xhr.open(type,url);
            xhr.setRequestHeader("Content-Type","application/json");
            xhr.send(JSON.stringify(formObject));
        } else if (type=="GET"){
            xhr.open(type,url);
            xhr.send();
        }
        //console.log(JSON.stringify(formObject));
    });
}