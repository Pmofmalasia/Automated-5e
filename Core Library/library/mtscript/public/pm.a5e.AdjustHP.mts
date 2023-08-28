[h:ChangeHPAmount = arg(0)]
[h:PlusOrMinus = arg(1)]
[h:ParentToken = arg(2)]
[h:switchToken(ParentToken)]
[h:"<-- Adding HP is negative because positive is damage by default -->"]
[h,if(PlusOrMinus == "Plus"): ChangeHPAmount = ChangeHPAmount * -1]
[h:"<!-- May be good to add an optional arg(3) with some options, e.g. can it be modified, can it be a crit, does it bypass conc save. Last two maybe not, and scope should stay specifically for sources of changing HP that don't count as 'Being Damaged'? In which case there should likely be a bypass for some passive functions also. -->"]

[h:ChangeHPData = json.set("",
	"ParentToken",ParentToken,
	"DamageDealt",json.set("",
		"DamageType","None",
		"Array",json.append("",ChangeHPAmount),
		"String",ChangeHPAmount,
		"MaxTotal",ChangeHPAmount,
		"Dice","[]",
		"Bonus",ChangeHPAmount,
		"BonusString",ChangeHPAmount,
		"Formula",ChangeHPAmount,
		"NoModification",1)
	"SourceType","{}",
	"IsCrit",0,
	"BypassConc",1
)]

[h,MACRO("ChangeHP@Lib:pm.a5e.Core"): ChangeHPData]