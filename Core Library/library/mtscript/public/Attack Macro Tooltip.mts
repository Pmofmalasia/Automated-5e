[h:BorderColorOverride=json.get(macro.args,"BorderColorOverride")]
[h:TitleFontColorOverride=json.get(macro.args,"TitleFontColorOverride")]
[h:TitleFont=json.get(macro.args,"TitleFont")]
[h:BodyFont=json.get(macro.args,"BodyFont")]
[h:tooltipDisplaySizeOverride=json.get(macro.args,"tooltipDisplaySizeOverride")]

[h,if(json.contains(macro.args,"WeaponData")):
	WeaponData = json.get(macro.args,"WeaponData");
	WeaponData = json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),json.get(macro.args,"WhichHand")))
]

[h:needsSplitGMOutput=json.get(macro.args,"needsSplitGMOutput")]
[h:PrimeStat=if(listFind(json.get(WeaponData,"Props"),"Finesse")>-1,max(json.get(getProperty("a5e.stat.AtrMods"),"Dexterity"),json.get(getProperty("a5e.stat.AtrMods"),"Strength")),json.get(getProperty("a5e.stat.AtrMods"),"Strength"))]
[h:PrimeStat=if(listFind(json.get(WeaponData,"Props"),"Ammunition")>-1,json.get(getProperty("a5e.stat.AtrMods"),"Dexterity"),PrimeStat)]
[h:PrimeStat=if(listFind(json.get(WeaponData,"Props"),"WisMod")>-1,json.get(getProperty("a5e.stat.AtrMods"),"Wisdom"),PrimeStat)]
[h:PrimeStat=if(listFind(json.get(WeaponData,"Props"),"ChaMod")>-1,json.get(getProperty("a5e.stat.AtrMods"),"Charisma"),PrimeStat)]

[h:pm.TooltipVars()]

[h:TooltipPermissions=if(or(needsSplitGMOutput==0,isGM()),1,0)]

[r,if(Frame.tooltip && TooltipPermissions),CODE:{
	[r,frame5("Ability Info"):{
		[r:'<html><div style="background-color: '+if(BorderColorOverride=="","#000000",BorderColorOverride)+'; color: '+if(TitleFontColorOverride=="","#FFFFFF",TitleFontColorOverride)+'; padding-top:2px; padding-bottom:10px; padding-left:8px; padding-right:8px; font-family:'+TitleFont.tooltip+'; "><b>Current Weapon</b> - '+json.get(WeaponData,"Name")+'<div style="background-color:'+BodyBackgroundFinal.tooltip+'; color: '+BodyTextFinal.tooltip+'; padding:2px; font-family:'+BodyFont.tooltip+';"><table style="font-size:1em; color: '+BodyTextFinal.tooltip+';"><tr><th style="'+FrameAccentFormat+'"><b>To Hit</b> '+VerticalFormat+'+'+(getProperty("a5e.stat.Proficiency")+PrimeStat)+'</td></tr><tr><th style="'+FrameAccentFormat+'"><b>'+json.get(WeaponData,"DamageType")+' Damage</b>'+VerticalFormat+json.get(WeaponData,"DamageDie")+'</td></tr>'+if(json.get(WeaponData,"SecDamageDie")=="0","","<tr><th style='"+FrameAccentFormat+"'><b>"+json.get(WeaponData,"SecDamageType")+" Damage</b>"+VerticalFormat+json.get(WeaponData,"SecDamageDie")+"</td></tr>")+'<tr><th style="'+FrameAccentFormat+'"><b>Range</b>'+VerticalFormat+'5</td></tr></div></div></html>']}]
};{}]

[r,if(Mouseover.tooltip && TooltipPermissions),CODE:{[r:'<html><div style="background-color: '+if(BorderColorOverride=="","#000000",BorderColorOverride)+'; color: '+if(TitleFontColorOverride=="","#FFFFFF",TitleFontColorOverride)+'; padding-top:2px; padding-bottom:10px; padding-left:8px; padding-right:8px; font-family:'+TitleFont.tooltip+'; '+width.Setting+'"><b>Current Weapon</b> - '+json.get(WeaponData,"Name")+'<div style="background-color:'+BodyBackgroundFinal.tooltip+'; color: '+BodyTextFinal.tooltip+'; padding:2px; font-family:'+BodyFont.tooltip+';"><table style="font-size:1em; color: '+BodyTextFinal.tooltip+';"><tr><th style="'+AccentFormat+'"><b>To Hit</b> '+VerticalFormat+'+'+(getProperty("a5e.stat.Proficiency")+PrimeStat)+'</td></tr><tr><th style="'+AccentFormat+'"><b>'+json.get(WeaponData,"DamageType")+' Damage</b>'+VerticalFormat+json.get(WeaponData,"DamageDie")+'</td></tr>'+if(json.get(WeaponData,"SecDamageDie")=="0","","<tr><th style='"+AccentFormat+"'><b>"+json.get(WeaponData,"SecDamageType")+" Damage</b>"+VerticalFormat+json.get(WeaponData,"SecDamageDie")+"</td></tr>")+'<tr><th style="'+AccentFormat+'"><b>Range</b>'+VerticalFormat+'5</td></tr></div></div></html>']};{}]