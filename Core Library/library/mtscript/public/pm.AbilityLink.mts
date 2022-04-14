[h:abilityInfo = arg(0)]
[h:abilityName = json.get(abilityInfo,"Name")]
[h:abilityDisplayName = json.get(abilityInfo,"DisplayName")]
[h:abilityClass = json.get(abilityInfo,"Class")]
[h:abilitySubclass = json.get(abilityInfo,"Subclass")]
[h:abilityLibrary = json.get(abilityInfo,"Library")]
[h:abilityType = json.get(abilityInfo,"Type")]
[h:abilityContext = json.get(abilityInfo,"Context")]
[h:abilityOverarchingContext = json.get(abilityInfo,"OverarchingContext")]
[h:ParentToken = json.get(abilityInfo,"ParentToken")]
[h:ShowFullRules = json.get(abilityInfo,"FullRules")]
[h:IsTooltip = json.get(abilityInfo,"Tooltip")]
[h:switchToken(ParentToken)]

[h:abilityEffect = arg(1)]
[h,if(argcount()>2): extraInfo = arg(2); extraInfo = json.set("","ExtraData","{}")]
[h:abilityAltName = json.get(extraInfo,"AltName")]
[h:abilityExtraData = json.get(extraInfo,"ExtraData")]

[h:abilityLink = macroLinkText(if(abilityAltName=="",abilityName,pm.RemoveSpecial(abilityAltName))+" ### "+abilityClass+" ### "+if(abilitySubclass=="","",abilitySubclass+" ### ")+if(abilityType=="Feature","",abilityType+" ### ")+"Link@Lib:"+abilityLibrary,"gm-self",json.set(abilityExtraData,"ParentToken",ParentToken,"IsTooltip",0,"Context",abilityContext,"OverarchingContext",abilityOverarchingContext),ParentToken)]
[h:abilityTooltipLink = macroLinkText(if(abilityAltName=="",abilityName,pm.RemoveSpecial(abilityAltName))+" ### "+abilityClass+" ### "+if(abilitySubclass=="","",abilitySubclass+" ### ")+if(abilityType=="Feature","",abilityType+" ### ")+"Link@Lib:"+abilityLibrary,"gm-self",json.set(abilityExtraData,"ParentToken",ParentToken,"IsTooltip",1,"Context",abilityContext,"OverarchingContext",abilityOverarchingContext),ParentToken)]
[h,if(IsTooltip),CODE:{
	[h:macro.return = pm.AbilityText(
		abilityInfo,
		abilityDisplayName,
		abilityEffect)]
};{
	[h,if(ShowFullRules):
		macro.return = pm.AbilityText(
			abilityInfo,
			abilityDisplayName,
			abilityEffect,
			json.set("","Type","Rules","Body","<a href='"+abilityLink+"' style='color:"+pm.LinkColor()+"'>Use Feature</a> / <a href='"+abilityTooltipLink+"' style='color:"+pm.LinkColor()+"'>Feature Info</a>"));
		macro.return = pm.AbilityText(
			abilityInfo,
			abilityDisplayName,
			"<a href='"+abilityLink+"' style='color:"+pm.LinkColor()+"'>Use Feature</a> / <a href='"+abilityTooltipLink+"' style='color:"+pm.LinkColor()+"'>Feature Info</a>"
			)
	]
}]