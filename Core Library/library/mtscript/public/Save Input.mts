[h:SaveData = macro.args]
[h:Flavor=json.get(SaveData,"Flavor")]
[h:ParentToken=json.get(SaveData,"ParentToken")]

[h:sv.AttributeList = pm.GetAttributes("json")]
[h:sv.Options = ""]
[h,foreach(TempAttribute,sv.AttributeList): sv.Options = json.append(sv.Options,TempAttribute+" Save")]

[h:abort(input(
	"SkillDesc|--Description Here--|Description||WIDTH=40",
	"iSaves|"+json.toList(sv.Options)+"|Saves|LIST",
	"sBonus|0|Bonus||WIDTH=20",
	"outputOptions|"+if(isGM(),"Everyone,DM Only","Everyone,You and DM,DM Only")+"|Who sees the result?|RADIO"
))]

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

[h,MACRO("Save@Lib:pm.a5e.Core"): json.set("","Name",sv.Choice,"ParentToken",ParentToken,"Formatting",FormattingData,"Output",json.set("","Player",output.PC,"GM",output.GM),"OutputTargets",outputTargets)]

[h:output.PC = json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,outputTargets)]