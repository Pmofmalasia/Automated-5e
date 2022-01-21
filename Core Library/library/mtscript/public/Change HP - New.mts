[h:hp.Data = macro.args]
[h:Flavor = json.get(hp.Data,"Flavor")]
[h:ParentToken = json.get(hp.Data,"ParentToken")]
[h:hp.ChangeType = json.get(hp.Data,"ChangeType")]
[h:hp.DamageDealt = json.get(hp.Data,"DamageDealt")]

[h:hp.TypesDealt = json.intersection(json.append(pm.GetDamageTypes("Name","json"),"None - Modify Manually"),json.fields(hp.DamageDealt,"json"))]

[h:"<!-- Needs rework of how magic/silvered/adamantine/etc. sources are tracked (likely via object instead of 'X number means Y'). Could also use the shift to bake vuln vs. resist vs. invuln etc. into the same object -->"]

































[h:DamageType1.DRcall=if(DamageType1Magic,"Magical "+DamageType1,"Physical "+DamageType1)]
[h:dmgModTest1=if(or(DamageType1=="None - Modify Manually",and(json.get(Vulnerability,DamageType1)==json.get(Resistance,DamageType1),json.get(Immunity,DamageType1)==0,json.get(Absorption,DamageType1)==0,json.get(charDR,DamageType1)==0,json.get(charDR,DamageType1.DRcall)==0)),0,1)]

[h:HPChangeTotal=0]

[h,if(HPChangeType<=1 && dmgModTest1==1),CODE:{
	[h:dmgModTarget=if(DamageType1Magic==0,1,2)]
	[h:json.get(Vulnerability,DamageType1)]
	[h:dmgModVuln=if(or(json.get(Vulnerability,DamageType1)==dmgModTarget,json.get(Vulnerability,DamageType1)==3),1,0)]
	[h:dmgModRes=if(or(json.get(Resistance,DamageType1)==dmgModTarget,json.get(Resistance,DamageType1)==3),1,0)]
	[h:dmgModImmun=if(or(json.get(Immunity,DamageType1)==dmgModTarget,json.get(Immunity,DamageType1)==3),1,0)]
	[h:dmgModAbs=if(or(json.get(Absorption,DamageType1)==dmgModTarget,json.get(Absorption,DamageType1)==3),1,0)]
	[h:dmgModDR=(json.get(charDR,DamageType1)+json.get(charDR,DamageType1.DRcall))]
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

[h:dmgModTest2=if(or(DamageType2=="None - Modify Manually",and(json.get(Vulnerability,DamageType2)==json.get(Resistance,DamageType2),json.get(Immunity,DamageType2)==0,json.get(Absorption,DamageType2)==0,json.get(charDR,DamageType2)==0,json.get(charDR,DamageType2.DRcall)==0)),0,1)]

[h,if(HPChangeType<=1 && dmgModTest2==1),CODE:{
    [h:dmgModTarget=if(DamageType2Magic==0,1,2)]
    [h:json.get(Vulnerability,DamageType2)]
    [h:dmgModVuln=if(or(json.get(Vulnerability,DamageType2)==dmgModTarget,json.get(Vulnerability,DamageType2)==3),1,0)]
    [h:dmgModRes=if(or(json.get(Resistance,DamageType2)==dmgModTarget,json.get(Resistance,DamageType2)==3),1,0)]
    [h:dmgModImmun=if(or(json.get(Immunity,DamageType2)==dmgModTarget,json.get(Immunity,DamageType2)==3),1,0)]
    [h:dmgModAbs=if(or(json.get(Absorption,DamageType2)==dmgModTarget,json.get(Absorption,DamageType2)==3),1,0)]
    [h:dmgModDR=(json.get(charDR,DamageType2)+json.get(charDR,DamageType2.DRcall))]
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

<!--- Damage Type Modification --->

<!--- ArcaneWard Removal --->

[h,if(HPChangeType<=1),CODE:{
	[h:ArcaneWardStart=json.get(ArcaneWard,"HP")]
	[h:ArcaneWardHP=json.get(ArcaneWard,"HP")]
	[h:ArcaneWardHP=if(HPChangeTotal<ArcaneWardHP,ArcaneWardHP-HPChangeTotal,0)]
	[h:HPChangeTotal=if(HPChangeTotal<ArcaneWardStart,0,HPChangeTotal-ArcaneWardStart)]
	[h:ArcaneWard=json.set(ArcaneWard,"HP",ArcaneWardHP)]
};{}]

<!--- ArcaneWard Removal --->

<!--- TempHP Removal --->

[h,if(HPChangeType<=1),CODE:{
	[h:TempHPStart=TempHP]
	[h:TempHP=if(HPChangeTotal<TempHP,TempHP-HPChangeTotal,0)]
	[h:HPChangeTotal=if(HPChangeTotal<TempHPStart,0,HPChangeTotal-TempHPStart)]
};{}]

<!--- TempHP Removal --->

<!--- Wild Shape Check & Data Pull --->

[h:BreakFormCheck=0]

[h,if(CurShape==""),CODE:{};{
	[h:BreakFormCheck=if(HP-HPChangeTotal<1,1,0)]
}]

[if(BreakFormCheck==1),CODE:{
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

<div style="background-color: #8d8a19; color: #FFFFFF; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;">
	<b>End Wild Shape</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">
			<i>Damage suddenly ends the Wild Shape.</i>
		</div>
		{token.name} has reverted to caster form!
		<table>
			<tr><td><b>Strength </b> </td><td> | {json.get(Attributes,"Strength")}</td></tr>
			<tr><td><b>Dexterity </b> </td><td> | {json.get(Attributes,"Dexterity")}</td></tr>
			<tr><td><b>Constitution </b> </td><td> | {json.get(Attributes,"Constitution")</td></tr>
			<tr><td><b>HP </b> </td><td> | {HP}/{MaxHP}</td></tr>
			<tr><td><b>AC </b> </td><td> | {AC}</td></tr>
			<tr><td><b>Speed </b> </td><td> | {Speed+SpeedSpecial}</td></tr>
		</table>
	</div>
</div>

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

<!--- Wild Shape Check & Data Pull --->

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

[r:pm.MacroFormat(ClassFeatureData)]

[h:AccentFormat = json.get(macro.return,"AccentFormat")]
[h:VerticalFormat = json.get(macro.return,"VerticalFormat")]
[h:VerticalFormatLinks = json.get(macro.return,"VerticalFormatLinks")]
[h:TableFormat = json.get(macro.return,"TableFormat")]
[h:outputTest.NoFullMacro = json.get(macro.return,"NoFullMacro")]
[h:outputTest.NoRolls = json.get(macro.return,"NoRolls")]
[h:outputTest.NoRules = json.get(macro.return,"NoRules")]
[h:DamageColor=pm.DamageColor()]
[h:HealingColor=pm.HealingColor()]
[h:CritColor=pm.CritColor()]
[h:CritFailColor=pm.CritFailColor()]
[h:LinkColor=pm.LinkColor()]

<!--- Damage HP Change --->

[if(HPChangeType<=1),CODE:{
	[h:HP=HP-HPChangeTotal]
	{token.name} takes a total of <span style='color:#AA2222;font-size:1.5em'>{HPChangeTotal}</span> damage.
	{if(BreakFormCheck==1,"<br><span style='color:#AA2222;font-size:1.5em'>"+HPChangeTotal+"</span> damage carried over to caster form.","")}
};{}]

<!--- Damage HP Change --->

[r:if(and(json.get(Feats,"HeavyArmorMaster")==1,HPChangeType<=1),"<br><b>Heavy Armor Master:</b> While wearing Heavy Armor, bludgeoning, piercing, and slashing damage that you take from non-magical weapons is reduced by 3.","")]

<!--- HP Drain --->

[if(HPChangeType==1),CODE:{
	[h:HPDrain=HPDrain+HPChangeTotal]
	<br>[r:token.name] has been drained of HP and now has a maximum HP of [r:MaxHP].
};{}]

<!--- HP Drain --->

<!--- Death Save Check --->

[if(state.Dying == 1 && HPChangeType == 0),CODE:
{ 
       [h:status1 = input("Crit|No,Yes|Did you take damage from a critical hit?|RADIO|SELECT=0")]
       [h:abort(status1)]
       
       [h,if(Crit == 1): Failures=(Failures+1),""]

       <br><b>{token.name} takes damage while dying!</b><br>
       [h:Failures=(Failures+1)]

       Death Saves: [r:Successes] successes and [r:Failures] failures.
};{}]

[if(Failures >= 3), code:
	{
		[r,if(json.get(LClass,"LBrb")>=14 && json.get(BrbPath,"Zlot")==1),CODE:{
			<br>[r:token.name] keeps on fighting through the divine power fueling their rage!
		};{
    	<br><b>[r:token.name] is dead!</b>
    	 [h:state.Dead=1]
		}]
	};{}]
[if(Failures == 2), code:
{
    <br><b>[r:token.name] is on the brink of death!</b>
};{}]

[h:DeathSaves=json.set("{ }", "Successes",Successes,"Failures",Failures)]

<!--- Death Save Check --->

<!--- Healing --->

[if(HPChangeType == 2),CODE:{
	[h:HP=if(and(HPChangeTotal>0,HP<0),0,HP)]
	[h:diff=MaxHP-HP]
	[h:HP=min(HP+HPChangeTotal,MaxHP)]
	[r:token.name] is healed and gains <span style='color:#22AA22;font-size:1.5em'>[r:min(diff,HPChangeTotal)]</span> hit points.
	[h:HPDrainTest=HPDrain]
	[h:DeathSaves=if(HP>-1,json.set("{ }", "Successes",0,"Failures",0),DeathSaves)]
	<!--- [h:HPDrain=0] --->
	<!--- {if(HPDrainTest>0,"<br>"+token.name+" has been healed of HP Drain and now has a maximum HP of "+MaxHP,"")} --->
};{}]

<!--- Healing --->

<!--- Temp HP --->

[if(HPChangeType == 3),CODE:
{
    [h:TempHP = HPChangeTotal]
    [r:token.name] gains <span style='color:#22AA22;font-size:1.5em'>[r:HPChangeTotal]</span> temporary hit points.
};{}]

<!--- Temp HP --->

<!-- Remove Drained HP -->

[r,if(HPChangeType == 4),CODE:
{
	[h:HPDrain.temp=HPDrain]
	[h:HPDrain=max((HPDrain-HPChangeTotal),0)]
	[h:HPChange.temp=HPDrain.temp-HPDrain]
	[r:token.name+" recovers <span style='color:#22AA22;font-size:1.5em'>"+HPChange.temp+"</span> of their drained maximum HP, returning to a maximum of "+MaxHP+"."]
};{}]

<!-- Remove Drained HP -->

[r,if(HP<1 && getState("Death Ward")),code:{
	[r:"<br><b>Death Ward</b>: Your Death Ward lets you keep on fighting!"]
	[h:setState("Death Ward",0)]
	[h:HP=1]
};
{}]

[r:if(and(HP<1,json.get(LClass,"LBrb")>=11),"<br><b>Relentless Rage</b>: You can use your Relentless Rage ability to keep on fighting! Save DC: <b>"+(10+(Relentless*5))+"</b>","")]
[r:if(and(json.get(LClass,"LRgr")>=7,json.get(RgrArchetype,"Hntr")==1,json.get(DefensiveTactics,"MltD")==1),"<br><b>Multiattack Defense</b>: When a creature hits you with an attack, you gain a +4 bonus to AC against all subsequent attacks made by that creature for the rest of the turn.","")]
[r:if(or(and(json.get(LClass,"LRgr")>=15,json.get(RgrArchetype,"Hntr")==1,json.get(SupHuntersDef,"UnDg")==1),json.get(LClass,"LRog")>=5),"<br><b>Uncanny Dodge</b>: When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you.","")]
[r:if(or(and(json.get(LClass,"LRgr")>=15,json.get(RgrArchetype,"Hntr")==1,json.get(SupHuntersDef,"Evas")==1),json.get(LClass,"LRog")>=5,json.get(LClass,"LMnk")>=7),"<br><b>Evasion</b>: When you are subject to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.","")]


[if(state.Rage == 1 && json.get(LClass,"LBrb")>=14 && json.get(BrbPath,"Zlot")==1 && HP<1 && HPChangeType == 0),CODE:{
		
	[h:state.Dying=if(HP <= 0, 1, 0)]
	[h:state.Dead=if(HP>0,0,state.Dead)]
	[h:bar.Health = HP / MaxHP]
	[r:if(HP<1,"<br><b>Rage Beyond Death</b>: Your divine rage prevents you from falling unconscious!","")]
	
	};{
		
	[h:state.Dying=if(HP <= 0, 1, 0)]
	[h:state.Dead=if(HP>0,0,state.Dead)]
	[h:state.Prone=if(HP <=0,1,state.Prone)]
	[h:state.Unconscious=if(HP <=0,1,state.Unconscious)]
	[h:state.Unconscious=if(HP >0,0,state.Unconscious)]
	[h:bar.Health = HP / MaxHP]

}]

<!--- Concentration & System Shock Checks --->

{if(UnbreakableConcentration==1,if(Concentration=="","","<br><b>Unbreakable Concentration:</b> "+token.name+" cannot lose focus on "+Concentration+"."),"")}

[h:ConcentrationFailure=0]
[h:SystemShockCheck=0]

[if(HPChangeType <= 1 && ConSaveBypass==0),CODE:{
	[r,count(Num,""),CODE:{
		[h:roll1=1d20+json.get(AtrMods, "Constitution")+ConSaveBonus+(Proficiency*json.get(Saves,"sCon"))]
		[h:roll2=1d20+json.get(AtrMods, "Constitution")+ConSaveBonus+(Proficiency*json.get(Saves,"sCon"))]
		[h:advroll=max(roll1,roll2)]
		[h:disroll=min(roll1,roll2)]
		[h:DifficultyClass=max(10,floor((listGet(hpChange1,roll.count)+listGet(hpChange2,roll.count))/2))]
		[h:ConSaveTest=if(ConSaveAdvantage==1,advroll,if(ConSaveAdvantage==2,disroll,roll1))]
		[h:ConcentrationFailure=if(ConSaveTest<DifficultyClass,ConcentrationFailure+1,ConcentrationFailure)]
		[r:if(getState("Concentrating")==1,"<br><b>Damage:</b> "+(listGet(hpChange1,roll.count)+listGet(hpChange2,roll.count))+" | | <b>Concentration DC:</b> "+DifficultyClass+" | | <b>Concentration Save:</b> "+ConSaveTest,"")]
	}]
};{}]

<!--- Concentration & System Shock Checks --->

	</div>
</div>

<!--- Lost Concentration Notice --->

{if(getState("Concentrating")==1,if(ConcentrationFailure>0,if(UnbreakableConcentration==0,
	"<div style='background-color: #02F5F5; color: #000000; padding-top:2px; padding-bottom:2px; padding-left:8px; padding-right:8px;'>
		<b>End Concentration</b>
		<div style='background-color:#FFFFFF; color: #000000; padding:2px;'>
			<div style='background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;'>
				<i>"+token.name+" loses focus due to injury!</i>
			</div>
			"+token.name+" has lost concentration on "+Concentration+"!
		</div>
	</div>",""
),""),"")}

[h:setState("Concentrating",if(ConcentrationFailure>0,if(UnbreakableConcentration==0,0,getState("Concentrating")),getState("Concentrating")))]
[h:Concentration=if(ConcentrationFailure>0,if(UnbreakableConcentration==0,"",Concentration),Concentration)]

<!--- Lost Concentration Notice --->

<!--- System Shock Notice --->


<!--- System Shock Notice --->