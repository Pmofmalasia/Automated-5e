[h,if(currentToken()!=""),CODE:{
	[h:TitleKey = if(arg(0)==pm.RemoveSpecial(getProperty("Race")),"Innate",arg(0))]
	[h:IndividualTitleTest = if(json.get(ClassTitleColors,TitleKey)!="",1,0)]
	[h:MultiTitleTest = json.type(json.get(getLibProperty("ClassTitleColors","Lib:pm.a5e.Core"),TitleKey))=="OBJECT"]
	[h,if(MultiTitleTest),CODE:{
		[h,if(IndividualTitleTest):
			FinalTitleColor = json.get(json.get(ClassTitleColors,TitleKey),arg(1));
			FinalTitleColor = json.get(json.get(getLibProperty("ClassTitleColors","Lib:pm.a5e.Core"),TitleKey),arg(1))
		]
	};{
		[h,if(IndividualTitleTest):
			FinalTitleColor = json.get(ClassTitleColors,TitleKey);
			FinalTitleColor = json.get(getLibProperty("ClassTitleColors","Lib:pm.a5e.Core"),TitleKey)
		]
	}]
};{
	[h:TitleKey = arg(0)]
	[h:IndividualTitleTest = 0]
	[h:MultiTitleTest = json.type(json.get(getLibProperty("ClassTitleColors","Lib:pm.a5e.Core"),TitleKey))=="OBJECT"]
	[h,if(MultiTitleTest):
		FinalTitleColor = json.get(json.get(getLibProperty("ClassTitleColors","Lib:pm.a5e.Core"),TitleKey),arg(1));
		FinalTitleColor = json.get(getLibProperty("ClassTitleColors","Lib:pm.a5e.Core"),TitleKey)
	]
}]

[h,if(FinalTitleColor==""): FinalTitleColor = "#000000"]

[h:macro.return = FinalTitleColor]