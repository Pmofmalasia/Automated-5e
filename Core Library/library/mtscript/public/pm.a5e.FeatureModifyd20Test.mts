[h:AllEffectData = arg(1)]
[h,if(json.type(AllEffectData)=="OBJECT"): AllEffectData = json.append("",AllEffectData)]

[h:EffectModificationData = arg(2)]
[h,if(json.type(EffectModificationData)=="OBJECT"),CODE:{
    [h:RerollInfo = json.get(EffectModificationData,"RerollInfo")]
    [h:NewBonus = json.get(EffectModificationData,"NewBonus")]
    [h:ForcedRoll = json.get(EffectModificationData,"ForcedRoll")]
};{}]

[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:return(!IsTooltip)]
[h,foreach(EffectData,AllEffectData),CODE:{
	[h:TestType = json.get(EffectData,"TestType")]
	[h:effectID = json.get(EffectData,"ID")]
	[h:EffectTarget = json.get(EffectData,"Target")]
	[h:RollData = "{}"]
	[h,switch(TestType),CODE:
		case "Check":{
			[h,if(effectID!=""): RollData = json.get(json.merge(
				json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID=="+effectID+" && @.ParentToken=='"+EffectTarget+"')]['ToResolve']['CheckDC']['DC']"),
				json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID=="+effectID+")]['ToResolve']['CheckDC']['ChecksMade']['"+EffectTarget+"']")),0)
			]
		};
		case "Save":{
			[h,if(effectID!=""): RollData = json.get(json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID=="+effectID+")]['ToResolve']['SaveDC']['SavesMade']['"+EffectTarget+"']"),0)]
		};
		case "Attack":{
			[h,if(effectID!=""): RollData = json.get(json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID=="+effectID+" && @.ParentToken=='"+EffectTarget+"')]['ToResolve']['Attack']"),0)]
		};
		default:{[h:return(0)]}
	]

	[h,if(!json.isEmpty(RollData)),CODE:{
		[h:effectRerollData = json.set(RollData,
			"IsTooltip",IsTooltip,
			"ParentToken",EffectTarget,
			"ID",effectID,
			"TestType",TestType,
			"RerollData",RerollInfo,
			"NewBonus",NewBonus,
			"ForcedRoll",ForcedRoll
		)]

		[h,MACRO("ModifyD20Test@Lib:pm.a5e.Core"): effectRerollData]
		[h:TestData = macro.return]
		[h:abilityTable = json.merge(abilityTable,json.get(TestData,"Table"))]
		[h:UpdateD20TestData = json.remove(TestData,"Table")]
		
		[h,MACRO("UpdateD20TestData@Lib:pm.a5e.Core"): UpdateD20TestData]
	};{}]
}]