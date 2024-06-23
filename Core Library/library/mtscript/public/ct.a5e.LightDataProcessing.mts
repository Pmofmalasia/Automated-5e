[h:subeffectData = arg(0)]
[h:dataKeySuffix = arg(1)]

[h:allLightConfigurations = "[]"]
[h:lightConfigNum = json.get(subeffectData,"LightConfigurationNumber"+dataKeySuffix)]
[h:subeffectData = json.remove(subeffectData,"LightConfigurationNumber"+dataKeySuffix)]
[h,if(lightConfigNum == ""):
	lightConfigNum = 0;
	lightConfigNum = lightConfigNum
]
[h,count(lightConfigNum),CODE:{
	[h:thisConfigurationSuffix = (roll.count + dataKeySuffix)]

	[h:lightType = json.get(subeffectData,"lightType"+thisConfigurationSuffix)]
	[h,switch(lightType),CODE:
		case "BrightDim":{
			[h:lightData = json.set("",
				"LightType",lightType,
				"isSunlight",(json.get(subeffectData,"isSunlight"+thisConfigurationSuffix)=="Sunlight")
			)]

			[h:lightData = json.set(lightData,
				"Value",json.get(subeffectData,"lightDistanceValue"+thisConfigurationSuffix),
				"Units",json.get(subeffectData,"lightDistanceUnits"+thisConfigurationSuffix),
				"SecondaryValue",json.get(subeffectData,"lightDistanceValue"+thisConfigurationSuffix)+json.get(subeffectData,"secondaryLightDistanceValue"+thisConfigurationSuffix)
			)]

			[h:subeffectData = json.remove(subeffectData,"lightDistanceValue"+thisConfigurationSuffix)]
			[h:subeffectData = json.remove(subeffectData,"lightDistanceUnits"+thisConfigurationSuffix)]
			[h:subeffectData = json.remove(subeffectData,"secondaryLightDistanceValue"+thisConfigurationSuffix)]
			[h:subeffectData = json.remove(subeffectData,"isSunlight"+thisConfigurationSuffix)]
		};
		case "Covered":{
			[h:lightData = json.set("",
				"LightType","Covered",
				"isSunlight",0,
				"Value",0,
				"Units","Feet"
			)]

			[h:subeffectData = json.remove(subeffectData,"lightDistanceValue"+thisConfigurationSuffix)]
			[h:subeffectData = json.remove(subeffectData,"lightDistanceUnits"+thisConfigurationSuffix)]
			[h:subeffectData = json.remove(subeffectData,"isSunlight"+thisConfigurationSuffix)]
		};
		default:{
			[h:lightData = json.set("",
				"LightType",lightType,
				"isSunlight",(json.get(subeffectData,"isSunlight"+thisConfigurationSuffix)=="Sunlight")
			)]

			[h:lightData = json.set(lightData,
				"Value",json.get(subeffectData,"lightDistanceValue"+thisConfigurationSuffix),
				"Units",json.get(subeffectData,"lightDistanceUnits"+thisConfigurationSuffix)
			)]

			[h:subeffectData = json.remove(subeffectData,"lightDistanceValue"+thisConfigurationSuffix)]
			[h:subeffectData = json.remove(subeffectData,"lightDistanceUnits"+thisConfigurationSuffix)]
			[h:subeffectData = json.remove(subeffectData,"isSunlight"+thisConfigurationSuffix)]
		}
	]
	[h:subeffectData = json.remove(subeffectData,"lightType"+thisConfigurationSuffix)]

	[h:lightData = json.set(lightData,"LightShape",json.get(subeffectData,"LightShape"+thisConfigurationSuffix))]
	[h:subeffectData = json.remove(subeffectData,"LightShape"+thisConfigurationSuffix)]

	[h:allLightConfigurations = json.append(allLightConfigurations,lightData)]
}]

[h:finalLightData = json.set("",
	"Lights",allLightConfigurations,
	"CurrentConfiguration",0
)]

[h,if(lightConfigNum > 1),CODE:{
	[h:UseTimeData = ct.a5e.UseTimeProcessing(subeffectData,"LightConfiguration"+dataKeySuffix)]
	[h:subeffectData = json.get(UseTimeData,"Subeffect")]
	[h:finalLightData = json.set(finalLightData,"UseTime",json.get(UseTimeData,"UseTime"))]
};{}]

[h:returnData = json.set("",
	"Subeffect",subeffectData,
	"Light",finalLightData
)]

[h:return(0,returnData)]