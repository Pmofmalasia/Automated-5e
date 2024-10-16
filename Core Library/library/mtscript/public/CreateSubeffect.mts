[h:subeffectData = macro.args]
[h:ParentToken = json.get(subeffectData,"ParentToken")]
[h:EffectType = json.get(subeffectData,"EffectType")]
[h:thisSubeffectNum = json.get(subeffectData,"WhichSubeffect")]
[h:EffectsNumber = json.get(subeffectData,"EffectsNumber")]
[h:EffectChoiceMethod = json.get(subeffectData,"EffectChoiceMethod")]
[h:FeatureData = json.get(subeffectData,"FeatureData")]
[h:isPersistentEffect = number(json.get(subeffectData,"isPersistentEffect"))]
[h:ExtraData = json.get(subeffectData,"ExtraData")]

[h:SubeffectHTML = "<input type='hidden' id='FeatureData' name='FeatureData' value='"+base64.encode(FeatureData)+"'>"]
[h,if(isPersistentEffect): SubeffectHTML = SubeffectHTML + "<input type='hidden' id='isPersistentEffect' name='isPersistentEffect' value=1><input type='hidden' id='MainEffectsNumber' name='MainEffectsNumber' value='"+json.get(subeffectData,"MainEffectsNumber")+"'><input type='hidden' id='MainNeedsNewSubeffect' name='MainNeedsNewSubeffect' value="+json.get(subeffectData,"MainNeedsNewSubeffect")+"><tr><th text-align='center' colspan='2'>Persistent Effect</th></tr><tr id='rowPersistentEffectBreak'></tr>"]

[h:SubeffectHTML = SubeffectHTML + "<tr id='rowIsUseResource'><th><label for='isUseResource'>Uses a Resource?</label></th><td><input type='checkbox' id='isUseResource' name='isUseResource' onchange='createUseResourceRows()'></td></tr>"]

[h,if(thisSubeffectNum == 1),CODE:{
	[h:SubeffectHTML = SubeffectHTML + "<tr id='rowEffectHeader'><th text-align='center' colspan='2'>Overall Effect Information</th></tr>"]

	[h,if(EffectsNumber > 1),CODE:{
		[h:SubeffectHTML = SubeffectHTML + "<tr id='rowEffectName'><th><label for='EffectDisplayName'>This Effect's Name:</label></th><td><input type='text' id='EffectDisplayName' name='EffectDisplayName'></td></tr>"]
	};{}]

	[h,switch(EffectChoiceMethod),CODE:
		case "Random":{

		};
		case "Target":{

		};
		case "StoredValue":{

		};
		case "OutsideRoll":{

		};
		case "ResourceType":{

		};
		case "ItemActivationState":{
			[h:"<!-- TODO: Add multiple activation states in the future -->"]
			[h:SubeffectHTML = SubeffectHTML + "<input type='hidden' id='EffectChoiceMethod' name='EffectChoiceMethod' value='"+EffectChoiceMethod+"'><tr id='rowEffectItemActivationStates'><th><label for='ValidActivationState'>Effect Useable When:</label></th><td><select id='ValidActivationState' name='ValidActivationState'><option value='1'>Item is Active</option><option value='0'>Item is Inactive</option></select></td></tr>"]
		};
		default: {
			
		}
	]

	[h:UseTimeOptions = json.append("","Action","Bonus Action","Reaction","Item Interaction","Free","1 Minute","10 Minutes","1 Hour","8 Hours","12 Hours","24 Hours","Custom")]
	[h,if(isPersistentEffect): UseTimeOptions = json.merge(json.append("","No Cost"),UseTimeOptions)]
	[h:listUseTime = ""]
	[h,foreach(tempUseTime,UseTimeOptions): listUseTime = listUseTime + "<option value='"+tempUseTime+"'>"+tempUseTime+"</option>"]

	[h:SubeffectHTML = SubeffectHTML + "<tr id='rowUseTime'><th><label for='UseTime'>"+if(EffectType == "Spell","Casting","Usage")+" Time:</label></th><td><select id='UseTime' name='UseTime' onchange='createCustomUseTimeRows("+'"CreateSubeffectTable","UseTime","rowDuration"'+")'>"+listUseTime+"</select></td></tr>"]

	[h:durationOptions = json.append("","Instantaneous","1 Round","1 Minute","10 Minutes","1 Hour","8 Hours","24 Hours","10 Days","Until Dispelled","Custom")]
	[h:listDuration = ""]
	[h,foreach(tempDuration,durationOptions): listDuration = listDuration + "<option value='"+tempDuration+"'>"+tempDuration+"</option>"]
	
	[h:SubeffectHTML = SubeffectHTML + "<tr id='rowDuration'><th><label for='Duration'>Duration:</label></th><td><select id='Duration' name='Duration' onchange='createCustomDurationRows("+'"CreateSubeffectTable","Duration","'+if(EffectType=="Spell","rowAHLDuration","rowIsConcentration")+'"'+")'>"+listDuration+"</select></td></tr>"]

	[h,if(EffectType == "Spell"),CODE:{
		[h:tempSpellLevel = json.get(ExtraData,"SpellLevel")]
		[h:SubeffectHTML = SubeffectHTML + "<tr id='rowAHLDuration'><th><label for='AHLDuration'>Duration Increases at Higher Levels:</label></th><td><input type='checkbox' id='AHLDuration' name='AHLDuration' onchange='createAHLDurationRows("+'"CreateSubeffectTable",'+tempSpellLevel+',"rowIsConcentration"'+")' value=1></td></tr>"]
	};{
		[h:tempSpellLevel = 0]
	}]

	[h:SubeffectHTML = SubeffectHTML + "<tr id='rowIsConcentration'><th><label for='isConcentration'>Requires Concentration:</label></th><td><input type='checkbox' id='isConcentration' name='isConcentration' value=1></td></tr>"]

	[h,if(EffectType == "Spell" && tempSpellLevel != 0): SubeffectHTML = SubeffectHTML + "<tr id='rowIsConcentrationLost'><th><label for='isConcentrationLost'>Concentration Not Required at Higher Levels:</label></th><td><input type='checkbox' id='isConcentrationLost' name='isConcentrationLost' onchange='createConcentrationLostRows("+'"CreateSubeffectTable",'+tempSpellLevel+',"rowEffectBreak"'+")' value=1></td></tr>"]

	[h:SubeffectHTML = SubeffectHTML + "<tr id='rowEffectBreak'></tr>"]
};{}]

[h:SubeffectHTML = SubeffectHTML + "<tr id='rowSubeffectHeader'><th text-align='center' colspan='2'>Subeffect "+if(thisSubeffectNum > 1,"#"+thisSubeffectNum,"Information")+"</th></tr>"]

[h,if(thisSubeffectNum > 1),CODE:{
	[h:SubeffectLinkOptions = "<option value=0>None</option>"]
	[h,count(thisSubeffectNum - 1): SubeffectLinkOptions = SubeffectLinkOptions + "<option value="+(roll.count+1)+">"+(roll.count+1)+"</option>"]

	[h:AllPriorEffectData = json.get(FeatureData,"Effects")]
	[h:CurrentEffectData = json.get(AllPriorEffectData,json.length(AllPriorEffectData)-1)]
	[h:PriorSubeffectData = json.get(CurrentEffectData,"Subeffects")]

	[h:PriorSubeffectData = base64.encode(PriorSubeffectData)]

	[h:SubeffectHTML = SubeffectHTML + "<input type='hidden' name='PriorSubeffects' id='PriorSubeffects' value='"+PriorSubeffectData+"'><tr id='rowParentSubeffect'><th><label for='ParentSubeffect'>Linked to Subeffect #:</label></th><td><select id='ParentSubeffect' name='ParentSubeffect' onchange='createParentSubeffectRows()'>"+SubeffectLinkOptions+"</select></td></tr>
	
	<tr id='rowParentSubeffectEnd' class='section-end' hidden><th colspan=2></th></tr>"]
};{}]

[h,if(json.type(ExtraData) == "OBJECT"),CODE:{
	[h:ExtraDataKeys = json.fields(ExtraData)]
    [h,foreach(tempKey,ExtraDataKeys): SubeffectHTML = SubeffectHTML + "<input type='hidden' id='ExtraData"+tempKey+"' name='ExtraData"+tempKey+"' value='"+json.get(ExtraData,tempKey)+"'>"]
	[h:SubeffectHTML = SubeffectHTML + "<input type='hidden' id='ExtraDataKeys' name='ExtraDataKeys' value='"+json.toList(ExtraDataKeys)+"'>"]
};{}]

[h:SubeffectHTML = SubeffectHTML + "<input type='hidden' id='ParentToken' name='ParentToken' value='"+ParentToken+"'><input type='hidden' id='EffectType' name='EffectType' value='"+EffectType+"'><input type='hidden' id='WhichSubeffect' name='WhichSubeffect' value="+thisSubeffectNum+"><input type='hidden' id='EffectsNumber' name='EffectsNumber' value="+EffectsNumber+">"]

[h:SubeffectHTML = SubeffectHTML + "<tr id='rowMitigation'><th><label for='howMitigate'>d20 Test Required?</label></th><td><select id='howMitigate' name='howMitigate' onchange='createMitigationTable()'><option value='Attack'>Make Attack</option><option value='Save'>Force Save</option><option value='ForceCheck'>Force Check</option><option value='Check'>User Makes Check</option><option value='None' selected>No Test</option></select></td></tr>

<tr id='Damage'><th><label for='isDamage'>Heals or Deals Damage?</label></th><td><input type='checkbox' id='isDamage' name='isDamage' value=1 onchange='createDamageTable()'><input type='hidden' id='differentTypes' name='differentTypes' value=0></td></tr>

<tr id='rowCondition'><th><label for='isCondition'>Sets Conditions on Target:</label></th><td><select id='isCondition' name='isCondition' value=1 onchange='createConditionTable()'><option value='None'>None</option><option value='All'>All Selected</option><option value='Choose'>Choose Among Selected</option><option value='Mixture'>Mixture of Both</option></select></td></tr>

<tr id='rowSummons'><th><label for='isSummons'>Summons a Creature?</label></th><td><select id='isSummons' name='isSummons' onchange='createSummonRows()'><option value='No'>No</option><option value='UniqueEffect'>Non-Creature Unique Effect</option><option value='Single'>Single Specific Creature</option><option value='Options'>Creature from List</option><option value='Criteria'>Creature Based on Criteria</option></select></td></tr>"]

[h:SubeffectHTML = SubeffectHTML + "<tr id='rowUncommonEffects'><th><label for='isUncommonEffects'>Show Additional Effects:</label></th><td><input type='checkbox' id='isUncommonEffects' name='isUncommonEffects' value=1 onchange='createUncommonEffectsRows()'></td></tr>"]

[h,if(isPersistentEffect): SubeffectHTML = SubeffectHTML + "<tr id='rowUseInitialTargets'><th><label for='UseInitialTargets'>Use Same Targets as Main Effect:</label></th><td><input type='checkbox' id='UseInitialTargets' name='UseInitialTargets' onchange='createInitialTargetsRows("+'"CreateSubeffectTable","Initial"'+")'></td></tr>"]

[h:"<!-- Note: Targeting rows are now created in JS instead of here -->"]

[h:SubeffectHTML = SubeffectHTML + "<tr id='rowNeedsNewSubeffect'><th><span title='Check if an effect has different parts that have different conditions for resolving. For example, Ice Knife makes an attack against a single target (effect 1), then forces a save against all creatures around them (effect 2); Ray of Sickness makes a spell attack to deal damage (effect 1), then forces that target to make a save against poison if it hits (effect 2); and Vampiric Touch makes an attack to deal damage (effect 1), then heals the caster for half the amount of damage dealt (effect 2).'><label for='NeedsNewSubeffect'>Needs Additional Component of Same Effect:</label></span></th><td><input type='checkbox' id='NeedsNewSubeffect' name='NeedsNewSubeffect'></td></tr>

<tr id='rowNeedsPersistentEffect'><th><span title='Check if an effect needs to make additional rolls/force others to make them if not linked to an effect at a later time, e.g. many AoE effects that persist'><label for='needsPersistentEffect'>Has a Persistent Effect:</label></span></th><td><select id='needsPersistentEffect' name='needsPersistentEffect' onchange='createPersistentEffectRows("+'"CreateSubeffectTable"'+")'><option value=''>None</option><option value='Same'>Same Effect</option><option value='Different'>Different Effect</option></select></td></tr>

<tr id='submitRow'><th text-align='center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("SubeffectCreation","lib://pm.a5e.core/CreateSubeffect.html?cachelib=false","value="+base64.encode(SubeffectHTML)+"; closebutton=0; width=675; height=1050")]