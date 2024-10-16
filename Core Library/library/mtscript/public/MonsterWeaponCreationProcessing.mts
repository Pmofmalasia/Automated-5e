[h:MonsterWeaponData = macro.args]
[h:MonsterWeaponData = pm.a5e.KeyStringsToNumbers(MonsterWeaponData)]
[h:ParentToken = json.get(MonsterWeaponData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:MonsterWeaponData = json.set(MonsterWeaponData,"Name",pm.RemoveSpecial(json.get(MonsterWeaponData,"DisplayName")))]

[h,if(json.get(MonsterWeaponData,"WeaponType")=="@@NewType"),CODE:{
	[h:MonsterWeaponData = json.set(MonsterWeaponData,"WeaponType",pm.RemoveSpecial(json.get(MonsterWeaponData,"NewTypeNameWeapon")))]
	[h:MonsterWeaponData = json.remove(MonsterWeaponData,"NewTypeNameWeapon")]
	[h:MonsterWeaponData = json.remove(MonsterWeaponData,"isNewTemplateWeapon")]
};{}]

[h:MonsterWeaponData = ct.a5e.WeaponDataProcessing(MonsterWeaponData)]

[h:MonsterWeaponData = json.set(MonsterWeaponData,"Type","Weapon")]

[h:closeDialog("MonsterWeaponCreation")]

[h,if(json.get(MonsterWeaponData,"SpecialEffects")!="None"),CODE:{
	[h:MonsterWeaponData = json.set(MonsterWeaponData,"FinalLocation","Inventory")]

	[h,if(json.get(MonsterWeaponData,"SpecialEffects")=="SameSubeffect"),CODE:{
		[h:EffectsNumber = 1]
		[h:WhichSubeffect = 1]
	};{
		[h:EffectsNumber = json.get(MonsterWeaponData,"EffectsNumber")]
		[h,if(json.get(MonsterWeaponData,"SpecialEffects")=="Mixed"):
			WhichSubeffect = 1;
			WhichSubeffect = 2
		]
	}]

	[h:DummyAttackSubeffect = json.set("",
		"MeleeRanged",json.get(MonsterWeaponData,"WeaponMeleeRanged"),
		"CritThresh",json.get(MonsterWeaponData,"CritThresh")
	)]
	[h:DummyWeaponSubeffect = json.set("",
		"Attack",DummyAttackSubeffect,
		"Damage",json.get(MonsterWeaponData,"WeaponDamage"),
		"isDummySubeffect",1
	)]
	[h:MonsterWeaponData = json.set(MonsterWeaponData,"Effects",json.append("",json.set("","Subeffects",json.append("",DummyWeaponSubeffect))))]

    [h:AllWeaponData = json.set(data.getData("addon:","pm.a5e.core","ct.NewWeapon"),getPlayerName(),MonsterWeaponData)]
    [h:setLibProperty("ct.NewWeapon",AllWeaponData,"Lib:pm.a5e.Core")]
    [h,MACRO("CreateSubeffect@Lib:pm.a5e.Core"): json.set("",
        "EffectType","Weapon",
		"EffectsNumber",EffectsNumber,
        "WhichSubeffect",WhichSubeffect,
        "ParentToken",currentToken(),
		"ExtraData",json.set("","WeaponSpecialEffectChoice",json.get(MonsterWeaponData,"SpecialEffects"))
    )]
};{
	[h:MonsterWeaponData = json.remove(MonsterWeaponData,"ParentToken")]
	[h:MonsterWeaponData = json.remove(MonsterWeaponData,"SpecialEffects")]
	[h:ItemID = eval("1d10000") + "a5e" + json.get(getInfo("client"),"timeInMs")]
	[h:MonsterWeaponData = json.set(MonsterWeaponData,"ItemID",ItemID)]

	[h,if(json.get(MonsterWeaponData,"WeaponType") == "NaturalWeapon" || json.get(MonsterWeaponData,"WeaponType") == "Unarmed"),CODE:{
		[h:setProperty("a5e.stat.NaturalWeapons",json.append(getProperty("a5e.stat.NaturalWeapons"),MonsterWeaponData))]

		[h:NewWeaponCommand = '[h,MACRO("SingleAttack@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken(),"NaturalWeaponID","'+ItemID+'")]']

		[h:NewWeaponMacroProps = json.set("",
			"applyToSelected",0,
			"autoExecute",1,
			"color","black",
			"command",NewWeaponCommand,
			"fontColor","white",
			"fontSize","1.00em",
			"includeLabel",0,
			"group","Combat",
			"sortBy","",
			"label",json.get(MonsterWeaponData,"DisplayName"),
			"maxWidth","",
			"minWidth",89,
			"playerEditable",0,
			"tooltip",'[MACRO("SingleAttack@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken(),"NaturalWeaponID","'+ItemID+'","IsTooltip",1)]',
			"delim","json"
		)]

		[h:createMacro(NewWeaponMacroProps)]		
	};{
		[h,MACRO:("AddItemToken@Lib:pm.a5e.Core"): json.set("","Item",MonsterWeaponData,"ParentToken",ParentToken,"NumberAdded",1)]
	}]
}]