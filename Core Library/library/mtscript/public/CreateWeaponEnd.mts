[h:WeaponData = json.get(getLibProperty("ct.NewWeapon","Lib:pm.a5e.Core"),getPlayerName())]
[h:WeaponName = json.get(WeaponData,"Name")]
[h:weaponSourcebook = json.get(WeaponData,"Sourcebook")]

[h:WeaponData = json.remove(WeaponData,"Sourcebook")]
[h:WeaponData = json.remove(WeaponData,"multiEffects")]
[h:WeaponData = json.remove(WeaponData,"SpecialEffects")]
[h:WeaponData = json.remove(WeaponData,"FinalLocation")]
[h:WeaponData = json.remove(WeaponData,"ParentToken")]

[h:"<!-- Need to add a method of checking for multiple unnamed unique effects to make them be named (or marked as all the same effect). Will likely need to be done prior to calling this macro by shunting off to another one since it would involve another interface. -->"]

[h:setLibProperty("ct.NewWeapon",json.remove(getLibProperty("ct.NewWeapon","Lib:pm.a5e.Core"),getPlayerName()),"Lib:pm.a5e.Core")]
[h:ParentToken = json.get(macro.args,"ParentToken")]
[h,if(ParentToken == ""),CODE:{
	[h:"<!-- Adapt CreateObjectProcessing code to here -->"]
};{
	[h:switchToken(ParentToken)]

	[h:"<!-- Removes the dummy subeffect used to show to the subeffect creation JS -->"]
	[h:WeaponSubeffects = json.get(WeaponData,"Subeffects")]
	[h:WeaponSubeffects = json.remove(WeaponSubeffects,0)]
	[h:WeaponData = json.set(WeaponData,"Subeffects",WeaponSubeffects)]

	[h:ItemID = eval("1d1000000") + json.get(getInfo("client"),"timeInMs")]
	[h:WeaponData = json.set(WeaponData,"ItemID",ItemID)]
	[h,if(json.get(WeaponData,"WeaponType") == "NaturalWeapon" || json.get(WeaponData,"WeaponType") == "Unarmed"),CODE:{

		[h:setProperty("a5e.stat.NaturalWeapons",json.append(getProperty("a5e.stat.NaturalWeapons"),WeaponData))]

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
			"label",json.get(WeaponData,"DisplayName"),
			"maxWidth","",
			"minWidth",89,
			"playerEditable",0,
			"tooltip",'[h:TooltipData=json.set("","tooltipDisplaySizeOverride",200,"ParentToken",currentToken(),"NaturalWeaponID",'+NaturalWeaponID+')][MACRO("AttackMacroTooltip@Lib:pm.a5e.Core"):TooltipData]',
			"delim","json"
		)]

		[h:createMacro(NewWeaponMacroProps)]		
	};{
		[h:setProperty("a5e.stat.Inventory",json.append(getProperty("a5e.stat.Inventory"),WeaponData))]
	}]
}]

[h:broadcast("Weapon "+json.get(WeaponData,"DisplayName")+" created.")]