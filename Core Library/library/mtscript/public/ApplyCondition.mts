[h:a5e.ConditionsTemp = json.get(macro.args,"Conditions")]
[h:a5e.EndConditionInfo = json.get(macro.args,"EndInfo")]
[h:a5e.GroupID = json.get(macro.args,"GroupID")]
[h:ParentToken = if(json.get(macro.args,"Target")=="",currentToken(),json.get(macro.args,"Target"))]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "ApplyCondition"]
[h:ConditionSetBy = json.get(macro.args,"SetBy")]
[h:abilityTable = "[]"]

[h:ConditionDuration = json.get(a5e.EndConditionInfo,"Duration")]
[h:ConditionDurationUnits = json.get(a5e.EndConditionInfo,"DurationUnits")]
[h:ConditionAdvancePoint = json.get(a5e.EndConditionInfo,"AdvancePoint")]
[h:ConditionAuraRange = json.get(a5e.EndConditionInfo,"AuraRange")]
[h:ConditionAuraUnits = json.get(a5e.EndConditionInfo,"AuraUnits")]
[h:ConditionEndTriggers = json.get(a5e.EndConditionInfo,"EndTriggers")]

[h:DurationBase = json.set("","year",0,"day",0,"hour",0,"minute",0,"round",0)]
[h:DurationFinal = json.set(DurationBase,ConditionDurationUnits,ConditionDuration,"AdvancePoint",ConditionAdvancePoint)]
[h:"<!-- The purpose of looping here is to catch any chain reactions - e.g. Condition A is associated with Condition B, which in turn is associated with Condition C. -->"]
[h:a5e.Conditions = a5e.ConditionsTemp]
[h:FirstLoopTest = 1]

[h,while(!json.equals(a5e.Conditions,a5e.ConditionsTemp) || FirstLoopTest),CODE:{
	[h:a5e.Conditions = a5e.ConditionsTemp]
	[h:FirstLoopTest = 0]
	[h:AssociatedConditionNamesTemp = json.path.read(a5e.ConditionsTemp,"[*]['AssociatedConditions']")]
	[h:AssociatedConditionNames = "[]"]
	[h,foreach(condition,AssociatedConditionNamesTemp): AssociatedConditionNames = json.merge(AssociatedConditionNames,condition)]
	[h:AssociatedConditionNames = json.difference(AssociatedConditionNames,json.path.read(a5e.ConditionsTemp,"[*]['Name']"))]
	[h:AssociatedConditionsFinal = json.path.put(json.path.read(getLibProperty("sb.Conditions","Lib:pm.a5e.Core"),"[*][?(@.Name in "+AssociatedConditionNames+" && @.Class=='Condition')]"),"[*]","IsAssociated",1)]
	
	[h:pm.PassiveFunction("ChangeCondGain")]
	
	[h:a5e.ConditionsTemp = json.merge(a5e.Conditions,AssociatedConditionsFinal)]
}]

[h:a5e.Conditions = json.path.put(a5e.Conditions,"[*]","Duration",DurationFinal)]
[h:a5e.Conditions = json.path.put(a5e.Conditions,"[*]","SetBy",ConditionSetBy)]
[h:a5e.Conditions = json.path.put(a5e.Conditions,"[*]","GroupID",a5e.GroupID)]
[h:a5e.Conditions = json.path.put(a5e.Conditions,"[*]","IsActive",1)]

[h,foreach(condition,a5e.Conditions),CODE:{
	[h:StateExistsTest = !json.isEmpty(json.path.read(getInfo("campaign"),"states.*.[?(@.name=='"+json.get(condition,"Name")+"')]"))]
	[h,if(StateExistsTest),CODE:{
		[h,if(json.get(condition,"IsAssociated")!=1):setState(json.get(condition,"Name"),1)]
	};{
		[h,if(json.get(condition,"BackupState")!="" && json.get(condition,"IsAssociated")!=1): setState(json.get(condition,"BackupState"),1)]
	}]
}]

[h:a5e.GroupingInfo = json.set("",
	"EndTriggers",ConditionEndTriggers,
	"Duration",DurationFinal,
	"Names",json.path.read(a5e.Conditions,"[*]['Name']"),
	"GroupID",a5e.GroupID,
	"Duration",DurationFinal	
)]

[h:ConditionList = json.merge(ConditionList,a5e.Conditions)]
[h:ConditionGroups = json.append(ConditionGroups,json.set(a5e.GroupingInfo,"SetBy",ConditionSetBy))]

[h:switchToken(ConditionSetBy)]
[h:"<!-- New group test needs to be done on SetBy token but not target token because group may have already been created by another target going through this macro. -->"]
[h:newGroupTest = json.isEmpty(json.path.read(ConditionsSet,"[*][?(@.GroupID=="+a5e.GroupID+")]"))]
[h,if(newGroupTest),CODE:{
	[h:ConditionsSet = json.append(ConditionsSet,json.set(a5e.GroupingInfo,"Targets",json.append("",ParentToken)))]
};{
	[h:NewTargets = json.append(json.get(json.path.read(ConditionsSet,"[*][?(@.GroupID=="+a5e.GroupID+")]"),0),ParentToken)]
	[h:ConditionsSet = json.path.set(ConditionsSet,"[*][?(@.GroupID=="+a5e.GroupID+")]",NewTargets)]
}]
[h:switchToken(ParentToken)]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Condition"+if(json.length(a5e.Conditions)>1,"s","")+" Activated",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",json.toList(json.path.read(a5e.Conditions,"[*]['DisplayName']"),", "),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:pm.PassiveFunction("CondGain")]

[h:macro.return = json.set("","Table",abilityTable)]