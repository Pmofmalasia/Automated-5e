[h:OutputData = macro.args]
[h:PlayerOutput = json.get(OutputData,"Player")]
[h:GMOutput = json.get(OutputData,"GM")]
[h:OutputTargets = json.get(OutputData,"OutputTargets")]
[h:MaxColNum = json.get(OutputData,"MaxColNum")]
[h:ParentToken = json.get(OutputData,"ParentToken")]

[h:BorderData = json.get(OutputData,"BorderData")]
[h:DisplayClass = json.get(BorderData,"DisplayClass")]
[h:ColorSubtype = json.get(BorderData,"ColorSubtype")]
[h:defaultBorderColors = pm.a5e.BorderColors(DisplayClass,ColorSubtype,ParentToken)]
[h:DefaultTooltipSettings = data.getData("addon:","pm.a5e.core","TooltipSettings")]

[h:BorderColorOverride = json.get(BorderData,"BorderColorOverride")]
[h:TitleColorOverride = json.get(BorderData,"TitleFontColorOverride")]
[h:AccentBackgroundOverride = json.get(BorderData,"AccentBackgroundOverride")]
[h:AccentTextOverride = json.get(BorderData,"AccentTextOverride")]

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
[h:TooltipPermission = or(isGM(),isOwner(getPlayerName(),ParentToken))]

[h:GMOutput = "<html>"+GMOutput+"</html>"]
[h:PlayerOutput = "<html>"+PlayerOutput+"</html>"]
[h,if(isGM()):
	FinalOutput = GMOutput;
	FinalOutput = PlayerOutput
]

[r,if(isTooltipFrame && TooltipPermission),CODE:{
	[h:html.frame5("Ability Info","lib://pm.a5e.core/TooltipFrame.html?cachelib=false","value="+base64.encode(strformat(FinalOutput))+"; closebutton=0; height=300")]
};{}]

[r,if(isTooltipMouseover && TooltipPermission): strformat(FinalOutput)]