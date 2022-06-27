[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:summonParams = arg(1)]
[h:pm.SummonCRMax=if(json.get(summonParams,"CR")=="",9999,json.get(summonParams,"CR"))]
[h:pm.SummonType=json.get(summonParams,"Type")]
[h:pm.SummonNumber=json.get(summonParams,"Number")]
[h:pm.SummonList=json.get(summonParams,"List")]
[h:pm.SummonMultiplier=if(json.get(summonParams,"Multiplier")=="",1,json.get(summonParams,"Multiplier"))]
[h:pm.SummonBonus=if(json.get(summonParams,"Bonus")=="",0,json.get(summonParams,"Bonus"))]
[h:ParentToken=json.get(summonParams,"ParentToken")]

[h:summonCosmetics = arg(2)]
[h:pm.ForcedSummonName=json.get(summonCosmetics,"Name")]
[h:pm.ForcedSummonImage=json.get(summonCosmetics,"Image")]
[h:pm.ForcedSummonPortrait=json.get(summonCosmetics,"Portrait")]
[h:pm.ForcedSummonHandout=json.get(summonCosmetics,"Handout")]

[h:pm.SummonOptions=""]
[h:pm.SummonIDs=""]
[h:pm.SummonNames=""]
[h:pm.summonMapTokens=getTokens("json",json.set("","mapName","z.0 Wild Shapes"))]
[h:pm.SummonImages=""]
[h:pm.SummonPortraits=""]
[h:pm.SummonHandouts=""]

[h,if(IsTooltip),CODE:{
	[h,if(pm.SummonList==""),CODE:{
		[h,if(pm.SummonNumber==0):
			summonTable = json.set("",
			"ShowIfCondensed",1,
			"Header","Summon Options",
			"FalseHeader","",
			"FullContents","",
			"RulesContents",pm.SummonType+"s, 8 if CR 1/4 or lower, 4 if CR 1/2, 2 if CR 1, 1 if CR 2"`,
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
			);
			summonTable = json.set("",
			"ShowIfCondensed",1,
			"Header","Summon Options",
			"FalseHeader","",
			"FullContents","",
			"RulesContents",pm.SummonNumber+" "+pm.SummonType+if(pm.SummonNumber==1,"","s")+" "+if(pm.SummonCRMax==9999,"","under CR "+pm.SummonCRMax),
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
			)
		]
	};{
		[h:listDisplay = json.toList(json.fromList(pm.SummonList),", ")]
		[h:summonTable = json.set("",
			"ShowIfCondensed",1,
			"Header","Summon Options",
			"FalseHeader","",
			"FullContents","",
			"RulesContents",listDisplay,
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
		)]
	}]
	[h:abilityTable = json.append(abilityTable,summonTable)]
};{
	[h:pm.Summons(currentFeatureInfo,summonParams,summonCosmetics)]
}]