[h:SaveData = macro.args]
[h:Flavor=json.get(SaveData,"Flavor")]
[h:ParentToken=json.get(SaveData,"ParentToken")]

[h:sv.AttributeList = pm.GetAttributes("DisplayName","json")]
[h:sv.Options = json.toList(sv.AttributeList," Save,")+" Save"]

[h:abort(input(
	"SkillDesc|--Description Here--|Description||WIDTH=40",
	"iSaves|"+sv.Options+"|Saves|LIST",
	"sBonus|0|Situational Bonus||WIDTH=20",
	"svAdv|Forced Disadvantage,Situational Disadvantage,Normal Roll,Situational Advantage,Forced Advantage|Advantage Type|RADIO|SELECT=2",
	"outputOptions|"+if(isGM(),"Everyone,DM Only","Everyone,You and DM,DM Only")+"|Who sees the result?|RADIO"
))]
[h:AddedBonus=eval(sBonus+"+1d1-1")]

[h:"<!-- Note: outputTargets does not include the GM since their output is constructed separately from the players' -->"]
[h,switch(outputOptions),CODE:
	case 0:{[h:outputTargets = "not-gm"][h:linkPermissions = "gm-self"]};
	case 1:{[h:outputTargets = if(isGM(),"none","self")][h:linkPermissions = "gm-self"]};
	case 2:{[h:outputTargets = "none"][h:linkPermissions = "gm"]}
]
	
[h:sv.Choice = json.get(sv.AttributeList,iSaves)]

[h:ClassFeatureData = json.set("",
	"Flavor",if(or(SkillDesc=="",SkillDesc=="--Description Here--"),Flavor,SkillDesc),
	"ParentToken",ParentToken,
	"DMOnly",if(outputTargets=="none",1,0),
	"BorderColorOverride",json.get(SaveData,"BorderColorOverride"),
	"TitleFontColorOverride",json.get(SaveData,"TitleFontColorOverride"),
	"AccentBackgroundOverride",json.get(SaveData,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(SaveData,"AccentTextOverride"),
	"TitleFont",json.get(SaveData,"TitleFont"),
	"BodyFont",json.get(SaveData,"BodyFont"),
	"Class","zzChecksAndSaves",
	"Name","Saving Throw",
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h,MACRO("Save@Lib:pm.a5e.Core"): json.set("","Save",sv.Choice,"Type","Save","ParentToken",ParentToken,"Bonus",AddedBonus,"Advantage",if(svAdv==0,-1,if(svAdv==4,1,svAdv - 2)),"ForcedAdvantage",or(svAdv==0,svAdv==4))]
[h:SaveData = macro.return]
[h:abilityTable = json.get(SaveData,"Table")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,outputTargets)]