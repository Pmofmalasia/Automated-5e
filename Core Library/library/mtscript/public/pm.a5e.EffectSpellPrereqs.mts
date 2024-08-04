[h:EffectToCheck = arg(0)]
[h:SpellPrerequisites = arg(1)]

[h:meetsSpellPrereqs = 1]
[h:spellInfo = json.get(EffectToCheck,"SpellData")]
[h,if(!json.isEmpty(spellInfo)),CODE:{
	[h,foreach(prereq,json.fields(SpellPrerequisites)),switch(prereq),CODE:
		case "SpellNameInclusive":{
			[h:meetsSpellPrereqs = min(meetsSpellPrereqs,!json.contains(json.get(SpellPrerequisites,"SpellNameInclusive"),json.get(spellData,"Name")))]
			[h:return(meetsSpellPrereqs,0)]
		};
		case "SchoolInclusive":{
			[h:meetsSpellPrereqs = json.contains(json.get(SpellPrerequisites,"SchoolInclusive"),json.get(spellData,"School"))]
			[h:return(meetsSpellPrereqs,0)]
		};
		case "SchoolExclusive":{
			[h:meetsSpellPrereqs = !json.contains(json.get(SpellPrerequisites,"SchoolExclusive"),json.get(spellData,"School"))]
			[h:return(meetsSpellPrereqs,0)]
		};
		case "Level":{
			[h:levelPrereqData = json.get(SpellPrerequisites,"Level")]
			[h:levelCast = json.get(spellInfo,"Level")]
			[h:maxLevel = json.get(levelPrereqData,"Maximum")]
			[h:minLevel = json.get(levelPrereqData,"Minimum")]
			[h,if(maxLevel != ""): meetsSpellPrereqs = min(meetsSpellPrereqs,levelCast > maxLevel)]
			[h,if(minLevel != ""): meetsSpellPrereqs = min(meetsSpellPrereqs,levelCast < minLevel)]
			[h:return(meetsSpellPrereqs,0)]
		};
		case "LevelCast":{
			[h:levelPrereqData = json.get(SpellPrerequisites,"SlotUsed")]
			[h:levelCast = json.get(spellInfo,"SlotUsed")]
			[h:maxLevelCast = json.get(levelPrereqData,"Maximum")]
			[h:minLevelCast = json.get(levelPrereqData,"Minimum")]
			[h,if(maxLevelCast != ""): meetsSpellPrereqs = min(meetsSpellPrereqs,levelCast > maxLevelCast)]
			[h,if(minLevelCast != ""): meetsSpellPrereqs = min(meetsSpellPrereqs,levelCast < minLevelCast)]
			[h:return(meetsSpellPrereqs,0)]
		}
	]
};{
	[h:meetsSpellPrereqs = 0]
}]
[h:return(0,meetsSpellPrereqs)]