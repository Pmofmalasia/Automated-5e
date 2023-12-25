[h:OutputData = macro.args]
[h:PlayerOutput = json.get(OutputData,"Player")]
[h:GMOutput = json.get(OutputData,"GM")]
[h:OutputTargets = json.get(OutputData,"OutputTargets")]
[h:MaxColNum = json.get(OutputData,"MaxColNum")]
[h:ParentToken = json.get(OutputData,"ParentToken")]

[h:ColorData = json.get(OutputData,"ColorData")]
[h:DisplayClass = json.get(ColorData,"DisplayClass")]
[h:ColorSubtype = json.get(ColorData,"ColorSubtype")]
[h:defaultBorderColors = pm.a5e.BorderColors(DisplayClass,ColorSubtype,ParentToken)]
[h:DefaultTooltipSettings = data.getData("addon:","pm.a5e.core","TooltipSettings")]

[h:BorderColorOverride = json.get(ColorData,"BorderColorOverride")]
[h:TitleColorOverride = json.get(ColorData,"TitleFontColorOverride")]
[h:AccentBackgroundOverride = json.get(ColorData,"AccentBackgroundOverride")]
[h:AccentTextOverride = json.get(ColorData,"AccentTextOverride")]

[h:BorderColor = json.get(defaultBorderColors,"Border")]
[h:TitleColor = json.get(defaultBorderColors,"Title")]

[h:personalizedTooltipSettings = data.getData("addon:","pm.a5e.core","PlayerTooltipSettings")]
[h:player = getPlayerName()]
[h:playerName = pm.RemoveSpecial(player)]
[h,if(json.contains(personalizedTooltipSettings,playerName)):
	finalTooltipSettings = json.merge(DefaultTooltipSettings,json.get(personalizedTooltipSettings,playerName));
	finalTooltipSettings = DefaultTooltipSettings
]

[h:pm.a5e.OutputVariables(finalTooltipSettings,1)]
[h:isTooltipFrame = json.get(finalTooltipSettings,"isTooltipFrame")]
[h:isTooltipMouseover = json.get(finalTooltipSettings,"isTooltipMouseover")]
[h:TooltipPermission = or(isGM(),isOwner())]

[h:GMOutput = "<html>"+GMOutput+"</html>"]
[h:PlayerOutput = "<html>"+PlayerOutput+"</html>"]

[h:broadcast(strformat(GMOutput))]

[r,frame5("Ability Info"):{[r:strformat(GMOutput)]}]
[h:return(0)]

[h:'<html>'+'</html>']

[r,if(isTooltipFrame && TooltipPermission),CODE:{
	[r,if(isGM()),CODE:{
		[r,frame5("Ability Info"):{[r:strformat(GMOutput)]}]
	};{
		[r,frame5("Ability Info"):{[r:strformat(PlayerOutput)]}]
	}]
};{}]

[r,if(isTooltipMouseover && TooltipPermission),CODE:{
	[r,if(isGM()),CODE:{
		[r:strformat('<html>'+GMOutput+'</html>')]
	};{
		[r:strformat('<html>'+PlayerOutput+'</html>')]
	}]
};{}]