[h:PassiveFeatureData = arg(0)]
[h:passSightBonus = arg(1)]

[h,if(json.get(passSightBonus,"Prereqs") != ""),CODE:{
	[h:meetsPrereqs = pm.a5e.EffectMeetsPrereqs("",json.get(passSightBonus,"Prereqs"),ParentToken)]
	[h,if(!meetsPrereqs): return(0)]
};{}]

[h:passSightBonus = json.remove(passSightBonus,"Prereqs")]

[h:addedVisionTypes = json.fields(passSightBonus,"json")]
[h,foreach(visionType,addedVisionTypes),CODE:{
	[h:newVisionTypeBonus = json.set(json.get(passSightBonus,visionType),"Name",visionType)]
	[h:VisionTypeBonuses = json.append(VisionTypeBonuses,newVisionTypeBonus)]
}]