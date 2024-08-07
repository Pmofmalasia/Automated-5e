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
[h:DefaultChatSettings = data.getData("addon:","pm.a5e.core","ChatSettings")]

[h:BorderColorOverride = json.get(BorderData,"BorderColorOverride")]
[h:TitleColorOverride = json.get(BorderData,"TitleFontColorOverride")]
[h:AccentBackgroundOverride = json.get(BorderData,"AccentBackgroundOverride")]
[h:AccentTextOverride = json.get(BorderData,"AccentTextOverride")]

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
			case "gm": addedTargets = "[]";
			case "not-gm": addedTargets = allPlayers;
			case "self": addedTargets = json.append("",getPlayerName());
			case "gm-self": addedTargets = json.append("",getPlayerName());
			case "all": addedTargets = allPlayers;
			case "none": addedTargets = "[]";
			case "not-self": addedTargets = json.difference(allPlayers,getPlayerName());
			case "not-gm-self": addedTargets = json.difference(allPlayers,getPlayerName());
			default: addedTargets = json.append("",target)
		]

		[h:finalPlayersList = json.merge(finalPlayersList,addedTargets)]
	}]
	[h,if(0),CODE:{
		[h:allGMs = json.path.read(player.getConnectedPlayers(),"\$[*][?(@.role == 'GM')]['name']")]
		[h:finalPlayersList = json.union(finalPlayersList,allGMs)]		
	}]
}]
[h:personalizedChatSettings = data.getData("addon:","pm.a5e.core","PlayerChatSettings")]

[h,if(ParentToken != ""): switchToken(ParentToken)]
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

[h:"<!-- TODO: Bugfix MT: Remove the below code and remove the above from if(0) if/when player.getConnectedPlayers() is fixed -->"]
[h:excludedPlayersList = json.difference(allPlayers,finalPlayersList)]
[h,foreach(player,excludedPlayersList),if(isGM(player)),CODE:{
	[h:playerName = pm.RemoveSpecial(player)]
	[h,if(json.contains(personalizedChatSettings,playerName)):
		finalChatSettings = json.merge(DefaultChatSettings,json.get(personalizedChatSettings,playerName));
		finalChatSettings = DefaultChatSettings
	]

	[h:pm.a5e.OutputVariables(finalChatSettings,0)]

	[h:broadcastAsToken(strformat(GMOutput),player)]
}]