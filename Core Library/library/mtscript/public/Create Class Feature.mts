[h:ab.Sourcebooks = pm.GetBookInfo("DisplayName",",")]
[h:ab.ClassList = pm.GetClasses("DisplayName",",")]
[h:ab.LevelList = "None,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"]

[h:abort(input(
	" junkVar | -------------------------------------------- Basic Feature Info -------------------------------------------- |  | LABEL | SPAN=TRUE ",
	" ab.Name | -- Name Here -- | Enter Feature Name ",
	" ab.Class | "+ab.ClassList+" | Associated Class | LIST | VALUE=STRING ",
	" junkVar | Next Screen | Subclass Selection | LABEL ",
	" ab.Level | "+ab.LevelList+" | Level Gained | LIST ",
	" ab.Source | "+ab.Sourcebooks+" | Associated Sourcebook | LIST | VALUE=STRING ",
	" junkVar | -------------------------------------------------------------------------------------------------------------- |  | LABEL | SPAN=TRUE ",
	" ab.HasMaster |  | <html><span title='Features with multiple named options, e.g. Battle Master Fighter - Combat Superiority Maneuvers, Totem Barbarian, Hunter Ranger'>Has an associated main feature</span></html> | CHECK ",
	" ab.OnLevel | 1 | <html><span title='Uncheck for features that must be chosen to be gained, e.g. Eldritch Invocations or Hunter Ranger features'>Gained Automatically on Level Up</span></html> | CHECK ",
	" ab.Optional | 0 | <html><span title='For sourcebooks that add optional additional rules'>Optional Feature</span></html> | CHECK ",
	" ab.Replace | 0 | <html><span title='For sourcebooks that optionally remove old features and replace them with new ones. Type the name of the replaced feature.'>Replaces another Feature if Gained</span></html> | CHECK ",
	" junkVar | -------------------------------------------------------------------------------------------------------------- |  | LABEL | SPAN=TRUE ",
	"ab.Prereqs |  | <html><span title='Mostly for features not gained automatically on level up, like Invocations or Feats. Ignore if level/class/subclass are the only prerequisites.'>Feature has prerequisites for being gained</span></html> | CHECK ",
	"ab.MultiFeature |  | <html><span title='Pretty much just for Elemental Adept at this point.'>Feature can be gained multiple times</span></html> | CHECK "
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
	"Class",pm.RemoveSpecial(ab.Class),
	"Type","Class",
	"Level",ab.Level,
	"GainOnLevel",ab.OnLevel,
	"Optional",ab.Optional,
	"MultiFeature",ab.MultiFeature,
	"Library",ab.SourceLib
)]

[h:ab.Subclass="None"]
[h:abort(input(
	" ab.Subclass | None,"+pm.GetSubclasses(ab.Class,"DisplayName")+" | Select associated subclass | LIST | VALUE=STRING ",
	if(ab.HasMaster," ab.MasterCreated | No,Yes,Yes - Same Class/Subclass Combo | Is the master feature already added to the core library? | RADIO | SELECT=2",""),
	if(ab.Replace," ab.ReplaceCreated | No,Yes,Yes - Same Class/Subclass Combo | Is the feature you would like to replace already added to the core library? | RADIO | SELECT=2","")
))]

[h:ab.Subclass = if(ab.Subclass == "None","",pm.RemoveSpecial(ab.Subclass))]
[h:ab.Final = json.set(ab.Final,"Subclass",ab.Subclass)]

[h,if(ab.HasMaster),CODE:{
	[h,if(ab.MasterCreated>0),CODE:{
		[h,if(ab.MasterCreated==2): ab.MasterInput=""; ab.MasterInput=" ab.MasterClass | "+ab.ClassList+" | Class associated with Master Feature | LIST | VALUE=STRING ## junkVar | Next Screen | Subclass Selection | LABEL"]
		[h:abort(input(ab.MasterInput))]
		
		[h,if(ab.MasterCreated==2): ab.MasterInput=""; ab.MasterInput=" ab.MasterSubclass | None,"+pm.GetSubclasses(ab.MasterClass,"DisplayName")+" | Subclass associated with Master Feature | LIST | VALUE=STRING "]
		[h:abort(input(ab.MasterInput))]

		[h,if(ab.MasterCreated==2): ab.MasterClass = ab.Class]
		[h,if(ab.MasterCreated==2): ab.MasterSubclass = ab.Subclass; ab.MasterSubclass = pm.RemoveSpecial(ab.MasterSubclass)]
		[h:ab.MasterOptions = json.toList(json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[?(@.Class=='"+ab.MasterClass+"' && (@.Subclass==''|| @.Subclass=='"+ab.MasterSubclass+"'))]['DisplayName']"))]

		[h:abort(input(
			" ab.MasterName | "+ab.MasterOptions+" | Name of Master Feature | LIST | VALUE=STRING "))]

		[h:ab.MasterFeature = json.set("","Name",pm.RemoveSpecial(ab.MasterName),"DisplayName",ab.MasterName,"Class",ab.MasterClass,"Subclass",if(ab.MasterSubclass=="None","",pm.RemoveSpecial(ab.MasterSubclass)))]
	};{
		[h:abort(input(
			" ab.MasterName | -- Name Here -- | Enter master feature name ",
			" ab.MasterClass | "+ab.ClassList+" | Class associated with Master Feature | LIST | VALUE=STRING ",
		" junkVar | Next Screen | Subclass Selection | LABEL "
		))]
			
		[h:ab.MasterSubclass="None"]
		[h:abort(input(
			" ab.MasterSubclass | None,"+pm.GetSubclasses(ab.Class,"DisplayName")+" | Subclass associated with Master Feature | LIST | VALUE=STRING "
			))]
	
		[h:ab.MasterFeature = json.set("","Name",pm.RemoveSpecial(ab.MasterName),"DisplayName",ab.MasterName,"Class",ab.MasterClass,"Subclass",if(ab.MasterSubclass=="None","",pm.RemoveSpecial(ab.MasterSubclass)))]
	}]
	
	[h:ab.Final = json.set(ab.Final,"Master",ab.MasterFeature)]
};{
	[h:ab.Final = json.set(ab.Final,"Master","")]
}]

[h,if(ab.Replace),CODE:{
	[h,if(ab.ReplaceCreated>0),CODE:{
		[h,if(ab.ReplaceCreated==2): ab.ReplaceInput=""; ab.ReplaceInput=" ab.ReplaceClass | "+ab.ClassList+" | Class associated with Replaced Feature | LIST | VALUE=STRING ## junkVar | Next Screen | Subclass Selection | LABEL"]
		[h:abort(input(ab.ReplaceInput))]
		
		[h,if(ab.ReplaceCreated==2): ab.ReplaceInput=""; ab.ReplaceInput=" ab.ReplaceSubclass | None,"+pm.GetSubclasses(ab.ReplaceClass,"DisplayName")+" | Subclass associated with Replaced Feature | LIST | VALUE=STRING "]
		[h:abort(input(ab.ReplaceInput))]

		[h,if(ab.ReplaceCreated==2): ab.ReplaceClass = ab.Class]
		[h,if(ab.ReplaceCreated==2): ab.ReplaceSubclass = ab.Subclass; ab.ReplaceSubclass = pm.RemoveSpecial(ab.ReplaceSubclass)]
		[h:ab.ReplaceOptions = json.toList(json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[?(@.Class=='"+ab.ReplaceClass+"' && (@.Subclass==''|| @.Subclass=='"+ab.ReplaceSubclass+"'))]['DisplayName']"))]

		[h:abort(input(
		" ab.ReplaceName | "+ab.ReplaceOptions+" | Name of Replaced Feature | LIST | VALUE=STRING "))]

		[h:ab.ReplacedFeature = json.set("","Name",pm.RemoveSpecial(ab.ReplaceName),"DisplayName",ab.ReplaceName,"Class",ab.ReplaceClass,"Subclass",if(ab.ReplaceSubclass=="None","",pm.RemoveSpecial(ab.ReplaceSubclass)))]
	};{
		[h:abort(input(
			" ab.ReplaceName | -- Name Here -- | Enter replaced feature name ",
			" ab.ReplaceClass | "+ab.ClassList+" | Class associated with Replaced Feature | LIST | VALUE=STRING ",
		" junkVar | Next Screen | Subclass Selection | LABEL "
		))]
			
		[h:ab.ReplaceSubclass="None"]
		[h:abort(input(
			" ab.ReplaceSubclass | None,"+pm.GetSubclasses(ab.Class,"DisplayName")+" | Class associated with Replaced Feature | LIST | VALUE=STRING "
			))]
	
		[h:ab.ReplacedFeature = json.set("","Name",pm.RemoveSpecial(ab.ReplaceName),"DisplayName",ab.ReplaceName,"Class",ab.ReplaceClass,"Subclass",if(ab.ReplaceSubclass=="None","",pm.RemoveSpecial(ab.ReplaceSubclass)))]
	}]
	
	[h:ab.Final = json.set(ab.Final,"Replace",ab.ReplacedFeature)]	
};{}]

[h,macro("Create Feature Core@Lib:pm.a5e.Core"): json.set("","Feature",ab.Final,"PrereqsTest",ab.Prereqs)]

[h:ab.Final = json.get(macro.return,"Ability")]

[h:setLibProperty("sb.Abilities",json.sort(json.append(getLibProperty("sb.Abilities","Lib:"+ab.SourceLib),ab.Final),"a","Class","Subclass","Level","DisplayName"),"Lib:"+ab.SourceLib)]

[r:ab.DisplayName+" class feature from the sourcebook "+ab.Source+" created."]

[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]