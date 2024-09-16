[h,if(arg(0) == "All"),CODE:{
    [h:CastingLevel = a5e.CastingLevel()]
};{
    [h:CastingLevel = a5e.CastingLevel(arg(0))]
}]

[h,if(argCount() > 1):
	UseUnsharedSlotsTest = arg(1);
	UseUnsharedSlotsTest = 0
]

[h:"<!-- TODO: MaxResource - test this w/ pact magic -->"]
[h,if(UseUnsharedSlotsTest),CODE:{
	[h:MatchingUnsharedLevels = js.a5e.GetFeatureSpellSlots(a5e.GatherAbilities(currentToken()))]
	[h,foreach(slotType,MatchingUnsharedLevels): CastingLevel = CastingLevel + json.get(slotType,"Level")*2]
};{}]

[h:return(0,ceiling(CastingLevel/2))]