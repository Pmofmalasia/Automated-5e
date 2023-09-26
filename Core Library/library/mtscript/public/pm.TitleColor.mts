[h,if(currentToken()!=""),CODE:{
	[h:TitleKey = if(arg(0)==pm.RemoveSpecial(getProperty("a5e.stat.Race")),"Innate",arg(0))]
	[h:IndividualTitleTest = if(json.get(getProperty("a5e.stat.ClassTitleColors"),TitleKey)!="",1,0)]
	[h:MultiTitleTest = json.type(json.get(data.getData("addon:","pm.a5e.core","ClassTitleColors"),TitleKey))=="OBJECT"]
	[h,if(MultiTitleTest),CODE:{
		[h,if(IndividualTitleTest):
			FinalTitleColor = json.get(json.get(getProperty("a5e.stat.ClassTitleColors"),TitleKey),arg(1));
			FinalTitleColor = json.get(json.get(data.getData("addon:","pm.a5e.core","ClassTitleColors"),TitleKey),arg(1))
		]
	};{
		[h,if(IndividualTitleTest):
			FinalTitleColor = json.get(getProperty("a5e.stat.ClassTitleColors"),TitleKey);
			FinalTitleColor = json.get(data.getData("addon:","pm.a5e.core","ClassTitleColors"),TitleKey)
		]
	}]
};{
	[h:TitleKey = arg(0)]
	[h:IndividualTitleTest = 0]
	[h:MultiTitleTest = json.type(json.get(data.getData("addon:","pm.a5e.core","ClassTitleColors"),TitleKey))=="OBJECT"]
	[h,if(MultiTitleTest):
		FinalTitleColor = json.get(json.get(data.getData("addon:","pm.a5e.core","ClassTitleColors"),TitleKey),arg(1));
		FinalTitleColor = json.get(data.getData("addon:","pm.a5e.core","ClassTitleColors"),TitleKey)
	]
}]

[h,if(FinalTitleColor==""): FinalTitleColor = "#000000"]

[h:macro.return = FinalTitleColor]