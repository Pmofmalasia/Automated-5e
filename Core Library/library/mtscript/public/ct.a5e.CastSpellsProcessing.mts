[h:inputData = arg(0)]

[h:spellsAllowed = "[]"]
[h:differentSpellsNumber = number(json.get(inputData,"CastSpellNumber"))]
[h:i = 0]
[h,count(differentSpellsNumber),CODE:{
	[h:thisSpellLevel = json.get(inputData,"CastSpellLevel"+i)]
	[h:thisSpellData = json.set("",
		"Name",js.a5e.RemoveSpecial(json.get(inputData,"CastSpellName"+i)),
		"Level",thisSpellLevel
	)]
	[h:inputData = json.remove(inputData,"CastSpellName"+i)]
	[h:inputData = json.remove(inputData,"CastSpellLevel"+i)]

	[h:thisSpellResourceUsed = json.get(inputData,"CastSpellResource"+i)]
	[h,if(json.contains(inputData,"CanAHLSpell"+i)):
		isAHLAllowed = json.get(inputData,"CanAHLSpell"+i);
		isAHLAllowed = 0
	]

	[h:NoResourceUsedTest = or(thisSpellResourceUsed == 0,!json.contains(inputData,"CastSpellResource"+i),json.get(inputData,"CastSpellResourceKey"+i) == "")]
	[h,if(!NoResourceUsedTest),CODE:{
		[h:"<!-- Note: If this is updated to be used for features that cast spells, will need to add a method of choosing the identifier, may have to return to CreateObjectProcessing (as this is currently only used for items) -->"]
		[h:resourceIdentifiers = json.set("","Name",json.get(inputData,"Name"),"Class","Item","Subclass","","Source","Item","Resource",json.get(inputData,"CastSpellResourceKey"+i))]
		[h:thisSpellResource = json.set("",
			"Identifier",resourceIdentifiers,
			"ResourceUsed",thisSpellResourceUsed,
			"Type","Feature"
		)]

		[h,if(isAHLAllowed):
			thisSpellResource = json.set(thisSpellResource,
				"Increment",json.get(inputData,"SpellResourceAHL"+i),
				"ResourceUsedMax",(9-thisSpellLevel)*json.get(inputData,"SpellResourceAHL"+i) + thisSpellResourceUsed);
			thisSpellResource = json.set(thisSpellResource,
				"Increment",1,
				"ResourceUsedMax",thisSpellResourceUsed)
		]

		[h:thisSpellData = json.set(thisSpellData,"UseResource",json.append("",json.append("",thisSpellResource)))]
	};{}]

	[h:inputData = json.remove(inputData,"CastSpellResource"+i)]
	[h:inputData = json.remove(inputData,"CastSpellResourceKey"+i)]
	[h:inputData = json.remove(inputData,"SpellResourceAHL"+i)]
	[h:inputData = json.remove(inputData,"CanAHLSpell"+i)]

	[h:spellsAllowed = json.append(spellsAllowed,thisSpellData)]
	[h:i = i + 1]
}]

[h:inputData = json.set(inputData,"ItemSpellcasting",spellsAllowed)]
[h:calcModifierHow = json.get(inputData,"CastSpellModifierHow")]
[h:inputData = json.remove(inputData,"CastSpellModifierHow")]
[h:inputData = json.set(inputData,"ItemSpellcastingModifierMethod",calcModifierHow)]
[h,switch(calcModifierHow),CODE:
	case "SetValue":{
		[h:inputData = json.set(inputData,"ItemSpellcastingModifier",json.get(inputData,"CastSpellFlatModifier"))]
		[h:inputData = json.remove(inputData,"CastSpellFlatModifier")]
	};
	case "Stat":{
		[h:AllowedStats = "[]"]
		[h:AllStats = pm.GetAttributes("Name","json")]
		[h,foreach(stat,AllStats): AllowedStats = if(json.contains(inputData,"CastSpellStat"+stat),json.append(AllowedStats,stat),AllowedStats)]
		[h,foreach(stat,AllStats): inputData = json.remove(inputData,"CastSpellStat"+stat)]
		[h:inputData = json.set(inputData,"ItemSpellcastingPrimeStatOptions",AllowedStats)]
	};
	case "SpecificClass":{
		[h:AllowedClasses = "[]"]
		[h:AllClasses = pm.GetClasses("Name","json")]
		[h,foreach(tempClass,AllClasses): AllowedClasses = if(json.contains(inputData,"CastSpellClass"+tempClass),json.append(AllowedClasses,tempClass),AllowedClasses)]
		[h,foreach(tempClass,AllClasses): inputData = json.remove(inputData,"CastSpellClass"+tempClass)]
		[h:inputData = json.set(inputData,"ItemSpellcastingClassOptions",AllowedClasses)]
	};
	default:{}
]

[h:inputData = json.remove(inputData,"isCastSpells")]
[h:inputData = json.remove(inputData,"CastSpellNumber")]

[h:return(0,inputData)]