[h:PassiveFeatureData = arg(0)]
[h:passDamageBonus = arg(1)]
[h,if(argCount()>2):
	PlusOrMinus = arg(2);
	PlusOrMinus = "Plus"
]
[h:"<!-- TODO: Need to add multiplying damage.DieNumber (NPC: Duergar - Enlarge). Should adjust location of calling this passive function so it's less cumbersome to modify the damage die size. -->"]
[h,if(json.type(passDamageBonus) == "OBJECT"),CODE:{
	[h:passBonusDieNum = json.get(passDamageBonus,"Number")]
	[h,if(passBonusDieNum != ""),CODE:{
		[h:passBonusDieSize = json.get(passDamageBonus,"Size")]
		[h,if(PlusOrMinus == "Minus"): passBonusDieSize = passBonusDieSize * -1]
		[h:damage.AddedRolledRules = damage.AddedRolledRules + if(passBonusDieSize < 0," - "," + ") + passBonusDieNum+"d"+abs(passBonusDieSize)]
		[h,count(passBonusDieNum): damage.AddedRolledDice = json.append(damage.AddedRolledDice,passBonusDieSize)]
	};{}]

	[h:passBonusDieMultiplier = json.get(passDamageBonus,"Multiplier")]
	[h:passBonusDieMultiplierType = json.get(passDamageBonus,"MultiplierType")]
	[h,switch(passBonusDieMultiplierType):
		case "Weapon": {
			[h:"<!-- Note: this does not currently work for crits if there are extra crit dice. Will be fixed with reorganization above. -->"]
			[h:passBonusDieMultiplierArray = damage.AllDice]
			[h:passBonusDieMultiplierArrayCrit = damage.AllCritDice]
			[h,count(passBonusDieMultiplier - 1): damage.AddedRolledDice = json.merge(passBonusDieMultiplierArray,damage.AddedRolledDice)]
		};
		case "":{};
		default:{
			[h:passBonusDieMultiplierArray = json.merge(damage.AllDice,damage.AddedRolledDice)]
			[h:passBonusDieMultiplierArrayCrit = json.merge(damage.AllCritDice,damage.AddedRolledDice)]
			[h,count(passBonusDieMultiplier - 1): damage.AddedRolledDice = json.merge(passBonusDieMultiplierArray,damage.AddedRolledDice)]
		}
	]
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

	[h:damage.AddedFlatBonusRules = damage.AddedFlatBonusRules + if(PlusOrMinus == "Plus"," + "," - ") + json.get(PassiveFeatureData,"DisplayName")]
}]