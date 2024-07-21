[h:EffectToCheck = arg(0)]
[h:SpellPrerequisites = arg(1)]

[h:meetsSpellPrereqs = 1]
[h:spellInfo = json.get(EffectToCheck,"SpellData")]
[h,if(!json.isEmpty(spellInfo)),CODE:{
	[h,if(json.get(SpellPrerequisites,"SpellNameInclusive") != ""): meetsSpellPrereqs = min(meetsSpellPrereqs,!json.contains(json.get(SpellPrerequisites,"SpellNameInclusive"),json.get(spellData,"Name")))]
	[h,if(json.get(SpellPrerequisites,"SchoolInclusive")!=""): meetsSpellPrereqs = json.contains(json.get(SpellPrerequisites,"SchoolInclusive"),json.get(spellData,"School"))]
	[h,if(json.get(SpellPrerequisites,"SchoolExclusive")!=""): meetsSpellPrereqs = !json.contains(json.get(SpellPrerequisites,"SchoolExclusive"),json.get(spellData,"School"))]
};{
	[h,if(json.get(SpellPrerequisites,"SpellNameInclusive") != ""): meetsSpellPrereqs = 0]
	[h,if(json.get(SpellPrerequisites,"SchoolInclusive")!=""): meetsSpellPrereqs = 0]
}]
[h:return(0,meetsSpellPrereqs)]