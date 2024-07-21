[h:StartorEnd = arg(0)]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header",StartorEnd+" of "+token.name+"'s Turn",
	"FalseHeader","",
	"FullContents","",
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:pm.PassiveFunction(StartorEnd+"Turn")]
[h:effectsToMerge = "[]"]

[h:validAbilities = json.path.read(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.Duration.AdvancePoint=='"+StartorEnd+"ofTurn')]")]
[h,foreach(ability,validAbilities): setProperty("a5e.stat.AllFeatures",json.path.set(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"')]['Duration']",pm.a5e.AdvanceTime(json.set("","Duration",json.get(ability,"Duration"),"Time",1,"TimeUnits","round","ParentToken",ParentToken))))]

[h:validConditions = json.path.read(getProperty("a5e.stat.ConditionGroups"),"\$[*][?(@.Duration.AdvancePoint=='"+StartorEnd+"ofTurn')]")]
[h,foreach(condition,validConditions),CODE:{
	[h:newDuration = pm.a5e.AdvanceTime(json.set("","Duration",json.get(condition,"Duration"),"Time",1,"TimeUnits","round","ParentToken",ParentToken))]
	[h:setProperty("a5e.stat.ConditionGroups",json.path.set(getProperty("a5e.stat.ConditionGroups"),"\$[*][?(@.GroupID=='"+json.get(condition,"GroupID")+"')]['Duration']",newDuration))]
	[h:setProperty("a5e.stat.ConditionList",json.path.set(getProperty("a5e.stat.ConditionList"),"\$[*][?(@.GroupID=='"+json.get(condition,"GroupID")+"')]['Duration']",newDuration))]
}]

[h:pm.ConditionsExpired = json.unique(json.path.read(getProperty("a5e.stat.ConditionList"),"\$[*][?(@.Duration.Expired==1)]['GroupID']"))]
[h:conditionsRemovedTurnChange = pm.a5e.TriggerConditionEnd(StartorEnd+"Turn",ParentToken)]
[h:condition = json.get(conditionsRemovedTurnChange,"Removed")]
[h:abilityTable = json.merge(abilityTable,json.get(conditionsRemovedTurnChange,"Table"))]
[h:conditionEndEffects = json.get(conditionsRemovedTurnChange,"Effects")]
[h:effectsToMerge = json.merge(effectsToMerge,conditionEndEffects)]

[h,if(json.isEmpty(pm.ConditionsExpired)),CODE:{};{
	[h,MACRO("EndCondition@Lib:pm.a5e.Core"): json.set("","GroupID",pm.ConditionsExpired,"Target",ParentToken)]
	[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
}]

[h:targetsAffected = ""]
[h:validConditionsSet = json.path.read(getProperty("a5e.stat.ConditionsSet"),"\$[*][?(@.Duration.AdvancePoint=='"+StartorEnd+"ofSetByTurn')]")]
[h,foreach(condition,validConditionsSet),CODE:{
	[h:newDuration = pm.a5e.AdvanceTime(json.set("","Duration",json.get(condition,"Duration"),"Time",1,"TimeUnits","round","ParentToken",ParentToken))]
	[h:thisGroupID = json.get(condition,"GroupID")]
	[h:setProperty("a5e.stat.ConditionsSet",json.path.set(getProperty("a5e.stat.ConditionsSet"),"\$[*][?(@.GroupID=='"+thisGroupID+"')]['Duration']",newDuration))]
	[h,foreach(target,json.get(condition,"Targets")),CODE:{
		[h:switchToken(target)]
		[h:setProperty("a5e.stat.ConditionGroups",json.path.set(getProperty("a5e.stat.ConditionGroups"),"\$[*][?(@.GroupID=='"+thisGroupID+"')]['Duration']",newDuration))]
		[h:setProperty("a5e.stat.ConditionList",json.path.set(getProperty("a5e.stat.ConditionList"),"\$[*][?(@.GroupID=='"+thisGroupID+"')]['Duration']",newDuration))]
		[h:targetsAffected = json.append(targetsAffected,target)]
	}]
	[h:switchToken(ParentToken)]

	[h:"<!-- TODO: Will need to add the ability to cause saves here as well - unsure how atm -->"]
}]

[h:setConditionsRemoved = "[]"]
[h:targetsAffected = json.unique(targetsAffected)]
[h,foreach(target,targetsAffected),CODE:{
	[h:switchToken(target)]
	[h:pm.ConditionsExpired = json.unique(json.path.read(getProperty("a5e.stat.ConditionList"),"\$[*][?(@.Duration.Expired==1)]['GroupID']"))]
	[h,if(json.isEmpty(pm.ConditionsExpired)),CODE:{};{
		[h,MACRO("EndCondition@Lib:pm.a5e.Core"): json.set("","GroupID",pm.ConditionsExpired,"Target",target)]
		[h:setConditionsRemoved = json.merge(setConditionsRemoved,json.get(macro.return,"Removed"))]
	}]
}]

[h:setConditionsRemoved = json.unique(json.path.read(setConditionsRemoved,"\$[*]['DisplayName']"))]
[h,if(!json.isEmpty(setConditionsRemoved)): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Conditions on Other Creatures Ending",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",pm.a5e.CreateDisplayList(setConditionsRemoved),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",json.length(pm.a5e.EffectData))]
[h:pm.a5e.EffectData = macro.return]
[h,if(!json.isEmpty(pm.a5e.EffectData)): data.setData("addon:","pm.a5e.core","gd.Effects",json.merge(data.getData("addon:","pm.a5e.core","gd.Effects"),pm.a5e.EffectData))]
[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]