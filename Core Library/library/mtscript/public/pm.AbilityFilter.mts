[h:ab.InputTitle = arg(0)]
[h,if(argCount()>1): ab.PresetType = arg(1); ab.PresetType = ""]
[h,if(argCount()>2): ab.PresetClass = arg(2); ab.PresetClass = ""]
[h,if(argCount()>3): ab.PresetSubclass = arg(3); ab.PresetSubclass = ""]

[h,if(ab.PresetType==""),CODE:{
	[h:abort(input(
		ab.InputTitle,
		" ab.FeatureType | Class,Race,Feat,Background | Choose Feature Type | RADIO | VALUE=STRING "
	))]
};{
	[h:ab.FeatureType = ab.PresetType]
}]

[h,if(ab.PresetClass==""),CODE:{
	[h,switch(ab.FeatureType):
		case "Class": 
			abort(input(
			ab.InputTitle,
			" ab.FeatureClass | "+pm.GetClasses("DisplayName")+" | Choose Feature Class | RADIO | VALUE=STRING "
			));
		case "Race":
			abort(input(
			ab.InputTitle,
			" ab.FeatureClass | "+pm.GetRaces("DisplayName")+" | Choose Feature Race | RADIO | VALUE=STRING "
			));
		default: ab.FeatureClass = ab.FeatureType
	]
	[h:ab.FeatureClass = pm.RemoveSpecial(ab.FeatureClass)]
};{
	[h:ab.FeatureClass = ab.PresetClass]
}]

[h,if(ab.PresetSubclass==""),CODE:{
	[h,switch(ab.FeatureType):
		case "Class": 
			abort(input(
			ab.InputTitle,
			" ab.FeatureSubclass | None,"+pm.GetSubclasses(ab.FeatureClass,"DisplayName")+" | Choose Feature Subclass | RADIO | VALUE=STRING "
			));
		case "Race":
			abort(input(
			ab.InputTitle,
			" ab.FeatureSubclass | None,"+pm.GetSubraces(ab.FeatureClass,"DisplayName")+" | Choose Feature Subrace | RADIO | VALUE=STRING "
			));
		case "Background":
			abort(input(
			ab.InputTitle,
			" ab.FeatureSubclass | "+pm.GetBackgrounds(ab.FeatureClass,"DisplayName")+" | Choose Associated Background | RADIO | VALUE=STRING "
			));
		default: ab.FeatureSubclass = ""
	]
	[h:ab.FeatureSubclass = if(ab.FeatureSubclass=="None","",pm.RemoveSpecial(ab.FeatureSubclass))]
};{
	[h:ab.FeatureSubclass = if(ab.PresetSubclass=="None","",ab.PresetSubclass)]
}]

[h:abort(input(
	ab.InputTitle,
	"ab.FeatureName | "+json.toList(json.path.read(data.getData("addon:","pm.a5e.core","sb.Abilities"),"[*][?(@.Class=='"+ab.FeatureClass+"' && @.Subclass=='"+ab.FeatureSubclass+"')]['DisplayName']"))+" | Choose a Feature | RADIO | VALUE=STRING "
))]

[h:macro.return = json.set("","Name",pm.RemoveSpecial(ab.FeatureName),"DisplayName",ab.FeatureName,"Type",ab.FeatureType,"Class",ab.FeatureClass,"Subclass",ab.FeatureSubclass)]