[h:HitDieData = macro.args]
[h:ParentToken = json.get(HitDieData,"ParentToken")]
[h:SpentHitDie = json.get(HitDieData,"SpentHitDie")]
[h:HitDieBonuses = json.get(HitDieData,"Bonus")]
[h:PassiveInstanceSuffixes = json.append(json.get(HitDieData,"PassiveInstanceSuffixes"),"")]
[h:switchToken(ParentToken)]

[h:abilityTable = "[]"]
[h,if(json.get(HitDieData,"UnifiedAbilities") == ""):
	a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken);
	a5e.UnifiedAbilities = json.get(HitDieData,"UnifiedAbilities")
]
[h:pm.a5e.OverarchingContext = "HitDie"]

[h:HitDieAdvantage = 0]
[h:HitDieDisadvantage = 0]
[h,foreach(instance,PassiveInstanceSuffixes): pm.PassiveFunction("HitDieSpendPreRoll"+instance)]

[h:SpentHitDieSizes = json.fields(SpentHitDie)]
[h:HitDieRoll = "{}"]
[h:currentHitDice = getProperty("a5e.stat.HitDice")]
[h,foreach(size,SpentHitDieSizes),CODE:{
	[h:thisSizeSpent = json.get(SpentHitDie,size)]
	[h:HitDieBonuses = json.set(HitDieBonuses,"Modifier",thisSizeSpent)]
	[h:thisHitDieRoll = pm.DieRoller(thisSizeSpent,substring(size,2))]
	[h:thisBonusInfo = pm.a5e.GetBonusValue(HitDieBonuses,ParentToken)]

	[h:thisHitDieRoll = json.set(thisHitDieRoll,
		"Total",json.get(thisHitDieRoll,"Total")+json.get(thisBonusInfo,"Value"),
		"String",json.get(thisHitDieRoll,"String")+" + "+json.get(thisBonusInfo,"String"),
		"MaxTotal",json.get(thisHitDieRoll,"MaxTotal")+json.get(thisBonusInfo,"Value"),
		"Bonus",json.get(thisHitDieRoll,"Bonus")+json.get(thisBonusInfo,"Value"),
		"Formula",json.get(thisHitDieRoll,"Formula")+" + "+json.get(thisBonusInfo,"Rules")
	)]

	[h,if(json.isEmpty(HitDieRoll)),CODE:{
		[h:HitDieRoll = thisHitDieRoll]
	};{
		[h:HitDieRoll = json.set("",
			"Array",json.merge(json.get(HitDieRoll,"Array"),json.get(thisHitDieRoll,"Array")),
			"Total",json.get(HitDieRoll,"Total")+json.get(thisHitDieRoll,"Total"),
			"String",json.get(HitDieRoll,"String")+" + "+json.get(thisHitDieRoll,"String"),
			"MaxTotal",json.get(HitDieRoll,"MaxTotal")+json.get(thisHitDieRoll,"MaxTotal"),
			"Dice",json.merge(json.get(HitDieRoll,"Dice"),json.get(thisHitDieRoll,"Dice")),
			"Bonus",json.get(HitDieRoll,"Bonus")+json.get(thisHitDieRoll,"Bonus"),
			"Formula",json.get(HitDieRoll,"Formula")+" + "+json.get(thisHitDieRoll,"Formula")
		)]
	}]

	[h:currentHitDice = json.set(currentHitDice,size,json.get(currentHitDice,size) - thisSizeSpent)]
}]
[h:setProperty("a5e.stat.HitDice",currentHitDice)]

[h,foreach(instance,PassiveInstanceSuffixes): pm.PassiveFunction("HitDieSpendPostRoll"+instance)]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Hit Die Roll",
	"FalseHeader","",
	"FullContents","<span style='font-size:1.5em'>"+json.get(HitDieRoll,"Total")+"</span>",
	"RulesContents",json.get(HitDieRoll,"Formula")+" = ",
	"RollContents",json.get(HitDieRoll,"String")+" = ",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,foreach(instance,PassiveInstanceSuffixes): pm.PassiveFunction("AfterHitDieSpend"+instance)]

[h:return(0,json.set("","Table",abilityTable,"HitDieRoll",HitDieRoll))]