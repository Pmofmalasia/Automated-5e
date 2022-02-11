[h:abort(input(
	" sr.Name | -- Name Here -- | Enter subrace name ",
	" sr.Race | "+pm.GetRaces("DisplayName")+" | Choose an associated race | LIST | VALUE=STRING ",
	" sr.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the subclass from | LIST | VALUE=STRING ",
	" junkVar | ----------------------------------------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" sr.Darkvision |  | Gives Darkvision | CHECK ",
	" sr.Languages |  | Gives Additional Languages | CHECK ",
	" sr.Res |  | Gives Damage Resistances | CHECK ",
	" sr.CondImmun |  | Gives Condition Immunities | CHECK ",
	" sr.Speed |  | Gives a Speed Bonus | CHECK ",
	" sr.Burrow |  | Gives a Burrowing Speed | CHECK ",
	" sr.Climb |  | Gives a Climbing Speed | CHECK ",
	" sr.Fly |  | Gives a Flying Speed | CHECK ",
	" sr.Swim |  | Gives a Swimming Speed | CHECK ",
	" sr.MaxHP |  | Gives Max HP Bonus | CHECK ",	" junkVar | ----------------------------------------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" sr.AttributeAllocation | None,By Choice,Preset,Some of Both | How are Attributes Allocated | LIST | SELECT=2 ",
	" sr.SkillProficiencies | None,By Choice,Preset,Some of Both | Affects skill proficiencies | LIST ",
	" sr.SaveProficiencies | None,By Choice,Preset,Some of Both | Affects save proficiencies | LIST ",
	" sr.WeaponProficiencies | None,By Choice,Preset,Some of Both | Affects weapon proficiencies | LIST ",
	" sr.ArmorProficiencies | None,By Choice,Preset,Some of Both | Affects armor proficiencies | LIST ",
	" sr.FeatChoice |  | Allows for Choosing a Feat at Level 1 | CHECK ",
	" sr.MiscChoice | None,Chosen at Creation,Can Change Later | <html><span title='For choices that do not quite rise to the level of subrace. Mostly for Dragonborn colors since they can have subraces on top of colors in some books.'>Makes some other choice at Level 1</span></html> | LIST "
	))]

[h:sr.Final = json.set("","Name",pm.RemoveSpecial(sr.Name),"DisplayName",sr.Name,"FeatChoice",sr.FeatChoice,"Race",pm.RemoveSpecial(sr.Race))]
[h:sr.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(sr.Source)+"')]['Library']"),0)]

[h:sr.Base =  json.set("",
	"Name",pm.RemoveSpecial(sr.Name)+"Traits",
	"DisplayName",sr.Name+" Traits",
	"Class",pm.RemoveSpecial(sr.Race),
	"Subclass",pm.RemoveSpecial(sr.Name),
	"Level",1,
	"Library",sr.SourcebookLib
	))]

[h,if(sr.FeatChoice): sr.Base = json.set(sr.Base,"FeatChoice",sr.FeatChoice)]
[h,if(sr.Res): sr.Base = json.set(sr.Base,"CallRes",sr.Res)]
[h,if(sr.MaxHP): sr.Base = json.set(sr.Base,"CallMaxHPBonus",sr.MaxHP)]
[h,if(sr.CondImmun): sr.Base = json.set(sr.Base,"CallCondImmun",sr.CondImmun)]
[h,if(sr.Languages),CODE:{
	[h:sr.Base = json.set(sr.Base,"CallLanguages",sr.Languages)]
	[h:sr.Base = json.merge(sr.Base,pm.LanguageChoices())]
}]

[h:"<!-- Greater than 0 for when I eventually change the input to have the number for distance (or 0 for none) -->"]
[h,if(sr.Darkvision>0): sr.Base = json.set(sr.Base,"CallSenses",1)]
[h,if(sr.Speed>0): sr.Base = json.set(sr.Base,"CallSpeed",1)]
[h,if(sr.Burrow>0): sr.Base = json.set(sr.Base,"CallSpeed",1)]
[h,if(sr.Climb>0): sr.Base = json.set(sr.Base,"CallSpeed",1)]
[h,if(sr.Fly>0): sr.Base = json.set(sr.Base,"CallSpeed",1)]
[h,if(sr.Swim>0): sr.Base = json.set(sr.Base,"CallSpeed",1)]

[h,if(sr.AttributeAllocation==1 || sr.AttributeAllocation==3),CODE:{
	[h:sr.Base = json.set(sr.Base,"AttributeOptions",pm.AttributeSelectionChoices())]
};{}]
	
[h,if(sr.AttributeAllocation==2 || sr.AttributeAllocation==3),CODE:{
	[h:sr.Base = json.set(sr.Base,"Attributes",pm.AttributeSelectionPreset())]
};{}]
	
[h,if(sr.SkillProficiencies==1 || sr.SkillProficiencies==3),CODE:{
	[h:sr.Base = json.set(sr.Base,"SkillOptions",pm.SkillSelectionChoices())]
};{}]
	
[h,if(sr.SkillProficiencies==2 || sr.SkillProficiencies==3),CODE:{
	[h:sr.Base = json.set(sr.Base,"Skills",pm.SkillSelectionPreset())]
}]

[h,if(sr.SaveProficiencies==1 || sr.SaveProficiencies==3),CODE:{
	[h:sr.Base = json.set(sr.Base,"SaveOptions",pm.SaveSelectionChoices())]
};{}]

[h,if(sr.SaveProficiencies==2 || sr.SaveProficiencies==3),CODE:{
	[h:sr.Base = json.set(sr.Base,"Saves",pm.SaveSelectionPreset())]
}]

[h,if(sr.WeaponProficiencies==1 || sr.WeaponProficiencies==3),CODE:{
	[h:sr.Base = json.set(sr.Base,"WeaponOptions",pm.WeaponSelectionChoices())]
};{}]

[h,if(sr.WeaponProficiencies==2 || sr.WeaponProficiencies==3),CODE:{
	[h:sr.Base = json.set(sr.Base,"Weapons",pm.WeaponSelectionPreset())]
};{}]

[h,if(sr.ArmorProficiencies==1 || sr.WeaponProficiencies==3),CODE:{
	[h:sr.Base = json.set(sr.Base,"ArmorOptions",pm.ArmorSelectionChoices())]
};{}]

[h,if(sr.ArmorProficiencies==2 || sr.WeaponProficiencies==3),CODE:{
	[h:sr.Base = json.set(sr.Base,"Armor",pm.ArmorSelectionPreset())]
};{}]

[h,if(sr.MiscChoice==1),CODE:{
	[h:abort(input(
		" junkVar | ---------------------- Miscellaneous Choice Info ---------------------- |  | LABEL | SPAN=TRUE ",
		" sr.ChoiceTitle |  | Type a description of the choice being made ",
		" sr.ChoiceOptions |  | Type the options available, separated by a comma "
		))]
	[h:sr.Base = json.set(sr.Base,
		"MiscChoice",json.set("","Title",sr.ChoiceTitle,"Options",sr.ChoiceOptions)
	)]
};{
	[h,if(sr.MiscChoice==2): sr.Base = json.set(sr.Base,"StoredValue","")]
}]

[h:sr.Final = json.set(sr.Final,"Traits",sr.Base)]

[h:setLibProperty("sb.Subraces",json.append(getLibProperty("sb.Subraces","Lib:"+sr.SourcebookLib),sr.Final),"Lib:"+sr.SourcebookLib)]

[r:sr.Race+" subrace "+sr.Name+" from the sourcebook "+sr.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]