[h:inputData = arg(0)]

[h,if(json.contains(inputData,"isVision")),CODE:{
	[h:inputData = json.remove(inputData,"isVision")]
	[h:visionData = "{}"]

	[h:allVisionTypes = pm.a5e.GetCoreData("sb.VisionTypes","Name","json")]
	[h,foreach(visionType,allVisionTypes),CODE:{
		[h:IsUnlimitedTest = json.contains(inputData,"isVision"+visionType+"Unlimited")]
		[h:HasVisionTest = or(json.get(inputData,"Vision"+visionType+"Distance") != 0,IsUnlimitedTest)]
		[h,if(HasVisionTest): visionData = json.set(visionData,
			visionType,if(IsUnlimitedTest,
				json.set("","Unlimited",1),
				json.set("","Base",json.get(inputData,"Vision"+visionType+"Distance"))
			)
		)]

		[h:inputData = json.remove(inputData,"isVision"+visionType+"Unlimited")]
		[h:inputData = json.remove(inputData,"Vision"+visionType+"Distance")]
	}]
};{
	[h:visionData = json.set("","NormalSight",json.set("","Unlimited",1))]
}]

[h:inputData = json.set(inputData,"CallVision",visionData)]
[h:return(0,inputData)]