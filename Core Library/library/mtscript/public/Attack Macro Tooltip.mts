[h:BorderColorOverride=json.get(macro.args,"BorderColorOverride")]
[h:TitleFontColorOverride=json.get(macro.args,"TitleFontColorOverride")]
[h:TitleFont=json.get(macro.args,"TitleFont")]
[h:BodyFont=json.get(macro.args,"BodyFont")]
[h:tooltipDisplaySizeOverride=json.get(macro.args,"tooltipDisplaySizeOverride")]
[h:WhichHand=json.get(macro.args,"WhichHand")]
[h:DMOnly=json.get(macro.args,"DMOnly")]
[h:PrimeStat=if(listFind(json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"Props"),"Finesse")>-1,max(json.get(AtrMods,"Dexterity"),json.get(AtrMods,"Strength")),json.get(AtrMods,"Strength"))]
[h:PrimeStat=if(listFind(json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"Props"),"Ammunition")>-1,json.get(AtrMods,"Dexterity"),PrimeStat)]
[h:PrimeStat=if(listFind(json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"Props"),"WisMod")>-1,json.get(AtrMods,"Wisdom"),PrimeStat)]
[h:PrimeStat=if(listFind(json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"Props"),"ChaMod")>-1,json.get(AtrMods,"Charisma"),PrimeStat)]

[h:pm.TooltipVars()]

[h:TooltipPermissions=if(or(DMOnly==0,isGM()),1,0)]

[r,if(Frame.tooltip && TooltipPermissions),CODE:{
	[r,frame5("Ability Info"):{
		[r:'<html><div style="background-color: '+if(BorderColorOverride=="","#000000",BorderColorOverride)+'; color: '+if(TitleFontColorOverride=="","#FFFFFF",TitleFontColorOverride)+'; padding-top:2px; padding-bottom:10px; padding-left:8px; padding-right:8px; font-family:'+TitleFont.tooltip+'; "><b>Current Weapon</b> - '+json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"Name")+'<div style="background-color:'+BodyBackgroundFinal.tooltip+'; color: '+BodyTextFinal.tooltip+'; padding:2px; font-family:'+BodyFont.tooltip+';"><table style="font-size:1em; color: '+BodyTextFinal.tooltip+';"><tr><th style="'+FrameAccentFormat+'"><b>To Hit</b> '+VerticalFormat+'+'+(Proficiency+PrimeStat)+'</td></tr><tr><th style="'+FrameAccentFormat+'"><b>'+json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"DamageType")+' Damage</b>'+VerticalFormat+json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"DamageDie")+'</td></tr>'+if(json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"SecDamageDie")=="0","","<tr><th style='"+FrameAccentFormat+"'><b>"+json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"SecDamageType")+" Damage</b>"+VerticalFormat+json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"SecDamageDie")+"</td></tr>")+'<tr><th style="'+FrameAccentFormat+'"><b>Range</b>'+VerticalFormat+'5</td></tr></div></div></html>']}]
};{}]

[r,if(Mouseover.tooltip && TooltipPermissions),CODE:{[r:'<html><div style="background-color: '+if(BorderColorOverride=="","#000000",BorderColorOverride)+'; color: '+if(TitleFontColorOverride=="","#FFFFFF",TitleFontColorOverride)+'; padding-top:2px; padding-bottom:10px; padding-left:8px; padding-right:8px; font-family:'+TitleFont.tooltip+'; '+width.Setting+'"><b>Current Weapon</b> - '+json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"Name")+'<div style="background-color:'+BodyBackgroundFinal.tooltip+'; color: '+BodyTextFinal.tooltip+'; padding:2px; font-family:'+BodyFont.tooltip+';"><table style="font-size:1em; color: '+BodyTextFinal.tooltip+';"><tr><th style="'+AccentFormat+'"><b>To Hit</b> '+VerticalFormat+'+'+(Proficiency+PrimeStat)+'</td></tr><tr><th style="'+AccentFormat+'"><b>'+json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"DamageType")+' Damage</b>'+VerticalFormat+json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"DamageDie")+'</td></tr>'+if(json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"SecDamageDie")=="0","","<tr><th style='"+AccentFormat+"'><b>"+json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"SecDamageType")+" Damage</b>"+VerticalFormat+json.get(json.get(Weapon,json.get(Weapon,WhichHand)),"SecDamageDie")+"</td></tr>")+'<tr><th style="'+AccentFormat+'"><b>Range</b>'+VerticalFormat+'5</td></tr></div></div></html>']};{}]