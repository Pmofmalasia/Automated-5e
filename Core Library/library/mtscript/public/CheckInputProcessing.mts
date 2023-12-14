[h:CheckInputData = macro.args]
[h:CheckInputData = pm.a5e.KeyStringsToNumbers(CheckInputData)]
[h:ParentToken = json.get(CheckInputData,"ParentToken")]
[h:Flavor = json.get(CheckInputData,"Flavor")]
[h:switchToken(ParentToken)]

[h:EffectIDChoice = json.get(CheckInputData,"EffectIDChoice")]
[h,if(EffectIDChoice == ""),CODE:{
	[h:OutputOptions = json.get(CheckInputData,"OutputOptions")]
	[h:SkillChoice = json.get(CheckInputData,"SkillChoice")]
	[h:AlternateAttribute = json.get(CheckInputData,"AlternateAttribute")]
	[h:SituationalBonus = json.get(CheckInputData,"SituationalBonus")]
	[h:AdvantageChoice = json.get(CheckInputData,"AdvantageChoice")]
	[h:CheckDescription = json.get(CheckInputData,"CheckDescription")]

	[h,switch(OutputOptions),CODE:
		case 0:{[h:outputTargets = "not-gm"][h:linkPermissions = "gm-self"]};
		case 1:{[h:outputTargets = "self"][h:linkPermissions = "gm-self"]};
		case 2:{[h:outputTargets = "none"][h:linkPermissions = "gm"]}
	]

	[h,if(SkillChoice==""),CODE:{
		[h:ch.Choice = "No Skill Selected"]
		[h:ch.Type = ""]
		[h:AlternateAttribute = "None"]
	};{
		[h:CheckChoiceData = base64.decode(SkillChoice)]
		[h:ch.Choice = json.get(CheckChoiceData,"Name")]
		[h:ch.Type = json.get(CheckChoiceData,"Type")]
	}]
	
	[h:"<!-- Note: If changes are made to outputTargets, a new method may need to be used to determine if it is GM only or not. Also may need a different method anyway for passive skills. -->"]
	[h:ClassFeatureData = json.set("",
		"Flavor",if(CheckDescription=="",Flavor,CheckDescription),
		"ParentToken",ParentToken,
		"needsSplitGMOutput",(getProperty("a5e.stat.Allegiance") == "Enemy"),
		"Class","zzChecksAndSaves",
		"Name","Skill Check",
		"FalseName","",
		"OnlyRules",0
	)]

	[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
	[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
	[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]
	
	[h:CheckData = json.set("",
		"Skill",ch.Choice,
		"Type",ch.Type,
		"ParentToken",ParentToken,
		"Alternate",AlternateAttribute,
		"Bonus",SituationalBonus,
		"Advantage",or(AdvantageChoice==3,AdvantageChoice==4),
		"Disadvantage",or(AdvantageChoice==0,AdvantageChoice==1),
		"ForcedAdvantage",or(AdvantageChoice==0,AdvantageChoice==4),
		"PCOutput",outputTargets
	)]
	
	[h,MACRO("Check@Lib:pm.a5e.Core"): CheckData]
	[h:CheckData = macro.return]
	[h:abilityTable = json.get(CheckData,"Table")]
	
	[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]
	
	[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
	[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
	[h:broadcastAsToken(output.GM,"gm")]
	[h:broadcastAsToken(output.PC,outputTargets)]
};{
	[h:EffectToResolve = json.get(json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID =='"+EffectIDChoice+"')]"),0)]

	[h,MACRO("ResolveEffectsBorder@Lib:pm.a5e.Core"): json.set(EffectToResolve,"SpecificTargets",ParentToken)]

	[h,MACRO("BuildEffectsFrame@Lib:pm.a5e.Core"): ""]
}]

[h:closeDialog("CheckInput")]