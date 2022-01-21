[h:CheckData = macro.args]
[h:Flavor=json.get(CheckData,"Flavor")]
[h:ParentToken=json.get(CheckData,"ParentToken")]

[h:"<!-- Note: as is, magic item proficiency in all checks of an ability do not stack with magic item proficiency in subtypes of that ability. Not sure whether they should or not, or if it even matters since its unlikely to ever be relevant anyway. -->"]

[h:"<!-- Magic Item bonuses arent swapping though and that probably does need fixing. -->"]

[{"Name":"AlchemistsSupplies","DisplayName":"Alchemist's Supplies","Attribute":"Intelligence"}]

[h:tch.SkillList = pm.GetTools()]
[h:tch.SkillOptions = ""]
[h:tch.SkillDisplay = ""]
[h,foreach(TempSkill,tch.SkillList),CODE:{
	[h:tempBonus = json.get(AtrMods,json.get(TempSkill,"Attribute"))+(json.get(Skills,json.get(TempSkill,"Name"))*Proficiency)]
	[h:tch.SkillOptions = json.append(tch.SkillOptions,json.set("",
		"Name",json.get(TempSkill,"Name"),
		"DisplayName",json.get(TempSkill,"DisplayName"),
		"Attribute",json.get(TempSkill,"Attribute"),
		"Bonus",tempBonus,
		"BonusDisplay",pm.PlusMinus((json.get(Skills,json.get(TempSkill,"Name"))*Proficiency),0),
		"BonusFromAttribute",json.get(AtrMods,json.get(TempSkill,"Attribute")),
		"BonusFromAttributeDisplay",pm.PlusMinus(json.get(AtrMods,json.get(TempSkill,"Attribute")),1)
		))]
	[h:tch.SkillDisplay = json.append(tch.SkillDisplay,"<html>"+pm.PlusMinus(tempBonus,1,0)+" - "+json.get(TempSkill,"DisplayName")+" ("+substring(json.get(TempSkill,"Attribute"),0,3)+")</html>")]
}]

[h:AddedBonus=0]
[h:sBonus="0"]
[h:SkillDesc=""]
[h:iSkills=-1]
[h:mBonusStr=""]
[h:mBonus=0]
[h:mBonusOriginal=0]
[h:mAdv=""]
[h:mDis=""]
[h:mMessage=""]

[h:listSkills=json.merge(json.append("","--Choose a Skill--"),tch.SkillDisplay,tch.AttributeDisplay)]
[h:abort(input(
	"SkillDesc|--Description Here--|Description||WIDTH=40",
	"iSkills|"+json.toList(listSkills)+"|Skills|LIST",
	"Alternate|-NO-,"+json.toList(tch.AttributeList)+"|Use Alternate Ability|LIST|VALUE=STRING",
	"sBonus||Bonus||WIDTH=20",
	"outputOptions|"+if(isGM(),"Everyone,DM Only","Everyone,You and DM,DM Only")+"|Who sees the result?|RADIO"
))]
[h:AddedBonus=eval(sBonus+"+1d1-1")]

[h:"<!-- Note: outputTargets does not include the GM since their output is constructed separately from the players' -->"]
[h,switch(outputOptions),CODE:
	case 0:{[h:outputTargets = "not-gm"][h:linkPermissions = "gm-self"]};
	case 1:{[h:outputTargets = if(isGM(),"none","self")][h:linkPermissions = "gm-self"]};
	case 2:{[h:outputTargets = "none"][h:linkPermissions = "gm"]}
]

[h,if(iSkills==0),CODE:{
	[h:tch.Choice = json.set("","Name","No Skill Selected","DisplayName","No Skill Selected")]
};{
	[h,if(iSkills>json.length(tch.SkillOptions)): tch.Choice = json.get(tch.AttributeOptions,(iSkills-json.length(tch.SkillOptions)-1)); tch.Choice = json.get(tch.SkillOptions,iSkills-1)]
}]

[h:"<!-- Note: If changes are made to outputTargets, a new method may need to be used to determine if it is GM only or not. Also may need a different method anyway for passive skills. -->"]
[h:ClassFeatureData = json.set("",
	"Flavor",if(or(SkillDesc=="",SkillDesc=="--Description Here--"),Flavor,SkillDesc),
	"ParentToken",ParentToken,
	"DMOnly",if(outputTargets=="none",1,0),
	"BorderColorOverride",json.get(CheckData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(CheckData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(CheckData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(CheckData,"AccentTextOverride"),
	"TitleFont",json.get(CheckData,"TitleFont"),
	"BodyFont",json.get(CheckData,"BodyFont"),
	"Class","zzChecksAndSaves",
	"Name","Skill Check",
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h,MACRO("Check@Lib:pm.a5e.Core"): json.set(tch.Choice,"ParentToken",ParentToken,"Alternate",Alternate,"Formatting",FormattingData,"Output",json.set("","Player",output.PC,"GM",output.GM),"OutputTargets",outputTargets)]