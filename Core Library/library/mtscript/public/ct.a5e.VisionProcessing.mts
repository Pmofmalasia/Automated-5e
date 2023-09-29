[h:inputData = arg(0)]

[h:fullCommand = '

[h,if(pass.Context=="Vision"),CODE:{
	']
[h:effectiveCommand = ""]
[h,if(json.contains(inputData,"isVision")),CODE:{
	[h:inputData = json.remove(inputData,"isVision")]

	[h:effectiveCommand = effectiveCommand + "[h:pass.a5e.VisionBonus(pass.abilityInfo,json.set(''"]

	[h:VisionUDFObject = ""]
	[h:allVisionTypes = pm.a5e.GetCoreData("sb.VisionTypes","Name","json")]
	[h,foreach(visionType,allVisionTypes),CODE:{
		[h:IsUnlimitedTest = json.contains(inputData,"isVision"+visionType+"Unlimited")]
		[h:HasVisionTest = or(json.get(inputData,"Vision"+visionType+"Distance") != 0,IsUnlimitedTest)]
		[h,if(HasVisionTest): effectiveCommand = effectiveCommand + ",'"+visionType+"',json.set(''," + if(IsUnlimitedTest,"'Unlimited',1","'Base',"+json.get(inputData,"Vision"+visionType+"Distance")) + ")"]

		[h:inputData = json.remove(inputData,"isVision"+visionType+"Unlimited")]
		[h:inputData = json.remove(inputData,"Vision"+visionType+"Distance")]
	}]

	[h:effectiveCommand = effectiveCommand + "))]"]
};{
	[h:effectiveCommand = effectiveCommand + "[h:pass.a5e.VisionBonus(pass.abilityInfo,json.set('','NormalSight',json.set('','Unlimited',1)))]"]
}]

[h:fullCommand = fullCommand + effectiveCommand + "
}]"]

[h:return(0,json.set("","Data",inputData,"FullCommand",fullCommand,"Command",effectiveCommand))]