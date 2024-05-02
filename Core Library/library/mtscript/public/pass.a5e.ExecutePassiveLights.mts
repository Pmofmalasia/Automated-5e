[h:execPassiveAbilityInfo = arg(0)]
[h:newLights = arg(1)]

[h,foreach(light,newLights),CODE:{
	[h,if(json.get(light,"DisplayName") == ""): light = json.set(light,"DisplayName",json.get(execPassiveAbilityInfo,"DisplayName"))]
	[h:LightTypes = json.append(LightTypes,light)]
}]