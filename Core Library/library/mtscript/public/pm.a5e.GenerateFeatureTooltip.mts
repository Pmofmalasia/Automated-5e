[h:ParentToken = arg(0)]
[h:FeatureData = arg(1)]
[h:a5e.UnifiedAbilities = arg(2)]
[h,if(argCount() > 3):
	options = arg(3);
	options = "{}"
]
[h:NeedsNonEffectData = number(json.get(options,"NeedsNonEffectData"))]

[h:"<!-- Test for using 'Tier' vs. 'Level' in AHL display - Non-spells and cantrips use 'Tier' -->"]
[h:displayTier = if(json.get(FeatureData,"Class") == "Spell",if(json.get(FeatureData,"Level") == 0,"Tier","Level"),"Tier")]

[h:abilityTable = "[]"]
[h,if(NeedsNonEffectData),CODE:{
	[h:"<!-- Add meta-info here -->"]
};{
	[h:"<!-- Bypassed for things like spells, weapons, etc. that have a more specific layout for things not in the 'Effects' key -->"]
}]

[h:allEffects = json.get(FeatureData,"Effects")]
[h:effectsNumber = json.length(allEffects)]
[h,foreach(effect,allEffects),CODE:{
	[h,if(effectsNumber > 1),CODE:{			
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",json.get(effect,"EffectDisplayName"),
			"FalseHeader","",
			"FullContents","",
			"RulesContents","",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	};{}]

	[h:effectUseTime = json.get(effect,"UseTime")]
	[h,if(!json.isEmpty(effectUseTime)),CODE:{
		[h:UseTimeDisplay = json.get(effectUseTime,"Value")+" "+json.get(effectUseTime,"Units")+if(json.get(effectUseTime,"Value")==1,"","s")+if(json.get(effect,"isRitual") == 1,", or plus 10 minutes as a ritual.","")]
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header",if(json.get(FeatureData,"Class") == "Spell","Casting","Usage")+" Time",
			"FalseHeader","",
			"FullContents","",
			"RulesContents",UseTimeDisplay,
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]		
	};{}]


	[h:reactionDescription = json.get(effect,"ReactionDescription")]
	[h,if(reactionDescription != ""),CODE:{
		[h:reactionDescription = upper(base64.decode(reactionDescription),1)]
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Reaction Trigger",
			"FalseHeader","",
			"FullContents","",
			"RulesContents",reactionDescription,
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	}]

	[h:isConcentrationTest = number(json.get(effect,"isConcentration"))]
	[h:ConcentrationLost = json.get(effect,"ConcentrationLostLevel")]
	[h,if(ConcentrationLost != ""): 
		ConcentrationLostString = ", no longer required at level "+ConcentrationLost;
		ConcentrationLostString = ""
	]
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Requires Concentration",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",if(isConcentrationTest,"Yes","No")+ConcentrationLostString,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]

	[h:effectDuration = json.get(effect,"Duration")]
	[h:effectDurationDisplay = if(json.isEmpty(effectDuration),"Instantaneous",json.get(effectDuration,"Value")+" "+json.get(effectDuration,"Units")+if(json.get(effectDuration,"Value")==1,"","s"))]

	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header","Duration",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",effectDurationDisplay,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]

	[h:thisEffectSubeffects = json.get(effect,"Subeffects")]
	[h:subeffectsNum = json.length(thisEffectSubeffects)]
	[h,foreach(subeffect,thisEffectSubeffects),CODE:{
		[h:abilityTable = json.merge(abilityTable,pm.a5e.GenerateSubeffectTooltip(ParentToken,subeffect,FeatureData,a5e.UnifiedAbilities))]
	}]
}]

[h:return(0,abilityTable)]