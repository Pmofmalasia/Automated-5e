[h:OutputData = macro.args]
[h:PlayerOutput = json.get(OutputData,"Player")]
[h:GMOutput = json.get(OutputData,"GM")]
[h:OutputTargets = json.get(OutputData,"OutputTargets")]
[h:MaxColNum = json.get(OutputData,"MaxColNum")]

[h:ColorData = json.get(OutputData,"ColorData")]
[h:defaultBorderColors = pm.a5e.DefaultColors(ColorData)]
[h:DefaultChatSettings = data.getData("addon:","pm.a5e.core","ChatSettings")]

[h:BorderColorOverride = json.get(ColorData,"BorderColorOverride")]
[h:TitleColorOverride = json.get(ColorData,"TitleFontColorOverride")]
[h:AccentBackgroundOverride = json.get(ColorData,"AccentBackgroundOverride")]
[h:AccentTextOverride = json.get(ColorData,"AccentTextOverride")]

[h:BorderColor = json.get(defaultBorderColors,"BorderColor")]
[h:TitleColor = json.get(defaultBorderColors,"TitleColor")]

[h:allPlayers = getAllPlayerNames("json")]
[h,if(OutputTargets == ""),CODE:{
	[h:finalPlayersList = allPlayers]
};{
	[h,if(json.type(OutputTargets) == "UNKNOWN"): OutputTargets = json.append("",OutputTargets)]
	[h:finalPlayersList = "[]"]
	[h,foreach(target,OutputTargets),CODE:{
		[h,switch(target):
			"gm": addedTargets = "[]";
			"not-gm": addedTargets = ;
			"self": addedTargets = json.append("",getPlayerName());
			"gm-self": addedTargets = json.append("",getPlayerName());
			"all": addedTargets = allPlayers;
			"none": addedTargets = "[]";
			"not-self": addedTargets = json.difference(allPlayers,getPlayerName());
			"not-gm-self": addedTargets = json.difference(allPlayers,getPlayerName());
			default: addedTargets = json.append("",target)
		]

		[h:finalPlayersList = json.merge(finalPlayersList,addedTargets)]
	}]
	[h:allGMs = json.path.read(player.getConnectedPlayers(),"\$[*][?(@.role == 'GM')]['name']")]
	[h:finalPlayersList = json.union(finalPlayersList,allGMs)]
}]
[h:personalizedChatSettings = data.getData("addon:","pm.a5e.core","PlayerChatSettings")]
[h,foreach(player,finalPlayersList),CODE:{
	[h:playerName = pm.RemoveSpecial(player)]
	[h,if(json.contains(personalizedChatSettings,playerName)):
		finalChatSettings = json.merge(DefaultChatSettings,json.get(personalizedChatSettings,playerName));
		finalChatSettings = DefaultChatSettings
	]
	[h:isVertical = json.get(finalChatSettings,"VerticalDisplay")]
	[h:isDarkMode = json.get(finalChatSettings,"DarkMode")]
	[h:TitleFont = json.get(finalChatSettings,"TitleFont")]
	[h:BodyFont = json.get(finalChatSettings,"BodyFont")]

	[h:finalChatColors = json.get(finalChatSettings,"ChatColors")]
	[h:BackgroundColor = if(isDarkMode,json.get(finalChatColors,'DarkBackground'),json.get(finalChatColors,'LightBackground'))]
	[h:BackgroundTextColor = if(isDarkMode,json.get(finalChatColors,'DarkText'),json.get(finalChatColors,'LightText'))]
	[h:AccentBackground = if(isDarkMode,json.get(finalChatColors,"DarkAccentBackground"),json.get(finalChatColors,"LightAccentBackground"))]
	[h:AccentText = if(isDarkMode,json.get(finalChatColors,"DarkAccentText"),json.get(finalChatColors,"LightAccentText"))]

	[h:AccentFormat = "text-align:center; background-color:"+AccentBackground+"; color:"+AccentText+";" + if(isVertical,"width:100%"," width:20%;")]
	[h:VerticalFormat=if(isVertical,"</th></tr><tr style='text-align:center;'><td style='","</th><td style='padding-left:4px; valign:middle;")]
	[h:VerticalFormatFinalBonus=if(isVertical,"</td></tr><tr style='text-align:center;'><td style='","</td><td style='padding-left:4px; valign:middle; text-align:right")]
	[h:ColNumFormat = if(isVertical,"; colspan='"+MaxColNum+"'","")]
	[h:VerticalListFormat = if(isVertical,"<br>",", ")]

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