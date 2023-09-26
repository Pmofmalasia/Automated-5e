[h:ra.LevelOptions = "None,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"]

[h:abort(input(
	" ra.Name | -- Name Here -- | Enter race name ",
	" ra.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the race from | LIST | VALUE=STRING ",
	" junkVar | ----------------------------------------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" ra.Size | Tiny,Small,Medium,Large,Huge,Choose From Multiple | Size of Race | LIST | VALUE=STRING SELECT=2 ",
	" ra.CreatureType | "+pm.GetCreatureTypes("DisplayName")+" | Type of Creature | LIST | VALUE=STRING ",
	" ra.CountsAs | None,"+pm.GetRaces("DisplayName")+" | <html><span title='For the purposes of magic items, features that require X race'>Counts as another race</span></html> | LIST | VALUE=STRING ",
	" ra.Senses |  | Gives Special Senses (including Darkvision) | CHECK ",
	" ra.Res |  | Gives Damage Resistance | CHECK ",
	" ra.CondImmun |  | Gives Condition Immunities | CHECK ",
	" ra.Burrow |  | Gives a Burrowing Speed | CHECK ",
	" ra.Climb |  | Gives a Climbing Speed | CHECK ",
	" ra.Fly |  | Gives a Flying Speed | CHECK ",
	" ra.Swim |  | Gives a Swimming Speed | CHECK ",
	" ra.MaxHP |  | Gives Max HP Bonus | CHECK ",
	" junkVar | ----------------------------------------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" ra.AttributeAllocation | None,By Choice,Preset,Some of Both,Choice of +2/+1 or +1/+1/+1 | How are Attributes Allocated | LIST | SELECT=2 ",
	" ra.SkillProficiencies | None,By Choice,Preset,Some of Both | Affects skill proficiencies | LIST ",
	" ra.SaveProficiencies | None,By Choice,Preset,Some of Both | Affects save proficiencies | LIST ",
	" ra.WeaponProficiencies | None,By Choice,Preset,Some of Both | Affects weapon proficiencies | LIST ",
	" ra.ArmorProficiencies | None,By Choice,Preset,Some of Both | Affects armor proficiencies | LIST ",
	" ra.FeatChoice |  | Allows for Choosing a Feat at Level 1 | CHECK ",
	" ra.MiscChoice | None,Chosen at Creation,Can Change Later | <html><span title='For choices that do not quite rise to the level of subrace. Mostly for Dragonborn colors since they can have subraces on top of colors in some books.'>Makes some other choice at Level 1</span></html> | LIST "
))]

[h:ra.Final = json.set("","Name",pm.RemoveSpecial(ra.Name),"DisplayName",ra.Name,"CreatureType",ra.CreatureType)]

[h:ra.SourcebookLib = json.get(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[?(@.Name=='"+pm.RemoveSpecial(ra.Source)+"')]['Library']"),0)]

[h:ra.Base =  json.set("",
	"Name",pm.RemoveSpecial(ra.Name)+"Traits",
	"DisplayName",ra.Name+" Traits",
	"Class",pm.RemoveSpecial(ra.Name),
	"Subclass","",
	"Level",1,
	"CallSpeed",1,
	"CallLanguages",1,
	"Library",ra.SourcebookLib
)]

[h,if(ra.CountsAs!="None"): json.set(ra.Base,"RaceCountsAs",pm.RemoveSpecial(ra.CountsAs))]

[h,if(ra.Size=="Choose From Multiple"),CODE:{
	[h:abort(input(
		" junkVar | ---------- Select Valid Sizes ---------- | | LABEL | SPAN=TRUE ",
		" canBeTiny |  | Tiny | CHECK ",
		" canBeSmall |  | Small | CHECK ",
		" canBeMedium |  | Medium | CHECK ",
		" canBeLarge |  | Large | CHECK ",
		" canBeHuge |  | Huge | CHECK "
	))]

	[h:ra.SizeOptions = ""]
	[h,if(canBeTiny): ra.SizeOptions = json.append(ra.SizeOptions,"Tiny")]
	[h,if(canBeSmall): ra.SizeOptions = json.append(ra.SizeOptions,"Small")]
	[h,if(canBeMedium): ra.SizeOptions = json.append(ra.SizeOptions,"Medium")]
	[h,if(canBeLarge): ra.SizeOptions = json.append(ra.SizeOptions,"Large")]
	[h,if(canBeHuge): ra.SizeOptions = json.append(ra.SizeOptions,"Huge")]
	[h:ra.Base = json.set(ra.Base,"SizeOptions",ra.SizeOptions)]
};{
	[h:ra.Base = json.set(ra.Base,"Size",ra.Size)]
}]

[h:ra.Base = json.merge(ra.Base,pm.LanguageChoices())]

[h,if(ra.FeatChoice): ra.Base = json.set(ra.Base,"FeatChoice",ra.FeatChoice)]
[h,if(ra.Res): ra.Base = json.set(ra.Base,"CallRes",ra.Res)]
[h,if(ra.MaxHP): ra.Base = json.set(ra.Base,"CallMaxHPBonus",ra.MaxHP)]
[h,if(ra.CondImmun): ra.Base = json.set(ra.Base,"CallCondImmun",ra.CondImmun)]

[h:"<!-- Greater than 0 for when I eventually change the input to have the number for distance (or 0 for none) -->"]
[h,if(ra.Senses>0): ra.Base = json.set(ra.Base,"CallSenses",1)]
[h,if(ra.Burrow>0): ra.Base = json.set(ra.Base,"CallBurrowSet",1)]
[h,if(ra.Climb>0): ra.Base = json.set(ra.Base,"CallClimbSet",1)]
[h,if(ra.Fly>0): ra.Base = json.set(ra.Base,"CallFlySet",1)]
[h,if(ra.Swim>0): ra.Base = json.set(ra.Base,"CallSwimSet",1)]

[h,if(ra.AttributeAllocation==1 || ra.AttributeAllocation==3),CODE:{
	[h:ra.Base = json.set(ra.Base,"AttributeOptions",pm.AttributeSelectionChoices())]
};{}]
	
[h,if(ra.AttributeAllocation==2 || ra.AttributeAllocation==3),CODE:{
	[h:ra.Base = json.set(ra.Base,"Attributes",pm.AttributeSelectionPreset())]
};{}]

[h,if(ra.AttributeAllocation==4): ra.Base = json.set(ra.Base,"AttributeOptions","FlexibleChoice")]
	
[h,if(ra.SkillProficiencies==1 || ra.SkillProficiencies==3),CODE:{
	[h:ra.Base = json.set(ra.Base,"SkillOptions",pm.SkillSelectionChoices())]
};{}]
	
[h,if(ra.SkillProficiencies==2 || ra.SkillProficiencies==3),CODE:{
	[h:ra.Base = json.set(ra.Base,"Skills",pm.SkillSelectionPreset())]
}]

[h,if(ra.SaveProficiencies==1 || ra.SaveProficiencies==3),CODE:{
	[h:ra.Base = json.set(ra.Base,"SaveOptions",pm.SaveSelectionChoices())]
};{}]

[h,if(ra.SaveProficiencies==2 || ra.SaveProficiencies==3),CODE:{
	[h:ra.Base = json.set(ra.Base,"Saves",pm.SaveSelectionPreset())]
}]

[h,if(ra.WeaponProficiencies==1 || ra.WeaponProficiencies==3),CODE:{
	[h:ra.Base = json.set(ra.Base,"WeaponOptions",pm.WeaponSelectionChoices())]
};{}]

[h,if(ra.WeaponProficiencies==2 || ra.WeaponProficiencies==3),CODE:{
	[h:ra.Base = json.set(ra.Base,"Weapons",pm.WeaponSelectionPreset())]
};{}]

[h,if(ra.ArmorProficiencies==1 || ra.WeaponProficiencies==3),CODE:{
	[h:ra.Base = json.set(ra.Base,"ArmorOptions",pm.ArmorSelectionChoices())]
};{}]

[h,if(ra.ArmorProficiencies==2 || ra.WeaponProficiencies==3),CODE:{
	[h:ra.Base = json.set(ra.Base,"Armor",pm.ArmorSelectionPreset())]
};{}]

[h,if(ra.MiscChoice==1),CODE:{
	[h:abort(input(
		" junkVar | ---------------------- Miscellaneous Choice Info ---------------------- |  | LABEL | SPAN=TRUE ",
		" ra.ChoiceTitle |  | Type a description of the choice being made ",
		" ra.ChoiceOptions |  | Type the options available, separated by a comma "
		))]
	[h:ra.Base = json.set(ra.Base,
		"MiscChoice",json.set("","Title",ra.ChoiceTitle,"Options",ra.ChoiceOptions)
	)]
};{
	[h,if(ra.MiscChoice==2): ra.Base = json.set(ra.Base,"StoredValue","")]
}]

[h:ra.Final = json.set(ra.Final,"Traits",ra.Base)]

[h:setLibProperty("sb.Races",json.append(getLibProperty("sb.Races","Lib:"+ra.SourcebookLib),ra.Final),"Lib:"+ra.SourcebookLib)]

[r:ra.Name+" race from the sourcebook "+ra.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]