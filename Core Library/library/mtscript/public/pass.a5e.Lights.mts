[h:PassiveFeatureData = arg(0)]
[h:passLightBonus = arg(1)]

[h,if(json.type(passLightBonus == "OBJECT")): passLightBonus = json.append("",passLightBonus)]

[h:LightTypes = json.merge(LightTypes,passLightBonus)]