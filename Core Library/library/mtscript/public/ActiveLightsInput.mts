[h:LightData = macro.args]
[h:ParentToken = json.get(LightData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:AllLightTypes = pm.a5e.Lights(ParentToken)]

[h:"<!-- TODO UseTime: Last detail needed for lights in input: Use time requried to change configuration -->"]

[h:ActiveLights = getLights("*","json")]
[h:ConfigurableLights = "[]"]
[h:ConfigurableLightInput = ""]
[h:ConfigurableLightNames = "[]"]
[h:ConfigurableLightsNumber = 0]
[h:StaticLightInput = ""]
[h:lightsToActivate = "[]"]
[h,foreach(lightFeature,AllLightTypes),CODE:{
	[h:thisLightOptions = "[]"]
	[h:thisLightAllNames = "[]"]
	[h:light = json.get(lightFeature,"CallLights")]
	[h:thisLightAllConfigurations = json.get(light,"Lights")]
	[h,foreach(configuration,thisLightAllConfigurations),CODE:{
		[h:lightType = json.get(configuration,"LightType")]
		[h:lightUnits = pm.StandardRange(json.get(configuration,"Units"))]
		[h:lightDistanceDisplay = json.get(configuration,"Value")]
		[h:lightSecondaryDistanceDisplay = json.get(configuration,"SecondaryValue")]

		[h,if(lightUnits == "Miles"):
			lightDistance = lightDistanceDisplay * 5280;
			lightDistance = lightDistanceDisplay
		]

		[h,if(lightSecondaryDistanceDisplay != ""):
			lightSecondaryDistance = if(lightUnits == "Miles",lightSecondaryDistanceDisplay * 5280,lightSecondaryDistanceDisplay);
			lightSecondaryDistance = ""
		]

		[h,if(json.get(configuration,"Shape") == "Cone"):
			lightAngle = "90";
			lightAngle = ""
		]

		[h,if(lightType == "Covered"):
			lightTypeDisplay = "Covered";
			lightTypeDisplay = lightDistanceDisplay + if(lightSecondaryDistance != "","/"+lightSecondaryDistanceDisplay,"") + " " + lightUnits + if(lightAngle != ""," Cone","")
		]
		[h,if(lightType == "Covered"):
			lightName = "Covered";
			lightName = if(lightType=="BrightDim","Bright/Dim",lightType)+" - "+lightDistance+if(lightAngle=="","","Angle"+lightAngle)
		]

		[h:thisLightOptions = json.append(thisLightOptions,lightTypeDisplay)]
		[h:thisLightAllNames = json.append(thisLightAllNames,lightName)]
	}]

	[h:lightDisplayName = json.get(lightFeature,"DisplayName")]
	[h:isStatic = (json.length(thisLightAllConfigurations) == 1)]
	[h,if(isStatic),CODE:{
		[h:lightsToActivate = json.merge(lightsToActivate,thisLightAllNames)]
		[h:StaticLightInput = listAppend(StaticLightInput," junkVar | "+lightDisplayName+": "+lightTypeDisplay+" |  | LABEL | SPAN=TRUE "," ## ")]
	};{
		[h:currentConfiguration = json.get(light,"CurrentConfiguration")]
		[h:ConfigurableLights = json.append(ConfigurableLights,lightFeature)]
		[h:ConfigurableLightNames = json.append(ConfigurableLightNames,thisLightAllNames)]
		[h:ConfigurableLightInput = listAppend(ConfigurableLightInput," choice"+ConfigurableLightsNumber+" | "+thisLightOptions+" | "+lightDisplayName+" | RADIO | DELIMITER=JSON SELECT="+currentConfiguration," ## ")]
		[h:ConfigurableLightsNumber = ConfigurableLightsNumber + 1]
	}]
}]

[h,if(ConfigurableLightInput != ""): ConfigurableLightInput = " junkVar | ------- Configurable Lights ------- |  | LABEL | SPAN=TRUE ## " + ConfigurableLightInput]

[h,if(StaticLightInput != ""): StaticLightInput = " junkVar | ------ Current Static Lights ------ |  | LABEL | SPAN=TRUE ## " + StaticLightInput]

[h,if(StaticLightInput == ""),CODE:{
	[h,if(ConfigurableLightInput == ""):
		FinalLightInput = " junkVar | ------ No Active Lights ------ |  | LABEL | SPAN=TRUE";
		FinalLightInput = ConfigurableLightInput
	]
};{
	[h,if(ConfigurableLightInput == ""):
		FinalLightInput = StaticLightInput;
		FinalLightInput = ConfigurableLightInput + " ## " + StaticLightInput
	]
}]

[h:abort(input(FinalLightInput))]

[h,foreach(configurableLight,ConfigurableLights),CODE:{
	[h:configurationIndex = eval("choice"+roll.count)]
	[h:whichConfiguration = json.get(json.get(ConfigurableLightNames,roll.count),configurationIndex)]
	[h,if(whichConfiguration != "Covered"): lightsToActivate = json.append(lightsToActivate,whichConfiguration)]

	[h:updatePropertyData = pm.a5e.ResourceSourceData(json.get(configurableLight,"AbilityType"),configurableLight)]
	[h:lightSourceProperty = json.get(updatePropertyData,"Property")]
	[h:lightSourcePath = json.get(updatePropertyData,"Path")]
	[h:oldProperty = getProperty(lightSourceProperty)]
	[h:newProperty = json.path.set(oldProperty,lightSourcePath+"['CallLights']['CurrentConfiguration']",configurationIndex)]
	[h:setProperty(lightSourceProperty,newProperty)]
}]

[h:clearLights()]
[h,foreach(light,lightsToActivate): setLight("A5E_Lights",light,1)]