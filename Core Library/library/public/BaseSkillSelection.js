async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('SkillSelectionTable').innerHTML = userdata;
}

async function submitSetupData() {
    let submitData = Object.fromEntries(new FormData(SkillSelection));
    let request = fetch("macro:BaseSkillSelectionProcessing@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}
setTimeout(loadUserData, 1);