[h:subeffectData = arg(0)]
[h:dataKeySuffix = arg(1)]

[h:lightType = json.get(subeffectData,"lightType"+dataKeySuffix)]

[h,switch(lightType),CODE:
	case "":{};
	case "BrightDim":{
		[h:lightData = json.set("",
			"LightType",lightType,
			"IsSunlight",json.contains(subeffectData,"isSunlight"+dataKeySuffix),
			"isCoverable",json.contains(subeffectData,"lightCanBlock"+dataKeySuffix)
		)]

		[h,if(json.contains(subeffectData,"isLightUseAoESize"+dataKeySuffix)):
			lightData = json.set(lightData,
				"UseAoESize",1,
				"Units",json.get(subeffectData,"lightDistanceUnits"+dataKeySuffix),
				"SecondaryValue",json.get(subeffectData,"secondaryLightDistanceValue"+dataKeySuffix));
			lightData = json.set(lightData,
				"Value",json.get(subeffectData,"lightDistanceValue"+dataKeySuffix),
				"Units",json.get(subeffectData,"lightDistanceUnits"+dataKeySuffix),
				"SecondaryValue",json.get(subeffectData,"lightDistanceValue"+dataKeySuffix)+json.get(subeffectData,"secondaryLightDistanceValue"+dataKeySuffix))
		]

		[h:subeffectData = json.set(subeffectData,"Light",lightData)]
		[h:subeffectData = json.remove(subeffectData,"lightDistanceValue"+dataKeySuffix)]
		[h:subeffectData = json.remove(subeffectData,"lightDistanceUnits"+dataKeySuffix)]
		[h:subeffectData = json.remove(subeffectData,"secondaryLightDistanceValue"+dataKeySuffix)]
		[h:subeffectData = json.remove(subeffectData,"isSunlight"+dataKeySuffix)]
		[h:subeffectData = json.remove(subeffectData,"isLightUseAoESize"+dataKeySuffix)]
	};
	default:{
		[h:lightData = json.set("",
			"LightType",lightType,
			"IsSunlight",json.contains(subeffectData,"isSunlight"+dataKeySuffix),
			"isCoverable",json.contains(subeffectData,"lightCanBlock"+dataKeySuffix)
		)]

		[h,if(json.contains(subeffectData,"isLightUseAoESize"+dataKeySuffix)):
			lightData = json.set(lightData,"UseAoESize",1);
			lightData = json.set(lightData,
				"Value",json.get(subeffectData,"lightDistanceValue"+dataKeySuffix),
				"Units",json.get(subeffectData,"lightDistanceUnits"+dataKeySuffix))
		]

		[h:subeffectData = json.remove(subeffectData,"lightDistanceValue"+dataKeySuffix)]
		[h:subeffectData = json.remove(subeffectData,"lightDistanceUnits"+dataKeySuffix)]
		[h:subeffectData = json.remove(subeffectData,"isSunlight"+dataKeySuffix)]
		[h:subeffectData = json.remove(subeffectData,"isLightUseAoESize"+dataKeySuffix)]
		[h:subeffectData = json.remove(subeffectData,"lightCanBlock"+dataKeySuffix)]
	}
]
[h:subeffectData = json.remove(subeffectData,"lightType"+dataKeySuffix)]

[h,if(lightType != ""),CODE:{
	[h,if(json.contains(subeffectData,"isLightCone"+dataKeySuffix)): lightData = json.set(lightData,"isLightCone",1)]
	[h:subeffectData = json.remove(subeffectData,"isLightCone"+dataKeySuffix)]

	[h:subeffectData = json.set(subeffectData,"Light",lightData)]
};{}]

[h:return(0,subeffectData)]