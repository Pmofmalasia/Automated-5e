[h:HitDieData = macro.args]
[h:ParentToken = json.get(HitDieData,"ParentToken")]
[h:SpentHitDie = json.get(HitDieData,"SpentHitDie")]
[h:HitDieBonuses = json.get(HitDieData,"Bonus")]
[h:PassiveInstanceSuffixes = json.append(json.get(HitDieData,"PassiveInstanceSuffixes"),"")]
[h:switchToken(ParentToken)]

[h,MACRO("ExpendHitDie@Lib:pm.a5e.Core"): HitDieData]
[h:abilityTable = json.get(macro.return,"Table")]
[h:HitDieRoll = json.get(macro.return,"HitDieRoll")]

[h:HitDieRoll = json.set(HitDieRoll,
	"CritFormula",json.get(HitDieRoll,"Formula"),
	"CritDice",json.get(HitDieRoll,"Dice"),
	"CritArray",json.get(HitDieRoll,"Array"),
	"CritString",json.get(HitDieRoll,"String"),
	"CritTotal",json.get(HitDieRoll,"Total"),
	"CritMaxTotal",json.get(HitDieRoll,"MaxTotal"),
	"DamageType","Healing",
	"NoModification",0,
	"Modifier",1
)]

[h:HealingData = json.set(HitDieData,
	"DamageDealt",json.append("",HitDieRoll),
	"IsCrit",0
)]
[h,MACRO("ChangeHP@Lib:pm.a5e.Core"): HealingData]
[h:FinalHitDieData = json.set(macro.return,"Table",json.merge(abilityTable,json.get(macro.return,"Table")))]

[h:return(0,FinalHitDieData)]