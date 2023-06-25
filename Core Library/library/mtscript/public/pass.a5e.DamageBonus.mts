[h:PassiveFeatureData = arg(0)]
[h:passDamageBonus = arg(1)]
[h,if(argCount()>2):
	PlusOrMinus = arg(2);
	PlusOrMinus = "Plus"
]

[h,if(json.type(passDamageBonus) == "OBJECT"),CODE:{
	[h:passBonusDieNum = json.get(passDamageBonus,"Number")]
	[h:passBonusDieSize = json.get(passDamageBonus,"Size")]
	[h,if(PlusOrMinus == "Minus"): passBonusDieSize = passBonusDieSize * -1]
	[h:damage.AddedRolledRules = damage.AddedRolledRules + if(passBonusDieSize < 0," - "," + ") + passBonusDieNum+"d"+abs(passBonusDieSize)]
	[h,count(passBonusDieNum),CODE:{
		[h:damage.AddedRolledDice = json.append(damage.AddedRolledDice,passBonusDieSize)]
	}]
};{
	[h,if(isNumber(passDamageBonus)),CODE:{
		[h,if(PlusOrMinus == "Plus"):
			damage.AddedFlatBonus = json.append(damage.AddedFlatBonus,passDamageBonus);
			damage.AddedFlatBonus = json.append(damage.AddedFlatBonus,passDamageBonus*-1)
		]
	};{
		[h:passBonusNum = json.get(getProperty("a5e.stat.AtrMods"),passDamageBonus)]
		[h,if(PlusOrMinus == "Plus"):
			damage.AddedFlatBonus = json.append(damage.AddedFlatBonus,passBonusNum);
			damage.AddedFlatBonus = json.append(damage.AddedFlatBonus,passBonusNum*-1)
		]
	}]

	[h:damage.AddedFlatBonusRules = json.append(damage.AddedFlatBonusRules,if(PlusOrMinus == "Plus" < 0," + "," - ") + json.get(PassiveFeatureData,"DisplayName"))]
}]