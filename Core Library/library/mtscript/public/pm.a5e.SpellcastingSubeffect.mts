[h:SpellSubeffectData = arg(0)]

[h,if(json.contains(SpellSubeffectData,"Damage")),CODE:{
	[h:allDamageData = json.get(SpellSubeffectData,"Damage")]
	[h:DamageTypeOptionNum = json.length(json.path.read(allDamageData,"[*][?(@.DamageTypeOptions != null]","DEFAULT_PATH_LEAF_TO_NULL"))]

	[h,if(DamageTypeOptionNum>1):
		DamageTypeSelectInput = "junkVar |  | --------------- Damage Type Options --------------- | LABEL | SPAN=TRUE ";
		DamageTypeSelectInput = ""
	]

	[h,foreach(tempDamageType,allDamageData),CODE:{
		[h:thisInstanceDamageOptions = "[]"]
		[h,foreach(tempDamageOption,json.get(allDamageData,"DamageTypeOptions")): thisInstanceDamageOptions = json.append(thisInstanceDamageOptions,pm.GetDisplayName(tempDamageOption,"sb.DamageTypes"))]
		[h,if(!json.isEmpty(thisInstanceDamageOptions)): DamageTypeSelectInput = listAppend(DamageTypeSelectInput," DamageTypeSelection"+roll.count+" | Choose a Damage Type | "+thisInstanceDamageOptions+" | LIST | DELIMITER=JSON VALUE=STRING "," ## ")]
	}]

	[h:abort(input(DamageTypeOptionNum))]
}]

[h:SpellIsAttack = json.contains(SpellSubeffectData,"Attack")]
[h,if(SpellIsAttack),CODE:{

};{
	[h:d20CritTest = 0]
}]

[h,if(json.contains(SpellSubeffectData,"Save")),CODE:{
	[h:SpellSaveDC = 8 + Proficiency + PrimeStatMod]

	[h:pm.PassiveFunction("SpellSaveDC")]

	[h:SpellSaveDCData = json.set(json.get(SpellSubeffectData,"Save"),"DC",SpellSaveDC)]
}]

[h:SpellDamageData = "[]"]
[h:SpellNonDamageProperties = json.set("",
	"IsSpell",1,
	"IsWeapon",0,
	"IsAttack",SpellIsAttack,
	"Modifier",1
)]
[h:SpellDamagePassiveFunctions = json.append("","Damage","SpellDamage")]
[h,if(SpellIsAttack): SpellDamagePassiveFunctions = json.append(SpellDamagePassiveFunctions,"Attack","SpellAttack")]

[h,foreach(tempDamageInstance,json.get(SpellSubeffectData,"Damage")),CODE:{
	[h:pm.a5e.DamageRoll(tempDamageInstance,SpellNonDamageProperties,SpellDamagePassiveFunctions)]
}]