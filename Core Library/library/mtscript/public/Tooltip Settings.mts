[h:choice.TitleFont=""]
[h:choice.BodyFont=""]

[h:display.settings=input(
	"junkVar | ---------------------------------------- Tooltip Settings ---------------------------------------- | | LABEL | SPAN=TRUE",
	"choice.Default | | Restore Default Settings | CHECK",
	"choice.Mouseover | "+if(json.get(getLibProperty("TooltipMouseover","Lib:pm.a5e.Core"),getPlayerName())=="",json.get(getLibProperty("TooltipMouseover","Lib:pm.a5e.Core"),"Default"),json.get(getLibProperty("TooltipMouseover","Lib:pm.a5e.Core"),getPlayerName()))+" | Show Tooltips Over Macro Buttons | CHECK",
	"choice.Frame | "+if(json.get(getLibProperty("TooltipFrame","Lib:pm.a5e.Core"),getPlayerName())=="",json.get(getLibProperty("TooltipFrame","Lib:pm.a5e.Core"),"Default"),json.get(getLibProperty("TooltipFrame","Lib:pm.a5e.Core"),getPlayerName()))+" | Show Tooltips in Frame | CHECK",
	"choice.DisplaySize | "+if(json.get(getLibProperty("TooltipDisplaySize","Lib:pm.a5e.Core"),getPlayerName())=="",json.get(getLibProperty("TooltipDisplaySize","Lib:pm.a5e.Core"),"Default"),json.get(getLibProperty("TooltipDisplaySize","Lib:pm.a5e.Core"),getPlayerName()))+" | Tooltip Display Width ",
	"choice.DisplaySize | "+if(json.get(getLibProperty("TooltipVertical","Lib:pm.a5e.Core"),getPlayerName())=="",json.get(getLibProperty("TooltipVertical","Lib:pm.a5e.Core"),"Default"),json.get(getLibProperty("TooltipVertical","Lib:pm.a5e.Core"),getPlayerName()))+" | Use Vertical Tooltip Frames | CHECK ",
	"choice.DisplayType | Fixed Width,Maximum Width,Unlimited Width | Tooltip Width Options | LIST | SELECT="+if(json.get(getLibProperty("TooltipDisplayType","Lib:pm.a5e.Core"),getPlayerName())=="",json.get(getLibProperty("TooltipDisplayType","Lib:pm.a5e.Core"),"Default"),json.get(getLibProperty("TooltipDisplayType","Lib:pm.a5e.Core"),getPlayerName()))+" ",
	"choice.DarkMode | "+if(json.get(getLibProperty("TooltipDarkMode","Lib:pm.a5e.Core"),getPlayerName())=="",json.get(getLibProperty("TooltipDarkMode","Lib:pm.a5e.Core"),"Default"),json.get(getLibProperty("TooltipDarkMode","Lib:pm.a5e.Core"),getPlayerName()))+" | Use Dark Mode | CHECK",
	"junkVar | ------------------------------ Color Settings: Use Hex Codes ------------------------------ | | LABEL | SPAN=TRUE",
	"choice.DarkBackground | "+if(json.get(getLibProperty("TooltipDarkBackground","Lib:pm.a5e.Core"),getPlayerName())=="",json.get(getLibProperty("TooltipDarkBackground","Lib:pm.a5e.Core"),"Default"),json.get(getLibProperty("TooltipDarkBackground","Lib:pm.a5e.Core"),getPlayerName()))+" | Dark Mode Background Color",
	"choice.DarkText | "+if(json.get(getLibProperty("TooltipDarkText","Lib:pm.a5e.Core"),getPlayerName())=="",json.get(getLibProperty("TooltipDarkText","Lib:pm.a5e.Core"),"Default"),json.get(getLibProperty("TooltipDarkText","Lib:pm.a5e.Core"),getPlayerName()))+" | Dark Mode Text Color",
	"choice.DarkAccent | "+if(json.get(getLibProperty("TooltipDarkAccent","Lib:pm.a5e.Core"),getPlayerName())=="",json.get(getLibProperty("TooltipDarkAccent","Lib:pm.a5e.Core"),"Default"),json.get(getLibProperty("TooltipDarkAccent","Lib:pm.a5e.Core"),getPlayerName()))+" | Dark Mode Accent Color",
	"choice.DarkAccentText | "+if(json.get(getLibProperty("TooltipDarkAccentText","Lib:pm.a5e.Core"),getPlayerName())=="",json.get(getLibProperty("TooltipDarkAccentText","Lib:pm.a5e.Core"),"Default"),json.get(getLibProperty("TooltipDarkAccentText","Lib:pm.a5e.Core"),getPlayerName()))+" | Dark Mode Accent Text Color",
	"junkVar | -------------------------------------------------------------------------------------------------------- | | LABEL | SPAN=TRUE",
    "choice.LightBackground | "+if(json.get(getLibProperty("TooltipLightBackground","Lib:pm.a5e.Core"),getPlayerName())=="",json.get(getLibProperty("TooltipLightBackground","Lib:pm.a5e.Core"),"Default"),json.get(getLibProperty("TooltipLightBackground","Lib:pm.a5e.Core"),getPlayerName()))+" | Light Mode Background Color",
    "choice.LightText | "+if(json.get(getLibProperty("TooltipLightText","Lib:pm.a5e.Core"),getPlayerName())=="",json.get(getLibProperty("TooltipLightText","Lib:pm.a5e.Core"),"Default"),json.get(getLibProperty("TooltipLightText","Lib:pm.a5e.Core"),getPlayerName()))+" | Light Mode Text Color",
    "choice.LightAccent | "+if(json.get(getLibProperty("TooltipLightAccent","Lib:pm.a5e.Core"),getPlayerName())=="",json.get(getLibProperty("TooltipLightAccent","Lib:pm.a5e.Core"),"Default"),json.get(getLibProperty("TooltipLightAccent","Lib:pm.a5e.Core"),getPlayerName()))+" | Light Mode Accent Color",
    "choice.LightAccentText | "+if(json.get(getLibProperty("TooltipLightAccentText","Lib:pm.a5e.Core"),getPlayerName())=="",json.get(getLibProperty("TooltipLightAccentText","Lib:pm.a5e.Core"),"Default"),json.get(getLibProperty("TooltipLightAccentText","Lib:pm.a5e.Core"),getPlayerName()))+" | Light Mode Accent Text Color",
	"junkVar | ---------------------------------------------- Font Settings ---------------------------------------------- | | LABEL | SPAN=TRUE"
	)]
[h:abort(display.settings)]

[h,if(choice.Default),CODE:{
	[h:choice.Mouseover=json.get(getLibProperty("TooltipMouseover","Lib:pm.a5e.Core"),"Default")]
	[h:choice.Frame=json.get(getLibProperty("TooltipFrame","Lib:pm.a5e.Core"),"Default")]
	[h:choice.DisplaySize=json.get(getLibProperty("TooltipDisplaySize","Lib:pm.a5e.Core"),"Default")]
	[h:choice.DisplayType=json.get(getLibProperty("TooltipDisplayType","Lib:pm.a5e.Core"),"Default")]
	[h:choice.Vertical=json.get(getLibProperty("TooltipVertical","Lib:pm.a5e.Core"),"Default")]
	[h:choice.DarkMode=json.get(getLibProperty("TooltipDarkMode","Lib:pm.a5e.Core"),"Default")]
	[h:choice.DarkBackground=json.get(getLibProperty("TooltipDarkBackground","Lib:pm.a5e.Core"),"Default")]
	[h:choice.DarkText=json.get(getLibProperty("TooltipDarkText","Lib:pm.a5e.Core"),"Default")]
	[h:choice.DarkAccent=json.get(getLibProperty("TooltipDarkAccent","Lib:pm.a5e.Core"),"Default")]
	[h:choice.DarkAccentText=json.get(getLibProperty("TooltipDarkAccentText","Lib:pm.a5e.Core"),"Default")]
    [h:choice.LightBackground=json.get(getLibProperty("TooltipLightBackground","Lib:pm.a5e.Core"),"Default")]
    [h:choice.LightText=json.get(getLibProperty("TooltipLightText","Lib:pm.a5e.Core"),"Default")]
    [h:choice.LightAccent=json.get(getLibProperty("TooltipLightAccent","Lib:pm.a5e.Core"),"Default")]
    [h:choice.LightAccentText=json.get(getLibProperty("TooltipLightAccentText","Lib:pm.a5e.Core"),"Default")]
};{}]

[h:setLibProperty("TooltipMouseover",json.set(getLibProperty("TooltipMouseover"),getPlayerName(),choice.Mouseover),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipFrame",json.set(getLibProperty("TooltipFrame"),getPlayerName(),choice.Frame),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDisplaySize",json.set(getLibProperty("TooltipDisplaySize"),getPlayerName(),choice.DisplaySize),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDisplayType",json.set(getLibProperty("TooltipDisplayType"),getPlayerName(),choice.DisplayType),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipVertical",json.set(getLibProperty("TooltipVertical"),getPlayerName(),choice.Vertical),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkMode",json.set(getLibProperty("TooltipDarkMode"),getPlayerName(),choice.DarkMode),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkBackground",json.set(getLibProperty("TooltipDarkBackground"),getPlayerName(),choice.DarkBackground),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkText",json.set(getLibProperty("TooltipDarkText"),getPlayerName(),choice.DarkText),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkAccent",json.set(getLibProperty("TooltipDarkAccent"),getPlayerName(),choice.DarkAccent),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkAccentText",json.set(getLibProperty("TooltipDarkAccentText"),getPlayerName(),choice.DarkAccentText),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipLightBackground",json.set(getLibProperty("TooltipLightBackground"),getPlayerName(),choice.LightBackground),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipLightText",json.set(getLibProperty("TooltipLightText"),getPlayerName(),choice.LightText),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipLightAccent",json.set(getLibProperty("TooltipLightAccent"),getPlayerName(),choice.LightAccent),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipLightAccentText",json.set(getLibProperty("TooltipLightAccentText"),getPlayerName(),choice.LightAccentText),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipTitleFont",json.set(getLibProperty("TooltipTitleFont"),getPlayerName(),choice.TitleFont),"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipBodyFont",json.set(getLibProperty("TooltipBodyFont"),getPlayerName(),choice.BodyFont),"Lib:pm.a5e.Core")]