[h,foreach(filter,pm.AllSpellInfo),CODE:{
	[h:pm.SpellFilter(filter)]
	[h:pm.SpellOptions = listSort(json.get(macro.return,"Options"),"A+")]
	[h,if(json.length(pm.CurrentSpellList)<=pm.CurrentSpellPosition): pm.CurrentSpell = "None"; pm.CurrentSpell = json.get(pm.CurrentSpellList,pm.CurrentSpellPosition)]
	[h,count(json.get(filter,"Number")),CODE:{
		[h:spellNum = spellNum+1]
		[h,if(json.length(pm.CurrentSpellList)<=pm.CurrentSpellPosition): pm.CurrentSpell = "None"; pm.CurrentSpell = json.get(pm.CurrentSpellList,pm.CurrentSpellPosition)]
		[h:pm.SpellChoiceInput = listAppend(pm.SpellChoiceInput,"spell"+spellNum+" | "+pm.CurrentSpell+","+pm.SpellOptions+" | Spell #"+spellNum+" | LIST | VALUE=STRING ","##")]
		[h:pm.CurrentSpellPosition=pm.CurrentSpellPosition+1]
	}]
	[h:filterNum = filterNum+1]
}]