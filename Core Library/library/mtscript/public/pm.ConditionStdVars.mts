[h:cond.abilityDisplayName = cond.abilityName]
[h:cond.abilityName=pm.RemoveSpecial(cond.abilityName)]
[h:cond.abilitySubclass=pm.RemoveSpecial(cond.abilitySubclass)]
[h:cond.DisplayArray = json.path.read(ConditionList,"[?(@.Name=='"+cond.abilityName+"' && @.Class=='"+cond.abilityClass+"' && @.Subclass=='"+cond.AbilitySubclass+"')]['Settings']")]
[h,if(cond.DisplayArray == "[]"),CODE:{
	[h:cond.DisplayObject = "{}"]
};{
	[h:cond.DisplayObject = json.get(DisplayArray,0)]
}]

[h,if(arg(0)!="AfterAbility"): IsTooltip=0]
[h:cond.Flavor=json.get(cond.DisplayObject,"Flavor")]
[h:cond.DMOnly=if(json.get(cond.DisplayObject,"DMOnly")=="",if(PC.Ally.Enemy==2,min(number(getLibProperty("HideEnemyMacros","Lib:pm.a5e.Core")),1),if(PC.Ally.Enemy==1,min(number(getLibProperty("HideAllyMacros","Lib:pm.a5e.Core")),1),0)),json.get(cond.DisplayObject,"DMOnly"))]
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
[h:cond.ShowFullRules=if(IsTooltip,1,if(cond.ShowFullRulesOverride=="",if(number(getLibProperty("ChatIndividual","Lib:pm.a5e.Core")),FullAbilityRules,getLibProperty("FullAbilityRules","Lib:pm.a5e.Core")),cond.ShowFullRulesOverride))]
[h:cond.abilityInfo=json.set("","Name",cond.abilityName,"Class",cond.abilityClass,"Subclass",cond.abilitySubclass,"DisplayName",cond.abilityDisplayName,"Tooltip",0)]
[h:cond.abilityLevel = json.get(json.path.read(ConditionList,"[*][?(@.Name=='"+json.get(cond.abilityInfo,"Name")+"' && @.Class=='"+json.get(cond.abilityInfo,"Class")+"' && @.Subclass=='"+json.get(cond.abilityInfo,"Subclass")+"' && @.IsActive>0)]['Level']"),0)]

[h:cond.SummonCustomization = json.set("",
	"Name",cond.ForcedSummonName,
	"Image",cond.ForcedSummonImage,
	"Portrait",cond.ForcedSummonPortrait,
	"Handout",cond.ForcedSummonHandout
	)]