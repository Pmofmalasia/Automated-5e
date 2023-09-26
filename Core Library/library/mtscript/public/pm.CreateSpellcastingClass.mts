[h:sp.SpellcastingAbility = arg(0)]
[h:abort(input(
	" junkVar | ---------------------- Spellcasting Info ---------------------- |  | LABEL | SPAN=TRUE ",
	" sp.Name | Spellcasting | Enter spellcasting feature name ",
	" sp.LevelGained | 0,1,2,3,4,5 | Level Spellcasting is Gained | LIST | SELECT=1 ",
	" sp.HalfFull | Full Caster,Half Caster,Third Caster,Independent Spell Slots | Caster Type | LIST ",
	" sp.Stat | "+pm.GetAttributes("DisplayName")+" | Primary Casting Stat | LIST | VALUE=STRING ",
	" sp.Ritual |  | Can Ritual Cast | CHECK ",
	" sp.MagicSource | Arcane,Divine,Primal | Source of Magic | LIST | VALUE=STRING ",
	" junkVar | ---------------------------------------------------------------------------------------- |  | LABEL | SPAN=TRUE ",
	" HasCantrips | 1 | Gains cantrips | CHECK ",
	" sp.Prepared | Known,Prepared,Spellbook | Knows or Prepares Spells | LIST | VALUE=STRING",
	" sp.PreparedNumHow | Based on Level and a Stat,No Pattern | How Number of Spells Known/Prepared is Determined | LIST ",
	" sp.OtherList |  | Uses the spell list of another class | CHECK "
))]

[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,
	"Name",pm.RemoveSpecial(sp.Name),
	"DisplayName",sp.Name,
	"Level",sp.LevelGained,
	"PrimeStat",pm.RemoveSpecial(sp.Stat),
	"CasterType",if(sp.HalfFull==0,1,if(sp.HalfFull==1,(1/2),if(sp.HalfFull==2,(1/3),0))),
	"Ritual",sp.Ritual,
	"MagicSource",sp.MagicSource,
	"SpellPrepType",sp.Prepared,
	"CallSpellClass",1,
	"CallSharedDC",pm.RemoveSpecial(sp.Name)+json.get(sp.SpellcastingAbility,"Class")+json.get(sp.SpellcastingAbility,"Subclass"),
	"GainOnLevel",1
)]
[h:sp.UpdateLevelOptions = string(sp.LevelGained)]
[h,count(20-sp.LevelGained): sp.UpdateLevelOptions = listAppend(sp.UpdateLevelOptions,sp.LevelGained+roll.count+1)]

[h:sp.Updates = json.set("",
	"Name",pm.RemoveSpecial(sp.Name),
	"DisplayName",sp.Name,
	"Class",json.get(sp.SpellcastingAbility,"Class"),
	"Subclass",json.get(sp.SpellcastingAbility,"Subclass"),
	"Level",sp.LevelGained,
	"Library",json.get(sp.SpellcastingAbility,"Library")
)]
[h:sp.NoUpdatesTest = sp.Updates]

[h:BaseSpellFilter = json.set("","MinLevel",1,"LevelBasedMaxLevel",1)]
[h,if(sp.HalfFull==3),CODE:{
	[h:abort(input(
		" sp.ResourceDisplayName | -- Blank/Ignore to Use Casting Feature Name -- | Name of Spell Slots ",
		" sp.SpellLevel | Constant Level,Full Caster Pattern,Full Caster With Cap,Half Caster Pattern,Half Caster With Cap,Third Caster Pattern,Third Caster With Cap | Spell Level | LIST | VALUE=STRING ",
		" sp.ResourceType | 1,Other Flat Number,Attribute Based,Linearly Class Level Based,Non-Linearly Class Level Based,Proficiency Based,Multiple Spell Slot Levels,Custom | Amount of Spell Slots | LIST | VALUE=STRING ",
		" sp.RestoreShortRest |  | Spell Slots Restored on Short Rests | CHECK ",
		" sp.RestoreLongRest | 1 | Spell Slots Restored on Long Rests | CHECK "
	))]
	
	[h,switch(sp.SpellLevel),CODE:
		case "Constant Level":{
			[h:abort(input(
				" sp.LevelCap | 1,2,3,4,5,6,7,8,9 | Spell Level | LIST | VALUE=STRING "
			))]
			
			[h:sp.SpellLevelExpression = "[r:"+sp.LevelCap+"]"]
			[h:BaseSpellFilter = json.set(BaseSpellFilter,"MaxLevel",sp.LevelCap,"MinLevel",sp.LevelCap)]
		};
		case "Full Caster Pattern":{
			[h:sp.SpellLevelExpression = "[r:ceiling(pm.GetAbilityLevel(json.set('','Name','"+json.get(sp.SpellcastingAbility,"Name")+"','Class','"+json.get(sp.SpellcastingAbility,"Class")+"','Subclass','"+json.get(sp.SpellcastingAbility,"Subclass")+"'))*(1/2))]"]
			[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,"CasterType",1)]
		};
		case "Full Caster With Cap":{
			[h:abort(input(
				" sp.LevelCap | 1,2,3,4,5,6,7,8,9 | Max Spell Level | LIST | VALUE=STRING "
			))]
			[h:sp.SpellLevelExpression = "[r:min(ceiling(pm.GetAbilityLevel(json.set('','Name','"+json.get(sp.SpellcastingAbility,"Name")+"','Class','"+json.get(sp.SpellcastingAbility,"Class")+"','Subclass','"+json.get(sp.SpellcastingAbility,"Subclass")+"'))*(1/2)),"+sp.LevelCap+")]"]
			[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,"CasterType",1,"CasterCap",sp.LevelCap)]
			[h:BaseSpellFilter = json.set(BaseSpellFilter,"MaxLevel",sp.LevelCap)]
		};
		case "Half Caster Pattern":{
			[h:sp.SpellLevelExpression = "[r:ceiling(pm.GetAbilityLevel(json.set('','Name','"+json.get(sp.SpellcastingAbility,"Name")+"','Class','"+json.get(sp.SpellcastingAbility,"Class")+"','Subclass','"+json.get(sp.SpellcastingAbility,"Subclass")+"'))*(1/4))]"]
			[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,"CasterType",(1/2))]
		};
		case "Half Caster With Cap":{
			[h:abort(input(
				" sp.LevelCap | 1,2,3,4,5,6,7,8,9 | Max Spell Level | LIST | VALUE=STRING "
			))]
			[h:sp.SpellLevelExpression = "[r:min(ceiling(pm.GetAbilityLevel(json.set('','Name','"+json.get(sp.SpellcastingAbility,"Name")+"','Class','"+json.get(sp.SpellcastingAbility,"Class")+"','Subclass','"+json.get(sp.SpellcastingAbility,"Subclass")+"'))*(1/4)),"+sp.LevelCap+")]"]
			[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,"CasterType",(1/2),"CasterCap",sp.LevelCap)]
			[h:BaseSpellFilter = json.set(BaseSpellFilter,"MaxLevel",sp.LevelCap)]
		};
		case "Third Caster Pattern":{
			[h:sp.SpellLevelExpression = "[r:ceiling(pm.GetAbilityLevel(json.set('','Name','"+json.get(sp.SpellcastingAbility,"Name")+"','Class','"+json.get(sp.SpellcastingAbility,"Class")+"','Subclass','"+json.get(sp.SpellcastingAbility,"Subclass")+"'))*(1/6))]"]
			[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,"CasterType",(1/3))]
		};
		case "Third Caster With Cap":{
			[h:abort(input(
				" sp.LevelCap | 1,2,3,4,5,6,7,8,9 | Max Spell Level | LIST | VALUE=STRING "
			))]
			[h:sp.SpellLevelExpression = "[r:min(ceiling(pm.GetAbilityLevel(json.set('','Name','"+json.get(sp.SpellcastingAbility,"Name")+"','Class','"+json.get(sp.SpellcastingAbility,"Class")+"','Subclass','"+json.get(sp.SpellcastingAbility,"Subclass")+"'))*(1/6)),"+sp.LevelCap+")]"]
			[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,"CasterType",(1/3),"CasterCap",sp.LevelCap)]
			[h:BaseSpellFilter = json.set(BaseSpellFilter,"MaxLevel",sp.LevelCap)]
		}
	]
	[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,"ResourceSpellLevel",sp.SpellLevelExpression,"ResourceAsSpellSlot",1)]
	
	[h,if(sp.ResourceType=="Multiple Spell Slot Levels"): sp.ResourceType = "Multiple Resources"]
	[h:sp.ResourceInfo = pm.ResourceInput(json.set("","Name",json.get(sp.SpellcastingAbility,"Name"),"Class",json.get(sp.SpellcastingAbility,"Class"),"Subclass",json.get(sp.SpellcastingAbility,"Subclass"),"Level",sp.LevelGained),sp.ResourceType)]
	[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,"RestoreShortRest",sp.RestoreShortRest,"RestoreLongRest",sp.RestoreLongRest,"MaxResource",json.get(sp.ResourceInfo,"Base"))]
	[h,if(json.get(sp.ResourceInfo,"DisplayName")==""),CODE:{
		[h,if(sp.ResourceDisplayName!="" && sp.ResourceDisplayName!="0" && sp.ResourceDisplayName!="-- Blank/Ignore to Use Casting Feature Name --"): sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,"ResourceDisplayName",sp.ResourceDisplayName)]
	};{
		[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,"ResourceDisplayName",json.get(sp.ResourceInfo,"DisplayName"))]
	}]
	[h:sp.ResourceUpdateInfo = json.get(sp.ResourceInfo,"Updates")]
	[h,if(sp.ResourceUpdateInfo==""),CODE:{};{
		[h,foreach(tempLevel,sp.UpdateLevelOptions): sp.Updates = 
			if(json.get(sp.ResourceUpdateInfo,tempLevel)=="",
				sp.Updates,
				json.set(sp.Updates,tempLevel,
					json.set(json.get(sp.Updates,tempLevel),
						"MaxResource",json.get(sp.ResourceUpdateInfo,tempLevel),
						"ResourceDisplayName",if(json.get(sp.ResourceInfo,"DisplayName")=="",
							if(sp.ResourceDisplayName!="" && sp.ResourceDisplayName!="0" && sp.ResourceDisplayName!="-- Blank/Ignore to Use Casting Feature Name --",sp.ResourceDisplayName,""),
							json.get(sp.ResourceInfo,"DisplayName")
						)
					)
				)
			)
		]
	}]
	[h:"<!-- Note: 'Resource' key is not set because amount is not known for things that vary based on the character that gains them, such as proficiency or attribute based. -->"]
};{
	[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,"SharedSpellSlots",1)]
}]

[h:spellOptionsInput = ""]
[h,if(sp.Prepared=="Known"): spellOptionsInput = " KnownSpellSwapNum | 0,1,2,3,4,5,6,7,8,9,10 | Max Number of Spells Replaced on Level | LIST | SELECT=1 "]
[h,if(HasCantrips): spellOptionsInput = listAppend(spellOptionsInput," junkVar | ------------------ Cantrips Gained Each Level ------------------ |  | LABEL | SPAN=TRUE ","##")]
[h,count(HasCantrips * (21 - sp.LevelGained)): spellOptionsInput = listAppend(spellOptionsInput," level"+(roll.count + sp.LevelGained)+"Cantrips | 0,1,2,3,4,5,6,7,8,9 | Level "+(roll.count + sp.LevelGained)+" | LIST ","##")]

[h,if(sp.PreparedNumHow==0),CODE:{
	[h,if(spellOptionsInput!=""): spellOptionsInput = spellOptionsInput + "##"]
	[h:spellOptionsInput = spellOptionsInput + 
		"junkVar | ---------------- Spell Choice Number Calculation ---------------- |  | LABEL | SPAN=TRUE 
		## levelMultiplier | 0,1/4,1/2,1,2 | Multiply Level By | LIST | VALUE=STRING SELECT=3 
		## levelRounding | Down,Up | Round Level | LIST | VALUE=STRING
		## primestatMultiplier | 0,1/4,1/2,1,2 | Multiply Primary Stat By | LIST | VALUE=STRING SELECT=3 
		## primestatRounding | Down,Up | Round Primary Stat | LIST | VALUE=STRING
		## minimumOneSpell | 1 | Minimum of One Spell? | CHECK"
	]
};{
	[h:spellOptionsInput = listAppend(spellOptionsInput," junkVar | ------------------- Spells Gained Each Level ------------------- |  | LABEL | SPAN=TRUE ","##")]
	[h,count(21 - sp.LevelGained): spellOptionsInput = listAppend(spellOptionsInput," level"+(roll.count + sp.LevelGained)+"Spells | 0,1,2,3,4,5,6,7,8,9 | Level "+(roll.count + sp.LevelGained)+" | LIST ","##")]
}]

[h:abort(input(spellOptionsInput))]

[h:"<!-- Note: BaseSpellFilter created above to set a MaxLevel for casters with a level cap -->"]
[h:BaseCantripInstance = json.set("","Filter",json.set("","MaxLevel",0))]
[h:BaseSpellInstance = json.set("","Filter",BaseSpellFilter)]
[h,if(sp.Prepared=="Known"): BaseSpellInstance = json.set(BaseSpellInstance,"ReplaceNumber",KnownSpellSwapNum)]
[h,if(sp.OtherList),CODE:{
	[h:pm.SchoolInput = ""]
	[h,foreach(school,pm.GetSpellSchools()): pm.SchoolInput = listAppend(pm.SchoolInput,"sp."+json.get(school,"Name")+" |  | "+json.get(school,"DisplayName")+" | CHECK ","##")]
[h:"<!-- TODO: When converted to dialog5, will want to create separate instances for different limits (e.g. AT/EK have a few spells not limited by school) -->"]
	[h:abort(input(
		" sp.ClassList | "+pm.GetClasses("DisplayName")+" | Other class list to use | LIST | VALUE=STRING",
		" allSpellsTest |  | Use all spells from selected class | CHECK ",
		" junkVar | ------------------ Valid Spell Schools From Class ------------------ |  | LABEL | SPAN=TRUE ",
		pm.SchoolInput
	))]

	[h:pm.ValidSchools = ""]
	[h,foreach(school,pm.GetSpellSchools("Name")): pm.ValidSchools = if(or(allSpellsTest,eval("sp."+json.get(school,"Name"))),json.append(pm.ValidSchools,school),pm.ValidSchools)]
	
	[h,if(!allSpellsTest): BaseCantripInstance = json.path.put(BaseCantripInstance,"\$.Filter","School",pm.ValidSchools)]
	[h,if(!allSpellsTest): BaseSpellInstance = json.path.put(BaseSpellInstance,"\$.Filter","School",pm.ValidSchools)]
	
	[h:BaseCantripInstance = json.set(BaseCantripInstance,"List",sp.ClassList)]
	[h:BaseSpellInstance = json.set(BaseSpellInstance,"List",sp.ClassList)]
};{
	[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,"UniqueSpellList",1)]
	[h:setLibProperty("sb.CastingAbilities",
		json.set(getLibProperty("sb.CastingAbilities","Lib:"+json.get(sp.SpellcastingAbility,"Library")),
		json.get(sp.SpellcastingAbility,"Class")+json.get(sp.SpellcastingAbility,"Subclass"),json.get(sp.SpellcastingAbility,"PrimeStat")
		),"Lib:"+json.get(sp.SpellcastingAbility,"Library")
	)]
	[h:"<!-- TODO: Add input for creation of spell lists from existing spells here, and replace the blank array currently there. -->"]
	[h:setLibProperty("sb.SpellLists",
		json.set(getLibProperty("sb.SpellLists","Lib:"+json.get(sp.SpellcastingAbility,"Library")),
		json.get(sp.SpellcastingAbility,"Class")+json.get(sp.SpellcastingAbility,"Subclass"),"[]"
		),"Lib:"+json.get(sp.SpellcastingAbility,"Library")
	)]
	
	[h:BaseCantripInstance = json.set(BaseCantripInstance,"List",json.get(sp.SpellcastingAbility,"Class")+json.get(sp.SpellcastingAbility,"Subclass"))]
	[h:BaseSpellInstance = json.set(BaseSpellInstance,"List",json.get(sp.SpellcastingAbility,"Class")+json.get(sp.SpellcastingAbility,"Subclass"))]
}]

[h:AllSpellInstances = "[]"]
[h,if(HasCantrips),CODE:{
	[h:CantripNumber = eval("level"+sp.LevelGained+"Cantrips")]
	[h:BaseCantripInstance = json.set(BaseCantripInstance,"Number",CantripNumber)]
	[h:AllSpellInstances = json.append(AllSpellInstances,BaseCantripInstance)]
};{}]

[h,if(sp.PreparedNumHow==0),CODE:{
	[h:SpellNumCalculation = if(levelRounding=="Down","floor","ceiling")+"(("+levelMultiplier+")*pm.GetAbilityLevel(json.set('','Name','"+json.get(sp.SpellcastingAbility,"Name")+"','Class','"+json.get(sp.SpellcastingAbility,"Class")+"','Subclass','"+json.get(sp.SpellcastingAbility,"Subclass")+"')))+"+if(levelRounding=="Down","floor","ceiling")+"(("+primestatMultiplier+")*json.get(getProperty('a5e.stat.AtrMods'),'"+json.get(sp.SpellcastingAbility,"PrimeStat")+"'))"]
	[h,if(minimumOneSpell): SpellNumCalculation = "max(1,"+SpellNumCalculation+")"]
	[h:SpellNumCalculation = "[r:"+SpellNumCalculation+"]"]

	[h:BaseSpellInstance = json.set(BaseSpellInstance,"Number",SpellNumCalculation)]
	[h:AllSpellInstances = json.append(AllSpellInstances,BaseSpellInstance)]
};{
	[h:SpellNumber = eval("level"+sp.LevelGained+"Spells")]
	[h:BaseSpellInstance = json.set(BaseSpellInstance,"Number",SpellNumber)]
	[h:AllSpellInstances = json.append(AllSpellInstances,BaseSpellInstance)]
}]

[h:sp.SpellcastingAbility = json.set(sp.SpellcastingAbility,"SpellOptions",AllSpellInstances)]
[h:safeRollCount = 0]
[h,count(20 - sp.LevelGained),CODE:{
	[h:OldSpellInstances = AllSpellInstances]
	[h:tempLevel = (sp.LevelGained + safeRollCount + 1)]
	[h,if(HasCantrips),CODE:{
		[h:NewCantrips = eval("level"+tempLevel+"Cantrips")]
		[h:CantripNumber = CantripNumber + NewCantrips]
		[h:BaseCantripInstance = json.set(BaseCantripInstance,"Number",CantripNumber)]
		[h,count(json.length(AllSpellInstances)): AllSpellInstances = if(json.equals(json.remove(BaseCantripInstance,"Number"),json.remove(json.get(AllSpellInstances,roll.count),"Number")),json.set(AllSpellInstances,roll.count,BaseCantripInstance),AllSpellInstances)]
	};{}]

	[h,if(sp.PreparedNumHow==1),CODE:{
		[h:NewSpells = eval("level"+tempLevel+"Spells")]
		[h:SpellNumber = SpellNumber + NewSpells]
		[h:BaseSpellInstance = json.set(BaseSpellInstance,"Number",SpellNumber)]
		[h,count(json.length(AllSpellInstances)): AllSpellInstances = if(json.equals(json.remove(BaseSpellInstance,"Number"),json.remove(json.get(AllSpellInstances,roll.count),"Number")),json.set(AllSpellInstances,roll.count,BaseSpellInstance),AllSpellInstances)]
	};{}]

	[h,if(!json.equals(OldSpellInstances,AllSpellInstances)),CODE:{
		[h:sp.Updates = json.set(sp.Updates,tempLevel,json.set(json.get(sp.Updates,tempLevel),"SpellOptions",AllSpellInstances))]
	};{}]

	[h:safeRollCount = safeRollCount + 1]
}]

[h:spellOptionsInput = listAppend(spellOptionsInput," junkVar | ------------------- Spells Gained Each Level ------------------- |  | LABEL | SPAN=TRUE ","##")]
[h,count(21 - sp.LevelGained): spellOptionsInput = listAppend(spellOptionsInput," level"+(roll.count + sp.LevelGained)+"Spells | 0,1,2,3,4,5,6,7,8,9 | Level "+(roll.count + sp.LevelGained)+" | LIST ","##")]

[h,if(!json.equals(sp.Updates,sp.NoUpdatesTest)): setLibProperty("sb.AbilityUpdates",json.append(getLibProperty("sb.AbilityUpdates","Lib:"+json.get(sp.Updates,"Library")),sp.Updates),"Lib:"+json.get(sp.Updates,"Library"))]
[h:setLibProperty("sb.Abilities",json.append(getLibProperty("sb.Abilities","Lib:"+json.get(sp.SpellcastingAbility,"Library")),sp.SpellcastingAbility),"Lib:"+json.get(sp.SpellcastingAbility,"Library"))]