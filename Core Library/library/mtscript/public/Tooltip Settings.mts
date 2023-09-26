[h:choice.TitleFont=""]
[h:choice.BodyFont=""]

[h:abort(input(
	"junkVar | ---------------------------------------- Tooltip Settings ---------------------------------------- | | LABEL | SPAN=TRUE",
	"choice.Default | | Restore Default Settings | CHECK",
	"choice.Mouseover | "+if(json.get(data.getData("addon:","pm.a5e.core","TooltipMouseover"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipMouseover"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipMouseover"),getPlayerName()))+" | Show Tooltips Over Macro Buttons | CHECK",
	"choice.Frame | "+if(json.get(data.getData("addon:","pm.a5e.core","TooltipFrame"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipFrame"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipFrame"),getPlayerName()))+" | Show Tooltips in Frame | CHECK",
	"choice.DisplaySize | "+if(json.get(data.getData("addon:","pm.a5e.core","TooltipDisplaySize"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipDisplaySize"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDisplaySize"),getPlayerName()))+" | Tooltip Display Width ",
	"choice.Vertical | "+if(json.get(data.getData("addon:","pm.a5e.core","TooltipVertical"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipVertical"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipVertical"),getPlayerName()))+" | Use Vertical Tooltip Frames | CHECK ",
	"choice.DisplayType | Fixed Width,Maximum Width,Unlimited Width | Tooltip Width Options | LIST | SELECT="+if(json.get(data.getData("addon:","pm.a5e.core","TooltipDisplayType"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipDisplayType"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDisplayType"),getPlayerName()))+" ",
	"choice.DarkMode | "+if(json.get(data.getData("addon:","pm.a5e.core","TooltipDarkMode"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipDarkMode"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDarkMode"),getPlayerName()))+" | Use Dark Mode | CHECK",
	"junkVar | ------------------------------ Color Settings: Use Hex Codes ------------------------------ | | LABEL | SPAN=TRUE",
	"choice.DarkBackground | "+if(json.get(data.getData("addon:","pm.a5e.core","TooltipDarkBackground"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipDarkBackground"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDarkBackground"),getPlayerName()))+" | Dark Mode Background Color",
	"choice.DarkText | "+if(json.get(data.getData("addon:","pm.a5e.core","TooltipDarkText"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipDarkText"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDarkText"),getPlayerName()))+" | Dark Mode Text Color",
	"choice.DarkAccent | "+if(json.get(data.getData("addon:","pm.a5e.core","TooltipDarkAccent"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipDarkAccent"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDarkAccent"),getPlayerName()))+" | Dark Mode Accent Color",
	"choice.DarkAccentText | "+if(json.get(data.getData("addon:","pm.a5e.core","TooltipDarkAccentText"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipDarkAccentText"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDarkAccentText"),getPlayerName()))+" | Dark Mode Accent Text Color",
	"junkVar | -------------------------------------------------------------------------------------------------------- | | LABEL | SPAN=TRUE",
    "choice.LightBackground | "+if(json.get(data.getData("addon:","pm.a5e.core","TooltipLightBackground"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipLightBackground"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipLightBackground"),getPlayerName()))+" | Light Mode Background Color",
    "choice.LightText | "+if(json.get(data.getData("addon:","pm.a5e.core","TooltipLightText"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipLightText"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipLightText"),getPlayerName()))+" | Light Mode Text Color",
    "choice.LightAccent | "+if(json.get(data.getData("addon:","pm.a5e.core","TooltipLightAccent"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipLightAccent"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipLightAccent"),getPlayerName()))+" | Light Mode Accent Color",
    "choice.LightAccentText | "+if(json.get(data.getData("addon:","pm.a5e.core","TooltipLightAccentText"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipLightAccentText"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipLightAccentText"),getPlayerName()))+" | Light Mode Accent Text Color",
	"junkVar | ---------------------------------------------- Font Settings ---------------------------------------------- | | LABEL | SPAN=TRUE"
))]

[h,if(choice.Default),CODE:{
	[h:choice.Mouseover=json.get(data.getData("addon:","pm.a5e.core","TooltipMouseover"),"Default")]
	[h:choice.Frame=json.get(data.getData("addon:","pm.a5e.core","TooltipFrame"),"Default")]
	[h:choice.DisplaySize=json.get(data.getData("addon:","pm.a5e.core","TooltipDisplaySize"),"Default")]
	[h:choice.DisplayType=json.get(data.getData("addon:","pm.a5e.core","TooltipDisplayType"),"Default")]
	[h:choice.Vertical=json.get(data.getData("addon:","pm.a5e.core","TooltipVertical"),"Default")]
	[h:choice.DarkMode=json.get(data.getData("addon:","pm.a5e.core","TooltipDarkMode"),"Default")]
	[h:choice.DarkBackground=json.get(data.getData("addon:","pm.a5e.core","TooltipDarkBackground"),"Default")]
	[h:choice.DarkText=json.get(data.getData("addon:","pm.a5e.core","TooltipDarkText"),"Default")]
	[h:choice.DarkAccent=json.get(data.getData("addon:","pm.a5e.core","TooltipDarkAccent"),"Default")]
	[h:choice.DarkAccentText=json.get(data.getData("addon:","pm.a5e.core","TooltipDarkAccentText"),"Default")]
    [h:choice.LightBackground=json.get(data.getData("addon:","pm.a5e.core","TooltipLightBackground"),"Default")]
    [h:choice.LightText=json.get(data.getData("addon:","pm.a5e.core","TooltipLightText"),"Default")]
    [h:choice.LightAccent=json.get(data.getData("addon:","pm.a5e.core","TooltipLightAccent"),"Default")]
    [h:choice.LightAccentText=json.get(data.getData("addon:","pm.a5e.core","TooltipLightAccentText"),"Default")]
};{}]

[h:setLibProperty("TooltipMouseover",json.set(data.getData("addon:","pm.a5e.core","TooltipMouseover"),getPlayerName(),choice.Mouseover),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipFrame",json.set(data.getData("addon:","pm.a5e.core","TooltipFrame"),getPlayerName(),choice.Frame),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDisplaySize",json.set(data.getData("addon:","pm.a5e.core","TooltipDisplaySize"),getPlayerName(),choice.DisplaySize),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDisplayType",json.set(data.getData("addon:","pm.a5e.core","TooltipDisplayType"),getPlayerName(),choice.DisplayType),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipVertical",json.set(data.getData("addon:","pm.a5e.core","TooltipVertical"),getPlayerName(),choice.Vertical),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkMode",json.set(data.getData("addon:","pm.a5e.core","TooltipDarkMode"),getPlayerName(),choice.DarkMode),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkBackground",json.set(data.getData("addon:","pm.a5e.core","TooltipDarkBackground"),getPlayerName(),choice.DarkBackground),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkText",json.set(data.getData("addon:","pm.a5e.core","TooltipDarkText"),getPlayerName(),choice.DarkText),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkAccent",json.set(data.getData("addon:","pm.a5e.core","TooltipDarkAccent"),getPlayerName(),choice.DarkAccent),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkAccentText",json.set(data.getData("addon:","pm.a5e.core","TooltipDarkAccentText"),getPlayerName(),choice.DarkAccentText),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipLightBackground",json.set(data.getData("addon:","pm.a5e.core","TooltipLightBackground"),getPlayerName(),choice.LightBackground),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipLightText",json.set(data.getData("addon:","pm.a5e.core","TooltipLightText"),getPlayerName(),choice.LightText),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipLightAccent",json.set(data.getData("addon:","pm.a5e.core","TooltipLightAccent"),getPlayerName(),choice.LightAccent),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipLightAccentText",json.set(data.getData("addon:","pm.a5e.core","TooltipLightAccentText"),getPlayerName(),choice.LightAccentText),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipTitleFont",json.set(data.getData("addon:","pm.a5e.core","TooltipTitleFont"),getPlayerName(),choice.TitleFont),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipBodyFont",json.set(data.getData("addon:","pm.a5e.core","TooltipBodyFont"),getPlayerName(),choice.BodyFont),"Lib:pm.a5e.Core")]