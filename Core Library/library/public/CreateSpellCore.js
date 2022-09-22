async function customCastTime() {
    let currentCastTime = document.getElementById("castTime").value;
    let castTimeLineIndex = document.getElementById("CastTime").rowIndex;

    if(currentCastTime=="Custom") {
        if(document.getElementById("Ritual").rowIndex == (castTimeLineIndex+1)){
            let table = document.getElementById("spellCreationTable");
            let customCastTimeRow = table.insertRow(castTimeLineIndex+1);

            customCastTimeRow.innerHTML = "<th><label for='customCastTime'>Custom Casting Time:</label></th><td><input type='number' id='customCastTimeValue' name='customCastTimeValue' min='1'><select id='customCastTimeUnits' name='customCastTimeUnits'><option value='Action'>Action</option><option value='Bonus Action'>Bonus Action</option><option value='Reaction'>Reaction</option><option value='Round'>Round</option><option value='Minute'>Minute</option><option value='Hour'>Hour</option><option value='Day'>Day</option><option value='Year'>Year</option></select></td></tr></td>";
        }
    }
    else {
        if(document.getElementById("Ritual").rowIndex == (castTimeLineIndex+2)){
            document.getElementById("spellCreationTable").deleteRow(castTimeLineIndex+1);
        }
    }
}

async function customDuration() {
    let currentDuration = document.getElementById("spellDuration").value;
    let durationLineIndex = document.getElementById("Duration").rowIndex;

    if(currentDuration=="Custom") {
        if(document.getElementById("DurationAHL").rowIndex == (durationLineIndex+1)){
            let table = document.getElementById("spellCreationTable");
            let customDurationRow = table.insertRow(durationLineIndex+1);

            customDurationRow.innerHTML = "<th><label for='customDuration'>Custom Duration:</label></th><td><input type='number' id='customDurationValue' name='customDurationValue' min='1'><select id='customDurationUnits' name='customDurationUnits'><option value='Turn'>Turn</option><option value='Round'>Round</option><option value='Minute'>Minute</option><option value='Hour'>Hour</option><option value='Day'>Day</option><option value='Year'>Year</option></select></td></tr></td>";
        }
    }
    else {
        if(document.getElementById("DurationAHL").rowIndex == (durationLineIndex+2)){
            document.getElementById("spellCreationTable").deleteRow(durationLineIndex+1);
        }
    }
}

async function concLost() {
    let concLostLineIndex = document.getElementById("concLost").rowIndex;

    if(document.getElementById("concentrationLost").checked){
        let table = document.getElementById("spellCreationTable");
        let customDurationRow = table.insertRow(concLostLineIndex+1);

        let selectedSpellLevel = document.getElementById("spellLevel").value;
        var concLostLevelOptions = "";
        for(let i=selectedSpellLevel; i<10; i++){
            concLostLevelOptions = concLostLevelOptions+"<option value='"+i+"'>"+i+"</option>";
        }

        customDurationRow.innerHTML = "<th><label for='concLostLevel'>Level No Longer Required:</label></th><td><select id='concLostLevel' name=concLostLevel' style='width:97%'>"+concLostLevelOptions+"</selected></td>";
    }
    else{
        document.getElementById("spellCreationTable").deleteRow(concLostLineIndex+1);
    }
}

async function ahlDuration() {
    let isDurationAHLLineIndex = document.getElementById("DurationAHL").rowIndex;
    let selectedSpellLevel = document.getElementById("spellLevel").value;

    if(document.getElementById("AHLDuration").checked){
        let table = document.getElementById("spellCreationTable");

        for(let i=9; i>selectedSpellLevel; i--){
            var thisAHLDurationRow = table.insertRow(isDurationAHLLineIndex+1);
            thisAHLDurationRow.innerHTML = "<th><label for='ahlDurationLevel"+i+"'>Duration at Level "+i+":</label></th><td><select id='ahlDurationLevel"+i+"' name=ahlDurationLevel"+i+"'></selected></td>";
            let DurationOptions = document.getElementById("spellDuration");
            let thisAHLDurationSelect = document.getElementById("ahlDurationLevel"+i);
            thisAHLDurationSelect.innerHTML = DurationOptions;
            console.log(DurationOptions);
        }
    }
    else{
        for(let i=selectedSpellLevel; i<9; i++){
            document.getElementById("spellCreationTable").deleteRow(isDurationAHLLineIndex+1);
        }
    }
}

async function mCompInput() {
    let mCompLineIndex = document.getElementById("MaterialComponents").rowIndex;
    
    if(document.getElementById("mComp").checked){
        let table = document.getElementById("spellCreationTable");

        let mCompList = table.insertRow(mCompLineIndex+1);
        mCompList.innerHTML = "<th><label for='mComponents'>Material Components:</label></th><td><input type='text' id='mComponents' name=mComponents'></td>";

        let mCompConsumedList = table.insertRow(mCompLineIndex+2);
        mCompConsumedList.innerHTML = "<th><label for='mComponentsConsumed'>Consumed Material Components:</label></th><td><input type='text' id='mComponentsConsumed' name=mComponentsConsumed'></td>";
    }
    else{
        document.getElementById("spellCreationTable").deleteRow(mCompLineIndex+1);
        document.getElementById("spellCreationTable").deleteRow(mCompLineIndex+1);
    }
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('spellCreationTable').innerHTML = userdata;
}

async function submitSpellData() {
    let submitData = Object.fromEntries(new FormData(spellCreation));
    let request = fetch("macro:CreateSpellSubeffect@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}
setTimeout(loadUserData, 1);