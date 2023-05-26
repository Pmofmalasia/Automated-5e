[h:MonsterWeaponData = macro.args]
[h:MonsterWeaponData = pm.a5e.KeyStringsToNumbers(MonsterWeaponData)]
[h:ParentToken = json.get(MonsterWeaponData,"ParentToken")]
[h:switchToken(ParentToken)]

[h,if(json.get(MonsterWeaponData,"WeaponType")=="@@NewType"),CODE:{
	[h:MonsterWeaponData = json.set(MonsterWeaponData,"WeaponType",pm.RemoveSpecial(json.get(MonsterWeaponData,"NewTypeName")))]
	[h:MonsterWeaponData = json.remove(MonsterWeaponData,"NewTypeName")]
	[h:MonsterWeaponData = json.remove(MonsterWeaponData,"isNewTemplate")]
};{}]

[h:MonsterWeaponData = ct.a5e.WeaponDataProcessing(MonsterWeaponData)]

[h:MonsterWeaponData = json.set(MonsterWeaponData,"Type","Weapon")]

[h:closeDialog("MonsterWeaponCreation")]

[h,if(json.get(MonsterWeaponData,"SpecialEffects")!="None"),CODE:{
	[h:MonsterWeaponData = json.set(MonsterWeaponData,"FinalLocation","Inventory")]

	[h,if(json.get(MonsterWeaponData,"SpecialEffects")=="SameSubeffect"),CODE:{
		[h:EffectNumber = 1]
		[h:WhichSubeffect = 1]
	};{
		[h:EffectNumber = 1 + json.get(MonsterWeaponData,"EffectNumber")]
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
		"Damage",json.get(MonsterWeaponData,"WeaponDamage")
	)]
	[h:MonsterWeaponData = json.set(MonsterWeaponData,"Subeffects",json.append("",DummyWeaponSubeffect))]

    [h:AllWeaponData = json.set(getLibProperty("ct.NewWeapon","pm.a5e.Core"),getPlayerName(),MonsterWeaponData)]
    [h:setLibProperty("ct.NewWeapon",AllWeaponData,"Lib:pm.a5e.Core")]
    [h,MACRO("CreateSubeffect@Lib:pm.a5e.Core"): json.set("",
        "EffectType","Weapon",
		"EffectNumber",EffectNumber,
        "WhichSubeffect",WhichSubeffect,
        "ParentToken",currentToken(),
		"ExtraData",json.set("","WeaponSpecialEffectChoice",json.get(MonsterWeaponData,"SpecialEffects"))
    )]
};{
	[h:MonsterWeaponData = json.remove(MonsterWeaponData,"ParentToken")]
	[h:MonsterWeaponData = json.remove(MonsterWeaponData,"SpecialEffects")]

	[h,if(json.get(MonsterWeaponData,"WeaponType") == "NaturalWeapon" || json.get(MonsterWeaponData,"WeaponType") == "Unarmed"),CODE:{
		[h:NaturalWeaponID = eval("1d1000000") + json.get(getInfo("client"),"timeInMs")]
		[h:MonsterWeaponData = json.set(MonsterWeaponData,
			"ItemID",NaturalWeaponID
		)]

		[h:setProperty("a5e.stat.NaturalWeapons",json.append(getProperty("a5e.stat.NaturalWeapons"),MonsterWeaponData))]

		[h:NewWeaponCommand = '[h,MACRO("SingleAttack@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken(),"NaturalWeaponID",'+NaturalWeaponID+')]']

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
			"tooltip",'[h:TooltipData=json.set("","tooltipDisplaySizeOverride",200,"ParentToken",currentToken(),"NaturalWeaponID",'+NaturalWeaponID+')][MACRO("AttackMacroTooltip@Lib:pm.a5e.Core"):TooltipData]',
			"delim","json"
		)]

		[h:createMacro(NewWeaponMacroProps)]		
	};{
		[h:setProperty("a5e.stat.Inventory",json.append(getProperty("a5e.stat.Inventory"),MonsterWeaponData))]
	}]
}]