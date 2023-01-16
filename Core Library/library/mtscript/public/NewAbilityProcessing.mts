[h:lu.NewAbilities = json.get(macro.args,"Abilities")]
[h:ParentToken = json.get(macro.args,"ParentToken")]
[h:switchToken(ParentToken)]

[h:"<!-- Selection of feats for features that grant them. Separate from class ASIs. -->"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.FeatChoice = ""; lu.FeatChoice = json.path.read(lu.NewAbilities,"[?(@.FeatChoice==1)]")]
[h,count(json.length(lu.FeatChoice)),CODE:{
	[MACRO("FeatSelection@Lib:pm.a5e.Core"): json.set("","LevelUp",1,"Restrictions",if(getProperty("a5e.stat.Level")==0,0,1),"ParentToken",ParentToken)]
	[h:lu.NewAbilities = json.append(lu.NewAbilities,macro.return)]
}]

[h:"<!-- Selection of whether or not to use abilities gained optionally on level up. -->"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.OptionalAbilities = ""; lu.OptionalAbilities = json.path.read(lu.NewAbilities,"[?(@.Optional==1)]")]
[h:lu.OptionalAbilitiesInput = ""]
[h,foreach(ability,lu.OptionalAbilities),CODE:{
	[h:lu.OptionalAbilitiesInput = if(lu.OptionalAbilitiesInput == ""," junkVar | Choose whether or not to take these optional abilities |  | LABEL | SPAN=TRUE ",lu.OptionalAbilitiesInput)]
	[h:lu.OptionalAbilitiesInput = listAppend(lu.OptionalAbilitiesInput," lu.OptionalChoice"+roll.count+" |  | "+json.get(ability,"DisplayName")+" | CHECK ","##")]
}]

[h:abort(input(lu.OptionalAbilitiesInput))]

[h,foreach(ability,lu.OptionalAbilities),CODE:{
	[h:lu.NewAbilities = if(eval("lu.OptionalChoice"+roll.count),lu.NewAbilities,json.path.delete(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]"))]
}]

[h:"<!-- Selection of abilities that replace other abilities -->"]
[H:"<!-- First removes abilities from the list of new abilities here to prevent making unnecessary decisions to start with, and will remove any abilities from the list of abilities the character already has at the end to avoid making any changes before all level up choices are confirmed. -->"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.ReplaceAbilities = ""; lu.ReplaceAbilities = json.path.read(lu.NewAbilities,"[*][?(@.Replace != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:lu.ReplaceAbilitiesInput = ""]
[h,foreach(ability,lu.ReplaceAbilities),CODE:{
	[h:lu.ReplaceAbilitiesInput = listAppend(lu.ReplaceAbilitiesInput," lu.ReplaceChoice"+roll.count+" |  | Replace "+json.get(json.get(ability,"Replace"),"DisplayName")+" with "+json.get(ability,"DisplayName")+" | CHECK ","##")]
}]

[h:abort(input(lu.ReplaceAbilitiesInput))]

[h,foreach(ability,lu.ReplaceAbilities),CODE:{
	[h:lu.NewAbilities = if(eval("lu.ReplaceChoice"+roll.count),
		json.path.delete(lu.NewAbilities,"[?(@.Name == '"+json.get(json.get(ability,"Replace"),"Name")+"' && @.Class == '"+json.get(json.get(ability,"Replace"),"Class")+"' && @.Subclass == '"+json.get(json.get(ability,"Replace"),"Subclass")+"')]"),
		json.path.delete(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]"))]
}]

[h:"<!-- Checks for any 'Master' abilities which choose 'Subabilities' on level up, then runs the macro for choosing them. Currently disabled, may need to be moved to level up macro. -->"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.AbilityChoices = ""; lu.AbilityChoices = json.path.read(lu.NewAbilities,"[?(@.ChooseSubabilities==1)]")]
[h,foreach(ability,lu.AbilityChoices),CODE:{
	[h:'<!-- pm.GetAbilityMacro ability,"Active"  json.set "","IsTooltip",0 -->']
}]

[h:"<!-- Allows the player to choose which attribute they would like to allocate points to if an ability allows it. -->"]
[h:"<!-- Also sets the prime stat of an ability IF it is dependent on the attribute chosen. If multiple are chosen for that ability, it sets PrimeStatOptions to contain all chosen, to be picked later. -->"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.AttributeChoices = ""; lu.AttributeChoices = json.path.read(lu.NewAbilities,"[*][?(@.AttributeOptions != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.AttributeChoices),CODE:{
	[h:allPointOptions = json.get(ability,"AttributeOptions")]

	[h,if(allPointOptions=="FlexibleChoice"),CODE:{
		[h:abort(input(" flexibleSelection | +2/+1,+1/+1/+1 | Choose an Ability Score distribution | RADIO "))]
		[h,if(flexibleSelection == 0):
			allPointOptions = json.append("",json.set("","AllAttributes",1,"Points",2),json.set("","AllAttributes",1,"Points",1));
			allPointOptions = json.append("",json.set("","AllAttributes",1,"Points",1),json.set("","AllAttributes",1,"Points",1),json.set("","AllAttributes",1,"Points",1))
		]
	};{}]

	[h:lu.AttrChoiceInput = " junkVar | Select Attributes for "+json.get(ability,"DisplayName")+" |  | LABEL | SPAN=TRUE "]
	[h:tempCountVar = 0]
	[h,foreach(SetofPoints,allPointOptions),CODE:{
		[h:lu.AttributeOptions = ""]
		[h,foreach(attribute,pm.GetAttributes("DisplayName","json")): lu.AttributeOptions = if(or(json.get(SetofPoints,pm.RemoveSpecial(attribute))==json.get(SetofPoints,"Inclusive"),json.get(SetofPoints,"AllAttributes")==1),listAppend(lu.AttributeOptions,attribute),lu.AttributeOptions)]
		[h:lu.AttrChoiceInput = listAppend(lu.AttrChoiceInput," lu.AttrSelection"+tempCountVar+" | "+lu.AttributeOptions+" | Allocate "+json.get(SetofPoints,"Points")+" Point"+if(json.get(SetofPoints,"Points")==1,"","s")+" to | RADIO | VALUE=STRING ","##")]
		[h:tempCountVar = tempCountVar+1]
	}]

	[h:abort(input(lu.AttrChoiceInput))]

	[h:tempCountVar = 0]
	[h:lu.FinalAttributeChoices = if(json.get(ability,"Attributes")=="","{}",json.get(ability,"Attributes"))]
	[h,foreach(SetofPoints,allPointOptions),CODE:{
		[h:lu.PresetPoints = json.get(lu.FinalAttributeChoices,pm.RemoveSpecial(eval("lu.AttrSelection"+tempCountVar)))]
		[h,if(lu.PresetPoints==""):
			lu.FinalAttributeChoices = json.set(lu.FinalAttributeChoices,pm.RemoveSpecial(eval("lu.AttrSelection"+tempCountVar)),json.get(SetofPoints,"Points"));
			lu.FinalAttributeChoices = json.set(lu.FinalAttributeChoices,pm.RemoveSpecial(eval("lu.AttrSelection"+tempCountVar)),json.get(lu.FinalAttributeChoices,pm.RemoveSpecial(eval("lu.AttrSelection"+tempCountVar)))+json.get(SetofPoints,"Points"))]
		[h:tempCountVar = tempCountVar+1]
	}]
[h:"<!-- Note: PrimeStat Change -->"]
	[h,if(json.get(ability,"PrimeStatOptions")==""):lu.PrimeStatTest = 0; lu.PrimeStatTest = if(json.get(json.get(ability,"PrimeStatOptions"),"ChoiceMethod")=="Attribute",1,0)]
	[h,if(lu.PrimeStatTest),CODE:{
		[h:lu.PrimeStatOptions = json.fromStrProp(json.fields(lu.FinalAttributeChoices,"=1;")+"=1")]
		[h,if(json.length(lu.PrimeStatOptions)>1): 
			lu.NewAbilities = json.path.set(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]['PrimeStatOptions']",lu.PrimeStatOptions);
			lu.NewAbilities = json.path.put(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]","PrimeStat",json.get(json.fields(lu.PrimeStatOptions),0))]
	};{}]
	
	[h,if(json.get(ability,"Attributes")==""),CODE:{
		[h:lu.NewAbilities = json.path.put(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]","Attributes",lu.FinalAttributeChoices)]
	};{
		[h:lu.NewAbilities = json.path.set(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]['Attributes']",lu.FinalAttributeChoices)]
	}]
}]

[h:"<!-- Allows the player to choose a class associated with the ability - mostly for feats that choose a class for spells -->"]
[h:"<!-- Also sets the prime stat of an ability IF it is dependent on the casting modifier of the class chosen. -->"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.ClassChoices = ""; lu.ClassChoices = json.path.read(lu.NewAbilities,"[*][?(@.ClassOptions != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.ClassChoices),CODE:{
	[h:abort(input(
		" junkVar | --------------- "+json.get(ability,"DisplayName")+": Associated Class --------------- |  | LABEL | SPAN=TRUE ",
		" tempClassChoice | "+json.toList(json.get(ability,"ClassOptions"))+" | Choose a Class | LIST | VALUE=STRING "
		))]
[h:"<!-- Note: PrimeStat Change -->"]
	[h,if(json.get(ability,"PrimeStatOptions")==""):lu.PrimeStatTest = 0; lu.PrimeStatTest = if(json.get(json.get(ability,"PrimeStatOptions"),"ChoiceMethod")=="Class",1,0)]
	[h,if(lu.PrimeStatTest),CODE:{
		[h:lu.NewAbilities = json.path.put(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]","PrimeStat",json.get(getLibProperty("sb.CastingAbilities","Lib:pm.a5e.Core"),pm.RemoveSpecial(tempClassChoice)))]
	};{}]
	
	[h:lu.NewAbilities = json.path.put(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]","AssociatedClass",pm.RemoveSpecial(tempClassChoice))]
}]

[h:"<!-- Checks if a skill is: (1) Going to add predefined skills (2) Has options to choose skills if the predefined ones are already proficient (3) The predefined skill does already have proficiency. Then if true moves the 'Backup' key to 'SkillOptions' to be checked next. -->"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.SkillsAdded = ""; lu.SkillsAdded = json.path.read(lu.NewAbilities,"[*][?(@.Skills != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.SkillsAdded),CODE:{
	[h:TempSkillsGranted = json.fields(json.remove(json.remove(json.get(ability,"Skills"),"Backup"),"AlreadyProf"),"json")]
	[h:BackupTest = 0]
	[h:TempSkillsCount = 0]
	[h:AlreadyProfTest = json.get(json.get(ability,"Skills"),"AlreadyProf")]
	[h,while(AlreadyProfTest==1 && TempSkillsCount<json.length(TempSkillsGranted)-1),CODE:{
		[h:TempSkillProf = json.get(getProperty("a5e.stat.Skills"),json.get(TempSkillsGranted,TempSkillsCount))]
		[h,if(isNumber(TempSkillProf)): BackupTest = if(and(TempSkillProf>0,json.get(json.get(ability,"Skills"),json.get(TempSkillsGranted,TempSkillsCount))>0),BackupTest+1,BackupTest)]
		[h:TempSkillsCount = TempSkillsCount+1]
	}]
	
	[h,if(BackupTest>0),CODE:{
		[h:lu.BackupSkillChoice = json.set(json.get(json.get(ability,"Skills"),"Backup"),"ChoiceText","Choose "+BackupTest+" of the following","ChoiceNum",BackupTest)]
		[h,if(json.get(ability,"SkillOptions")!=""): lu.NewAbilities = 
	json.path.set(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]['SkillOptions']",json.merge(json.get(ability,"SkillOptions"),lu.BackupSkillChoice)); 
	lu.NewAbilities = json.path.put(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]","SkillOptions",lu.BackupSkillChoice)]
	};{}]
}]

[h:"<!-- Assemble Predetermined Skill Proficiencies Gained to be Tracked During Selection -->"]
[h:"<!-- Not entirely sound since a lower prof may override a higher one in the merge. -->"]
[h:lu.AllNewSkillProficiencies = "{}"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.SkillsGained = ""; lu.SkillsGained = json.path.read(lu.NewAbilities,"[*][?(@.Skills != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.SkillsGained): lu.AllNewSkillProficiencies = json.merge(lu.AllNewSkillProficiencies,json.get(ability,"Skills"))]

[h:"<!-- Choose Skill Proficiencies -->"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.SkillChoiceAbilities = ""; lu.SkillChoiceAbilities = json.path.read(lu.NewAbilities,"[*][?(@.SkillOptions != null && @.SkillOptions.ProftoExp!=1)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.SkillChoiceAbilities),CODE:{
	[h:lu.ProftoExpTest = json.get(json.get(ability,"SkillOptions"),"ProftoExp")]
	[h:lu.ValidSkills = ""]
	
	[h:lu.AllSkillsTest = json.get(json.get(ability,"SkillOptions"),"AllSkills")]
	[h,if(lu.AllSkillsTest==1): lu.ValidSkills = json.merge(json.fromStrProp(pm.GetSkills("Name","=1;")+"=1"),json.get(ability,"SkillOptions")); lu.ValidSkills = json.get(ability,"SkillOptions")]
	[h:lu.ValidSkills = json.set(lu.ValidSkills,"ChoiceText",json.get(ability,"DisplayName")+": "+json.get(json.get(ability,"SkillOptions"),"ChoiceText"),"ChoiceNum",json.get(json.get(ability,"SkillOptions"),"ChoiceNum"),"NewProf",lu.AllNewSkillProficiencies)]
	
	[h,MACRO("SkillSelection@Lib:pm.a5e.Core"): json.set("","Skills",lu.ValidSkills,"ParentToken",ParentToken)]
	[h,if(json.get(ability,"Skills")!=""),CODE:{
		[h:lu.NewSkillProficiencies = json.merge(json.get(ability,"Skills"),json.get(macro.return,"Skills"))]
		[h:lu.AllNewSkillProficiencies = json.merge(lu.AllNewSkillProficiencies,lu.NewSkillProficiencies)]
		[h:lu.NewAbilities = 
	json.path.set(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]['Skills']",lu.NewSkillProficiencies)]
	};{
		[h:lu.AllNewSkillProficiencies = json.merge(lu.AllNewSkillProficiencies,json.get(macro.return,"Skills"))]
		[h:lu.NewAbilities = json.path.put(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]","Skills",json.get(macro.return,"Skills"))]
	}]
}]

[h:"<!-- Choose Skill Proficiencies: Giving Expertise to Proficient Skills -->"]
[h:"<!-- Operates after the previous loop to allow proficiencies chosen this level to get expertise. -->"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.ExpertiseChoiceAbilities = ""; lu.ExpertiseChoiceAbilities = json.path.read(lu.NewAbilities,"[*][?(@.SkillOptions != null && @.SkillOptions.ProftoExp==1)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.ExpertiseChoiceAbilities),CODE:{
	[h:lu.ProftoExpTest = json.get(json.get(ability,"SkillOptions"),"ProftoExp")]
	[h:lu.ValidSkills = ""]
	
	[h,foreach(skill,pm.GetSkills("Name","json")): lu.ValidSkills = if(json.get(json.merge(getProperty("a5e.stat.Skills"),lu.AllNewSkillProficiencies),skill)==1,json.set(lu.ValidSkills,skill,2),lu.ValidSkills)]
	[h:lu.ValidSkills = json.set(lu.ValidSkills,"ChoiceText",json.get(ability,"DisplayName")+": "+json.get(json.get(ability,"SkillOptions"),"ChoiceText"),"ChoiceNum",json.get(json.get(ability,"SkillOptions"),"ChoiceNum"),"NewProf",lu.AllNewSkillProficiencies)]
	
	[h,MACRO("SkillSelection@Lib:pm.a5e.Core"): json.set("","Skills",lu.ValidSkills,"ParentToken",ParentToken)]
	
	[h,if(json.get(ability,"Skills")!=""),CODE:{
		[h:lu.NewSkillProficiencies = json.merge(json.get(ability,"Skills"),json.get(macro.return,"Skills"))]
		[h:lu.AllNewSkillProficiencies = json.merge(lu.AllNewSkillProficiencies,lu.NewSkillProficiencies)]
		[h:lu.NewAbilities = 
	json.path.set(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]['Skills']",lu.NewSkillProficiencies)]
	};{
		[h:lu.AllNewSkillProficiencies = json.merge(lu.AllNewSkillProficiencies,json.get(macro.return,"Skills"))]
		[h:lu.NewAbilities = json.path.put(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]","Skills",json.get(macro.return,"Skills"))]
	}]
}]

[h:"<!-- Assemble Predetermined Save Proficiencies Gained to be Tracked During Selection -->"]
[h:"<!-- Not entirely sound since a lower prof may override a higher one in the merge. (Less likely for saves.) -->"]
[h:lu.AllNewSaveProficiencies = "{}"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.SavesGained = ""; lu.SavesGained = json.path.read(lu.NewAbilities,"[*][?(@.Saves != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.SavesGained): lu.AllNewSaveProficiencies = json.merge(lu.AllNewSaveProficiencies,json.get(ability,"Saves"))]

[h:"<!-- Choose Save Proficiencies -->"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.SaveChoiceAbilities = ""; lu.SaveChoiceAbilities = json.path.read(lu.NewAbilities,"[*][?(@.SaveOptions != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.SaveChoiceAbilities),CODE:{
	[h:lu.AllSavesTest = json.get(json.get(ability,"SaveOptions"),"AllSaves")]
	[h,if(lu.AllSavesTest==1): lu.ValidSaves = json.merge(json.fromStrProp(pm.GetAttributes("Name","=1;")+"=1"),json.get(ability,"SaveOptions")); lu.ValidSaves = json.get(ability,"SaveOptions")]
	[h:lu.ValidSaves = json.set(lu.ValidSaves,"ChoiceText",json.get(ability,"DisplayName")+": "+json.get(json.get(ability,"SkillOptions"),"ChoiceText"),"ChoiceNum",json.get(json.get(ability,"SkillOptions"),"ChoiceNum"),"NewProf",lu.AllNewSaveProficiencies)]
	
	[h,MACRO("SkillSelection@Lib:pm.a5e.Core"): json.set("","Skills",lu.ValidSaves,"ParentToken",ParentToken)]
	
	[h,if(json.get(ability,"Saves")!=""): lu.NewAbilities = 
	json.path.set(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]['Saves']",json.merge(json.get(ability,"Saves"),json.get(macro.return,"Saves")));
	lu.NewAbilities = json.path.put(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]","Saves",json.get(macro.return,"Saves"))]
}]

[h:"<!-- Choose Primary Stat -->"]
[h:"<!-- Note: PrimeStat Change -->"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.PrimeStatAbilities = ""; lu.PrimeStatAbilities = json.path.read(lu.NewAbilities,"[*].PrimeStatOptions.[?(@.ChoiceMethod=='Choice')]")]
[h,foreach(ability,lu.PrimeStatAbilities),CODE:{
	[h:abort(input(
		" junkVar | ---------- Primary Stat Selection ---------- |  | LABEL | SPAN=TRUE ",
		" lu.StatChoice | "+json.fields(json.intersection(json.get(ability,"PrimeStatOptions"),json.fromStrProp(pm.GetAttributes("DisplayName","=1;")+"=1")))+" | Stat Choice for "+json.get(ability,"DisplayName")+" | LIST | VALUE=STRING "
		))]
	[h:lu.NewAbilities = json.path.put(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]","PrimeStat",pm.RemoveSpecial(lu.StatChoice))]
}]

[h:"<!-- Assemble Languages Gained -->"]
[h:lu.AllNewLanguages = "{}"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.LanguagesGained = ""; lu.LanguagesGained = json.path.read(lu.NewAbilities,"[*][?(@.Languages != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.LanguagesGained): lu.AllNewLanguages = json.merge(lu.AllNewLanguages,json.get(ability,"Languages"))]

[h:"<!-- Choose Languages -->"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.LanguageChoiceAbilities = ""; lu.LanguageChoiceAbilities = json.path.read(lu.NewAbilities,"[*][?(@.LanguageOptions != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.LanguageChoiceAbilities),CODE:{
	[h:lu.NewLanguages = pm.LanguageSelection(json.get(ability,"LanguageOptions"),json.get(ability,"DisplayName"),lu.AllNewLanguages)]
	[h:lu.AllNewLanguages = json.merge(lu.AllNewLanguages,lu.NewLanguages)]
	[h,if(json.get(ability,"Languages")!=""): 
		lu.NewAbilities = json.path.set(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]['Languages']",json.merge(json.get(ability,"Languages"),lu.NewLanguages));
		lu.NewAbilities = json.path.put(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]","Languages",lu.NewLanguages)
	]
}]

[h:"<!-- Choose Damage Type -->"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.DamageChoiceAbilities = ""; lu.DamageChoiceAbilities = json.path.read(lu.NewAbilities,"[*][?(@.DamageOptions != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.DamageChoiceAbilities),CODE:{
	[h:DmgAllTest = json.contains(json.get(json.get(ability,"DamageOptions"),"DamageTypes"),"All_Types")]
	[h:DamageTypeArray = pm.GetDamageTypes()]
	[h,if(DmgAllTest),CODE:{
		[h:lu.DamageOptions = DamageTypeArray]
		[h:lu.DamageOptionsList = json.toList(json.path.read(lu.DamageOptions,".DisplayName"))]
	};{
		[h:lu.DamageOptions = if(json.get(json.get(ability,"DamageOptions"),"Inclusive"),json.intersection(json.get(json.get(ability,"DamageOptions"),"DamageTypes"),DamageTypeArray),json.difference(json.get(json.get(ability,"DamageOptions"),"DamageTypes"),DamageTypeArray))]
		[h:lu.DamageOptionsList = json.toList(json.path.read(lu.DamageOptions,".DisplayName"))]
	}]
	
	[h:abort(input(
		"junkVar | ---------------------------- "+json.get(ability,"DisplayName")+": Damage Type ---------------------------- | | LABEL | SPAN=TRUE",
		" lu.DamageChoice | "+lu.DamageOptionsList+" | Choose a damage type | RADIO | VALUE=STRING"
		))]
	
	[h:lu.NewAbilities = json.path.put(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]","DamageType",json.get(json.path.read(lu.DamageOptions,"[?(@.Name=='"+pm.RemoveSpecial(lu.DamageChoice)+"')]['Name']"),0))]
}]

[h:"<!-- Other Miscellaneous Choices -->"]
[h,if(json.isEmpty(lu.NewAbilities)): lu.MiscChoiceAbilities = ""; lu.MiscChoiceAbilities = json.path.read(lu.NewAbilities,"[*][?(@.MiscChoice != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.MiscChoiceAbilities),CODE:{
	[h:abort(input(
		" lu.MiscChoice | "+json.get(json.get(ability,"MiscChoice"),"Options")+" | "+json.get(ability,"DisplayName")+": "+json.get(json.get(ability,"MiscChoice"),"Title")+" | RADIO | VALUE=STRING"
		))]
	[h:lu.NewAbilities = json.path.put(lu.NewAbilities,"[?(@.Name == '"+json.get(ability,"Name")+"' && @.Class == '"+json.get(ability,"Class")+"' && @.Subclass == '"+json.get(ability,"Subclass")+"')]","StoredValue",lu.MiscChoice)]
}]

[h:"<!-- Add buttons gained to list -->"]
[h:lu.NewButtons = ""]
[h,if(json.isEmpty(lu.NewAbilities)): lu.ButtonAbilities = ""; lu.ButtonAbilities = json.path.read(lu.NewAbilities,"[*][?(@.ButtonInfo != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(ability,lu.ButtonAbilities),CODE:{
	[h,foreach(button,json.get(ability,"ButtonInfo")): lu.NewButtons = json.append(lu.NewButtons,button)]
}]

[h:"<!-- Add new spells gained from outside of the regular class spell list to an array. Does not currently transfer marker data, will wait until after spell data storage is reworked. -->"]
[h:lu.NewSpells = "[]"]
[h:lu.NewSpellsRaw = json.path.read(lu.NewAbilities,"[*][?(@.SpellsAlwaysActive != null)]['SpellsAlwaysActive']","DEFAULT_PATH_LEAF_TO_NULL")]
[h:broadcast(lu.NewSpellsRaw)]
[h,foreach(spellGroup,lu.NewSpellsRaw): lu.NewSpells = json.merge(lu.NewSpells,spellGroup)]

[h:macro.return = json.set("","Abilities",lu.NewAbilities,"Buttons",lu.NewButtons,"Spells",lu.NewSpells)]