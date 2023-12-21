[h:AttackData = macro.args]
[h:ParentToken = json.get(AttackData,"ParentToken")]
[h:switchToken(ParentToken)]

[h,if(json.get(AttackData,"Hand") == "" || json.get(AttackData,"Hand") == -1),CODE:{
	[h:AttackData = json.set(AttackData,"Hand",-1)]

	[h,if(json.contains(AttackData,"WeaponData")),CODE:{
		[h:WeaponData = json.get(AttackData,"WeaponData")]
	};{
		[h:NaturalWeaponID = json.get(AttackData,"NaturalWeaponID")]
		[h:tempNaturalWeaponData = json.path.read(getProperty("a5e.stat.NaturalWeapons"),"\$[*][?(@.ItemID == '"+NaturalWeaponID+"')]")]
		[h,if(json.isEmpty(tempNaturalWeaponData)):
			WeaponData = json.get(getProperty("a5e.stat.NaturalWeapons"),0);
			WeaponData = json.get(tempNaturalWeaponData,0)
		]
	}]
};{
	[h:CurrentHeldItems = getProperty("a5e.stat.HeldItems")]
	[h:ActiveHand = json.get(AttackData,"Hand")]
	[h,if(ActiveHand >=0 && ActiveHand < json.length(CurrentHeldItems)):
		WeaponID = json.get(CurrentHeldItems,ActiveHand);
		WeaponID = ""
	]
	[h,if(WeaponID == ""),CODE:{
		[h:WeaponData = json.get(getProperty("a5e.stat.NaturalWeapons"),0)]
	};{
		[h:tempWeaponData = json.path.read(getProperty("a5e.stat.Inventory"),"\$[*][?(@.ItemID == '"+WeaponID+"')]")]
		[h,if(json.isEmpty(tempWeaponData)):
			WeaponData = json.get(getProperty("a5e.stat.NaturalWeapons"),0);
			WeaponData = json.get(tempWeaponData,0)
		]
	}]
}]
[h:ThrowWeapon = number(json.get(AttackData,"Throw"))]

[h:AttackData = json.set(AttackData,
	"WeaponData",WeaponData,
	"ThrowWeapon",ThrowWeapon,
	"AttackNum",-1,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy")
)]

[h:IsTooltip = number(json.get(AttackData,"IsTooltip"))]
[h,if(IsTooltip),CODE:{
	[h,macro("WeaponAttackTooltip@Lib:pm.a5e.Core"): AttackData]
	[h:abilityTable = json.get(macro.return,"Table")]
	[h:AttackDescription = json.get(macro.return,"Description")]

	[h:ClassFeatureData = json.set("",
		"Flavor",json.get(WeaponData,"Flavor"),
		"ParentToken",ParentToken,
		"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
		"Class","zzWeaponAttack",
		"Name","Current Weapon: "+if(ThrowWeapon,"Throwing ","")+json.get(WeaponData,"DisplayName"),
		"FalseName","Weapon Attack",
		"Effect",AttackDescription,
		"abilityTable",abilityTable
	)]
	[r:pm.TooltipOutput(ClassFeatureData)]
};{
	[h:pm.a5e.EffectData = "[]"]

	[h,macro("Attack@Lib:pm.a5e.Core"): AttackData]
	[h:abilityTable = json.get(macro.return,"Table")]
	[h:effectsToMerge = json.get(macro.return,"Effect")]

	[h:pm.a5e.BaseEffectData = json.set("",
		"Class","zzWeaponAttack",
		"DisplayName",if(ThrowWeapon,"Thrown ","")+json.get(WeaponData,"DisplayName")+" Attack",
		"Type","WeaponAttack",
		"ID",pm.a5e.GenerateEffectID(),
		"ParentToken",ParentToken
	)]

	[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData)]
	[h:pm.a5e.EffectData = macro.return]
	[h,if(!json.isEmpty(pm.a5e.EffectData)): setLibProperty("gd.Effects",json.merge(data.getData("addon:","pm.a5e.core","gd.Effects"),pm.a5e.EffectData),"Lib:pm.a5e.Core")]

	[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]

	[h:BorderData = json.set("",
		"Flavor",json.get(AttackData,"Flavor"),
		"Name",json.get(WeaponData,"Name")+"Attack",
		"DisplayName",json.get(WeaponData,"DisplayName")+" Attack",
		"FalseName","Weapon Attack",
		"DisplayClass","zzWeaponAttack",
		"ColorSubtype",""
	)]
	[h:AllOutputComponents = json.set("",
		"ParentToken",ParentToken,
		"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
		"BorderData",BorderData,
		"Table",abilityTable,
		"ShowFullRulesType",json.append("","WeaponAttack","Attack"),
		"OutputTargets","",
		"Description",base64.decode(json.get(WeaponData,"Description")),
		"AbridgedDescription",base64.decode(json.get(WeaponData,"AbridgedDescription"))
	)]
	
	[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]
}]