[h:cn.Sourcebooks = pm.GetBookInfo("DisplayName",",")]
[h:cn.ClassList = pm.GetClasses("DisplayName",",")]
[h:cn.RaceList = pm.GetRaces("DisplayName",",")]
[h:cn.LevelList = "None,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"]
[h:cn.Class = "Condition"]

[h:cn.BaseConditions = pm.a5e.GetBaseConditions()]
[h:CountsAsOptions = json.append("","None")]
[h,foreach(tempCondition,cn.BaseConditions): CountsAsOptions = json.append(CountsAsOptions,json.get(tempCondition,"DisplayName"))]

[h:ConditionTags = pm.a5e.GetCoreData("sb.ConditionTags")]
[h:ConditionTagOptions = ""]
[h,foreach(tempTag,ConditionTags): ConditionTagOptions = listAppend(ConditionTagOptions," choice"+json.get(tempTag,"Name")+" |  | "+json.get(tempTag,"DisplayName")+" | CHECK ","##")]

[h:abort(input(
	" junkVar | -------------------------------------------- Basic Condition Info -------------------------------------------- |  | LABEL | SPAN=TRUE ",
	" cn.Name | -- Name Here -- | Enter Condition Name ",
	" cn.Type | Base Condition,Class Feature,Racial Feature,Spell,Feat,Item,Background | Condition Association | LIST ",
	" cn.CountsAs | "+CountsAsOptions+" | Also Counts As | LIST | DELIMITER=JSON ",
	ConditionTagOptions,
	" otherConditionTag |  | Add Tag not Shown | CHECK ",
	" cn.HasTiers |  | Condition Has Multiple Tiers With Varying Effects | CHECK ",
	" cn.HasMaster |  | Condition Has Associated Master Feature | CHECK ",
	" cn.HasAssociatedConditions |  | Always Adds Other Conditions When Gained | CHECK ",
	" cn.Source | "+cn.Sourcebooks+" | Associated Sourcebook | LIST | VALUE=STRING "
))]

[h:ConditionTagsChosen = ""]
[h,foreach(tempTag,ConditionTags): ConditionTagsChosen = if(eval("choice"+json.get(tempTag,"Name")),json.append(ConditionTagsChosen,json.get(tempTag,"Name")),ConditionTagsChosen)]

[h,if(otherConditionTag),CODE:{
	[h,MACRO("CreateConditionTag@Lib:pm.a5e.Core"): ""]
	[h:ConditionTagsChosen = json.append(ConditionTagsChosen,macro.return)]
};{}]

[h:cn.SourceLib = json.get(json.path.read(data.getData("addon:","pm.a5e.core","ms.Sources"),"[*][?(@.Name=='"+pm.RemoveSpecial(cn.Source)+"')]['Library']"),0)]
[h:cn.DisplayName = cn.Name]
[h:cn.Name = pm.RemoveSpecial(cn.Name)]
[h:cn.Final = json.set("",
	"Name",cn.Name,
	"DisplayName",cn.DisplayName,
	"Type","Condition",
	"ConditionType",ConditionTagsChosen,
	"Level",1,
	"GainOnLevel",0,
	"Optional",0,
	"MultiAbility",0,
	"Library",cn.SourceLib
)]

[h,if(cn.CountsAs != 0): cn.Final = json.set(cn.Final,"CountsAs",json.get(json.get(cn.BaseConditions,cn.CountsAs-1),"Name"))]

[h:cn.TypeInput=""]
[h,SWITCH(cn.Type):
	case 0: cn.Class = "Condition";
	case 1: cn.TypeInput=" cn.Class | "+cn.ClassList+",Monster | Class associated with Condition | LIST | VALUE=STRING ## junkVar | Next Screen | Subclass Selection | LABEL";
	case 2: cn.TypeInput=" cn.Class | "+cn.RaceList+" | Class associated with Condition | LIST | VALUE=STRING ## junkVar | Next Screen | Subrace Selection | LABEL";
	case 3: cn.Class = "Spell";
	case 4: cn.Class = "Feat";
	case 5: cn.Class = "Item";
	case 6: cn.Class = "Background";
	default: cn.Class = ""
]
[h:abort(input(cn.TypeInput))]

[h:cn.Final = json.set(cn.Final,"Class",pm.RemoveSpecial(cn.Class))]

[h,SWITCH(cn.Type),CODE:
	case 1:{
		[h,if(cn.Class == "Monster"):
			cn.TypeInput=" cn.Subclass |  | Monster Associated with Condition ";
			cn.TypeInput=" cn.Subclass | None,"+pm.GetSubclasses(cn.Class,"DisplayName")+" | Subclass Associated with Condition | LIST | VALUE=STRING "
		]
		[h,if(cn.HasMaster): cn.TypeInput = cn.TypeInput + " ## cn.MasterCreated | No,Yes,Yes - Same Class/Subclass Combo | Is the master feature already added to the core library? | RADIO | SELECT=2"]
	};
	case 2:{
		[h:cn.TypeInput=" cn.Subclass | None,"+pm.GetSubraces(cn.Class,"DisplayName")+" | Subrace Associated with Condition | LIST | VALUE=STRING "]
		[h,if(cn.HasMaster): cn.TypeInput = cn.TypeInput + " ## cn.MasterCreated | No,Yes,Yes - Same Class/Subclass Combo | Is the master feature already added to the core library? | RADIO | SELECT=2"]
	};
	case 3:{
		[h:cn.TypeInput = " cn.Subclass |  | Spell Associated with Condition "]
	};
	case 5:{
		[h:cn.TypeInput = " cn.Subclass |  | Item Associated with Condition "]
	};
	default:{
		[h:cn.Subclass = ""]
	}
]
[h:abort(input(cn.TypeInput))]

[h:cn.Subclass = if(cn.Subclass == "None","",pm.RemoveSpecial(cn.Subclass))]
[h:cn.Final = json.set(cn.Final,"Subclass",cn.Subclass)]

[h,if(cn.HasMaster && or(cn.Type == 1, cn.Type == 2)),CODE:{
	[h,if(cn.MasterCreated>0),CODE:{
		[h,if(cn.MasterCreated==2): cn.MasterInput=""; cn.MasterInput=" cn.MasterClass | "+cn.ClassList+" | Class associated with Master Feature | LIST | VALUE=STRING ## junkVar | Next Screen | Subclass Selection | LABEL"]
		[h:abort(input(cn.MasterInput))]
		
		[h,if(cn.MasterCreated==2): cn.MasterInput=""; cn.MasterInput=" cn.MasterSubclass | None,"+pm.GetSubclasses(cn.MasterClass,"DisplayName")+" | Subclass associated with Master Feature | LIST | VALUE=STRING "]
		[h:abort(input(cn.MasterInput))]

		[h,if(cn.MasterCreated==2): cn.MasterClass = cn.Class]
		[h,if(cn.MasterCreated==2): cn.MasterSubclass = cn.Subclass; cn.MasterSubclass = pm.RemoveSpecial(cn.MasterSubclass)]
		[h:cn.MasterOptions = json.toList(json.path.read(data.getData("addon:","pm.a5e.core","sb.Abilities"),"[*][?(@.Class=='"+cn.MasterClass+"' && (@.Subclass==''|| @.Subclass=='"+cn.MasterSubclass+"'))]['DisplayName']"))]

		[h:abort(input(
			" cn.MasterName | "+cn.MasterOptions+" | Name of Master Feature | LIST | VALUE=STRING "))]

		[h:cn.MasterFeature = json.set("","Name",pm.RemoveSpecial(cn.MasterName),"DisplayName",cn.MasterName,"Class",cn.MasterClass,"Subclass",if(cn.MasterSubclass=="None","",pm.RemoveSpecial(cn.MasterSubclass)))]
	};{
		[h:abort(input(
			" cn.MasterName | -- Name Here -- | Enter master feature name ",
			" cn.MasterClass | "+cn.ClassList+" | Class associated with Master Feature | LIST | VALUE=STRING ",
		" junkVar | Next Screen | Subclass Selection | LABEL "
		))]
			
		[h:cn.MasterSubclass="None"]
		[h:abort(input(
			" cn.MasterSubclass | None,"+pm.GetSubclasses(cn.Class,"DisplayName")+" | Subclass associated with Master Feature | LIST | VALUE=STRING "
			))]

		[h:cn.MasterFeature = json.set("","Name",pm.RemoveSpecial(cn.MasterName),"DisplayName",cn.MasterName,"Class",cn.MasterClass,"Subclass",if(cn.MasterSubclass=="None","",pm.RemoveSpecial(cn.MasterSubclass)))]
	}]

	[h:cn.Final = json.set(cn.Final,"Master",cn.MasterFeature)]
};{}]

[h,if(cn.HasTiers): cn.Final = json.set(cn.Final,"HasTiers",cn.HasTiers)]

[h:"<!-- Currently unable to add non-base conditions. May want to add later, but don't really care to for now since not used in official 5e content afaik. TODO: Add spell conditions as an option (e.g. Confusion gets used) and MAYBE add 'movement' conditions (which I made up) -->"]
[h,if(cn.HasAssociatedConditions),CODE:{
	[h:associatedCondInput = " junkVar | ----------------------------------- Associated Conditions ----------------------------------- | | LABEL | SPAN=TRUE "]
	[h,foreach(baseCondition,pm.a5e.GetBaseConditions()): associatedCondInput = listAppend(associatedCondInput," choice."+json.get(baseCondition,"Name")+" |  | "+json.get(baseCondition,"DisplayName")+" | CHECK ","##")]
	[h:abort(input(associatedCondInput))]
	
	[h:associatedConditionList = "[]"]
	[h,foreach(baseCondition,pm.a5e.GetBaseConditions()): associatedConditionList = if(eval("choice."+json.get(baseCondition,"Name")),json.append(associatedConditionList,json.get(baseCondition,"Name","Class","Subclass","DisplayName")),associatedConditionList)]

	[h:cn.Final = json.set(cn.Final,"AssociatedConditions",associatedConditionList)]
};{}]

[h,macro("Create Feature Core@Lib:pm.a5e.Core"): json.set("","Feature",cn.Final,"PrereqsTest",0)]

[h:cn.Final = json.get(macro.return,"Ability")]

[h:setLibProperty("sb.Conditions",json.sort(json.append(getLibProperty("sb.Conditions","Lib:"+cn.SourceLib),cn.Final),"a","Class","Subclass","Level","DisplayName"),"Lib:"+cn.SourceLib)]

[r:cn.DisplayName+" condition from the sourcebook "+cn.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]