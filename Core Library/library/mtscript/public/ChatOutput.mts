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
[h:DefaultChatSettings = data.getData("addon:","pm.a5e.core","ChatSettings")]

[h:BorderColorOverride = json.get(ColorData,"BorderColorOverride")]
[h:TitleColorOverride = json.get(ColorData,"TitleFontColorOverride")]
[h:AccentBackgroundOverride = json.get(ColorData,"AccentBackgroundOverride")]
[h:AccentTextOverride = json.get(ColorData,"AccentTextOverride")]

[h:BorderColor = json.get(defaultBorderColors,"Border")]
[h:TitleColor = json.get(defaultBorderColors,"Title")]

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

	[h:pm.a5e.OutputVariables(finalChatSettings,0)]

	[h,if(isGM(player)):
		broadcastAsToken(strformat(GMOutput),player);
		broadcastAsToken(strformat(PlayerOutput),player)
	]
}]