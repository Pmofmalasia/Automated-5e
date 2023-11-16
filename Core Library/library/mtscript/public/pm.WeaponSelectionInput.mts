[h:weaponInput = " junkVar | ---------------------- Weapon Proficiency Choice Info ---------------------- |  | LABEL | SPAN=TRUE "]

[h,if(argCount()>0),CODE:{
	[h:extraInput = json.toList(arg(0),"##")]
	[h:weaponInput = weaponInput + " ## "+ extraInput]
};{}]

[h:allWeaponClasses = json.append("",
	json.set("","Name","Simple","DisplayName","Simple"),
	json.set("","Name","Martial","DisplayName","Martial"),
	json.set("","Name","Exotic","DisplayName","Exotic"),
	json.set("","Name","Improvised","DisplayName","Improvised")
)]
[h,foreach(weaponClass,allWeaponClasses),CODE:{
	[h:thisLine = "choice"+json.get(weaponClass,"Name")+" |  | "+json.get(weaponClass,"DisplayName")+" Proficiency | CHECK "]
	[h:weaponInput = listAppend(weaponInput,thisLine," ## ")]
}]

[h:weaponInput = listAppend(weaponInput," junkVar | ------------------------------------------------------------------ |  | LABEL | SPAN=TRUE "," ## ")]

[h:allWeaponTypes = pm.a5e.GetCoreData("sb.WeaponTypes")]
[h,foreach(weaponType,allWeaponTypes),CODE:{
	[h:thisLine = "choice"+json.get(weaponType,"Name")+" |  | "+json.get(weaponType,"DisplayName")+" Proficiency | CHECK "]
	[h:weaponInput = listAppend(weaponInput,thisLine," ## ")]
}]

[h:abort(input(weaponInput))]

[h:ab.WeaponProfOptions = "{}"]
[h,foreach(weaponClass,allWeaponClasses),CODE:{
	[h:isProfTest = eval("choice"+json.get(weaponClass,"Name"))]
	[h,if(isProfTest): ab.WeaponProfOptions = json.set(ab.WeaponProfOptions,json.get(weaponClass,"Name"),1)]
}]
[h,foreach(weaponType,allWeaponTypes),CODE:{
	[h:isProfTest = eval("choice"+json.get(weaponType,"Name"))]
	[h,if(isProfTest): ab.WeaponProfOptions = json.set(ab.WeaponProfOptions,json.get(weaponType,"Name"),1)]
}]

[h,if(argCount()>0): ab.ExtraKeys = arg(2) ; ab.ExtraKeys = ""]
[h,foreach(key,ab.ExtraKeys),CODE:{
	[h:ab.WeaponProfOptions = json.set(ab.WeaponProfOptions,key,eval(json.get(arg(1),roll.count)))]
}]
[h:macro.return = ab.WeaponProfOptions]