[h:cond.abilityName = pm.RemoveSpecial(cond.abilityName)]
[h:cond.abilitySubclass = pm.RemoveSpecial(cond.abilitySubclass)]
[h:cond.Context = arg(0)]
[h:cond.Info = pass.abilityInfo]
[h:cond.Library = json.get(cond.Info,"Library")]

[h:cond.DisplayObject = json.get(cond.Info,"Settings")]
[h,if(cond.DisplayObject == ""): cond.DisplayObject = "{}"]

[h,if(cond.Context!="AfterAbility"): IsTooltip=0]
[h:cond.Flavor=json.get(cond.DisplayObject,"Flavor")]
[h:cond.needsSplitGMOutput=if(json.get(cond.DisplayObject,"needsSplitGMOutput")=="",if(getProperty("a5e.stat.Allegiance")=="Enemy",min(number(data.getData("addon:","pm.a5e.core","HideEnemyMacros")),1),if(getProperty("a5e.stat.Allegiance")=="Ally",min(number(data.getData("addon:","pm.a5e.core","HideAllyMacros")),1),0)),json.get(cond.DisplayObject,"needsSplitGMOutput"))]
[h:cond.BorderColorOverride=json.get(cond.DisplayObject,"BorderColorOverride")]
[h:cond.TitleFontColorOverride=json.get(cond.DisplayObject,"TitleFontColorOverride")]
[h:cond.AccentBackgroundOverride=json.get(cond.DisplayObject,"AccentBackgroundOverride")]
[h:cond.AccentTextOverride=json.get(cond.DisplayObject,"AccentTextOverride")]
[h:cond.TitleFont=json.get(cond.DisplayObject,"TitleFont")]
[h:cond.BodyFont=json.get(cond.DisplayObject,"BodyFont")]
[h:cond.AuraColor=json.get(cond.DisplayObject,"AuraColor")]
[h:cond.ShowFullRulesOverride=json.get(cond.DisplayObject,"ShowFullRulesOverride")]
[h:cond.ForcedSummonName=json.get(cond.DisplayObject,"ForcedSummonName")]
[h:cond.ForcedSummonImage=json.get(cond.DisplayObject,"ForcedSummonImage")]
[h:cond.ForcedSummonPortrait=json.get(cond.DisplayObject,"ForcedSummonPortrait")]
[h:cond.ForcedSummonHandout=json.get(cond.DisplayObject,"ForcedSummonHandout")]
[h:cond.ShowFullRules=if(IsTooltip,1,if(cond.ShowFullRulesOverride=="",if(number(data.getData("addon:","pm.a5e.core","ChatIndividual")),getProperty("a5e.stat.FullAbilityRules"),data.getData("addon:","pm.a5e.core","FullAbilityRules")),cond.ShowFullRulesOverride))]

[h:cond.SetBy = json.get(cond.Info,"SetBy")]
[h:cond.OnItem = json.get(cond.Info,"ItemID")]
[h:cond.abilityInfo = json.set(cond.Info,
	"DisplayName",cond.abilityDisplayName,
	"Tooltip",IsTooltip,
	"Type","Condition",
	"ParentToken",ParentToken,
	"OverarchingContext",pm.a5e.OverarchingContext,
	"UnifiedAbilities",a5e.UnifiedAbilities,
	"Context",cond.Context,
	"FullRules",cond.ShowFullRules
)]

[h:cond.NeedsSetByInfo = json.append(pm.GetClasses("Name","json"),"Feat")]
[h,if(json.contains(cond.NeedsSetByInfo,cond.abilityClass)),CODE:{
	[h:setByStillAvailable = json.contains(getTokens("json"),cond.SetBy)]
	[h,if(setByStillAvailable),CODE:{
		[h:switchToken(cond.SetBy)]
		[h:cond.SetByAbilities = a5e.GatherAbilities(cond.SetBy)]
		[h,if(json.get(cond.abilityInfo,"Master") == ""):
			cond.LevelPath = pm.a5e.PathFeatureFilter(cond.abilityInfo);
			cond.LevelPath = pm.a5e.PathFeatureFilter(json.get(cond.abilityInfo,"Master"))
		]
		[h:cond.abilityLevel = json.get(json.path.read(getProperty("a5e.stat.AllFeatures"),"[*][?("+cond.LevelPath+")]['Level']"),0)]
		[h,if(json.get(cond.Info,"HasTiers")==1):
			cond.abilityTier = math.arraySum(json.path.read(getProperty("a5e.stat.ConditionList"),"[*][?(@.Name=='"+cond.abilityName+"')]['Level']"));
			cond.abilityTier = json.get(cond.Info,"Level")
		]
		[h:switchToken(ParentToken)]		
	};{
		[h:cond.abilityLevel = 1]
		[h:cond.abilityTier = json.get(cond.Info,"Level")]
	}]
};{
	[h:cond.abilityLevel = json.get(cond.Info,"Level")]
	[h,if(json.get(cond.Info,"HasTiers")==1): cond.abilityTier = math.arraySum(json.path.read(getProperty("a5e.stat.ConditionList"),"[*][?(@.Name=='"+cond.abilityName+"')]['Level']")); cond.abilityTier = cond.abilityLevel]
	[h:cond.SetByAbilities = "[]"]
}]

[h:cond.SummonCustomization = json.set("",
	"Name",cond.ForcedSummonName,
	"Image",cond.ForcedSummonImage,
	"Portrait",cond.ForcedSummonPortrait,
	"Handout",cond.ForcedSummonHandout
)]

[h:cond.FeatureDescription = if(cond.ShowFullRules,cond.FeatureFullDescription,cond.FeatureAbridgedDescription)]