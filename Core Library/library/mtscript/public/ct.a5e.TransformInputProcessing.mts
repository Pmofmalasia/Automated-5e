[h:inputData = arg(0)]
[h:FeatureData = arg(1)]
[h:isTransform = json.get(inputData,"isTransform")]
[h:inputData = json.remove(inputData,"isTransform")]

[h:TransformData = "{}"]
[h:TransformFilter = "{}"]
[h,switch(isTransform),CODE:
	case "Unique":{


		[h:"<!-- TODO: Needs some method of creating another creature and then adding it after the fact (made for wererats, etc.) -->"]




	};
	case "Cosmetic":{
		[h:"<!-- TODO: Later... And doesn't need the later stuff. Unique probably doesn't either. -->"]

		[h:return(0,json.set("","Input",inputData,"Transform",TransformData))]
	};
	case "Single":{
		[h:TransformDisplayName = pm.EvilChars(json.get(inputData,"singleTransform"))]
		[h:TransformName = pm.RemoveSpecial(TransformDisplayName)]
		[h:TransformFilter = json.set(TransformFilter,"CreatureNameInclusive",json.append("",TransformName))]
		[h:inputData = json.remove(inputData,"singleTransform")]
	};
	case "Options":{
		[h:tempTransformOptions = json.fromList(encode(json.get(inputData,"TransformOptions")),"%0A")]
		[h:TransformOptions = "[]"]
		[h,foreach(TransformOption,tempTransformOptions),CODE:{
			[h:tempDisplayName = pm.EvilChars(decode(TransformOption))]
			[h:tempName = pm.RemoveSpecial(tempDisplayName)]
			[h:TransformOptions = json.append(TransformOptions,tempName)]
		}]
		[h:TransformFilter = json.set(TransformFilter,"CreatureNameInclusive",TransformOptions)]
		[h:inputData = json.remove(inputData,"TransformOptions")]
	};
	case "Criteria":{
		[h,if(json.get(inputData,"isCreatureTypeLimitsTransform") != ""),CODE:{
			[h:CreatureTypeReturnData = ct.a5e.CreatureTypeLimitsProcessing(inputData,"Transform")]
			[h:inputData = json.get(CreatureTypeReturnData,"InputData")]
			[h:ExclusiveInclusive = json.get(inputData,"isCreatureTypeLimitsTransform")]
			[h:TransformFilter = json.set(TransformFilter,"Type"+ExclusiveInclusive,json.get(CreatureTypeReturnData,"CreatureTypes"))]
		};{}]
		[h:inputData = json.remove(inputData,"isCreatureTypeLimitsTransform")]

		[h,if(json.get(inputData,"isCreatureSubtypeLimitsTransform") != ""),CODE:{
			[h:CreatureSubtypeReturnData = ct.a5e.CreatureSubtypeLimitsProcessing(inputData,"Transform")]
			[h:inputData = json.get(CreatureSubtypeReturnData,"InputData")]
			[h:ExclusiveInclusive = json.get(inputData,"isCreatureSubtypeLimitsTransform")]
			[h:TransformFilter = json.set(TransformFilter,"Subtype"+ExclusiveInclusive,json.get(CreatureSubtypeReturnData,"CreatureSubtypes"))]
		};{}]
		[h:inputData = json.remove(inputData,"isCreatureSubtypeLimitsTransform")]

		[h,if(json.get(inputData,"SizePrereqsTransform") != ""),CODE:{
			[h:SizePrereqReturnData = ct.a5e.SizePrerequisiteProcessing(inputData,"Transform")]
			[h:inputData = json.get(SizePrereqReturnData,"InputData")]
			[h:TransformFilter = json.merge(TransformFilter,json.get(SizePrereqReturnData,"SizeData"))]
		};{}]
		[h:inputData = json.remove(inputData,"SizePrereqsTransform")]

		[h,if(json.get(inputData,"SpeedPrereqsTransform") != ""),CODE:{
			[h:SpeedPrereqReturnData = ct.a5e.SpeedPrerequisiteProcessing(inputData,"Transform")]
			[h:inputData = json.get(SpeedPrereqReturnData,"InputData")]
			[h:TransformFilter = json.merge(TransformFilter,json.get(SpeedPrereqReturnData,"SpeedData"))]
		};{}]
		[h:inputData = json.remove(inputData,"SpeedPrereqsTransform")]

		[h,if(json.get(inputData,"TransformCRMaxMethod") == "Level"),CODE:{
			[h:LevelModifer = json.get(inputData,"TransformCRMaxModifier")]
			[h:LevelModifierHow = json.get(inputData,"TransformCRMaxModifierHow")]

			[h,if(LevelModifierHow == "Minus"): LevelModifer = -LevelModifer]
			[h,if(LevelModifierHow == "Minus"): LevelModifierHow = "Add"]
			
			[h,if(LevelModifierHow == "Divide"): LevelModifer = (1/LevelModifer)]
			[h,if(LevelModifierHow == "Divide"): LevelModifierHow = "Multiply"]

			[h:CRMaxFilter = json.set("","isLevelBased",1,"LevelModifier",LevelModifer,"LevelModifierHow",LevelModifierHow)]

			[h:inputData = json.remove(inputData,"TransformCRMaxModifier")]
			[h:inputData = json.remove(inputData,"TransformCRMaxModifierHow")]
		};{
			[h:CRMaxFilter = json.set("","CRMax",json.get(inputData,"TransformCRMax"))]
			[h,if(json.get(inputData,"TransformCRMaxAHLScaling") != 0 && json.get(inputData,"TransformCRMaxAHLScaling") != ""): CRMaxFilter = json.set(CRMaxFilter,
				"CRMaxAHL",json.get(inputData,"TransformCRMaxAHLNum"),
				"CRMaxAHLScaling",json.get(inputData,"TransformCRMaxAHLScaling"),
				"CRMaxAHLScalingMethod",json.get(inputData,"TransformCRMaxAHLScaleHow")
			)]

			[h:inputData = json.remove(inputData,"TransformCRMax")]
			[h:inputData = json.remove(inputData,"TransformCRMaxAHLNum")]
			[h:inputData = json.remove(inputData,"TransformCRMaxAHLScaling")]
			[h:inputData = json.remove(inputData,"TransformCRMaxMethod")]			
		}]
		[h:inputData = json.remove(inputData,"TransformCRMaxMethod")]

		[h:TransformFilter = json.set(TransformFilter,"CRMaximum",CRMaxFilter)]

		[h:TransformFilter = json.set(TransformFilter,"SeenCreature",1)]
	};
	default:{}
]		

[h,if(!json.isEmpty(TransformFilter)): TransformData = json.set(TransformData,"Prereqs",TransformFilter)]

[h,switch(json.get(inputData,"TransformHP")),CODE:
	case "Regular":{
		[h:HPGainData = json.set("","HP",1)]
	};
	case "TempHP":{
		[h:HPGainData = json.set("","TempHP",0)]
	};
	default:{
		[h:HPGainData = "{}"]
	}
]
[h:HPGainData = json.set(HPGainData,"HPLoss",json.get(inputData,"TransformLoseHP"))]
[h:TransformData = json.set(TransformData,"HPGain",HPGainData)]
[h:inputData = json.remove(inputData,"TransformHP")]
[h:inputData = json.remove(inputData,"TransformLoseHP")]

[h:EffectType = json.get(inputData,"EffectType")]
[h,switch(EffectType):
	case "Spell": ConditionIdentificationInfo = json.set("","Class","Spell","Subclass",json.get(FeatureData,"Name"));
	case "Weapon": ConditionIdentificationInfo = json.set("","Class","Item","Subclass",json.get(FeatureData,"Name"));
	case "Object": ConditionIdentificationInfo = json.set("","Class","Item","Subclass",json.get(FeatureData,"Name"));
	case "Feature": ConditionIdentificationInfo = json.set("","Class",json.get(FeatureData,"Class"),"Subclass",json.get(FeatureData,"Subclass"));
	default: ConditionIdentificationInfo = json.set("","Class","","Subclass","")
]

[h,switch(json.get(inputData,"TransformAttributes")),CODE:
	case "All":{
		[h:AttributeData = json.set("","All",1)]
	};
	case "RetainMental":{
		[h:AttributeData = json.set("","TypesInclusive",json.append("","Mental"))]
	};
	case "RetainPhysical":{
		[h:AttributeData = json.set("","TypesInclusive",json.append("","Physical"))]
	};
	case "None":{
		[h:AttributeData = "{}"]
	};
	default:{
		[h:allAttributes = pm.GetAttributes("Name","json")]
		[h:chosenAttributes = "[]"]
		[h,foreach(attribute,allAttributes),CODE:{
			[h,if(json.contains(inputData,"TransformAttributes"+attribute)): json.append(chosenAttributes,attribute)]
			[h:inputData = json.remove(inputData,"TransformAttributes"+attribute)]
		}]

		[h:"<!-- Note: Key will be set to Include or Exclude -->"]
		[h:AttributeData = json.set("",json.get(inputData,"TransformAttributes"),chosenAttributes)]
	}
]
[h:TransformData = json.set(TransformData,"Attributes",AttributeData)]
[h:inputData = json.remove(inputData,"TransformAttributes")]

[h:TransformData = json.set(TransformData,
	"isRetainAlignment",json.contains(inputData,"isRetainAlignment"),
	"isRetainConcentration",json.contains(inputData,"isRetainConcentration")
)]
[h:inputData = json.remove(inputData,"isRetainAlignment")]
[h:inputData = json.remove(inputData,"isRetainConcentration")]

[h:retainedFeatureTypes = ""]
[h:gainedFeatureTypes = ""]
[h:featureTypes = json.append("","Senses","Proficiencies","Spellcasting","InnateSpellcasting","LegendaryActions","LegendaryResistances","LairActions","OtherFeatures","ReasonableFeatures","ThisFeature")]
[h,foreach(type,featureTypes),CODE:{
	[h,if(json.contains(inputData,"TransformNewFeatureLimits"+type)): gainedFeatureTypes = json.append(gainedFeatureTypes,type)]
	[h,if(json.contains(inputData,"TransformOldFeatureLimits"+type)): retainedFeatureTypes = json.append(retainedFeatureTypes,type)]

	[h:inputData = json.remove(inputData,"TransformNewFeatureLimits"+type)]
	[h:inputData = json.remove(inputData,"TransformOldFeatureLimits"+type)]
}]

[h:TransformData = json.set(TransformData,
	"GainedFeatures",gainedFeatureTypes,
	"RetainedFeatures",retainedFeatureTypes,
	"isItemUsable",json.get(inputData,"TransformItemLimits"),
	"ItemDestination",json.get(inputData,"TransformItemDestination")
)]
[h:inputData = json.remove(inputData,"TransformItemLimits")]
[h:inputData = json.remove(inputData,"TransformItemDestination")]

[h:return(0,json.set("","Input",inputData,"Transform",TransformData))]