[h:SkillOptions = json.get(arg(1),"Skill")]
[h:SkillAdvantage = json.get(arg(1),"Advantage")]
[h:SkillDisadvantage = json.get(arg(1),"Disadvantage")]
[h:SkillPreviousRoll = json.get(arg(1),"PreviousRoll")]
[h:SkillType = json.get(arg(1),"Type")]
[h:SkillBonus = json.get(arg(1),"Bonus")]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:pm.AttributesList = pm.GetAttributes("Name","json")]

[h,if(IsTooltip),CODE:{
	[h,if(json.type(SkillOptions)=="UNKNOWN"),CODE:{
		[h,switch(SkillType):
			case "Ability Score": skillDisplayName = pm.GetDisplayName(SkillOptions,"sb.Attributes");
			case "Skill": skillDisplayName = pm.GetDisplayName(SkillOptions,"sb.Skills");
			case "Tool": skillDisplayName = pm.GetDisplayName(SkillOptions,"sb.Tools");
			case "Initiative": skillDisplayName = "Initiative"
		]
		
		[h:pm.a5e.CheckBonusTotal(json.set("",
			"Skill",skillDisplayName,
			"Type",SkillType,
			"Bonus",SkillBonus
		))]

		[h:checkTable = json.append("",json.set("",
			"ShowIfCondensed",1,
			"Header",skillDisplayName+" Check",
			"FalseHeader","",
			"FullContents","",
			"RulesContents","<b>"+pm.PlusMinus(TotalBonus,1,0)+"</b> Total Bonus",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	};{
		[h:checkTable = json.append("",json.set("",
			"ShowIfCondensed",1,
			"Header","Check Options",
			"FalseHeader","",
			"FullContents","",
			"RulesContents",pm.a5e.CreateDisplayList(SkillOptions,"or"),
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	}]
	
	[h:abilityTable = json.merge(abilityTable,checkTable)]
};{
	[h,if(json.type(SkillOptions)=="UNKNOWN"),CODE:{
		[h:SkillSelection = SkillOptions]
	};{
		[h:abort(input(" SkillSelection | "+SkillOptions+" | Choose a Skill | RADIO | DELIMITER=JSON VALUE=STRING "))]
		[h:SkillSelection = pm.RemoveSpecial(SkillSelection)]
	}]

	[h:CheckData = json.set("",
		"Skill",SkillSelection,
		"Type",SkillType,
		"Advantage",SkillAdvantage,
		"Disadvantage",SkillDisadvantage,
		"PreviousRoll",SkillPreviousRoll,
		"ParentToken",ParentToken
	)]

	[h,MACRO("Check@Lib:pm.a5e.Core"): CheckData]
	[h:CheckReturnData = macro.return]
	
	[h:abilityTable = json.merge(abilityTable,json.get(CheckReturnData,"Table"))]
}]