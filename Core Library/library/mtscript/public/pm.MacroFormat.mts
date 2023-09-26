[h:abilityClass = json.get(arg(0),"Class")]
[h:DisplayClass = json.get(arg(0),"ClassForDisplay")]
[h,if(DisplayClass!=""): abilityClass = DisplayClass]
[h:abilityName = json.get(arg(0),"Name")]
[h:abilityDisplayName = if(json.get(arg(0),"DisplayName")=="",abilityName,json.get(arg(0),"DisplayName"))]
[h:Flavor = json.get(arg(0),"Flavor")]
[h:DMOnly = json.get(arg(0),"DMOnly")]
[h:ColorSubtype = json.get(arg(0),"ColorSubtype")]
[h:BorderColorOverride=json.get(arg(0),"BorderColorOverride")]
[h:TitleColorOverride=json.get(arg(0),"TitleFontColorOverride")]
[h:AccentBackgroundOverride=json.get(arg(0),"AccentBackgroundOverride")]
[h:AccentTextOverride=json.get(arg(0),"AccentTextOverride")]
[h:TitleFont=json.get(arg(0),"TitleFont")]
[h:BodyFont=json.get(arg(0),"BodyFont")]
[h:FalseName=json.get(arg(0),"FalseName")]
[h,if(FalseName == ""): FalseName = abilityDisplayName]
[h:OnlyRules=json.get(arg(0),"OnlyRules")]
[h:ParentToken=json.get(arg(0),"ParentToken")]
[h,if(ParentToken!=""): switchToken(ParentToken)]

[h,if(abilityClass=="zzSpell"),CODE:{
	[h:tempColors = pm.SpellColors(ColorSubtype)]
	[h:chat.Border = json.get(tempColors,"Border")]
	[h:chat.Title = json.get(tempColors,"Title")]
};{
	[h:chat.Border = pm.BorderColor(abilityClass,ColorSubtype)]
	[h:chat.Title = pm.TitleColor(abilityClass,ColorSubtype)]
}]

[h,if(BorderColorOverride != ""): chat.Border = BorderColorOverride]
[h,if(TitleColorOverride != ""): chat.Title = TitleColorOverride]

[h,if(currentToken()!=""),CODE:{
	[h:outputTest.NoRules = if(DMOnly,if(or(and(number(data.getData("addon:","pm.a5e.core","HideEnemyMacros"))<1,getProperty("a5e.stat.Allegiance")=="Enemy"),and(number(data.getData("addon:","pm.a5e.core","HideAllyMacros"))<1,getProperty("a5e.stat.Allegiance")=="Ally")),0,1),0)]
	[h:outputTest.NoRolls = if(DMOnly,if(or(and(number(data.getData("addon:","pm.a5e.core","HideEnemyMacros"))<2,getProperty("a5e.stat.Allegiance")=="Enemy"),and(number(data.getData("addon:","pm.a5e.core","HideAllyMacros"))<2,getProperty("a5e.stat.Allegiance")=="Ally")),0,1),0)]
	[h:outputTest.NoFullMacro = if(DMOnly,if(or(and(number(data.getData("addon:","pm.a5e.core","HideEnemyMacros"))<3,getProperty("a5e.stat.Allegiance")=="Enemy"),and(number(data.getData("addon:","pm.a5e.core","HideAllyMacros"))<3,getProperty("a5e.stat.Allegiance")=="Ally")),if(and(OnlyRules,outputTest.NoRules),1,0),1),0)]
};{
	[h:outputTest.NoRules = DMOnly]
	[h:outputTest.NoRolls = DMOnly]
	[h:outputTest.NoFullMacro = DMOnly]
}]

[h:width.Setting=if(data.getData("addon:","pm.a5e.core","useWidth")==2,"",if(data.getData("addon:","pm.a5e.core","useWidth")==1,"max-width:"+string(data.getData("addon:","pm.a5e.core","DisplaySize"))+"px;",'width:'+string(data.getData("addon:","pm.a5e.core","DisplaySize"))+'px;'))]

[h:output.PC = ""]
[h:output.GM = ""]

[h:output.Temp='<div style="background-color: '+chat.Border+'; color: '+chat.Title+'; padding-top:2px; padding-bottom:2px; padding-left:8px; padding-right:8px; font-family:'+if(TitleFont=="",json.get(data.getData("addon:","pm.a5e.core","ChatFonts"),"Title"),TitleFont)+'; '+width.Setting+'">']
[h:output.PC = if(outputTest.NoFullMacro,output.PC,output.PC+output.Temp)]
[h:output.GM = output.GM + output.Temp]

[h:output.Temp="<b>"+abilityDisplayName+"</b>"]
[h:output.PC = if(outputTest.NoFullMacro,output.PC,if(outputTest.NoRules,output.PC+"<b>"+FalseName+"</b>",output.PC+output.Temp))]
[h:output.GM = output.GM + output.Temp]

[h:output.Temp="<div style='background-color:"+if(data.getData("addon:","pm.a5e.core","DarkMode")==1,json.get(data.getData("addon:","pm.a5e.core","ChatColors"),'DarkBackground'),json.get(data.getData("addon:","pm.a5e.core","ChatColors"),'LightBackground'))+'; color: '+if(data.getData("addon:","pm.a5e.core","DarkMode")==1,json.get(data.getData("addon:","pm.a5e.core","ChatColors"),'DarkText'),json.get(data.getData("addon:","pm.a5e.core","ChatColors"),'LightText'))+'; padding:2px; width:100%; font-family:'+if(BodyFont=="",json.get(data.getData("addon:","pm.a5e.core","ChatFonts"),"Body"),BodyFont)+"'>"]

[h:output.PC = if(outputTest.NoFullMacro,output.PC,output.PC+output.Temp)]
[h:output.GM = output.GM + output.Temp]

[h:output.Temp=if(Flavor=="","",'<div style="text-align:center; background-color:'+if(AccentBackgroundOverride=="",if(data.getData("addon:","pm.a5e.core","DarkMode")==1,json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"DarkAccentBackground"),json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"LightAccentBackground")),AccentBackgroundOverride)+"; color:"+if(AccentTextOverride=="",if(data.getData("addon:","pm.a5e.core","DarkMode")==1,json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"DarkAccentText"),json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"LightAccentText")),AccentTextOverride)+';">'+"<i>"+Flavor+"</i></div>")]
[h:output.PC = if(outputTest.NoFullMacro,output.PC,output.PC+output.Temp)]
[h:output.GM = output.GM + output.Temp]

[h:BackgroundColor = if(data.getData("addon:","pm.a5e.core","DarkMode")==1,json.get(data.getData("addon:","pm.a5e.core","ChatColors"),'DarkBackground'),json.get(data.getData("addon:","pm.a5e.core","ChatColors"),'LightBackground'))]
[h:BackgroundText = if(data.getData("addon:","pm.a5e.core","DarkMode")==1,json.get(data.getData("addon:","pm.a5e.core","ChatColors"),'DarkText'),json.get(data.getData("addon:","pm.a5e.core","ChatColors"),'LightText'))]
[h:BackgroundFormat="background-color:"+BackgroundColor+'; color: '+BackgroundText+'; padding:2px; font-family:'+if(BodyFont=="",json.get(data.getData("addon:","pm.a5e.core","ChatFonts"),"Body"),BodyFont)]

[h:AccentText = if(AccentTextOverride=="",if(data.getData("addon:","pm.a5e.core","DarkMode")==1,json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"DarkAccentText"),json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"LightAccentText")),AccentTextOverride)]
[h:AccentColor = if(AccentBackgroundOverride=="",if(data.getData("addon:","pm.a5e.core","DarkMode")==1,json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"DarkAccentBackground"),json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"LightAccentBackground")),AccentBackgroundOverride)]

[h:macro.return = json.set("","AccentColor",AccentColor,"AccentText",AccentText,"BackgroundColor",BackgroundColor,"BackgroundText",BackgroundText,"NoFullMacro",outputTest.NoFullMacro,"NoRolls",outputTest.NoRolls,"NoRules",outputTest.NoRules,"Output",json.set("","Player",output.PC,"GM",output.GM))]