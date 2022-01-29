[h:abilityClass = if(json.get(arg(0),"Class")==pm.RemoveSpecial(Race),"Innate",json.get(arg(0),"Class"))]
[h:abilityName = json.get(arg(0),"Name")]
[h:abilityDisplayName = if(json.get(arg(0),"DisplayName")=="",abilityName,json.get(arg(0),"DisplayName"))]
[h:Flavor = json.get(arg(0),"Flavor")]
[h:DMOnly=json.get(arg(0),"DMOnly")]
[h:BorderColorOverride=json.get(arg(0),"BorderColorOverride")]
[h:TitleColorOverride=json.get(arg(0),"TitleFontColorOverride")]
[h:AccentBackgroundOverride=json.get(arg(0),"AccentBackgroundOverride")]
[h:AccentTextOverride=json.get(arg(0),"AccentTextOverride")]
[h:TitleFont=json.get(arg(0),"TitleFont")]
[h:BodyFont=json.get(arg(0),"BodyFont")]
[h:FalseName=json.get(arg(0),"FalseName")]
[h:OnlyRules=json.get(arg(0),"OnlyRules")]

[h,if(BorderColorOverride == ""),CODE:{
	[h:chat.Border=pm.BorderColor(abilityClass)]
};{
	[h:chat.Border=BorderColorOverride]
}]

[h,if(TitleColorOverride == ""),CODE:{
	[h:chat.Title=pm.TitleColor(abilityClass)]
};{
	[h:chat.Title=TitleColorOverride]
}]

[h:outputTest.NoRules = if(DMOnly,if(or(and(number(getLibProperty("HideEnemyMacros","Lib:pm.a5e.Core"))<1,PC.Ally.Enemy==2),and(number(getLibProperty("HideAllyMacros","Lib:pm.a5e.Core"))<1,PC.Ally.Enemy==1)),0,1),0)]
[h:outputTest.NoRolls = if(DMOnly,if(or(and(number(getLibProperty("HideEnemyMacros","Lib:pm.a5e.Core"))<2,PC.Ally.Enemy==2),and(number(getLibProperty("HideAllyMacros","Lib:pm.a5e.Core"))<2,PC.Ally.Enemy==1)),0,1),0)]
[h:outputTest.NoFullMacro = if(DMOnly,if(or(and(number(getLibProperty("HideEnemyMacros","Lib:pm.a5e.Core"))<3,PC.Ally.Enemy==2),and(number(getLibProperty("HideAllyMacros","Lib:pm.a5e.Core"))<3,PC.Ally.Enemy==1)),if(and(OnlyRules,outputTest.NoRules),1,0),1),0)]
[h:width.Setting=if(getLibProperty("useWidth","Lib:pm.a5e.Core")==2,"",if(getLibProperty("useWidth","Lib:pm.a5e.Core")==1,"max-width:"+string(getLibProperty("DisplaySize","Lib:pm.a5e.Core"))+"px;",'width:'+string(getLibProperty("DisplaySize","Lib:pm.a5e.Core"))+'px;'))]

[h:output.PC = ""]
[h:output.GM = ""]

	[h:output.Temp='<div style="background-color: '+chat.Border+'; color: '+chat.Title+'; padding-top:2px; padding-bottom:2px; padding-left:8px; padding-right:8px; font-family:'+if(TitleFont=="",json.get(getLibProperty("ChatFonts","Lib:pm.a5e.Core"),"Title"),TitleFont)+'; '+width.Setting+'">']
	[h:output.PC = if(outputTest.NoFullMacro,output.PC,output.PC+output.Temp)]
	[h:output.GM = output.GM + output.Temp]
	
	[h:output.Temp="<b>"+abilityDisplayName+"</b>"]
	[h:output.PC = if(outputTest.NoFullMacro,output.PC,if(outputTest.NoRules,output.PC+"<b>"+FalseName+"</b>",output.PC+output.Temp))]
	[h:output.GM = output.GM + output.Temp]

	[h:output.Temp="<div style='background-color:"+if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1,json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),'DarkBackground'),json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),'LightBackground'))+'; color: '+if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1,json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),'DarkText'),json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),'LightText'))+'; padding:2px; width:100%; font-family:'+if(BodyFont=="",json.get(getLibProperty("ChatFonts","Lib:pm.a5e.Core"),"Body"),BodyFont)+"'>"]
	
	[h:output.PC = if(outputTest.NoFullMacro,output.PC,output.PC+output.Temp)]
	[h:output.GM = output.GM + output.Temp]
	
	[h:output.Temp=if(or(Flavor==(token.name+" FLAVOR TEXT"),Flavor==""),"",'<div style="text-align:center; background-color:'+if(AccentBackgroundOverride=="",if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1,json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkAccentBackground"),json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightAccentBackground")),AccentBackgroundOverride)+"; color:"+if(AccentTextOverride=="",if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1,json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkAccentText"),json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightAccentText")),AccentTextOverride)+';">'+"<i>"+Flavor+"</i></div>")]
	[h:output.PC = if(outputTest.NoFullMacro,output.PC,output.PC+output.Temp)]
	[h:output.GM = output.GM + output.Temp]

[h:BackgroundColor = if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1,json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),'DarkBackground'),json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),'LightBackground'))]
[h:BackgroundText = if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1,json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),'DarkText'),json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),'LightText'))]
[h:BackgroundFormat="background-color:"+BackgroundColor+'; color: '+BackgroundText+'; padding:2px; font-family:'+if(BodyFont=="",json.get(getLibProperty("ChatFonts","Lib:pm.a5e.Core"),"Body"),BodyFont)]

[h:AccentText = if(AccentTextOverride=="",if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1,json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkAccentText"),json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightAccentText")),AccentTextOverride)]
[h:AccentColor = if(AccentBackgroundOverride=="",if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1,json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkAccentBackground"),json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightAccentBackground")),AccentBackgroundOverride)]

[h:macro.return = json.set("","AccentColor",AccentColor,"AccentText",AccentText,"BackgroundColor",BackgroundColor,"BackgroundText",BackgroundText,"NoFullMacro",outputTest.NoFullMacro,"NoRolls",outputTest.NoRolls,"NoRules",outputTest.NoRules,"Output",json.set("","Player",output.PC,"GM",output.GM))]