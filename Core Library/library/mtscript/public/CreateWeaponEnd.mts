[h:WeaponData = json.get(getLibProperty("ct.NewWeapon","Lib:pm.a5e.Core"),getPlayerName())]
[h:WeaponName = json.get(WeaponData,"Name")]
[h:weaponSourcebook = json.get(WeaponData,"Sourcebook")]

[h:WeaponData = json.remove(WeaponData,"Sourcebook")]
[h:WeaponData = json.remove(WeaponData,"EffectsNumber")]
[h:WeaponData = json.remove(WeaponData,"SpecialEffects")]
[h:WeaponData = json.remove(WeaponData,"FinalLocation")]
[h:WeaponData = json.remove(WeaponData,"ParentToken")]

[h:newTemplateTest = json.get(WeaponData,"NewTemplate")]
[h:WeaponData = json.remove(WeaponData,"NewTemplate")]

[h:"<!-- Need to add a method of checking for multiple unnamed unique effects to make them be named (or marked as all the same effect). Will likely need to be done prior to calling this macro by shunting off to another one since it would involve another interface. -->"]

[h:"<!-- Removes the dummy subeffect used to show to the subeffect creation JS -->"]
[h:WeaponEffects = json.get(WeaponData,"Effects")]
[h:WeaponEffects = json.path.delete(WeaponEffects,"[*]['Subeffects'][?(@.isDummySubeffect==1)]")]

[h:"<!-- TODO: Remove this shifting of Subeffects to WeaponEffects when fixed (see CreateObjectProcessing note) -->"]
[h:WeaponData = json.set(WeaponData,"WeaponEffects",WeaponEffects)]
[h:WeaponData = json.remove(WeaponData,"Effects")]
[h:WeaponData = json.remove(WeaponData,"isEffectRandom")]

[h:setLibProperty("ct.NewWeapon",json.remove(getLibProperty("ct.NewWeapon","Lib:pm.a5e.Core"),getPlayerName()),"Lib:pm.a5e.Core")]
[h:ParentToken = json.get(macro.args,"ParentToken")]
[h,if(ParentToken == ""),CODE:{
	[h,if(newTemplateTest),CODE:{
		[h:setLibProperty("sb.WeaponTypes",json.append(getLibProperty("sb.WeaponTypes","Lib:"+json.get(WeaponData,"Library")),WeaponData),"Lib:"+json.get(WeaponData,"Library"))]
	};{}]

	[h:setLibProperty("sb.Objects",json.append(getLibProperty("sb.Objects","Lib:"+json.get(WeaponData,"Library")),WeaponData),"Lib:"+json.get(WeaponData,"Library"))]
};{
	[h:switchToken(ParentToken)]

	[h:ItemID = eval("1d10000") + json.get(getInfo("client"),"timeInMs")]
	[h:WeaponData = json.set(WeaponData,"ItemID",ItemID)]
	[h,if(json.get(WeaponData,"WeaponType") == "NaturalWeapon" || json.get(WeaponData,"WeaponType") == "Unarmed"),CODE:{
		[h:setProperty("a5e.stat.NaturalWeapons",json.append(getProperty("a5e.stat.NaturalWeapons"),WeaponData))]

		[h:NewWeaponCommand = '[h,MACRO("SingleAttack@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken(),"NaturalWeaponID",'+ItemID+',"IsTooltip",0)]']

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
			"label",json.get(WeaponData,"DisplayName"),
			"maxWidth","",
			"minWidth",89,
			"playerEditable",0,
			"tooltip",'[h,MACRO("SingleAttack@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken(),"NaturalWeaponID",'+ItemID+',"IsTooltip",1)]',
			"delim","json"
		)]

		[h:createMacro(NewWeaponMacroProps)]		
	};{
		[h:setProperty("a5e.stat.Inventory",json.append(getProperty("a5e.stat.Inventory"),WeaponData))]
	}]
}]

[h:broadcast("Weapon "+json.get(WeaponData,"DisplayName")+" created.")]