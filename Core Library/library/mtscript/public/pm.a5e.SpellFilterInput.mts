[h:abort(input(
	"junkVar | ---------------- Choose How to Filter the Spell List ---------------- | | LABEL | SPAN=TRUE",
	"choice.Class | | Filter based on class | CHECK ",
	"choice.Level | No,Choose Levels,Levels for which you have spell slots | Filter based on level | LIST ",
	"choice.School | | Filter based on school | CHECK ",
	"choice.Time | | Filter based on casting time | CHECK ",
	"choice.Ritual | No Filter,Must Be Ritual,Cannot Be Ritual | Filter based on ritual casting | LIST "
))]

[h,if(choice.Ritual>0):
	SpellOptions = json.set("","Ritual",if(choice.Ritual==1,1,0));
	SpellOptions = "{}"
]

[h:ClassOptions = ""]
[h,if(choice.Class),CODE:{
	[h:sp.ClassInput = ""]
	[h:sp.ClassList = pm.GetClasses()]
	[h,foreach(TempClass,sp.ClassList): sp.ClassInput = listAppend(sp.ClassInput,"choice."+json.get(TempClass,"Name")+" |  | "+json.get(TempClass,"DisplayName")+" Spell | CHECK ","##")]

	[h:abort(input(
		"junkVar | ---------------- Choose Valid Classes ---------------- | | LABEL | SPAN=TRUE",
		sp.ClassInput
	))]
	
	[h,foreach(TempClass,sp.ClassList): ClassOptions = if(eval("choice."+json.get(TempClass,"Name")),json.append(ClassOptions,json.get(TempClass,"DisplayName")),ClassOptions)]
	[h:SpellOptions = json.set(SpellOptions,"Class",ClassOptions)]
};{}]

[h:LevelOptions = ""]
[h,if(choice.Level==1),CODE:{
	[h:LevelOptions = "Cantrip,1,2,3,4,5,6,7,8,9"]
	[h:abort(input(
		" junkVar | ---------------- Choose Valid Levels ---------------- | | LABEL | SPAN=TRUE ",
		" choice.MinLevel | "+LevelOptions+" | Minimum Level | LIST ",
		" choice.MaxLevel | "+LevelOptions+" | Maximum Level | LIST ",
		" choice.CapType | No Cap,Specific Class,Maximum of all combined,Based on classes in the class filter | <html><span title='Specific Class, e.g. Bard Magic Secrets use highest level Bard spell you can cast (This is most likely what you want, the others are niche and weird); Maximum of all combined takes multiclassing into account; Based on classes in filter - e.g. Bard and Cleric are in the filter, player can cast level 2 Bard spells and level 1 Cleric so the max shown is level 2'>How is the highest level spell slot you can cast determined? | LIST "
	))]
	
	[h:SpellOptions = json.set(SpellOptions,"MaxLevel",choice.MaxLevel,"MinLevel",choice.MinLevel)]
	[h,switch(choice.CapType),CODE:
		case 0: {};
		case 1: {
			[h:abort(input(" capClass | "+pm.GetClasses("DisplayName",",")+",Chosen Class | Max Level Capped by Highest Spell Slot Level in | LIST | VALUE=STRING "))]
			[h,if(capClass=="Chosen Class")
				capClass = "Chosen_Class";
				capClass = pm.RemoveSpecial(capClass)
			]
			[h:SpellOptions = json.set(SpellOptions,"LevelBasedMaxLevel",capClass)]
		};
		case 2:{
			[h:SpellOptions = json.set(SpellOptions,"LevelBasedMaxLevel","All")]
		};
		case 3:{
			[h:SpellOptions = json.set(SpellOptions,"LevelBasedMaxLevel","FilterClassesMax")]
		}
	]
};{}]

[h,if(choice.Level==2),CODE:{
    [h,switch(choice.CapType),CODE:
        case 0: {};
        case 1: {
            [h:abort(input(" capClass | "+pm.GetClasses("DisplayName",",")+",Chosen Class | Max Level Capped by Highest Spell Slot Level in | LIST | VALUE=STRING "))]
            [h,if(capClass=="Chosen Class")
                capClass = "Chosen_Class";
                capClass = pm.RemoveSpecial(capClass)
            ]
            [h:SpellOptions = json.set(SpellOptions,"LevelBasedMaxLevel",capClass)]
        };
        case 2:{
            [h:SpellOptions = json.set(SpellOptions,"LevelBasedMaxLevel","All")]
        };
        case 3:{
            [h:SpellOptions = json.set(SpellOptions,"LevelBasedMaxLevel","FilterClassesMax")]
        }
    ]
};{}]

[h:SchoolOptions = ""]
[h,if(choice.School),CODE:{
	[h:sp.SchoolInput = ""]
	[h:sp.SchoolList = pm.GetSpellSchools()]
	[h,foreach(TempSchool,sp.SchoolList): sp.SchoolInput = listAppend(sp.SchoolInput,"choice."+json.get(TempSchool,"Name")+" |  | "+json.get(TempSchool,"DisplayName")+" | CHECK ","##")]

	[h:abort(input(
		"junkVar | ---------------- Choose Valid Schools ---------------- | | LABEL | SPAN=TRUE",
		sp.SchoolInput
	))]
	
	[h,foreach(TempSchool,sp.SchoolList): SchoolOptions = if(eval("choice."+json.get(TempSchool,"Name")),json.append(SchoolOptions,json.get(TempSchool,"DisplayName")),SchoolOptions)]
	[h:SpellOptions = json.set(SpellOptions,"School",SchoolOptions)]
};{}]

[h:TimeOptions = ""]
[h,if(choice.Time),CODE:{
    [h:"<!-- TODO: Update this with better time filtering options later -->"]
	[h:abort(input(
		"junkVar | ---------------- Choose Valid Casting Times ---------------- | | LABEL | SPAN=TRUE",
		"choice.Action | | Action | CHECK ",
		"choice.Bonus | | Bonus Action | CHECK ",
		"choice.Reaction | | Reaction | CHECK ",
		"choice.Minute | | 1 Minute | CHECK ",
		"choice.Hour | | 1 Hour | CHECK ",
		"choice.Day | | 1 Day | CHECK "
	))]
	[h:TimeOptions = if(choice.Action,json.append(TimeOptions,"Action"),TimeOptions)]
	[h:TimeOptions = if(choice.Bonus,json.append(TimeOptions,"Bonus"),TimeOptions)]
	[h:TimeOptions = if(choice.Reaction,json.append(TimeOptions,"Reaction"),TimeOptions)]
	[h:TimeOptions = if(choice.Minute,json.append(TimeOptions,"Minute"),TimeOptions)]
	[h:TimeOptions = if(choice.Hour,json.append(TimeOptions,"Hour"),TimeOptions)]
	[h:TimeOptions = if(choice.Day,json.append(TimeOptions,"Day"),TimeOptions)]
	
	[h:SpellOptions = json.set(SpellOptions,"Time",TimeOptions)]
};{}]

[h:macro.return = SpellOptions]