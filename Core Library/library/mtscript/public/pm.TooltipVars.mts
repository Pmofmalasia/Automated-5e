[h:Frame.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipFrame"),getPlayerName())=="",""+json.get(data.getData("addon:","pm.a5e.core","TooltipFrame"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipFrame"),getPlayerName())+"")]
[h:Mouseover.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipMouseover"),getPlayerName())=="",""+json.get(data.getData("addon:","pm.a5e.core","TooltipMouseover"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipMouseover"),getPlayerName())+"")]










[h:width.Setting=' width:'+if(json.get(data.getData("addon:","pm.a5e.core","TooltipDisplaySize"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipDisplaySize"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDisplaySize"),getPlayerName()))+'px;']

[h:DisplaySize.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipDisplaySize"),getPlayerName())=="",""+json.get(data.getData("addon:","pm.a5e.core","TooltipDisplaySize"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDisplaySize"),getPlayerName())+"")]
[h:DisplayType.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipDisplayType"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipDisplayType"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDisplayType"),getPlayerName()))]
[h:TitleFont.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipTitleFont"),getPlayerName())=="",""+json.get(data.getData("addon:","pm.a5e.core","TooltipTitleFont"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipTitleFont"),getPlayerName())+"")]
[h:DarkMode.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipDarkMode"),getPlayerName())=="",""+json.get(data.getData("addon:","pm.a5e.core","TooltipDarkMode"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDarkMode"),getPlayerName())+"")]
[h:TitleFont.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipTitleFont"),getPlayerName())=="",""+json.get(data.getData("addon:","pm.a5e.core","TooltipTitleFont"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipTitleFont"),getPlayerName())+"")]
[h:BodyFont.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipBodyFont"),getPlayerName())=="",""+json.get(data.getData("addon:","pm.a5e.core","TooltipBodyFont"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipBodyFont"),getPlayerName())+"")]
[h:BodyDarkBackground.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipDarkBackground"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipDarkBackground"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDarkBackground"),getPlayerName())+"")]
[h:BodyLightBackground.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipLightBackground"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipLightBackground"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipLightBackground"),getPlayerName())+"")]
[h:BodyDarkText.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipDarkText"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipDarkText"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDarkText"),getPlayerName()))]
[h:BodyLightText.tooltip = string(if(json.get(data.getData("addon:","pm.a5e.core","TooltipLightText"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipLightText"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipLightText"),getPlayerName())))]

[h:BodyDarkAccent.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipDarkAccent"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipDarkAccent"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDarkAccent"),getPlayerName())+"")]
[h:BodyLightAccent.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipLightAccent"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipLightAccent"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipLightAccent"),getPlayerName())+"")]
[h:BodyDarkAccentText.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipDarkAccentText"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipDarkAccentText"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipDarkAccentText"),getPlayerName())+"")]
[h:BodyLightAccentText.tooltip = if(json.get(data.getData("addon:","pm.a5e.core","TooltipLightAccentText"),getPlayerName())=="",json.get(data.getData("addon:","pm.a5e.core","TooltipLightAccentText"),"Default"),json.get(data.getData("addon:","pm.a5e.core","TooltipLightAccentText"),getPlayerName())+"")]

[h:VerticalFormat=if(json.get(data.getData("addon:","pm.a5e.core","TooltipVertical"),getPlayerName())=="",if(json.get(data.getData("addon:","pm.a5e.core","TooltipVertical"),"Default")==1,


"</th></tr><tr style='text-align:center;'><td>",
"</th><td style='padding-left:4px'>"


),if(json.get(data.getData("addon:","pm.a5e.core","TooltipVertical"),getPlayerName())==1,"</th></tr><tr style='text-align:center;'><td>","</th><td style='padding-left:4px'>"))]

[h:BodyBackgroundFinal.tooltip = if(DarkMode.tooltip==1,BodyDarkBackground.tooltip,BodyLightBackground.tooltip)]
[h:BodyTextFinal.tooltip = string(if(DarkMode.tooltip==1,BodyDarkText.tooltip,BodyLightText.tooltip))]

[h:AccentFormat="text-align:center; background-color:"+if(DarkMode.tooltip,BodyDarkAccent.tooltip,BodyLightAccent.tooltip)+"; color:"+if(DarkMode.tooltip,BodyDarkAccentText.tooltip,BodyLightAccentText.tooltip)+"; width:80px;"]
[h:FrameAccentFormat="text-align:center; background-color:"+if(DarkMode.tooltip,BodyDarkAccent.tooltip,BodyLightAccent.tooltip)+"; color:"+if(DarkMode.tooltip,BodyDarkAccentText.tooltip,BodyLightAccentText.tooltip)+"; width:120px;"]