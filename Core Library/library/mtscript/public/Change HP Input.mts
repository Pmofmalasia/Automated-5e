[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]
[h:ParentName=getName(ParentToken)]

[h:disVulnerability=if(dVulnerability=="","","junkVar|"+dVulnerability+"|Vulnerabilities|LABEL")]
[h:disResistance=if(dResistance=="","","junkVar|"+dResistance+"|Resistances|LABEL")]
[h:disImmunity=if(dImmunity=="","","junkVar|"+dImmunity+"|Immunities|LABEL")]
[h:disAbsorb=if(dAbsorption=="","","junkVar|"+dAbsorption+"|Absorption|LABEL")]
[h:listDmgTypes="None - Modify Manually,"+pm.GetDamageTypes("DisplayName")]
[h:listSpellSchools="Not Relevant,"+pm.GetSpellSchools("DisplayName")]

[h:abort(input(
	"junkVar|-------------------------------------- Damage or Healing Done --------------------------------------| |LABEL|SPAN=TRUE",
	"HPChangeType|Damage,HP Drain,Healing,Temp,Remove HP Drain (Current: "+HPDrain+")|Type|RADIO|SELECT=0",
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
	""+disVulnerability+"",
	""+disResistance+"",
	""+disImmunity+"",
	""+disAbsorb+"",
	"junkVar|------------------------------------------- For Concentration -------------------------------------------| |LABEL|SPAN=TRUE",
	"ConSaveBypass|  |Bypass Save|CHECK",
	"ConSaveBonus|0|Conditional Bonus",
	"ConSaveAdvantage|None,Advantage,Disadvantage|(Dis)Advantage?|LIST|SELECT=0"
))]

[h:Successes=json.get(DeathSaves, "Successes")]
[h:Failures=json.get(DeathSaves, "Failures")]
[h:Num=max(listCount(hpChange1),listCount(hpChange2))]
[h:atkNumDiff=(listCount(hpChange1)-listCount(hpChange2))]

[h,count(abs(atkNumDiff)),CODE:{
	[h:hpChange1=if(atkNumDiff<0,listAppend(hpChange1,"0"),hpChange1)]
	[h:hpChange2=if(atkNumDiff>0,listAppend(hpChange2,"0"),hpChange2)]
}]

[h:hp.Data = json.set("","Flavor",Flavor,"ParentToken",ParentToken,"ChangeType",HPChangeType,"DamageDealt",json.set("",DamageType1,json.fromList(hpChange1),DamageType2,json.fromList(hpChange2)),"Properties",json.set("","Source","Needs Future Implementation"),"ConSave",json.set("","Bypass",ConSaveBypass,"Bonus",ConSaveBonus,"Advantage",if(ConSaveAdvantage==2,-1,ConSaveAdvantage)))]

[h,MACRO("Change HP@Lib:pm.a5e.Core"): hp.Data]