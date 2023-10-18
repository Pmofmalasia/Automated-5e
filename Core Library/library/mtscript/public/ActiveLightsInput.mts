[h:LightData = macro.args]
[h:ParentToken = json.get(LightData,"ParentToken")]

[h:AllLightTypes = pm.a5e.Lights(ParentToken)]

[h:CoverableLights = json.path.read(AllLightTypes,"\$[*][?(@.isCoverable == 1 && @.isCoverable != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:PermanentLights = json.difference(AllLightTypes,CoverableLights)]
[h:ActiveLights = getLights("*","json")]

[h:CoverableLightInput = ""]
[h:CoverableLightNames = "[]"]
[h,foreach(light,CoverableLights),CODE:{
	[h:lightType = json.get(light,"Type")]
	[h:lightDistance = json.get(light,"Distance")]
	[h:lightAngle = json.get(light,"Angle")]
	[h:lightTypeDisplayName = pm.GetDisplayName(lightType,"sb.Lights")]
	[h:lightName = lightType+lightDistance+if(lightAngle=="","","Angle"+lightAngle)]

	[h:CoverableLightNames = json.append(CoverableLightNames,lightName)]
	[h:CoverableLightInput = listAppend(CoverableLightInput," choice"+roll.count+" | "+json.contains(ActiveLights,lightName)+" | "+lightTypeDisplay+" | CHECK "," ## ")]
}]

[h,if(CoverableLightInput != ""): CoverableLightInput = " junkVar | ------------ Available Coverable Lights ------------ |  | LABEL | SPAN=TRUE ## " + CoverableLightInput]

[h:PermanentLightInput = ""]
[h:PermanentLightNames = "[]"]
[h,foreach(light,PermanentLights),CODE:{
	[h:lightType = json.get(light,"Type")]
	[h:lightDistance = json.get(light,"Distance")]
	[h:lightAngle = json.get(light,"Angle")]
	[h:lightTypeDisplayName = pm.GetDisplayName(lightType,"sb.Lights")]
	[h:lightName = lightType+lightDistance+if(lightAngle=="","","Angle"+lightAngle)]

	[h:PermanentLightNames = json.append(PermanentLightNames,lightName)]
	[h:PermanentLightInput = listAppend(" junkVar | "+lightTypeDisplay+" |  | LABEL | SPAN=TRUE "," ## ")]
}]

[h,if(PermanentLightInput != ""): PermanentLightInput = " junkVar | ------------ Current Permanent Lights ------------ |  | LABEL | SPAN=TRUE ## " + PermanentLightInput]

[h,if(PermanentLightInput == ""),CODE:{
	[h,if(CoverableLightInput == ""):
		assert(0,"There are currently no lights active on this token!");
		FinalLightInput = CoverableLightInput
	]
};{
	[h,if(CoverableLightInput == ""):
		FinalLightInput = PermanentLightInput;
		FinalLightInput = CoverableLightInput + " ## " + PermanentLightInput
	]
}]

[h:abort(input(FinalLightInput))]

[h:NewActiveLights = PermanentLightNames]

[h,foreach(coverableLight,CoverableLightNames),CODE:{
	[h:validLightTest = eval("choice"+roll.count)]
	[h,if(validLightTest): NewActiveLights = json.append(NewActiveLights,coverableLight)]
}]

[h:clearLights()]
[h,foreach(light,NewActiveLights): setLight("A5E_Lights",light,1)]