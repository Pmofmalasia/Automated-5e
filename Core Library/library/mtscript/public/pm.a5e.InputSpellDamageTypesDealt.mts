[h:newTypeTest = 1]
[h:damageTypeData = "[]"]

[h:damageTypeArray = pm.GetDamageTypes("DisplayName","json")]
[h:damageTypeArray = json.append(damageTypeArray,"Healing","Temp HP")]

[h:multiDamageTypeInput = ""]
[h,foreach(damageType,damageTypeArray): multiDamageTypeInput = listAppend(multiDamageTypeInput," choice"+pm.RemoveSpecial(damageType)+" |  | "+damageType+" | CHECK ","##")]

[h:damageTypeArrayAHL = json.append(damageTypeArray,"Same As Chosen")]
[h:sameAsChosenIndex = json.length(damageTypeArrayAHL)-1]
[h:damageTypeArray = json.append(damageTypeArray,"Choose From Multiple")]

[h,while(newTypeTest),CODE:{
	[h:abort(input(
		"throwaway|------------------------------------------- Damage Types Dealt -------------------------------------------||LABEL|SPAN=TRUE",
		" tempDamageType | "+damageTypeArray+" | Choose a Damage Type | LIST | VALUE=STRING DELIMITER=JSON ",
		" tempDieNum | 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 | Number of Dice Rolled | LIST | SELECT=1 ",
		" tempDieSize | 1,2,3,4,6,8,10,12,20 | Size of Dice Rolled | LIST | VALUE=STRING ",
		" tempFlatDamage |  | Flat Damage Bonus ",
		" tempDamageMod |  | Add Spellcasting Modifier to Damage | CHECK ",
		" throwaway | ------------------------------------------- Damage At Higher Levels ------------------------------------------- |  | LABEL | SPAN=TRUE",
		" tempHasDamageAHL | No Increase,1,2,3,4,5,6,7,8,9 | Damage Increases Every X Levels | LIST ",
		" tempDamageTypeAHL | "+damageTypeArrayAHL+" | Choose a Damage Type AHL | LIST | VALUE=STRING DELIMITER=JSON SELECT="+sameAsChosenIndex+" ",
		" tempDieNumAHL | 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 | Additional Dice Rolled Per Level | LIST | VALUE=STRING ",
		" tempDieSizeAHL | 1,2,3,4,6,8,10,12,20 | Size of Dice Rolled At Higher Levels | LIST | VALUE=STRING ",
		" tempFlatDamageAHL |  | Flat Damage Bonus Per Level ",
		" throwaway | ------------------------------------------------------------------------------------------------------------- |  | LABEL | SPAN=TRUE",
		" newTypeTest |  | Add an Additional Damage Type | CHECK "
	))]
	
	[h:thisDamageData = json.set("",
		"DamageType",pm.RemoveSpecial(tempDamageType),
		"DieNumber",tempDieNum,
		"DieSize",tempDieSize,
		"FlatBonus",tempFlatDamage,
		"DamageMod",tempDamageMod
	)]
	
	[h,if(tempDamageType == "Choose From Multiple"),CODE:{
		[h:abort(input(
			"throwaway|------------------------------------------- Damage Type Selection Options -------------------------------------------||LABEL|SPAN=TRUE",
			" isDamageTypeRandom |  | Damage Type Randomly Chosen | CHECK",
			multiDamageTypeInput
		))]
		
		[h:damageOptions = "{}"]
		[h:choiceChooseFromMultiple = 0]
		[h,foreach(damageType,damageTypeArray): damageOptions = if(eval("choice"+pm.RemoveSpecial(damageType)),json.set(damageOptions,pm.RemoveSpecial(damageType),1),damageOptions)]
		
		[h:thisDamageData = json.set(thisDamageData,
			"DamageTypeOptions",damageOptions,
			"DamageTypeRandom",isDamageTypeRandom
		)]
	};{}]
	
	[h,if(tempHasDamageAHL>0),CODE:{
		[h,if(tempAHLDamageType == "Same As Chosen"): tempAHLDamageType = if(tempDamageType == "Choose From Multiple",tempAHLDamageType,tempDamageType)]
		[h:thisDamageData = json.set(thisDamageData,
			"AHLScaling",tempHasDamageAHL,
			"AHLDamageType",tempAHLDamageType,
			"AHLDieNumber",tempDieNumAHL,
			"AHLDieSize",tempDieSizeAHL,
			"AHLFlatBonus",tempFlatDamageAHL
		)]
	};{}]
	
	[h:damageTypeData = json.append(damageTypeData,thisDamageData)]
}]

[h:macro.return = damageTypeData]