[h:tempDisplayClass = arg(0)]
[h:ColorSubtype = arg(1)]
[h:ParentToken = arg(2)]
[h:ChatSettingsData = data.getData("addon:","pm.a5e.core","ChatSettings")]
[h:allBorderColors = json.get(ChatSettingsData,"BorderColors")]
[h:allTitleColors = json.get(ChatSettingsData,"TitleColors")]

[h:FinalBorderColor = ""]
[h:FinalTitleColor = ""]

[h,if(ParentToken == ""),CODE:{
	[h:DisplayClass = tempDisplayClass]
	[h:UniqueBorderColors = ""]
	[h:UniqueTitleColors = ""]
};{
	[h:DisplayClass = if(tempDisplayClass == pm.RemoveSpecial(getProperty("a5e.stat.Race")),"Innate",tempDisplayClass)]
	[h:UniqueBorderColors = json.get(getProperty("a5e.stat.BorderColors"),DisplayClass)]
	[h:UniqueTitleColors = json.get(getProperty("a5e.stat.TitleColors"),DisplayClass)]
}]
[h:hasUniqueBorderColor = UniqueBorderColors != ""]
[h:hasUniqueTitleColor = UniqueTitleColors != ""]

[h,if(hasUniqueBorderColor):
	tempBorderColor = json.get(UniqueBorderColors,DisplayClass);
	tempBorderColor = json.get(allBorderColors,DisplayClass)
]
[h,if(hasUniqueTitleColor):
	tempTitleColor = json.get(UniqueTitleColors,DisplayClass);
	tempTitleColor = json.get(allTitleColors,DisplayClass)
]

[h,if(DisplayClass == "zzSpell"),CODE:{
	[h:FinalBorderColor = json.get(json.get(tempBorderColor,json.get(ColorSubtype,"Source")),json.get(ColorSubtype,"Level"))]
	[h:FinalTitleColor = json.get(json.get(tempTitleColor,json.get(ColorSubtype,"Source")),json.get(ColorSubtype,"Level"))]
};{
	[h:hasBorderSubtypes = json.type(tempBorderColor) == "OBJECT"]
	[h,if(hasBorderSubtypes):
		FinalBorderColor = json.get(tempBorderColor,ColorSubtype);
		FinalBorderColor = tempBorderColor
	]

	[h:hasTitleSubtypes = json.type(tempTitleColor) == "OBJECT"]
	[h,if(hasTitleSubtypes):
		FinalTitleColor = json.get(tempTitleColor,ColorSubtype);
		FinalTitleColor = tempTitleColor
	]
}]

[h,if(FinalBorderColor==""): FinalBorderColor = "#FFFFFF"]
[h,if(FinalTitleColor==""): FinalTitleColor = "#000000"]
[h:return(0,json.set("","Border",FinalBorderColor,"Title",FinalTitleColor))]