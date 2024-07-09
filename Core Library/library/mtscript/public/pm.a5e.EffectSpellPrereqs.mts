[h:EffectToCheck = arg(0)]
[h:SpellPrerequisites = arg(1)]

[h:meetsSpellPrereqs = 1]
[h:spellInfo = json.get(EffectToCheck,"SpellData")]
[h,if(!json.isEmpty(spellInfo)),CODE:{
	[h,if(json.get(SpellPrerequisites,"IncludeSpellName") != ""): meetsSpellPrereqs = min(meetsSpellPrereqs,!json.contains(json.get(SpellPrerequisites,"IncludeSpellName"),json.get(spellData,"Name")))]
	[h,if(json.get(SpellPrerequisites,"IncludeSchool")!=""): meetsSpellPrereqs = json.contains(json.get(SpellPrerequisites,"IncludeSchool"),json.get(spellData,"School"))]
	[h,if(json.get(SpellPrerequisites,"ExcludeSchool")!=""): meetsSpellPrereqs = !json.contains(json.get(SpellPrerequisites,"ExcludeSchool"),json.get(spellData,"School"))]
};{
	[h,if(json.get(SpellPrerequisites,"IncludeSpellName") != ""): meetsSpellPrereqs = 0]
	[h,if(json.get(SpellPrerequisites,"IncludeSchool")!=""): meetsSpellPrereqs = 0]
}]
[h:return(0,meetsSpellPrereqs)]