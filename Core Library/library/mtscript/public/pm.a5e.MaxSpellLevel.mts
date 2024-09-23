[h,if(arg(0) == "All"),CODE:{
    [h:CastingLevel = a5e.CastingLevel()]
};{
    [h:CastingLevel = a5e.CastingLevel(arg(0))]
}]

[h,if(argCount() > 1):
	UseUnsharedSlotsTest = arg(1);
	UseUnsharedSlotsTest = 0
]

[h,if(UseUnsharedSlotsTest),CODE:{
	[h:ParentToken = currentToken()]
	[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
	[h:MatchingUnsharedLevels = js.a5e.GetFeatureSpellSlots(a5e.UnifiedAbilities,ParentToken)]
	[h,foreach(slotType,MatchingUnsharedLevels): CastingLevel = CastingLevel + json.get(slotType,"SlotLevel")*2]
};{}]

[h:return(0,ceiling(CastingLevel/2))]