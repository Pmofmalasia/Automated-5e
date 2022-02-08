[h:pass.abilityDisplayName=pass.abilityName]
[h:pass.abilityName=pm.RemoveSpecial(pass.abilityName)]
[h:pass.abilitySubclass=pm.RemoveSpecial(pass.abilitySubclass)]
[h:pass.DisplayArray = json.path.read(allAbilities,"[?(@.Name=='"+pass.abilityName+"')]['Settings']")]
[h,if(pass.DisplayArray == "[]"),CODE:{
	[h:pass.DisplayObject = "{}"]
};{
	[h:pass.DisplayObject = json.get(DisplayArray,0)]
}]

[h,if(arg(0)!="AfterAbility"): IsTooltip=0]
[h:pass.Flavor=json.get(pass.DisplayObject,"Flavor")]
[h:pass.DMOnly=if(json.get(pass.DisplayObject,"DMOnly")=="",if(PC.Ally.Enemy==2,min(number(getLibProperty("HideEnemyMacros","Lib:pm.a5e.Core")),1),if(PC.Ally.Enemy==1,min(number(getLibProperty("HideAllyMacros","Lib:pm.a5e.Core")),1),0)),json.get(pass.DisplayObject,"DMOnly"))]
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
[h:pass.ShowFullRules=if(IsTooltip,1,if(pass.ShowFullRulesOverride=="",if(number(getLibProperty("ChatIndividual","Lib:pm.a5e.Core")),FullAbilityRules,getLibProperty("FullAbilityRules","Lib:pm.a5e.Core")),pass.ShowFullRulesOverride))]
[h:pass.abilityInfo=json.set("","Name",pass.abilityName,"Class",pass.abilityClass,"Subclass",pass.abilitySubclass,"DisplayName",pass.abilityDisplayName,"Tooltip",0)]
[h:pass.SummonCustomization = json.set("",
	"Name",pass.ForcedSummonName,
	"Image",pass.ForcedSummonImage,
	"Portrait",pass.ForcedSummonPortrait,
	"Handout",pass.ForcedSummonHandout
	)]