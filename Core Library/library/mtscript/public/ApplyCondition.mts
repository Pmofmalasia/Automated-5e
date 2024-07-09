[h:a5e.ConditionsTemp = json.get(macro.args,"Conditions")]
[h:a5e.EndConditionInfo = json.get(macro.args,"EndInfo")]
[h:a5e.AuraInfo = json.get(macro.args,"Aura")]
[h:a5e.GroupID = json.get(macro.args,"GroupID")]
[h:TargetData = json.get(macro.args,"Target")]
[h:SourceID = json.get(macro.args,"SourceID")]
[h,if(json.type(TargetData) == "OBJECT"),CODE:{
	[h:ParentToken = json.get(TargetData,"HeldBy")]
	[h:TargetType = "Item"]
	[h:TargetID = json.get(TargetData,"ItemID")]
};{
	[h:ParentToken = if(TargetData=="",currentToken(),TargetData)]
	[h:TargetType = "Token"]
	[h:TargetID = ParentToken]
}]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "ApplyCondition"]
[h:pm.a5e.EffectData = "[]"]
[h:ConditionSetBy = json.get(macro.args,"SetBy")]
[h:abilityTable = "[]"]

[h:"<!-- TODO: This is like this because I screwed up and didn't standardize how the data was stored. Could go in and standardize it in the future, the object method is better. -->"]
[h:DurationStorageType = json.type(json.get(a5e.EndConditionInfo,"Duration"))]
[h,if(DurationStorageType == "OBJECT"):
	DurationData = json.get(a5e.EndConditionInfo,"Duration");
	DurationData = a5e.EndConditionInfo
]
[h:ConditionDuration = json.get(DurationData,"Duration")]
[h:ConditionDurationUnits = json.get(DurationData,"DurationUnits")]

[h:ConditionAdvancePoint = json.get(a5e.EndConditionInfo,"AdvancePoint")]
[h:ConditionEndTriggers = json.get(a5e.EndConditionInfo,"EndTriggers")]

[h:DurationBase = json.set("","year",0,"day",0,"hour",0,"minute",0,"round",0)]
[h,if(ConditionDurationUnits=="" || lower(ConditionDurationUnits)=="instantaneous"): 
	DurationFinal = "{}";
	DurationFinal = json.set(DurationBase,ConditionDurationUnits,ConditionDuration,"AdvancePoint",ConditionAdvancePoint)
]

[h:ConditionImmunities = pm.a5e.ConditionImmunityCalc(json.set("","ParentToken",ParentToken,"SetBy",ConditionSetBy,"SourceID",SourceID))]
[h:a5e.ConditionsTemp = json.path.delete(a5e.ConditionsTemp,"\$[*][?(@.Name in "+json.get(ConditionImmunities,"Conditions")+" || @.CountsAs in "+json.get(ConditionImmunities,"Conditions")+")]")]

[h:"<!-- Note: Condition Type immunities are done this way because json.path filters can't check for any overlap, just subset. -->"]
[h:AllConditionsImmunType = "[]"]
[h,foreach(tempCondition,a5e.ConditionsTemp),CODE:{
	[h:ImmunTypeTest = !json.isEmpty(json.intersection(json.get(tempCondition,"ConditionType"),json.get(ConditionImmunities,"ConditionTypes")))]
	[h,if(ImmunTypeTest): AllConditionsImmunType = json.append(AllConditionsImmunType,json.get(tempCondition,"Name"))]
}]
[h:a5e.ConditionsTemp = json.path.delete(a5e.ConditionsTemp,"\$[*][?(@.Name in "+AllConditionsImmunType+")]")]

[h:"<!-- The purpose of looping here is to catch any chain reactions - e.g. Condition A is associated with Condition B, which in turn is associated with Condition C. -->"]
[h:a5e.Conditions = "[]"]
[h,while(!json.equals(a5e.Conditions,a5e.ConditionsTemp)),CODE:{
	[h:a5e.Conditions = a5e.ConditionsTemp]

	[h:AssociatedConditionsTemp = json.path.read(a5e.ConditionsTemp,"\$[*]['AssociatedConditions']")]
	[h:AssociatedConditions = "[]"]
	[h,foreach(condition,AssociatedConditionsTemp): AssociatedConditions = json.merge(AssociatedConditions,condition)]
	
	[h:AssociatedConditionNames = json.path.read(AssociatedConditions,"\$[*][?(@.Name nin "+ConditionImmunities+")]['Name']")]
	[h:AssociatedConditionNamesToAdd = json.difference(AssociatedConditionNames,json.path.read(a5e.ConditionsTemp,"\$[*]['Name']"))]

	[h:AssociatedConditionsToAdd = json.path.read(AssociatedConditions,"\$[*][?(@.Name in "+AssociatedConditionNamesToAdd+")]")]

	[h:newAssociatedConditions = "[]"]
	[h,foreach(condition,AssociatedConditionsToAdd): newAssociatedConditions = json.merge(newAssociatedConditions,json.path.put(json.path.read(data.getData("addon:","pm.a5e.core","sb.Conditions"),"\$[*][?(@.Name=='"+json.get(condition,"Name")+"' && @.Class=='"+json.get(condition,"Class")+"' && @.Subclass=='"+json.get(condition,"Subclass")+"')]"),"\$[*]","IsAssociated",1))]
	
	[h:pm.PassiveFunction("ChangeCondGain")]
	
	[h:a5e.ConditionsTemp = json.merge(a5e.Conditions,newAssociatedConditions)]
}]

[h:a5e.Conditions = json.path.put(a5e.Conditions,"\$[*]","Duration",DurationFinal)]
[h:a5e.Conditions = json.path.put(a5e.Conditions,"\$[*]","SetBy",ConditionSetBy)]
[h:a5e.Conditions = json.path.put(a5e.Conditions,"\$[*]","GroupID",a5e.GroupID)]
[h:a5e.Conditions = json.path.put(a5e.Conditions,"\$[*]","IsActive",1)]
[h,if(a5e.AuraInfo != ""): a5e.Conditions = json.path.put(a5e.Conditions,"\$[*]","Aura",a5e.AuraInfo)]

[h:"<!-- The following line sets any previously set conditions of the same name as inactive. The reasoning is based on PHB 205: effects of the same spell cast multiple times don't combine, and the most potent effect applies while they overlap - OR, if equally potent, the most recent effect applies. In lieu of being able to calculate which is more 'potent' ahead of time (which, at times, can be abstract), the latter method is the one used at all times instead. Will continue to think of ways to enforce the more 'potent' effect when possible. For now, the current method should cover the majority of cases, and should add an option to change which is active in the Condition Management macro to cover edge cases. Note: There is a similar ruling on PHB 290 for base conditions, so this is not limited to spells. -->"]
[h,switch(TargetType),CODE:
	case "Token":{
		[h,foreach(tempCondition,a5e.Conditions): setProperty("a5e.stat.ConditionList",json.path.set(getProperty("a5e.stat.ConditionList"),"\$[*][?(@.Name=='"+json.get(tempCondition,"Name")+"' && @.MultiFeature != 1)]['IsActive']",0))]
	};
	case "Item":{
		[h,foreach(tempCondition,a5e.Conditions): setProperty("a5e.stat.Inventory",json.path.set(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemConditions.Name=='"+json.get(tempCondition,"Name")+"' && @.MultiFeature != 1)]['IsActive']",0))]
	}
]

[h,foreach(condition,a5e.Conditions),CODE:{
	[h:StateExistsTest = !json.isEmpty(json.path.read(getInfo("campaign"),"\$.states.*.[?(@.name=='"+json.get(condition,"Name")+"')]"))]
	[h,if(StateExistsTest),CODE:{
		[h,if(json.get(condition,"IsAssociated")!=1):setState(json.get(condition,"Name"),1)]
	};{
		[h,if(json.get(condition,"BackupState")!="" && json.get(condition,"IsAssociated")!=1): setState(json.get(condition,"BackupState"),1)]
	}]
}]

[h,if(a5e.AuraInfo != ""),CODE:{
	[h:AuraRange = json.get(json.get(a5e.AuraInfo,"Range"),"Value")]
	[h:AuraColor = if(getProperty("a5e.stat.Allegiance") == "Enemy","Red","Green")]
	[h:setLight("A5E_Auras",AuraColor + " " + AuraRange,1)]
};{}]

[h:a5e.GroupingInfo = json.set("",
	"EndTriggers",ConditionEndTriggers,
	"Duration",DurationFinal,
	"Names",json.path.read(a5e.Conditions,"\$[*]['Name']"),
	"GroupID",a5e.GroupID
)]

[h:notApplyingConditions = json.isEmpty(json.path.read(a5e.Conditions,"\$[*]['Name']"))]
[h,if(notApplyingConditions),CODE:{
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Conditions Activated",
		"FalseHeader","",
		"FullContents","",
		"RulesContents","All conditions resisted.",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]

	[h:return(0,json.set("","Table",abilityTable,"Conditions","[]","ConditionDisplay","Resisted all conditions"))]
}]

[h,switch(TargetType),CODE:
	case "Token":{
		[h:setProperty("a5e.stat.ConditionList",json.merge(getProperty("a5e.stat.ConditionList"),a5e.Conditions))]
		[h:setProperty("a5e.stat.ConditionGroups",json.append(getProperty("a5e.stat.ConditionGroups"),json.set(a5e.GroupingInfo,"SetBy",ConditionSetBy)))]
	};
	case "Item":{
		[h:TargetItem = json.get(json.path.read(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID == '"+TargetID+"')]"),0)]
		[h:TargetItemConditions = json.get(TargetItem,"ItemConditions")]
		[h:a5e.Conditions = json.path.put(a5e.Conditions,"\$[*]","ItemID",TargetID)]
		[h:TargetItemConditions = json.merge(TargetItemConditions,a5e.Conditions)]
		[h:TargetItem = json.set(TargetItem,"ItemConditions",TargetItemConditions)]
		[h:setProperty("a5e.stat.Inventory",json.path.set(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID == '"+TargetID+"')]",TargetItem))]
	}
]


[h,if(ConditionSetBy!=""),CODE:{
	[h:switchToken(ConditionSetBy)]
	[h:"<!-- New group test needs to be done on SetBy token but not target token because group may have already been created by another target going through this macro. -->"]
	[h:newGroupTest = json.isEmpty(json.path.read(getProperty("a5e.stat.ConditionsSet"),"\$[*][?(@.GroupID=='"+a5e.GroupID+"')]"))]
	[h,if(newGroupTest),CODE:{
		[h:setProperty("a5e.stat.ConditionsSet",json.append(getProperty("a5e.stat.ConditionsSet"),json.set(a5e.GroupingInfo,"Targets",json.append("",TargetData))))]
	};{
		[h:NewTargets = json.append(json.get(json.path.read(getProperty("a5e.stat.ConditionsSet"),"\$[*][?(@.GroupID=='"+a5e.GroupID+"')]['Targets']"),0),TargetData)]
		[h:setProperty("a5e.stat.ConditionsSet",json.path.set(getProperty("a5e.stat.ConditionsSet"),"\$[*][?(@.GroupID=='"+a5e.GroupID+"')]['Targets']",NewTargets))]
	}]
	[h:switchToken(ParentToken)]
};{}]

[h:ConditionsAppliedDisplay = pm.a5e.CreateDisplayList(json.path.read(a5e.Conditions,"\$[*][?(@.IsAssociated!=1 || @.IsAssociated==null)]['DisplayName']","DEFAULT_PATH_LEAF_TO_NULL"),"and")]
[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Condition"+if(json.length(a5e.Conditions)>1,"s","")+" Activated",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",ConditionsAppliedDisplay,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:pm.PassiveFunction("CondGain")]

[h:"<!-- Repeat GatherAbilities to capture newly gained conditions. OldUnifiedAbilities may be used to identify newly gained conditions, though may not be required. -->"]
[h:a5e.OldUnifiedAbilities = a5e.UnifiedAbilities]
[h:a5e.NewUnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:a5e.UnifiedAbilities = json.difference(a5e.NewUnifiedAbilities,a5e.OldUnifiedAbilities)]

[h:pm.PassiveFunction("CondGainThis")]

[h:macro.return = json.set("","Table",abilityTable,"Conditions",a5e.Conditions,"ConditionDisplay",ConditionsAppliedDisplay)]