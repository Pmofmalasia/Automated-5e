[h:MonsterData = macro.args]
[h:MonsterData = pm.a5e.KeyStringsToNumbers(MonsterData)]
[h:ParentToken = json.get(MonsterData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:MonsterDisplayName = json.get(MonsterData,"DisplayName")]
[h:setName(MonsterDisplayName)]
[h:setProperty("a5e.stat.CreatureName",pm.RemoveSpecial(MonsterDisplayName))]
[h:setProperty("a5e.stat.CreatureType",json.get(MonsterData,"CreatureType"))]
[h:setProperty("a5e.stat.Race",json.get(MonsterData,"CreatureSubtype"))]
[h:setProperty("a5e.stat.Size",json.get(MonsterData,"Size"))]
[h:setSize(json.get(MonsterData,"Size"))]

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
		[h:"<!-- U2hpZWxk477685 is the ObjectID for the base shield -->"]
		[h:AddShieldData = json.set("",
			"ItemChoice","U2hpZWxk477685",
			"ParentToken",ParentToken,
			"NumberAdded",1
		)]
		[h,MACRO("AddItemProcessing@Lib:pm.a5e.Core"): AddShieldData]
	};{}]
}]

[h:tempHitDieObject = json.set("","1d6",0,"1d8",0,"1d10",0,"1d12",0)]
[h:HitDieNum = json.get(MonsterData,"HitDieNum")]
[h:setProperty("a5e.stat.MaxHitDice",json.set(tempHitDieObject,"1d"+json.get(MonsterData,"HitDieSize"),HitDieNum))]
[h:broadcast(HitDieNum)]
[h:broadcast(getProperty("a5e.stat.AtrMods"))]
[h:broadcast(json.get(getProperty("a5e.stat.AtrMods"),"Constitution"))]
[h:HPFromCon = HitDieNum * json.get(getProperty("a5e.stat.AtrMods"),"Constitution")]

[h:setProperty("a5e.stat.RolledMaxHP",json.get(MonsterData,"MaxHP") - HPFromCon)]
[h:setProperty("a5e.stat.HP",json.get(MonsterData,"MaxHP"))]

[h:setProperty("a5e.stat.BaseSpeed",json.get(MonsterData,"SpeedWalking"))]
[h:setProperty("a5e.stat.BaseBurrowSpeed",json.get(MonsterData,"SpeedBurrow"))]
[h:setProperty("a5e.stat.BaseClimbSpeed",json.get(MonsterData,"SpeedClimb"))]
[h:setProperty("a5e.stat.BaseFlySpeed",json.get(MonsterData,"SpeedFly"))]
[h:setProperty("a5e.stat.BaseSwimSpeed",json.get(MonsterData,"SpeedSwim"))]

[h:setProperty("a5e.stat.Proficiency",json.get(MonsterData,"Proficiency"))]

[h:"<-- TODO: Currently missing senses/vision, language (not in input either) -->"]
[h:MonsterTraitsFeature = ""]
[h:DamageModCommand = ""]

[h:AllVulnerabilityInstances = ""]
[h,if(json.contains(MonsterData,"IsVulnerability")),CODE:{
    [h:PhysicalVulnerability = ""]
    [h:MagicalVulnerability = ""]
    [h:AllVulnerability = ""]
    [h,foreach(tempType,pm.GetDamageTypes("Name","json")),CODE:{
        [h,switch(json.get(MonsterData,"Vulnerability"+tempType)):
            case 0: "";
            case 1: PhysicalVulnerability = listAppend(PhysicalVulnerability,"'"+tempType+"'");
            case 2: MagicalVulnerability = listAppend(MagicalVulnerability,"'"+tempType+"'");
            case 3: AllVulnerability = listAppend(AllVulnerability,"'"+tempType+"'")
        ]
    }]

    [h,if(PhysicalVulnerability!=""): AllVulnerabilityInstances = listAppend(AllVulnerabilityInstances,"json.set('','DamageTypes',json.append('',"+PhysicalVulnerability+"),'Physical',1)")]
    [h,if(MagicalVulnerability!=""): AllVulnerabilityInstances = listAppend(AllVulnerabilityInstances,"json.set('','DamageTypes',json.append('',"+MagicalVulnerability+"),'Magical',1)")]
    [h,if(AllVulnerability!=""): AllVulnerabilityInstances = listAppend(AllVulnerabilityInstances,"json.set('','DamageTypes',json.append('',"+AllVulnerability+"),'All',1)")]

    [h,if(!json.isEmpty(AllVulnerability)): DamageModCommand = DamageModCommand + "[h:mod.Vuln = json.merge(mod.Vuln,json.append('',"+AllVulnerabilityInstances+"))]"]
};{}]

[h:AllResistanceInstances = ""]
[h,if(json.contains(MonsterData,"IsResistance")),CODE:{
    [h:PhysicalResistance = ""]
    [h:MagicalResistance = ""]
    [h:AllResistance = ""]
    [h,foreach(tempType,pm.GetDamageTypes("Name","json")),CODE:{
        [h,switch(json.get(MonsterData,"Resistance"+tempType)):
            case 0: "";
            case 1: PhysicalResistance = listAppend(PhysicalResistance,"'"+tempType+"'");
            case 2: MagicalResistance = listAppend(MagicalResistance,"'"+tempType+"'");
            case 3: AllResistance = listAppend(AllResistance,"'"+tempType+"'")
        ]
    }]

    [h,if(PhysicalResistance!=""): AllResistanceInstances = listAppend(AllResistanceInstances,"json.set('','DamageTypes',json.append('',"+PhysicalResistance+"),'Physical',1)")]
    [h,if(MagicalResistance!=""): AllResistanceInstances = listAppend(AllResistanceInstances,"json.set('','DamageTypes',json.append('',"+MagicalResistance+"),'Magical',1)")]
    [h,if(AllResistance!=""): AllResistanceInstances = listAppend(AllResistanceInstances,"json.set('','DamageTypes',json.append('',"+AllResistance+"),'All',1)")]

    [h,if(!json.isEmpty(AllResistance)): DamageModCommand = DamageModCommand + "[h:mod.Res = json.merge(mod.Res,json.append('',"+AllResistanceInstances+"))]"]
};{}]

[h:AllImmunityInstances = ""]
[h,if(json.contains(MonsterData,"IsImmunity")),CODE:{
    [h:PhysicalImmunity = ""]
    [h:MagicalImmunity = ""]
    [h:AllImmunity = ""]
    [h,foreach(tempType,pm.GetDamageTypes("Name","json")),CODE:{
        [h,switch(json.get(MonsterData,"Immunity"+tempType)):
            case 0: "";
            case 1: PhysicalImmunity = listAppend(PhysicalImmunity,"'"+tempType+"'");
            case 2: MagicalImmunity = listAppend(MagicalImmunity,"'"+tempType+"'");
            case 3: AllImmunity = listAppend(AllImmunity,"'"+tempType+"'")
        ]
    }]

    [h,if(PhysicalImmunity!=""): AllImmunityInstances = listAppend(AllImmunityInstances,"json.set('','DamageTypes',json.append('',"+PhysicalImmunity+"),'Physical',1)")]
    [h,if(MagicalImmunity!=""): AllImmunityInstances = listAppend(AllImmunityInstances,"json.set('','DamageTypes',json.append('',"+MagicalImmunity+"),'Magical',1)")]
    [h,if(AllImmunity!=""): AllImmunityInstances = listAppend(AllImmunityInstances,"json.set('','DamageTypes',json.append('',"+AllImmunity+"),'All',1)")]

    [h,if(!json.isEmpty(AllImmunity)): DamageModCommand = DamageModCommand + "[h:mod.Immun = json.merge(mod.Immun,json.append('',"+AllImmunityInstances+"))]"]
};{}]

[h,if(DamageModCommand!=""): MonsterTraitsFeature = json.set(MonsterTraitsFeature,"CallDamageMod",DamageModCommand)]

[h,if(json.contains(MonsterData,"IsConditionImmun")),CODE:{
    [h:ConditionImmunityList = ""]
    [h,foreach(tempCondition,pm.a5e.GetBaseConditions("Name","json")),CODE:{
        [h,if(json.contains(MonsterData,tempCondition+"Immunity")): ConditionImmunityList = listAppend(ConditionImmunityList,"'"+tempCondition+"'")]
    }]
    
    [h,if(ConditionImmunityList != ""),CODE:{
        [h:ConditionImmunityFunctionCommand = "[h:ConditionImmunityInstances = json.append(ConditionImmunityInstances,json.set('','All',1,'Conditions',json.append('',"+ConditionImmunityList+")))]"]

        [h:MonsterTraitsFeature = json.set(MonsterTraitsFeature,"CallCondImmun",ConditionImmunityFunctionCommand)]
    };{}]
};{}]

[h:MonsterData = ct.a5e.LanguageOptionProcessing(MonsterData)]
[h,if(json.contains(MonsterData,"LanguageOptions")): MonsterTraitsFeature = json.set(MonsterTraitsFeature,"LanguageOptions",json.get(MonsterData,"LanguageOptions"))]
[h,if(json.contains(MonsterData,"Languages")): MonsterTraitsFeature = json.set(MonsterTraitsFeature,"Languages",json.get(MonsterData,"Languages"))]

[h:VisionData = ct.a5e.VisionProcessing(MonsterData)]
[h:MonsterData = json.get(VisionData,"Data")]
[h:MonsterTraitsFeature = json.set(MonsterTraitsFeature,"CallVision",json.get(VisionData,"Command"))]

[h,if(MonsterTraitsFeature != ""),CODE:{
    [h:MonsterTraitsFeature = json.set(MonsterTraitsFeature,
        "Name","MonsterTraits",
        "DisplayName","Monster Traits",
        "Class","Monster",
        "Subclass","",
        "Level",1,
        "Library","SRD",
        "IsDisplayed",1,
        "IsActive",1
    )]

    [h:setProperty("a5e.stat.AllFeatures",json.append("",MonsterTraitsFeature))]
};{}]

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
[h:closeDialog("Monster Creation")]
[h,MACRO("BaseSkillSelection@Lib:pm.a5e.Core"): json.set("","ParentToken",ParentToken)]