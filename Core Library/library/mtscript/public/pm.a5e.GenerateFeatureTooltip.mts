[h:FeatureData = arg(0)]
[h:needsNoneffectData = arg(1)]

[h:abilityTable = "[]"]
[h,if(needsNoneffectData),CODE:{
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
			"Header",json.get(effect,"DisplayName"),
			"FalseHeader","",
			"FullContents","",
			"RulesContents","",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		))]
	};{}]

	[h:effectUseTime = json.get(effect,"UseTime")]
	[h:UseTimeDisplay = json.get(effectUseTime,"Value")+" "+json.get(effectUseTime,"Units")+if(json.get(effectUseTime,"Value")==1,"","s")]
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",if(json.get(FeatureData,"School") != "","Casting","Usage")+" Time",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",UseTimeDisplay,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
		
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

	[h:isConcentrationTest = json.get(effect,"isConcentration")]
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
		[h:abilityTable = json.merge(abilityTable,pm.a5e.GenerateSubeffectTooltip(subeffect))]
	}]
}]

[h:return(0,abilityTable)]