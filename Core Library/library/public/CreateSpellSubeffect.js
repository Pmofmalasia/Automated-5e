async function createAttackTable(){
    if(document.getElementById("isAttack").checked){

    }
    else{
        
    }
}

async function createSaveTable(){
    if(document.getElementById("isSave").checked){

    }
    else{
        
    }
}

async function createDamageTable(){
    if(document.getElementById("isDamage").checked){

    }
    else{
        
    }
}

async function createTargetingTable(){
    
}

async function createTargetTable(){
    
}

async function createAoETable(){
    
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('spellCreation').innerHTML = userdata;
}

async function submitSpellData() {
    let submitData = Object.fromEntries(new FormData(spellCreation));
    let request = fetch("macro:CreateSpellSubeffectProcessing@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}
setTimeout(loadUserData, 1);