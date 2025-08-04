function newButtonValidPassiveInstances(i){
	let validInstances = checkCompatibleInstances(i);
	let currentInstances = document.getElementById("rowPassiveInstancesHeader").currentInstances;
	validInstances = validInstances.filter(inst => (currentInstances.indexOf(inst) === -1));

	setPassiveInstanceOptions(i,validInstances);

	currentInstances[i] = document.getElementById("PassiveInstance"+i).value;
	document.getElementById("rowPassiveInstancesHeader").currentInstances = currentInstances;

	updateValidPassiveInstances(i);
}

function updateValidPassiveInstances(whichNum){
	let instanceNumber = Number(document.getElementById("PassiveInstanceNumber").value);
	document.getElementById("rowPassiveInstancesHeader").currentInstances[whichNum] = document.getElementById("PassiveInstance"+whichNum).value;
	let currentInstances = document.getElementById("rowPassiveInstancesHeader").currentInstances;
	let validInstances = checkCompatibleInstances(0);
	for(let i = 0; i < instanceNumber; i++){
		let thisSelection = document.getElementById("PassiveInstance"+i).value;
		let thisValidInstances = validInstances.filter(inst => (inst === thisSelection || currentInstances.indexOf(inst) === -1));
		setPassiveInstanceOptions(i,thisValidInstances);
	}

	validInstances = validInstances.filter(inst => (currentInstances.indexOf(inst) === -1));
	toggleInstanceButtonEnabled(validInstances);
}

function checkCompatibleInstances(i){
	let validInstances = [];
	let instanceNumber = Number(document.getElementById("PassiveInstanceNumber").value);
	if(instanceNumber > 1){
		let isFirstComparison = true;
		for (let j = 0; j < instanceNumber; j++) {
			if(i===j) continue;

			let thisInstanceName = document.getElementById("PassiveInstance"+j).value;
			let compatibleInstances = allInstances[thisInstanceName].validPairs;
			if(isFirstComparison){
				validInstances = compatibleInstances;
				isFirstComparison = false;
			}
			else{
				validInstances = jsonIntersection(validInstances,compatibleInstances);
			}
		}
	}
	else{
		let allInstanceNames = Object.keys(allInstances);
		validInstances = allInstanceNames;
	}

	return validInstances;
}

function setPassiveInstanceOptions(i,validInstances){
	let instanceSelect = "";
	validInstances.forEach(instance => {
		instanceSelect += "<option value='"+instance+"'>"+allInstances[instance].displayName+"</option>";
	});

	let currentSelection = document.getElementById("PassiveInstance"+i).value;
	document.getElementById("PassiveInstance"+i).innerHTML = instanceSelect;
	if(currentSelection != ""){
		document.getElementById("PassiveInstance"+i).value = currentSelection;
	}
	else{
		document.getElementById("PassiveInstance"+i).selectedIndex = 0;
	}
}

function toggleInstanceButtonEnabled(validInstances){
	let currentInstances = document.getElementById("rowPassiveInstancesHeader").currentInstances;
	if(currentInstances.length === 1){
		let loneInstance = currentInstances[0];
		if(allInstances[loneInstance].validPairs.length === 1){
			document.getElementById("AddPassiveInstanceButton").setAttribute("disabled","");
		}
		else{
			document.getElementById("AddPassiveInstanceButton").removeAttribute("disabled");
		}
	}
	else{
		if(validInstances.length === 0){
			document.getElementById("AddPassiveInstanceButton").setAttribute("disabled","");
		}
		else{
			document.getElementById("AddPassiveInstanceButton").removeAttribute("disabled");
		}
	}

	let instanceNumber = Number(document.getElementById("PassiveInstanceNumber").value);
	if(instanceNumber <= 1){
		document.getElementById("RemovePassiveInstanceButton").setAttribute("disabled","");
	}
	else{
		document.getElementById("RemovePassiveInstanceButton").removeAttribute("disabled");
	}
}

function updatePassiveConditionSelects(){
	//function to update all passive conditions when instance changes, check all current selections to see if still valid and if not change the selection
}

function createPassiveConditionSelect(){
	//function to initialize the valid selections for conditions based on instances chosen
}

function updatePassiveEffectSelects(){
	//function to update all passive effects when instance changes, check all current selections to see if still valid and if not change the selection
}

function createPassiveEffectSelect(){
	//function to initialize the valid selections for effects based on instances chosen
}

function getPassiveData(){
	allInstances = {
		AC:{
			displayName:"Affects Armor Class",
			validPairs:["AC"],
			validEffects:["Bonus","Set"]
		},
		MaxHP:{
			displayName:"Affects Maximum HP",
			validPairs:["MaxHP"],
			validEffects:["Bonus","Set"]
		},
		DamageMod:{
			displayName:"Affects Damage Modifiers",
			validPairs:["DamageMod"],
			validEffects:["DamageMod"]
		},
		CondImmun:{
			displayName:"Affects Condition Immunities",
			validPairs:["CondImmun"],
			validEffects:["CondImmun"]
		},
		CondGain:{
			displayName:"Effect Occurs When Gaining a Condition",
			validPairs:["CondGain"],
			validEffects:["CondGain","Effect"]
		}, 
		CondEnd:{
			displayName:"Effect Occurs When Ending a Condition",
			validPairs:["CondEnd"],
			validEffects:["CondEnd","Effect"]
		}, 
		Speed:{
			displayName:"Affects Movement Speed",
			validPairs:["Speed"],
			validEffects:["Bonus","Set","Prevent","Terrain"]
		},
		Size:{
			displayName:"Affects Size",
			validPairs:["Size"],
			validEffects:["SetSize","ModifySize"]
		},
		Languages:{
			displayName:"Affects Languages Known/Understood",
			validPairs:["Languages"],
			validEffects:["Languages"]
		},
		Lights:{
			displayName:"Affects or Generates Light",
			validPairs:["Lights"],
			validEffects:["Lights"]
		},
		Vision:{
			displayName:"Affects Vision",
			validPairs:[],
			validEffects:["Vision"]
		},
		Proficiency:{
			displayName:"Affects Proficiency",
			validPairs:["Proficiency"],
			validEffects:["Proficiency"]
		},
		Passives:{
			displayName:"Affects Passive Skills",
			validPairs:["Passives"],
			validEffects:["Passives"]
		},
		d20Test:{
			displayName:"Affects All d20 Tests",
			validPairs:["d20Test","Check","Save","Attack","WeaponAttack","SpellAttack"],
			validEffects:["Advantage","Bonus","Proficiency","Result","Effect","EffectResolve"]
		},
		Check:{
			displayName:"Affects Checks",
			validPairs:["d20Test","Check","Save","Attack","WeaponAttack","SpellAttack"],
			validEffects:["Advantage","Bonus","Proficiency","Result","Effect","EffectResolve"]
		},
		Save:{
			displayName:"Affects Making Saves",
			validPairs:["d20Test","Check","Save","Attack","WeaponAttack","SpellAttack"],
			validEffects:["Advantage","Bonus","Proficiency","Result","Effect","EffectResolve"]
		},
		Attack:{
			displayName:"Affects All Attacks",
			validPairs:["d20Test","Check","Save","Attack","WeaponAttack","SpellAttack"],
			validEffects:["Advantage","Bonus","Proficiency","Result","Effect","EffectResolve"]
		},
		WeaponAttack:{
			displayName:"Affects Weapon Attacks",
			validPairs:["d20Test","Check","Save","Attack","WeaponAttack","SpellAttack"],
			validEffects:["Advantage","Bonus","Proficiency","Result","Effect","EffectResolve"]
		},
		SpellAttack:{
			displayName:"Affects Spell Attacks",
			validPairs:["d20Test","Check","Save","Attack","WeaponAttack","SpellAttack"],
			validEffects:["Advantage","Bonus","Proficiency","Result","Effect","EffectResolve"]	
		},
		Spellcasting:{
			displayName:"Affects Spellcasting",
			validPairs:["Spellcasting"],
			validEffects:["Advantage","Bonus","Proficiency","Result","Effect","SpellProperties","ValidFoci"]
		},
		Features:{
			displayName:"Affects Features",
			validPairs:["Features"],
			validEffects:["Advantage","Bonus","Proficiency","Result","Effect","ChangePrereqs","FeatureChoiceNum","NewActiveEffect"]
		},
		ChangePrereqs:{
			displayName:"Affects Prerequisites of Other Features",
			validPairs:["ChangePrereqs"],
			validEffects:["ChangePrereqs"]
		},
		Targeting:{
			displayName:"Affects Targeting",
			validPairs:["Targeting"],
			validEffects:[]
		},
		ForcedSave:{
			displayName:"Affects Forcing Saves",
			validPairs:["ForcedSave","EffectResolve"],
			validEffects:[]
		}, 
		Damage:{
			displayName:"Affects Rolling Damage",
			validPairs:["Damage"],
			validEffects:[]
		},
		Damaged:{
			displayName:"Effect Occurs When Damaged",
			validPairs:["Damaged"],
			validEffects:["Effect"]
		},
		DamageDealt:{
			displayName:"Effect Occurs When Dealing Damage",
			validPairs:["DamageDealt"],
			validEffects:["Effect"]
		},
		StartTurn:{
			displayName:"Effect Occurs on Start of Turn",
			validPairs:["StartTurn","EndTurn"],
			validEffects:["Effect","TurnChange"]		
		},
		EndTurn:{
			displayName:"Effect Occurs on End of Turn",
			validPairs:["StartTurn","EndTurn"],
			validEffects:["Effect","TurnChange"]		
		},
		Rest:{
			displayName:"Affects Resting",
			validPairs:["Rest"],
			validEffects:["Effect","Rest"]		
		},
		SpendHitDice:{
			displayName:"Affects Spending Hit Dice",
			validPairs:["SpendHitDice"],
			validEffects:["Effect","SpendHitDice"]		
		},
		ActionEconomy:{
			displayName:"Affects Use of Actions",
			validPairs:["ActionEconomy"],
			validEffects:["ActionEconomy","UseTime","InteractTime","DrawTime"]
		},
		CarryCapacity:{
			displayName:"Affects Carrying Capacity",
			validPairs:["CarryCapacity"],
			validEffects:["Bonus","Set"]	
		},
		Limbs:{
			displayName:"Affects Limbs/Reach",
			validPairs:["Limbs"],
			validEffects:["Bonus","Set"]
		},
		Senses:{
			displayName:"Affects Other Senses",
			validPairs:["Senses"],
			validEffects:["Senses"]
		},
		BaseNeeds:{
			displayName:"Affects Base Needs",
			validPairs:["BaseNeeds"],
			validEffects:["BaseNeeds"]
		},
		Aging:{
			displayName:"Affects Aging",
			validPairs:["Aging"],
			validEffects:["Aging"]
		}
	}

	allConditions = {
		PrimeStat:{
			displayName:"Uses Certain Stat",
			validInstances:["Proficiency","Passives","d20Test","Check","Save","Attack","WeaponAttack","SpellAttack","Spellcasting","ForcedSave","Features","Damage"]
		},
		AdvantageBalance:{
			displayName:"Has Advantage/Disadvantage",
			validInstances:["d20Test","Check","Save","Attack","WeaponAttack","SpellAttack","Spellcasting","ForcedSave","Features","Damage"]
		},
		HasProficiency:{
			displayName:"Has Proficiency",
			validInstances:["d20Test","Check","Save","Attack","WeaponAttack","SpellAttack","Spellcasting","ForcedSave","Features","Damage"]
		},
		DieRolled:{
			displayName:"Based on Number Rolled",
			validInstances:["d20Test","Check","Save","Attack","WeaponAttack","SpellAttack","Spellcasting","ForcedSave","Features","Damage"]
		},
		CheckType:{
			displayName:"Type of Skill",
			validInstances:["Proficiency","Passives","d20Test","Check"]
		},
		FeatureInvolved:{
			displayName:"Specific Feature was Used",
			validInstances:["d20Test","Check","Save","Attack","WeaponAttack","SpellAttack","Spellcasting","ForcedSave","Features","Damage"]
		}
	};

	allEffectTypes = {};
}

async function loadUserData(){
	let userdata = atob(await MapTool.getUserData());
	FeatureData = JSON.parse(userdata);
	ParentToken = FeatureData.ParentToken;
	delete FeatureData.ParentToken;

	getPassiveData();

	titleLine = document.createElement("tr");
	titleLine.innerHTML = "<th colspan=2 style='text-align:center'>Passive Effects</th>";
	document.getElementById("CreatePassiveFeatureTable").insertAdjacentElement("afterbegin",titleLine);

	let referenceElement = createTableRow(titleLine,"rowPassiveInstancesHeader","<th colspan = 2 style='text-align:center'>Instances When Effect Activates</th>");
	referenceElement.currentInstances = [];

	let PassiveInstanceListeners = [{
		functionName:"updateValidPassiveInstances",
		elementID:"PassiveInstance",
		listener:"change"
	}]
	referenceElement = createMultiRowButtonsInput("PassiveInstance",referenceElement,"<th colspan=2 style='text-align:center'><select id='PassiveInstance' name='PassiveInstance'></select></th>","Instance",PassiveInstanceListeners,{SuppressAutoAdd:true});
	document.getElementById("AddPassiveInstanceButton").addEventListener("click",function(){
		let currentInstanceNumber = Number(document.getElementById("PassiveInstanceNumber").value);
		newButtonValidPassiveInstances(currentInstanceNumber - 1);
	});
	document.getElementById("AddPassiveInstanceButton").dispatchEvent(new Event("click"));

	document.getElementById("RemovePassiveInstanceButton").addEventListener("click",function(){
		let i = Number(document.getElementById("PassiveInstanceNumber").value) - 1;
		document.getElementById("rowPassiveInstancesHeader").currentInstances.splice(-1);

		updateValidPassiveInstances(i);
	});

	referenceElement = createTableRow(referenceElement,"rowPassiveConditionsHeader","<th colspan = 2 style='text-align:center'>Conditions That Determine If Effect Activates</th>");

	let passiveConditionRows = [
		{
			RowID:"rowPassiveConditionHeaderOR",
			Contents:"<th colspan=2 style='text-align:center'><style='font-size:2em'><b>OR</b></th>"
		},
		{
			RowID:"rowPassiveConditionTitleOR",
			Contents:"<th colspan=2 style='text-align:center'>Condition #<span id='PassiveConditionTitleNumberOR'>x</span></th>"
		}
	]
	referenceElement = createMultiRowButtonsInput("PassiveConditionOR",referenceElement,passiveConditionRows,"Condition - Combine with OR",[],{SuppressAutoAdd:true});

	document.getElementById("AddPassiveConditionORButton").addEventListener("click",function(){
		let conditionsNum = Number(document.getElementById("PassiveConditionORNumber").value);
		let i = conditionsNum - 1;
		document.getElementById("PassiveConditionTitleNumberOR"+i).innerHTML = conditionsNum;
		updatePassiveConditionInfo(i);

		document.getElementById("rowPassiveConditionHeaderOR0").setAttribute("hidden","");

		let passiveConditionRows = [
			{
				RowID:"rowPassiveConditionHeaderAND"+i,
				Contents:"<th colspan=2 style='text-align:center'><style='font-size:2em'><b>AND</b></th>"
			},
			{
				RowID:"rowPassiveConditionType"+i,
				Contents:"<th colspan=2 style='text-align:center'><select id='PassiveConditionType"+i+"' name='PassiveConditionType"+i+"'></select></th>"
			}
		]
		let PassiveConditionListeners = [{
			functionName:"updatePassiveConditionInfo",
			elementID:"PassiveConditionType"+i,
			listener:"change"
		}]

		let referenceElement = document.getElementById("rowPassiveConditionTitleOR"+i);
		referenceElement = createMultiRowButtonsInput("PassiveConditionAND"+i,referenceElement,passiveConditionRows,"Condition - Combine with AND",PassiveConditionListeners,{SuppressAutoAdd:true});

		document.getElementById("AddPassiveConditionAND"+i+"Button").whichNum = i;
		document.getElementById("AddPassiveConditionAND"+i+"Button").addEventListener("click",function(){
			let i = this.whichNum;
			let j = Number(document.getElementById("PassiveConditionAND"+i+"Number").value);
			updatePassiveConditionInfo(j,"AND");
			
			document.getElementById("rowPassiveConditionHeaderAND"+i+"0").setAttribute("hidden","");
		});
		document.getElementById("AddPassiveConditionAND"+i+"Button").dispatchEvent(new Event("click"));
	});
	document.getElementById("AddPassiveConditionORButton").dispatchEvent(new Event("click"));
	
	referenceElement = createTableRow(referenceElement,"rowPassiveEffectsHeader","<th colspan = 2 style='text-align:center'>Effect</th>");
	
	referenceElement = createTableRow(referenceElement,"rowSubmitButtons","<th colspan = 2 style='text-align:center'><input type='submit' class='theme-fix-submit' id='submitWithNewPassive' value='Complete and Add New Passive Effect'><input type='submit' class='theme-fix-submit' id='submitAndComplete' value='Finish Creating Passive Effects'></th>");

	document.getElementById("submitWithNewPassive").addEventListener("click",function(){
		submitData('CreatePassiveFeature','CreatePassiveFeatureProcessing',{ParentToken:ParentToken,Feature:FeatureData,needsNewPassive:1});
	});

	document.getElementById("submitAndComplete").addEventListener("click",function(){
		submitData('CreatePassiveFeature','CreatePassiveFeatureProcessing',{ParentToken:ParentToken,Feature:FeatureData,needsNewPassive:0});
	});
}

setTimeout(loadUserData, 1);