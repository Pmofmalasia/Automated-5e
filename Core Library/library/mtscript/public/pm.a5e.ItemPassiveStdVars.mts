[h:pass.abilityName = pm.RemoveSpecial(pass.abilityName)]
[h:pass.abilitySubclass = pm.RemoveSpecial(pass.abilitySubclass)]
[h:pass.Context = arg(0)]
[h:pass.DisplayObject = json.get(pass.abilityInfo,"Settings")]
[h,if(pass.DisplayObject == ""): pass.DisplayObject = "{}"]
[h:"<!-- Note: pass.abilityInfo is set in pm.PassiveFunction -->"]

[h:pass.Flavor=json.get(pass.DisplayObject,"Flavor")]
[h:pass.needsSplitGMOutput=if(json.get(pass.DisplayObject,"needsSplitGMOutput")=="",if(getProperty("a5e.stat.Allegiance")=="Enemy",min(number(data.getData("addon:","pm.a5e.core","HideEnemyMacros")),1),if(getProperty("a5e.stat.Allegiance")=="Ally",min(number(data.getData("addon:","pm.a5e.core","HideAllyMacros")),1),0)),json.get(pass.DisplayObject,"needsSplitGMOutput"))]
[h:pass.BorderColorOverride=json.get(pass.DisplayObject,"BorderColorOverride")]
[h:pass.TitleFontColorOverride=json.get(pass.DisplayObject,"TitleFontColorOverride")]
[h:pass.AccentBackgroundOverride=json.get(pass.DisplayObject,"AccentBackgroundOverride")]
[h:pass.AccentTextOverride=json.get(pass.DisplayObject,"AccentTextOverride")]
[h:pass.TitleFont=json.get(pass.DisplayObject,"TitleFont")]
[h:pass.BodyFont=json.get(pass.DisplayObject,"BodyFont")]
[h:pass.AuraColor=json.get(pass.DisplayObject,"AuraColor")]
[h:pass.ShowFullRulesOverride=json.get(pass.DisplayObject,"ShowFullRulesOverride")]
[h:pass.ForcedSummonName=json.get(pass.DisplayObject,"ForcedSummonName")]
[h:pass.ForcedSummonImage=json.get(pass.DisplayObject,"ForcedSummonImage")]
[h:pass.ForcedSummonPortrait=json.get(pass.DisplayObject,"ForcedSummonPortrait")]
[h:pass.ForcedSummonHandout=json.get(pass.DisplayObject,"ForcedSummonHandout")]
[h:pass.ShowFullRules=if(IsTooltip,1,if(pass.ShowFullRulesOverride=="",if(number(data.getData("addon:","pm.a5e.core","ChatIndividual")),getProperty("a5e.stat.FullAbilityRules"),data.getData("addon:","pm.a5e.core","FullAbilityRules")),pass.ShowFullRulesOverride))]

[h:pass.abilityInfo = json.set(pass.abilityInfo,
	"DisplayName",pass.abilityDisplayName,
	"Context",pass.Context,
	"OverarchingContext",pm.a5e.OverarchingContext,
	"UnifiedAbilities",a5e.UnifiedAbilities,
	"Tooltip",IsTooltip,
	"ParentToken",ParentToken,
	"Type","Feature",
	"FullRules",pass.ShowFullRules
)]

[h:pass.abilityLevel = json.get(pass.abilityInfo,"Level")]

[h:tempPrimeStatInfo = pm.a5e.GetFeaturePrimeStat(pass.abilityInfo)]
[h:pass.abilityPrimeStat = json.get(tempPrimeStatInfo,"PrimeStat")]
[h:pass.abilityPrimeStatValue = json.get(tempPrimeStatInfo,"PrimeStatValue")]
[h:pass.abilityPrimeStatMod = json.get(tempPrimeStatInfo,"PrimeStatMod")]

[h:pass.SummonCustomization = json.set("",
	"Name",pass.ForcedSummonName,
	"Image",pass.ForcedSummonImage,
	"Portrait",pass.ForcedSummonPortrait,
	"Handout",pass.ForcedSummonHandout
)]

[h:pass.FeatureDescription = if(pass.ShowFullRules,pass.FeatureFullDescription,pass.FeatureAbridgedDescription)]