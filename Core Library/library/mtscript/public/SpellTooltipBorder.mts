[h:AllSpellData = macro.args]
[h:ParentToken = json.get(AllSpellData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:Flavor = json.get(AllSpellData,"Flavor")]
[h:SpellName = json.get(AllSpellData,"Spell")]
[h:SpellData = pm.a5e.GetSpecificSpell(SpellName)]
[h:SpellLevel = json.get(SpellData,"Level")]
[h:needsSplitGMOutput = (getProperty("a5e.stat.Allegiance") == "Enemy")]

[h:AllSpellData = json.set(AllSpellData,"SpellData",SpellData)]
[h,macro("SpellTooltip@Lib:pm.a5e.Core"): AllSpellData]
[h:abilityTable = json.get(macro.return,"Table")]
[h:SpellSource = json.get(macro.return,"Source")]
[h:SpellDescription = json.get(macro.return,"Description")]
[h:SpellDisplayName = json.get(macro.return,"DisplayName")]

[h:BorderData = json.set("",
	"Name",SpellName,
	"DisplayName",SpellDisplayName,
	"FalseName","Spellcasting",
	"DisplayClass","zzSpell",
	"ColorSubtype",json.set("","Source",SpellSource,"Level",SpellLevel)
)]
[h:TooltipOutputComponents = json.set("",
	"ParentToken",ParentToken,
	"needsSplitGMOutput",needsSplitGMOutput,
	"BorderData",BorderData,
	"Table",json.remove(abilityTable,0),
	"ShowFullRulesType",json.append("",SpellName,"Spell"),
	"OutputTargets","",
	"Description",SpellDescription,
	"AbridgedDescription",SpellDescription
)]
[r,MACRO("GatherTooltipComponents@Lib:pm.a5e.Core"): TooltipOutputComponents]