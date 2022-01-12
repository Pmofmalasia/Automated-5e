[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:pm.UsageTimeNum=arg(1)]
[h:pm.UsageTimeUnits=arg(2)]

[h,if(argCount()==4),CODE:{
	[h:pm.ReactCondition=", "+arg(3)]
};{
	[h:pm.ReactCondition=""]
}]

[h,if(getState("ReactionUsed") && pm.UsageTimeUnits=="Reaction"),CODE:{
	[h:pm.ReactAlert = " Note: You have already used your reaction!"]
};{
	[h:pm.ReactAlert = ""]
	[h,if(pm.Tooltip==0 && pm.UsageTimeUnits=="Reaction"): setState("ReactionUsed",1)]
}]

[h:macro.return = json.set("","ShowIfCondensed",0,"Header","Usage Time","FalseHeader","","FullContents","","RulesContents",pm.UsageTimeNum+" "+pm.UsageTimeUnits+pm.ReactCondition+pm.ReactAlert,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",pm.UsageTimeNum,"Units",pm.UsageTimeUnits)]