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
[h:"<!-- TODO: MaxResource fix -->"]
	[h:MatchingUnsharedLevels = json.path.read(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.ResourceSpellLevel!=null && @.IsActive>0)]","DEFAULT_PATH_LEAF_TO_NULL")]
	[h,foreach(slotType,MatchingUnsharedLevels): CastingLevel = CastingLevel + evalMacro(json.get(slotType,"ResourceSpellLevel"))*2]
};{}]

[h:return(0,ceiling(CastingLevel/2))]