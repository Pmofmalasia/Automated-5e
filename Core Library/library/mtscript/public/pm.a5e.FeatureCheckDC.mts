[h:pm.DCInfo = arg(1)]
[h:pm.ForcedCheckInfo = arg(2)]
[h:"<!-- Forced check needs to support multiple skill options target can make -->"]
[h:pm.CheckModifiers = arg(3)]
[h,if(argCount()>4): otherCheckOptions = arg(4); otherCheckOptions = "{}"]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:DCMethod = json.get(pm.DCInfo,"Method")]
[h,switch(DCMethod),CODE:
	case "Number":{
		[h:pm.DC = json.get(pm.DCInfo,"Base")]
		[h:pm.DCPrimeStat = ""]
		[h:pm.OriginSkillDisplay = ""]
	};
	case "Ability Score":{
		[h:pm.DCPrimeStat = json.get(pm.DCInfo,"AbilityScore")]
		[h:pm.DCbase = json.get(Attributes,pm.DCPrimeStat)]
		[h:pm.DC = pm.DCBase + (Proficiency * if(json.get(pm.DCInfo,"Proficiency")=="",0,json.get(pm.DCInfo,"Proficiency")))]
		[h:pm.OriginSkillDisplay = pm.GetDisplayName(pm.DCPrimeStat,"sb.Attributes")]
	};
	case "Skill Bonus":{
		[h:pm.DCBase = json.get(pm.DCInfo,"Base")]
		[h:pm.DCSkill = json.get(pm.DCInfo,"Skill")]
		[h:pm.DCSkillType = json.get(pm.DCInfo,"Type")]
		
		[h:pm.a5e.CheckBonusTotal(json.set("",
			"Skill",pm.DCSkill,
			"Type",pm.DCSkillType,
			"Bonus",json.get(pm.DCInfo,"Bonus")
		))]

		[h:pm.DC = 8 + TotalBonus]
		
		[h,switch(pm.DCSkillType):
			case "Ability Score": pm.OriginSkillDisplay = pm.GetDisplayName(pm.DCSkill,"sb.Attributes");
			case "Skill": pm.OriginSkillDisplay = pm.GetDisplayName(pm.DCSkill,"sb.Skills");
			case "Tool": pm.OriginSkillDisplay = pm.GetDisplayName(pm.DCSkill,"sb.Tools");
			case "Initiative": pm.OriginSkillDisplay = "Initiative"
		]
	};
	case "Contested":{
		[h:CheckInfo = pm.a5e.FeatureCheck(abilityInfo,pm.DCInfo)]
		[h:pm.DC = json.get(CheckInfo,"Value")]
	};
	default:{}
]

[h,if(json.type(pm.ForcedCheckInfo)=="OBJECT"),CODE:{
	[h:pm.ForcedCheckName = json.get(pm.ForcedCheckInfo,"Skill")]
	[h,switch(json.get(pm.ForcedCheckInfo,"Type")):
		case "Ability Score": pm.ForcedSkillDisplay = pm.GetDisplayName(pm.ForcedCheckName,"sb.Attributes");
		case "Skill": pm.ForcedSkillDisplay = pm.GetDisplayName(pm.ForcedCheckName,"sb.Skills");
		case "Tool": pm.ForcedSkillDisplay = pm.GetDisplayName(pm.ForcedCheckName,"sb.Tools");
		case "Initiative": pm.ForcedSkillDisplay = "Initiative"
	]
};{
	[h:pm.ForcedSkillDisplay = ""]
	[h,foreach(tempSkill,pm.ForcedCheckInfo),CODE:{
		[h:tempName = json.get(tempSkill,"Skill")]
		[h,switch(json.get(pm.ForcedCheckInfo,"Type")):
			case "Ability Score": pm.ForcedSkillDisplay = json.append(pm.ForcedSkillDisplay,pm.GetDisplayName(tempName,"sb.Attributes"));
			case "Skill": pm.ForcedSkillDisplay = json.append(pm.ForcedSkillDisplay,pm.GetDisplayName(tempName,"sb.Skills"));
			case "Tool": pm.ForcedSkillDisplay = json.append(pm.ForcedSkillDisplay,pm.GetDisplayName(tempName,"sb.Tools"));
			case "Initiative": pm.ForcedSkillDisplay = json.append(pm.ForcedSkillDisplay,"Initiative")
		]
	}]
	[h:pm.ForcedSkillDisplay = pm.a5e.CreateDisplayList(pm.ForcedSkillDisplay,"or")]
}]

[h:isDamageHalved = json.get(pm.CheckModifiers,"DamageHalved")]
[h:isDamageHalved = if(isDamageHalved == "",0,isDamageHalved)]
[h:TypesHalvedInclusive = json.get(pm.CheckModifiers,"TypesInclusive")]
[h:TypesHalvedExclusive = json.get(pm.CheckModifiers,"TypesExclusive")]
[h:conditionsResistedInclusive = json.get(pm.CheckModifiers,"ConditionsInclusive")]
[h:conditionsResistedExclusive = json.get(pm.CheckModifiers,"ConditionsExclusive")]

[h:"<!-- Temporary for future magic item/passive influence -->"]
[h:pm.DCFinal = pm.DC]

[h:"<!-- Need to decide between getting what is currently CheckType from its own arg still, or getting from arg(1) and setting during switch() (likely). Make arg(2) the type of check forced. -->"]
[h,if(DCMethod == "Contested"),CODE:{
	[h:abilityTable = json.get(CheckInfo,"Table")]
	[h,if(IsTooltip),CODE:{
		[h:tableLinetoEdit = json.get(abilityTable,0)]
		[h:tableLinetoEdit = json.set(tableLinetoEdit,
			"Header","Contested Check",
			"FullContents",pm.ForcedSkillDisplay,
			"RulesContents"," vs. "+json.get(tableLinetoEdit,"RulesContents"),
			"DisplayOrder","['Full','Rules','Roll']"
		)]
		[h:abilityTable = json.set(abilityTable,0,tableLinetoEdit)]
	};{}]
};{
	[h:abilityTable = json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header","Forced Check",
		"FalseHeader","",
		"FullContents",pm.ForcedSkillDisplay,
		"RulesContents"," vs. <b>DC <span style='font-size:1.5em'>"+pm.DCFinal+"</span></b>",
		"RollContents","",
		"DisplayOrder","['Full','Rules','Roll']"
	))]
}]

[h:CheckDataFinal = json.set("",
	"DC",pm.DCFinal,
	"CheckType",pm.ForcedCheckInfo,
	"DamageModifier",json.set("",
		"DamageHalved",isDamageHalved,
		"TypesInclusive",TypesHalvedInclusive,
		"TypesExclusive",TypesHalvedExclusive),
	"ConditionsResisted",json.set("",
		"Inclusive",conditionsResistedInclusive,
		"Exclusive",conditionsResistedExclusive)
)]

[h:macro.return = json.set("",
   "Table",abilityTable,
   "CheckDC",pm.DCFinal,
   "CheckType",pm.ForcedCheckInfo,
   "CheckData",CheckDataFinal
)]