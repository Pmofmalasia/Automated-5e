[h:attack.Data = arg(0)]
[h:attack.FunctionPrefixes = arg(1)]
[h:attack.Target = arg(2)]

[h:pm.a5e.d20Roll(attack.Data,attack.FunctionPrefixes,attack.Target)]

[h,switch(d20AdvantageBalance),CODE:
    case -1:{
        [h:d20EffectiveRoll = math.arrayMin(d20AllRolls)]
        [h:attack.FormulaPrefix = "1d20 <span style='color:%{FailureTextColor}'>with Dis</span>"]
    };
    case 0:{
        [h:d20EffectiveRoll = json.get(d20AllRolls,0)]
        [h:attack.FormulaPrefix = "1d20"]
    };
    case 1:{
        [h:d20EffectiveRoll = math.arrayMax(d20AllRolls)]
        [h:attack.FormulaPrefix = "1d20 <span style='color:%{SuccessTextColor}'>with Adv</span>"]
    }
]

[h:attack.CritThreshSet = json.get(attack.Data,"CritThresh")]
[h,if(attack.CritThreshSet == ""): attack.CritThreshSet = 20]
[h:attack.CritThreshReduction = json.get(attack.Data,"CritThreshReduction")]
[h,if(attack.CritThreshReduction == ""): attack.CritThreshReduction = 0]
[h:attack.AutoCrit = 0]
[h:attack.AutoCritFail = 0]

[h,foreach(tempPrefix,attack.FunctionPrefixes),CODE:{
    [h:pm.PassiveFunction(tempPrefix+"Crit")]
    [h:pm.PassiveFunction(tempPrefix+"CritTargeted",json.set("","ParentToken",attack.Target))]
}]

[h:attack.FinalCritRange = attack.CritThreshSet - attack.CritThreshReduction]
[h:CritTest = if(or(attack.AutoCrit,d20EffectiveRoll >= attack.FinalCritRange),1,0)]
[h:CritFailTest = if(or(attack.AutoCritFail,d20EffectiveRoll==1),1,0)]

[h:"<!-- TODO: Re-add misc. flat bonuses to the ToHit to the rules string, get PrimeStatBonus, ProfTest, and ToHitBonus into macro -->"]
[h:attack.TotalBonus = PrimeStatMod+if(attack.ProfTest,getProperty("a5e.stat.Proficiency"),0)+attack.ToHitBonus]
[h:attack.ToHit = d20EffectiveRoll+attack.TotalBonus]
[h:attack.ToHitStr = pm.PlusMinus(PrimeStatMod,1)+if(attack.ProfTest," + "+getProperty("a5e.stat.Proficiency"),"")+pm.PlusMinus(attack.ToHitBonus,0)]
[h:attack.ToHitRulesStr = " + "+substring(PrimeStat,0,3)+if(attack.ProfTest," + Prof","")+pm.PlusMinus(attack.ToHitBonus,0)]

[h,foreach(tempPrefix,attack.FunctionPrefixes),CODE:{
    [h:pm.PassiveFunction(tempPrefix+"Bonus")]
    [h:pm.PassiveFunction(tempPrefix+"BonusTargeted",json.set("","ParentToken",attack.Target))]  
}]

[h:return(0,json.set("",
    "d20Rolls",d20AllRolls,
    "FinalRoll",d20EffectiveRoll,
    "Advantage",d20Advantage,
    "Disadvantage",d20Disadvantage,
	"AdvantageMessageArray",d20AdvantageMessageArray,
    "AdvantageBalance",d20AdvantageBalance,
	"PrimeStat",PrimeStat,
	"TotalBonus",attack.TotalBonus,
    "Value",attack.ToHit,
    "RollString",attack.ToHitStr,
    "Formula",attack.ToHitRulesStr,
    "FormulaPrefix",attack.FormulaPrefix,
	"CritRange",attack.FinalCritRange,
	"AutoCrit",attack.AutoCrit,
	"AutoCritFail",attack.AutoCritFail,
    "CritTest",CritTest,
    "CritFailTest",CritFailTest
))]