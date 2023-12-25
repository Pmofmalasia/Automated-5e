[h:EffectData = macro.args]
[h:IsTooltip = number(json.get(EffectData,"IsTooltip"))]
[h:ParentToken = json.get(EffectData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Effect"]
[h:pm.a5e.EffectData = "[]"]
[h:abilityTable = "[]"]

[h:"<!-- TODO: Need a better way to actually set these values and not just placeholders -->"]
[h:AHLTier = number(json.get(EffectData,"AHLTier"))]
[h:sClassSelect = json.get(EffectData,"sClassSelect")]
[h:PrimeStat = json.get(EffectData,"PrimeStat")]
[h,if(PrimeStat==""): PrimeStat = "None"]
[h,if(PrimeStat=="None"): PrimeStatMod = 0; PrimeStatMod = json.get(getProperty("a5e.stat.AtrMods"),PrimeStat)]

[h:EffectToExecute = json.get(EffectData,"Effect")]
[h,if(json.get(EffectToExecute,"UseTime")!=""),CODE:{
	[h:UseTimeData = json.get(EffectToExecute,"UseTime")]
	[h:UseTimeValue = json.get(UseTimeData,"Value")]
	[h:UseTimeUnits = json.get(UseTimeData,"Units")]
	
	[h:UseTimeString = UseTimeValue+" "+UseTimeUnits+if(UseTimeValue==1,"","s")]
	[h,if(UseTimeUnits=="Reaction"): UseTimeString = UseTimeString+", "+base64.decode(json.get(EffectToExecute,"ReactionDescription"))]

	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",0,
		"Header","Usage Time",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",UseTimeString,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
};{
	[h:UseTimeData = "{}"]
	[h:UseTimeValue = 0]
	[h:UseTimeUnits = "Instantaneous"]
}]

[h,if(json.get(EffectToExecute,"Duration")!=""),CODE:{
	[h:DurationData = json.get(EffectToExecute,"Duration")]
	[h:DurationValue = json.get(DurationData,"Value")]
	[h:DurationUnits = json.get(DurationData,"Units")]
	[h:DurationString = DurationValue+" "+DurationUnits+if(DurationValue==1,"","s")]
	
	[h:abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",0,
		"Header","Duration",
		"FalseHeader","",
		"FullContents","",
		"RulesContents",DurationString,
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
	))]
};{
	[h:DurationData = "{}"]
	[h:DurationValue = 0]
	[h:DurationUnits = "Instantaneous"]
}]

[h,if(json.get(EffectToExecute,"isConcentration")==1),CODE:{
	[h:"<!-- TODO: Implement concentration stuff -->"]
};{}]

[h:EffectSubeffects = json.get(EffectToExecute,"Subeffects")]
[h,foreach(tempSubeffect,EffectSubeffects): pm.a5e.ExecuteSubeffect(tempSubeffect,json.set("","BaseData",EffectData))]

[h:macro.return = json.set("","Table",abilityTable,"Effect",pm.a5e.EffectData)]