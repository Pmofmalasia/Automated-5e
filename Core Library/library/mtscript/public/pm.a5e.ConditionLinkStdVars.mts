[h:abilityName = pm.RemoveSpecial(abilityName)]
[h:abilitySubclass = pm.RemoveSpecial(abilitySubclass)]
[h:abilityPriorData = arg(0)]
[h:ParentToken=json.get(abilityPriorData,"ParentToken")]

[h:abilityInfo = abilityPriorData]

[h,if(json.isEmpty(abilityInfo)):
	assert(0,"Condition "+abilityDisplayName+" not found on "+getName(ParentToken)+"!");
	abilityInfo = json.get(abilityInfo,0)
]

[h:cond.Library = json.get(abilityInfo,"Library")]
[h:cond.SetBy = json.get(abilityInfo,"SetBy")]
[h:cond.OnItem = json.get(abilityInfo,"ItemID")]

[h:DisplayObject = json.get(abilityInfo,"Settings")]
[h,if(DisplayObject == ""): DisplayObject = "{}"]

[h:IsTooltip = json.get(arg(0),"IsTooltip")]
[h:abilityContext = json.get(arg(0),"Context")]
[h:pm.a5e.OverarchingContext = json.get(arg(0),"OverarchingContext")]

[h:Flavor=json.get(DisplayObject,"Flavor")]
[h:needsSplitGMOutput=if(json.get(DisplayObject,"needsSplitGMOutput")=="",if(getProperty("a5e.stat.Allegiance")=="Enemy",min(number(data.getData("addon:","pm.a5e.core","HideEnemyMacros")),1),if(getProperty("a5e.stat.Allegiance")=="Ally",min(number(data.getData("addon:","pm.a5e.core","HideAllyMacros")),1),0)),json.get(DisplayObject,"needsSplitGMOutput"))]
[h:BorderColorOverride=json.get(DisplayObject,"BorderColorOverride")]
[h:TitleFontColorOverride=json.get(DisplayObject,"TitleFontColorOverride")]
[h:AccentBackgroundOverride=json.get(DisplayObject,"AccentBackgroundOverride")]
[h:AccentTextOverride=json.get(DisplayObject,"AccentTextOverride")]
[h:TitleFont=json.get(DisplayObject,"TitleFont")]
[h:BodyFont=json.get(DisplayObject,"BodyFont")]
[h:AuraColor=json.get(DisplayObject,"AuraColor")]
[h:ShowFullRulesOverride=json.get(DisplayObject,"ShowFullRulesOverride")]
[h:ForcedSummonName=json.get(DisplayObject,"ForcedSummonName")]
[h:ForcedSummonImage=json.get(DisplayObject,"ForcedSummonImage")]
[h:ForcedSummonPortrait=json.get(DisplayObject,"ForcedSummonPortrait")]
[h:ForcedSummonHandout=json.get(DisplayObject,"ForcedSummonHandout")]
[h:ShowFullRules=if(IsTooltip,1,if(ShowFullRulesOverride=="",if(data.getData("addon:","pm.a5e.core","ChatIndividual")==1,getProperty("a5e.stat.FullAbilityRules"),data.getData("addon:","pm.a5e.core","FullAbilityRules")),ShowFullRulesOverride))]
[h:abilityTable="[]"]

[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]

[h:abilityInfo = json.set(abilityInfo,
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"Tooltip",IsTooltip,
	"needsSplitGMOutput",needsSplitGMOutput,
	"FullRules",ShowFullRules,
	"BorderColorOverride",BorderColorOverride,
	"TitleFontColorOverride",TitleFontColorOverride,
	"AccentBackgroundOverride",AccentBackgroundOverride,
	"AccentTextOverride",AccentTextOverride,
	"TitleFont",TitleFont,
	"BodyFont",BodyFont,
	"OverarchingContext",pm.a5e.OverarchingContext,
	"Context",abilityContext,
	"Type","Condition",
	"DisplayName",abilityDisplayName,
	"FalseName",abilityFalseName,
	"UnifiedAbilities",a5e.UnifiedAbilities
)]
		
[h:cond.NeedsSetByInfo = json.append(pm.GetClasses("Name","json"),"Feat")]
[h,if(json.contains(cond.NeedsSetByInfo,abilityClass)),CODE:{
	[h:setByStillAvailable = json.contains(getTokens("json"),cond.SetBy)]
	[h,if(setByStillAvailable),CODE:{
		[h:switchToken(cond.SetBy)]
		[h:cond.SetByAbilities = a5e.GatherAbilities(cond.SetBy)]
		[h,if(json.get(abilityInfo,"Master") == ""):
			cond.LevelPath = pm.a5e.PathFeatureFilter(abilityInfo);
			cond.LevelPath = pm.a5e.PathFeatureFilter(json.get(abilityInfo,"Master"))
		]
		[h:abilityLevel = json.get(json.path.read(getProperty("a5e.stat.AllFeatures"),"\$[*][?("+cond.LevelPath+")]['Level']"),0)]
		[h,if(json.get(abilityInfo,"HasTiers")==1):
			abilityTier = math.arraySum(json.path.read(getProperty("a5e.stat.ConditionList"),"\$[*][?(@.Name=='"+abilityName+"')]['Level']"));
			abilityTier = json.get(abilityInfo,"Level")
		]
		[h:switchToken(ParentToken)]		
	};{
		[h:abilityLevel = 1]
		[h:abilityTier = json.get(abilityInfo,"Level")]
	}]
};{
	[h:abilityLevel = json.get(abilityInfo,"Level")]
	[h,if(json.get(abilityInfo,"HasTiers")==1):
		abilityTier = math.arraySum(json.path.read(getProperty("a5e.stat.ConditionList"),"\$[*][?(@.Name=='"+abilityName+"')]['Level']"));
		abilityTier = abilityLevel
	]
	[h:SetByAbilities = "[]"]
}]

[h:pm.a5e.BaseEffectData = json.set("",
	"Class",abilityClass,
	"DisplayName",abilityDisplayName,
	"FalseName",abilityFalseName,
	"Type","Feature",
	"ID",pm.a5e.GenerateEffectID(),
	"ParentToken",ParentToken
)]

[h:pm.a5e.EffectData = json.append("",pm.a5e.BaseEffectData)]

[h:SummonCustomization = json.set("",
	"Name",ForcedSummonName,
	"Image",ForcedSummonImage,
	"Portrait",ForcedSummonPortrait,
	"Handout",ForcedSummonHandout
)]

[h:FeatureDescription = if(ShowFullRules,FeatureFullDescription,FeatureAbridgedDescription)]