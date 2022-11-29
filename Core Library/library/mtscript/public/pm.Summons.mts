[h:pm.SummonName = json.get(arg(0),"SummonName")]
[h:pm.SummonOptionNames = json.get(arg(0),"SummonOptions")]
[h:pm.SummonCRMax = if(json.get(arg(0),"SummonCRMax") == "",9999,json.get(arg(0),"CR"))]
[h:isSummonNumberCRBased = json.get(arg(0),"SummonNumberCRBased")]
[h:pm.SummonNumber = json.get(arg(0),"SummonNumber")]
[h:pm.SummonMultiplier = if(json.get(arg(0),"SummonNumberMultiplier") == "",1,json.get(arg(0),"SummonNumberMultiplier"))]
[h:pm.SummonBonus = if(json.get(arg(0),"SummonNumberBonus") == "",0,json.get(arg(0),"SummonNumberBonus"))]
[h:pm.SummonCreatureType = json.get(arg(0),"SummonCreatureType")]
[h:ParentToken = json.get(arg(0),"ParentToken")]

[h:pm.ForcedSummonName = json.get(arg(1),"ForcedName")]
[h:pm.ForcedSummonImage = json.get(arg(1),"ForcedImage")]
[h:pm.ForcedSummonPortrait = json.get(arg(1),"ForcedPortrait")]
[h:pm.ForcedSummonHandout = json.get(arg(1),"ForcedHandout")]

[h:pm.SummonOptions = ""]
[h:pm.SummonIDs = ""]
[h:pm.SummonNames = ""]
[h:pm.summonMapTokens = getTokens("json",json.set("","mapName","z.0 Wild Shapes"))]
[h:pm.SummonImages = ""]
[h:pm.SummonPortraits = ""]
[h:pm.SummonHandouts = ""]

[h:"<!-- The following code runs through each token on the Wild Shapes map. -->"]
[h:"<!-- If the token is on the list of available summons OR it meets the CR and creature type requirements, then it is added to the list of available summons. -->"]
[h,foreach(summon,pm.summonMapTokens),CODE:{
	[h:tempSummonName = getName(summon,"z.0 Wild Shapes")]

	[h:singleNameTest = pm.SummonName == tempSummonName]
	[h,if(!json.isEmpty(pm.SummonOptionNames)):
		onListTest = json.contains(pm.SummonOptionNames,tempSummonName);
		onListTest = 0
	]

	[h,if(pm.SummonCRMax != ""):
		withinCRMaxTest = getProperty("CR",summon,"z.0 Wild Shapes") <= pm.SummonCRMax;
		withinCRMaxTest = 0
	]

	[h,if(!json.isEmpty(pm.SummonCreatureType)):
		validCreatureTypeTest = json.contains(pm.SummonCreatureType,getProperty("a5e.stat.CreatureType",summon,"z.0 Wild Shapes"));
		validCreatureTypeTest = 0
	]

	[h:pm.ValidSummonTest = or(singleNameTest,onListTest,and(validCreatureTypeTest,withinCRMaxTest))]

	[h,if(pm.ValidSummonTest),CODE:{
		[h:pm.SummonImage = getTokenImage("",summon,"z.0 Wild Shapes")]
		[h:pm.SummonIDs = json.append(pm.SummonIDs,summon)]
		[h:pm.SummonNames = json.append(pm.SummonNames,tempSummonName)]
		[h:pm.SummonImages = json.append(pm.SummonImages,pm.SummonImage)]
		[h:pm.SummonPortraits = json.append(pm.SummonPortraits,getTokenPortrait("",summon,"z.0 Wild Shapes"))]
		[h:pm.SummonHandouts = json.append(pm.SummonHandouts,getTokenHandout("",summon,"z.0 Wild Shapes"))]
		[h:pm.SummonOptions = json.append(pm.SummonOptions,tempSummonName+" "+pm.SummonImage)]
	};{}]
}]

[h:pm.ChosenSummon = 0]
[h:disSummonChoice = if(json.length(pm.SummonOptions)<2,""," pm.ChosenSummon | "+pm.SummonOptions+" | Select Summon | LIST | ICON=TRUE ICONSIZE=50 DELIMITER=JSON")]
	
[h:abort(input(
	disSummonChoice
))]

[h:pm.SummonUpdates = json.set("",
	"x",getTokenX(0,ParentToken)+1,
	"y",getTokenY(0,ParentToken),
	"delta",0,
	"name",if(pm.ForcedSummonName == "",json.get(pm.SummonNames,pm.ChosenSummon),pm.ForcedSummonName),
	"tokenImage",if(pm.ForcedSummonImage == "",json.get(pm.SummonImages,pm.ChosenSummon),pm.ForcedSummonImage),
	"tokenPortrait",if(pm.ForcedSummonPortrait == "",json.get(pm.SummonPortraits,pm.ChosenSummon),pm.ForcedSummonPortrait),
	"tokenHandout",if(pm.ForcedSummonHandout == "",json.get(pm.SummonHandouts,pm.ChosenSummon),pm.ForcedSummonHandout)
)]

[h:tempCRcheck = getProperty("CR",json.get(pm.SummonIDs,pm.ChosenSummon),"z.0 Wild Shapes")]
[h,if(isSummonNumberCRBased==1),CODE:{
	[h:pm.SummonNumber = if(or(tempCRcheck == (1/4),tempCRcheck == 0),8,if(tempCRcheck == (1/2),4,if(tempCRcheck == 1,2,1)))]
}]

[h:pm.SummonNumberFinal = (pm.SummonMultiplier*pm.SummonNumber)+pm.SummonBonus]

[h:"<!-- Note: Summoned tokens require an image, portrait, and handout or else you will get an error. This goes for all tokens on the summons map. -->"]
[h:copyToken(json.get(pm.SummonIDs,pm.ChosenSummon), pm.SummonNumberFinal, "z.0 Wild Shapes",pm.SummonUpdates)]