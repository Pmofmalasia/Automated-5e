[h:TokenJSON = arg(0)]
[h:TokenNumber = arg(1)]
[h:Location = arg(2)]

[h:tokenIDs = "[]"]
[h:createTokenData = json.get(TokenJSON,"MTProperties")]

[h:createTokenData = json.set(createTokenData,
	"name",base64.decode(json.get(createTokenData,"name")),
	"label",base64.decode(json.get(createTokenData,"label")),
	"gmName",base64.decode(json.get(createTokenData,"gmName"))
)]

[h:LocationXCoord = json.get(Location,"X")]
[h:LocationYCoord = json.get(Location,"Y")]
[h:LocationToken = json.get(Location,"Token")]
[h,if(LocationToken != ""),CODE:{
	[h:XCoord = getTokenX(0,LocationToken) + LocationXCoord]
	[h:YCoord = getTokenY(0,LocationToken) + LocationYCoord]
};{
	[h:XCoord = LocationXCoord]
	[h:YCoord = LocationYCoord]
}]
[h:createTokenData = json.set(createTokenData,
	"x",XCoord,
	"y",YCoord
)]
[h:newToken = createToken(createTokenData)]

[h:switchToken(newToken)]
[h:MTProperties = json.get(TokenJSON,"MTProperties")]
[h:setSightType(json.get(MTProperties,"Sight"))]
[h:setNotes(base64.decode(json.get(MTProperties,"Notes")))]
[h:setGMNotes(base64.decode(json.get(MTProperties,"GMNotes")))]
[h:setPropertyType(json.get(MTProperties,"PropertyType"))]

[h:allProperties = json.get(TokenJSON,"Properties")]
[h:propertyNames = json.get(TokenJSON,"RawPropertyNames")]
[h,foreach(property,propertyNames): setProperty(property,json.get(allProperties,property))]

[h:allMacros = json.get(TokenJSON,"Macros")]
[h,foreach(macro,allMacros): createMacro(macro)]

[h:allTokens = json.append("",newToken)]
[h:remainingTokenNumber = TokenNumber - 1]
[h,if(remainingTokenNumber > 0),CODE:{
	[h:copiedTokens = copyToken(newToken,remainingTokenNumber)]
	[h,if(remainingTokenNumber == 1):
		allTokens = json.append(allTokens,copiedTokens);
		allTokens = json.merge(allTokens,copiedTokens)
	]
}]

[h:return(0,allTokens)]