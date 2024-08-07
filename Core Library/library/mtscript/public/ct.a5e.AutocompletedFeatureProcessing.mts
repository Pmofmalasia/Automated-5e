[h:inputData = arg(0)]
[h:prefix = arg(1)]
[h,if(argCount() > 2): otherOptions = arg(2); otherOptions = "{}"]
[h:featureType = json.get(otherOptions,"Type")]

[h,if(json.contains(inputData,prefix+"NameValidated")),CODE:{
	[h:validatedFeatureData = json.set("",
		"Name",json.get(inputData,prefix+"NameValidated"),
		"DisplayName",json.get(inputData,prefix),
		"Class",json.get(inputData,prefix+"ClassValidated"),
		"Subclass",json.get(inputData,prefix+"SubclassValidated")
	)]

	[h:inputData = json.remove(inputData,prefix+"NameValidated")]
	[h:inputData = json.remove(inputData,prefix+"ClassValidated")]
	[h:inputData = json.remove(inputData,prefix+"SubclassValidated")]
	[h:inputData = json.remove(inputData,prefix)]
};{
	[h,if(json.contains(inputData,prefix+"NameValidated")),CODE:{
		[h:ClassChoice = json.get(inputData,prefix+"ClassChoice")]
		[h:ClassOptions = base64.decode(json.get(inputData,prefix+"ClassOptions"))]
		[h:validatedFeatureData = json.get(ClassOptions,ClassChoice)]

		[h:inputData = json.remove(inputData,prefix+"ClassChoice")]
		[h:inputData = json.remove(inputData,prefix+"ClassOptions")]
	};{
		[h:validatedFeatureData = json.set("","Name",pm.RemoveSpecial(json.get(inputData,prefix)))]
	}]
}]

[h,if(featureType == ""): featureType = json.get(validatedFeatureData,"Class")]
[h,switch(featureType):
	case "Spell": finalValidatedFeature = json.set(validatedFeatureData,"Class","Spell","Subclass",json.get(validatedFeatureData,"Name"));
	case "Background": finalValidatedFeature = json.set(validatedFeatureData,"Class","Background","Subclass",json.get(validatedFeatureData,"Name"));
	default: finalValidatedFeature = json.set(validatedFeatureData,"Class",json.get(validatedFeatureData,"Class"),"Subclass",json.get(validatedFeatureData,"Subclass"))
]
[h:return(0,json.set("","Feature",finalValidatedFeature,"InputData",inputData))]