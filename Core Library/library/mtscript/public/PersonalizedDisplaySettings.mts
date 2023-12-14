[h:choice.TitleFont=""]
[h:choice.BodyFont=""]
[h:allPlayerChatSettings = data.getData("addon:","pm.a5e.core","PlayerChatSettings")]
[h:PlayerDisplayName = getPlayerName()]
[h:PlayerName = pm.RemoveSpecial(PlayerDisplayName)]
[h:thisPlayerChatSettings = json.get(allPlayerChatSettings,PlayerName)]
[h,if(thisPlayerChatSettings == ""):
	thisPlayerChatColors = "{}";
	thisPlayerChatColors = json.get(thisPlayerChatSettings,"ChatColors")
]
[h,if(thisPlayerChatSettings == ""): thisPlayerChatSettings = "{}"]
[h:defaultChatSettings = data.getData("addon:","pm.a5e.core","ChatSettings")]
[h:defaultChatColors = json.get(defaultChatSettings,"ChatColors")]
[h:abort(input(
	"junkVar | ---------------------------------------- Personalized Chat Settings ---------------------------------------- | | LABEL | SPAN=TRUE",
	"choice.Default | | Use Default Settings | CHECK",
	"choice.DisplaySize | "+if(json.get(thisPlayerChatSettings,"DisplaySize")=="",json.get(defaultChatSettings,"DisplaySize"),json.get(thisPlayerChatSettings,"DisplaySize"))+" | Display Width ",
	"choice.VerticalDisplay | "+if(json.get(thisPlayerChatSettings,"VerticalDisplay")=="",json.get(defaultChatSettings,"VerticalDisplay"),json.get(thisPlayerChatSettings,"VerticalDisplay"))+" | Vertical Chat Orientation | CHECK ",
	"choice.UseWidth | Fixed Width,Maximum Width,Unlimited Width | Tooltip Width Options | LIST | SELECT="+if(json.get(thisPlayerChatSettings,"UseWidth")=="",json.get(defaultChatSettings,"UseWidth"),json.get(thisPlayerChatSettings,"UseWidth"))+" ",
	"choice.DarkMode | "+if(json.get(thisPlayerChatSettings,"DarkMode")=="",json.get(defaultChatSettings,"DarkMode"),json.get(thisPlayerChatSettings,"DarkMode"))+" | Use Dark Mode | CHECK",
	"junkVar | ------------------------------ Color Settings: Use Hex Codes ------------------------------ | | LABEL | SPAN=TRUE",
	"choice.DarkBackground | "+if(json.get(thisPlayerChatColors,"DarkBackground")=="",json.get(defaultChatColors,"DarkBackground"),json.get(thisPlayerChatColors,"DarkBackground"))+" | Dark Mode Background Color",
	"choice.DarkText | "+if(json.get(thisPlayerChatColors,"DarkText")=="",json.get(defaultChatColors,"DarkText"),json.get(thisPlayerChatColors,"DarkText"))+" | Dark Mode Text Color",
	"choice.DarkAccentBackground | "+if(json.get(thisPlayerChatColors,"DarkAccentBackground")=="",json.get(defaultChatColors,"DarkAccentBackground"),json.get(thisPlayerChatColors,"DarkAccentBackground"))+" | Dark Mode Accent Color",
	"choice.DarkAccentText | "+if(json.get(thisPlayerChatColors,"DarkAccentText")=="",json.get(defaultChatColors,"DarkAccentText"),json.get(thisPlayerChatColors,"DarkAccentText"))+" | Dark Mode Accent Text Color",
	"choice.DarkDamageText | "+if(json.get(thisPlayerChatColors,"DarkDamageText")=="",json.get(defaultChatColors,"DarkDamageText"),json.get(thisPlayerChatColors,"DarkDamageText"))+" | Dark Mode Damage Text Color",
	"choice.DarkHealingText | "+if(json.get(thisPlayerChatColors,"DarkHealingText")=="",json.get(defaultChatColors,"DarkHealingText"),json.get(thisPlayerChatColors,"DarkHealingText"))+" | Dark Mode Healing Text Color",
	"choice.DarkCritText | "+if(json.get(thisPlayerChatColors,"DarkCritText")=="",json.get(defaultChatColors,"DarkCritText"),json.get(thisPlayerChatColors,"DarkCritText"))+" | Dark Mode Critical Hit Color",
	"choice.DarkCritFailText | "+if(json.get(thisPlayerChatColors,"DarkCritFailText")=="",json.get(defaultChatColors,"DarkCritFailText"),json.get(thisPlayerChatColors,"DarkCritFailText"))+" | Dark Mode Critical Miss Color",
	"choice.DarkLinkColor | "+if(json.get(thisPlayerChatColors,"DarkLinkColor")=="",json.get(defaultChatColors,"DarkLinkColor"),json.get(thisPlayerChatColors,"DarkLinkColor"))+" | Dark Mode Link Color",
	"junkVar | -------------------------------------------------------------------------------------------------------- | | LABEL | SPAN=TRUE",
    "choice.LightBackground | "+if(json.get(thisPlayerChatColors,"LightBackground")=="",json.get(defaultChatColors,"LightBackground"),json.get(thisPlayerChatColors,"LightBackground"))+" | Light Mode Background Color",
    "choice.LightText | "+if(json.get(thisPlayerChatColors,"LightText")=="",json.get(defaultChatColors,"LightText"),json.get(thisPlayerChatColors,"LightText"))+" | Light Mode Text Color",
    "choice.LightAccentBackground | "+if(json.get(thisPlayerChatColors,"LightAccentBackground")=="",json.get(defaultChatColors,"LightAccentBackground"),json.get(thisPlayerChatColors,"LightAccentBackground"))+" | Light Mode Accent Color",
    "choice.LightAccentText | "+if(json.get(thisPlayerChatColors,"LightAccentText")=="",json.get(defaultChatColors,"LightAccentText"),json.get(thisPlayerChatColors,"LightAccentText"))+" | Light Mode Accent Text Color",
	"choice.LightDamageText | "+if(json.get(thisPlayerChatColors,"LightDamageText")=="",json.get(defaultChatColors,"LightDamageText"),json.get(thisPlayerChatColors,"LightDamageText"))+" | Light Mode Damage Text Color",
	"choice.LightHealingText | "+if(json.get(thisPlayerChatColors,"LightHealingText")=="",json.get(defaultChatColors,"LightHealingText"),json.get(thisPlayerChatColors,"LightHealingText"))+" | Light Mode Healing Text Color",
	"choice.LightCritText | "+if(json.get(thisPlayerChatColors,"LightCritText")=="",json.get(defaultChatColors,"LightCritText"),json.get(thisPlayerChatColors,"LightCritText"))+" | Light Mode Critical Hit Color",
	"choice.LightCritFailText | "+if(json.get(thisPlayerChatColors,"LightCritFailText")=="",json.get(defaultChatColors,"LightCritFailText"),json.get(thisPlayerChatColors,"LightCritFailText"))+" | Light Mode Critical Miss Color",
	"choice.LightLinkColor | "+if(json.get(thisPlayerChatColors,"LightLinkColor")=="",json.get(defaultChatColors,"LightLinkColor"),json.get(thisPlayerChatColors,"LightLinkColor"))+" | Light Mode Link Color",
	"junkVar | ---------------------------------------------- Font Settings ---------------------------------------------- | | LABEL | SPAN=TRUE",
	"choice.TitleFont | "+data.getData("addon:","pm.a5e.core","FontOptions")+" | Choose Title Font | LIST | VALUE=STRING ",
	"choice.BodyFont | "+data.getData("addon:","pm.a5e.core","FontOptions")+" | Choose Body Font | LIST | VALUE=STRING "
))]

[h,if(choice.Default),CODE:{
	[h:allPlayerChatSettings = json.remove(allPlayerChatSettings,PlayerName)]
};{
	[h:thisPlayerChatColors = json.set("",
		"DarkBackground",choice.DarkBackground,
		"DarkText",choice.DarkText,
		"DarkAccentBackground",choice.DarkAccentBackground,
		"DarkAccentText",choice.DarkAccentText,
		"DarkDamageText",choice.DarkDamageText,
		"DarkHealingText",choice.DarkHealingText,
		"DarkCritText",choice.DarkCritText,
		"DarkCritFailText",choice.DarkCritFailText,
		"DarkLinkColor",choice.DarkLinkColor,
		"LightBackground",choice.LightBackground,
		"LightText",choice.LightText,
		"LightAccentBackground",choice.LightAccentBackground,
		"LightAccentText",choice.LightAccentText,
		"LightDamageText",choice.LightDamageText,
		"LightHealingText",choice.LightHealingText,
		"LightCritText",choice.LightCritText,
		"LightCritFailText",choice.LightCritFailText,
		"LightLinkColor",choice.LightLinkColor
	)]
	[h:thisPlayerChatSettings = json.set("",
		"DisplaySize",choice.DisplaySize,
		"VerticalDisplay",choice.VerticalDisplay,
		"DarkMode",choice.DarkMode,
		"UseWidth",choice.UseWidth,
		"ChatColors",thisPlayerChatColors,
		"BodyFont",choice.TitleFont,
		"TitleFont",choice.TitleFont
	)]
	[h:allPlayerChatSettings = json.set(allPlayerChatSettings,PlayerName,thisPlayerChatSettings)]
}]

[h:data.setData("addon:","pm.a5e.core","PlayerChatSettings",allPlayerChatSettings)]
[h:broadcast("Personalized chat settings for "+PlayerDisplayName+" updated.")]