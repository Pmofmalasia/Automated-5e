[h:CheckBonusInfo = arg(1)]

[h,if(json.type(CheckBonusInfo)=="OBJECT"),CODE:{
    [h:NewBonusFormula = json.get(CheckBonusInfo,"Number")+"d"+json.get(CheckBonusInfo,"Size")]
    [h:NewBonusAddSubtract = json.get(CheckBonusInfo,"AddSubtract")]
    [h,if(NewBonusAddSubtract==""): NewBonusAddSubtract = "Add"]

    [h:getNewRolls()]
    [h:NewBonusDieRoll = eval(NewBonusFormula)]
    [h:NewBonusDieRollArray = getNewRolls()]

    [h,if(json.get(CheckBonusInfo,"FlatBonus")!=""),CODE:{
        [h:NewBonusFlatBonus = json.get(CheckBonusInfo,"FlatBonus")]
        [h:NewBonusFormula = NewBonusFormula + pm.PlusMinus(NewBonusFlatBonus,0)]
    };{
        [h:NewBonusFlatBonus = 0]
    }]

    [h:NewBonus = NewBonusDieRoll + NewBonusFlatBonus]

    [h:MiscBonus = MiscBonus + NewBonus]
    [h:MiscBonusStr = MiscBonusStr+" + "+json.toList(NewBonusDieRollArray," + ")+pm.PlusMinus(NewBonusFlatBonus,0)]
    [h:MiscBonusFormula = MiscBonusFormula+" + "+NewBonusFormula]
};{
    [h,if(isNumber(CheckBonusInfo)),CODE:{
        [h:NewBonus = CheckBonusInfo]
        [h:MiscBonus = MiscBonus + NewBonus]
        [h:MiscBonusStr = MiscBonusStr+pm.PlusMinus(NewBonus,0)]
        [h:MiscBonusFormula = MiscBonusFormula+pm.PlusMinus(NewBonus,0)]
    };{
        [h:NewBonus = json.get(getProperty("a5e.stat.AtrMods"),CheckBonusInfo)]
        [h:MiscBonus = MiscBonus + NewBonus]
        [h:MiscBonusStr = MiscBonusStr+pm.PlusMinus(NewBonus,0)]
        [h:MiscBonusFormula = MiscBonusFormula+" + "+substring(CheckBonusInfo,0,3)]
    }]
}]