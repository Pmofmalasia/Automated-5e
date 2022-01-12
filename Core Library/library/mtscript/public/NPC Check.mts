[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]
[h:ForcedSkill=json.get(macro.args,"ForcedSkill")]

[h:Acb=json.get(Skills,"Acb")]
[h:AnH=json.get(Skills,"AnH")]
[h:Arc=json.get(Skills,"Arc")]
[h:Ath=json.get(Skills,"Ath")]
[h:Dcp=json.get(Skills,"Dcp")]
[h:Hst=json.get(Skills,"Hst")]
[h:Ins=json.get(Skills,"Ins")]
[h:Imd=json.get(Skills,"Imd")]
[h:Inv=json.get(Skills,"Inv")]
[h:Med=json.get(Skills,"Med")]
[h:Ntr=json.get(Skills,"Ntr")]
[h:Pcp=json.get(Skills,"Pcp")]
[h:Pfm=json.get(Skills,"Pfm")]
[h:Prs=json.get(Skills,"Prs")]
[h:Rlg=json.get(Skills,"Rlg")]
[h:SoH=json.get(Skills,"SoH")]
[h:Stl=json.get(Skills,"Stl")]
[h:Srv=json.get(Skills,"Srv")]

[h:roll1=1d20]
[h:roll2=1d20]
[h:NO=0]
[h:SkillBonus=0]

[h:bStr=json.get(AtrMods, "Strength")][h:lStr=if(bStr>-1,"+","")][h:lStr=lStr+bStr+" - Strength Check"]
[h:bDex=json.get(AtrMods, "Dexterity")][h:lDex=if(bDex>-1,"+","")][h:lDex=lDex+bDex+" - Dexterity Check"]
[h:bCon=json.get(AtrMods, "Constitution")][h:lCon=if(bCon>-1,"+","")][h:lCon=lCon+bCon+" - Constitution Check"]
[h:bInt=json.get(AtrMods, "Intelligence")][h:lInt=if(bInt>-1,"+","")][h:lInt=lInt+bInt+" - Intelligence Check"]
[h:bWis=json.get(AtrMods, "Wisdom")][h:lWis=if(bWis>-1,"+","")][h:lWis=lWis+bWis+" - Wisdom Check"]
[h:bCha=json.get(AtrMods, "Charisma")][h:lCha=if(bCha>-1,"+","")][h:lCha=lCha+bCha+" - Charisma Check"]

[h:bAcb=json.get(AtrMods, "Dexterity")+(Acb*Proficiency)][h:lAcb=if(bAcb>-1,"+","")][h:lAcb=lAcb+bAcb+" - Acrobatics (Dex)"]
[h:bAnH=json.get(AtrMods, "Wisdom")+(Proficiency*AnH)][h:lAnH=if(bAnH>-1,"+","")][h:lAnH=lAnH+bAnH+" - Animal Handling (Wis)"]
[h:bArc=json.get(AtrMods, "Intelligence")+(Proficiency*Arc)][h:lArc=if(bArc>-1,"+","")][h:lArc=lArc+bArc+" - Arcana (Int)"]
[h:bAth=json.get(AtrMods, "Strength")+(Ath*Proficiency)][h:lAth=if(bAth>-1,"+","")][h:lAth=lAth+bAth+" - Athletics (Str)"]
[h:bDcp=json.get(AtrMods, "Charisma")+(Proficiency*Dcp)][h:lDcp=if(bDcp>-1,"+","")][h:lDcp=lDcp+bDcp+" - Deception (Cha)"]
[h:bHst=json.get(AtrMods, "Intelligence")+(Proficiency*Hst)][h:lHst=if(bHst>-1,"+","")][h:lHst=lHst+bHst+" - History (Int)"]
[h:bIns=json.get(AtrMods, "Wisdom")+floor(Proficiency*Ins)][h:lIns=if(bIns>-1,"+","")][h:lIns=lIns+bIns+" - Insight (Wis)"]
[h:bImd=json.get(AtrMods, "Charisma")+floor(Proficiency*Imd)][h:lImd=if(bImd>-1,"+","")][h:lImd=lImd+bImd+" - Intimidation (Cha)"]
[h:bInv=json.get(AtrMods, "Intelligence")+floor(Proficiency*Inv)][h:lInv=if(bInv>-1,"+","")][h:lInv=lInv+bInv+" - Investigation (Int)"]
[h:bMed=json.get(AtrMods, "Wisdom")+floor(Proficiency*Med)][h:lMed=if(bMed>-1,"+","")][h:lMed=lMed+bMed+" - Medicine (Wis)"]
[h:bNtr=json.get(AtrMods, "Intelligence")+floor(Proficiency*Ntr)][h:lNtr=if(bNtr>-1,"+","")][h:lNtr=lNtr+bNtr+" - Nature (Int)"]
[h:bPcp=json.get(AtrMods, "Wisdom")+floor(Proficiency*Pcp)][h:lPcp=if(bPcp>-1,"+","")][h:lPcp=lPcp+bPcp+" - Perception (Wis)"]
[h:bPfm=json.get(AtrMods, "Charisma")+floor(Proficiency*Pfm)][h:lPfm=if(bPfm>-1,"+","")][h:lPfm=lPfm+bPfm+" - Performance (Cha)"]
[h:bPrs=json.get(AtrMods, "Charisma")+floor(Proficiency*Prs)][h:lPrs=if(bPrs>-1,"+","")][h:lPrs=lPrs+bPrs+" - Persuasion (Cha)"]
[h:bRlg=json.get(AtrMods, "Intelligence")+floor(Proficiency*Rlg)][h:lRlg=if(bRlg>-1,"+","")][h:lRlg=lRlg+bRlg+" - Religion (Int)"]
[h:bSoH=json.get(AtrMods, "Dexterity")+(SoH*Proficiency)][h:lSoH=if(bSoH>-1,"+","")][h:lSoH=lSoH+bSoH+" - Sleight of Hand (Dex)"]
[h:bStl=json.get(AtrMods, "Dexterity")+(Stl*Proficiency)][h:lStl=if(bStl>-1,"+","")][h:lStl=lStl+bStl+" - Stealth (Dex)"]
[h:bSrv=json.get(AtrMods, "Wisdom")+floor(Proficiency*Srv)][h:lSrv=if(bSrv>-1,"+","")][h:lSrv=lSrv+bSrv+" - Survival (Wis)"]

[h:listSkills="--Choose--,"+lAcb+","+lAnH+","+lArc+","+lAth+","+lDcp+","+lHst+","+lIns+","+lImd+","+lInv+","+lMed+","+lNtr+","+lPcp+","+lPfm+","+lPrs+","+lRlg+","+lSoH+","+lStl+","+lSrv+","+lStr+","+lDex+","+lCon+","+lInt+","+lWis+","+lCha]

[h:AddedBonus=0]
[h:sBonus="0"]
[h:SkillDesc=""]
[h:iSkills=-1]

[h,if(ForcedSkill==""),CODE:{

[h:listSkills="--Choose--,"+lAcb+","+lAnH+","+lArc+","+lAth+","+lDcp+","+lHst+","+lIns+","+lImd+","+lInv+","+lMed+","+lNtr+","+lPcp+","+lPfm+","+lPrs+","+lRlg+","+lSoH+","+lStl+","+lSrv+","+lStr+","+lDex+","+lCon+","+lInt+","+lWis+","+lCha]

[h:SkillCheck=input(
	"SkillDesc|--Description Here--|Description||WIDTH=40",
	"iSkills|"+listSkills+"|Skills|LIST",
	"Alternate|-NO-,Str,Dex,Con,Int,Wis,Cha|Use Alternate Ability|LIST|VALUE=STRING",
	"sBonus||Bonus||WIDTH=20",
	"dmOnly|0|Only show DM?|CHECK"
)]
[h:abort(SkillCheck)]
[h:AddedBonus=eval(sBonus+"+1d1-1")]

};{
	[h:Alternate="-NO-"]
	[h:dmOnly=0]
	[h:iSkills=if(ForcedSkill=="Acrobatics",0,iSkills)]
	[h:iSkills=if(ForcedSkill=="Animal Handling",1,iSkills)]
	[h:iSkills=if(ForcedSkill=="Arcana",2,iSkills)]
	[h:iSkills=if(ForcedSkill=="Athletics",3,iSkills)]
	[h:iSkills=if(ForcedSkill=="Deception",4,iSkills)]
	[h:iSkills=if(ForcedSkill=="History",5,iSkills)]
	[h:iSkills=if(ForcedSkill=="Insight",6,iSkills)]
	[h:iSkills=if(ForcedSkill=="Intimidation",7,iSkills)]
	[h:iSkills=if(ForcedSkill=="Investigation",8,iSkills)]
	[h:iSkills=if(ForcedSkill=="Medicine",9,iSkills)]
	[h:iSkills=if(ForcedSkill=="Nature",10,iSkills)]
	[h:iSkills=if(ForcedSkill=="Perception",11,iSkills)]
	[h:iSkills=if(ForcedSkill=="Performance",12,iSkills)]
	[h:iSkills=if(ForcedSkill=="Persuasion",13,iSkills)]
	[h:iSkills=if(ForcedSkill=="Religion",14,iSkills)]
	[h:iSkills=if(ForcedSkill=="Sleight of Hand",15,iSkills)]
	[h:iSkills=if(ForcedSkill=="Stealth",16,iSkills)]
	[h:iSkills=if(ForcedSkill=="Survival",17,iSkills)]
	[h:iSkills=if(ForcedSkill=="Strength",18,iSkills)]
	[h:iSkills=if(ForcedSkill=="Dexterity",19,iSkills)]
	[h:iSkills=if(ForcedSkill=="Constitution",20,iSkills)]
	[h:iSkills=if(ForcedSkill=="Intelligence",21,iSkills)]
	[h:iSkills=if(ForcedSkill=="Wisdom",22,iSkills)]
	[h:iSkills=if(ForcedSkill=="Charisma",23,iSkills)]
	[h:iSkills=iSkills+1]
}]

[h,switch(iSkills),code:
	case 0: {[SkillTitle="-No Skill Selected"]};
	case 1: {[SkillTitle=lAcb][SkillBonus=bAcb+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Dexterity"))]};
	case 2: {[SkillTitle=lAnH][SkillBonus=bAnH+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Wisdom"))]};
	case 3: {[SkillTitle=lArc][SkillBonus=bArc+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Intelligence"))]};
	case 4: {[SkillTitle=lAth][SkillBonus=bAth+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Strength"))]};
	case 5: {[SkillTitle=lDcp][SkillBonus=bDcp+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Charisma"))]};
	case 6: {[SkillTitle=lHst][SkillBonus=bHst+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Intelligence"))]};
	case 7: {[SkillTitle=lIns][SkillBonus=bIns+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Wisdom"))]};
	case 8: {[SkillTitle=lImd][SkillBonus=bImd+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Charisma"))]};
	case 9: {[SkillTitle=lInv][SkillBonus=bInv+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Intelligence"))]};
	case 10: {[SkillTitle=lMed][SkillBonus=bMed+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Wisdom"))]};
	case 11: {[SkillTitle=lNtr][SkillBonus=bNtr+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Intelligence"))]};
	case 12: {[SkillTitle=lPcp][SkillBonus=bPcp+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Wisdom"))]};
	case 13: {[SkillTitle=lPfm][SkillBonus=bPfm+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Charisma"))]};
	case 14: {[SkillTitle=lPrs][SkillBonus=bPrs+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Charisma"))]};
	case 15: {[SkillTitle=lRlg][SkillBonus=bRlg+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Intelligence"))]};
	case 16: {[SkillTitle=lSoH][SkillBonus=bSoH+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Dexterity"))]};
	case 17: {[SkillTitle=lStl][SkillBonus=bStl+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Dexterity"))]};
	case 18: {[SkillTitle=lSrv][SkillBonus=bSrv+if(Alternate=="-NO-",0,eval(Alternate)-json.get(AtrMods, "Wisdom"))]};
	
	case 19: {[SkillTitle=lStr][SkillBonus=bStr]};
	case 20: {[SkillTitle=lDex][SkillBonus=bDex]};
	case 21: {[SkillTitle=lCon][SkillBonus=bCon]};
	case 22: {[SkillTitle=lInt][SkillBonus=bInt]};
	case 23: {[SkillTitle=lWis][SkillBonus=bWis]};
	case 24: {[SkillTitle=lCha][SkillBonus=bCha]}
]

[h:ReliableResult=10+SkillBonus+AddedBonus]

[h:DisplayNum = indexOf(SkillTitle,"-")]
[h:dSkillTitle = substring(SkillTitle,DisplayNum)]

<div style="background-color: #2222AA; color: #FFFFFF; padding-top:2px; padding-bottom:2px; padding-left:8px; padding-right:8px;width:400px;">
	<b>[r:if(SkillBonus<0,"","+"+SkillBonus)] [r:dSkillTitle]</b> [r:if(dmOnly==1," - <i>DM Only Roll</i>","")]
	<div style="background-color:#FFFFFF; color: #000000; padding:2px;">
		<div style="background-color:#DDDDDD; color: #000000; padding:2px; margin-bottom:-5px;">
			<i>[r:if(or(SkillDesc=="",SkillDesc=="--Description Here--"),Flavor,SkillDesc)]</i>
		</div>

		[r,if(dmOnly==1), code:{
			<span style='font-size:1.5em;'>Skill Check: <b><span style='{if(roll1>=20,'font-size:2em; color:#AA2222;','')}{if(roll1==1,'font-size:2em; color:#2222AA;','')}'>[g:roll1+SkillBonus+AddedBonus]</span></b></span><i>HIDDEN</i><br>
			(Adv: <b><span style='{if(Max(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Max(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[g:Max(roll1,roll2)+SkillBonus+AddedBonus]</span></b></span><i>HIDDEN</i> / Dis: <b><span style='{if(Min(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Min(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[g:Min(roll1,roll2)+SkillBonus+AddedBonus]</span></b></span><i>HIDDEN</i>)
		};{
			<span style='font-size:1.5em;'>Skill Check: <b><span style='{if(roll1>=20,'font-size:2em; color:#AA2222;','')}{if(roll1==1,'font-size:2em; color:#2222AA;','')}'>[r:roll1+SkillBonus+AddedBonus]</span></b> ([r:roll1])</span><br>
			(Adv: <b><span style='{if(Max(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Max(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[r:Max(roll1,roll2)+SkillBonus+AddedBonus]</span></b> / Dis: <b><span style='{if(Min(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Min(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[r:Min(roll1,roll2)+SkillBonus+AddedBonus]</span></b>)
		}]

		[r:if(Alternate=="-NO-","","<br>Skill check rolled as a ")][r:if(Alternate=="-NO-","",Alternate)][r:if(Alternate=="-NO-",""," Check.")]

		[r:if(or(sBonus=="",sBonus==0),"","<br><b>Additional Bonus Included:</b> ")][r:if(or(sBonus=="",sBonus==0),"",sBonus)]
		<table>
			
			[r:if(getState("Guidance"),"<tr><td><b>Guidance:</b> Add 1d4 to your check:<span style='font-size:1.5em;'> "+1d4+"</span></td></tr>","")]
			[h:setState("Guidance",0)]
			
			[r:if(getState("Blinded"),"<tr><td><b>Blinded:</b> You automatically fail any ability check that requires sight.</td></tr>","")]
			[r:if(getState("Deafened"),"<tr><td><b>Deafened:</b> You automatically fail any ability check that requires hearing.</td></tr>","")]
			[r:if(getState("Poisoned"),"<tr><td><b>Poisoned:</b> You have disadvantage on all ability checks.</td></tr>","")]
			[r:if(getState("Frightened"),"<tr><td><b>Frightened:</b> You have disadvantage on all ability checks while the source of your fear is within line of sight.</td></tr>","")]
			[r:if(Exhaustion>=1,"<tr><td><b>Exhausted:</b> You have disadvantage on all ability checks.</td></tr>","")]
			[r:if(getState("Foresight"),"<tr><td><b>Foresight:</b> You have advantage on all ability checks.</td></tr>","")]
			[r:if(and(getState("Enlarge"),or(SkillTitle==lAth,Alternate=="Str")),"<tr><td><b>Enlarge:</b> You have advantage on your check.</td></tr>","")]
			[r:if(and(getState("Reduce"),or(SkillTitle==lAth,Alternate=="Str")),"<tr><td><b>Reduce:</b> You have disadvantage on your check.</td></tr>","")]
			
			[r:if(and(or(Race=="Hill Dwarf",Race=="Mountain Dwarf"),SkillTitle==lHst),"<tr><td>&#8226;</td><td> <b>Stonecutting:</b> You are considered proficient and add double your proficiency bonus ("+(2*Proficiency)+" total) to Intelligence (History) checks to identify the origin of stonework.</td></tr>","")]
			[r:if(and(Race=="Wood Elf",SkillTitle==lStl),"<tr><td>&#8226;</td><td> <b>Mask of the Wild:</b> You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.</td></tr>","")]
			[r:if(and(Race=="Drow",SkillTitle==lPcp),"<tr><td>&#8226;</td><td> <b>Sunlight Sensitivity:</b> You have disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.</td></tr>","")]
			[r:if(and(Race=="Lightfoot Halfling",SkillTitle==lStl),"<tr><td>&#8226;</td><td> <b>Naturally Stealthy:</b> You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.</td></tr>","")]
			[r:if(and(or(Race=="Lightfoot Halfling",Race=="Stout Halfling"),or(roll1==1,roll2==1)),"<tr><td>&#8226;</td><td> <b>Halfling Luck</b>: You can reroll the 1 on your ability check, and must use the new roll.</td></tr>","")]
			[r:if(and(Race=="Rock Gnome",SkillTitle==lHst),"<tr><td>&#8226;</td><td> <b>Artificer's Lore:</b> You are considered proficient and add double your proficiency bonus ("+(2*Proficiency)+" total) to Intelligence (History) checks related to magical items, alchemical objects, or technological devices.</td></tr>","")]
			[r:if(and(Race=="Minotaur",SkillTitle==lAth),"<tr><td><&#8226;</td><td> <b>Horns:</b> Your horns grant advantage on all checks made to shove a creature.","")]
		</table>
	</div>
</div>