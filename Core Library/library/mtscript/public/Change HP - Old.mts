[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]
[h:IsTooltip = 0]
[h:ParentName=getName(ParentToken)]
[h:hp.Output = ""]

[h:disVulnerability=if(dVulnerability=="","","junkVar|"+dVulnerability+"|Vulnerabilities|LABEL")]
[h:disResistance=if(dResistance=="","","junkVar|"+dResistance+"|Resistances|LABEL")]
[h:disImmunity=if(dImmunity=="","","junkVar|"+dImmunity+"|Immunities|LABEL")]
[h:disAbsorb=if(dAbsorption=="","","junkVar|"+dAbsorption+"|Absorption|LABEL")]
[h:listDmgTypes="None - Modify Manually,Bludgeoning,Piercing,Slashing,Acid,Cold,Fire,Force,Lightning,Necrotic,Poison,Psychic,Radiant,Thunder"]
[h:listSpellSchools="Not Relevant,Abjuration,Conjuration,Divination,Enchantment,Evocation,Illusion,Necromancy,Transmutation"]

[h:status = input(
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
)]
[h:abort(status)]

[h:Successes=json.get(DeathSaves, "Successes")]
[h:Failures=json.get(DeathSaves, "Failures")]
[h:Num=max(listCount(hpChange1),listCount(hpChange2))]
[h:atkNumDiff=(listCount(hpChange1)-listCount(hpChange2))]

[h,count(abs(atkNumDiff)),CODE:{
	[h:hpChange1=if(atkNumDiff<0,listAppend(hpChange1,"0"),hpChange1)]
	[h:hpChange2=if(atkNumDiff>0,listAppend(hpChange2,"0"),hpChange2)]
}]

[h:"<!--- Damage Type Modification --->"]
[h:dmg.ModInfo = a5e.DamageMod()]
[h:dmg.Vuln = json.get(dmg.ModInfo,"Vulnerability")]
[h:dmg.Res = json.get(dmg.ModInfo,"Resistance")]
[h:dmg.Immun = json.get(dmg.ModInfo,"Immunity")]
[h:dmg.Absorb = json.get(dmg.ModInfo,"Absorption")]
[h:dmg.DR = json.get(dmg.ModInfo,"DR")]

[h:DamageType1.DRcall=if(DamageType1Magic,"Magical "+DamageType1,"Physical "+DamageType1)]
[h:dmgModTest1=if(or(DamageType1=="None - Modify Manually",and(json.get(dmg.Vuln,DamageType1)==json.get(dmg.Res,DamageType1),json.get(dmg.Immun,DamageType1)==0,json.get(dmg.Absorb,DamageType1)==0,json.get(dmg.DR,DamageType1)==0,json.get(dmg.DR,DamageType1.DRcall)==0)),0,1)]

[h:HPChangeTotal=0]

[h,if(HPChangeType<=1 && dmgModTest1==1),CODE:{
	[h:dmgModTarget=if(DamageType1Magic==0,1,2)]
	[h:json.get(dmg.Vuln,DamageType1)]
	[h:dmgModVuln=if(or(json.get(dmg.Vuln,DamageType1)==dmgModTarget,json.get(dmg.Vuln,DamageType1)==3),1,0)]
	[h:dmgModRes=if(or(json.get(dmg.Res,DamageType1)==dmgModTarget,json.get(dmg.Res,DamageType1)==3),1,0)]
	[h:dmgModImmun=if(or(json.get(dmg.Immun,DamageType1)==dmgModTarget,json.get(dmg.Immun,DamageType1)==3),1,0)]
	[h:dmgModAbs=if(or(json.get(dmg.Absorb,DamageType1)==dmgModTarget,json.get(dmg.Absorb,DamageType1)==3),1,0)]
	[h:dmgModDR=(json.get(dmg.DR,DamageType1)+json.get(dmg.DR,DamageType1.DRcall))]
	[h,foreach(DmgInstance,hpChange1),CODE:{
		[h:dmg.adjusted=DmgInstance-dmgModDR]
		[h:dmg.adjusted=if(dmgModAbs,(0-dmg.adjusted),if(dmgModImmun,0,if(and(dmgModVuln,dmgModRes),dmg.adjusted,if(dmgModVuln,(dmg.adjusted*2),if(dmgModRes,floor(dmg.adjusted/2),dmg.adjusted)))))]
		[h:hpChange1=listReplace(hpChange1,roll.count,dmg.adjusted)]
		[h:HPChangeTotal=HPChangeTotal+dmg.adjusted]
	}]
};{
	[h,foreach(DmgInstance,hpChange1),CODE:{
		[h:HPChangeTotal=HPChangeTotal+DmgInstance]
	}]
}]

[h:DamageType2.DRcall=if(DamageType2Magic,"Magical "+DamageType2,"Physical "+DamageType2)]

[h:dmgModTest2=if(or(DamageType2=="None - Modify Manually",and(json.get(dmg.Vuln,DamageType2)==json.get(dmg.Res,DamageType2),json.get(dmg.Immun,DamageType2)==0,json.get(dmg.Absorb,DamageType2)==0,json.get(dmg.DR,DamageType2)==0,json.get(dmg.DR,DamageType2.DRcall)==0)),0,1)]

[h,if(HPChangeType<=1 && dmgModTest2==1),CODE:{
    [h:dmgModTarget=if(DamageType2Magic==0,1,2)]
    [h:json.get(dmg.Vuln,DamageType2)]
    [h:dmgModVuln=if(or(json.get(dmg.Vuln,DamageType2)==dmgModTarget,json.get(dmg.Vuln,DamageType2)==3),1,0)]
    [h:dmgModRes=if(or(json.get(dmg.Res,DamageType2)==dmgModTarget,json.get(dmg.Res,DamageType2)==3),1,0)]
    [h:dmgModImmun=if(or(json.get(dmg.Immun,DamageType2)==dmgModTarget,json.get(dmg.Immun,DamageType2)==3),1,0)]
    [h:dmgModAbs=if(or(json.get(dmg.Absorb,DamageType2)==dmgModTarget,json.get(dmg.Absorb,DamageType2)==3),1,0)]
    [h:dmgModDR=(json.get(dmg.DR,DamageType2)+json.get(dmg.DR,DamageType2.DRcall))]
    [h,foreach(DmgInstance,hpChange2),CODE:{
        [h:dmg2.adjusted=DmgInstance-dmgModDR]
        [h:dmg2.adjusted=if(dmgModAbs,(0-dmg2.adjusted),if(dmgModImmun,0,if(and(dmgModVuln,dmgModRes),dmg2.adjusted,if(dmgModVuln,(dmg2.adjusted*2),if(dmgModRes,floor(dmg2.adjusted/2),dmg2.adjusted)))))]
        [h:hpChange2=listReplace(hpChange2,roll.count,dmg2.adjusted)]
        [h:HPChangeTotal=HPChangeTotal+dmg2.adjusted]
    }]
};{
    [h,foreach(DmgInstance,hpChange2),CODE:{
        [h:HPChangeTotal=HPChangeTotal+DmgInstance]
    }]
}]

[h:HPChangeType=if(HPChangeTotal<0,if(HPChangeType==0,2,if(HPChangeType==1,4,HPChangeType)),HPChangeType)]
[h:HPChangeTotal=abs(HPChangeTotal)]

[h:"<!--- Damage Type Modification --->"]

[h:"<!--- ArcaneWard Removal --->"]

[h,if(HPChangeType<=1),CODE:{
	[h:ArcaneWardStart=json.get(ArcaneWard,"HP")]
	[h:ArcaneWardHP=json.get(ArcaneWard,"HP")]
	[h:ArcaneWardHP=if(HPChangeTotal<ArcaneWardHP,ArcaneWardHP-HPChangeTotal,0)]
	[h:HPChangeTotal=if(HPChangeTotal<ArcaneWardStart,0,HPChangeTotal-ArcaneWardStart)]
	[h:ArcaneWard=json.set(ArcaneWard,"HP",ArcaneWardHP)]
};{}]

[h:"<!--- ArcaneWard Removal --->"]

[h:"<!--- TempHP Removal --->"]

[h,if(HPChangeType<=1),CODE:{
	[h:TempHPStart=TempHP]
	[h:TempHP=if(HPChangeTotal<TempHP,TempHP-HPChangeTotal,0)]
	[h:HPChangeTotal=if(HPChangeTotal<TempHPStart,0,HPChangeTotal-TempHPStart)]
};{}]

[h:"<!--- TempHP Removal --->"]

[h:"<!--- Wild Shape Check & Data Pull --->"]

[h:BreakFormCheck=0]

[h,if(CurShape==""),CODE:{};{
	[h:BreakFormCheck=if(HP-HPChangeTotal<1,1,0)]
}]

[h,if(BreakFormCheck==1),CODE:{
	[h:HPChangeTotal=HPChangeTotal-HP]

[h:json.get(Attributes,"Strength")=if(json.get(WSRetainedStats,"WildShape")==0,json.get(Attributes,"Strength"),json.get(WSRetainedStats,"Strength"))]
[h:json.get(Attributes,"Dexterity")=if(json.get(WSRetainedStats,"WildShape")==0,json.get(Attributes,"Dexterity"),json.get(WSRetainedStats,"Dexterity"))]
[h:json.get(Attributes,"Constitution")=if(json.get(WSRetainedStats,"WildShape")==0,json.get(Attributes,"Constitution"),json.get(WSRetainedStats,"Constitution"))]
[h:HP=if(json.get(WSRetainedStats,"WildShape")==0,HP,json.get(WSRetainedStats,"HP"))]
[h:MaxHP=if(json.get(WSRetainedStats,"WildShape")==0,MaxHP,'{RolledMaxHP+(Con*Level)-HPDrain}')]
[h:AC=if(json.get(WSRetainedStats,"WildShape")==0,AC,'{json.get(Armor,"BaseAC")+json.get(Armor,"MagicBonus")+min(Dex,json.get(Armor,"DexMax"))+(json.get(Shield,"Equipped")*2)+if(json.get(Shield,"Equipped")==1,json.get(Shield,"MagicBonus"),0)+if(json.get(Armor,"Type")=="None",if((json.get(LClass,"LBrb")+json.get(LClass,"LMnk"))>0,Con,0),0)}')]
[h:Speed=if(json.get(WSRetainedStats,"WildShape")==0,Speed,'{30+if(Race=="Dwarf",-5,0)+if(Race=="Wood Elf",5,0)+if(Race=="Halfling",-5,0)+if(Race=="Gnome",-5,0)+if(json.get(LClass,"LBrb")>4,10,0)+if(json.get(LClass,"LMnk")>1,10,0)+if(json.get(LClass,"LMnk")>0,(5*ceiling((json.get(LClass,"LMnk")-5)/4)),0)+if(json.get(Feats,"Mobile")==1,10,0)}')]
[h:setSize(json.get(WSRetainedStats,"Size"))]
[h:setTokenImage(json.get(WSRetainedStats,"TokenImage"))]

[h:hp.Output = hp.Output+'<div style="background-color: #8d8a19; color: #FFFFFF; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;">	<b>End Wild Shape</b>	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">'+"			<i>Damage suddenly ends the Wild Shape.</i>		</div>		"+token.name+" has reverted to caster form!<table>			<tr><td><b>Strength </b> </td><td> | "+json.get(Attributes,"Strength")+"</td></tr>			<tr><td><b>Dexterity </b> </td><td> | "+json.get(Attributes,"Dexterity")+"</td></tr>			<tr><td><b>Constitution </b> </td><td> | "+json.get(Attributes,"Constitution")+"</td></tr>			<tr><td><b>HP </b> </td><td> | "+HP+"/"+MaxHP+"</td></tr>			<tr><td><b>AC </b> </td><td> | "+AC+"</td></tr>			<tr><td><b>Speed </b> </td><td> | "+Speed+SpeedSpecial+"</td></tr>		</table>	</div></div>"]

[h:WSRetainedStats=json.set("",
		"WildShape",0,
		"Strength",0,
		"Dexterity",0,
		"Constitution",0,
		"HP",0,
		"Size",0,
		"TokenImage",0
)]

[h:MacrosToDelete=getMacroGroup(" "+CurShape)]
[h:OtherNum=listCount(MacrosToDelete)]

[h,count(OtherNum),code:
{
[h:removeMacro(listGet(MacrosToDelete,roll.count))]
}]

[h:CurShape=""]

};{}]

[h:"<!--- Wild Shape Check & Data Pull --->"]

[h:ClassFeatureData = json.set("",
	"Flavor",json.get(macro.args,"Flavor"),
	"ParentToken",json.get(macro.args,"ParentToken"),
	"DMOnly",json.get(macro.args,"DMOnly"),
	"BorderColorOverride",if(json.get(macro.args,"BorderColorOverride")=="",if(HPChangeType<=1,"#AA2222","#03AC13"),json.get(macro.args,"BorderColorOverride")),
	"TitleFontColorOverride",if(json.get(macro.args,"TitleFontColorOverride")=="",if(HPChangeType<=1,"#FFFFFF","#000000"),json.get(macro.args,"TitleFontColorOverride")),
	"AccentBackgroundOverride",json.get(macro.args,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(macro.args,"AccentTextOverride"),
	"TitleFont",json.get(macro.args,"TitleFont"),
	"BodyFont",json.get(macro.args,"BodyFont"),
	"Class","",
	"Name",if(HPChangeType<=1,"Damage","Healing"),
	"FalseName","",
	"OnlyRules",0
	)]

[h:FormattingData = pm.MacroFormat(ClassFeatureData)]
[h:hp.Output = hp.Output + json.get(json.get(FormattingData,"Output"),"GM")]

[h:AccentFormat = json.get(FormattingData,"AccentFormat")]
[h:VerticalFormat = json.get(FormattingData,"VerticalFormat")]
[h:VerticalFormatLinks = json.get(FormattingData,"VerticalFormatLinks")]
[h:TableFormat = json.get(FormattingData,"TableFormat")]
[h:outputTest.NoFullMacro = json.get(FormattingData,"NoFullMacro")]
[h:outputTest.NoRolls = json.get(FormattingData,"NoRolls")]
[h:outputTest.NoRules = json.get(FormattingData,"NoRules")]
[h:DamageColor=pm.DamageColor()]
[h:HealingColor=pm.HealingColor()]
[h:CritColor=pm.CritColor()]
[h:CritFailColor=pm.CritFailColor()]
[h:LinkColor=pm.LinkColor()]

[h:"<!--- Damage HP Change --->"]

[h,if(HPChangeType<=1),CODE:{
	[h:HP=HP-HPChangeTotal]
	[h:hp.Output = hp.Output + token.name+" takes a total of <span style='color:#AA2222;font-size:1.5em'>"+HPChangeTotal+"</span> damage."+if(BreakFormCheck==1,"<br><span style='color:#AA2222;font-size:1.5em'>"+HPChangeTotal+"</span> damage carried over to caster form.","")]
};{}]

[h:"<!--- Damage HP Change --->"]

[h:"<!--- HP Drain --->"]

[h,if(HPChangeType==1),CODE:{
	[h:HPDrain=HPDrain+HPChangeTotal]
	[h:hp.Output = hp.Output + "<br>"+token.name+" has been drained of HP and now has a maximum HP of "+MaxHP+"."]
};{}]

[h:"<!--- HP Drain --->"]

[h:"<!--- Death Save Check --->"]

[h,if(state.Dying == 1 && HPChangeType == 0),CODE:
{ 
       [h:status1 = input("Crit|No,Yes|Did you take damage from a critical hit?|RADIO|SELECT=0")]
       [h:abort(status1)]
       
       [h,if(Crit == 1): Failures=(Failures+1),""]

       [h:hp.Output = hp.Output + "<br><b>"+token.name+" takes damage while dying!</b><br>"]
       [h:Failures=(Failures+1)]

       [h:hp.Output = hp.Output + "Death Saves: "+Successes+" successes and "+Failures+" failures."]
};{}]

[h,if(Failures >= 3), code:
	{
		[h:hp.Output = hp.Output + "<br><b>"+token.name+" is dead!</b>"]
    	 [h:state.Dead=1]
	};{}]
[h,if(Failures == 2), code:
{
    [h:hp.Output = hp.Output + "<br><b>"+token.name+" is on the brink of death!</b>"]
};{}]

[h:DeathSaves=json.set("{ }", "Successes",Successes,"Failures",Failures)]

[h:"<!--- Death Save Check --->"]

[h:"<!--- Healing --->"]

[h,if(HPChangeType == 2),CODE:{
	[h:HP=if(and(HPChangeTotal>0,HP<0),0,HP)]
	[h:diff=MaxHP-HP]
	[h:HP=min(HP+HPChangeTotal,MaxHP)]
	[h:hp.Output = hp.Output + token.name+" is healed and gains <span style='color:#22AA22;font-size:1.5em'>"+min(diff,HPChangeTotal)+"</span> hit points."]
	[h:HPDrainTest=HPDrain]
	[h:DeathSaves=if(HP>-1,json.set("{ }", "Successes",0,"Failures",0),DeathSaves)]
};{}]

[h:"<!--- Healing --->"]

[h:"<!--- Temp HP --->"]

[h,if(HPChangeType == 3),CODE:
{
    [h:TempHP = HPChangeTotal]
    [h:hp.Output = hp.Output + token.name+" gains <span style='color:#22AA22;font-size:1.5em'>"+HPChangeTotal+"</span> temporary hit points."]
};{}]

[h:"<!--- Temp HP --->"]

[h:"<!-- Remove Drained HP -->"]

[h,if(HPChangeType == 4),CODE:
{
	[h:HPDrain.temp=HPDrain]
	[h:HPDrain=max((HPDrain-HPChangeTotal),0)]
	[h:HPChange.temp=HPDrain.temp-HPDrain]
	[h:hp.Output = hp.Output + token.name+" recovers <span style='color:#22AA22;font-size:1.5em'>"+HPChange.temp+"</span> of their drained maximum HP, returning to a maximum of "+MaxHP+"."]
};{}]

[h:"<!-- Remove Drained HP -->"]

[r,if(HP<1 && getState("Death Ward")),code:{
	[h:hp.Output = hp.Output + "<br><b>Death Ward</b>: Your Death Ward lets you keep on fighting!"]
	[h:setState("Death Ward",0)]
	[h:HP=1]
};
{}]

[h:state.Dying=if(HP <= 0, 1, 0)]
[h:state.Dead=if(HP>0,0,state.Dead)]
[h:state.Prone=if(HP <=0,1,state.Prone)]
[h:state.Unconscious=if(HP <=0,1,state.Unconscious)]
[h:state.Unconscious=if(HP >0,0,state.Unconscious)]
[h:bar.Health = HP / MaxHP]


[h:"<!--- Concentration & System Shock Checks --->"]

[h:ConcentrationFailure=0]
[h:SystemShockCheck=0]

[h,if(HPChangeType <= 1 && ConSaveBypass==0),CODE:{
	[h,count(Num,""),CODE:{
		[h:roll1=1d20+json.get(AtrMods,"Constitution")+ConSaveBonus+(Proficiency*json.get(Saves,"Constitution"))]
		[h:roll2=1d20+json.get(AtrMods,"Constitution")+ConSaveBonus+(Proficiency*json.get(Saves,"Constitution"))]
		[h:advroll=max(roll1,roll2)]
		[h:disroll=min(roll1,roll2)]
		[h:DifficultyClass=max(10,floor((listGet(hpChange1,roll.count)+listGet(hpChange2,roll.count))/2))]
		[h:ConSaveTest=if(ConSaveAdvantage==1,advroll,if(ConSaveAdvantage==2,disroll,roll1))]
		[h:ConcentrationFailure=if(ConSaveTest<DifficultyClass,ConcentrationFailure+1,ConcentrationFailure)]
		[h:hp.Output = hp.Output + if(getState("Concentrating")==1,"<br><b>Damage:</b> "+(listGet(hpChange1,roll.count)+listGet(hpChange2,roll.count))+" | | <b>Concentration DC:</b> "+DifficultyClass+" | | <b>Concentration Save:</b> "+ConSaveTest,"")]
	}]
};{}]

[h:"<!--- Concentration & System Shock Checks --->"]

	[h:hp.Output = hp.Output + "</div></div>"]

[h:"<!--- Lost Concentration Notice --->"]

[h:hp.Output = hp.Output + if(getState("Concentrating")==1,if(ConcentrationFailure>0,
	"<div style='background-color: #02F5F5; color: #000000; padding-top:2px; padding-bottom:2px; padding-left:8px; padding-right:8px;'>		<b>End Concentration</b>		<div style='background-color:#FFFFFF; color: #000000; padding:2px;'>			<div style='background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;'>				<i>"+token.name+" loses focus due to injury!</i>			</div>			"+token.name+" has lost concentration on "+Concentration+"!		</div>	</div>",""),"")]

[h:setState("Concentrating",if(ConcentrationFailure>0,0,getState("Concentrating")))]
[h:Concentration=if(ConcentrationFailure>0,"",Concentration)]

[h:"<!--- Lost Concentration Notice --->"]

[h:broadcastAsToken(hp.Output)]