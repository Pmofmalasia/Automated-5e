[h:ChatSettingsData = json.get(data.getData("addon:","pm.a5e.core","DefaultChatSettings"))]
[h:allBorderColors = json.get(ChatSettingsData,"SpellBorderColors")]
[h:allTitleColors = json.get(ChatSettingsData,"SpellTitleColors")]

[h:macro.return = json.set("",
	"Border",json.get(json.get(allBorderColors,json.get(arg(0),"Source")),json.get(arg(0),"Level")),
	"Title",json.get(json.get(allTitleColors,json.get(arg(0),"Source")),json.get(arg(0),"Level"))
)]