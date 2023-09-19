[h:VisionData = macro.args]
[h:ParentToken = json.get(VisionData,"ParentToken")]

[h:AllVisionTypes = pm.a5e.Vision(ParentToken)]

[h:SightNames = "[]"]
[h:VisionTypeNames = json.fields(AllVisionTypes,"json")]
[h,foreach(visionType,VisionTypeNames),CODE:{
	[h:VisionTypeData = json.get(AllVisionTypes,visionType)]
	[h:visionTypeDisplay = pm.GetDisplayName(visionType,"sb.VisionTypes")]
	[h,if(json.get(VisionTypeData,"Unlimited") == 1),CODE:{
		[h:SightNames = json.append(SightNames,visionTypeDisplay+": Unlimited")]
	};{
		[h:SightNames = json.append(SightNames,visionTypeDisplay+": "+json.get(VisionTypeData,"Value"))]
	}]
}]

[h:NormalSightTest = json.equals(json.get(AllVisionTypes,"NormalSight"),json.set("","Unlimited",1))]

[h,if(json.isEmpty(VisionTypeNames)),CODE:{
	[h:SightNames = json.append("","Blind")]
	[h:AllVisionTypes = json.set("","Blind","{}")]
}]
[h:"<!-- TODO: Add backup for blinded option only here -->"]

[h:abort(input(
	" visionChoice | "+SightNames+" | Choose Active Sight Type | RADIO | DELIMITER=JSON "
))]

[h:chosenVisionType = json.get(VisionTypeNames,visionChoice)]
[h,if(chosenVisionType == "Blind"),CODE:{
	[h:finalVisionString = "Blind"]
};{
	[h:chosenVisionTypeData = json.get(AllVisionTypes,chosenVisionType)]
	[h,if(json.get(chosenVisionTypeData,"Unlimited") == 1):
		finalVisionString = chosenVisionType+" - Unlimited";
		finalVisionString = chosenVisionType+" - "+json.get(chosenVisionTypeData,"Value")
	]
	[h,if(!NormalSightTest): finalVisionString = "Only"+finalVisionString]	
}]

[h:setSightType(finalVisionString)]