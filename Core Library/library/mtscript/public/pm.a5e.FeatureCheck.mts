[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:IsTooltip=json.get(arg(0),"Tooltip")]
[h:ParentToken = json.get(arg(0),"ParentToken")]
[h:switchToken(ParentToken)]

[h:SkillOptions = json.get(arg(1),"Skill")]
[h:SkillType = "Skill"]
[h:SkillAdvantage = json.get(arg(1),"Advantage")]
[h:SkillPreviousRoll = json.get(arg(1),"PreviousRoll")]

[h,if(IsTooltip),CODE:{
	[h,if(json.type(SkillOptions)=="UNKNOWN"),CODE:{
		[h:abilityTable = json.append("",json.set("",
			"ShowIfCondensed",1,
			"Header",pm.GetDisplayName(SkillOptions,"sb.Skills")+" Check",
			"FalseHeader","",
			"FullContents","",
			"RulesContents","",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	};{
		[h:abilityTable = json.append("",json.set("",
			"ShowIfCondensed",1,
			"Header","Check Options",
			"FalseHeader","",
			"FullContents","",
			"RulesContents",json.toList(SkillOptions,", "),
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	}]
	
	[h:macro.return = json.set("","Table",abilityTable)]
};{
	[h,if(json.type(SkillOptions)=="UNKNOWN"),CODE:{
		[h:SkillSelection = SkillOptions]
	};{
		[h:abort(input(" SkillSelection | "+SkillOptions+" | Choose a Skill | LIST | DELIMITER=JSON VALUE=STRING "))]
		[h:SkillSelection = pm.RemoveSpecial(SkillSelection)]
	}]

	[h:CheckData = json.set("",
		"Skill",SkillSelection,
		"Type",SkillType,
		"Advantage",SkillAdvantage,
		"PreviousRoll",SkillPreviousRoll,
		"ParentToken",ParentToken
	)]

	[h,MACRO("Check@Lib:pm.a5e.Core"): CheckData]
	[h:CheckReturnData = macro.return]
	
	[h:macro.return = CheckReturnData]
}]