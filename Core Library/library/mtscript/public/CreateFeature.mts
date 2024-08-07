[h:CreateFeatureData = macro.args]
[h,if(CreateFeatureData != ""),CODE:{
	[h:FeatureType = json.get(CreateFeatureData,"FeatureType")]
};{
	[h:FeatureType = ""]
}]

[h:list1through20 = ""]
[h,c(20): list1through20 = list1through20 + "<option value="+(roll.count+1)+">"+(roll.count+1)+"</option>"]

[h:CreateFeatureHTML = "<tr id='rowDisplayName'><th><label for='DisplayName'>Feature Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName' autofocus></td></tr>"]

[h,if(FeatureType == ""),CODE:{
	[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowFeatureType'><th><label for='FeatureType'>Feature Type:</label></th><td><select id='FeatureType' name='FeatureType'><option value='Class'>Class</option><option value='Race'>Race</option><option value='Feat'>Feat</option><option value='Background'>Background</option><option value='FightingStyle'>Fighting Style</option><option value='MonsterFeature'>NPC Feature</option></select></td></tr>"]
};{
	[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowFeatureType' hidden><input type='hidden' id='FeatureType' name='FeatureType' value='"+FeatureType+"'></tr>"]
}]

[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowFeatureTypeEnd' hidden></tr>"]

[h:"<!-- createFeatureTypeSpecificRows() is executed in JS to make those lines there -->"]

[h,if(FeatureType == "Condition"),CODE:{
	[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowConditionAssociatedFeature'><th><label for='ConditionAssociatedFeature'>Feature, Spell, or Item Associated with Condition:</label></th><td class='autocomplete-table'><input type='text' id='ConditionAssociatedFeature' name='ConditionAssociatedFeature' value='Base Condition'><span id='ValidationSpanConditionAssociatedFeature'></span></td></tr>"]
	
	[h:BaseConditions = pm.a5e.GetBaseConditions()]
	[h:CountsAsOptions = "<option value=''>None</option>" + ut.a5e.GenerateSelectionHTML(BaseConditions)]
	[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowConditionCountsAs'><th><label for='ConditionCountsAs'><span title='For example, "+'"Creatures immune to being frightened are immune to this condition."'+"'>Counts as Another Condition for Immunities:</span></label></th><td><select id='ConditionCountsAs' name='ConditionCountsAs'>"+CountsAsOptions+"</select></td></tr>"]

	[h:ConditionTags = pm.a5e.GetCoreData("sb.ConditionTags")]
	[h:ConditionTagOptions = ut.a5e.GenerateSelectionHTML(ConditionTags,1,"ConditionTag")+"<label><input type='checkbox' id='isCreateNewConditionTag' name='isCreateNewConditionTag' onchange='createNewConditionTagRows()'><span>New Condition Tag</span></label>"]
	[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowConditionTags'><th>Condition Tags:</label></th><td><div class='check-multiple' style='width:100%'>"+ConditionTagOptions+"</div></td></tr>"]	
};{}]

[h,if(FeatureType == "FightingStyle"),CODE:{
	[h:FSGroups = json.path.read(data.getData("addon:","pm.a5e.core","sb.Abilities"),"\$[*][?(@.FightingStyleList!=null && @.CreatedForMerging!=1)]","DEFAULT_PATH_LEAF_TO_NULL")]
	[h:FSOptions = ""]
	[h,foreach(tempGroup,FSGroups),CODE:{
		[h:tempSubclassDisplay = pm.GetDisplayName(json.get(tempGroup,"Subclass"),"sb.Subclasses")]
		[h:tempClassDisplay = pm.GetDisplayName(json.get(tempGroup,"Class"),"sb.Classes")]
		[h:tempIdentifier = json.get(tempGroup,"Name")+json.get(tempGroup,"Class")+json.get(tempGroup,"Subclass")]
		[h:FSOptions = FSOptions + "<label><input type='checkbox' id='isFightingStyle"+tempIdentifier+"' name='isFightingStyle"+tempIdentifier+"'><span>"+tempSubclassDisplay+" "+tempClassDisplay+": "+json.get(tempGroup,"DisplayName")+"</span></label>"]

		[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowFightingStyleFeatures'><th>Features That Can Choose Fighting Style:</label></th><td><div class='check-multiple' style='width:100%'>"+ConditionTagOptions+"</div></td></tr>"]	
	}]
};{}]

[h:levelingRelevantTypes = json.append("","Class","Race","Background","")]
[h,if(json.contains(levelingRelevantTypes,FeatureType)),CODE:{
	[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowLevel'><th><span title='For features chosen to be gained, e.g. Eldritch Invocations and Maneuvers, set any level prerequisites under "+'"Additional Prerequisites"'+"'><label for='Level'>Automatically Gained at Level:</label></span></th><td><select id='Level' name='Level'><option value=''>Not Automatic</option>"+list1through20+"</select></td></tr>"]

	[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowHasMain'><th><label for='hasMain'><span title='Check if part of a feature with multiple named options, e.g. Battle Master Fighter - Combat Superiority Maneuvers, Totem Barbarian, Hunter Ranger'>Part of Another Feature:</span></label></th><td><input type='checkbox' id='hasMain' name='hasMain' onchange='createMainFeatureRow()'></td></tr>"]

	[h:"<!-- Need to remember to set 'IsOnLevel' to 1 if Level is not blank -->"]
};{
	[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowIsMultiability'><th><label for='isMultifeature'>"+if(FeatureType == "Condition","Multiple Instances of Condition Stack:","<span title='For things like Elemental Adept and... that's it.'>Feature Can Be Gained Multiple Times:</span>")+"</label></th><td><input type='checkbox' id='isMultifeature' name='isMultifeature'></td></tr>"]
}]

[h,if(json.contains(levelingRelevantTypes,FeatureType) || FeatureType == "MonsterFeature"): CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowIsOptional'><th><label for='isOptional'><span title='For sourcebooks that add optional additional rules'>"+if(FeatureType == "MonsterFeature","Variant Monster Feature","Feature is Optional")+":</span></label></th><td><input type='checkbox' id='isOptional' name='isOptional' checked></td></tr>"]

[h,if(FeatureType != "Condition"),CODE:{
	[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowIsReplaceFeature'><th><label for='isReplaceFeature'><span title='Mostly for sourcebooks that optionally remove old features and replace them with new ones (Tasha's Ranger).'>Replaces Another Feature if Gained:</span></label></th><td><input type='checkbox' id='isReplaceFeature' name='isReplaceFeature' onchange='createReplaceFeatureRow()'></td></tr>"]

	[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowIsFeaturePrereqs'><th><label for='isFeaturePrereqs'><span title='Do not include class/subclass/level if same as above.'>Has Additional Prerequisites:</span></label></th><td><input type='checkbox' id='isFeaturePrereqs' name='isFeaturePrereqs' onchange='createFeaturePrereqsRow()'></td></tr><tr id='rowFeaturePrereqsEnd'><th></th><td></td></tr>"]
};{}]

[h:allSourcebooks = pm.GetBookInfo()]
[h:sourcebookOptions = ""]
[h,foreach(tempBook,allSourcebooks),CODE:{
	[h:tempBookDisplayName = json.get(tempBook,"DisplayName")]
	[h,if(length(tempBookDisplayName) > 35): tempBookDisplayName = substring(tempBookDisplayName,0,32)+"..."]
	[h:sourcebookOptions = sourcebookOptions + "<option value='"+json.get(tempBook,"Library")+"'>"+tempBookDisplayName+"</option>"]
}]

[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowSourcebook'><th><label for='Sourcebook'>Sourcebook:</label></th><td><select id='Sourcebook' name='Sourcebook'>"+sourcebookOptions+"</select></td></tr>

<tr id='rowDescription'><th style='text-align:center' colspan='2'><label for='Description'>Full Feature Description:</label></th></tr><tr id='rowFeatureTextArea'><th colspan='2'><textarea id='Description' name='Description' rows='10' style='width:100%'></textarea></th></tr>

<tr id='rowAbridgedDescription'><th style='text-align:center' colspan='2'><label for='AbridgedDescription'>Optional Abridged Description:</label></th></tr><tr id='rowAbridgedFeatureTextArea'><th colspan='2'><textarea id='AbridgedDescription' name='AbridgedDescription' rows='4' style='width:100%'></textarea></th></tr>"]

[h:CreateFeatureHTML = CreateFeatureHTML + "<tr><th style='text-align:center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Submit'></th></tr>"]

[h:createFeatureData = json.set("",
	"Input",CreateFeatureHTML,
	"ParentToken",currentToken(),
	"PriorData","{}"
)]

[h:html.dialog5("CreateFeatureInitial","lib://pm.a5e.core/CreateFeatureInitial.html?cachelib=false","value="+base64.encode(createFeatureData)+"; closebutton=0; width=500; height=700")]