[h:ab.Sourcebooks = pm.GetBookInfo("DisplayName",",")]
[h:ab.ClassList = pm.GetClasses("DisplayName",",")]
[h:ab.LevelList = "None,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"]

[h:abort(input(
	" junkVar | -------------------------------------------- Monster Feature Info -------------------------------------------- |  | LABEL | SPAN=TRUE ",
	" ab.Name | -- Name Here -- | Enter Feature Name ",
	" ab.IsUnique |  | Feature is Unique to This Creature | CHECK ",
    " isFeatureGroup |  | Add Feature to an NPC Loadout | CHECK ",
    " ab.Source | "+ab.Sourcebooks+" | Associated Sourcebook | LIST | VALUE=STRING ",
	" junkVar | -------------------------------------------------------------------------------------------------------------- |  | LABEL | SPAN=TRUE ",
	" ab.LegendaryAction |  | Is Feature a Legendary Action | CHECK "
))]

[h:ab.SourceLib = json.get(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"\$[?(@.Name=='"+pm.RemoveSpecial(ab.Source)+"')]['Library']"),0)]
[h:ab.Master=""]
[h:ab.DisplayName = ab.Name]
[h:ab.Name = pm.RemoveSpecial(ab.Name)]
[h:ab.Final = json.set("",
	"Name",ab.Name,
	"DisplayName",ab.DisplayName,
	"Class","Monster",
	"Type","Monster",
	"Level",0,
	"GainOnLevel",0,
	"Optional",0,
	"MultiFeature",0,
	"Library",ab.SourceLib
)]

[h,if(ab.IsUnique):
    ab.Final = json.set(ab.Final,"Subclass",pm.RemoveSpecial(getName()));
    ab.Final = json.set(ab.Final,"Subclass","")
]

[h,if(ab.LegendaryAction),CODE:{
    [h:NeedsLegendaryAction =json.isEmpty(json.path.read(getProperty("a5e.stat.AllFeatures"),"\$[*][?(@.Name=='LegendaryActions' && @.Class=='Monster')]"))]
    [h,if(NeedsLegendaryAction),CODE:{
        [h:abort(input(
            " LegendaryActionNumber | 0,1,2,3,4,5,6 | Legendary Actions | LIST | SELECT=3 "
        ))]

[h:"<!-- TODO: MaxResourceLowPrio - Should make a UDF to package ResourceData instead of doing it raw here -->"]
        [h:LegendaryActionFeature = json.set("",
            "Name","LegendaryActions",
            "DisplayName","Legendary Actions",
            "Class","Monster",
            "Type","Monster",
            "Level",0,
            "GainOnLevel",0,
            "Optional",0,
            "MultiFeature",0,
            "Library","SRD",
            "Resource",json.set("","LegendaryActions",LegendaryActionNumber),
            "ResourceData",json.set("",
				"Restoration",json.set("",
					"StartTurn",json.set("","Method","Full"),
					"ShortRest",json.set("","Method","Full"),
					"LongRest",json.set("","Method","Full")),
				"Resources",json.set("",
					"Name","LegendaryActions",
					"DisplayName","Legendary Actions",
					"MaxResource",json.set("","Base",LegendaryActionNumber)
			))
        )]

        [h:setProperty("a5e.stat.AllFeatures",json.append(getProperty("a5e.stat.AllFeatures"),LegendaryActionFeature))]
    };{}]

    [h:json.set(ab.Final,"Master","LegendaryActions")]
};{}]

[h,macro("Create Feature Core@Lib:pm.a5e.Core"): json.set("","Feature",ab.Final,"PrereqsTest",0)]

[h:ab.Final = json.get(macro.return,"Ability")]

[h,if(isFeatureGroup),CODE:{
    [h:"<!-- Will probably want to convert this to dialog so the interface for this won't be terrible -->"]
};{}]

[h:HasActiveEffects = json.contains(ab.Final,"ButtonInfo")]
[h,if(HasActiveEffects),CODE:{
	[h,MACRO("CreateSubeffect@Lib:pm.a5e.Core"): json.set("",
		"WhichSubeffect",1,
		"WhichEffect",1,
		"EffectsNumber",json.length(json.get(ab.Final,"ButtonInfo")),
		"EffectType","Feature",
		"ParentToken",currentToken(),
		"FeatureData",ab.Final,
		"ExtraData",json.set("","FeatureType","MonsterFeature","UniqueMonsterFeature",ab.IsUnique)
	)]
};{
	[h:setProperty("a5e.stat.AllFeatures",json.append(getProperty("a5e.stat.AllFeatures"),json.set(ab.Final,"IsActive",1)))]
	[h:broadcast(ab.DisplayName+" monster feature from the sourcebook "+ab.Source+" created.")]

	[h,if(!ab.IsUnique),CODE:{
		[h:setLibProperty("sb.MonsterFeatures",json.sort(json.append(getLibProperty("sb.MonsterFeatures","Lib:"+ab.SourceLib),ab.Final),"a","Class","Subclass","Level","DisplayName"),"Lib:"+ab.SourceLib)]

		[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]
	};{}]
}]