[h:inputData = arg(0)]
[h:whichChoice = arg(1)]

[h:pointAllocationData = json.set("","Points",json.get(inputData,"AttributeChoicePoints"+whichChoice))]
[h:inputData = json.remove(inputData,"AttributeChoicePoints"+whichChoice)]

[h:AttributeChoiceMethod = json.get(inputData,"AttributeChoiceMethod"+whichChoice)]
[h:inputData = json.remove(inputData,"AttributeChoiceMethod"+whichChoice)]
[h,if(AttributeChoiceMethod == "Any"),CODE:{
	[h:pointAllocationData = json.set(pointAllocationData,"AllAttributes",1)]
	[h:FinalData = json.set("","MainData",inputData,"Choices",pointAllocationData)]
	[h:return(0,FinalData)]
};{
	[h:"<!-- Note: During processing, it checks to see if value for key 'Inclusive' == key 'Attribute'. Therefore, if 'Inclusive' == 1 and 'Attribute' == 1, they can be chosen. If exclusive is chosen in input, 'Inclusive' == '' and chosen attributes will still == 1, so cannot be selected. Attributes chosen will be empty (or == '' with json.get), and can still be selected. -->"]
	[h,if(AttributeChoiceMethod == "Inclusive"): pointAllocationData = json.set(pointAllocationData,"Inclusive",1)]
}]

[h:allAttributes = pm.GetAttributes("Name","json")]
[h,foreach(attribute,allAttributes),CODE:{
	[h,if(json.contains(inputData,"AttributeChoice"+whichChoice+attribute)),CODE:{
		[h:inputData = json.remove(inputData,"AttributeChoice"+whichChoice+attribute)]
		[h:pointAllocationData = json.set(pointAllocationData,attribute,1)]
	}]
}]

[h:FinalData = json.set("","MainData",inputData,"Choices",pointAllocationData)]
[h:return(0,FinalData)]