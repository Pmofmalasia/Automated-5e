[h:sp.SpellcastingAbility = arg(0)]
[h:abort(input(
	" junkVar | ---------------------- Spellcasting Info ---------------------- |  | LABEL | SPAN=TRUE ",
	" sp.LevelGained | 0,1,2,3,4,5 | Level Spellcasting is Gained | LIST | SELECT=1 ",
	" sp.HalfFull | Full Caster,Half Caster,Third Caster | Caster Type | LIST ",
	" sp.Stat | "+pm.GetAttributes()+" | Primary Casting Stat | LIST | VALUE=STRING ",
	" sp.Ritual |  | Can Ritual Cast | CHECK ",
	" sp.MagicSource | Arcane,Divinity | Source of Magic | LIST | VALUE=STRING ",
	" sp.Prepared | Known,Prepared | Knows or Prepares Spells | LIST ",
	" junkVar | ---------------------------------------------------------------------------------------- |  | LABEL | SPAN=TRUE ",
	" sp.OtherList |  | Uses the spell list of another class | CHECK "
))]
[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,
	"Name","Spellcasting",
	"DisplayName","Spellcasting",
	"Level",sp.LevelGained,
	"PrimeStat",sp.Stat,
	"CasterType",if(sp.HalfFull==0,1,if(sp.HalfFull==1,(1/2),(1/3))),
	"Ritual",sp.Ritual,
	"MagicSource",sp.MagicSource,
	"Prepared",sp.Prepared,
	"CallSpellClass",1,
	"GainOnLevel",1
))]

[h,if(sp.OtherList),CODE:{
	[h:pm.SchoolInput = ""]
	[h,foreach(school,pm.GetSpellSchools("json")): pm.SchoolInput = listAppend(pm.SchoolInput,"sp."+school+" |  | "+school+" | CHECK ","##")]
	
	[h:abort(input(
		" sp.ClassList | "+pm.GetClasses("DisplayName")+" | Other class list to use | LIST | VALUE=STRING",
		" junkVar | ------------------ Valid Spell Schools From Class ------------------ |  | LABEL | SPAN=TRUE ",
		pm.SchoolInput	
	))]

	[h:pm.ValidSchools = ""]
	[h,foreach(school,pm.GetSpellSchools("json")): pm.ValidSchools = if(eval("sp."+school),json.append(pm.ValidSchools,school),pm.ValidSchools)]
	[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,
		"ClassList",pm.RemoveSpecial(sp.ClassList),
		"ValidSchools",pm.ValidSchools
		)]
};{}]

[h:setLibProperty("sb.Abilities",json.append(getLibProperty("sb.Abilities","Lib:"+json.get(sp.SpellcastingAbility,"Library")),sp.SpellcastingAbility),"Lib:"+json.get(sp.SpellcastingAbility,"Library"))]