[h:abort(input(
	"junkVar | ---------------- Choose How to Filter the Spell List ---------------- | | LABEL | SPAN=TRUE",
	"choice.Class | | Filter based on class | CHECK ",
	"choice.Level | No,Choose Levels,Levels for which you have spell slots | Filter based on level | LIST ",
	"choice.School | | Filter based on school | CHECK ",
	"choice.Time | | Filter based on casting time | CHECK ",
	"choice.Ritual | | Filter based on ritual casting | CHECK "
	))]

[h:SpellOptions = json.set("","Ritual",choice.Ritual)]

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
	[h:abort(input(
		"junkVar | ---------------- Choose Valid Levels ---------------- | | LABEL | SPAN=TRUE",
		"choice.Cantrip | | Cantrips | CHECK ",
		"choice.First | | 1st Level | CHECK ",
		"choice.Second | | 2nd Level | CHECK ",
		"choice.Third | | 3rd Level | CHECK ",
		"choice.Fourth | | 4th Level | CHECK ",
		"choice.Fifth | | 5th Level | CHECK ",
		"choice.Sixth | | 6th Level | CHECK ",
		"choice.Seventh | | 7th Level | CHECK ",
		"choice.Eighth | | 8th Level | CHECK ",
		"choice.Ninth | | 9th Level | CHECK ",
" choice.CapType | Specific Class,Maximum of all combined,Based on classes in the class filter | <html><span title='Specific Class, e.g. Bard Magic Secrets use highest level Bard spell you can cast (This is most likely what you want, the others are niche and weird); Maximum of all combined takes multiclassing into account; Based on classes in filter - e.g. Bard and Cleric are in the filter, player can cast level 2 Bard spells and level 1 Cleric so the max shown is level 2'>How is the highest level spell slot you can cast determined? | LIST "
		))]
	[h:LevelOptions = if(choice.Cantrip,json.append(LevelOptions,0),LevelOptions)]
	[h:LevelOptions = if(choice.First,json.append(LevelOptions,1),LevelOptions)]
	[h:LevelOptions = if(choice.Second,json.append(LevelOptions,2),LevelOptions)]
	[h:LevelOptions = if(choice.Third,json.append(LevelOptions,3),LevelOptions)]
	[h:LevelOptions = if(choice.Fourth,json.append(LevelOptions,4),LevelOptions)]
	[h:LevelOptions = if(choice.Fifth,json.append(LevelOptions,5),LevelOptions)]
	[h:LevelOptions = if(choice.Sixth,json.append(LevelOptions,6),LevelOptions)]
	[h:LevelOptions = if(choice.Seventh,json.append(LevelOptions,7),LevelOptions)]
	[h:LevelOptions = if(choice.Eighth,json.append(LevelOptions,8),LevelOptions)]
	[h:LevelOptions = if(choice.Ninth,json.append(LevelOptions,9),LevelOptions)]
	
	[h:SpellOptions = json.set(SpellOptions,"Level",LevelOptions)]
};{
	[h,if(choice.Level==2),CODE:{
		[h:abort(input(
			" choice.CapType | Specific Class,Maximum of all combined,Based on classes in the class filter | <html><span title='Specific Class, e.g. Bard Magic Secrets use highest level Bard spell you can cast (This is most likely what you want, the others are niche and weird); Maximum of all combined takes multiclassing into account; Based on classes in filter - e.g. Bard and Cleric are in the filter, player can cast level 2 Bard spells and level 1 Cleric so the max shown is level 2'>How is the highest level spell slot you can cast determined? | LIST "
			))]
		[h:abort(input(
			if(choice.CapType>0,""," choice.CapClass | "+pm.GetClasses("DisplayName",",")+" | Base level cap on highest spell level available as a | LIST | VALUE=STRING "),
			if(choice.CapType>0,""," choice.HasSubclass |  | <html><span title='Essentially for classes with casting locked behind a subclass, e.g. Rogue - Arcane Trickster. Will open a follow-up window.'>Is there an associatated subclass</span></html> | CHECK ")
			))]
		
		[h: choice.CapSubclass = ""]
		[h,if(choice.CapType>0): subclassInput = ""; subclassInput = if(choice.HasSubclass," choice.CapSubclass | "+pm.GetSubclasses("DisplayName",",")+" | Choose associated subclass | LIST | VALUE=STRING ","")]
		[h:abort(input(subclassInput))]

		[h,if(choice.CapType>0): SpellOptions = json.set(SpellOptions,"LevelCap",1,"LevelCapClass",if(choice.CapType==1,"Combined_Max","Use_Filter")); SpellOptions = json.set(SpellOptions,"LevelCap",1,"LevelCapClass",choice.CapClass,"LevelCapSubclass",choice.CapSubclass)]
	};{
		[h:SpellOptions = json.set(SpellOptions,"LevelCap",0)]
	}]
}]

[h:SchoolOptions = ""]
[h,if(choice.School),CODE:{
	[h:abort(input(
		"junkVar | ---------------- Choose Valid Schools ---------------- | | LABEL | SPAN=TRUE",
		"choice.Abjuration | | Abjuration Spells | CHECK ",
		"choice.Conjuration | | Conjuration Spells | CHECK ",
		"choice.Divination | | Divination Spells | CHECK ",
		"choice.Enchantment | | Enchantment Spells | CHECK ",
		"choice.Evocation | | Evocation Spells | CHECK ",
		"choice.Illusion | | Illusion Spells | CHECK ",
		"choice.Necromancy | | Necromancy Spells | CHECK ",
		"choice.Transmutation | | Transmutation Spells | CHECK "
		))]
	[h:SchoolOptions = if(choice.Abjuration,json.append(SchoolOptions,"abjuration"),SchoolOptions)]
	[h:SchoolOptions = if(choice.Conjuration,json.append(SchoolOptions,"conjuration"),SchoolOptions)]
	[h:SchoolOptions = if(choice.Divination,json.append(SchoolOptions,"divination"),SchoolOptions)]
	[h:SchoolOptions = if(choice.Enchantment,json.append(SchoolOptions,"enchantment"),SchoolOptions)]
	[h:SchoolOptions = if(choice.Evocation,json.append(SchoolOptions,"evocation"),SchoolOptions)]
	[h:SchoolOptions = if(choice.Illusion,json.append(SchoolOptions,"illusion"),SchoolOptions)]
	[h:SchoolOptions = if(choice.Necromancy,json.append(SchoolOptions,"necromancy"),SchoolOptions)]
	[h:SchoolOptions = if(choice.Transmutation,json.append(SchoolOptions,"transmutation"),SchoolOptions)]
	
	[h:SpellOptions = json.set(SpellOptions,"School",SchoolOptions)]
};{}]

[h:TimeOptions = ""]
[h,if(choice.Time),CODE:{
	[h:abort(input(
		"junkVar | ---------------- Choose Valid Casting Times ---------------- | | LABEL | SPAN=TRUE",
		"choice.Action | | Action | CHECK ",
		"choice.Bonus | | Bonus Action | CHECK ",
		"choice.Reaction | | Reaction | CHECK ",
		"choice.Minute | | 1 Minute | CHECK ",
		"choice.10Minute | | 10 Minutes | CHECK ",
		"choice.Hour | | 1 Hour | CHECK ",
		"choice.8Hour | | 8 Hours | CHECK ",
		"choice.24Hour | | 24 Hours | CHECK "
		))]
	[h:TimeOptions = if(choice.Action,json.append(TimeOptions,"Action"),TimeOptions)]
	[h:TimeOptions = if(choice.Bonus,json.append(TimeOptions,"BONUS"),TimeOptions)]
	[h:TimeOptions = if(choice.Reaction,json.append(TimeOptions,"REACTION"),TimeOptions)]
	[h:TimeOptions = if(choice.Minute,json.append(TimeOptions,"1 MIN"),TimeOptions)]
	[h:TimeOptions = if(choice.10Minute,json.append(TimeOptions,"10 MIN"),TimeOptions)]
	[h:TimeOptions = if(choice.Hour,json.append(TimeOptions,"1 HOUR"),TimeOptions)]
	[h:TimeOptions = if(choice.8Hour,json.append(TimeOptions,"8 HOURS"),TimeOptions)]
	[h:TimeOptions = if(choice.24Hour,json.append(TimeOptions,"24 HOURS"),TimeOptions)]
	
	[h:SpellOptions = json.set(SpellOptions,"Time",TimeOptions)]
};{}]

[h:macro.return = SpellOptions]