[h,if(currentToken()==""):
	abilityClass = json.get(arg(0),"Class");
	abilityClass = if(json.get(arg(0),"Class")==getProperty("a5e.stat.Race"),"Innate",json.get(arg(0),"Class"))
]
[h:DisplayClass = json.get(arg(0),"DisplayClass")]
[h,if(DisplayClass!=""): abilityClass = DisplayClass]
[h:ColorSubtype = json.get(arg(0),"ColorSubtype")]
[h:abilityName = json.get(arg(0),"Name")]
[h:abilityDisplayName = if(json.get(arg(0),"DisplayName")=="",abilityName,json.get(arg(0),"DisplayName"))]
[h:FeatureDescription=json.get(arg(0),"Effect")]
[h:abilityTable=json.get(arg(0),"abilityTable")]
[h:Flavor = json.get(arg(0),"Flavor")]
[h:needsSplitGMOutput=json.get(arg(0),"needsSplitGMOutput")]
[h:BorderColorOverride=json.get(arg(0),"BorderColorOverride")]
[h:TitleColorOverride=json.get(arg(0),"TitleFontColorOverride")]
[h:AccentBackgroundOverride=json.get(arg(0),"AccentBackgroundOverride")]
[h:AccentTextOverride=json.get(arg(0),"AccentTextOverride")]
[h:TitleFont=json.get(arg(0),"TitleFont")]
[h:BodyFont=json.get(arg(0),"BodyFont")]
[h:FalseName=json.get(arg(0),"FalseName")]
[h:OnlyRules=json.get(arg(0),"OnlyRules")]

[h,if(abilityClass=="zzSpell"),CODE:{
	[h:tempColors = pm.SpellColors(ColorSubtype)]
	[h:tooltip.Border = json.get(tempColors,"Border")]
	[h:tooltip.Title = json.get(tempColors,"Title")]
};{
	[h:tooltip.Border = pm.BorderColor(abilityClass,ColorSubtype)]
	[h:tooltip.Title = pm.TitleColor(abilityClass,ColorSubtype)]
}]
			
[h,if(BorderColorOverride == ""),CODE:{};{
	[h:tooltip.Border = if(isOwner(getPlayerName()),BorderColorOverride,tooltip.Border)]
}]
	
[h,if(TitleColorOverride == ""),CODE:{};{
	[h:tooltip.Title = if(isOwner(getPlayerName()),TitleColorOverride,tooltip.Title)]
}]

[h:pm.TooltipVars()]

[h:pm.BorderFrame = strformat('<div style="background-color:'+tooltip.Border+'; color:'+tooltip.Title+'; padding-top:2px; padding-bottom:6px; padding-left:8px; padding-right:8px; font-family:'+TitleFont.tooltip+';"><b>'+abilityDisplayName+'</b><div style="background-color:'+BodyBackgroundFinal.tooltip+'; color:'+BodyTextFinal.tooltip+'; padding:6px; font-family:'+BodyFont.tooltip+'">')]
[h:pm.BorderTooltip = strformat('<div style="background-color:'+tooltip.Border+'; color:'+tooltip.Title+'; padding-top:2px; padding-bottom:6px; padding-left:8px; padding-right:8px; font-family:'+TitleFont.tooltip+'; '+width.Setting+'"><b>'+abilityDisplayName+'</b><div style="background-color:'+BodyBackgroundFinal.tooltip+'; color:'+BodyTextFinal.tooltip+'; padding:6px; font-family:'+BodyFont.tooltip+'">')]
[h:pm.AccentFormat = AccentFormat]
[h:pm.FrameAccentFormat = FrameAccentFormat]
[h:pm.TableFontColor = BodyTextFinal.tooltip]