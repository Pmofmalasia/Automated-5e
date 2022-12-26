async function toggleReachRanged(){
    let table = document.getElementById("MonsterWeaponCreationTable");
    let currentSelection = document.getElementById("WeaponMeleeRanged").value;
    let nextRowIndex = document.getElementById("rowWeaponMeleeRanged").rowIndex + 1;

    if(document.getElementById("rowWeaponReach")==null){
        if(currentSelection!="Ranged"){
            let rowWeaponReach = table.insertRow(nextRowIndex);
            rowWeaponReach.id = "rowWeaponReach";
            rowWeaponReach.innerHTML = "<th><label for='WeaponReach'>Reach:</label></th><td><input type='number' id='WeaponReach' name='WeaponReach' min='0' value='5' style='width:25px'></td>";
            nextRowIndex++;
        }
    }
    else if(currentSelection=="Ranged"){
        table.deleteRow(document.getElementById("rowWeaponReach").rowIndex);
    }
    else{
        nextRowIndex++;
    }

    if(document.getElementById("rowWeaponRange")==null){
        if(currentSelection!="Melee"){
            let rowWeaponRange = table.insertRow(nextRowIndex);
            rowWeaponRange.id = "rowWeaponRange";
            rowWeaponRange.innerHTML = "<th><label for='WeaponRange'>Range:</label></th><td><input type='number' id='WeaponRange' name='WeaponRange' min='0' value='5' style='width:30px'> / <input type='number' id='WeaponLongRange' name='WeaponLongRange' min='0' value='5' style='width:30px'></td>";
            nextRowIndex++;
        }
    }
    else if(currentSelection=="Melee"){
        table.deleteRow(document.getElementById("rowWeaponRange").rowIndex);
    }
    else{
        nextRowIndex++;
    }
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('MonsterWeaponCreationTable').innerHTML = userdata;
}

async function submitSetupData() {
    let submitData = Object.fromEntries(new FormData(MonsterWeaponCreation));
    let request = fetch("macro:MonsterWeaponCreationProcessing@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}
setTimeout(loadUserData, 1);