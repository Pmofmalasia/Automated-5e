[h:MonsterWeaponData = macro.args]
[h:MonsterWeaponData = pm.a5e.KeyStringsToNumbers(MonsterWeaponData)]
[h:ParentToken = json.get(MonsterWeaponData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:NewWeaponProps = json.set("",
    "Ammo",0,
    "Magic",(json.get(MonsterWeaponData,"WeaponMagicBonus") > 0),
    "Finesse",0,
    "Heavy",0,
    "Light",0,
    "Loading",0,
    "Reach",0,
    "Thrown",0,
    "Two-Handed",0,
    "Versatile",0,
    "IntMod",0,
    "WisMod",0,
    "ChaMod",0,
    "PrimeStat",json.get(MonsterWeaponData,"WeaponStat"),
    "DmgMod",json.contains(MonsterWeaponData,"WeaponAddDmgMod"),
    "CastingFocus",0
)]

[h:NewWeaponData = json.set("",
    "Name",json.get(MonsterWeaponData,"DisplayName"),
    "Type",json.get(MonsterWeaponData,"WeaponType"),
    "Class",json.get(MonsterWeaponData,"WeaponClass"),
    "DamageDie",json.get(MonsterWeaponData,"WeaponDamageNumber")+"d"+json.get(MonsterWeaponData,"WeaponDamageDie"),
    "DamageType",json.get(MonsterWeaponData,"WeaponDamageType"),
    "Type",json.get(MonsterWeaponData,"WeaponType"),
    "MeleeRanged",if(json.get(MonsterWeaponData,"WeaponMeleeRanged")=="Ranged","Ranged","Melee"),
    "Type",json.get(MonsterWeaponData,"WeaponType"),
    "Range",if(json.contains(MonsterWeaponData,"WeaponRange"),json.get(MonsterWeaponData,"WeaponRange"),0),
    "Reach",if(json.contains(MonsterWeaponData,"WeaponReach"),json.get(MonsterWeaponData,"WeaponReach"),0),
    "CritRange",20-json.get(MonsterWeaponData,"WeaponCritThresh"),
    "MagicBonus",json.get(MonsterWeaponData,"WeaponMagicBonus"),
    "ItemBuffs","[]",
    "Props",NewWeaponProps
)]

[h:setProperty("a5e.stat.Weapon",json.append(getProperty("a5e.stat.Weapon"),NewWeaponData))]

[h:NewWeaponCommand = '[h,MACRO("SingleAttack@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken(),"WeaponData",'+"'"+NewWeaponData+"'"+')]']

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
    "tooltip","",
    "delim","json"
)]

[h:createMacro(NewWeaponMacroProps)]

[h:closeDialog("MonsterWeaponCreation")]