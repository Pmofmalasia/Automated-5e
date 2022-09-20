[h:abilityName = pm.RemoveSpecial(abilityName)]
[h:abilitySubclass = pm.RemoveSpecial(abilitySubclass)]
[h:DisplayArray = json.path.read(allAbilities,"[?(@.Name=='"+abilityName+"')]['Settings']")]
[h,if(DisplayArray == "[]"),CODE:{
	[h:DisplayObject = "{}"]
};{
	[h:DisplayObject = json.get(DisplayArray,0)]
}]

[h:abilityPriorData = arg(0)]
[h:ParentToken=json.get(arg(0),"ParentToken")]
[h:IsTooltip=json.get(arg(0),"IsTooltip")]
[h:abilityContext=json.get(arg(0),"Context")]
[h:pm.a5e.OverarchingContext=json.get(arg(0),"OverarchingContext")]
[h:Flavor=json.get(DisplayObject,"Flavor")]
[h:DMOnly=if(json.get(DisplayObject,"DMOnly")=="",if(getProperty("stat.Allegiance")==2,min(number(getLibProperty("HideEnemyMacros","Lib:pm.a5e.Core")),1),if(getProperty("stat.Allegiance")==1,min(number(getLibProperty("HideAllyMacros","Lib:pm.a5e.Core")),1),0)),json.get(DisplayObject,"DMOnly"))]
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
[h:ShowFullRules=if(IsTooltip,1,if(ShowFullRulesOverride=="",if(getLibProperty("ChatIndividual","Lib:pm.a5e.Core")==1,FullAbilityRules,getLibProperty("FullAbilityRules","Lib:pm.a5e.Core")),ShowFullRulesOverride))]
[h:abilityTable="[]"]

[h:abilityInfo = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"Tooltip",IsTooltip,
	"DMOnly",DMOnly,
	"FullRules",ShowFullRules,
	"BorderColorOverride",BorderColorOverride,
	"TitleFontColorOverride",TitleFontColorOverride,
	"AccentBackgroundOverride",AccentBackgroundOverride,
	"AccentTextOverride",AccentTextOverride,
	"TitleFont",TitleFont,
	"BodyFont",BodyFont,
	"Class",abilityClass,
	"Type","Feature",
	"Subclass",abilitySubclass,
	"Name",abilityName,
	"DisplayName",abilityDisplayName,
	"FalseName",abilityFalseName
)]
		
[h:abilityLevel = pm.GetAbilityLevel(abilityInfo)]

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
	
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:abilityInfo = json.set(abilityInfo,
	"Level",abilityLevel,
	"UnifiedAbilities",a5e.UnifiedAbilities,
	"Library",ability.json.get(abilityInfo,"Library")
)]

[h:abilityEffect = if(ShowFullRules,abilityFullEffect,abilityAbridgedEffect)]