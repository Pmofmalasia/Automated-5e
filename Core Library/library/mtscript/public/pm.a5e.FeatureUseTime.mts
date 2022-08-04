[h:pm.UsageTimeNum = arg(1)]
[h:pm.UsageTimeUnits = arg(2)]
[h,if(argCount()>3): pm.ReactCondition=", "+arg(3); pm.ReactCondition=""]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:usageTableData = json.set("","ShowIfCondensed",0,"Header","Usage Time","FalseHeader","","FullContents","","RulesContents",pm.UsageTimeNum+" "+pm.UsageTimeUnits+pm.ReactCondition,"RollContents","","DisplayOrder","['Rules','Roll','Full']")]

[h:pm.UsageTimeUnits = pm.StandardDuration(pm.UsageTimeUnits)]
[h,if(getState("ReactionUsed") && pm.UsageTimeUnits=="reaction"),CODE:{
	[h:usageTableData = json.set(usageTableData,"Error","You have already used your reaction!")]
};{
	[h,if(IsTooltip==0 && pm.UsageTimeUnits=="reaction"): setState("ReactionUsed",1)]
}]

[h:abilityTable = json.append(abilityTable,usageTableData)]

[h:return(!IsTooltip)]
	
[h:effectsToMerge = json.append("",json.set("","UseTime",json.set("","Value",pm.UsageTimeNum,"Units",pm.UsageTimeUnits)))]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

[h:pm.a5e.EffectData = macro.return]