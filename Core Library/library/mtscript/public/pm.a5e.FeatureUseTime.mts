[h:pm.UsageTimeNum = arg(1)]
[h:pm.UsageTimeUnits = arg(2)]
[h,if(argCount()>3): pm.ReactCondition=", "+arg(3); pm.ReactCondition=""]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:usageTableData = json.set("","ShowIfCondensed",0,"Header","Usage Time","FalseHeader","","FullContents","","RulesContents",pm.UsageTimeNum+" "+pm.UsageTimeUnits+pm.ReactCondition,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",pm.UsageTimeNum,"Units",pm.UsageTimeUnits)]

[h,if(getState("ReactionUsed") && pm.UsageTimeUnits=="Reaction"),CODE:{
	[h:usageTableData = json.set(usageTableData,"Error","You have already used your reaction!")]
};{
	[h,if(IsTooltip==0 && pm.UsageTimeUnits=="Reaction"): setState("ReactionUsed",1)]
}]

[h:abilityTable = json.append(abilityTable,usageTableData)]