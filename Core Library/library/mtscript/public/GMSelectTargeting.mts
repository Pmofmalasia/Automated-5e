[h:AllTargetingData = macro.args]

[h,if(isGM()),CODE:{
	[h,MACRO("MixedTypeTargeting@Lib:pm.a5e.Core"): AllTargetingData]
	[h:return(0,macro.return)]
};{
	[h:currentPlayer = getPlayerName()]
	[h:data.setData("addon:","pm.a5e.core","gd.GMTargetingChoices","[]")]
	[h:execFunction("pm.a5e.SetGMTargets",json.append("",AllTargetingData),0,"gm")]

	[h:abort(input(
		" junkVar | Wait for your GM to choose the targets, then press OK. | | LABEL | SPAN=TRUE "
	))]
	[h:GMTargetingChoices = data.getData("addon:","pm.a5e.core","gd.GMTargetingChoices")]
	[h:data.setData("addon:","pm.a5e.core","gd.GMTargetingChoices","[]")]
	[h:return(0,GMTargetingChoices)]
}]