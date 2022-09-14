async function doEffect(ename) {
    let request = await fetch("macro:ManageEffectChoice@pm.a5e.Core", {method: "POST", data: "ename"});
    let result = await request.json();
}

async function loadUserData() {
    let userdata = await MapTool.getUserData();
    document.getElementById('effectTable').innerHTML = userdata;
}
setTimeout(loadUserData, 1);