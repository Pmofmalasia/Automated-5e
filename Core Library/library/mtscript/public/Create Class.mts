[h:cl.LevelOptions = "None,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"]

[h:cl.AttributePrereqs = " junkVar | ------------------------------------- Multiclassing Requirements ------------------------------------- |  | LABEL | SPAN=TRUE ## cl.AllorOne | All,One | Requires all conditions to be met or just one | LIST "]
[h:cl.AttributeList = pm.GetAttributes()]
[h,foreach(TempAttribute,cl.AttributeList): cl.AttributePrereqs = listAppend(cl.AttributePrereqs," cl."+json.get(TempAttribute,"Name")+"Prereq | "+cl.LevelOptions+" | "+json.get(TempAttribute,"DisplayName")+" | LIST | SELECT=13","##")]

[h:abort(input(
	" cl.Name | -- Name Here -- | Enter class name ",
	" cl.SubclassLevel | "+cl.LevelOptions+" | Level at which subclasses are taken | LIST ",
	" cl.Source | "+pm.GetBookInfo("DisplayName")+" | Which sourcebook is the class from | LIST | VALUE=STRING ",
	" cl.Spellcasting |  | <html><span title='Applies to shared spell slots (most classes) and non-shared (e.g. Warlock). Does NOT apply to abilities that let you cast a spell using their own resource (e.g. Way of the Four Elements Monk)'>Does this class gain access to spellcasting using spell slots</span></html> | CHECK ",
	" cl.HitDie | 4,6,8,10,12 | Hit Die Size | LIST | VALUE=STRING ",
	cl.AttributePrereqs
))]


[h:cl.FinalPrereqs = ""]
[h:cl.AllorOneFinal = 0]
[h,foreach(TempAttribute,cl.AttributeList),CODE:{
	[h:cl.AllorOneFinal = if(cl.AllorOne,1,if(eval("cl."+json.get(TempAttribute,"Name")+"Prereq")>0,cl.AllorOneFinal+1,cl.AllorOneFinal))]
	[h:cl.FinalPrereqs = if(eval("cl."+json.get(TempAttribute,"Name")+"Prereq")>0,json.set(cl.FinalPrereqs,json.get(TempAttribute,"Name"),eval("cl."+json.get(TempAttribute,"Name")+"Prereq")),cl.FinalPrereqs)]
}]
[h:cl.FinalPrereqs = json.set(cl.FinalPrereqs,"AllOrOne",cl.AllorOneFinal))]

[h:cl.SourcebookLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(cl.Source)+"')]['Library']"),0)]

[h:cl.Final = json.set("","Name",pm.RemoveSpecial(cl.Name),"DisplayName",cl.Name,"SubclassLevel",cl.SubclassLevel,"HitDie",cl.HitDie,"Prereqs",cl.FinalPrereqs)]

[h:abort(input(
	" junkVar |  ------------------------ Choose Levels for ASI ------------------------ | | LABEL | SPAN=TRUE ",
	" cl.ASI1 |  | 1 | CHECK ",
	" cl.ASI2 |  | 2 | CHECK ",
	" cl.ASI3 |  | 3 | CHECK ",
	" cl.ASI4 | 1 | 4 | CHECK ",
	" cl.ASI5 |  | 5 | CHECK ",
	" cl.ASI6 |  | 6 | CHECK ",
	" cl.ASI7 |  | 7 | CHECK ",
	" cl.ASI8 | 1 | 8 | CHECK ",
	" cl.ASI9 |  | 9 | CHECK ",
	" cl.ASI10 |  | 10 | CHECK ",
	" cl.ASI11 |  | 11 | CHECK ",
	" cl.ASI12 | 1 | 12 | CHECK ",
	" cl.ASI13 |  | 13 | CHECK ",
	" cl.ASI14 |  | 14 | CHECK ",
	" cl.ASI15 |  | 15 | CHECK ",
	" cl.ASI16 | 1 | 16 | CHECK ",
	" cl.ASI17 |  | 17 | CHECK ",
	" cl.ASI18 |  | 18 | CHECK ",
	" cl.ASI19 | 1 | 19 | CHECK ",
	" cl.ASI20 |  | 20 | CHECK "
))]

[h:cl.ASILevels = "[]"]
[h,count(20): cl.ASILevels = if(eval("cl.ASI"+(roll.count+1)),json.append(cl.ASILevels,(roll.count+1)),cl.ASILevels)]
[h:cl.Final = json.set(cl.Final,"ASILevels",cl.ASILevels)]

[h,if(cl.Spellcasting),CODE:{
	[h:pm.CreateSpellcastingClass(json.set("","Class",pm.RemoveSpecial(cl.Name),"Subclass","","Library",cl.SourcebookLib))]
};{}]

[h:abort(input(
	" junkVar | Choose Proficiencies Gained at Level 1 | 0 | LABEL | SPAN=TRUE ",	" junkVar | ---------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" cl.SkillProficiencies | No,By Choice,Preset,Some of Both | Affects skill proficiencies | LIST ",
	" cl.SaveProficiencies | No,By Choice,Preset,Some of Both | Affects save proficiencies | LIST ",
	" cl.WeaponProficiencies | No,By Choice,Preset,Some of Both | Affects weapon proficiencies | LIST ",
	" cl.ArmorProficiencies | No,By Choice,Preset,Some of Both | Affects armor proficiencies | LIST "
	))]

[h:cl.Base =  json.set("",
	"Name",pm.RemoveSpecial(cl.Name)+"Proficiencies",
	"DisplayName",cl.Name+" Proficiencies",
	"Class",pm.RemoveSpecial(cl.Name),
	"Subclass","",
	"Level",1,
	"Library",cl.SourcebookLib
)]

[h,if(cl.SkillProficiencies==1 || cl.SkillProficiencies==3),CODE:{
	[h:cl.Base = json.set(cl.Base,"SkillOptions",pm.SkillSelectionChoices())]
};{}]
	
[h,if(cl.SkillProficiencies==2 || cl.SkillProficiencies==3),CODE:{
	[h:cl.Base = json.set(cl.Base,"Skills",pm.SkillSelectionPreset())]
}]

[h,if(cl.SaveProficiencies==1 || cl.SaveProficiencies==3),CODE:{
	[h:cl.Base = json.set(cl.Base,"SaveOptions",pm.SaveSelectionChoices())]
};{}]

[h,if(cl.SaveProficiencies==2 || cl.SaveProficiencies==3),CODE:{
	[h:cl.Base = json.set(cl.Base,"Saves",pm.SaveSelectionPreset())]
}]

[h,if(cl.WeaponProficiencies==1 || cl.WeaponProficiencies==3),CODE:{
	[h:cl.Base = json.set(cl.Base,"WeaponOptions",pm.WeaponSelectionChoices())]
};{}]

[h,if(cl.WeaponProficiencies==2 || cl.WeaponProficiencies==3),CODE:{
	[h:cl.Base = json.set(cl.Base,"Weapons",pm.WeaponSelectionPreset())]
};{}]

[h,if(cl.ArmorProficiencies==1 || cl.WeaponProficiencies==3),CODE:{
	[h:cl.Base = json.set(cl.Base,"ArmorOptions",pm.ArmorSelectionChoices())]
};{}]

[h,if(cl.ArmorProficiencies==2 || cl.WeaponProficiencies==3),CODE:{
	[h:cl.Base = json.set(cl.Base,"Armor",pm.ArmorSelectionPreset())]
};{}]

[h:abort(input(
	" junkVar | Choose Proficiencies Gained when Multiclassing | 0 | LABEL | SPAN=TRUE ",	" junkVar | ---------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" cl.SkillProficiencies | No,By Choice,Preset,Some of Both | Affects skill proficiencies | LIST ",
	" cl.SaveProficiencies | No,By Choice,Preset,Some of Both | Affects save proficiencies | LIST ",
	" cl.WeaponProficiencies | No,By Choice,Preset,Some of Both | Affects weapon proficiencies | LIST ",
	" cl.ArmorProficiencies | No,By Choice,Preset,Some of Both | Affects armor proficiencies | LIST "
	))]

[h:cl.Multi = json.set("",
	"Name",pm.RemoveSpecial(cl.Name)+"MulticlassProficiencies",
	"DisplayName",cl.Name+" Multiclass Proficiencies",
	"Class",pm.RemoveSpecial(cl.Name),
	"Subclass","",
	"Level",1,
	"HitDie",cl.HitDie,
	"Library",cl.SourcebookLib
)]


[h,if(cl.SkillProficiencies==1 || cl.SkillProficiencies==3),CODE:{
	[h:cl.Multi = json.set(cl.Multi,"SkillOptions",pm.SkillSelectionChoices())]
};{}]
	
[h,if(cl.SkillProficiencies==2 || cl.SkillProficiencies==3),CODE:{
	[h:cl.Multi = json.set(cl.Multi,"Skills",pm.SkillSelectionPreset())]
}]

[h,if(cl.SaveProficiencies==1 || cl.SaveProficiencies==3),CODE:{
	[h:cl.Multi = json.set(cl.Multi,"SaveOptions",pm.SaveSelectionChoices())]
};{}]

[h,if(cl.SaveProficiencies==2 || cl.SaveProficiencies==3),CODE:{
	[h:cl.Multi = json.set(cl.Multi,"Saves",pm.SaveSelectionPreset())]
}]

[h,if(cl.WeaponProficiencies==1 || cl.WeaponProficiencies==3),CODE:{
	[h:cl.Multi = json.set(cl.Multi,"WeaponOptions",pm.WeaponSelectionChoices())]
};{}]

[h,if(cl.WeaponProficiencies==2 || cl.WeaponProficiencies==3),CODE:{
	[h:cl.Multi = json.set(cl.Multi,"Weapons",pm.WeaponSelectionPreset())]
};{}]

[h,if(cl.ArmorProficiencies==1 || cl.WeaponProficiencies==3),CODE:{
	[h:cl.Multi = json.set(cl.Multi,"ArmorOptions",pm.ArmorSelectionChoices())]
};{}]

[h,if(cl.ArmorProficiencies==2 || cl.WeaponProficiencies==3),CODE:{
	[h:cl.Multi = json.set(cl.Multi,"Armor",pm.ArmorSelectionPreset())]
};{}]

[h:cl.Final = json.set(cl.Final,"FullProficiencies",cl.Base,"MultiProficiencies",cl.Multi)]

[h:setLibProperty("sb.Classes",json.sort(json.append(getLibProperty("sb.Classes","Lib:"+cl.SourcebookLib),cl.Final),"a","DisplayName"),"Lib:"+cl.SourcebookLib)]

[r:cl.Name+" class from the sourcebook "+cl.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]