[h:HitDiceData = macro.args]
[h:HitDiceData = pm.a5e.KeyStringsToNumbers(HitDiceData)]
[h:ParentToken = json.get(HitDiceData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:validHitDieSizes = "[]"]
[h:MaxHitDice = getProperty("a5e.stat.MaxHitDice")]
[h:HitDieSizes = json.fields(MaxHitDice)]
[h,foreach(size,HitDieSizes),if(json.get(MaxHitDice,size) != 0): validHitDieSizes = json.append(validHitDieSizes,size)]

[h:spentHitDice = "{}"]
[h,foreach(dieSize,validHitDieSizes): spentHitDice = json.set(spentHitDice,dieSize,json.get(HitDiceData,dieSize+"Num"))]

[h:closeDialog("SpendHitDieInput")]
[h:ExpendHitDieData = json.set("",
	"ParentToken",ParentToken,
	"SpentHitDice",spentHitDice,
	"Bonus",json.set("","Type","AtrMod","Attribute","Constitution"),
	"PassiveInstanceSuffixes",json.append("","Healing")
)]
[h,MACRO("ExpendHitDieHealing@Lib:pm.a5e.Core"): ExpendHitDieData]
[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]

[h:BorderData = json.set("",
	"Flavor","",
	"Name","SpendHitDie",
	"DisplayName","Spend Hit Dice",
	"FalseName","",
	"DisplayClass","zzChangeHP",
	"ColorSubtype",if(IsDamage,"Damage","Healing")
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance",ParentToken) == "Enemy"),
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","SpendHitDie","ChangeHP"),
	"Description","",
	"AbridgedDescription",""
)]
[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]