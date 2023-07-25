
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

[h:BorderColorOverride=json.get(macro.args,"BorderColorOverride")]
[h:TitleFontColorOverride=json.get(macro.args,"TitleFontColorOverride")]
[h:TitleFont=json.get(macro.args,"TitleFont")]
[h:BodyFont=json.get(macro.args,"BodyFont")]
[h:tooltipDisplaySizeOverride=json.get(macro.args,"tooltipDisplaySizeOverride")]
[h:pm.TooltipVars()]

[h:TooltipPermissions=if(or(DMOnly==0,isGM()),1,0)]

[h:abilityTable = "[]"]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","To Hit",
	"FullContents","",
	"RollContents","",
	"RulesContents","+"+(getProperty("a5e.stat.Proficiency")+json.get(getProperty("a5e.stat.AtrMods"),PrimeStat)),
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,foreach(damageInstance,json.get(wa.WeaponUsed,"WeaponDamage")): 
	abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",json.get(damageInstance,"DamageType")+" Damage",
		"FullContents","",
		"RollContents","",
		"RulesContents",json.get(damageInstance,"DamageDieNumber")+"d"+json.get(damageInstance,"DamageDieSize")+if(json.get(damageInstance,"IsModBonus") == 1," + "+json.get(getProperty("a5e.stat.AtrMods"),PrimeStat),""),
		"DisplayOrder","['Rules','Roll','Full']"
))]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header",if(wa.MeleeRanged=="Ranged","Range","Reach"),
	"FullContents","",
	"RollContents","",
	"RulesContents",if(wa.MeleeRanged=="Ranged",json.get(wa.WeaponUsed,"Range")+"/"+json.get(wa.WeaponUsed,"LongRange"),json.get(wa.WeaponUsed,"Reach")),
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:macro.return = json.set("","Table",abilityTable,"Description",base64.decode(json.get(wa.WeaponUsed,"Description")))]