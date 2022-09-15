async function doEffect(ename) {
    let request = fetch("macro:ManageEffectChoice@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(ename)});
    let result = await request.json();
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('effectTable').innerHTML = userdata;
}
setTimeout(loadUserData, 1);