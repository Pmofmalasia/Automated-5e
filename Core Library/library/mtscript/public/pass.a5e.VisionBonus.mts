[h:PassiveFeatureData = arg(0)]
[h:passSightBonus = arg(1)]

[h:addedVisionTypes = json.fields(passSightBonus,"json")]
[h,foreach(visionType,addedVisionTypes),CODE:{
	[h:newVisionTypeBonus = json.set(json.get(passSightBonus,visionType),"Name",visionType)]
	[h:VisionTypeBonuses = json.append(VisionTypeBonuses,newVisionTypeBonus)]
}]