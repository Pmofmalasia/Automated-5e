console.log("hello from js");
async function doEffect(ename) {
    console.log("doing effect");
    let request = await fetch("macro:ManageEffectChoice@pm.a5e.core", {method: "POST", data: "ename"});
    let result = await request.json();
}

async function loadUserData() {
    let userdata = await MapTool.getUserData();
    document.getElementById('effectTable').innerHTML = userdata;
}
setTimeout(loadUserData, 1);