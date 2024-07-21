[h:SummonInstances = macro.args]

[h:allSummonedTokens = "[]"]
[h:allSummonedTokenNames = "[]"]
[h,foreach(SummonData,SummonInstances),CODE:{
	[h:ParentToken = json.get(SummonData,"ParentToken")]
	[h:TokenJSON = json.get(SummonData,"TokenData")]
	[h:SummonNumber = json.get(SummonData,"Number")]
	[h:switchToken(ParentToken)]

	[h:SummonName = json.get(json.get(TokenJSON,"MTProperties"),"name")]
	[h:BestiaryToken = findToken(base64.decode(SummonName),"z.1 Bestiary")]

	[h,if(BestiaryToken != ""),CODE:{
		[h:tokensCreated = copyToken(BestiaryToken,SummonNumber,"z.1 Bestiary",json.set("","relativeto","current","x",0,"y",0))]
		[h,if(SummonNumber == 1): tokensCreated = json.append("",tokensCreated)]
	};{
		[h:tokensCreated = pm.a5e.TokenFromJSON(TokenJSON,SummonNumber,json.set("","Token",ParentToken))]
	}]

	[h,foreach(token,tokensCreated),CODE:{
		[h:"<!-- Set summoner data here -->"]
	}]

	[h:allSummonedTokens = json.merge(allSummonedTokens,tokensCreated)]
	[h:allSummonedTokenNames = json.append(allSummonedTokenNames,base64.decode(SummonName)+if(SummonNumber > 1," x"+SummonNumber,""))]
}]

[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header","Summons",
	"FalseHeader","",
	"FullContents",pm.a5e.CreateDisplayList(allSummonedTokenNames,"and"),
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:returnData = json.set("","Table",abilityTable,"SummonedTokens",allSummonedTokens)]

[h:return(0,returnData)]