[h:PassiveFeatureData = arg(0)]
[h:SaveBonusInfo = arg(1)]
[h,if(argCount()>2): PlusOrMinus = arg(2); PlusOrMinus = "Plus"]

[h,if(json.type(SaveBonusInfo)=="OBJECT"),CODE:{
	[h:NewBonusFormula = json.get(SaveBonusInfo,"Number")+"d"+json.get(SaveBonusInfo,"Size")]
	[h:getNewRolls()]
	[h:NewBonusDieRoll = eval(NewBonusFormula)]
	[h:NewBonusDieRollArray = getNewRolls()]

	[h,if(json.get(SaveBonusInfo,"FlatBonus")!=""),CODE:{
		[h:NewBonusFlatBonus = json.get(SaveBonusInfo,"FlatBonus")]
	};{
		[h:NewBonusFlatBonus = 0]
	}]

	[h,if(PlusOrMinus=="Minus"),CODE:{
		[h:NewBonusDieRoll = NewBonusDieRoll * -1]
		[h:NewBonusFlatBonus = NewBonusFlatBonus * -1]
		[h:PlusOrMinusStr = " - "]
	};{
		[h:PlusOrMinusStr = " + "]
	}]

	[h:NewBonusFormula = NewBonusFormula + pm.PlusMinus(NewBonusFlatBonus,0)]
	[h:NewBonus = NewBonusDieRoll + NewBonusFlatBonus]

	[h:MiscBonus = MiscBonus + NewBonus]
	[h:MiscBonusStr = MiscBonusStr + PlusOrMinusStr + json.toList(NewBonusDieRollArray,PlusOrMinusStr) + pm.PlusMinus(NewBonusFlatBonus,0)]
	[h:MiscBonusFormula = MiscBonusFormula + PlusOrMinusStr + NewBonusFormula]
};{
	[h,if(isNumber(SaveBonusInfo)):
		NewBonus = SaveBonusInfo;
		NewBonus = json.get(getProperty("a5e.stat.AtrMods"),SaveBonusInfo)
	]
	[h,if(PlusOrMinus == "Minus"): NewBonus = NewBonus * -1]

	[h:MiscBonus = MiscBonus + NewBonus]
	[h:MiscBonusStr = MiscBonusStr + pm.PlusMinus(NewBonus,0)]
	[h:MiscBonusFormula = MiscBonusFormula + if(PlusOrMinus == "Plus"," + "," - ") + json.get(PassiveFeatureData,"DisplayName")]
}]