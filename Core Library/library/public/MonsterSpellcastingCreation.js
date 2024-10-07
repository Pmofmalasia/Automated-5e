async function createInnateInfo(){
	let referenceElement = document.getElementById("rowisInnateSpellcasting");

    if(document.getElementById("isInnateSpellcasting").checked){
        let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
        let attributeList = await request.json();

        let StatOptions = "";
        for(let tempAttribute of attributeList){
            let abilityScoreName = tempAttribute.Name;
            let abilityScoreDisplayName = tempAttribute.DisplayName;
            StatOptions = StatOptions + "<option value='"+abilityScoreName+"'>"+abilityScoreDisplayName+"</option>";
        }

		referenceElement = createTableRow(referenceElement,"rowInnateStat","<th><label for='InnateStat'>Innate Spellcasting Stat:</label></th><td><select id='InnateStat' name='InnateStat'>"+StatOptions+"</select></td>");

		referenceElement = createTableRow(referenceElement,"rowInnateSpellTitle","<th colspan='2' style='text-align:center'>Choose Innate Spells</th>");

        let response = await fetch("macro:pm.a5e.GetBaseSpellData@lib:pm.a5e.Core", {method: "POST", body: ""});
        let SpellList = await response.json();
    
        let SpellOptions = "";
        for(let tempSpell of SpellList){
            let SpellName = tempSpell.Name;
            let SpellDisplayName = tempSpell.DisplayName;
            SpellOptions = SpellOptions + "<option value='"+SpellName+"'>"+SpellDisplayName+"</option>";
        }

		let innateInputListeners = [
			{
				elementID:"InnateSpell",
				listener:"change",
				functionName:"setDefaultInnateLevel",
				functionArgs:[]
			},
			{
				elementID:"InnateSpellRestoration",
				listener:"change",
				functionName:"toggleAtWill",
				functionArgs:[]
			}
		]
		createMultiRowButtonsInput("InnateSpell",referenceElement,"<th colspan='2' style='text-align:center'>Level <input type='number' id='InnateSpellLevel' name='InnateSpellLevel' style='width:25px'><select id='InnateSpell' name='InnateSpell'>"+SpellOptions+"</select>: <span id='InnateSpellResourceSpan'><input type='number' id='InnateSpellResource' name='InnateSpellResource' min=1 value=1 class='small-number'> time(s) per </span><select id='InnateSpellRestoration' name='InnateSpellRestoration'><option value='Long'>Long Rest</option><option value='Short'>Short Rest</option><option value='AtWill'>At Will</option></select></th>","Spell",innateInputListeners);

		document.getElementById("InnateSpell0").dispatchEvent(new Event("change"));
		document.getElementById("AddInnateSpellButton").addEventListener("click",function(){
			setDefaultInnateLevel(Number(document.getElementById("InnateSpellNumber").value) - 1);
		});
    }
    else{
        clearUnusedTable("rowIsInnateSpellcasting","rowisSlotSpellcasting");
    } 
}

async function setDefaultInnateLevel(whichSpell){
    let response = await fetch("macro:pm.a5e.GetBaseSpellData@lib:pm.a5e.Core", {method: "POST", body: ""});
    let SpellList = await response.json();

    let SelectedSpellName = document.getElementById("InnateSpell"+whichSpell).value;
    let SpellLevel = 1;
    for(let tempSpell of SpellList){
        if(SelectedSpellName == tempSpell.Name){
            SpellLevel = tempSpell.Level;
        }
    }
    
    document.getElementById("InnateSpellLevel"+whichSpell).value = SpellLevel;
}

function toggleAtWill(whichSpell){
	let restorationChoice = document.getElementById("InnateSpellRestoration"+whichSpell).value;
	let resourceSpan = document.getElementById("InnateSpellResourceSpan"+whichSpell);

	if(restorationChoice === "AtWill"){
		resourceSpan.innerHTML = "";
	}
	else if(resourceSpan.innerHTML === ""){
		resourceSpan.innerHTML = "<input type='number' id='InnateSpellResource' name='InnateSpellResource' min=1 value=1 class='small-number'> time(s) per ";
	}
}

async function createSlotInfo() {
    let table = document.getElementById("MonsterSpellcastingCreationTable");
    let nextRowIndex = document.getElementById("rowisSlotSpellcasting").rowIndex + 1;

    if(document.getElementById("isSlotSpellcasting").checked){
        let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
        let attributeList = await request.json();

        let StatOptions = "";
        for(let tempAttribute of attributeList){
            let abilityScoreName = tempAttribute.Name;
            let abilityScoreDisplayName = tempAttribute.DisplayName;
            StatOptions = StatOptions + "<option value='"+abilityScoreName+"'>"+abilityScoreDisplayName+"</option>";
        }

        let rowSlotLevel = table.insertRow(nextRowIndex);
        rowSlotLevel.id = "rowSlotLevel";
        rowSlotLevel.innerHTML = "<th><label for='SlotLevel'>Slot Spellcasting Level:</label></th><td><input type='number' id='SlotLevel' name='SlotLevel' min=0 value=1 style='width:25px'><select id='CasterType' name='CasterType'><option value=1>Full Caster</option><option value=2>Half Caster</option><option value=3>Third Caster</option></select></td>";
        nextRowIndex++;

        let rowSlotStat = table.insertRow(nextRowIndex);
        rowSlotStat.id = "rowSlotStat";
        rowSlotStat.innerHTML = "<th><label for='SlotStat'>Slot Spellcasting Stat:</label></th><td><select id='SlotStat' name='SlotStat'>"+StatOptions+"</select></td>";
        nextRowIndex++;

        let giveMeData = await fetch("macro:pm.GetClasses@lib:pm.a5e.Core", {method: "POST", body: ""});
        let castingClassList = await giveMeData.json();

        let ClassOptions = "<option value=''>None</option>";
        for(let tempClass of castingClassList){
            let tempClassName = tempClass.Name;
            let tempClassDisplayName = tempClass.DisplayName;
            ClassOptions = ClassOptions + "<option value='"+tempClassName+"'>"+tempClassDisplayName+"</option>";
        }
        
        let rowSlotClass = table.insertRow(nextRowIndex);
        rowSlotClass.id = "rowSlotClass";
        rowSlotClass.innerHTML = "<th><label for='SlotClass'>Spell Class:</label></th><td><select id='SlotClass' name='SlotClass'>"+ClassOptions+"</select></td>";
        nextRowIndex++;

        let rowSlotSpellTitle = table.insertRow(nextRowIndex);
        rowSlotSpellTitle.id = "rowSlotSpellTitle";
        rowSlotSpellTitle.innerHTML = "<th colspan='2' text-align='center'>Choose Slot Spells</th><input type='hidden' id='SlotSpellNumber' name='SlotSpellNumber' value=9>";
        nextRowIndex++;

        let response = await fetch("macro:pm.a5e.GetBaseSpellData@lib:pm.a5e.Core", {method: "POST", body: ""});
        let SpellList = await response.json();
    
        let SpellOptions = "";
        for(let tempSpell of SpellList){
            let SpellName = tempSpell.Name;
            let SpellDisplayName = tempSpell.DisplayName;
            SpellOptions = SpellOptions + "<option value='"+SpellName+"'>"+SpellDisplayName+"</option>";
        }

        for(let i=0; i<10; i++){
            let newSlotSpellRow = table.insertRow(nextRowIndex);
            newSlotSpellRow.id = "rowSlotSpell"+i;
            newSlotSpellRow.innerHTML = "<th><label for='SlotSpell"+i+"'>Spell #"+(i+1)+":</label></th><td><select id='SlotSpell"+i+"' name='SlotSpell"+i+"'>"+SpellOptions+"</select></td>";
            nextRowIndex++;
        }
            
        let rowSlotAdditionButtons = table.insertRow(nextRowIndex);
        rowSlotAdditionButtons.id = "rowSlotAdditionButtons";
        rowSlotAdditionButtons.innerHTML = "<th text-align='center' colspan='2'><input type='button' id='addSlotSpell' name='addSlotSpell' value='Add' onclick='addSlotSpellRow()'>  <input type='button' id='removeSlotSpell' name='removeSlotSpell' value='Remove' onclick='removeSlotSpellRow()'></th>";
        nextRowIndex++;
    }
    else{
        clearUnusedTable("rowisSlotSpellcasting","rowSubmit");
    } 
}

async function addSlotSpellRow(){
    let table = document.getElementById("MonsterSpellcastingCreationTable");
    let nextRowIndex = document.getElementById("rowSlotSpellTitle").rowIndex + 1;
    let nextSlotNumber = 0;
    while(nextRowIndex != document.getElementById("rowSlotAdditionButtons").rowIndex){
        nextRowIndex++;
        nextSlotNumber++;
    }
    
    let response = await fetch("macro:pm.a5e.GetBaseSpellData@lib:pm.a5e.Core", {method: "POST", body: ""});
    let SpellList = await response.json();

    let SpellOptions = "";
    for(let tempSpell of SpellList){
        let SpellName = tempSpell.Name;
        let SpellDisplayName = tempSpell.DisplayName;
        SpellOptions = SpellOptions + "<option value='"+SpellName+"'>"+SpellDisplayName+"</option>";
    }

    let rowNewSlotSpell = table.insertRow(nextRowIndex);
    rowNewSlotSpell.id = "rowSlotSpell"+nextSlotNumber;
    rowNewSlotSpell.innerHTML = "<th><label for='SlotSpell"+nextSlotNumber+"'>Spell #"+(nextSlotNumber+1)+":</label></th><td><select id='SlotSpell"+nextSlotNumber+"' name='SlotSpell"+nextSlotNumber+"'>"+SpellOptions+"</select></td>";
    nextRowIndex++;

    document.getElementById("SlotSpellNumber").value = nextSlotNumber;
}

async function removeSlotSpellRow(){
    let table = document.getElementById("MonsterSpellcastingCreationTable");
    let currentSlotNumber = document.getElementById("SlotSpellNumber").value;
    table.deleteRow(document.getElementById("rowSlotSpell"+currentSlotNumber).rowIndex);
    document.getElementById("SlotSpellNumber").value = currentSlotNumber - 1;
}

async function clearUnusedTable(startRowID,endRowID){
    let table = document.getElementById("MonsterSpellcastingCreationTable");
    let startRowIndex = document.getElementById(startRowID).rowIndex;
    let endRowIndex = document.getElementById(endRowID).rowIndex;
    
    while(startRowIndex+1 != endRowIndex){
        table.deleteRow(startRowIndex+1);
        endRowIndex = endRowIndex - 1;
    }
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('MonsterSpellcastingCreationTable').innerHTML = userdata;
}

async function submitSetupData() {
    let submitData = Object.fromEntries(new FormData(MonsterSpellcastingCreation));
    let request = fetch("macro:MonsterSpellcastingCreationProcessing@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}
setTimeout(loadUserData, 1);