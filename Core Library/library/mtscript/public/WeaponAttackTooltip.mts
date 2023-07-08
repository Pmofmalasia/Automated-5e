
[h:wa.Data = macro.args]
[h:IsTooltip = 0]
[h:ParentToken = json.get(wa.Data,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Attack"]
[h:pm.a5e.EffectData = "[]"]

[h:ActiveHand = json.get(wa.Data,"Hand")]
[h:OtherHands = "[]"]
[h:CurrentHeldItems = getProperty("a5e.stat.HeldItems")]
[h:TotalHands = json.length(CurrentHeldItems)]
[h,if(ActiveHand >= 0),CODE:{
	[h,count(TotalHands): OtherHands = if(roll.count == ActiveHand,OtherHands,json.append(OtherHands,roll.count))]
	[h:OtherHandsIDs = json.remove(CurrentHeldItems,ActiveHand)]
};{
	[h:"<!-- Note: ActiveHand -1 indicates natural weapon not using a hand -->"]
	[h,count(TotalHands): OtherHands = json.append(OtherHands,roll.count)]
	[h:OtherHandsIDs = CurrentHeldItems]
}]

[h:Flavor = json.get(wa.Data,"Flavor")]
[h:AttackNum = json.get(wa.Data,"AttackNum")]
[h:ThrowingWeapon = json.get(wa.Data,"ThrowWeapon")]
[h:TwoWeaponFighting = json.get(wa.Data,"TwoWeaponFighting")]
[h,if(TwoWeaponFighting == ""): TwoWeaponFighting = 0]
[h:DMOnly = json.get(wa.Data,"DMOnly")]
[h:DMOnly = 0]
[h:ShowFullRules = 1]
[h:wa.WeaponUsed = json.get(wa.Data,"WeaponData")]
[h:wa.EffectIDs = json.get(wa.Data,"ID")]
[h,if(wa.EffectIDs == ""): wa.EffectIDs = "[]"]

[h:DMOnly=json.get(macro.args,"DMOnly")]
[h:wa.WeaponMeleeRanged = json.get(wa.WeaponUsed,"WeaponMeleeRanged")]
[h:wa.MeleeRanged = wa.WeaponMeleeRanged]
[h:PrimeStat = if(wa.MeleeRanged=="Ranged","Dexterity","Strength")]
[h,if(json.get(wa.WeaponUsed,"PrimeStat")!=""): PrimeStat = json.get(wa.WeaponUsed,"PrimeStat")]

[h:pm.TooltipVars()]

[h:TooltipPermissions=if(or(DMOnly==0,isGM()),1,0)]

[r,if(Frame.tooltip && TooltipPermissions),CODE:{
	[r,frame5("Ability Info"):{
		[r:'<html><div style="background-color: '+if(BorderColorOverride=="","#000000",BorderColorOverride)+'; color: '+if(TitleFontColorOverride=="","#FFFFFF",TitleFontColorOverride)+'; padding-top:2px; padding-bottom:10px; padding-left:8px; padding-right:8px; font-family:'+TitleFont.tooltip+'; "><b>Current Weapon</b> - '+json.get(wa.WeaponUsed,"Name")+'<div style="background-color:'+BodyBackgroundFinal.tooltip+'; color: '+BodyTextFinal.tooltip+'; padding:2px; font-family:'+BodyFont.tooltip+';"><table style="font-size:1em; color: '+BodyTextFinal.tooltip+';"><tr><th style="'+FrameAccentFormat+'"><b>To Hit</b> '+VerticalFormat+'+'+(getProperty("a5e.stat.Proficiency")+PrimeStat)+'</td></tr><tr><th style="'+FrameAccentFormat+'"><b>'+json.get(wa.WeaponUsed,"DamageType")+' Damage</b>'+VerticalFormat+json.get(wa.WeaponUsed,"DamageDieNumber")+"d"+json.get(wa.WeaponUsed,"DamageDieSize")+'</td></tr><tr><th style="'+FrameAccentFormat+'"><b>'+if(wa.MeleeRanged=="Ranged","Range","Reach")+'</b>'+VerticalFormat+if(wa.MeleeRanged=="Ranged",json.get(wa.WeaponUsed,"Range")+"/"+json.get(wa.WeaponUsed,"LongRange"),json.get(wa.WeaponUsed,"Reach"))+'</td></tr></div></div></html>']}]
};{}]

[r,if(Mouseover.tooltip && TooltipPermissions),CODE:{[r:'<html><div style="background-color: '+if(BorderColorOverride=="","#000000",BorderColorOverride)+'; color: '+if(TitleFontColorOverride=="","#FFFFFF",TitleFontColorOverride)+'; padding-top:2px; padding-bottom:10px; padding-left:8px; padding-right:8px; font-family:'+TitleFont.tooltip+'; '+width.Setting+'"><b>Current Weapon</b> - '+json.get(WeaponData,"Name")+'<div style="background-color:'+BodyBackgroundFinal.tooltip+'; color: '+BodyTextFinal.tooltip+'; padding:2px; font-family:'+BodyFont.tooltip+';"><table style="font-size:1em; color: '+BodyTextFinal.tooltip+';"><tr><th style="'+AccentFormat+'"><b>To Hit</b> '+VerticalFormat+'+'+(getProperty("a5e.stat.Proficiency")+PrimeStat)+'</td></tr><tr><th style="'+AccentFormat+'"><b>'+json.get(WeaponData,"DamageType")+' Damage</b>'+VerticalFormat+json.get(WeaponData,"DamageDie")+'</td></tr>'+if(json.get(WeaponData,"SecDamageDie")=="0","","<tr><th style='"+AccentFormat+"'><b>"+json.get(WeaponData,"SecDamageType")+" Damage</b>"+VerticalFormat+json.get(WeaponData,"SecDamageDie")+"</td></tr>")+'<tr><th style="'+AccentFormat+'"><b>Range</b>'+VerticalFormat+'5</td></tr></div></div></html>']};{}]