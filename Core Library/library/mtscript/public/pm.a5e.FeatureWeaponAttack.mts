[h:WeaponAttackData = arg(1)]
[h:pm.ChoiceMethod = json.get(WeaponAttackData,"ChoiceMethod")]
[h:pm.ThrowWeapon = json.get(WeaponAttackData,"ThrowWeapon")]
[h:pm.AttackNum = json.get(WeaponAttackData,"AttackNum")]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h,if(IsTooltip),CODE:{
	[h,switch(pm.ChoiceMethod),CODE:
		case "NaturalWeapon": {
			[h:WeaponData = json.get(WeaponAttackData,"WeaponData")]
			[h:weaponAttackTableLine = json.set("",
				"ShowIfCondensed",1,
				"Header",json.get(WeaponData,"Name")+" Attack",
				"FalseHeader","",
				"FullContents","",
				"RulesContents",json.get(WeaponData,"DamageDie"),
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			)]
		};
		case "SpecificEquippedWeapon": {
			
		};
		case "AnyValidEquipped": {
			[h:weaponAttackTableLine = json.set("",
				"ShowIfCondensed",1,
				"Header","Weapon Options",
				"FalseHeader","",
				"FullContents","",
				"RulesContents",json.get(json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),0)),"Name")+" or "+json.get(json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),1)),"Name"),
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			)]
		}
	]
	[h:abilityTable = json.append(abilityTable,weaponAttackTableLine)]
};{
	[h,switch(pm.ChoiceMethod),CODE:
		case "NaturalWeapon": {
			[h:WeaponData = json.get(WeaponAttackData,"WeaponData")]
			[h:AttackData = json.set("",
				"Hand",-1,
				"WeaponData",WeaponData
			)]
		};
		case "SpecificEquippedWeapon": {
			
		};
		case "AnyValidEquipped": {
			[h:abort(input(
				"choice.Weapon | "+json.get(json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),0)),"Name")+","+json.get(json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),1)),"Name")+" | Choose a Weapon | RADIO "
				))]
			[h:WeaponData = json.get(getProperty("a5e.stat.Weapon"),json.get(getProperty("a5e.stat.Weapon"),choice.Weapon))]
			[h:AttackData = json.set("",
				"Hand",choice.Weapon,
				"WeaponData",WeaponData
			)]
		}
	]
	
	[h:AttackData = json.set(AttackData,
		"ThrowWeapon",pm.ThrowWeapon,
		"AttackNum",pm.AttackNum,
		"ParentToken",ParentToken
	)]
	
	[h,macro("Attack@Lib:pm.a5e.Core"): AttackData]
	[h:WeaponAttackInfo = macro.return]

	[h:abilityTable = json.merge(abilityTable,json.get(WeaponAttackInfo,"Table"))]
	[h:effectsToMerge = json.get(WeaponAttackInfo,"Effect")]

	[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

	[h:pm.a5e.EffectData = macro.return]
}]