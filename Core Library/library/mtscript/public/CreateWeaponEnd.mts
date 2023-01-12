[h:thisWeaponData = json.get(getLibProperty("ct.NewWeapon","Lib:pm.a5e.Core"),getPlayerName())]
[h:WeaponName = json.get(thisWeaponData,"Name")]
[h:classesWithWeapon = json.get(thisWeaponData,"ClassesWithWeapon")]
[h:weaponSourcebook = json.get(thisWeaponData,"Sourcebook")]

[h:thisWeaponData = json.remove(thisWeaponData,"Sourcebook")]
[h:thisWeaponData = json.remove(thisWeaponData,"multiEffects")]
[h:thisWeaponData = json.remove(thisWeaponData,"ParentToken")]

[h:"<!-- Need to add a method of checking for multiple unnamed spell-specific effects to make them be named (or marked as all the same effect). Will likely need to be done prior to calling this macro by shunting off to another one since it would involve another interface. --> "]

[h:setLibProperty("ct.NewWeapon",json.remove(getLibProperty("ct.NewWeapon","Lib:pm.a5e.Core"),getPlayerName()),"Lib:pm.a5e.Core")]
[h:ParentToken = json.get(macro.args,"ParentToken")]
[h:switchToken(ParentToken)]

[h:setProperty("a5e.stat.Weapon",json.append(getProperty("a5e.stat.Weapon"),thisWeaponData))]

[h:NewWeaponCommand = '[h,MACRO("SingleAttack@Lib:pm.a5e.Core"): json.set("","ParentToken",currentToken(),"WeaponData",'+"'"+thisWeaponData+"'"+')]']

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
    "label",json.get(thisWeaponData,"DisplayName"),
    "maxWidth","",
    "minWidth",89,
    "playerEditable",0,
    "tooltip",'[h:TooltipData=json.set("","tooltipDisplaySizeOverride",200,"WeaponData",'+"'"+thisWeaponData+"'"+')][MACRO("Attack Macro Tooltip@Lib:pm.a5e.Core"):TooltipData]',
    "delim","json"
)]

[h:createMacro(NewWeaponMacroProps)]

[h:broadcast("Weapon "+json.get(thisWeaponData,"DisplayName")+" created.")]