[h:WName=json.get(macro.args,"WName")]
[h:DmgType=json.get(macro.args,"DmgType")]
[h:DmgType2=json.get(macro.args,"DmgType2")]
[h:DmgDie=json.get(macro.args,"DmgDie")]
[h:DmgDie2=json.get(macro.args,"DmgDie2")]
[h:DmgMod=json.get(macro.args,"DmgMod")]
[h:PrimeStat=json.get(macro.args,"PrimeStat")]
[h:MagicBonus=json.get(macro.args,"MagicBonus")]
[h:SpecialAbility=json.get(macro.args,"SpecialAbility")]
[h:MiscAtkBonus=json.get(macro.args,"MiscAtkBonus")]
[h:MiscDmgBonus=json.get(macro.args,"MiscDmgBonus")]
[h:MinCrit=json.get(macro.args,"MinCrit")]
[h:FlavorText=json.get(macro.args,"FlavorText")]
[h:BttnClr=json.get(macro.args,"BttnClr")]
[h:FntClr=json.get(macro.args,"FntClr")]
[h:DmgClr=json.get(macro.args,"DmgClr")]
[h:DmgClr2=json.get(macro.args,"DmgClr2")]
[h:SaveDC=json.get(macro.args,"SaveDC")]
[h:SaveType=json.get(macro.args,"SaveType")]
[h:PCVersion=json.get(macro.args,"PCVersion")]

<div style='background-color: {BttnClr}; color: {FntClr}; padding-top:2px; padding-bottom:5px; padding-left:8px; padding-right:8px;'>
	<b>[r:WName] Attack ([r:DmgType][r:if(DmgDie2=="0",""," and "+DmgType2)])</b>
		<div style='background-color:#FFFFFF; color: #000000; padding:2px;'>
		
			[r,if(FlavorText==""),CODE:{};{<div style='background-color:#E5E5AE; padding:2px;'><i>[r:FlavorText]</i></div>}]
		
		[h:BttnClr=if(BttnClr=='orange','#FFAA22',BttnClr)]
		[h:Stat=eval(PrimeStat)]
		[h:roll1 = 1d20]
		[h:roll2 = 1d20]
		[h:wDamageDieNumber = number(substring(DmgDie,0,number(indexOf(DmgDie,"d"))))]
		[h:wDieSize=number(substring(DmgDie,indexOf(DmgDie,"d")+1))]
		[h:Roll1=1d20]
		[h:Roll2=1d20]
		[h:wDmg = 0]
		[h:wDmgString = ""]
		[h:wDmgArray = ""]
		[h:wDmgCount = 0]
		[h:wCritDmg = 0]
		[h:wCritDmgString = ""]
		[h:wCritDmgArray = ""]
		
		[h,count(wDamageDieNumber),CODE:{
			[h:tempRoll = eval("1d"+wDieSize)]
			[h:wDmg = wDmg + tempRoll]
			[h:wDmgArray = json.append(wDmgArray,tempRoll)]	
			[h:wDmgString = wDmgString+" + "+json.get(wDmgArray,wDmgCount)]
			[h:wDmgCount = wDmgCount+1]
		}]
		
		[h:wDmgString = substring(wDmgString,3)]
		[h:wDmgCount = 0]
		
		[h,count(wDamageDieNumber),CODE:{
			[h:tempRoll = eval("1d"+wDieSize)]
			[h:wCritDmg = wCritDmg + tempRoll]
			[h:wCritDmgArray = json.append(wCritDmgArray,tempRoll)]
			[h:wCritDmgString = wCritDmgString+" + "+json.get(wCritDmgArray,wDmgCount)]
			[h:wDmgCount = wDmgCount+1]
		}]
		
		[h:wCritDmgString = substring(wCritDmgString,3)]
		[h:wSecDamageDieNumber = number(substring(DmgDie2,0,1))]
		[h:wSecDieSize=number(substring(DmgDie2,indexOf(DmgDie2,"d")+1))]
		[h:wSecDmg=0]
		[h:wSecDmgString = ""]
		[h:wSecDmgArray = ""]
		[h:wCritSecDmg=0]
		[h:wCritSecDmgString = ""]
		[h:wCritSecDmgArray = ""]
		
		[h,if(DmgDie2=="0"),CODE:{
			
		};{
		[h,count(wSecDamageDieNumber),CODE:{
			[h:tempRoll = eval("1d"+wSecDieSize)]
			[h:wSecDmg = wSecDmg + tempRoll]
			[h:wSecDmgArray = json.append(wSecDmgArray,tempRoll)]
			[h:wSecDmgString = wSecDmgString+" + "+json.get(wSecDmgArray,roll.count)]
			[h:wSecDmgString = if(roll.count==(wSecDamageDieNumber-1),substring(wSecDmgString,3),wSecDmgString)]
		}]
		
		[h,count(wSecDamageDieNumber),CODE:{
			[h:tempRoll = eval("1d"+wSecDieSize)]
			[h:wCritSecDmg = wCritSecDmg + tempRoll]
			[h:wCritSecDmgArray = json.append(wCritSecDmgArray,tempRoll)]
			[h:wCritSecDmgString = wCritSecDmgString+" + "+json.get(wCritSecDmgArray,roll.count)]
			[h:wCritSecDmgString = if(roll.count==(wSecDamageDieNumber-1),substring(wCritSecDmgString,3),wCritSecDmgString)]
		}]
		}]
		
		<span style='font-size:1.5em;'>Attack: <b><span style='{if(roll1>=MinCrit,'font-size:2em; color:#AA2222;','')}{if(roll1==1,'font-size:2em; color:#2222AA;','')}'>[r:roll1+Proficiency+Stat+MiscAtkBonus+MagicBonus] ([r:roll1])</span></b></span><br>
		
		(Adv: <b><span style='{if(Max(roll1,roll2)>=MinCrit,'font-size:2em; color:#AA2222;','')}{if(Max(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[r:Max(roll1,roll2)+Proficiency+Stat+MiscAtkBonus+MagicBonus]</span></b> / Dis: <b><span style='{if(Min(roll1,roll2)>=MinCrit,'font-size:2em; color:#AA2222;','')}{if(Min(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[r:Min(roll1,roll2)+Proficiency+Stat+MiscAtkBonus+MagicBonus]</span></b>)
		
		<br><span style='font-size:1.5em;color: {DmgClr}'> [r:DmgType] Damage:</span> [r:wDmgString][r:if(DmgMod=="Yes"," + "+Stat,"")][r:if(MagicBonus=="",""," + "+MagicBonus)][r:if(MiscDmgBonus==0,""," + "+MiscDmgBonus)] = <b><span style='font-size:1.5em'>[r:wDmg+if(DmgMod=="Yes",Stat,0)+MiscDmgBonus+MagicBonus]</span></b></b></br>[r:If(Max(roll1,roll2)>=MinCrit,'<span style="color:AA2222;"><span style="font-size:1.5em"> Crit:</span> + ','')][r:If(Max(roll1,roll2)>=MinCrit,wCritDmgString+' = <b><span style="font-size:1.5em">'+(wDmg+wCritDmg)+'</b></span>','')]</span>
		
		[r,if(DmgDie2=="0"),CODE:{
			
		};{
		<br><span style='font-size:1.5em; color: {DmgClr2}'>[r:DmgType2] Damage:</span> [r:wSecDmgString] = <b><span style='font-size:1.5em'>[r:wSecDmg]</span></b></br><span style='color:AA2222;'>[r:If(Max(roll1,roll2)>=MinCrit,'<span style="color:AA2222;"><span style="font-size:1.5em"> Crit:</span> + ','')][r:If(Max(roll1,roll2)>=MinCrit,wCritSecDmgString+' = <b><span style="font-size:1.5em">'+(wSecDmg+wCritSecDmg)+'</b></span>','')]</span></span>
		}]
		
		[g:if(or(SpecialAbility=="",PCVersion=="1"),"","<br><span style='background-color:#FFFFFF;'>"+SpecialAbility+"</span>")]
		[r:if(or(SpecialAbility=="",PCVersion=="0"),"","<br><span style='background-color:#FFFFFF;'>"+SpecialAbility+"</span>")]
		
		[r:if(SaveType=="None","","<br><span style='font-size:1.5em;'>Saving Throw: <b>")]
		[g:if(or(SaveType=="None",PCVersion=="1"),"","<span style='background-color:#FFFFFF;'>DC "+SaveDC+"</span>")]
		[r:if(or(SaveType=="None",PCVersion=="0"),"","<span style='background-color:#FFFFFF;'>DC "+SaveDC+"</span>")]
		[r:if(SaveType=="None","",SaveType+"</b>")]
		
	</div>
</div>