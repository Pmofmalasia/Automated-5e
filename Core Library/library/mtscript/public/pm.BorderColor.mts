[h,if(currentToken()!=""),CODE:{
	[h:BorderKey = if(arg(0) == pm.RemoveSpecial(getProperty("a5e.stat.Race")),"Innate",arg(0))]
	[h:IndividualBorderTest = if(json.get(getProperty("a5e.stat.ClassBorderColors"),BorderKey)!="",1,0)]
	[h:MultiBorderTest = json.type(json.get(getLibProperty("ClassBorderColors","Lib:pm.a5e.Core"),BorderKey))=="OBJECT"]
	[h,if(MultiBorderTest),CODE:{
		[h,if(IndividualBorderTest):
			FinalBorderColor = json.get(json.get(getProperty("a5e.stat.ClassBorderColors"),BorderKey),arg(1));
			FinalBorderColor = json.get(json.get(getLibProperty("ClassBorderColors","Lib:pm.a5e.Core"),BorderKey),arg(1))
		]
	};{
		[h,if(IndividualBorderTest):
			FinalBorderColor = json.get(getProperty("a5e.stat.ClassBorderColors"),BorderKey);
			FinalBorderColor = json.get(getLibProperty("ClassBorderColors","Lib:pm.a5e.Core"),BorderKey)
		]
	}]
};{
	[h:BorderKey = arg(0)]
	[h:IndividualBorderTest = 0]
	[h:MultiBorderTest = json.type(json.get(getLibProperty("ClassBorderColors","Lib:pm.a5e.Core"),BorderKey))=="OBJECT"]
	[h,if(MultiBorderTest):
		FinalBorderColor = json.get(json.get(getLibProperty("ClassBorderColors","Lib:pm.a5e.Core"),BorderKey),arg(1));
		FinalBorderColor = json.get(getLibProperty("ClassBorderColors","Lib:pm.a5e.Core"),BorderKey)
	]
}]

[h,if(FinalBorderColor==""): FinalBorderColor = "#FFFFFF"]

[h:macro.return = FinalBorderColor]