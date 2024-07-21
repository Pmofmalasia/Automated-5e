[h:inputData = arg(0)]
[h:prefix = arg(1)]
[h,if(argCount() > 2): otherOptions = arg(2); otherOptions = json.set("","Type","Feature")]
[h:featureType = json.get(otherOptions,"Type")]

[h:validatedFeatureData = json.set("",
	"Name",json.get(inputData,prefix+featureType+"Name"+"Validated"),
	"DisplayName",json.get(inputData,prefix+featureType),
	"Class",json.get(inputData,prefix+featureType+"Class"+"Validated"),
	"Subclass",json.get(inputData,prefix+featureType+"Subclass"+"Validated")
)]

[h:inputData = json.remove(inputData,prefix+featureType+"Name"+"Validated")]
[h:inputData = json.remove(inputData,prefix+featureType+"Class"+"Validated")]
[h:inputData = json.remove(inputData,prefix+featureType+"Subclass"+"Validated")]
[h:inputData = json.remove(inputData,prefix+featureType)]

[h:return(0,json.set("","Feature",validatedFeatureData,"InputData",inputData))]