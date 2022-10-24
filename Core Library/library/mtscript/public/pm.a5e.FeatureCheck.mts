[h:d20Data = arg(1)]
[h:SkillOptions = json.get(d20Data,"Skill")]
[h:SkillAdvantage = json.get(d20Data,"Advantage")]
[h:SkillDisadvantage = json.get(d20Data,"Disadvantage")]
[h:SkillPreviousRoll = json.get(d20Data,"d20Rolls")]
[h:d20Type = json.get(d20Data,"Type")]
[h:SkillBonus = json.get(d20Data,"Bonus")]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:pm.AttributesList = pm.GetAttributes("Name","json")]

[h,if(IsTooltip),CODE:{
	[h,if(json.type(SkillOptions)=="UNKNOWN"),CODE:{
		[h:pm.a5e.CheckProperties(d20Data)]

		[h:pm.a5e.CheckBonusTotal(d20Data)]

		[h:checkTable = json.append("",json.set("",
			"ShowIfCondensed",1,
			"Header",CurrentSkillDisplay+" Check",
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
		"Type",d20Type,
		"Advantage",SkillAdvantage,
		"Disadvantage",SkillDisadvantage,
		"d20Rolls",SkillPreviousRoll,
		"ParentToken",ParentToken
	)]

	[h,MACRO("Check@Lib:pm.a5e.Core"): CheckData]
	[h:CheckReturnData = macro.return]
	
	[h:abilityTable = json.merge(abilityTable,json.get(CheckReturnData,"Table"))]
}]