async function updateSpellLevel(){
    //TODO: Create function to update things like Duration AHL to adjust options when the spell level is changed
}

async function customCastTime() {
    let table = document.getElementById("spellCreationTable");
    let currentCastTime = document.getElementById("CastTime").value;
    let castTimeLineIndex = document.getElementById("rowCastTime").rowIndex;

    if(document.getElementById("Ritual").rowIndex == (castTimeLineIndex+2)){
        document.getElementById("spellCreationTable").deleteRow(castTimeLineIndex+1);
    }

    if(currentCastTime=="Custom") {
        if(document.getElementById("Ritual").rowIndex == (castTimeLineIndex+1)){
            let rowCustomCastTime = table.insertRow(castTimeLineIndex+1);

            rowCustomCastTime.id = "rowCustomCastTime";
            rowCustomCastTime.innerHTML = "<th><label for='customCastTime'>Custom Casting Time:</label></th><td><input type='number' id='customCastTimeValue' name='customCastTimeValue' min='1' style='width:25%'><select id='customCastTimeUnits' name='customCastTimeUnits'><option value='Action'>Action</option><option value='Bonus Action'>Bonus Action</option><option value='Reaction'>Reaction</option><option value='Round'>Round</option><option value='Minute'>Minute</option><option value='Hour'>Hour</option><option value='Day'>Day</option><option value='Year'>Year</option></select></td></tr>";
        }
    }
    else if(currentCastTime=="Reaction"){
        let rowReactionDescription = table.insertRow(castTimeLineIndex+1);
        rowReactionDescription.id = "rowReactionDescription";

        rowReactionDescription.innerHTML = "<th><label for='ReactionDescription'>Reaction Trigger:</label></th><td><input type='text' id='ReactionDescription' name='ReactionDescription' style='width:100%' value='which you take when'></td></tr>";
    }
}

async function customDuration() {
    let currentDuration = document.getElementById("Duration").value;
    let durationLineIndex = document.getElementById("rowDuration").rowIndex;

    if(currentDuration=="Custom") {
        if(document.getElementById("rowDurationAHL").rowIndex == (durationLineIndex+1)){
            let table = document.getElementById("spellCreationTable");
            let customDurationRow = table.insertRow(durationLineIndex+1);

            customDurationRow.innerHTML = "<th><label for='customDuration'>Custom Duration:</label></th><td><input type='number' id='customDurationValue' name='customDurationValue' min='1' style='width:25%'><select id='customDurationUnits' name='customDurationUnits'><option value='Turn'>Turn</option><option value='Round'>Round</option><option value='Minute'>Minute</option><option value='Hour'>Hour</option><option value='Day'>Day</option><option value='Year'>Year</option></select></td></tr></td>";
        }
    }
    else {
        if(document.getElementById("rowDurationAHL").rowIndex == (durationLineIndex+2)){
            document.getElementById("spellCreationTable").deleteRow(durationLineIndex+1);
        }
    }
}

async function concLost() {
    let concLostLineIndex = document.getElementById("rowConcLost").rowIndex;

    if(document.getElementById("ConcentrationLost").checked){
        let table = document.getElementById("spellCreationTable");
        let customDurationRow = table.insertRow(concLostLineIndex+1);

        let selectedSpellLevel = document.getElementById("Level").value;
        var concLostLevelOptions = "";
        for(let i=selectedSpellLevel; i<10; i++){
            concLostLevelOptions = concLostLevelOptions+"<option value='"+i+"'>"+i+"</option>";
        }

        customDurationRow.innerHTML = "<th><label for='ConcentrationLostLevel'>Level No Longer Required:</label></th><td><select id='ConcentrationLostLevel' name=ConcentrationLostLevel'>"+concLostLevelOptions+"</selected></td>";
    }
    else{
        document.getElementById("spellCreationTable").deleteRow(concLostLineIndex+1);
    }
}

async function ahlDuration() {
    let isDurationAHLLineIndex = document.getElementById("rowDurationAHL").rowIndex;
    let selectedSpellLevel = document.getElementById("Level").value;
    let maxSpellLevel = 0;

    if(selectedSpellLevel == 0){
        maxSpellLevel = 3;
    }
    else{
        maxSpellLevel = 9;
    }

    if(document.getElementById("AHLDuration").checked){
        let table = document.getElementById("spellCreationTable");

        for(let i=maxSpellLevel; i>selectedSpellLevel; i--){
            var thisAHLDurationRow = table.insertRow(isDurationAHLLineIndex+1);
            thisAHLDurationRow.innerHTML = "<th><label for='AHLDurationLevel"+i+"'>Duration at Level "+i+":</label></th><td><select id='AHLDurationLevel"+i+"' name=AHLDurationLevel"+i+"'></selected></td>";
            let DurationOptions = document.getElementById("spellDuration").innerHTML;
            let thisAHLDurationSelect = document.getElementById("AHLDurationLevel"+i);
            thisAHLDurationSelect.innerHTML = DurationOptions;
        }
    }
    else{
        for(let i=selectedSpellLevel; i<maxSpellLevel; i++){
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
    let request = fetch("macro:CreateSpellCoreProcessing@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}
setTimeout(loadUserData, 1);