[h:inputData = arg(0)]

[h:tierNumber = json.get(inputData,"UseResourceTierNumber")]
[h:inputData = json.remove(inputData,"UseResourceTierNumber")]

[h:i = 0]
[h:allResourceOptions = "[]"]
[h,count(tierNumber),CODE:{
	[h:thisTierResourceNumber = json.get(inputData,"UseResourceType"+i+"Number")]
	[h:inputData = json.remove(inputData,"UseResourceType"+i+"Number")]

	[h:j = 0]
	[h:thisTierOptions = "[]"]
	[h,count(thisTierResourceNumber),CODE:{
		[h:thisResourceData = ct.a5e.UseResourceIndividualProcessing(inputData,i,j)]
		[h:inputData = json.get(thisResourceData,"InputData")]
		[h:thisTierOptions = json.append(thisTierOptions,json.get(thisResourceData,"Resource"))]
		[h:j = j + 1]
	}]

	[h:allResourceOptions = json.append(allResourceOptions,thisTierOptions)]
	[h:i = i + 1]
}]

[h:return(0,json.set("","InputData",inputData,"Resource",allResourceOptions))]