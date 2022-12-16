[h:SpellData = pm.a5e.GetSpecificSpell(json.get(macro.args,"Spell"))]
[h:NonSpellData = json.remove(macro.args,"Spell")]
[h:ParentToken = json.get(NonSpellData,"ParentToken")]
[h:IsTooltip = 1]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Spell"]

[h:"<!-- TODO: Make a SpellTooltipBorder so the table can be inserted into other things -->"]