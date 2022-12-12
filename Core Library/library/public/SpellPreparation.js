async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('SpellPreparationTable').innerHTML = userdata;
}

async function submitSpellData() {
    let submitData = Object.fromEntries(new FormData(SpellPreparation));
    let request = fetch("macro:SpellPreparationProcessing@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}
setTimeout(loadUserData, 1);