[h:inputData = arg(0)]

[h,switch(json.get(inputData,"Limbs")),CODE:
	case "Biped":{
		[h:StandardLimb = json.set("","BonusReach",0,"Limits","{}")]
		[h:UsableLimbs = json.append("",
			json.set(StandardLimb,
				"Name","MainHand",
				"DisplayName","Main Hand"),
			json.set(StandardLimb,
				"Name","OffHand",
				"DisplayName","Off Hand")
		)]
		[h:LimbsData = json.set("",
			"TotalLimbs",4,
			"Arrangement","Biped",
			"UsableLimbs",UsableLimbs
		)]
		[h:inputData = json.set(inputData,"CallLimbs",LimbsData)]
	};
	case "Quadriped":{
		[h:LimbsData = json.set("",
			"TotalLimbs",4,
			"Arrangement","Quadriped",
			"UsableLimbs","[]"
		)]
		[h:inputData = json.set(inputData,"CallLimbs",LimbsData)]
	};
	case "None":{
		[h:LimbsData = json.set("",
			"TotalLimbs",0,
			"Arrangement","NoLimbs",
			"UsableLimbs","[]"
		)]
		[h:inputData = json.set(inputData,"CallLimbs",LimbsData)]
	};
	case "Custom":{

	}
]
[h:inputData = json.remove(inputData,"Limbs")]

[h:return(0,inputData)]