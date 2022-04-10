[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]

[h:listDmgTypes="None - Modify Manually,"+pm.GetDamageTypes("DisplayName")]
[h:listSpellSchools="Not Relevant,"+pm.GetSpellSchools("DisplayName")]

[h:targetTokens = getSelected("json")]

[h,if(json.length(targetTokens) == 1),CODE:{
	[h:disSelectedTokens = "junkVar | "+getTokenImage("",json.get(targetTokens,0))+" | Changing HP of "+getName(json.get(targetTokens,0))+" | LABEL | ICON=TRUE "]
};{
	[h:tempTargetNames = ""]
	[h,foreach(target,targetTokens): tempTargetNames = listAppend(tempTargetNames,getName(target),",")]
	[h:disSelectedTokens = "junkVar | Changing HP of: "+tempTargetNames+" |  | LABEL | SPAN=TRUE "]
}]

[h:abort(input(
	disSelectedTokens,
	"junkVar|-------------------------------------- Damage or Healing Done --------------------------------------| |LABEL|SPAN=TRUE",
	"HPChangeType|Damage,HP Drain,Healing,Temp,Remove HP Drain|Type|RADIO|SELECT=0",
	"junkVar|----------------------------------------------------------------------------------------------------------------| |LABEL|SPAN=TRUE",
	"hpChange1|0|Damage - Separate Multiple Hits with Commas",
	"DamageType1|"+listDmgTypes+"|Type of Damage Dealt|LIST|SELECT=0 VALUE=STRING",
	"DamageType1Magic|  |Is it Magical|CHECK",
	"junkVar|----------------------------------------------------------------------------------------------------------------| |LABEL|SPAN=TRUE",
	"hpChange2|0|Damage - Separate Multiple Hits with Commas",
	"DamageType2|"+listDmgTypes+"|Type of Damage Dealt|LIST|SELECT=0 VALUE=STRING",
	"DamageType2Magic|  |Is it Magical|CHECK",
	"junkVar|----------------------------------------------------------------------------------------------------------------| |LABEL|SPAN=TRUE",
	"spellSource|"+listSpellSchools+"|School of Damaging Spell|LIST|SELECT=0 VALUE=STRING",
	"junkVar|------------------------------------------- For Concentration -------------------------------------------| |LABEL|SPAN=TRUE",
	"ConSaveBypass|  |Bypass Save|CHECK",
	"ConSaveBonus|0|Conditional Bonus",
	"ConSaveAdvantage|None,Advantage,Disadvantage|(Dis)Advantage?|LIST|SELECT=0"
))]

[h:Num=max(listCount(hpChange1),listCount(hpChange2))]
[h:atkNumDiff=(listCount(hpChange1)-listCount(hpChange2))]

[h,count(abs(atkNumDiff)),CODE:{
	[h:hpChange1=if(atkNumDiff<0,listAppend(hpChange1,0),hpChange1)]
	[h:hpChange2=if(atkNumDiff>0,listAppend(hpChange2,0),hpChange2)]
}]

[h,switch(HPChangeType),CODE:
	case 2:{[h:DamageType1 = "Healing"][h:DamageType2 = "Healing"]};
	case 3:{[h:DamageType1 = "Temp HP"][h:DamageType2 = "Temp HP"]};
	default:{}
]

[h:hpChange1=json.fromList(hpChange1)]
[h:hpChange2=json.fromList(hpChange2)]

[h,if(DamageType1==DamageType2),CODE:{
	[h:DamageTotal = ""]
	[h,count(json.length(hpChange1)): DamageTotal = json.append(DamageTotal,json.get(hpChange1,roll.count)+json.get(hpChange2,roll.count))]
	[h:DamageDealt = json.set("",DamageType1,json.get(DamageTotal,0))]
};{
	[h:DamageDealt = json.set("",DamageType1,json.get(hpChange1,0),DamageType2,json.get(hpChange2,0))]
}]

[h:hp.Data = json.set("",
	"Flavor",Flavor,
	"DamageDealt",DamageDealt,
	"SourceType","Needs Future Implementation",
	"ConSave",json.set("","Bypass",ConSaveBypass,"Bonus",ConSaveBonus,"Advantage",if(ConSaveAdvantage==2,-1,ConSaveAdvantage))
)]

[h:abilityTable = "[]"]
[h,foreach(target,targetTokens),CODE:{
	[h,if(json.length(targetTokens)>1): 
		abilityTable = json.append(abilityTable,json.set("",
		"ShowIfCondensed",1,
		"Header",getName(target),
		"FalseHeader","",
		"FullContents","",
		"RulesContents","",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']"
		))
	]
	[h:hp.Data = json.set(hp.Data,"ParentToken",target)]
	[h,MACRO("Change HP@Lib:pm.a5e.Core"): hp.Data]
	[h:abilityTable = json.merge(abilityTable,json.get(macro.return,"Table"))]
}]

[h:ClassFeatureData = json.set("",
	"Flavor",Flavor,
	"ParentToken",ParentToken,
	"DMOnly",0,
	"Class","zzChangeHP",
	"ColorSubtype",if(HPChangeType<2,"Damage","Healing"),
	"Name","Change HP",
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]

[h:output.PC = json.get(json.get(FormattingData,"Output"),"Player")]
[h:output.GM = json.get(json.get(FormattingData,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,FormattingData,1)]

[h:output.PC = output.PC + json.get(macro.return,"Player")+"</div></div>"]
[h:output.GM = output.GM + json.get(macro.return,"GM")+"</div></div>"]
[h:broadcastAsToken(output.GM,"gm")]
[h:broadcastAsToken(output.PC,"not-gm")]