[h:PassiveFeatureData = arg(0)]
[h:passAttackBonus = arg(1)]
[h,if(argCount()>2):
	PlusOrMinus = arg(2);
	PlusOrMinus = "Plus"
]

[h,if(json.type(passAttackBonus) == "OBJECT"),CODE:{
	[h:passBonusDieNum = json.get(passAttackBonus,"Number")]
	[h:passBonusDieSize = json.get(passAttackBonus,"Size")]
	[h:attack.ToHitRulesStr = attack.ToHitRulesStr + if(PlusOrMinus == "Minus"," - "," + ") + passBonusDieNum+"d"+passBonusDieSize]

	[h:passBonusString = ""]
	[h,count(passBonusDieNum),CODE:{
		[h:thisRoll = eval("1d"+passBonusDieSize)]
		[h:passBonusString = passBonusString + if(PlusOrMinus == "Minus"," - "," + ") + thisRoll]
		[h:attack.ToHit = attack.ToHit + thisRoll]
	}]

	[h:attack.ToHitStr = attack.ToHitStr + passBonusString]
};{
	[h,if(!isNumber(passAttackBonus)):
		passBonusNum = json.get(getProperty("a5e.stat.AtrMods"),passAttackBonus);
		passBonusNum = passAttackBonus
	]

	[h,if(PlusOrMinus == "Minus"): passBonusNum = passBonusNum * -1]

	[h:attack.ToHit = attack.ToHit + passBonusNum]
	[h:attack.ToHitStr = attack.ToHitStr + pm.PlusMinus(passBonusNum,0)]
	[h:attack.ToHitRulesStr = attack.ToHitRulesStr + if(PlusOrMinus == "Plus"," + "," - ") + json.get(PassiveFeatureData,"DisplayName")]
}]