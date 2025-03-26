[h:inputData = arg(0)]
[h:IDSuffix = arg(1)]
[h:PerceptionData = "{}"]

[h,if(json.contains(inputData,"TargetPerception"+IDSuffix+"Sight")),CODE:{
	[h:PerceptionData = json.set(PerceptionData,"Sight",1)]
	[h:inputData = json.remove(inputData,"TargetPerception"+IDSuffix+"Sight")]
}]
[h,if(json.contains(inputData,"TargetPerception"+IDSuffix+"Hear")),CODE:{
	[h:PerceptionData = json.set(PerceptionData,"Hear",1)]
	[h:inputData = json.remove(inputData,"TargetPerception"+IDSuffix+"Hear")]
}]        
[h,if(json.contains(inputData,"TargetPerception"+IDSuffix+"Understand")),CODE:{
	[h:PerceptionData = json.set(PerceptionData,"Understand",1)]
	[h:inputData = json.remove(inputData,"TargetPerception"+IDSuffix+"Understand")]
}]

[h:return(0,json.set("","Input",inputData,"Perception",PerceptionData))]