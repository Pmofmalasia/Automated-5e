[h:ObjectTokenData = macro.args]
[h,if(json.get(ObjectTokenData,"FalseName")==""):
	NewObjectTokenName = json.get(ObjectTokenData,"DisplayName");
	NewObjectTokenName = json.get(ObjectTokenData,"FalseName")
]
[h:NewObjectTokenType = json.get(ObjectTokenData,"Type")]
[h,switch(NewObjectTokenType):
	default: "";
]
[h:"<!-- get image from table based on token type -->"]

[h:NewObjectTokenData = json.set("",
	"name",NewObjectTokenName,
	"tokenImage",""
)]
[h:NewObjectTokenID = createToken()]