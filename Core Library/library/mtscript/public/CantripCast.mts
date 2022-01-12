[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]
[h:SpellName=json.get(macro.args,"SpellName")]
[h:sList=json.get(macro.args,"sList")]
[h:sSchool=json.get(macro.args,"sSchool")]
[h:CastTime=json.get(macro.args,"CastTime")]
[h:Range=json.get(macro.args,"Range")]
[h:Target=json.get(macro.args,"Target")]
[h:Components=json.get(macro.args,"Components")]
[h:Duration=json.get(macro.args,"Duration")]
[h:sDamage=json.get(macro.args,"sDamage")]
[h:sDamageType=json.get(macro.args,"sDamageType")]
[h:sConcentration=json.get(macro.args,"sConcentration")]
[h:sSpellSave=json.get(macro.args,"sSpellSave")]
[h:sSaveType=json.get(macro.args,"sSaveType")]
[h:sSpellAttack=json.get(macro.args,"sSpellAttack")]
[h:sOnHit=json.get(macro.args,"sOnHit")]
[h:sDescription=json.get(macro.args,"sDescription")]

<!--- Dialogue --->
[h:sClassSelect=""]

[h:SecretTest=0]
[h,count(8),code:{
	[h:SecretTest=if(SpellName==json.get(MagicalSecrets,roll.count),SecretTest+1,SecretTest)]
}]

[h:BookOfShadowsTest=0]
[h,count(listCount(BookOfShadows)),code:{
	[BookOfShadowsTest=if(SpellName==listGet(BookOfShadows,roll.count),BookOfShadowsTest+1,BookOfShadowsTest)]
}]

[h:MagicInitiateTest = 0]
[h:MagicInitiateTest = if(and(or(SpellName==json.get(MagicInitiateSpells,0),SpellName==json.get(MagicInitiateSpells,1)),json.get(Feats,"MagicInitiate")==1),1,0)]

[h:SpellSniperTest = 0]
[h:SpellSniperTest = if(and(SpellName==json.get(SpellSniperSpell,0),json.get(Feats,"SpellSniper")==1),1,0)]

[h:ArcaneInitiateTest = 0]
[h:ArcaneInitiateTest = if(and(or(SpellName==json.get(ArcaneInitiateSpells,0),SpellName==json.get(ArcaneInitiateSpells,1)),json.get(LClass,"LClc")>=1,json.get(ClcDomain,"Arc")==1),1,0)]

[h:AcolyteofNatureTest = 0]
[h:AcolyteofNatureTest = if(and(SpellName==json.get(AcolyteofNatureSpells,0),json.get(LClass,"LClc")>=1,json.get(ClcDomain,"Ntur")==1),1,0)]

<!--- Can also be used for spells with similar damage scaling to Green Flame Blade by adding their name to the if statement -->

[h:GreenFlameTest = 0]
[h:GreenFlameTest = if(SpellName=="Green-Flame Blade",1,0)]

[h:sDamageDice=if(GreenFlameTest==1,if(Level<5,0,if(Level<11,1,if(Level<17,2,3))),if(Level<5,1,if(Level<11,2,if(Level<17,3,4))))]

[h:ClassOptions=
	if(and(json.get(LClass,"LBrb")>=json.get(sList,"Brb"),json.get(sList,"Brb")>0),"Barbarian,","")
	+if(or(and(json.get(LClass,"LBrd")>=json.get(sList,"Brd"),json.get(sList,"Brd")>0),SecretTest==1,and(MagicInitiateTest==1,MagicInitiateClass=="Bard",json.get(sList,"Brd")>0),and(SpellSniperTest==1,SpellSniperClass=="Bard",json.get(sList,"Brd")>0)),"Bard,","")
	+if(or(and(json.get(LClass,"LClc")>=json.get(sList,"Clc"),json.get(sList,"Clc")>0),and(MagicInitiateTest==1,MagicInitiateClass=="Cleric",json.get(sList,"Clc")>0),and(SpellSniperTest==1,SpellSniperClass=="Cleric",json.get(sList,"Clc")>0),and(json.get(LClass,"LClc")>=json.get(sList,"Wiz"),json.get(sList,"Wiz")>0,ArcaneInitiateTest==1)),"Cleric,","")
	+if(or(and(json.get(LClass,"LDrd")>=json.get(sList,"Drd"),json.get(sList,"Drd")>0),AcolyteofNatureTest==1,and(MagicInitiateTest==1,MagicInitiateClass=="Druid",json.get(sList,"Drd")>0)),"Druid,","")
	+if(and(json.get(LClass,"LFtr")>=json.get(sList,"Ftr"),json.get(sList,"Ftr")>0),"Fighter,","")
	+if(and(json.get(LClass,"LMnk")>=json.get(sList,"Mnk"),json.get(sList,"Mnk")>0),"Monk,","")
	+if(and(json.get(LClass,"LPdn")>=json.get(sList,"Pdn"),json.get(sList,"Pdn")>0),"Paladin,","")
	+if(and(json.get(LClass,"LRgr")>=json.get(sList,"Rgr"),json.get(sList,"Rgr")>0),"Ranger,","")
	+if(and(json.get(LClass,"LRog")>=json.get(sList,"Rog"),json.get(sList,"Rog")>0),"Rogue,","")
	+if(or(and(json.get(LClass,"LScr")>=json.get(sList,"Scr"),json.get(sList,"Scr")>0),and(MagicInitiateTest==1,MagicInitiateClass=="Sorcerer",json.get(sList,"Scr")>0),and(SpellSniperTest==1,SpellSniperClass=="Sorcerer",json.get(sList,"Scr")>0)),"Sorcerer,","")
	+if(or(and(json.get(LClass,"LWlk")>=json.get(sList,"Wlk"),json.get(sList,"Wlk")>0),BookOfShadowsTest==1,and(MagicInitiateTest==1,MagicInitiateClass=="Warlock",json.get(sList,"Wlk")>0),and(SpellSniperTest==1,SpellSniperClass=="Warlock",json.get(sList,"Wlk")>0)),"Warlock,","")
	+if(or(and(json.get(LClass,"LWiz")>=json.get(sList,"Wiz"),json.get(sList,"Wiz")>0),and(MagicInitiateTest==1,MagicInitiateClass=="Wizard",json.get(sList,"Wiz")>0),and(SpellSniperTest==1,SpellSniperClass=="Wizard",json.get(sList,"Wiz")>0)),"Wizard,","")
	+if(and(json.get(LClass,"LArt")>=json.get(sList,"Art"),json.get(sList,"Art")>0),"Artificer,","")
	+if(and(Race=="High Elf",SpellName==HECantrip),"High Elf,","")
	+if(and(Race=="Drow",SpellName=="Dancing Lights"),"Drow,","")
	+if(and(Race=="Tiefling",SpellName=="Thaumaturgy"),"Tiefling,","")
	+"None"
]

[h:dissConcentration=if(sConcentration==0,"",if(Concentration=="","","junkVar|<html><span style='font-size:1.2em';>Casting <span style='color:#2222AA'><i>"+SpellName+"</i></span> will cancel concentration on <span style='color:#AA2222'><i>"+Concentration+".</i></span></span></html>|<html><span style='color:#AA2222; font-size:1.2em'><b>WARNING</b></span></html>|LABEL"))]
[h:disCastTime=if(CastTime=="","","junkVar|"+CastTime+"|Cast Time|LABEL")]
[h:disRange=if(Range=="","","junkVar|"+Range+"|Range|LABEL")]
[h:disTarget=if(Target=="","","junkVar|"+Target+"|Target|LABEL")]
[h:disComponents=if(Components=="","","junkVar|"+Components+"|Components|LABEL")]
[h:disDuration=if(Duration=="","","junkVar|"+Duration+"|Duration|LABEL")]
[h:dissDamage=if(sDamage=="0","","junkVar|"+sDamageDice+sDamage+"|"+sDamageType+" Damage|LABEL")]
[h:dissOnHit=if(sOnHit=="","","junkVar|"+sOnHit+"|On Hit|LABEL")]

[h:SpellOptions=input(
	""+dissConcentration+"",
	"junkVar|"+SpellName+" (cantrip) "+sSchool+"|Spell|LABEL",
	"sClassSelect|"+ClassOptions+"|Choose Class to cast|LIST| VALUE=STRING",
	"junkVar|Cantrip|Spell Level|Label",
	""+disCastTime+"",
	""+disRange+"",
	""+disTarget+"",
	""+disComponents+"",
	""+disDuration+"",
	""+dissDamage+"",
	""+dissOnHit+""
)]
[h:abort(SpellOptions)]

<!--- Dialogue --->

[h:sDamageStr = ""]
[h:rsDamage = 0]
[h:csDamageStr = ""]
[h:crsDamage = 0]
[h:flatBonus = 0]

[h:DieSizePlaceholder = if(sDamage=="0","00",sDamage)]
[h:DieSize = substring(DieSizePlaceholder,1)]

[h:SBTest=if(and(sDamage!="0",json.get(ScrOrigin,"WldM")==1,json.get(LClass,"LScr")>=18),1,0)]
[h:SBTrigger = 0]

[h:EAdeptTest=if(listCount(ElementalAdept)>0,if(listFind(ElementalAdept,sDamageType)>-1,if(sDamage=="0",0,1),0),0)]
[h:eAdeptTrigger=0]

<!--- Cancel Old Spell Notice --->

{if(getState("Concentrating")==1,if(sConcentration==1,
	"<div style='background-color: #02F5F5; color: #000000; padding-top:2px; padding-bottom:2px; padding-left:8px; padding-right:8px;'>
		<b>End Concentration</b>
		<div style='background-color:#FFFFFF; color: #000000; padding:2px; width:400px;'>
			<div style='background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;'>
				<i>"+token.name+" changes tactics.</i>
			</div>
			"+token.name+" has stopped concentrating on "+Concentration+".
		</div>
	</div>",""
),"")}

<!--- Cancel Old Spell Notice --->

[h:roll1=1d20]
[h:roll2=1d20]

[h:sDamageArray = ""]
[h:sDamageCount = 0]
[h:csDamageArray = ""]

[h,if(sDamageDice>0),CODE:{
	
	[h,count(sDamageDice),code:{
		[h:tempRoll = eval(string(1+sDamage))]
		[h:eAdeptTrigger = if(and(EAdeptTest==1,tempRoll==1),eAdeptTrigger+1,eAdeptTrigger)]
		[h:tempRoll = if(and(EAdeptTest==1,tempRoll==1),2,tempRoll)]
		[h:rsDamage = rsDamage + tempRoll]
		[h:sDamageArray = json.append(sDamageArray,tempRoll)]
		[h:sDamageStr = sDamageStr +" + "+json.get(sDamageArray,sDamageCount)]
		[h:sDamageCount = sDamageCount+1]
		[h:SBTrigger = if(and(SBTest==1,tempRoll==DieSize),(SBTrigger+1),SBTrigger)]
	}]

	[h:sDamageStr = substring(sDamageStr,3)]

	[h:sDamageCount = 0]

	[h,count(sDamageDice),code:{
		[h:tempRoll = eval(string(1+sDamage))]
		[h:eAdeptTrigger = if(and(EAdeptTest==1,tempRoll==1),eAdeptTrigger+1,eAdeptTrigger)]
		[h:tempRoll = if(and(EAdeptTest==1,tempRoll==1),2,tempRoll)]
		[h:crsDamage = crsDamage + tempRoll]
		[h:csDamageArray = json.append(csDamageArray,tempRoll)]
		[h:csDamageStr = csDamageStr +" + "+json.get(csDamageArray,sDamageCount)]
		[h:sDamageCount = sDamageCount+1]
		[h:SBTrigger = if(and(SBTest==1,tempRoll==DieSize),(SBTrigger+1),SBTrigger)]
	}]
	[h:csDamageStr = substring(csDamageStr,3)]
}]

[h:SBBonusDamage=0]
[h,if(SBTrigger>0),code:{
	[h:SBBonusDamage=eval("1d"+DieSize)]
};{}]

<!-- Needs resetting -->
[h:MagicItemAtkBonus = 0]
[h:MagicItemDmgBonus = 0]

[h:SpellDamage=MagicItemDmgBonus+rsDamage+if(sClassSelect=="Cleric",if(json.get(LClass,"LClc")>=8,if(or(json.get(ClcDomain,"Knwg")==1,json.get(ClcDomain,"Lght")==1,json.get(ClcDomain,"Arc")==1),Wis,0),0),0)]
[h:CritSpellDamage=MagicItemDmgBonus+rsDamage+crsDamage+if(sClassSelect=="Cleric",if(json.get(LClass,"LClc")>=8,if(or(json.get(ClcDomain,"Knwg")==1,json.get(ClcDomain,"Lght")==1,json.get(ClcDomain,"Arc")==1),Wis,0),0),0)]
[h:setState("Concentrating",if(sConcentration==1,1,getState("Concentrating")))]
[h:Concentration=if(sConcentration==1,SpellName,Concentration)]

[h:PrimeStat=if(sClassSelect=="Barbarian",Str,0)+if(sClassSelect=="Bard",Cha,0)+if(sClassSelect=="Cleric",Wis,0)+if(sClassSelect=="Druid",Wis,0)+if(sClassSelect=="Fighter",Int,0)+if(sClassSelect=="Monk",Wis,0)+if(sClassSelect=="Paladin",Cha,0)+if(sClassSelect=="Ranger",Wis,0)+if(sClassSelect=="Rogue",Int,0)+if(sClassSelect=="Sorcerer",Cha,0)+if(sClassSelect=="Warlock",Cha,0)+if(sClassSelect=="Wizard",Int,0)+if(sClassSelect=="Artificer",Int,0)+if(sClassSelect=="High Elf",Int,0)+if(sClassSelect=="Drow",Cha,0)+if(sClassSelect=="Tiefling",Cha,0)]

[h:SpellDamage=if(GreenFlameTest==1,SpellDamage+PrimeStat,SpellDamage)]
[h:sDamageStr = if(GreenFlameTest==1,sDamageStr+" + "+PrimeStat,sDamageStr)]

<div style="background-color: #93160D; color: #FFFFFF; padding-top:2px; padding-bottom:2px; padding-left:8px; padding-right:8px;">
	<b>{SpellName}</b> (cantrip) <i>{sSchool}</i>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px; width:400px;">
		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">
			<i>{Flavor}</i>
		</div>
		<table style="padding:3px;">
			<tr><td><b>Cast as </b></td><td>| {sClassSelect} cantrip</td></tr>
			{if(CastTime=="","","<tr><td><b>Casting Time </b></td><td> | "+CastTime+"</td></tr>")}
			{if(Range=="","","<tr><td><b>Range </b></td><td> | "+Range+"</td></tr>")}
			{if(Target=="","","<tr><td><b>Target </b></td><td> | "+Target+"</td></tr>")}
			{if(Components=="","","<tr><td><b>Components </b></td><td> | "+Components+"</td></tr>")}
			{if(Duration=="","","<tr><td><b>Duration </b></td><td> | "+Duration+"</td></tr>")}
			{if(sSpellSave==0,"","<tr><td><b>"+sSaveType+" Save DC </b></td><td> | <span style='font-size:1.5em;'>")}[r:if(sSpellSave==0,"",8+Proficiency+PrimeStat)]{if(sSpellSave==0,"","</span></td></tr>")}
			{if(sSpellAttack==0,"","<tr><td><b>Spell Attack </b></td><td> | "+if(roll1==20,"<span style='font-size:1.5em; color:#AA2222;'>",if(roll1==1,"<span style='font-size:1.5em; color:#2222AA'>","<span style='font-size:1.5em;'>")))}
				[r:if(sSpellAttack==0,"",roll1+Proficiency+PrimeStat+MagicItemAtkBonus)][r:if(sSpellAttack==0,""," ("+roll1+") ")]
				{if(sSpellAttack==0,"","</span> (Adv. "+if(max(roll1,roll2)==20,"<span style='color:#AA2222;'>",if(max(roll1,roll2)==1,"<span style='color:#2222AA'>","<span>")))}[r:if(sSpellAttack==0,"",max(roll1,roll2)+Proficiency+PrimeStat+MagicItemAtkBonus)]
				{if(sSpellAttack==0,"","</span> / Dis. "+if(min(roll1,roll2)==20,"<span style='color:#AA2222;'>",if(min(roll1,roll2)==1,"<span style='color:#2222AA'>","<span>")))}[r:if(sSpellAttack==0,"",min(roll1,roll2)+Proficiency+PrimeStat+MagicItemAtkBonus)]{if(sSpellAttack==0,"","</span>)")}
			{if(sSpellAttack==0,"","</td></tr>")}
			
			{if(and(getState("Bless"),sSpellAttack!=0),"<tr><td><b>Blessed</b></td><td> | Add 1d4 to your attack roll:<span style='font-size:1.5em;'> "+1d4+"</span></td></tr>","")}
			{if(and(getState("Bane"),sSpellAttack!=0),"<tr><td><b>Bane</td><td> | Subtract 1d4 from your attack roll:<span style='font-size:1.5em;'> "+1d4+"</span></td></tr>","")}
			{if(and(getState("Squeezing"),sSpellAttack!=0),"<tr><td><b>Squeezing</b></td><td> | Your attack roll has disadvantage.</td></tr>","")}
		{if(and(getState("Blinded"),sSpellAttack!=0),"<tr><td><b>Blinded<tr><td><b> | You have disadvantage on your attack rolls.</td></tr>","")}
		{if(and(getState("Poisoned"),sSpellAttack!=0),"<tr><td><b>Poisoned<tr><td><b> | You have disadvantage on your attack rolls.</td></tr>","")}
		{if(and(getState("Prone"),sSpellAttack!=0),"<tr><td><b>Prone<tr><td><b> | You have disadvantage on your attack rolls.</td></tr>","")}
		{if(and(getState("Frightened"),sSpellAttack!=0),"<tr><td><b>Frightened<tr><td><b> | You have disadvantage on your attack rolls if the source of your fear is within line of sight.</td></tr>","")}
		{if(and(getState("Restrained"),sSpellAttack!=0),"<tr><td><b>Restrained<tr><td><b> | You have disadvantage on your attack rolls.</td></tr>","")}
		{if(and(getState("Greater Invisibility"),sSpellAttack!=0),"<tr><td><b>Greater Invisibility<tr><td><b> | You have advantage on your attack rolls.</td></tr>","")}
		{if(and(getState("Hidden"),sSpellAttack!=0),"<tr><td><b>Hidden<tr><td><b> | You have advantage on your first attack roll.</td></tr>","")}
		{if(and(getState("Foresight"),sSpellAttack!=0),"<tr><td><b>Foresight<tr><td><b> | You have advantage on your attack rolls.</td></tr>","")}
		[r:if(and(Exhaustion>=3,sSpellAttack!=0),"<tr><td><b>Exhausted<tr><td><b> | You have disadvantage on your attack rolls.</td></tr>","")]
		{if(and(getState("Invisible"),sSpellAttack!=0),"<tr><td><b>Invisibility<tr><td><b> | You have advantage on your first attack roll.</td></tr>","")}
		[h: setState("Invisible", 0)]
		[h: setOwnerOnlyVisible(0)]

			{if(sDamage=="0","","<tr><td><b>"+sDamageType+" Damage </b></td><td> | "+sDamageDice+sDamage+if(GreenFlameTest==1," + "+PrimeStat,"")+if(sClassSelect=="Cleric",if(json.get(LClass,"LClc")>=8,if(or(json.get(ClcDomain,"Knwg")==1,json.get(ClcDomain,"Lght")==1,json.get(ClcDomain,"Arc")==1)," + "+Wis,""),""),"")+" = "+sDamageStr+if(sClassSelect=="Cleric",if(json.get(LClass,"LClc")>=8,if(or(json.get(ClcDomain,"Knwg")==1,json.get(ClcDomain,"Lght")==1,json.get(ClcDomain,"Arc")==1)," + "+Wis,""),""),"")+if(MagicItemDmgBonus==0,""," + "+MagicItemDmgBonus)+" = <b><span style='color:#AA2222; font-size:1.5em'> "+SpellDamage+"</span></b></td></tr>")}
			{if(sDamage=="0","",if(json.get(WizTradition,"Evoc")==1,if(json.get(LClass,"LWiz")>=6,if(sSpellSave==1,"<tr><td><b>On Successful Save </b></td><td> | If Half Damage: <span style='color:#AA2222;'>"+floor(SpellDamage/2)+"</span>",""),""),""))}
			{if(sSpellAttack==1,if(max(roll1,roll2)==20,if(sDamage=="0","","<tr><td><b>"+sDamageType+" Damage on Crit </b></td><td> | "+sDamageDice+sDamage+" + "+sDamageDice+sDamage+if(GreenFlameTest==1," + "+PrimeStat,"")+if(sClassSelect=="Cleric",if(json.get(LClass,"LClc")>=8,if(or(json.get(ClcDomain,"Knwg")==1,json.get(ClcDomain,"Lght")==1,json.get(ClcDomain,"Arc")==1),"+"+Wis,""),""),"")+if(MagicItemDmgBonus==0,""," + "+MagicItemDmgBonus)+" = "+sDamageStr+" + "+csDamageStr+if(sClassSelect=="Cleric",if(json.get(LClass,"LClc")>=8,if(or(json.get(ClcDomain,"Knwg")==1,json.get(ClcDomain,"Lght")==1,json.get(ClcDomain,"Arc")==1)," + "+Wis,""),""),"")+" = <b><span style='color:#AA2222; font-size:1.5em'> "+CritSpellDamage+"</span></b></td></tr>"),""),"")}
			{if(sOnHit=="","","<tr><td><b>On Hit </b></td><td> | "+sOnHit+"</td></tr>")}
<!--
			[r:if(and(json.get(LClass,"LBrd")>=14,json.get(BrdCollege,"Vlor")==1,sClassSelect=="Bard"),"<tr><th style='text-align:left; background-color:#FFFFFF;'>Battle Magic</th><td> | You can make one weapon attack as a bonus action.</td></tr>","")]

			[r:if(and(json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"ErKn")==1),"<tr><th style='text-align:left; background-color:#FFFFFF;'>War Magic</th><td> | You can make one weapon attack as a bonus action.</td></tr>","")]
			{if(SBBonusDamage==0,"","<tr><th style='text-align:left; background-color:#FFFFFF;'>Spell Bombardment</th><td> | <span style='color:#AA2222; font-size:1.5em;'>"+SBBonusDamage+"</span> Bonus Damage</td></tr>")}

			{if(or(sSchool=="evocation",sSchool=="Evocation"),if(json.get(WizTradition,"Evoc")==1,if(json.get(LClass,"LWiz")>=10,if(sDamage=="0","","<tr><th style='text-align:left; background-color:#FFFFFF;'>Empowered Evocation</th><td> | Bonus Damage: <span style='color:#AA2222; font-size:1.5em;'>"+Int+"</span></td></tr>"),""),""),"")}
			
			{if(sDamageType=="Lightning",if(json.get(LClass,"LClc")>=6,if(json.get(ClcDomain,"Tmpt")==1,"<tr><th style='text-align:left; background-color:#FFFFFF;'>Thunderbolt Strike</th><td> | When you deal lightning damage to a Large or smaller creature, you can also push it up to 10 feet away from you.</td></tr>",""),""),"")}
			
			{if(and(json.get(LClass,"LArt")>=5,json.get(ArtSpecialist,"Alch")==1,or(sDamageType=="Fire",sDamageType=="Acid",sDamageType=="Necrotic",sDamageType=="Poison")),"<tr><th style='text-align:left; background-color:#FFFFFF;'><b>Alchemical Savant </b></th><td> | You may add "+if(Int<1,1,Int)+" to any roll of this spell.</td></tr>","")}
			{if(and(json.get(LClass,"LArt")>=5,json.get(ArtSpecialist,"Artil")==1,sDamageType!="Healing",sDamageType!=""),"<tr><th style='text-align:left; background-color:#FFFFFF;'><b>Arcane Firearm </b></th><td> | You may add "+1d8+" to any damage roll of this spell if you are using your arcane firearm.</td></tr>","")}

-->
			{if(json.get(Feats,"SpellSniper")==1,if(sSpellAttack+sSpellSave>=1,if(Range=="Touch","","<tr><th style='text-align:left; background-color:#FFFFFF;'>Spell Sniper</th><td> | Your ranged spell attacks ignore half cover and three-quarter cover.</td></tr>"),""),"")}
			{if(EAdeptTest==1,"<tr><th style='text-align:left; background-color:#FFFFFF;'>Elemental Adept</th><td> | This spell ignores resistance to "+sDamageType+" damage.</td></tr>","")}
			{if(EAdeptTest==1,"<tr><th style='text-align:left; background-color:#FFFFFF;'>Bonus Damage</th><td> | Your spell converted <span style='color:#AA2222; font-size:1.5em;'>"+eAdeptTrigger+"</span> 1s on your damage dice into 2s.</td></tr>","")}
		{if(and(Race=="Goblin",gFuryofSmall>0),"<tr><th style='text-align:left; background-color:#FFFFFF;'>Fury of the Small</th><td> | If the target is larger than you, you can deal <b>"+Level+"</b> extra damage.</td></tr>","")}
			
		</table>
		{sDescription}
	</div>
</div>
<!--
[r,if(json.get(LClass,"LBrd")>13 && json.get(BrdCollege,"Vlor")==1 && sClassSelect=="Bard"),code:{
	[macro("Battle Magic@this"):""]
};{}]-->