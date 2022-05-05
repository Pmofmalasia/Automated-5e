[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:ParentToken=json.get(arg(0),"ParentToken")]

[h:pm.ChoiceMethod = json.get(arg(1),"ChoiceMethod")]
[h:pm.ThrowWeapon = json.get(arg(1),"ThrowWeapon")]
[h:pm.AttackNum = json.get(arg(1),"AttackNum")]

[h,if(pm.Tooltip),CODE:{
	[h,switch(pm.ChoiceMethod),CODE:
		case "NaturalWeapon": {
			[h:WeaponData = json.get(arg(1),"WeaponData")]
			[h:macro.return = json.set("","Table",json.set("",
				"ShowIfCondensed",1,
				"Header",json.get(WeaponData,"Name")+" Attack",
				"FalseHeader","",
				"FullContents","",
				"RulesContents",json.get(WeaponData,"DamageDie"),
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
		};
		case "SpecificEquippedWeapon": {
			
		};
		case "AnyValidEquipped": {
			[h:macro.return = json.set("","Table",json.set("",
				"ShowIfCondensed",1,
				"Header","Weapon Options",
				"FalseHeader","",
				"FullContents","",
				"RulesContents",json.get(json.get(Weapon,json.get(Weapon,0)),"Name")+" or "+json.get(json.get(Weapon,json.get(Weapon,1)),"Name"),
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
		}
	]
};{
	[h,switch(pm.ChoiceMethod),CODE:
		case "NaturalWeapon": {
			[h:WeaponData = json.get(arg(1),"WeaponData")]
			[h:AttackData = json.set("",
				"Hand",-1,
				"WeaponData",WeaponData
			)]
		};
		case "SpecificEquippedWeapon": {
			
		};
		case "AnyValidEquipped": {
			[h:abort(input(
				"choice.Weapon | "+json.get(json.get(Weapon,json.get(Weapon,0)),"Name")+","+json.get(json.get(Weapon,json.get(Weapon,1)),"Name")+" | Choose a Weapon | RADIO "
				))]
			[h:WeaponData = json.get(Weapon,json.get(Weapon,choice.Weapon))]
			[h:AttackData = json.set("",
				"Hand",choice.Weapon,
				"WeaponData",WeaponData
			)]
		}
	]
	
	[h:AttackData = json.set(AttackData,
		"Throw Weapon",pm.ThrowWeapon,
		"AttackNum",pm.AttackNum,
		"ParentToken",ParentToken
	)]
	
	[h,macro("Attack@Lib:pm.a5e.Core"): AttackData]
	[h:macro.return = macro.return]
}]