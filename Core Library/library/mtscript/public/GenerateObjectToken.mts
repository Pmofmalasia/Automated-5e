[h:objectData = macro.args]
[h,if(json.get(objectData,"FalseName")==""):
	NewObjectTokenName = json.get(objectData,"DisplayName");
	NewObjectTokenName = json.get(objectData,"FalseName")
]
[h:NewObjectTokenType = json.get(objectData,"Type")]
[h,switch(NewObjectTokenType):
	default: "";
]
[h:"<!-- get image from table based on token type -->"]

[h:NewObjectTokenData = json.set("",
	"name",NewObjectTokenName,
	"tokenImage","",
	"X","",
	"Y",""
)]
[h:NewObjectTokenID = createToken(NewObjectTokenData)]

[h:switchToken(NewObjectTokenID)]

[h:setProperty("a5e.stat.Type",json.get(objectData,"Type"))]