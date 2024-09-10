[h:TransformData = arg(0)]
[h:OtherSubeffectData = arg(1)]
[h:AHLTier = json.get(OtherSubeffectData,"AHLTier")]
[h:ParentToken = json.get(OtherSubeffectData,"ParentToken")]
[h:TargetTokens = json.get(OtherSubeffectData,"Targets")]
[h:Duration = json.get(OtherSubeffectData,"Duration")]
[h:switchToken(ParentToken)]

[h:TransformPrereqs = json.get(TransformData,"Prereqs")]

[h:AllCRMax = "[]"]
[h,if(json.contains(TransformPrereqs,"CRMaximum")),CODE:{
	[h:CRMaxData = json.get(TransformPrereqs,"CRMaximum")]
	[h,if(json.get(CRMaxData,"isLevelBased") == 1),CODE:{
		[h,foreach(Target,TargetTokens): AllCRMax = json.append(AllCRMax,eval(
			max(
				getProperty("a5e.stat.Level",Target),
				getProperty("a5e.stat.CR",Target))
			+ if(json.get(CRMaxData,"LevelModifierHow") == "Add","+","*")
			+ number(json.get(CRMaxData,"LevelModifier"))
		))]

		[h:finalCRMax = math.arrayMax(AllCRMax)]
	};{
		[h:CRMax = json.get(CRMaxData,"CRMax")]
		[h:CRMaxAHL = json.get(CRMaxData,"CRMaxAHL")]
		[h:CRMaxAHLScaling = json.get(CRMaxData,"CRMaxAHLScaling")]
		[h:CRMaxAHLScalingMethod = json.get(CRMaxData,"CRMaxAHLScalingMethod")]

		[h,if(number(CRMaxAHLScaling) > 0):
			finalCRMax = eval(CRMax + if(CRMaxAHLScalingMethod == "Add","+","*") + floor(AHLTier/CRMaxAHLScaling));
			finalCRMax = CRMax
		]
	}]

	[h,count(json.length(TargetTokens)): AllCRMax = json.append(AllCRMax,finalCRMax)]
	[h:TransformPrereqs = json.set(TransformPrereqs,"CRMaximum",finalCRMax)]
}]

[h:validTransformations = js.a5e.FilterCreatures(data.getData("addon:","pm.a5e.core","sb.Bestiary"),TransformPrereqs,ParentToken)]
[h:TransformData = json.remove(TransformData,"Prereqs")]

[h:vaildTransformationsByCRMax = "{}"]
[h:optionNamesByCRMax = "{}"]
[h:uniqueCRMax = json.unique(AllCRMax)]
[h,foreach(CR,uniqueCRMax),CODE:{
	[h,if(CR == finalCRMax):
		thisCRValidTransformations = validTransformations;
		thisCRValidTransformations = js.a5e.FilterCreatures(validTransformations,json.set("","CRMaximum",CR),ParentToken)
	]
	[h:vaildTransformationsByCRMax = json.set(vaildTransformationsByCRMax,CR,thisCRValidTransformations)]

	[h:TransformOptionNamesFinal = "[]"]
	[h,foreach(Transform,thisCRValidTransformations),CODE:{
		[h:TransformDisplayData = json.get(Transform,"MTProperties")]
		[h:TransformOptionNamesFinal = json.append(TransformOptionNamesFinal,base64.decode(json.get(TransformDisplayData,"name"))+" "+json.get(TransformDisplayData,"tokenImage"))]
	}]
	[h:optionNamesByCRMax = json.set(optionNamesByCRMax,CR,TransformOptionNamesFinal)]
}]

[h:transformInput = ""]
[h:transformationChoices = "{}"]
[h:multipleTransformationsTest = 0]
[h,switch(json.length(validTransformations)),CODE:
	case 0:{
		[h:assert(0,"No valid transformations found in the bestiary!")]
		[h:transformationDisplay = ""]
	};
	case 1:{
		[h:transformation = json.get(validTransformations,0)]
		[h,foreach(Target,TargetTokens): transformationChoices = json.set(transformationChoices,Target,transformation)]
		[h:transformationDisplay = base64.decode(json.get(json.get(transformation,"MTProperties"),"name"))]
	};
	default:{
		[h:safeCounter = 0]
		[h:transformInput = " junkVar | ------------------ Choose Transformations ------------------ |  | LABEL | SPAN=TRUE "]
		[h,if(json.length(TargetTokens) > 1),foreach(target,TargetTokens),CODE:{
			[h:thisTargetCRMax = json.get(AllCRMax,safeCounter)]
			[h:thisTargetOptions = json.get(optionNamesByCRMax,thisTargetCRMax)]

			[h:transformInput = listAppend(transformInput," TransformChoiceIndex"+safeCounter+" | "+thisTargetOptions+" | "+getName(target)+" | LIST | ICON=TRUE ICONSIZE=50 DELIMITER=JSON "," ## ")]

			[h:safeCounter = safeCounter + 1]
		}]

		[h,if(json.length(TargetTokens) == 1): transformInput = " TransformChoiceIndex0 | "+TransformOptionNamesFinal+" | Choose a Transformation | LIST | ICON=TRUE ICONSIZE=50 DELIMITER=JSON "]

		[h:abort(input(transformInput))]

		[h:safeCounter = 0]
		[h:transformationNames = "[]"]
		[h:transformationDisplayArray = "[]"]
		[h,foreach(target,TargetTokens),CODE:{
			[h:thisTargetCRMax = json.get(AllCRMax,safeCounter)]
			[h:thisTargetOptions = json.get(vaildTransformationsByCRMax,thisTargetCRMax)]

			[h:thisTargetChoice = json.get(thisTargetOptions,eval("TransformChoiceIndex"+safeCounter))]
			[h:transformationChoices = json.set(transformationChoices,target,thisTargetChoice)]

			[h:thisChoiceName = base64.decode(json.get(json.get(thisTargetChoice,"MTProperties"),"name"))]
			[h:transformationNames = json.append(transformationNames,thisChoiceName)]
			[h:transformationDisplayArray = json.append(transformationDisplayArray,getName(target)+": "+thisChoiceName)]
			[h:safeCounter = safeCounter + 1]
		}]

		[h:uniqueTransformations = json.unique(transformationNames)]
		[h:multipleTransformationsTest = json.length(uniqueTransformations) > 1]
		[h,if(multipleTransformationsTest):
			transformationDisplay = pm.a5e.CreateDisplayList(transformationDisplayArray,"",json.set("","isVariableDelimiter",1));
			transformationDisplay = thisChoiceName
		]
	}
]

[h:"<-- Note: TempHP gained from new form will be done as part of gaining the form, since it would otherwise be overwritten (?) -->"]

[h:TransformData = json.append("",json.set(TransformData,
	"Transformations",transformationChoices,
	"ParentToken",ParentToken
))]

[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header","Transformation"+if(multipleTransformationsTest,"s",""),
	"FalseHeader","",
	"FullContents",transformationDisplay,
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:TransformReturnData = json.set("",
	"Transform",TransformData,
	"Table",abilityTable
)]

[h:return(0,TransformReturnData)]