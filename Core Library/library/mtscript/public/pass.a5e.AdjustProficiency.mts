[h:PassiveFeatureData = arg(0)]
[h:passProficiencyData = arg(1)]

[h,if(json.type(passProficiencyData)=="UNKNOWN"),CODE:{
	[h:passProficiencySet = passProficiencyData]
	[h:ProfType = max(passProficiencySet,ProfType)]
};{
	[h:passProficiencySet = number(json.get(passProficiencyData,"ProficiencySet"))]
	[h:ProfType = max(passProficiencySet,ProfType)]
	[h:passProficiencySetOverride = number(json.get(passProficiencyData,"ProficiencySetOverride"))]
	[h:ProfType = min(passProficiencySetOverride,ProfType)]
	[h:passProficiencyRoundingMethod = json.get(passProficiencyData,"RoundingMethod")]
	[h,if(passProficiencyRoundingMethod != ""): roundingMethod = passProficiencyRoundingMethod]
}]