[h:abilityInfo = arg(0)]
[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:pm.ConditionNames = json.get(arg(1),"Conditions")]
[h:pm.ConditionNum = json.length(pm.ConditionNames)]
[h:pm.ChoiceMethod = if(json.get(arg(1),"Choice")=="","All",json.get(arg(1),"Choice"))]
[h:pm.Duration=json.get(arg(2),"Duration")]
[h:pm.DurationUnits=json.get(arg(2),"DurationUnits")]
[h:pm.AuraRange=if(json.get(arg(2),"AuraRange")=="",0,json.get(arg(2),"AuraRange"))]
[h:pm.AuraUnits=json.get(arg(2),"AuraUnits")]

[h:pm.ConditionIDTest = json.path.read(allAbilities,"[*][?(@.Name == '"+pm.Ability+"' && @.Class == '"+pm.Class+"' && @.Subclass == '"+pm.Subclass+"' && @.ConditionID != null)]['ConditionID']","DEFAULT_PATH_LEAF_TO_NULL")]

[h,if(json.isEmpty(pm.ConditionIDTest)),CODE:{
	[h:allAbilities = json.path.put(allAbilities,"[*][?(@.Name == '"+pm.Ability+"' && @.Class == '"+pm.Class+"' && @.Subclass == '"+pm.Subclass+"')]","ConditionID","")]
	[h:pm.CurrentID = ""]
};{
	[h:pm.CurrentID = json.get(pm.ConditionIDTest,0)]
}]

[h,SWITCH(pm.Tooltip+""+(pm.CurrentID=="")),CODE:
	case "11":{
		[h:macro.return = json.set("","ShowIfCondensed",1,"Header","Active?","FalseHeader","","FullContents","","RulesContents","No","RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",1,"Units","")]
	};
	case "10":{
		[h:macro.return = json.set("","ShowIfCondensed",1,"Header","Active?","FalseHeader","","FullContents","","RulesContents","Yes","RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",1,"Units","")]
	};
	case "01":{
		[h:pm.ConditionInfo = pm.GetAbilityConditions(arg(0),arg(1),arg(2))]
		[h:ConditionList = json.merge(ConditionList,json.get(pm.ConditionInfo,"Conditions"))]
		[h:allAbilities = json.path.set(allAbilities,"[*][?(@.Name == '"+pm.Ability+"' && @.Class == '"+pm.Class+"' && @.Subclass == '"+pm.Subclass+"')]['ConditionID']",json.get(pm.ConditionInfo,"ConditionID"))]
		[h:macro.return = json.set("","ShowIfCondensed",1,"Header","Condition"+if(pm.ConditionNum>1,"s","")+" Activated","FalseHeader","","FullContents","","RulesContents",json.toList(json.path.read(pm.ConditionInfo,"['Conditions'][*]['DisplayName']")),"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",0,"Units","")]
	};
	case "00":{
		[h:pm.ConditionsDeactivated = json.toList(json.path.read(ConditionList,"[?(@.ConditionID=="+pm.CurrentID+")]['DisplayName']"))]
		[h,if(listCount(pm.ConditionsDeactivated)>1): listInsert(pm.ConditionsDeactivated,listCount(pm.ConditionsDeactivated)-1,"and")]
		[h:ConditionList = json.path.delete(ConditionList,"[?(@.ConditionID=="+pm.CurrentID+")]")]
		[h:allAbilities = json.path.set(allAbilities,"[*][?(@.Name == '"+pm.Ability+"' && @.Class == '"+pm.Class+"' && @.Subclass == '"+pm.Subclass+"')]['ConditionID']","")]
		[h:abilityTable = json.append("[]",json.set("","ShowIfCondensed",1,"Header","Condition"+if(pm.ConditionNum>1,"s","")+" Deactivated","FalseHeader","","FullContents","","RulesContents",pm.ConditionsDeactivated,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",1,"Units",""))]
		[h:abilityTable = "[]"]
		[h:abilityEffect=pm.ConditionsDeactivated+" deactivated."]
		[h:pm.AbilityFormatCall()]
		[h:abort(0)]
	}
]