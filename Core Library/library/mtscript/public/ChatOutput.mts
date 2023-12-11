[h:OutputData = macro.args]
[h:PlayerOutput = json.get(OutputData,"Player")]
[h:GMOutput = json.get(OutputData,"GM")]
[h:MaxColNum = json.get(OutputData,"MaxColNum")]

[h:ColorData = json.get(OutputData,"ColorData")]
[h:defaultBorderColors = pm.a5e.DefaultColors(ColorData)]
[h:DefaultChatSettings = data.getData("addon","pm.a5e.core","ChatSettings")]

[h:BorderColorOverride = json.get(ColorData,"BorderColorOverride")]
[h:TitleColorOverride = json.get(ColorData,"TitleFontColorOverride")]
[h:AccentBackgroundOverride = json.get(ColorData,"AccentBackgroundOverride")]
[h:AccentTextOverride = json.get(ColorData,"AccentTextOverride")]

[h:BorderColor = json.get(defaultBorderColors,"BorderColor")]
[h:TitleColor = json.get(defaultBorderColors,"TitleColor")]

[h:allPlayers = getAllPlayerNames("json")]
[h,if(0): personalizedChatSettings = data.getData("addon:","pm.a5e.core","PlayerChatSettings")]
[h,foreach(player,allPlayers),CODE:{
	[h,if(json.contains(personalizedChatSettings,player)):
		finalChatSettings = json.merge(defaultChatSettings,json.get(personalizedChatSettings,player));
		finalChatSettings = defaultChatSettings
	]
	[h:isVertical = json.get(finalChatSettings,"VerticalDisplay")]
	[h:isDarkMode = json.get(finalChatSettings,"DarkMode")]
	[h:TitleFont = json.get(finalChatSettings,"TitleFont")]
	[h:BodyFont = json.get(finalChatSettings,"BodyFont")]

	[h:BackgroundColor = if(isDarkMode,json.get(finalChatSettings,'DarkBackground'),json.get(finalChatSettings,'LightBackground'))]
	[h:BackgroundTextColor = if(isDarkMode,json.get(finalChatSettings,'DarkText'),json.get(finalChatSettings,'LightText'))]
	[h:AccentBackground = if(isDarkMode,json.get(finalChatSettings,"DarkAccentBackground"),json.get(finalChatSettings,"LightAccentBackground"))]
	[h:AccentText = if(isDarkMode,json.get(finalChatSettings,"DarkAccentText"),json.get(finalChatSettings,"LightAccentText"))]

	[h:AccentFormat = "text-align:center; background-color:"+AccentBackground+"; color:"+AccentText+";" + if(isVertical,"width:100%"," width:20%;")]
	[h:VerticalFormat=if(isVertical,"</th></tr><tr style='text-align:center;'><td style='","</th><td style='padding-left:4px; valign:middle;")]
	[h:VerticalFormatFinalBonus=if(isVertical,"</td></tr><tr style='text-align:center;'><td style='","</td><td style='padding-left:4px; valign:middle; text-align:right")]
	[h:ColNumFormat = if(isVertical,"; colspan='"+MaxColNum+"'","")]

	[h:"<!-- Note: switch is used here because in the past there were options to limit to max-width as well (doesn't work with this version of CSS though). Leaving it for the future in case options are reintroduced. -->"]
	[h,switch(json.get(finalChatSettings,"UseWidth")):
		case 0: TableWidth = "width:"+string(json.get(finalChatSettings,"DisplaySize"))+"px;";
		case 1: TableWidth = ""
	]
	[h:TableFormat='padding:3px; '+if(isVertical,"width:100%",TableWidth)]

	[h,if(isGM(player)):
		broadcastAsToken(strformat(GMOutput),player);
		broadcastAsToken(strformat(PlayerOutput),player)
	]
}]