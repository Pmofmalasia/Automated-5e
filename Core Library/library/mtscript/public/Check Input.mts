[h:CheckData = macro.args]
[h:Flavor=json.get(CheckData,"Flavor")]
[h:ParentToken=json.get(CheckData,"ParentToken")]

[h:ch.AttributeOptions = pm.GetAttributes("DisplayName","json")]
[h:ch.AttributeDisplay = json.toList(ch.AttributeOptions," Check,")+"Check"]

[h:ch.SkillList = pm.GetSkills()]
[h:ch.SkillOptions = ""]
[h:ch.SkillDisplay = ""]
[h,foreach(TempSkill,ch.SkillList),CODE:{
	[h:ch.SkillOptions = json.append(ch.SkillOptions,json.get(TempSkill,"DisplayName"))]
	[h:ch.SkillDisplay = listAppend(ch.SkillDisplay,json.get(TempSkill,"DisplayName")+" ("+substring(json.get(TempSkill,"Attribute"),0,3)+")")]
}]

[h:listSkills = json.fromStrProp("--Choose a Skill--,"+ch.SkillDisplay+",------------------,"+ch.AttributeDisplay)]
[h:abort(input(
	"SkillDesc|--Description Here--|Description||WIDTH=40",
	"iSkills|"+json.toList(listSkills)+"|Skills|LIST",
	"Alternate|-NO-,"+pm.GetAttributes("DisplayName")+"|Use Alternate Ability|LIST|VALUE=STRING",
	"sBonus||Situational Bonus||WIDTH=20",
	"chAdv|Forced Disadvantage,Situational Disadvantage,Normal Roll,Situational Advantage,Forced Advantage|Use Alternate Ability|RADIO|SELECT=2",
	"outputOptions|"+if(isGM(),"Everyone,DM Only","Everyone,You and DM,DM Only")+"|Who sees the result?|RADIO"
))]
[h:AddedBonus=eval(sBonus+"+1d1-1")]
[h:Alternate = if(Alternate=="-NO-","",Alternate)]

[h:"<!-- Note: outputTargets does not include the GM since their output is constructed separately from the players' -->"]
[h,switch(outputOptions),CODE:
	case 0:{[h:outputTargets = "not-gm"][h:linkPermissions = "gm-self"]};
	case 1:{[h:outputTargets = if(isGM(),"none","self")][h:linkPermissions = "gm-self"]};
	case 2:{[h:outputTargets = "none"][h:linkPermissions = "gm"]}
]

[h,if(iSkills==0 || iSkills==json.length(ch.SkillOptions)+1),CODE:{
	[h:ch.Choice = "No Skill Selected"]
	[h:Alternate = "None"]
};{
	[h,if(iSkills>json.length(ch.SkillOptions)): ch.Choice = json.get(ch.AttributeOptions,(iSkills-json.length(ch.SkillOptions))); ch.Choice = json.get(ch.SkillOptions,iSkills-1)]
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

[h,MACRO("Check@Lib:pm.a5e.Core"): json.set("","Skill",ch.Choice,"Type","Skill","ParentToken",ParentToken,"Alternate",Alternate,"Bonus",AddedBonus,"Advantage",if(chAdv==0,-1,if(chAdv==4,1,chAdv - 2)),"ForcedAdvantage",or(chAdv==0,chAdv==4),"PCOutput",outputTargets)]
[h:CheckData = macro.return]
[h:abilityTable = json.get(CheckData,"Table")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,outputTargets)]