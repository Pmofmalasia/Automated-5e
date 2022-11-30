[h:abilityDisplayName=abilityName]
[h:abilityName=pm.RemoveSpecial(abilityName)]
[h:abilitySubclass=pm.RemoveSpecial(abilitySubclass)]
[h:DisplayArray = json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Name=='"+abilityName+"')]['Settings']")]
[h,if(DisplayArray == "[]"),CODE:{
	[h:DisplayObject = "{}"]
};{
	[h:DisplayObject = json.get(DisplayArray,0)]
}]

[h:IsTooltip=0]
[h:Flavor=json.get(DisplayObject,"Flavor")]
[h:DMOnly=if(json.get(DisplayObject,"DMOnly")=="",if(PC.Ally.Enemy==2,min(getLibProperty("HideEnemyMacros","Lib:pm.a5e.Core"),1),if(PC.Ally.Enemy==1,min(getLibProperty("HideAllyMacros","Lib:pm.a5e.Core"),1),0)),json.get(DisplayObject,"DMOnly"))]
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
[h:ShowFullRules=if(IsTooltip,1,if(ShowFullRulesOverride=="",if(getLibProperty("ChatIndividual","Lib:pm.a5e.Core"),FullAbilityRules,getLibProperty("FullAbilityRules","Lib:pm.a5e.Core")),ShowFullRulesOverride))]
[h:abilityInfo=json.set("","Name",abilityName,"Class",abilityClass,"Subclass",abilitySubclass,"DisplayName",abilityDisplayName,"Tooltip",0)]
[h:SummonCustomization = json.set("",
	"Name",ForcedSummonName,
	"Image",ForcedSummonImage,
	"Portrait",ForcedSummonPortrait,
	"Handout",ForcedSummonHandout
	)]