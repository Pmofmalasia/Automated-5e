async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('MonsterCreationTable').innerHTML = userdata;
}

async function submitSetupData() {
    let submitData = Object.fromEntries(new FormData(MonsterCreation));
    let request = fetch("macro:CreateMonsterProcessing@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}
setTimeout(loadUserData, 1);