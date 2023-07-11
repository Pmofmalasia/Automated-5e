[h,switch(json.get(ItemData,"ItemSpellcastingModifierMethod")),CODE:
	case "SetValue":{
		[h:PrimeStat = "None"]
		[h:PrimeStatMod = json.get(ItemData,"ItemSpellcastingModifier") - getProperty("a5e.stat.Proficiency")]
	};
	case "AnyClass":{
		[h:"<!-- TODO: This must be adjusted to allow for Eldritch Knight and Arcane Trickster to work -->"]
		[h:validClasses = json.path.read(a5e.UnifiedAbilities,"[*][?(@.UniqueSpellList == 1 && @.CallSharedDC != '' && @.CallSpellClass == 1)]['Class']")]
		[h:PrimeStat = "None"]
		[h:PrimeStatValue = 0]
		[h,foreach(tempClass,validClasses),CODE:{
			[h:stat = json.get(getLibProperty("sb.CastingAbilities","Lib:pm.a5e.Core"),tempClass)]
			[h:thisPrimeStatValue = json.get(getProperty("a5e.stat.Attributes"),stat)]
			[h,if(thisPrimeStatValue > PrimeStatValue): PrimeStat = stat]
		}]
		[h,if(PrimeStat == "None"): PrimeStatMod = 0; PrimeStatMod = json.get(getProperty("a5e.stat.AtrMods"),PrimeStat)]
		[h:pm.PassiveFunction("SpellStat")]
	};
	case "SpecificClass":{
		[h:validClasses = json.path.read(a5e.UnifiedAbilities,"[*][?(@.UniqueSpellList == 1 && @.CallSharedDC != '' && @.CallSpellClass == 1 && @.Class in "+validClasses+")]['Class']")]
		[h:PrimeStat = "None"]
		[h:PrimeStatValue = 0]
		[h,foreach(tempClass,validClasses),CODE:{
			[h:stat = json.get(getLibProperty("sb.CastingAbilities","Lib:pm.a5e.Core"),tempClass)]
			[h:thisPrimeStatValue = json.get(getProperty("a5e.stat.Attributes"),stat)]
			[h,if(thisPrimeStatValue > PrimeStatValue): PrimeStat = stat]
		}]
		[h,if(PrimeStat == "None"): PrimeStatMod = 0; PrimeStatMod = json.get(getProperty("a5e.stat.AtrMods"),PrimeStat)]
		[h:pm.PassiveFunction("SpellStat")]
	};
	case "Stat":{
		[h:PrimeStatOptions = json.get(ItemData,"ItemSpellcastingPrimeStatOptions")]
		[h:PrimeStat = "None"]
		[h:PrimeStatValue = 0]
		[h,foreach(stat,PrimeStatOptions),CODE:{
			[h:thisPrimeStatValue = json.get(getProperty("a5e.stat.Attributes"),stat)]
			[h,if(thisPrimeStatValue > PrimeStatValue): PrimeStat = stat]
		}]
		[h,if(PrimeStat == "None"): PrimeStatMod = 0; PrimeStatMod = json.get(getProperty("a5e.stat.AtrMods"),PrimeStat)]
		[h:pm.PassiveFunction("SpellStat")]
	}
]