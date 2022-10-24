[h:attack.Data = arg(0)]
[h:attack.FunctionPrefixes = arg(1)]
[h:attack.Target = arg(2)]

[h:pm.a5e.d20Roll(attack.Data,attack.FunctionPrefixes,attack.Target)]

[h,switch(d20AdvantageBalance),CODE:
    case -1:{
        [h:d20EffectiveRoll = math.arrayMin(d20AllRolls)]
        [h:attack.ToHitRulesStr = "1d20 <span style='color:"+DamageColor+"'>with Dis</span>"]
    };
    case 0:{
        [h:d20EffectiveRoll = json.get(d20AllRolls,0)]
        [h:attack.ToHitRulesStr = "1d20"]
    };
    case 1:{
        [h:d20EffectiveRoll = math.arrayMax(d20AllRolls)]
        [h:attack.ToHitRulesStr = "1d20 <span style='color:"+HealingColor+"'>with Adv</span>"]
    }
]

[h:"<!-- TODO: Add critrange, decide on using set range vs. subtracting from 20 (or both) -->"]
[h:attack.CritRange = json.get(attack.Data,"CritRange")]
[h:attack.FinalCritRange = 20]
[h:attack.AutoCrit = 0]
[h:attack.AutoCritFail = 0]

[h,foreach(tempPrefix,attack.FunctionPrefixes),CODE:{
    [h:pm.PassiveFunction(tempPrefix+"Crit")]
    [h:pm.PassiveFunction(tempPrefix+"CritTargeted",json.set("","ParentToken",attack.Target))]  
}]

[h:CritTest = if(or(attack.AutoCrit,d20EffectiveRoll>=attack.FinalCritRange),1,0)]
[h:CritFailTest = if(or(attack.AutoCritFail,d20EffectiveRoll==1),1,0)]

[h:"<!-- TODO: Re-add misc. flat bonuses to the ToHit to the rules string, get PrimeStatBonus, ProfTest, and ToHitBonus into macro -->"]
[h:attack.ToHit = d20EffectiveRoll+PrimeStatMod+if(attack.ProfTest,getProperty("Proficiency"),0)+attack.ToHitBonus]
[h:attack.ToHitStr = d20EffectiveRoll+" + "+PrimeStatMod+if(attack.ProfTest," + "+getProperty("Proficiency"),"")+pm.PlusMinus(attack.ToHitBonus,0)]
[h:attack.ToHitRulesStr = attack.ToHitRulesStr+" + "+substring(PrimeStat,0,3)+if(attack.ProfTest," + Prof","")+pm.PlusMinus(attack.ToHitBonus,0)]

[h,foreach(tempPrefix,attack.FunctionPrefixes),CODE:{
    [h:pm.PassiveFunction(tempPrefix+"Bonus")]
    [h:pm.PassiveFunction(tempPrefix+"BonusTargeted",json.set("","ParentToken",attack.Target))]  
}]

[h:return(0,json.set("",
    "d20Rolls",d20AllRolls,
    "FinalRoll",d20EffectiveRoll,
    "Advantage",d20Advantage,
    "Disadvantage",d20Disadvantage,
    "AdvantageBalance",d20AdvantageBalance,
    "ToHit",attack.ToHit,
    "ToHitStr",attack.ToHitStr,
    "RulesStr",attack.ToHitRulesStr,
    "CritTest",CritTest,
    "CritFailTest",CritFailTest
))]