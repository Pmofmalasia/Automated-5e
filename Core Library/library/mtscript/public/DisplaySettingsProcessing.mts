[h:SettingsData = macro.args]
[h:ParentToken = json.get(SettingsData,"ParentToken")]
[h:SettingsDestination = json.get(SettingsData,"SettingsDestination")]

[h,if(json.contains(SettingsData,"isResetToDefault")),CODE:{
	[h,switch(SettingsDestination),CODE:
		case "Chat":{
			[h:data.setData("addon:","pm.a5e.core","ChatSettings",data.getData("addon:","pm.a5e.core","DefaultChatSettings"))]
			[h:isTooltip = 0]
			[h:broadcast("Chat settings reset to defaults.")]
		};
		case "PersonalChat":{
			[h:PlayerDisplayName = getPlayerName()]
			[h:PlayerName = pm.RemoveSpecial(PlayerDisplayName)]
			[h:data.setData("addon:","pm.a5e.core","PlayerChatSettings",json.remove(data.getData("addon:","pm.a5e.core","PlayerChatSettings"),PlayerName))]
			[h:isTooltip = 0]

			[h:broadcast("Personalized chat settings for "+PlayerDisplayName+" reset to defaults.")]
		};
		case "Tooltip":{
			[h:data.setData("addon:","pm.a5e.core","TooltipSettings",data.getData("addon:","pm.a5e.core","DefaultTooltipSettings"))]
			[h:isTooltip = 1]
			[h:broadcast("Tooltip settings reset to defaults.")]
		};
		case "PersonalTooltip":{
			[h:PlayerDisplayName = getPlayerName()]
			[h:PlayerName = pm.RemoveSpecial(PlayerDisplayName)]
			[h:data.setData("addon:","pm.a5e.core","PlayerTooltipSettings",json.remove(data.getData("addon:","pm.a5e.core","PlayerTooltipSettings"),PlayerName))]
			[h:isTooltip = 1]

			[h:broadcast("Personalized chat settings for "+PlayerDisplayName+" reset to defaults.")]
		}
	]
};{
	[h:dataWithBorderColors = data.getData("addon:","pm.a5e.core","ChatSettings")]
	[h:thisPlayerChatColors = json.set("",
		"DarkBackground",json.get(SettingsData,"DarkBackground"),
		"DarkText",json.get(SettingsData,"DarkText"),
		"DarkAccentBackground",json.get(SettingsData,"DarkAccentBackground"),
		"DarkAccentText",json.get(SettingsData,"DarkAccentText"),
		"DarkDamageText",json.get(SettingsData,"DarkDamageText"),
		"DarkHealingText",json.get(SettingsData,"DarkHealingText"),
		"DarkCritText",json.get(SettingsData,"DarkCritText"),
		"DarkCritFailText",json.get(SettingsData,"DarkCritFailText"),
		"DarkLinkColor",json.get(SettingsData,"DarkLinkColor"),
		"LightBackground",json.get(SettingsData,"LightBackground"),
		"LightText",json.get(SettingsData,"LightText"),
		"LightAccentBackground",json.get(SettingsData,"LightAccentBackground"),
		"LightAccentText",json.get(SettingsData,"LightAccentText"),
		"LightDamageText",json.get(SettingsData,"LightDamageText"),
		"LightHealingText",json.get(SettingsData,"LightHealingText"),
		"LightCritText",json.get(SettingsData,"LightCritText"),
		"LightCritFailText",json.get(SettingsData,"LightCritFailText"),
		"LightLinkColor",json.get(SettingsData,"LightLinkColor")
	)]
	[h:thisPlayerChatSettings = json.set(dataWithBorderColors,
		"DisplaySize",json.get(SettingsData,"DisplaySize"),
		"VerticalDisplay",json.contains(SettingsData,"isVertical"),
		"DarkMode",json.contains(SettingsData,"DarkMode"),
		"UseWidth",json.get(SettingsData,"UseWidth"),
		"ChatColors",thisPlayerChatColors,
		"BodyFont",json.get(SettingsData,"BodyFont"),
		"TitleFont",json.get(SettingsData,"TitleFont")
	)]

	[h,switch(SettingsDestination),CODE:
		case "Chat":{
			[h:data.setData("addon:","pm.a5e.core","ChatSettings",thisPlayerChatSettings)]
			[h:broadcast("Chat settings updated.")]
		};
		case "PersonalChat":{
			[h:PlayerDisplayName = getPlayerName()]
			[h:PlayerName = pm.RemoveSpecial(PlayerDisplayName)]
			[h:allPlayerChatSettings = data.getData("addon:","pm.a5e.core","PlayerChatSettings")]
			[h:allPlayerChatSettings = json.set(allPlayerChatSettings,PlayerName,thisPlayerChatSettings)]
			[h:data.setData("addon:","pm.a5e.core","PlayerChatSettings",allPlayerChatSettings)]

			[h:broadcast("Personalized chat settings for "+PlayerDisplayName+" updated.")]
		};
		case "Tooltip":{
			[h:thisPlayerChatSettings = json.set(thisPlayerChatSettings,
				"isTooltipFrame",json.contains(SettingsData,"isTooltipFrame"),
				"isTooltipMouseover",json.contains(SettingsData,"isTooltipMouseover")
			)]
			[h:data.setData("addon:","pm.a5e.core","TooltipSettings",thisPlayerChatSettings)]
			[h:broadcast("Tooltip settings updated.")]
		};
		case "PersonalTooltip":{
			[h:thisPlayerChatSettings = json.set(thisPlayerChatSettings,
				"isTooltipFrame",json.contains(SettingsData,"isTooltipFrame"),
				"isTooltipMouseover",json.contains(SettingsData,"isTooltipMouseover")
			)]
			[h:PlayerDisplayName = getPlayerName()]
			[h:PlayerName = pm.RemoveSpecial(PlayerDisplayName)]
			[h:allPlayerChatSettings = data.getData("addon:","pm.a5e.core","PlayerTooltipSettings")]
			[h:allPlayerChatSettings = json.set(allPlayerChatSettings,PlayerName,thisPlayerChatSettings)]
			[h:data.setData("addon:","pm.a5e.core","PlayerTooltipSettings",allPlayerChatSettings)]
			
			[h:broadcast("Personalized tooltip settings for "+PlayerDisplayName+" updated.")]
		}
	]
}]
[h:closeDialog("DisplaySettings")]