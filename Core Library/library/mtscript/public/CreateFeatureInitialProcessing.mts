[h:featureInputData = macro.args]
[h:FeatureType = json.get(featureInputData,"FeatureType")]
[h:featureInputData = pm.a5e.KeyStringsToNumbers(featureInputData)]

[h:FeatureDisplayName = pm.EvilChars(json.get(featureInputData,"DisplayName"))]
[h:FeatureName = pm.RemoveSpecial(FeatureDisplayName)]
[h:FeatureClass = json.get(featureInputData,"FeatureClass")]
[h:FeatureSubclass = json.get(featureInputData,"FeatureSubclass")]
[h:FeatureLib = json.get(featureInputData,"Sourcebook")]

[h:newFeatureData = json.set("",
	"DisplayName",FeatureDisplayName,
	"Name",FeatureName,
	"Class",FeatureClass,
	"Subclass",FeatureSubclass,
	"Type",FeatureType,
	"Library",FeatureLib
)]

[h,if(json.get(featureInputData,"Level") != ""),CODE:{
	[h:newFeatureData = json.set(newFeatureData,
		"Level",json.get(featureInputData,"Level"),
		"GainOnLevel",1
	)]
};{
	[h:newFeatureData = json.set(newFeatureData,"Level",0)]
}]

[h:newFeatureData = json.set(newFeatureData,"Optional",json.contains(featureInputData,"isOptional"))]
[h:newFeatureData = json.set(newFeatureData,"isMultifeature",json.contains(featureInputData,"isMultifeature"))]

[h,if(json.contains(featureInputData,"hasMaster")),CODE:{
	[h:MasterFeatureData = ct.a5e.AutocompletedFeatureProcessing(featureInputData,"Main")]
	[h:newFeatureData = json.set(newFeatureData,"Master",json.get(MasterFeatureData,"Feature"))]
};{}]

[h,if(FeatureType == "Condition"),CODE:{
	[h:"<!-- TODO: Currently can't make non-general monster conditions since monsters won't pop up in the autocomplete -->"]
	[h:AssociatedFeatureData = ct.a5e.AutocompletedFeatureProcessing(featureInputData,"ConditionAssociatedFeature")]
	[h:AssociatedFeature = json.get(AssociatedFeatureData,"Feature")]
	[h,switch(json.get(AssociatedFeature,"Class")):
		case "Spell": finalAssociatedFeature = json.set("","Class","Spell","Subclass",json.get(AssociatedFeature,"Name"));
		case "Background": finalAssociatedFeature = json.set("","Class","Background","Subclass",json.get(AssociatedFeature,"Name"));
		default: finalAssociatedFeature = json.set("","Class",json.get(AssociatedFeature,"Class"),"Subclass",json.get(AssociatedFeature,"Subclass"))
	]
	[h:newFeatureData = json.merge(newFeatureData,finalAssociatedFeature)]

	[h,if(json.get(featureInputData,"ConditionCountsAs") != ""): newFeatureData = json.set(newFeatureData,"CountsAs",json.get(featureInputData,"ConditionCountsAs"))]
};{}]

[h,if(json.contains(featureInputData,"isReplaceFeature")),CODE:{
	[h:ReplaceFeatureData = ct.a5e.AutocompletedFeatureProcessing(featureInputData,"Replace")]
	[h:newFeatureData = json.set(newFeatureData,"Replace",json.get(ReplaceFeatureData,"Feature"))]
};{}]

[h:featurePrerequisites = "{}"]
[h,if(json.contains(featureInputData,"isFeaturePrereqs")),CODE:{
	[h,if(json.get(featureInputData,"ClassLevelFeaturePrereq") != ""),CODE:{
		[h:featurePrerequisites = json.set(featurePrerequisites,
			"ClassLevel",json.set("",
				"Class",FeatureClass,
				"Level",json.get(featureInputData,"ClassLevelFeaturePrereq"))
		)]
	};{}]
	
	[h,if(json.get(featureInputData,"TotalLevelFeaturePrereq") != ""): featurePrerequisites = json.set(featurePrerequisites,"Level",json.get(featureInputData,"TotalLevelFeaturePrereq"))]
	
	[h,if(json.contains(featureInputData,"isAttributeFeaturePrereq")),CODE:{
		[h:allAttributes = pm.GetAttributes("Name","json")]
		[h:allAttributeOptions = "{}"]
		[h:attributeMinimum = json.get(featureInputData,"AttributeFeaturePrereqAmount")]
		[h,foreach(attribute,allAttributes),if(json.contains(featureInputData,"AttributeFeaturePrereq"+attribute)): allAttributeOptions = json.set(allAttributeOptions,attribute,attributeMinimum)]
		[h,if(json.get(featureInputData,"AttributeFeaturePrereqAllOrOne") == "All"): 
			numberRequired = json.length(json.fields(allAttributeOptions));
			numberRequired = 1
		]
		[h:allAttributeOptions = json.set(allAttributeOptions,"AllOrOne",numberRequired)]
	
		[h:featurePrerequisites = json.set(featurePrerequisites,"Attributes",allAttributeOptions)]
	};{}]
	
	[h,if(json.get(featureInputData,"isClassFeaturePrereq") != ""),CODE:{
		[h:allClasses = pm.GetClasses("Name","json")]
		[h:selectedClasses = "[]"]
		[h,foreach(tempClass,allClasses),if(json.contains(featureInputData,"ClassFeaturePrereq"+tempClass)): selectedClasses = json.append(selectedClasses,tempClass)]
		[h:featurePrerequisites = json.set(featurePrerequisites,if(json.get(featureInputData,"isClassFeaturePrereq") == "Include","Class","ExcludeClass"),selectedClasses)]
	};{}]
	
	[h,if(json.get(featureInputData,"isSubclassFeaturePrereq") != ""),CODE:{
		[h:allSubclasses = pm.a5e.GetCoreData("sb.Subclasses","Name","json")]
		[h:selectedSubclasses = "[]"]
		[h,foreach(tempSubclass,allSubclasses),if(json.contains(featureInputData,"SubclassFeaturePrereq"+tempSubclass)): selectedSubclasses = json.append(selectedSubclasses,tempSubclass)]
		[h:featurePrerequisites = json.set(featurePrerequisites,if(json.get(featureInputData,"isSubclassFeaturePrereq") == "Include","Subclass","ExcludeSubclass"),selectedSubclasses)]
	};{}]
	
	[h,if(json.get(featureInputData,"isRaceFeaturePrereq") != ""),CODE:{
		[h:allRaces = pm.GetRaces("Name","json")]
		[h:selectedRaces = "[]"]
		[h,foreach(tempRace,allRaces),if(json.contains(featureInputData,"RaceFeaturePrereq"+tempRace)): selectedRaces = json.append(selectedRaces,tempRace)]
		[h:featurePrerequisites = json.set(featurePrerequisites,if(json.get(featureInputData,"isRaceFeaturePrereq") == "Include","Race","ExcludeRace"),selectedRaces)]
	};{}]
	
	[h,if(json.get(featureInputData,"isSubraceFeaturePrereq") != ""),CODE:{
		[h:allSubraces = pm.a5e.GetCoreData("sb.Subraces","Name","json")]
		[h:selectedSubraces = "[]"]
		[h,foreach(tempSubrace,allSubraces),if(json.contains(featureInputData,"SubraceFeaturePrereq"+tempSubrace)): selectedSubraces = json.append(selectedSubraces,tempSubrace)]
		[h:featurePrerequisites = json.set(featurePrerequisites,if(json.get(featureInputData,"isSubraceFeaturePrereq") == "Include","Subrace","ExcludeSubrace"),selectedSubraces)]
	};{}]
	
	[h,if(json.contains(featureInputData,"isFeatureFeaturePrereq")),CODE:{
		[h:FeaturePrereqData = ct.a5e.AutocompletedFeatureProcessing(featureInputData,"FeatureFeaturePrereq")]
		[h:featurePrerequisites = json.set(featurePrerequisites,"Feature",json.get(FeaturePrereqData,"Feature"))]
	};{}]
	
	[h,switch(json.get(featureInputData,"isWeaponProficiencyFeaturePrereq")),CODE:
		case "Class":{
			[h:allWeaponClasses = json.append("","Simple","Martial","Exotic","Improvised")]
			[h:selectedWeaponClasses = "[]"]
			[h,foreach(tempWeaponClass,allWeaponClasses),if(json.contains(featureInputData,"WeaponClassFeaturePrereq"+tempWeaponClass)): selectedWeaponClasses = json.append(selectedWeaponClasses,tempWeaponClass)]
			[h:featurePrerequisites = json.set(featurePrerequisites,
				"WeaponProficiency",json.set("",
					"Class",selectedWeaponClasses,
					"AllorOne",json.get(featureInputData,"WeaponProficiencyFeaturePrereqAllOrOne"))
			)]
		};
		case "Specific":{
			[h:allWeaponTypes = pm.a5e.GetCoreData("sb.WeaponTypes","Name","json")]
			[h:selectedWeaponTypes = "[]"]
			[h,foreach(tempWeaponClass,allWeaponTypes),if(json.contains(featureInputData,"WeaponClassFeaturePrereq"+tempWeaponClass)): selectedWeaponTypes = json.append(selectedWeaponTypes,tempWeaponClass)]
			[h:featurePrerequisites = json.set(featurePrerequisites,
				"WeaponProficiency",json.set("",
					"Type",selectedWeaponTypes,
					"AllorOne",json.get(featureInputData,"WeaponProficiencyFeaturePrereqAllOrOne"))
			)]
		};
		default:{}
	]
	
	[h,switch(json.get(featureInputData,"isArmorProficiencyFeaturePrereq")),CODE:
		case "Class":{
			[h:allArmorClasses = json.append("","Light","Medium","Heavy")]
			[h:selectedArmorClasses = "[]"]
			[h,foreach(tempArmorClass,allArmorClasses),if(json.contains(featureInputData,"ArmorClassFeaturePrereq"+tempArmorClass)): selectedArmorClasses = json.append(selectedArmorClasses,tempArmorClass)]
			[h:featurePrerequisites = json.set(featurePrerequisites,
				"ArmorProficiency",json.set("",
					"Class",selectedArmorClasses,
					"AllorOne",json.get(featureInputData,"ArmorProficiencyFeaturePrereqAllOrOne"))
			)]
		};
		case "Specific":{
			[h:allArmorTypes = pm.a5e.GetCoreData("sb.ArmorTypes","Name","json")]
			[h:selectedArmorTypes = "[]"]
			[h,foreach(tempArmorClass,allArmorTypes),if(json.contains(featureInputData,"ArmorClassFeaturePrereq"+tempArmorClass)): selectedArmorTypes = json.append(selectedArmorTypes,tempArmorClass)]
			[h:featurePrerequisites = json.set(featurePrerequisites,
				"ArmorProficiency",json.set("",
					"Type",selectedArmorTypes,
					"AllorOne",json.get(featureInputData,"ArmorProficiencyFeaturePrereqAllOrOne"))
			)]
		};
		default:{}
	]
	
	[h,if(json.contains(featureInputData,"isSkillProficiencyFeaturePrereq")),CODE:{
		[h:requriesExpertise = json.contains(featureInputData,"SkillProficiencyFeaturePrereqExpertise")]
	
		[h:allSkillOptions = "{}"]
		[h:allSkills = pm.GetSkills("Name","json")]
		[h,foreach(skill,allSkills),if(json.contains(featureInputData,"SaveProficiencyFeaturePrereq"+skill)): allSkillOptions = json.set(allSkillOptions,skill,(1 + requriesExpertise))]
	
		[h:allTools = pm.GetTools("Name","json")]
		[h,foreach(skill,allTools),if(json.contains(featureInputData,"SaveProficiencyFeaturePrereq"+skill)): allSkillOptions = json.set(allSkillOptions,skill,(1 + requriesExpertise))]
	
		[h:allToolTypes = pm.GetToolTypes("Name","json")]
		[h,foreach(skill,allToolTypes),if(json.contains(featureInputData,"SaveProficiencyFeaturePrereq"+skill)): allSkillOptions = json.set(allSkillOptions,skill,(1 + requriesExpertise))]
	
		[h:featurePrerequisites = json.set(featurePrerequisites,"SkillProficiency",allSkillOptions)]
	};{}]
	
	[h,if(json.contains(featureInputData,"isSaveProficiencyFeaturePrereq")),CODE:{
		[h:allAttributes = pm.GetAttributes("Name","json")]
		[h:allSaveOptions = "[]"]
		[h,foreach(attribute,allAttributes),if(json.contains(featureInputData,"SaveProficiencyFeaturePrereq"+attribute)): allSaveOptions = json.append(allSaveOptions,attribute)]
		[h:featurePrerequisites = json.set(featurePrerequisites,"SaveProficiency",allSaveOptions)]
	};{}]
	
	[h,switch(json.get(featureInputData,"isSpellFeaturePrereq")),CODE:
		case "Specific":{
			[h:SpellPrereqData = ct.a5e.AutocompletedFeatureProcessing(featureInputData,"FeaturePrereqSpecific",json.set("","Type","Spell"))]
			[h:chosenSpellName = json.get(json.get(SpellPrereqData,"Feature"),"Name")]
			[h:featurePrerequisites = json.set(featurePrerequisites,"SpecificSpell",json.append("",chosenSpellName))]
		};
		case "Any":{
			[h:featurePrerequisites = json.set(featurePrerequisites,"Spellcasting","Any")]
		};
		default:{}
	]
	
	[h,if(!json.isEmpty(featurePrerequisites)): newFeatureData = json.set(newFeatureData,"Prereqs",featurePrerequisites)]
};{}]

[h:Description = base64.encode(pm.EvilChars(json.get(featureInputData,"Description")))]
[h:AbridgedDescription = base64.encode(pm.EvilChars(json.get(featureInputData,"AbridgedDescription")))]

[h:newFeatureData = json.set(newFeatureData,"Description",Description,"AbridgedDescription",AbridgedDescription)]

[h:closeDialog("CreateFeatureInitial")]