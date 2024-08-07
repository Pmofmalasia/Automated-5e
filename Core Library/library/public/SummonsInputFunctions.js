function createSummonRows(idSuffix){
	if(arguments.length === 0){idSuffix = "";}
	let summonChoice = document.getElementById("isSummons").value;
	let referenceRow = document.getElementById("rowSummons");
	let hasPriorSelection = document.getElementById("rowSummonsEnd") != null;
	if(summonChoice == "No"){
		deleteInterveningElements(referenceRow,document.getElementById("rowSummonsEnd").nextElementSibling);
	}
	else{
		if(hasPriorSelection){
			deleteInterveningElements(referenceRow,document.getElementById("rowSummonNumber"));
		}
		if(summonChoice == "Single"){
			//TODO: Add validation when bestiary is created
			referenceRow = createTableRow(referenceRow,"rowSingleSummon","<th><label for='singleSummon'>Name of Summoned Creature:</th><td><input type='text' id='singleSummon' name='singleSummon'></td>");
		}
		else if(summonChoice == "Options"){
			//TODO: Add validation when bestiary is created
			referenceRow = createTableRow(referenceRow,"rowSummonOptions","<th><label for='summonOptions'>Summon Options:<br>(One per Row)</th><td><textarea id='summonOptions' name='summonOptions' rows='5' style='width:100%'></textarea></td>");
		}
		else if(summonChoice == "Criteria"){
			referenceRow = createTableRow(referenceRow,"rowSummonCRMax","<th><label for='summonCRMax'>Maximum CR of Creature:</th><td><input type='number' id='summonCRMax' name='summonCRMax' min=0 value=2 style='width:25px'><span id='summonCRMaxAHLSpan'></span></td>");

			if(checkEffectType()=="Spell"){
				let summonCRMaxAHLScalingSelect = createAHLSelect("summonCRMaxAHLScaling");
				document.getElementById("summonCRMaxAHLSpan").innerHTML = "<select id='summonCRMaxAHLScaleHow' name='summonCRMaxAHLScaleHow'><option value='Add'>Plus</option><option value='Multiply'>Times</option></select><input type='number' id='summonCRMaxAHLNum' name='summonCRMaxAHLNum' min=0 value=0 style='width:25px'>"+summonCRMaxAHLScalingSelect;
			}

			referenceRow = addCreatureTypePrereqRow(referenceRow,"Summon");

			referenceRow = addCreatureSubtypePrereqRow(referenceRow,"Summon");

			referenceRow = addSizePrereqRow(referenceRow,"Summon");
		}

		let summonNumberCROptions = "";
		if(summonChoice != "UniqueEffect" || summonChoice == "Single"){
			summonNumberCROptions = "<br>OR <input type='checkbox' id='summonNumberCRBased' name='summonNumberCRBased' onchange='toggleSummonNumber()'> Based on Summon CR";
		}

		let summonNumberAHLOptions = "";
		if(checkEffectType() == "Spell"){
			let summonNumberAHLScalingSelect = createAHLSelect("summonNumberAHLScaling");

			summonNumberAHLOptions = "<select id='summonNumberAHLScaleHow' name='summonNumberAHLScaleHow'><option value='Add'>Plus</option><option value='Multiply'>Times</option></select><input type='number' id='summonNumberAHL' name='summonNumberAHL' min='0' style='width:25px' value=0>"+summonNumberAHLScalingSelect;
		}

		if(hasPriorSelection){
			document.getElementById("SummonNumberAHLSpan").innerHTML = summonNumberAHLOptions;
			document.getElementById("SummonNumberByCRSpan").innerHTML = summonNumberCROptions;
		}
		else{
			referenceRow = createTableRow(referenceRow,"rowSummonNumber","<th><label for='summonNumber'>Number of Summons:</label></th><td><input type='number' id='summonNumber' name='summonNumber' min='1' style='width:25px' value=1><span id='SummonNumberAHLSpan'>"+summonNumberAHLOptions+"</span><span id='SummonNumberByCRSpan'>"+summonNumberCROptions+"</span></td>");

			referenceRow = createTableRow(referenceRow,"rowIsModifySummons","<th><label for='isModifySummons'>Modify Stats of Summons:</label></th><td><input type='checkbox' id='isModifySummons' name='isModifySummons'></td>");
			document.getElementById("isModifySummons").addEventListener("change",function(){
				createModifySummonsRows();
			});

			referenceRow = createTableRow(referenceRow,"rowSummonNoHPBehavior","<th><label for='SummonNoHPBehavior'>Summon Behavior When at 0 HP:</label></th><td><select id='SummonNoHPBehavior' name='SummonNoHPBehavior'><option value='Disappear'>Disappears</option><option value='Regular'>Makes Death Saves</option><option value='Dies'>Dies</option></select></td>");
			document.getElementById("SummonNoHPBehavior").addEventListener("change",function(){
				let behaviorChoice = this.value;
				let referenceRow = document.getElementById("rowSummonNoHPBehavior");
				if(behaviorChoice == "Dies" && document.getElementById("rowSummonRevival") === null){
					referenceRow = createTableRow(referenceRow,"rowSummonRevival","<th><label for='SummonRevival'>Can Summon Be Revived:</label></th><td><select id='SummonRevival' name='SummonRevival'><option value=''>No Revival</option><option value='Time'>Yes, with Time</option><option value='Resource'>Yes, Using a Resource</option></select></td>");

					//TODO: Consider if this should even be part of the macro, or if the revival should be a separate effect? Unsure. Also will need listener here for choosing a resource when that interface isn't dogshit.
				}
				else if(behaviorChoice != "Dies" && document.getElementById("rowSummonRevival") !== null){
					referenceRow.nextElementSibling.remove();
				}
			});

			referenceRow = createTableRow(referenceRow,"rowSummonInitiativeType","<th><label for='SummonInitiativeType'>Initiative Used for Summons:</label></th><td><select id='SummonInitiativeType' name='SummonInitiativeType'><option value='After'>Act After Summoner</option><option value='Independent'>Independent Initiative</option><option value='Shared'>Act During Summoner's Turn</option></select></td>");

			referenceRow = createTableRow(referenceRow,"rowSummonCommandHow","<th><label for='SummonCommandHow'>How to Command Summons:</label></th><td><select id='SummonCommandHow' name='SummonCommandHow'><option value='Verbal'>Verbally</option><option value='Telepathic'>Telepathically</option><option value='Independent'>Cannot Command</option></select></td>");
			document.getElementById("SummonCommandHow").addEventListener("change",function(){
				let commandChoice = this.value;

				if(commandChoice === "Independent"){
					document.getElementById("UseTimeSummonCommand").setAttribute("disabled","");
					document.getElementById("SummonCommandRange").setAttribute("disabled","");
					document.getElementById("isSummonCommandUncontrollable").removeAttribute("checked","");
					document.getElementById("isSummonCommandUncontrollable").dispatchEvent("change");
					document.getElementById("isSummonCommandUncontrollable").setAttribute("disabled","");
				}
				else{
					document.getElementById("UseTimeSummonCommand").removeAttribute("disabled","");
					document.getElementById("SummonCommandRange").removeAttribute("disabled","");
					document.getElementById("isSummonCommandUncontrollable").removeAttribute("disabled","");
				}
			});

			referenceRow = createTableRow(referenceRow,"rowSummonCommandRange","<th><label for='SummonCommandRange'>Command Range Limit:</label></th><td><input type='number' id='SummonCommandRange' name='SummonCommandRange' style='width:30px' value=100> Feet, or <input type='checkbox' id='isSummonCommandRangeUnlimited' name='isSummonCommandRangeUnlimited'>Unlimited</td>");
			document.getElementById("isSummonCommandRangeUnlimited").addEventListener("change",function(){
				toggleFieldEnabled("SummonCommandRange",this.id);
			});

			referenceRow = createTableRow(referenceRow,"rowUseTimeSummonCommand","<th><label for='UseTimeSummonCommand'>Action to Command Summons:</label></th><td><select id='UseTimeSummonCommand' name='UseTimeSummonCommand'><option value='Action'>Action</option><option value='Bonus Action' selected>Bonus Action</option><option value='Free'>Free</option></select></td>");

			referenceRow = createTableRow(referenceRow,"rowSummonCommandUnable","<th><label for='SummonCommandUnable'>Behavior if Unable to Give Commands:</label></th><td><select id='SummonCommandUnable' name='SummonCommandUnable'><option value='Unchanged'>Unchanged</option><option value='Independent'>Act Independently</option></select></td>");

			referenceRow = createTableRow(referenceRow,"rowIsSummonCommandUncontrollable","<th><label for='isSummonCommandUncontrollable'>Summon Can Become Uncontrollable:</label></th><td><input type='checkbox' id='isSummonCommandUncontrollable' name='isSummonCommandUncontrollable'></td>");
			document.getElementById("isSummonCommandUncontrollable").addEventListener("change",function(ev){
				createUncontrollableSummonRows();
			})

			referenceRow = createTableRow(referenceRow,"rowIsSummonOrigin","<th><label for='isSummonOrigin'>Can Use Summon as Origin of Effects:</label></th><td><input type='checkbox' id='isSummonOrigin' name='isSummonOrigin'></td>");
			document.getElementById("isSummonOrigin").addEventListener("change",function(){
				createSummonOriginRows();
			});

			referenceRow = createTableRow(referenceRow,"rowSummonsEnd","<th colspan=2></th>");
			referenceRow.classList.add("section-end");
		}
	}
}

function toggleSummonNumber(){
	if(document.getElementById("summonNumberCRBased").checked){
		document.getElementById("summonNumber").setAttribute('disabled','');
	}
	else{
		document.getElementById("summonNumber").removeAttribute('disabled','');
	}
}

function createModifySummonsRows(){

}

function createUncontrollableSummonRows(){
	let isUncontrollable = document.getElementById("isSummonCommandUncontrollable").checked;
	let referenceRow = document.getElementById("rowIsSummonCommandUncontrollable");

	if(isUncontrollable){
		let listeners = [
			{
				"elementID":"SummonCommandUncontrollableResolutionType",
				"listener":"change",
				"functionName":"createSummonCommandUncontrollableResolution",
				"functionArgs":{}
			},
			{
				"elementID":"SummonCommandUncontrollableConditional",
				"listener":"change",
				"functionName":"createSummonCommandUncontrollableConditions",
				"functionArgs":{}
			}
		]
		createMultiRowButtonsInput("SummonCommandUncontrollable",referenceRow,"<th colspan=2 style='text-align:center'>When <select id='SummonCommandUncontrollableMethod' name='SummonCommandUncontrollableMethod'><option value='ConcentrationLost'>Losing Concentration</option><option value='EndTurn'>Summon Ends Turn</option><option value='StartTurn'>Summon Starts Turn</option><option value='Damaged'>Summon is Damaged</option><option value='Attacked'>Summon is Attacked</option><option value='Commanded'>Summon is Commanded</option></select>, Control is <select id='SummonCommandUncontrollableConditional' name='SummonCommandUncontrollableConditional'><option value='0'>Always</option><option value='1'>Conditionally</option></select> Lost <select id='SummonCommandUncontrollableResolutionType' name='SummonCommandUncontrollableResolutionType'><option value=''>Automatically</option><option value='Save'>With Save</option><option value='Check'>With Check</option><option value='Percentage'>Percent Chance</option></select><span id='SummonCommandUncontrollableResolutionSpan'></th>","Way of Losing Control",listeners);
	}
	else{
		deleteInterveningElements(referenceRow,document.getElementById("rowSummonCommandUncontrollableButtons").nextElementSibling);
	}
}

async function createSummonCommandUncontrollableResolution(whichInstance){
	let ResolutionType = document.getElementById("SummonCommandUncontrollableResolutionType"+whichInstance).value;

	if(ResolutionType == ""){
		document.getElementById("SummonCommandUncontrollableResolutionSpan"+whichInstance).innerHTML = "";
	}
	else if(ResolutionType == "Check"){
		let requestAttr = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
		let attributeList = await requestAttr.json();

		let request = await fetch("macro:pm.GetSkills@lib:pm.a5e.Core", {method: "POST", body: ""});
		let checkList = await request.json();

		let checkOptions = createHTMLSelectOptions(checkList) + "<option value='AthleticsAcrobatics'>Athletics or Acrobatics</option>" + createHTMLSelectOptions(attributeList);
		
		let checkInput = "<select id='SummonCommandUncontrollableResolution"+whichInstance+"' name='SummonCommandUncontrollableResolution"+whichInstance+"'>"+checkOptions+"</select>";
		document.getElementById("SummonCommandUncontrollableResolutionSpan"+whichInstance).innerHTML = checkInput;
	}
	else if(ResolutionType == "Save"){
		let request = await fetch("macro:pm.GetAttributes@lib:pm.a5e.Core", {method: "POST", body: ""});
		let attributeList = await request.json();
		let saveOptions = createHTMLSelectOptions(attributeList);
		
		let saveInput = "<select id='SummonCommandUncontrollableResolution"+whichInstance+"' name='SummonCommandUncontrollableResolution"+whichInstance+"'>"+saveOptions+"</select>";
		document.getElementById("SummonCommandUncontrollableResolutionSpan"+whichInstance).innerHTML = saveInput;
	}
	else if(ResolutionType == "Percentage"){
		document.getElementById("SummonCommandUncontrollableResolutionSpan"+whichInstance).innerHTML = ": <input type='number' id='SummonCommandUncontrollableResolution"+whichInstance+"' name='SummonCommandUncontrollableResolution"+whichInstance+"' style='width:30px'>%";
	}
}

function createSummonOriginRows(){

}