[h:CheckData = macro.args]
[h:Flavor=json.get(CheckData,"Flavor")]
[h:ParentToken=json.get(CheckData,"ParentToken")]

[h:ch.ToolList = pm.GetTools()]
[h:ch.ToolOptions = ""]
[h:ch.ToolDisplay = ""]
[h,foreach(TempTool,ch.ToolList),CODE:{
	[h:ch.ToolOptions = json.append(ch.ToolOptions,json.get(TempTool,"DisplayName"))]
	[h:ch.ToolDisplay = listAppend(ch.ToolDisplay,json.get(TempTool,"DisplayName")+" ("+substring(json.get(TempTool,"Attribute"),0,3)+")")]
}]

[h:listTools = json.fromStrProp("--Choose a Tool--,"+ch.ToolDisplay)]
[h:abort(input(
	"ToolDesc|--Description Here--|Description||WIDTH=40",
	"iTools|"+json.toList(listTools)+"|Choose a Tool|LIST",
	"Alternate|-NO-,"+pm.GetAttributes("DisplayName")+"|Use Alternate Ability|LIST|VALUE=STRING",
	"sBonus||Situational Bonus||WIDTH=20",
	"chAdv|Forced Disadvantage,Situational Disadvantage,Normal Roll,Situational Advantage,Forced Advantage|Advantage Type|RADIO|SELECT=2",
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

[h,if(iTools==0),CODE:{
	[h:ch.Choice = "No Tool Selected"]
	[h:Alternate = "None"]
};{
	[h:ch.Choice = json.get(ch.ToolOptions,iTools-1)]
}]
[h:ch.Choice = pm.RemoveSpecial(ch.Choice)]

[h:"<!-- Note: If changes are made to outputTargets, a new method may need to be used to determine if it is GM only or not. Also may need a different method anyway for passive Tools. -->"]
[h:ClassFeatureData = json.set("",
	"Flavor",if(or(ToolDesc=="",ToolDesc=="--Description Here--"),Flavor,ToolDesc),
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

[h,MACRO("Check@Lib:pm.a5e.Core"): json.set("","Skill",ch.Choice,"Type","Tool","ParentToken",ParentToken,"Alternate",Alternate,"Bonus",AddedBonus,"Advantage",if(chAdv==0,-1,if(chAdv==4,1,chAdv - 2)),"ForcedAdvantage",or(chAdv==0,chAdv==4),"PCOutput",outputTargets)]
[h:CheckData = macro.return]
[h:abilityTable = json.get(CheckData,"Table")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,outputTargets)]