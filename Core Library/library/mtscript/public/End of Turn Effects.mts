[h:ParentToken = macro.args]
[h:switchToken(ParentToken)]
[h:IsTooltip = 0]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "EndTurn"]

[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header","End of "+token.name+"'s Turn",
	"FalseHeader","",
	"FullContents","",
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]
		
[h:pm.PassiveFunction("EndTurn")]

[h:validAbilities = json.path.read(allAbilities,"[*][?(@.Duration.AdvancePoint=='EndofTurn')]")]
[h,foreach(ability,validAbilities): allAbilities = json.path.set(allAbilities,"[*][?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"')]['Duration']",pm.a5e.AdvanceTime(json.set("","Ability",ability,"Time",1,"TimeUnits","round","ParentToken",ParentToken)))]

[h:validConditions = json.path.read(ConditionGroups,"[*][?(@.Duration.AdvancePoint=='EndofTurn')]")]
[h,foreach(condition,validConditions),CODE:{
	[h:newDuration = pm.a5e.AdvanceTime(json.set("","Ability",condition,"Time",1,"TimeUnits","round","ParentToken",ParentToken))]
	[h:ConditionGroups = json.path.set(ConditionGroups,"[*][?(@.GroupID=="+json.get(condition,"GroupID")+")]['Duration']",newDuration)]
	[h:ConditionList = json.path.set(ConditionList,"[*][?(@.GroupID=="+json.get(condition,"GroupID")+")]['Duration']",newDuration)]
}]

[h:pm.ConditionsExpired = json.unique(json.path.read(ConditionList,"[*][?(@.Duration.Expired==1)]['GroupID']"))]
[h,if(json.isEmpty(pm.ConditionsExpired)),CODE:{};{
	[h,MACRO("EndCondition@Lib:pm.a5e.Core"): json.set("","GroupID",pm.ConditionsExpired,"ParentToken",ParentToken)]
	[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
}]

[h:targetsAffected = ""]
[h:validConditionsSet = json.path.read(ConditionsSet,"[*][?(@.Duration.AdvancePoint=='EndofSetByTurn')]")]
[h,foreach(condition,validConditionsSet),CODE:{
	[h:newDuration = pm.a5e.AdvanceTime(json.set("","Ability",condition,"Time",1,"TimeUnits","round","ParentToken",ParentToken))]
	[h:thisGroupID = json.get(condition,"GroupID")]
	[h:ConditionsSet = json.path.set(ConditionsSet,"[*][?(@.GroupID=="+thisGroupID+")]['Duration']",newDuration)]
	[h,foreach(target,json.get(condition,"Targets")),CODE:{
		[h:switchToken(target)]
		[h:ConditionGroups = json.path.set(ConditionGroups,"[*][?(@.GroupID=="+thisGroupID+")]['Duration']",newDuration)]
		[h:ConditionList = json.path.set(ConditionList,"[*][?(@.GroupID=="+thisGroupID+")]['Duration']",newDuration)]
		[h:targetsAffected = json.append(targetsAffected,target)]
	}]
	[h:switchToken(ParentToken)]
}]

[h:setConditionsRemoved = "[]"]
[h:targetsAffected = json.unique(targetsAffected)]
[h,foreach(target,targetsAffected),CODE:{
	[h:switchToken(target)]
	[h:pm.ConditionsExpired = json.unique(json.path.read(ConditionList,"[*][?(@.Duration.Expired==1)]['GroupID']"))]
	[h,if(json.isEmpty(pm.ConditionsExpired)),CODE:{};{
		[h,MACRO("EndCondition@Lib:pm.a5e.Core"): json.set("","GroupID",pm.ConditionsExpired,"ParentToken",target)]
		[h:setConditionsRemoved = json.merge(setConditionsRemoved,json.get(macro.return,"Removed"))]
	}]
}]

[h:setConditionsRemoved = json.unique(json.path.read(setConditionsRemoved,"[*]['DisplayName']"))]
[h,if(!json.isEmpty(setConditionsRemoved)): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Conditions on Targets Ending",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",json.toList(setConditionsRemoved,", "),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:setState("Initiative", 0)]
[h:macro.return = abilityTable]