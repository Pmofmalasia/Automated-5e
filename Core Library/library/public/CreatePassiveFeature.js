function updateValidPassiveInstances(i) {
	
}

function updatePassiveConditionInfo(i){

}

async function loadUserData(){
	let userdata = atob(await MapTool.getUserData());
	FeatureData = JSON.parse(userdata);
	ParentToken = FeatureData.ParentToken;
	delete FeatureData.ParentToken;

	titleLine = document.createElement("tr");
	titleLine.innerHTML = "<th colspan=2 style='text-align:center'>Passive Effects</th>";
	document.getElementById("CreatePassiveFeatureTable").insertAdjacentElement("afterbegin",titleLine);

	let referenceElement = createTableRow(titleLine,"rowPassiveInstancesHeader","<th colspan = 2 style='text-align:center'>Instances When Effect Activates</th>");

	let PassiveInstanceListeners = [{
		functionName:"updateValidPassiveInstances",
		elementID:"PassiveInstance",
		listener:"change"
	}]
	referenceElement = createMultiRowButtonsInput("PassiveInstance",referenceElement,"<th colspan=2 style='text-align:center'><select id='PassiveInstance' name='PassiveInstance'></select></th>","Instance",PassiveInstanceListeners);
	document.getElementById("AddPassiveInstanceButton").addEventListener("click",function(){
		let currentInstanceNumber = Number(document.getElementById("PassiveInstanceNumber").value);
		updateValidPassiveInstances(currentInstanceNumber);
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
		console.log(j);
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