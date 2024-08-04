[h:inputData = arg(0)]

[h:isSummons = json.get(inputData,"isSummons")]
[h:SummonData = "{}"]
[h:SummonFilter = "{}"]
[h,switch(isSummons),CODE:
	case "UniqueEffect":{
















		[h:SummonFilter = json.set(SummonFilter,"CreatureNameInclusive",json.get(inputData,"Name"))]
		[h:"<!-- Change this to NOT use bestiary instead? And divert away from using filters at all, since spell effects don't seem like they should be stored in the bestiary. -->"]















	};
	case "Single":{
		[h:SummonDisplayName = pm.EvilChars(json.get(inputData,"singleSummon"))]
		[h:SummonName = pm.RemoveSpecial(SummonDisplayName)]
		[h:SummonFilter = json.set(SummonFilter,"CreatureNameInclusive",json.append("",SummonName))]
		[h:inputData = json.remove(inputData,"singleSummon")]
	};
	case "Options":{
		[h:tempSummonOptions = json.fromList(encode(json.get(inputData,"summonOptions")),"%0A")]
		[h:SummonOptions = "[]"]
		[h,foreach(summonOption,tempSummonOptions),CODE:{
			[h:tempDisplayName = pm.EvilChars(decode(summonOption))]
			[h:tempName = pm.RemoveSpecial(tempDisplayName)]
			[h:SummonOptions = json.append(SummonOptions,tempName)]
		}]
		[h:SummonFilter = json.set(SummonFilter,"CreatureNameInclusive",SummonOptions)]
		[h:inputData = json.remove(inputData,"summonOptions")]
	};
	case "Criteria":{
		[h,if(json.get(inputData,"isCreatureTypeLimitsSummon") != ""),CODE:{
			[h:CreatureTypeReturnData = ct.a5e.CreatureTypeLimitsProcessing(inputData,"Summon")]
			[h:inputData = json.get(CreatureTypeReturnData,"InputData")]
			[h:ExclusiveInclusive = json.get(inputData,"isCreatureTypeLimitsSummon")]
			[h:SummonFilter = json.set(SummonFilter,"Type"+ExclusiveInclusive,json.get(CreatureTypeReturnData,"CreatureTypes"))]
		};{}]
		[h:inputData = json.remove(inputData,"isCreatureTypeLimitsSummon")]

		[h,if(json.get(inputData,"isCreatureSubtypeLimitsSummon") != ""),CODE:{
			[h:CreatureSubtypeReturnData = ct.a5e.CreatureSubtypeLimitsProcessing(inputData,"Summon")]
			[h:inputData = json.get(CreatureSubtypeReturnData,"InputData")]
			[h:ExclusiveInclusive = json.get(inputData,"isCreatureSubtypeLimitsSummon")]
			[h:SummonFilter = json.set(SummonFilter,"Subtype"+ExclusiveInclusive,json.get(CreatureSubtypeReturnData,"CreatureSubtypes"))]
		};{}]
		[h:inputData = json.remove(inputData,"isCreatureSubtypeLimitsSummon")]

		[h,if(json.get(inputData,"SizePrereqsSummon") != ""),CODE:{
			[h:SizePrereqReturnData = ct.a5e.SizePrerequisiteProcessing(inputData,"Summon")]
			[h:inputData = json.get(SizePrereqReturnData,"InputData")]
			[h:SummonFilter = json.merge(SummonFilter,json.get(SizePrereqReturnData,"SizeData"))]
		};{}]

		[h:CRMaxFilter = json.set("","CRMax",json.get(inputData,"summonCRMax"))]
		[h,if(json.get(inputData,"summonCRMaxAHLScaling") != 0 && json.get(inputData,"summonCRMaxAHLScaling") != ""): CRMaxFilter = json.set(CRMaxFilter,
			"CRMaxAHL",json.get(inputData,"summonCRMaxAHLNum"),
			"CRMaxAHLScaling",json.get(inputData,"summonCRMaxAHLScaling"),
			"CRMaxAHLScalingMethod",json.get(inputData,"summonCRMaxAHLScaleHow")
		)]
		[h:inputData = json.remove(inputData,"summonCRMax")]
		[h:inputData = json.remove(inputData,"summonCRMaxAHLNum")]
		[h:inputData = json.remove(inputData,"summonCRMaxAHLScaling")]
		[h:inputData = json.remove(inputData,"summonCRMaxAHLScaleHow")]
		[h:SummonFilter = json.set(SummonFilter,"CRMaximum",CRMaxFilter)]

	};
	default:{}
]
[h,if(!json.isEmpty(SummonFilter)): SummonData = json.set(SummonData,"Prereqs",SummonFilter)]

[h,if(json.contains(inputData,"summonNumber")):
	SummonData = json.set(SummonData,"Number",json.get(inputData,"summonNumber"));
	SummonData = json.set(SummonData,"SummonNumberCRBased",1)
]
[h:inputData = json.remove(inputData,"summonNumber")]
[h:inputData = json.remove(inputData,"summonNumberCRBased")]

[h,if(json.contains(inputData,"summonNumberAHL")): SummonData = json.set(SummonData,
	"NumberAHL",json.get(inputData,"summonNumberAHL"),
	"NumberAHLScaling",json.get(inputData,"summonNumberAHLScaling"),
	"NumberScalingMethod",json.get(inputData,"summonNumberAHLScaleHow")
)]
[h:inputData = json.remove(inputData,"summonNumberAHL")]
[h:inputData = json.remove(inputData,"summonNumberAHLScaling")]
[h:inputData = json.remove(inputData,"summonNumberAHLScaleHow")]

[h,if(json.contains(inputData,"isModifySummons")),CODE:{

};{}]

[h:SummonData = json.set(SummonData,
	"InitiativeType",json.get(inputData,"SummonInitiativeType"),
	"CommandHow",json.get(inputData,"SummonCommandHow")
)]

[h,if(json.get(inputData,"SummonCommandHow") != "Independent"),CODE:{
	[h,switch(json.get(inputData,"UseTimeSummonCommand")):
		case "Action": SummonData = json.set(SummonData,"CommandTime",json.set("","Value",1,"Units","action"));
		case "Bonus Action": SummonData = json.set(SummonData,"CommandTime",json.set("","Value",1,"Units","bonus"));
		case "Free": SummonData = json.set(SummonData,"CommandTime",json.set("","Value",1,"Units","free"))
	]

	[h:SummonData = json.set(SummonData,"CommandUnable",json.get(inputData,"SummonCommandUnable"))]

	[h,if(!json.contains(SummonData,"isSummonCommandRangeUnlimited")):
		SummonData = json.set(SummonData,"CommandRange",json.set("","Value",json.get(SummonData,"SummonCommandRange"),"Units","feet"));
		SummonData = json.set(SummonData,"CommandRange","{}")
	]
}]
[h:inputData = json.remove(inputData,"SummonInitiativeType")]
[h:inputData = json.remove(inputData,"SummonCommandHow")]
[h:inputData = json.remove(inputData,"UseTimeSummonCommand")]
[h:inputData = json.remove(inputData,"SummonCommandUnable")]
[h:inputData = json.remove(inputData,"SummonCommandRange")]
[h:inputData = json.remove(inputData,"isSummonCommandRangeUnlimited")]

[h:UncontrollableInstances = "{}"]
[h:safeInstanceNumber = 0]
[h:commandUncontrollableInstanceNumber = number(json.get(inputData,"SummonCommandUncontrollableNumber"))]
[h,count(commandUncontrollableInstanceNumber),CODE:{
	[h:thisInstanceResolutionInfo = ""]
	[h,if(json.get(inputData,"SummonCommandUncontrollableConditional"+safeInstanceNumber) == 1),CODE:{
		[h:"<!-- Conditions to end/trigger save - needs implementation -->"]
		[h:thisInstanceResolutionInfo = json.set(thisInstanceResolutionInfo,"Prereqs",1)]

		[h:inputData = json.remove(inputData,"SummonCommandUncontrollableConditional"+safeInstanceNumber)]
	};{}]

	[h,switch(json.get(inputData,"SummonCommandUncontrollableResolutionType"+safeInstanceNumber)),CODE:
		case "Save":{
			[h:thisInstanceResolutionType = json.get(inputData,"SummonCommandUncontrollableResolution"+safeInstanceNumber)]

			[h:thisInstanceResolutionInfo = json.set(thisInstanceResolutionInfo,"SaveType",thisInstanceResolutionType)]
		};
		case "Check":{
			[h:thisInstanceResolutionType = json.get(inputData,"conditionEndInstanceResolution"+safeInstanceNumber)]

			[h,if(thisInstanceResolutionType == "AthleticsAcrobatics"): thisInstanceResolutionType = json.append("","Athletics","Acrobatics")]

			[h:thisInstanceResolutionInfo = json.set(thisInstanceResolutionInfo,"CheckType",thisInstanceResolutionType)]
		};
		case "Percentage":{
			[h:thisInstanceResolutionInfo = json.set(thisInstanceResolutionInfo,"Percentage",json.get(inputData,"SummonCommandUncontrollableResolution"+safeInstanceNumber))]
		};
		case "":{}
	]
	[h:inputData = json.remove(inputData,"SummonCommandUncontrollableResolutionType"+safeInstanceNumber)]
	[h:inputData = json.remove(inputData,"SummonCommandUncontrollableResolution"+safeInstanceNumber)]

	[h,if(json.isEmpty(thisInstanceResolutionInfo)): thisInstanceResolutionInfo = 1]

	[h:UncontrollableInstances = json.set(UncontrollableInstances,
		json.get(inputData,"SummonCommandUncontrollableMethod"+safeInstanceNumber),thisInstanceResolutionInfo
	)]
	[h:inputData = json.remove(inputData,"SummonCommandUncontrollableMethod"+safeInstanceNumber)]
	[h:safeInstanceNumber = safeInstanceNumber + 1]
}]
[h:inputData = json.remove(inputData,"SummonCommandUncontrollableNumber")]
[h,if(!json.isEmpty(UncontrollableInstances)): SummonData = json.set(SummonData,"Uncontrollable",UncontrollableInstances)]

[h,if(json.contains(inputData,"isSummonOrigin")),CODE:{

};{}]

[h:return(0,json.set("","Input",inputData,"Summon",SummonData))]