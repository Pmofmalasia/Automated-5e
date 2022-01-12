[h:WName=json.get(macro.args,"WeaponName")]
[h:DmgType=json.get(macro.args,"DamageType")]
[h:DmgDie=json.get(macro.args,"DamageDie")]
[h:PrimeStat=json.get(macro.args,"PrimaryStat")]
[h:MagicBonus=json.get(macro.args,"MagicBonus")]
[h:SpecialAbility=json.get(macro.args,"SpecialAbility")]
[h:MiscAtkBonus=json.get(macro.args,"MiscAttackBonus")]
[h:MiscDmgBonus=json.get(macro.args,"MiscDamageBonus")]
[h:MinCrit=json.get(macro.args,"MinimumCritRoll")]
[h:FlavorText=json.get(macro.args,"FlavorText")]
[h:BttnClr=json.get(macro.args,"ButtonColor")]
[h:FntClr=json.get(macro.args,"FontColor")]
[h:BttnClr=if(BttnClr=='orange','#FFAA22',BttnClr)]

<div style='background-color:{BttnClr}; color: {FntClr}; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;width:400px;'>[h:Stat=eval(PrimeStat)]<b>{WName} Attack ({DmgType})</b><div style='background-color:#FFFFFF; color: #000000; padding:2px;'><div style='background-color:#E5E5AE; padding:2px;'><i>{FlavorText}</i></div>
[h:roll1 = 1d20]
[h:roll2 = 1d20]
[h:PrimeStat=eval(PrimeStat)]
[h:dmg1 = eval(DmgDie)]
[h:dmg2 = eval(encode(CritMultiplier)+"*"+DmgDie)]
<span style='font-size:1.5em;'>Attack: <b><span style='{if(roll1>=MinCrit,'font-size:2em; color:#AA2222;','')}{if(roll1==1,'font-size:2em; color:#2222AA;','')}'>[r:roll1+Proficiency+PrimeStat+MiscAtkBonus+MagicBonus]</span></b></span> ([r:roll1])<br>

(Adv: <b><span style='{if(Max(roll1,roll2)>=MinCrit,'font-size:2em; color:#AA2222;','')}{if(Max(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[r:Max(roll1,roll2)+Proficiency+PrimeStat+MiscAtkBonus+MagicBonus]</span></b>

 / Dis: <b><span style='{if(Min(roll1,roll2)>=MinCrit,'font-size:2em; color:#AA2222;','')}{if(Min(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[r:Min(roll1,roll2)+Proficiency+PrimeStat+MiscAtkBonus+MagicBonus]</span></b>)<br>

<span style='font-size:1.5em;'>Damage: <b>[r:dmg1] + [r:PrimeStat][r:if(MiscDmgBonus==0,""," + "+MiscDmgBonus)][r:if(MagicBonus==0,""," + "+MagicBonus)] = [r:dmg1+PrimeStat+MiscDmgBonus+MagicBonus]</b></br>

<span style='color:AA2222;'>{If(Max(roll1,roll2)>=MinCrit,' Crit: ','')}<b>[r:If(Max(roll1,roll2)>=MinCrit, dmg1+dmg2+PrimeStat+MiscDmgBonus+MagicBonus,'')]</b></span></span><br>

{SpecialAbility}</div></div>