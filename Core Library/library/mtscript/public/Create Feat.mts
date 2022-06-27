[h:ab.Sourcebooks = pm.GetBookInfo("DisplayName",",")]
[h:ab.ClassList = pm.GetClasses("DisplayName",",")]
[h:ab.RaceList = pm.GetRaces("DisplayName",",")]
[h:ab.LevelList = "None,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"]
[h:ab.Class = "Feat"]

[h:abort(input(
	" junkVar | -------------------------------------------- Basic Feat Info -------------------------------------------- |  | LABEL | SPAN=TRUE ",
	" ab.Name | -- Name Here -- | Enter Feat Name ",
	" ab.Level | "+ab.LevelList+" | Level Gained | LIST ",
	" ab.Source | "+ab.Sourcebooks+" | Associated Sourcebook | LIST | VALUE=STRING ",
	" junkVar | -------------------------------------------------------------------------------------------------------------- |  | LABEL | SPAN=TRUE ",
	" ab.HasMaster | No,Yes,Yes - Not Created Yet | <html><span title='Abilities with multiple named options, e.g. Battle Master Fighter - Combat Superiority Maneuvers, Totem Barbarian, Hunter Ranger'>Has an associated main feature</span></html> | LIST ",
	" ab.OnLevel | 0 | <html><span title='Uncheck for abilities that must be chosen to be gained, e.g. Eldritch Invocations or Hunter Ranger features'>Gained Automatically on Level Up</span></html> | CHECK ",
	" ab.Optional | 0 | <html><span title='For sourcebooks that add optional additional rules'>Optional Ability</span></html> | CHECK ",
	" ab.Replace | No,Yes,Yes - Not Created Yet | <html><span title='For sourcebooks that optionally remove old abilities and replace them with new ones.'>Replaces another Feature if Gained</span></html> | LIST ",
	" junkVar | -------------------------------------------------------------------------------------------------------------- |  | LABEL | SPAN=TRUE ",
	"ab.Prereqs |  | <html><span title='Mostly for features not gained automatically on level up, like Invocations or Feats. Ignore if level/class/subclass are the only prerequisites.'>Feature has prerequisites for being gained</span></html> | CHECK ",
	"ab.MultiAbility |  | <html><span title='Pretty much just for Elemental Adept at this point. Can be used for anything similar.'>Feature can be gained multiple times</span></html> | CHECK "
	))]

[h:ab.UpdateLevelOptions = string(ab.Level)]
[h,count(20-ab.Level): ab.UpdateLevelOptions = listAppend(ab.UpdateLevelOptions,ab.Level+roll.count+1)]
[h:ab.SourceLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(ab.Source)+"')]['Library']"),0)]
[h:ab.Master=""]
[h:ab.DisplayName = ab.Name]
[h:ab.Name = pm.RemoveSpecial(ab.Name)]
[h:ab.Final = json.set("",
	"Name",ab.Name,
	"DisplayName",ab.DisplayName,
	"Type","Feat",
	"Class",pm.RemoveSpecial(ab.Class),
	"Level",ab.Level,
	"GainOnLevel",ab.OnLevel,
	"Optional",ab.Optional,
	"MultiAbility",ab.MultiAbility,
	"Library",ab.SourceLib
)]

[h:ab.Subclass="None"]
[h:abort(input(if(ab.HasMaster," ab.MasterType | Class,Race,Feat,Background | Master Feature Type | RADIO | VALUE=STRING ",""),
	if(ab.Replace," ab.ReplaceType | Class,Race,Feat,Background | Replaced Feature Type | RADIO | VALUE=STRING ","")
))]

[h:ab.Subclass = if(ab.Subclass == "None","",pm.RemoveSpecial(ab.Subclass))]
[h:ab.Final = json.set(ab.Final,"Subclass",ab.Subclass)]

[h,if(ab.HasMaster>0),CODE:{
	[h,if(ab.HasMaster>1),CODE:{
		[h:ab.MasterInput=""]
		[h,SWITCH(ab.MasterType):
			case "Class": ab.MasterInput=" ab.MasterClass | "+ab.ClassList+" | Class associated with Master Feature | LIST | VALUE=STRING ## junkVar | Next Screen | Subclass Selection | LABEL";
			case "Race": ab.MasterInput=" ab.MasterClass | "+ab.RaceList+" | Class associated with Master Feature | LIST | VALUE=STRING ## junkVar | Next Screen | Subrace Selection | LABEL";
			default: ab.MasterClass = ab.MasterType
		]
		[h:abort(input(ab.MasterInput))]

		[h,SWITCH(ab.MasterType):
			case "Class": ab.MasterInput=" ab.MasterSubclass | None,"+pm.GetSubclasses(ab.Class,"DisplayName")+" | Subclass associated with Master Feature | LIST | VALUE=STRING ";
			case "Race": ab.MasterInput=" ab.MasterSubclass | None,"+pm.GetSubraces(ab.Class,"DisplayName")+" | Subrace associated with Master Feature | LIST | VALUE=STRING ";
			default: ab.MasterSubclass=""
		]
		[h:abort(input(ab.MasterInput))]
		
		[h:ab.MasterSubclass = pm.RemoveSpecial(ab.MasterSubclass)]
		[h:ab.MasterOptions = json.toList(json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[?(@.Class=='"+ab.MasterClass+"' && (@.Subclass==''|| @.Subclass=='"+ab.MasterSubclass+"'))]['DisplayName']"))]

		[h:abort(input(" ab.MasterName | "+ab.MasterOptions+" | Name of Master Feature | LIST | VALUE=STRING "))]

		[h:ab.MasterFeature = json.set("","Name",pm.RemoveSpecial(ab.MasterName),"DisplayName",ab.MasterName,"Class",ab.MasterClass,"Subclass",if(ab.MasterSubclass=="None","",pm.RemoveSpecial(ab.MasterSubclass)))]
	};{
		[h:ab.MasterInput = ""]
		[h,SWITCH(ab.MasterType):
			case "Class": ab.MasterInput=" ab.MasterClass | "+ab.ClassList+" | Class associated with Master Feature | LIST | VALUE=STRING ## junkVar | Next Screen | Subclass Selection | LABEL";
			case "Race": ab.MasterInput=" ab.MasterClass | "+ab.RaceList+" | Class associated with Master Feature | LIST | VALUE=STRING ## junkVar | Next Screen | Subrace Selection | LABEL";
			default: ab.MasterClass = ab.MasterType
			]
			
		[h:abort(input(
			" ab.MasterName | -- Name Here -- | Enter master feature name ",
			ab.MasterInput
		))]
			
		[h,SWITCH(ab.MasterType):
			case "Class": ab.MasterInput=" ab.MasterSubclass | None,"+pm.GetSubclasses(ab.Class,"DisplayName")+" | Subclass associated with Master Feature | LIST | VALUE=STRING ";
			case "Race": ab.MasterInput=" ab.MasterSubclass | None,"+pm.GetSubraces(ab.Class,"DisplayName")+" | Subrace associated with Master Feature | LIST | VALUE=STRING ";
			default: ab.MasterSubclass = ""
			]
		[h:abort(input(ab.MasterInput))]
	
		[h:ab.MasterFeature = json.set("","Name",pm.RemoveSpecial(ab.MasterName),"DisplayName",ab.MasterName,"Class",ab.MasterClass,"Subclass",if(ab.MasterSubclass=="None","",pm.RemoveSpecial(ab.MasterSubclass)))]
	}]
	
	[h:ab.Final = json.set(ab.Final,"Master",ab.MasterFeature)]
};{
	[h:ab.Final = json.set(ab.Final,"Master","")]
}]

[h,if(ab.Replace>0),CODE:{
	[h,if(ab.Replace>1),CODE:{
		[h:ab.ReplaceInput=""]
		[h,SWITCH(ab.ReplaceType):
			case "Class": ab.ReplaceInput=" ab.ReplaceClass | "+ab.ClassList+" | Class associated with Replaced Feature | LIST | VALUE=STRING ## junkVar | Next Screen | Subclass Selection | LABEL";
			case "Race": ab.ReplaceInput=" ab.ReplaceClass | "+ab.RaceList+" | Class associated with Replaced Feature | LIST | VALUE=STRING ## junkVar | Next Screen | Subrace Selection | LABEL";
			default: ab.ReplaceClass = ab.ReplaceType
			]
		[h:abort(input(ab.ReplaceInput))]

		[h,SWITCH(ab.ReplaceType):
			case "Class": ab.ReplaceInput=" ab.ReplaceSubclass | None,"+pm.GetSubclasses(ab.Class,"DisplayName")+" | Subclass associated with Replaced Feature | LIST | VALUE=STRING ";
			case "Race": ab.ReplaceInput=" ab.ReplaceSubclass | None,"+pm.GetSubraces(ab.Class,"DisplayName")+" | Subrace associated with Replaced Feature | LIST | VALUE=STRING ";
			default: ab.ReplaceSubclass=""
			]
		[h:abort(input(ab.ReplaceInput))]
		
		[h:ab.ReplaceSubclass = pm.RemoveSpecial(ab.ReplaceSubclass)]
		[h:ab.ReplaceOptions = json.toList(json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[?(@.Class=='"+ab.ReplaceClass+"' && (@.Subclass==''|| @.Subclass=='"+ab.ReplaceSubclass+"'))]['DisplayName']"))]

		[h:abort(input(
			" ab.ReplaceName | "+ab.ReplaceOptions+" | Name of Replaced Feature | LIST | VALUE=STRING "))]

		[h:ab.ReplaceFeature = json.set("","Name",pm.RemoveSpecial(ab.ReplaceName),"DisplayName",ab.ReplaceName,"Class",ab.ReplaceClass,"Subclass",if(ab.ReplaceSubclass=="None","",pm.RemoveSpecial(ab.ReplaceSubclass)))]
	};{
		[h:ab.ReplaceInput = ""]
		[h,SWITCH(ab.ReplaceType):
			case "Class": ab.ReplaceInput=" ab.ReplaceClass | "+ab.ClassList+" | Class associated with Replaced Feature | LIST | VALUE=STRING ## junkVar | Next Screen | Subclass Selection | LABEL";
			case "Race": ab.ReplaceInput=" ab.ReplaceClass | "+ab.RaceList+" | Class associated with Replaced Feature | LIST | VALUE=STRING ## junkVar | Next Screen | Subrace Selection | LABEL";
			default: ab.ReplaceClass = ab.ReplaceType
			]
			
		[h:abort(input(
			" ab.ReplaceName | -- Name Here -- | Enter Replaced Feature Name ",
			ab.ReplaceInput
		))]
			
		[h,SWITCH(ab.ReplaceType):
			case "Class": ab.ReplaceInput=" ab.ReplaceSubclass | None,"+pm.GetSubclasses(ab.Class,"DisplayName")+" | Subclass associated with Replaced Feature | LIST | VALUE=STRING ";
			case "Race": ab.ReplaceInput=" ab.ReplaceSubclass | None,"+pm.GetSubraces(ab.Class,"DisplayName")+" | Subrace associated with Replaced Feature | LIST | VALUE=STRING ";
			default: ab.ReplaceSubclass = ""
			]
		[h:abort(input(ab.ReplaceInput))]
	
		[h:ab.ReplaceFeature = json.set("","Name",pm.RemoveSpecial(ab.ReplaceName),"DisplayName",ab.ReplaceName,"Class",ab.ReplaceClass,"Subclass",if(ab.ReplaceSubclass=="None","",pm.RemoveSpecial(ab.ReplaceSubclass)))]
	}]
	
	[h:ab.Final = json.set(ab.Final,"Replace",ab.ReplaceFeature)]
};{}]

[h,macro("Create Feature Core@Lib:pm.a5e.Core"): json.set("","Feature",ab.Final,"PrereqsTest",ab.Prereqs)]

[h:ab.Final = json.get(macro.return,"Ability")]

[h:setLibProperty("sb.Feats",json.sort(json.append(getLibProperty("sb.Feats","Lib:"+ab.SourceLib),ab.Final),"a","Class","Subclass","Level","DisplayName"),"Lib:"+ab.SourceLib)]

[r:ab.DisplayName+" feat from the sourcebook "+ab.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]