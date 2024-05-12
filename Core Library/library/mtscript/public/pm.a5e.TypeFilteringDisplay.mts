[h:typeFilterData = arg(0)]
[h:isInclusive = arg(1)]

[h,if(json.type(typeFilterData) == "UNKNOWN"),CODE:{
	[h,if(typeFilterData == "" || typeFilterData == "Any"):
		filterDisplay = "";
		filterDisplay = typeFilterData+"s"
	]
};{
	[h:filterDisplay = pm.a5e.CreateDisplayList(typeFilterData,"or")]
}]

[h,if(filterDisplay != ""): filterDisplay = if(isInclusive,"Must Be ","Cannot Be ")+filterDisplay]

[h:return(0,filterDisplay)]