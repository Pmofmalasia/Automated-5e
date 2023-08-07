[h:subeffectData = macro.args]
[h:ParentToken = json.get(subeffectData,"ParentToken")]
[h:EffectType = json.get(subeffectData,"EffectType")]
[h:thisSubeffectNum = json.get(subeffectData,"WhichSubeffect")]
[h:EffectsNumber = json.get(subeffectData,"EffectsNumber")]
[h:isPersistentEffect = number(json.get(subeffectData,"isPersistentEffect"))]
[h:ExtraData = json.get(subeffectData,"ExtraData")]

[h:SubeffectHTML = ""]
[h,if(isPersistentEffect): SubeffectHTML = SubeffectHTML + "<input type='hidden' id='isPersistentEffect' name='isPersistentEffect' value=1><input type='hidden' id='MainEffectsNumber' name='MainEffectsNumber' value='"+json.get(subeffectData,"MainEffectsNumber")+"'><input type='hidden' id='MainNeedsNewSubeffect' name='MainNeedsNewSubeffect' value="+json.get(subeffectData,"MainNeedsNewSubeffect")+"><tr><th text-align='center' colspan='2'>Persistent Effect</th></tr>"]

[h,if(EffectsNumber > 1),CODE:{
	[h:SubeffectHTML = SubeffectHTML + "<tr id='rowEffectName'><th>This Effect's Name:</th><td><input type='text' id='EffectDisplayName' name='EffectDisplayName'></td></tr>"]
};{}]

[h,if(thisSubeffectNum > 1),CODE:{};{
	[h:SubeffectHTML = SubeffectHTML + "<tr><th text-align='center' colspan='2'>Subeffect #"+thisSubeffectNum+"</th></tr>"]
}]

[h,if(thisSubeffectNum > 1),CODE:{
	[h:SubeffectLinkOptions = "<option value=0>None</option>"]
	[h,count(thisSubeffectNum - 1): SubeffectLinkOptions = SubeffectLinkOptions + "<option value="+(roll.count+1)+">"+(roll.count+1)+"</option>"]
	
	[h:CurrentFeatureData = getLibProperty("ct.New"+EffectType,"Lib:pm.a5e.Core")]
	[h:thisPlayerCurrentFeatureData = json.get(CurrentFeatureData,getPlayerName())]
	[h,switch(EffectType),CODE:
		case "Spell": {
			[h:tempPriorSubeffectData = json.get(thisPlayerCurrentFeatureData,json.length(thisPlayerCurrentFeatureData)-1)]
			[h:PriorSubeffectData = json.get(tempPriorSubeffectData,"Subeffects")]
		};
		default: {
			[h:AllPriorEffectData = json.get(thisPlayerCurrentFeatureData,"Effects")]
			[h:CurrentEffectData = json.get(AllPriorEffectData,json.length(AllPriorEffectData)-1)]
			[h:PriorSubeffectData = json.get(CurrentEffectData,"Subeffects")]
		}
	]

	[h:PriorSubeffectData = base64.encode(PriorSubeffectData)]

	[h:SubeffectHTML = SubeffectHTML + "<input type='hidden' name='PriorSubeffects' id='PriorSubeffects' value='"+PriorSubeffectData+"'><tr id='rowParentSubeffect'><th><label for='ParentSubeffect'>Linked to Subeffect #:</label></th><td><select id='ParentSubeffect' name='ParentSubeffect' onchange='createParentSubeffectRows()'>"+SubeffectLinkOptions+"</select></td></tr>"]
};{}]

[h,if(json.type(ExtraData) == "OBJECT"),CODE:{
	[h:ExtraDataKeys = json.fields(ExtraData)]
    [h,foreach(tempKey,ExtraDataKeys): SubeffectHTML = SubeffectHTML + "<input type='hidden' id='ExtraData"+tempKey+"' name='ExtraData"+tempKey+"' value='"+json.get(ExtraData,tempKey)+"'>"]
	[h:SubeffectHTML = SubeffectHTML + "<input type='hidden' id='ExtraDataKeys' name='ExtraDataKeys' value='"+json.toList(ExtraDataKeys)+"'>"]
};{}]

[h:SubeffectHTML = SubeffectHTML + "<input type='hidden' id='ParentToken' name='ParentToken' value='"+ParentToken+"'><input type='hidden' id='EffectType' name='EffectType' value='"+EffectType+"'><input type='hidden' id='WhichSubeffect' name='WhichSubeffect' value="+thisSubeffectNum+"><input type='hidden' id='EffectsNumber' name='EffectsNumber' value="+EffectsNumber+">"]

[h:SubeffectHTML = SubeffectHTML + "<tr id='Mitigation'><th><label for='howMitigate'>Make Attack or Force Save?</label></th><td><select id='howMitigate' name='howMitigate' onchange='createMitigationTable()'><option value='Attack'>Make Attack</option><option value='Save'>Force Save</option><option value='Neither' selected>Neither</option></select></td></tr>

<tr id='Damage'><th><label for='isDamage'>Heals or Deals Damage?</label></th><td><input type='checkbox' id='isDamage' name='isDamage' value=1 onchange='createDamageTable()'><input type='hidden' id='differentTypes' name='differentTypes' value=0></td></tr>

<tr id='rowCondition'><th><label for='isCondition'>Sets Conditions on Target:</label></th><td><select id='isCondition' name='isCondition' value=1 onchange='createConditionTable()'><option value='None'>None</option><option value='All'>All Selected</option><option value='Choose'>Choose Among Selected</option><option value='Mixture'>Mixture of Both</option></select></td></tr>

<tr id='rowSummons'><th><label for='isSummons'>Summons a Creature?</label></th><td><select id='isSummons' name='isSummons' onchange='createSummonTable()'><option value='No'>No</option><option value='UniqueEffect'>Non-Creature Unique Effect</option><option value='Single'>Single Specific Creature</option><option value='Options'>Creature from List</option><option value='Criteria'>Creature Based on Criteria</option></select></td></tr>"]

[h:SubeffectHTML = SubeffectHTML + "<tr id='rowIsUseResource'><th><label for='isUseResource'>Uses a Resource?</label></th><td><input type='checkbox' id='isUseResource' name='isUseResource' onchange='createUseResourceRows()'></td></tr>"]

[h:SubeffectHTML = SubeffectHTML + "<tr id='rowUncommonEffects'><th><label for='isUncommonEffects'>Show Additional Effects:</label></th><td><input type='checkbox' id='isUncommonEffects' name='isUncommonEffects' value=1 onchange='createUncommonEffectsRows()'></td></tr>"]

[h,if(isPersistentEffect): SubeffectHTML = SubeffectHTML + "<tr id='rowUseInitialTargets'><th><label for='UseInitialTargets'>Use Same Targets as Linked Effect:</label></th><td><input type='checkbox' id='UseInitialTargets' name='UseInitialTargets' onchange='createInitialTargetsRows("+'"CreateSubeffectTable","Initial"'+")'></td></tr>"]

[h:"<!-- Note: Targeting rows are now created in JS instead of here -->"]

[h:SubeffectHTML = SubeffectHTML + "<tr id='rowNeedsNewSubeffect'><th><span title='Check if an effect has different parts that have different conditions for resolving. For example, Ice Knife makes an attack against a single target (effect 1), then forces a save against all creatures around them (effect 2); Ray of Sickness makes a spell attack to deal damage (effect 1), then forces that target to make a save against poison if it hits (effect 2); and Vampiric Touch makes an attack to deal damage (effect 1), then heals the caster for half the amount of damage dealt (effect 2).'><label for='NeedsNewSubeffect'>Needs Additional Component of Same Effect:</label></span></th><td><input type='checkbox' id='NeedsNewSubeffect' name='NeedsNewSubeffect'></td></tr>

<tr id='rowNeedsPersistentEffect'><th><span title='Check if an effect needs to make additional rolls/force others to make them if not linked to an effect at a later time, e.g. many AoE effects that persist'><label for='needsPersistentEffect'>Has a Persistent Effect:</label></span></th><td><select id='needsPersistentEffect' name='needsPersistentEffect' onchange='createPersistentEffectRows("+'"CreateSubeffectTable"'+")'><option value=''>None</option><option value='Same'>Same Effect</option><option value='Different'>Different Effect</option></select></td></tr>

<tr id='submitRow'><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("SubeffectCreation","lib://pm.a5e.core/CreateSubeffect.html?cachelib=false","value="+base64.encode(SubeffectHTML)+"; closebutton=0; width=675; height=1050")]