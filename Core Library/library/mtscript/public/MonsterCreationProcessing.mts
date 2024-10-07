[h:MonsterData = macro.args]
[h:MonsterData = pm.a5e.KeyStringsToNumbers(MonsterData)]
[h:ParentToken = json.get(MonsterData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:MonsterDisplayName = json.get(MonsterData,"DisplayName")]
[h:MonsterName = pm.RemoveSpecial(MonsterDisplayName)]
[h:MonsterLibrary = json.get(MonsterData,"Library")]
[h:setName(MonsterDisplayName)]
[h:setProperty("a5e.stat.CreatureName",MonsterName)]
[h:setProperty("a5e.stat.CreatureType",json.get(MonsterData,"CreatureType"))]
[h:setProperty("a5e.stat.Race",json.get(MonsterData,"CreatureSubtype"))]
[h:setProperty("a5e.stat.Size",json.get(MonsterData,"Size"))]
[h:setSize(json.get(MonsterData,"Size"))]

[h:MonsterTraitsFeature = json.set("",
	"Name",MonsterName+"MonsterTraits",
	"DisplayName",MonsterDisplayName+" Monster Traits",
	"Class","Monster",
	"Subclass",MonsterName,
	"Level",1,
	"Library",MonsterLibrary,
	"IsDisplayed",1,
	"IsActive",1
)]

[h,switch(json.get(MonsterData,"Alignment")),CODE:
	case "Lawful Good":{
		[h:alignmentOrder = "Lawful"]
		[h:alignmentMorality = "Good"]
	};
	case "Lawful Neutral":{
		[h:alignmentOrder = "Lawful"]
		[h:alignmentMorality = "Neutral"]
	};
	case "Lawful Evil":{
		[h:alignmentOrder = "Lawful"]
		[h:alignmentMorality = "Evil"]
	};
	case "Neutral Good":{
		[h:alignmentOrder = "Neutral"]
		[h:alignmentMorality = "Good"]
	};
	case "True Neutral":{
		[h:alignmentOrder = "Neutral"]
		[h:alignmentMorality = "Neutral"]
	};
	case "Neutral Evil":{
		[h:alignmentOrder = "Neutral"]
		[h:alignmentMorality = "Evil"]
	};
	case "Chaotic Good":{
		[h:alignmentOrder = "Chaotic"]
		[h:alignmentMorality = "Good"]
	};
	case "Chaotic Neutral":{
		[h:alignmentOrder = "Chaotic"]
		[h:alignmentMorality = "Neutral"]
	};
	case "Chaotic Evil":{
		[h:alignmentOrder = "Chaotic"]
		[h:alignmentMorality = "Evil"]
	};
	case "Unaligned":{
		[h:alignmentOrder = "Unaligned"]
		[h:alignmentMorality = "Unaligned"]
	}
]

[h:setProperty("a5e.stat.Alignment",json.set("","Order",alignmentOrder,"Morality",alignmentMorality))]

[h:AttributeList = pm.GetAttributes()]
[h,foreach(TempAttribute,AttributeList): setProperty("a5e.stat.BaseAttributes",json.set(getProperty("a5e.stat.BaseAttributes"),json.get(TempAttribute,"Name"),json.get(MonsterData,"Attribute"+json.get(TempAttribute,"Name"))))]

[h,if(json.contains(MonsterData,"isNaturalArmor")),CODE:{
	[h:"<!-- Note: DMG pg 276 states that a monster's natural armor bonus 10 + DEX + natural armor bonus. -->"]
	[h:NewNaturalArmor = json.set(getProperty("a5e.stat.NaturalArmor"),
		"BaseAC",json.get(MonsterData,"AC") - floor((json.get(MonsterData,"AttributeDexterity") - 10)/2)
	)]
	[h:setProperty("a5e.stat.NaturalArmor",NewNaturalArmor)]
};{
	[h,if(json.get(MonsterData,"ArmorChoice") != ""),CODE:{
		[h:AddArmorData = json.set("",
			"ItemChoice",json.get(MonsterData,"ArmorChoice"),
			"ParentToken",ParentToken,
			"NumberAdded",1
		)]
		[h,MACRO("AddItemProcessing@Lib:pm.a5e.Core"): AddArmorData]
	};{}]

	[h,if(json.contains(MonsterData,"isShield")),CODE:{
		[h:"<!-- Hardcoded: U2hpZWxk477685 is the ObjectID for the base shield -->"]
		[h:AddShieldData = json.set("",
			"ItemChoice","U2hpZWxk477685",
			"ParentToken",ParentToken,
			"NumberAdded",1
		)]
		[h,MACRO("AddItemProcessing@Lib:pm.a5e.Core"): AddShieldData]
	};{}]
}]

[h:HitDieNum = json.get(MonsterData,"HitDieNum")]
[h:setProperty("a5e.stat.MaxHitDice",json.set("",json.get(MonsterData,"HitDieSize"),HitDieNum))]
[h:setProperty("a5e.stat.HitDice",getProperty("a5e.stat.MaxHitDice"))]
[h:HPFromCon = HitDieNum * json.get(getProperty("a5e.stat.AtrMods"),"Constitution")]

[h:setProperty("a5e.stat.RolledMaxHP",json.get(MonsterData,"MaxHP") - HPFromCon)]
[h:setProperty("a5e.stat.HP",json.get(MonsterData,"MaxHP"))]

[h:SpeedTypeArray = json.append("","","Burrow","Climb","Fly","Swim")]
[h:SpeedBonuses = ""]
[h:allSpeedsArray = ""]
[h,foreach(speedType,SpeedTypeArray),CODE:{
	[h:thisSpeedBonus = json.get(MonsterData,"Speed"+speedType)]
	[h,if(thisSpeedBonus != 0): SpeedBonuses = json.set(SpeedBonuses,if(speedType == "","Speed",speedType),json.set("","Base",thisSpeedBonus))]
	[h:allSpeedsArray = json.append(allSpeedsArray,thisSpeedBonus)]
}]

[h:allSameSpeed = json.length(json.unique(allSpeedsArray)) == 1]
[h,if(allSameSpeed): SpeedBonuses = json.set("","All",json.set("","Base",json.get(allSpeedsArray,0)))]
[h,if(json.contains(MonsterData,"isHover")): SpeedBonuses = json.set(SpeedBonuses,"Fly",json.set(json.get(SpeedBonuses,"Fly"),"Hover",1))]

[h:MonsterTraitsFeature = json.set(MonsterTraitsFeature,"CallSpeed",SpeedBonuses)]

[h:setProperty("a5e.stat.Proficiency",json.get(MonsterData,"Proficiency"))]

[h:DamageModCommand = ""]
[h:DamageModData = "{}"]

[h:AllVulnerabilityInstances = ""]
[h,if(json.contains(MonsterData,"IsVulnerability")),CODE:{
	[h:PhysicalVulnerability = ""]
	[h:MagicalVulnerability = ""]
	[h:AllVulnerability = ""]
	[h,foreach(tempType,pm.GetDamageTypes("Name","json")),CODE:{
		[h,switch(json.get(MonsterData,"Vulnerability"+tempType)):
			case 0: "";
			case 1: PhysicalVulnerability = json.append(PhysicalVulnerability,tempType);
			case 2: MagicalVulnerability = json.append(MagicalVulnerability,tempType);
			case 3: AllVulnerability = json.append(AllVulnerability,tempType)
		]
	}]

	[h,if(PhysicalVulnerability!=""): AllVulnerabilityInstances = json.append(AllVulnerabilityInstances,json.set("","DamageTypes",PhysicalVulnerability,"Prereqs",json.set("","General",json.set("","Physical",1))))]
	[h,if(MagicalVulnerability!=""): AllVulnerabilityInstances = json.append(AllVulnerabilityInstances,json.set("","DamageTypes",MagicalVulnerability,"Prereqs",json.set("","General",json.set("","Magical",1))))]
	[h,if(AllVulnerability!=""): AllVulnerabilityInstances = json.append(AllVulnerabilityInstances,json.set("","DamageTypes",AllVulnerability))]

	[h,if(!json.isEmpty(AllVulnerabilityInstances)): DamageModData = json.set(DamageModData,"Vulnerability",AllVulnerabilityInstances)]
};{}]

[h:AllResistanceInstances = ""]
[h,if(json.contains(MonsterData,"IsResistance")),CODE:{
	[h:PhysicalResistance = ""]
	[h:MagicalResistance = ""]
	[h:AllResistance = ""]
	[h,foreach(tempType,pm.GetDamageTypes("Name","json")),CODE:{
		[h,switch(json.get(MonsterData,"Resistance"+tempType)):
			case 0: "";
			case 1: PhysicalResistance = json.append(PhysicalResistance,tempType);
			case 2: MagicalResistance = json.append(MagicalResistance,tempType);
			case 3: AllResistance = json.append(AllResistance,tempType)
		]
	}]

	[h,if(PhysicalResistance!=""): AllResistanceInstances = json.append(AllResistanceInstances,json.set("","DamageTypes",PhysicalResistance,"Prereqs",json.set("","General",json.set("","Physical",1))))]
	[h,if(MagicalResistance!=""): AllResistanceInstances = json.append(AllResistanceInstances,json.set("","DamageTypes",MagicalResistance,"Prereqs",json.set("","General",json.set("","Magical",1))))]
	[h,if(AllResistance!=""): AllResistanceInstances = json.append(AllResistanceInstances,json.set("","DamageTypes",AllResistance))]

	[h,if(!json.isEmpty(AllResistanceInstances)): DamageModData = json.set(DamageModData,"Resistance",AllResistanceInstances)]
};{}]

[h:AllImmunityInstances = ""]
[h,if(json.contains(MonsterData,"IsImmunity")),CODE:{
	[h:PhysicalImmunity = ""]
	[h:MagicalImmunity = ""]
	[h:AllImmunity = ""]
	[h,foreach(tempType,pm.GetDamageTypes("Name","json")),CODE:{
		[h,switch(json.get(MonsterData,"Immunity"+tempType)):
			case 0: "";
			case 1: PhysicalImmunity = json.append(PhysicalImmunity,tempType);
			case 2: MagicalImmunity = json.append(MagicalImmunity,tempType);
			case 3: AllImmunity = json.append(AllImmunity,tempType)
		]
	}]

	[h,if(PhysicalImmunity!=""): AllImmunityInstances = json.append(AllImmunityInstances,json.set("","DamageTypes",PhysicalImmunity,"Prereqs",json.set("","General",json.set("","Physical",1))))]
	[h,if(MagicalImmunity!=""): AllImmunityInstances = json.append(AllImmunityInstances,json.set("","DamageTypes",MagicalImmunity,"Prereqs",json.set("","General",json.set("","Magical",1))))]
	[h,if(AllImmunity!=""): AllImmunityInstances = json.append(AllImmunityInstances,json.set("","DamageTypes",AllImmunity))]

	[h,if(!json.isEmpty(AllImmunityInstances)): DamageModData = json.set(DamageModData,"Immunity",AllImmunityInstances)]
};{}]

[h:AllAbsorbInstances = ""]
[h,if(json.contains(MonsterData,"IsAbsorb")),CODE:{
	[h:PhysicalAbsorb = ""]
	[h:MagicalAbsorb = ""]
	[h:AllAbsorb = ""]
	[h,foreach(tempType,pm.GetDamageTypes("Name","json")),CODE:{
		[h,switch(json.get(MonsterData,"Absorb"+tempType)):
			case 0: "";
			case 1: PhysicalAbsorb = json.append(PhysicalAbsorb,tempType);
			case 2: MagicalAbsorb = json.append(MagicalAbsorb,tempType);
			case 3: AllAbsorb = json.append(AllAbsorb,tempType)
		]
	}]

	[h,if(PhysicalAbsorb!=""): AllAbsorbInstances = json.append(AllAbsorbInstances,json.set("","DamageTypes",PhysicalAbsorb,"Prereqs",json.set("","General",json.set("","Physical",1))))]
	[h,if(MagicalAbsorb!=""): AllAbsorbInstances = json.append(AllAbsorbInstances,json.set("","DamageTypes",MagicalAbsorb,"Prereqs",json.set("","General",json.set("","Magical",1))))]
	[h,if(AllAbsorb!=""): AllAbsorbInstances = json.append(AllAbsorbInstances,json.set("","DamageTypes",AllAbsorb))]

	[h,if(!json.isEmpty(AllAbsorbInstances)): DamageModData = json.set(DamageModData,"Absorb",AllAbsorbInstances)]
};{}]

[h,if(!json.isEmpty(DamageModData)): MonsterTraitsFeature = json.set(MonsterTraitsFeature,"CallDamageMod",DamageModData)]

[h:ConditionImmunityList = ""]
[h,foreach(tempCondition,pm.a5e.GetBaseConditions("Name","json")),CODE:{
	[h,if(json.contains(MonsterData,"ConditionImmunity"+tempCondition)): ConditionImmunityList = json.append(ConditionImmunityList,tempCondition)]
}]
[h,if(ConditionImmunityList != ""): MonsterTraitsFeature = json.set(MonsterTraitsFeature,"CallCondImmun",json.append("",json.set("","Conditions",ConditionImmunityList)))]

[h:MonsterData = ct.a5e.LimbsProcessing(MonsterData)]

[h:MonsterData = ct.a5e.LanguageOptionProcessing(MonsterData)]
[h,if(json.contains(MonsterData,"LanguageOptions")): MonsterTraitsFeature = json.set(MonsterTraitsFeature,"LanguageOptions",json.get(MonsterData,"LanguageOptions"))]
[h,if(json.contains(MonsterData,"Languages")): MonsterTraitsFeature = json.set(MonsterTraitsFeature,"Languages",json.get(MonsterData,"Languages"))]
[h,if(json.contains(MonsterData,"LanguageOptions") || json.contains(MonsterData,"Languages")): MonsterTraitsFeature = json.set(MonsterTraitsFeature,"CallLanguages",1)]

[h:MonsterData = ct.a5e.VisionProcessing(MonsterData)]
[h:MonsterTraitsFeature = json.set(MonsterTraitsFeature,"CallVision",json.get(MonsterData,"CallVision"))]

[h:setProperty("a5e.stat.AllFeatures",json.append("",MonsterTraitsFeature))]

[h:MonsterCR = json.get(MonsterData,"CR")]
[h,if(!isNumber(MonsterCR)): MonsterCR = eval(MonsterCR)]
[h:setProperty("a5e.stat.CR",MonsterCR)]
[h:setProperty("a5e.stat.XP",json.get(MonsterData,"XP"))]

[h:setProperty("a5e.stat.Allegiance",json.get(MonsterData,"Allegiance"))]
[h,switch(json.get(MonsterData,"Allegiance")):
	case "Enemy": setProperty("a5e.stat.WhichTeam",2);
	case "Ally": setProperty("a5e.stat.WhichTeam",1);
	default: setProperty("a5e.stat.WhichTeam",0)
]

[h:MonsterEnvironments = "[]"]
[h:allEnvironments = pm.a5e.GetCoreData("sb.Environments","Name","json")]
[h,foreach(environment,allEnvironments),if(json.contains(MonsterData,"isEnvironment"+environment)): MonsterEnvironments = json.append(MonsterEnvironments,environment)]
[h:setProperty("a5e.stat.Environments",MonsterEnvironments)]

[h:closeDialog("Monster Creation")]
[h,MACRO("BaseSkillSelection@Lib:pm.a5e.Core"): json.set("","ParentToken",ParentToken)]