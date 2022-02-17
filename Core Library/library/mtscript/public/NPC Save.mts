[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]
[h:ForcedSave=json.get(macro.args,"ForcedSave")]

[h:sStr=json.get(Saves,"sStr")]
[h:sDex=json.get(Saves,"sDex")]
[h:sCon=json.get(Saves,"sCon")]
[h:sInt=json.get(Saves,"sInt")]
[h:sWis=json.get(Saves,"sWis")]
[h:sCha=json.get(Saves,"sCha")]

[h:roll1=1d20]
[h:roll2=1d20]
[h:SkillBonus=0]

[h:bsStr=Str+Proficiency*sStr][h:lsStr=if(bsStr>-1,"+","")][h:lsStr=lsStr+bsStr+" - Strength Save"]
[h:bsDex=Dex+Proficiency*sDex][h:lsDex=if(bsDex>-1,"+","")][h:lsDex=lsDex+bsDex+" - Dexterity Save"]
[h:bsCon=Con+Proficiency*sCon][h:lsCon=if(bsCon>-1,"+","")][h:lsCon=lsCon+bsCon+" - Constitution Save"]
[h:bsInt=Int+Proficiency*sInt][h:lsInt=if(bsInt>-1,"+","")][h:lsInt=lsInt+bsInt+" - Intelligence Save"]
[h:bsWis=Wis+Proficiency*sWis][h:lsWis=if(bsWis>-1,"+","")][h:lsWis=lsWis+bsWis+" - Wisdom Save"]
[h:bsCha=Cha+Proficiency*sCha][h:lsCha=if(bsCha>-1,"+","")][h:lsCha=lsCha+bsCha+" - Charisma Save"]

[h:AddedBonus=0]
[h:sBonus="0"]
[h:SkillDesc=""]
[h:iSaves=0]

[h,if(ForcedSave==""),CODE:{

[h:listSaves="--Choose--,"+lsStr+","+lsDex+","+lsCon+","+lsInt+","+lsWis+","+lsCha]

[h:SkillCheck=input(
	"SkillDesc|--Description Here--|Description||WIDTH=40",
	"iSaves|"+listSaves+"|Saves|LIST",
	"sBonus|0|Bonus||WIDTH=20"
)]
[h:abort(SkillCheck)]

[h:AddedBonus=eval(sBonus+"+1d1-1")]
};
{
	[h:iSaves=if(ForcedSave=="Strength",1,iSaves)]
	[h:iSaves=if(ForcedSave=="Dexterity",2,iSaves)]
	[h:iSaves=if(ForcedSave=="Constitution",3,iSaves)]
	[h:iSaves=if(ForcedSave=="Intelligence",4,iSaves)]
	[h:iSaves=if(ForcedSave=="Wisdom",5,iSaves)]
	[h:iSaves=if(ForcedSave=="Charisma",6,iSaves)]
}]

[h,switch(iSaves),code:
	case 0: {[SkillTitle="No Skill Selected"]};
	case 1: {[SkillTitle=lsStr][SkillBonus=bsStr]};
	case 2: {[SkillTitle=lsDex][SkillBonus=bsDex]};
	case 3: {[SkillTitle=lsCon][SkillBonus=bsCon]};
	case 4: {[SkillTitle=lsInt][SkillBonus=bsInt]};
	case 5: {[SkillTitle=lsWis][SkillBonus=bsWis]};
	case 6: {[SkillTitle=lsCha][SkillBonus=bsCha]}
]

<div style="background-color: #2222AA; color: #FFFFFF; padding-top:2px; padding-bottom:2px; padding-left:8px; padding-right:8px;width:400px;">
	<b>[r:SkillTitle]</b>
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">
			<i>[r:if(or(SkillDesc=="",SkillDesc=="--Description Here--"),Flavor,SkillDesc)]</i>
		</div>

		<span style='font-size:1.5em;'>Save: <b><span style='{if(roll1>=20,'font-size:2em; color:#AA2222;','')}{if(roll1==1,'font-size:2em; color:#2222AA;','')}'>[r:roll1+SkillBonus+AddedBonus]</span></b> ([r:roll1])</span><br>

		(Adv: <b><span style='{if(Max(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Max(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[r:Max(roll1,roll2)+SkillBonus+AddedBonus]</span></b> / Dis: <b><span style='{if(Min(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Min(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[r:Min(roll1,roll2)+SkillBonus+AddedBonus]</span></b>)

		[r:if(or(sBonus=="",sBonus==0),"","<br><b>Additional Bonus Included:</b> ")][r:if(or(sBonus=="",sBonus==0),"",sBonus)]
		
		[r:if(getState("Bless"),"<br><b>Bless:</b> Add 1d4 to your save:<span style='font-size:1.5em;'> "+1d4+"</span>","")]
		[r:if(getState("Bane"),"<br><b>Bane:</b> Subtract 1d4 from your save:<span style='font-size:1.5em;'> "+1d4+"</span>","")]
		[r:if(and(getState("Slow"),SkillTitle==lsDex),"<br><b>Slow:</b> -2 to your save: <span style='font-size:2em; color:#2222AA;'><b>"+(roll1+SkillBonus+AddedBonus-2)+" / "+(roll2+SkillBonus+AddedBonus-2)+"</b></span>","")]
		[r:if(and(getState("Dodge"),SkillTitle==lsDex),"<br><b>Dodge:</b> You have advantage on your saving throw.","")]
		[r:if(getState("Foresight"),"<br><b>Foresight:</b> You have advantage on your saving throw.","")]
		[r:if(and(getState("Restrained"),SkillTitle==lsDex),"<br><b>Restrained:</b> You have disadvantage on your saving throw.","")]
		[r:if(and(getState("Squeezing"),SkillTitle==lsDex),"<br><b>Squeezing:</b> You have disadvantage on your saving throw.","")]
		[r:if(and(getState("Enlarge"),SkillTitle==lsStr),"<br><b>Enlarge:</b> You have advantage on your saving throw.","")]
		[r:if(and(getState("Reduce"),SkillTitle==lsStr),"<br><b>Reduce:</b> You have disadvantage on your saving throw.","")]
		[r:if(and(getState("Haste"),SkillTitle==lsDex),"<br><b>Haste:</b> You have advantage on your saving throw.","")]
		[r:if(and(getState("Protection from Poison"),SkillTitle==lsCon),"<br><b>Protection from Poison:</b> You have advantage saving throws against being poisoned.","")]
		[r:if(and(getState("Gaseous Form"),or(SkillTitle==lsDex,SkillTitle==lsStr,SkillTitle==lsCon)),"<br><b>Gaseous Form:</b> You have advantage on your saving throw.","")]
		[r:if(and(getState("Unconscious"),or(SkillTitle==lsDex,SkillTitle==lsStr)),"<br><b>Unconscious:</b> <span style='color:#AA2222;'>You automatically fail your saving throw.</span>","")]
		[r:if(and(getState("Stunned"),or(SkillTitle==lsDex,SkillTitle==lsStr)),"<br><b>Stunned:</b> <span style='color:#AA2222;'>You automatically fail your saving throw.</span>","")]
		[r:if(and(getState("Petrified"),or(SkillTitle==lsDex,SkillTitle==lsStr)),"<br><b>Petrified:</b> <span style='color:#AA2222;'>You automatically fail your saving throw.</span>","")]
		[r:if(and(getState("Paralyzed"),or(SkillTitle==lsDex,SkillTitle==lsStr)),"<br><b>Paralyzed:</b> <span style='color:#AA2222;'>You automatically fail your saving throw.</span>","")]
		[r:if(Exhaustion>=3,"<br><b>Exhausted:</b> You have disadvantage on all saving throws.","")]

	</div>
</div>