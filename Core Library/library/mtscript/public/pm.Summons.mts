[h:pm.SummonCRMax = if(json.get(arg(0),"CR") == "",9999,json.get(arg(0),"CR"))]
[h:pm.SummonType = json.get(arg(0),"Type")]
[h:pm.SummonNumber = json.get(arg(0),"Number")]
[h:pm.SummonList = json.get(arg(0),"List")]
[h:pm.SummonMultiplier = if(json.get(arg(0),"Multiplier") == "",1,json.get(arg(0),"Multiplier"))]
[h:pm.SummonBonus = if(json.get(arg(0),"Bonus") == "",0,json.get(arg(0),"Bonus"))]
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
	[h:pm.SummonName = getName(summon,"z.0 Wild Shapes")]
	[h:pm.ValidSummonTest = if(or(and(pm.SummonList! = "",listFind(pm.SummonList,pm.SummonName) >= 0),and(pm.SummonList == "",getProperty("CreatureType",summon,"z.0 Wild Shapes") == pm.SummonType,getProperty("CR",summon,"z.0 Wild Shapes")<pm.SummonCRMax)),1,0)]
	[h,if(pm.ValidSummonTest),CODE:{
		[h:pm.SummonImage = getTokenImage("",summon,"z.0 Wild Shapes")]
		[h:pm.SummonIDs = json.append(pm.SummonIDs,summon)]
		[h:pm.SummonNames = json.append(pm.SummonNames,pm.SummonName)]
		[h:pm.SummonImages = json.append(pm.SummonImages,pm.SummonImage)]
		[h:pm.SummonPortraits = json.append(pm.SummonPortraits,getTokenPortrait("",summon,"z.0 Wild Shapes"))]
		[h:pm.SummonHandouts = json.append(pm.SummonHandouts,getTokenHandout("",summon,"z.0 Wild Shapes"))]
		[h:pm.SummonOptions = listAppend(pm.SummonOptions,pm.SummonName+" "+pm.SummonImage,",")]
	};{}]
}]

[h:pm.ChosenSummon = 0]
[h:disSummonType = if(listCount(pm.SummonOptions)<2,"","junkVar|"+pm.SummonType+"|Summon Options For|LABEL")]
[h:disSummonChoice = if(listCount(pm.SummonOptions)<2,"","pm.ChosenSummon|"+pm.SummonOptions+"|Select Summon|LIST|SELECT=0 ICON=TRUE ICONSIZE=50")]
	
[h:abort(input(
	""+disSummonType+"",
	""+disSummonChoice+""
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

[h:"<!-- If pm.SummonNumber is 0, that indicates that it is using the standard tables for summons - so the number of creatures summoned is set based on their CR. -->"]
[h:"<!-- Otherwise, the number given is used. -->"]
[h:pm.SummonNumber = if(pm.SummonNumber == 0,if(or(tempCRcheck == (1/4),tempCRcheck == 0),8,if(tempCRcheck == (1/2),4,if(tempCRcheck == 1,2,1))),pm.SummonNumber)]

[h:pm.SummonNumberFinal = (pm.SummonMultiplier*pm.SummonNumber)+pm.SummonBonus]

[h:"<!-- Note: Summoned tokens require an image, portrait, and handout or else you will get an error. This goes for all tokens on the summons map. -->"]
[h:copyToken(json.get(pm.SummonIDs,pm.ChosenSummon), pm.SummonNumberFinal, "z.0 Wild Shapes",pm.SummonUpdates)]