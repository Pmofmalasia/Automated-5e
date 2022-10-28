[h:cn.Sourcebooks = pm.GetBookInfo("DisplayName",",")]
[h:cn.ClassList = pm.GetClasses("DisplayName",",")]
[h:cn.RaceList = pm.GetRaces("DisplayName",",")]
[h:cn.LevelList = "None,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"]
[h:cn.Class = "Condition"]

[h:abort(input(
	" junkVar | -------------------------------------------- Basic Condition Info -------------------------------------------- |  | LABEL | SPAN=TRUE ",
	" cn.Name | -- Name Here -- | Enter Condition Name ",
	" cn.Type | Base Condition,Class Feature,Racial Feature,Spell,Feat,Background | Condition Association | LIST ",
	" cn.ConditionSubtype | None,Boon,Curse,Disease,Poison | Condition Counts As | RADIO | VALUE=STRING ",
	" cn.HasTiers |  | Condition Has Multiple Tiers With Varying Effects | CHECK ",
	" cn.HasAssociatedConditions |  | Always Adds Other Conditions When Gained | CHECK ",
	" cn.Source | "+cn.Sourcebooks+" | Associated Sourcebook | LIST | VALUE=STRING "
))]

[h:cn.SourceLib = json.get(json.path.read(getLibProperty("ms.Sources","Lib:pm.a5e.Core"),"[?(@.Name=='"+pm.RemoveSpecial(cn.Source)+"')]['Library']"),0)]
[h:cn.DisplayName = cn.Name]
[h:cn.Name = pm.RemoveSpecial(cn.Name)]
[h:cn.Final = json.set("",
	"Name",cn.Name,
	"DisplayName",cn.DisplayName,
	"Type","Condition",
	"ConditionType",if(cn.ConditionSubtype=="None","",cn.ConditionSubtype),
	"Level",1,
	"GainOnLevel",0,
	"Optional",0,
	"MultiAbility",0,
	"Library",cn.SourceLib
)]

[h:cn.TypeInput=""]
[h,SWITCH(cn.Type):
	case 0: cn.Class = "Condition";
	case 1: cn.TypeInput=" cn.Class | "+cn.ClassList+" | Class associated with Condition | LIST | VALUE=STRING ## junkVar | Next Screen | Subclass Selection | LABEL";
	case 2: cn.TypeInput=" cn.Class | "+cn.RaceList+" | Class associated with Condition | LIST | VALUE=STRING ## junkVar | Next Screen | Subrace Selection | LABEL";
	case 3: cn.Class = "Spell";
	case 4: cn.Class = "Feat";
	case 5: cn.Class = "Background";
	default: cn.Class = ""
]
[h:abort(input(cn.TypeInput))]

[h:cn.Final = json.set(cn.Final,"Class",pm.RemoveSpecial(cn.Class))]

[h,SWITCH(cn.Type):
	case 0: cn.Subclass = "";
	case 1: cn.TypeInput=" cn.Subclass | None,"+pm.GetSubclasses(cn.Class,"DisplayName")+" | Subclass Associated with Condition | LIST | VALUE=STRING ";
	case 2: cn.TypeInput=" cn.Subclass | None,"+pm.GetSubraces(cn.Class,"DisplayName")+" | Subrace Associated with Condition | LIST | VALUE=STRING ";
	case 3: cn.Subclass = " cn.Subclass |  | Spell Associated with Condition ";
	case 4: cn.Subclass = "";
	case 5: cn.Subclass = "";
	default: cn.Subclass = ""
]
[h:abort(input(cn.TypeInput))]

[h:cn.Subclass = if(cn.Subclass == "None","",pm.RemoveSpecial(cn.Subclass))]
[h:cn.Final = json.set(cn.Final,"Subclass",cn.Subclass)]

[h,if(cn.HasTiers): cn.Final = json.set(cn.Final,"HasTiers",cn.HasTiers)]

[h:"<!-- Currently unable to add non-base conditions. May want to add later, but don't really care to for now since not used in official 5e content afaik. TODO: MAYBE add 'movement' conditions (which I made up), but prone is the only one I'd think would be used and it's made as a 'base' condition -->"]
[h,if(cn.HasAssociatedConditions),CODE:{
	[h:associatedCondInput = " junkVar | ----------------------------------- Associated Conditions ----------------------------------- | | LABEL | SPAN=TRUE "]
	[h,foreach(baseCondition,pm.a5e.GetBaseConditions()): associatedCondInput = listAppend(associatedCondInput," choice."+json.get(baseCondition,"Name")+" |  | "+json.get(baseCondition,"DisplayName")+" | CHECK ","##")]
	[h:abort(input(associatedCondInput))]
	
	[h:associatedConditionList = "[]"]
	[h,foreach(baseCondition,pm.a5e.GetBaseConditions()): associatedConditionList = if(eval("choice."+json.get(baseCondition,"Name")),json.append(associatedConditionList,json.get(baseCondition,"Name","Class","Subclass","DisplayName")),associatedConditionList)]
};{}]

[h,macro("Create Feature Core@Lib:pm.a5e.Core"): json.set("","Feature",cn.Final,"PrereqsTest",0)]

[h:cn.Final = json.get(macro.return,"Ability")]

[h:setLibProperty("sb.Conditions",json.sort(json.append(getLibProperty("sb.Conditions","Lib:"+cn.SourceLib),cn.Final),"a","Class","Subclass","Level","DisplayName"),"Lib:"+cn.SourceLib)]

[r:cn.DisplayName+" condition from the sourcebook "+cn.Source+" created."]
[h,MACRO("Gather Sourcebook Information@Lib:pm.a5e.Core"):""]