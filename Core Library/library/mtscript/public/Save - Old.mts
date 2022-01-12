[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]
[h:ForcedSave=json.get(macro.args,"ForcedSave")]

[h:sStr=if(json.get(MagicItemStats,"iStrSaveProf")==3,max(1,json.get(Saves,"sStr")),min(2,json.get(Saves,"sStr")+json.get(MagicItemStats,"iStrSaveProf")))]
[h:sDex=if(json.get(MagicItemStats,"iDexSaveProf")==3,max(1,json.get(Saves,"sDex")),min(2,json.get(Saves,"sDex")+json.get(MagicItemStats,"iDexSaveProf")))]
[h:sCon=if(json.get(MagicItemStats,"iConSaveProf")==3,max(1,json.get(Saves,"sCon")),min(2,json.get(Saves,"sCon")+json.get(MagicItemStats,"iConSaveProf")))]
[h:sInt=if(json.get(MagicItemStats,"iIntSaveProf")==3,max(1,json.get(Saves,"sInt")),min(2,json.get(Saves,"sInt")+json.get(MagicItemStats,"iIntSaveProf")))]
[h:sWis=if(json.get(MagicItemStats,"iWisSaveProf")==3,max(1,json.get(Saves,"sWis")),min(2,json.get(Saves,"sWis")+json.get(MagicItemStats,"iWisSaveProf")))]
[h:sCha=if(json.get(MagicItemStats,"iChaSaveProf")==3,max(1,json.get(Saves,"sCha")),min(2,json.get(Saves,"sCha")+json.get(MagicItemStats,"iChaSaveProf")))]
[h:mStrBonus=0]
[h:mDexBonus=0]
[h:mConBonus=0]
[h:mIntBonus=0]
[h:mWisBonus=0]
[h:mChaBonus=0]
[h,foreach(bonus,json.get(MagicItemStats,"iStrSaveBonus")),CODE:{[mStrBonus=mStrBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDexSaveBonus")),CODE:{[mDexBonus=mDexBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iConSaveBonus")),CODE:{[mConBonus=mConBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iIntSaveBonus")),CODE:{[mIntBonus=mIntBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iWisSaveBonus")),CODE:{[mWisBonus=mWisBonus+bonus]}]
[h,foreach(bonus,json.get(MagicItemStats,"iChaSaveBonus")),CODE:{[mChaBonus=mChaBonus+bonus]}]
[h:mStrBonusStr=""]
[h:mDexBonusStr=""]
[h:mConBonusStr=""]
[h:mIntBonusStr=""]
[h:mWisBonusStr=""]
[h:mChaBonusStr=""]
[h,foreach(bonus,json.get(MagicItemStats,"iStrSaveBonus")),CODE:{[mStrBonusStr=mStrBonusStr+if(bonus>0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDexSaveBonus")),CODE:{[mDexBonusStr=mDexBonusStr+if(bonus>0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iConSaveBonus")),CODE:{[mConBonusStr=mConBonusStr+if(bonus>0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iIntSaveBonus")),CODE:{[mIntBonusStr=mIntBonusStr+if(bonus>0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iWisSaveBonus")),CODE:{[mWisBonusStr=mWisBonusStr+if(bonus>0," + "," - ")+abs(bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iChaSaveBonus")),CODE:{[mChaBonusStr=mChaBonusStr+if(bonus>0," + "," - ")+abs(bonus)]}]
[h:mStrAdv=""]
[h:mDexAdv=""]
[h:mConAdv=""]
[h:mIntAdv=""]
[h:mWisAdv=""]
[h:mChaAdv=""]
[h,foreach(bonus,json.get(MagicItemStats,"iStrSaveAdv")),CODE:{[mStrAdv=listAppend(mStrAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDexSaveAdv")),CODE:{[mDexAdv=listAppend(mDexAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iConSaveAdv")),CODE:{[mConAdv=listAppend(mConAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iIntSaveAdv")),CODE:{[mIntAdv=listAppend(mIntAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iWisSaveAdv")),CODE:{[mWisAdv=listAppend(mWisAdv,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iChaSaveAdv")),CODE:{[mChaAdv=listAppend(mChaAdv,bonus)]}]
[h:mStrDis=""]
[h:mDexDis=""]
[h:mConDis=""]
[h:mIntDis=""]
[h:mWisDis=""]
[h:mChaDis=""]
[h,foreach(bonus,json.get(MagicItemStats,"iStrSaveDis")),CODE:{[mStrDis=listAppend(mStrDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDexSaveDis")),CODE:{[mDexDis=listAppend(mDexDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iConSaveDis")),CODE:{[mConDis=listAppend(mConDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iIntSaveDis")),CODE:{[mIntDis=listAppend(mIntDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iWisSaveDis")),CODE:{[mWisDis=listAppend(mWisDis,bonus)]}]
[h,foreach(bonus,json.get(MagicItemStats,"iChaSaveDis")),CODE:{[mChaDis=listAppend(mChaDis,bonus)]}]
[h:mStrMessage=""]
[h:mDexMessage=""]
[h:mConMessage=""]
[h:mIntMessage=""]
[h:mWisMessage=""]
[h:mChaMessage=""]
[h,foreach(bonus,json.get(MagicItemStats,"iStrSaveMessage")),CODE:{[mStrMessage=listAppend(mStrMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iDexSaveMessage")),CODE:{[mDexMessage=listAppend(mDexMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iConSaveMessage")),CODE:{[mConMessage=listAppend(mConMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iIntSaveMessage")),CODE:{[mIntMessage=listAppend(mIntMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iWisSaveMessage")),CODE:{[mWisMessage=listAppend(mWisMessage,bonus,"##")]}]
[h,foreach(bonus,json.get(MagicItemStats,"iChaSaveMessage")),CODE:{[mChaMessage=listAppend(mChaMessage,bonus,"##")]}]

[h:roll1=1d20]
[h:roll2=1d20]
[h:SkillBonus=0]

[h:bsStr=json.get(AtrMods, "Strength")+mStrBonus+Proficiency*sStr][h:lsStr=if(bsStr>-1,"+","")][h:lsStr=lsStr+bsStr+" - Strength Save"]
[h:bsDex=json.get(AtrMods, "Dexterity")+mDexBonus+Proficiency*sDex][h:lsDex=if(bsDex>-1,"+","")][h:lsDex=lsDex+bsDex+" - Dexterity Save"]
[h:bsCon=json.get(AtrMods, "Constitution")+mConBonus+Proficiency*sCon][h:lsCon=if(bsCon>-1,"+","")][h:lsCon=lsCon+bsCon+" - Constitution Save"]
[h:bsInt=json.get(AtrMods, "Intelligence")+mIntBonus+Proficiency*sInt][h:lsInt=if(bsInt>-1,"+","")][h:lsInt=lsInt+bsInt+" - Intelligence Save"]
[h:bsWis=json.get(AtrMods, "Wisdom")+mWisBonus+Proficiency*sWis][h:lsWis=if(bsWis>-1,"+","")][h:lsWis=lsWis+bsWis+" - Wisdom Save"]
[h:bsCha=json.get(AtrMods, "Charisma")+mChaBonus+Proficiency*sCha][h:lsCha=if(bsCha>-1,"+","")][h:lsCha=lsCha+bsCha+" - Charisma Save"]

[h:AddedBonus=0]
[h:sBonus="0"]
[h:SkillDesc=""]
[h:iSaves=0]
[h:mBonusStr=""]
[h:mBonus=0]
[h:mBonusOriginal=0]
[h:mAdv=""]
[h:mDis=""]
[h:mMessage=""]

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
	case 1: {[SkillTitle=lsStr][SkillBonus=bsStr][mAdv=mStrAdv][mDis=mStrDis][mMessage=mStrMessage][mBonusOriginal=mStrBonus][mBonusStr=mStrBonusStr][mBonus=mStrBonus]};
	case 2: {[SkillTitle=lsDex][SkillBonus=bsDex][mAdv=mDexAdv][mDis=mDexDis][mMessage=mDexMessage][mBonusOriginal=mDexBonus][mBonusStr=mDexBonusStr][mBonus=mDexBonus]};
	case 3: {[SkillTitle=lsCon][SkillBonus=bsCon][mAdv=mConAdv][mDis=mConDis][mMessage=mConMessage][mBonusOriginal=mConBonus][mBonusStr=mConBonusStr][mBonus=mConBonus]};
	case 4: {[SkillTitle=lsInt][SkillBonus=bsInt][mAdv=mIntAdv][mDis=mIntDis][mMessage=mIntMessage][mBonusOriginal=mIntBonus][mBonusStr=mIntBonusStr][mBonus=mIntBonus]};
	case 5: {[SkillTitle=lsWis][SkillBonus=bsWis][mAdv=mWisAdv][mDis=mWisDis][mMessage=mWisMessage][mBonusOriginal=mWisBonus][mBonusStr=mWisBonusStr][mBonus=mWisBonus]};
	case 6: {[SkillTitle=lsCha][SkillBonus=bsCha][mAdv=mChaAdv][mDis=mChaDis][mMessage=mChaMessage][mBonusOriginal=mChaBonus][mBonusStr=mChaBonusStr][mBonus=mChaBonus]};
]

[h:DisplayNum = indexOf(SkillTitle,"-")]
[h:dSkillTitle = substring(SkillTitle,DisplayNum+2)]

[h:ClassFeatureData = json.set("",
	"Flavor",if(or(SkillDesc=="",SkillDesc=="--Description Here--"),Flavor,SkillDesc),
	"ParentToken",json.get(macro.args,"ParentToken"),
	"DMOnly",json.get(macro.args,"DMOnly"),
	"BorderColorOverride",if(json.get(macro.args,"BorderColorOverride")=="","#2222AA",json.get(macro.args,"BorderColorOverride")),
	"TitleFontColorOverride",if(json.get(macro.args,"TitleFontColorOverride")=="","#FFFFFF",json.get(macro.args,"TitleFontColorOverride")),
	"AccentBackgroundOverride",json.get(macro.args,"AccentBackgroundOverride"),
	"AccentTextOverride",json.get(macro.args,"AccentTextOverride"),
	"TitleFont",json.get(macro.args,"TitleFont"),
	"BodyFont",json.get(macro.args,"BodyFont"),
	"Class","",
	"Name",dSkillTitle,
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

		<span style='font-size:1.5em;'>Save: <span style='font-size:1em;'>[r:roll1+if((SkillBonus-mBonus)>0," + "," - ")+abs(SkillBonus-mBonus)+mBonusStr+if(AttunedNumber>0," + "+AttunedNumber,"")]</span> = <b><span style='{if(roll1>=20,'font-size:2em; color:#AA2222;','')}{if(roll1==1,'font-size:2em; color:#2222AA;','')}'>[r:roll1+SkillBonus+AddedBonus+AttunedNumber]</span></b></span><br>

		(Adv: <b><span style='{if(Max(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Max(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[r:Max(roll1,roll2)+SkillBonus+AddedBonus+AttunedNumber]</span></b> / Dis: <b><span style='{if(Min(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Min(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[r:Min(roll1,roll2)+SkillBonus+AddedBonus+AttunedNumber]</span></b>)

		[r:if(or(sBonus=="",sBonus==0),"","<br><b>Additional Bonus Included:</b> ")][r:if(or(sBonus=="",sBonus==0),"",sBonus)]
		
		[r:if(getState("Bless"),"<br><b>Bless:</b> Add 1d4 to your save:<span style='font-size:1.5em;'> "+1d4+"</span>","")]
		[r:if(getState("Bane"),"<br><b>Bane:</b> Subtract 1d4 from your save:<span style='font-size:1.5em;'> "+1d4+"</span>","")]
		[r:if(and(getState("Slow"),SkillTitle==lsDex),"<br><b>Slow:</b> -2 to your save: <span style='font-size:2em; color:#2222AA;'><b>"+(roll1+SkillBonus+AddedBonus+AttunedNumber-2)+" / "+(roll2+SkillBonus+AddedBonus+AttunedNumber-2)+"</b></span>","")]
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

		[r:if(or(Race=="Hill Dwarf",Race=="Mountain Dwarf"),"<br>&#8226; <b>Dwarven Resilience:</b> Advantage on saving throws against poison.","")]
		[r:if(or(Race=="High Elf",Race=="Wood Elf",Race=="Drow",Race=="Half-Elf",Race=="Eladrin"),"<br>&#8226; <b>Fey Ancestry:</b> Advantage on saving throws against being charmed. Magic cannot put you to sleep.","")]
			[r:if(and(or(Race=="Lightfoot Halfling",Race=="Stout Halfling"),or(roll1==1,roll2==1)),"<br>&#8226; <b>Halfling Luck</b>: You can reroll the 1 on your saving throw, and must use the new roll.","")]
		[r:if(or(Race=="Lightfoot Halfling",Race=="Stout Halfling"),"<br>&#8226; <b>Brave:</b> Advantage on saving throws against being frightened.","")]
		[r:if(Race=="Stout Halfling","<br>&#8226; <b>Stout Resilience:</b> Advantage on saving throws against poison.","")]
		[r:if(and(or(Race=="Forest Gnome",Race=="Rock Gnome"),or(SkillTitle==lsInt,SkillTitle==lsWis,SkillTitle==lsCha)),"<br>&#8226; <b>Gnome Cunning:</b> Advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.","")]

		[r:if(and(json.get(LClass,"LBrb")>1,SkillTitle==lsStr),if(getState("Rage")==1,"<br>&#8226; <b>Rage:</b> Advantage on <b>Strength Saves</b>.",""),"")]
		[r:if(and(json.get(LClass,"LBrb")>1,SkillTitle==lsDex),"<br>&#8226; <b>Danger Sense:</b> Advantage on <b>Dex Saves</b> against effects you can see.","")]
		[r:if(and(json.get(LClass,"LBrb")>17,SkillTitle==lsStr),"<br>&#8226; <b>Indomitable Might:</b> If <b>Str Check</b> result is less than <b>Strength:</b> "+json.get(Attributes,"Strength")+", use "+json.get(Attributes,"Strength")+" as the result instead.","")]
		[r:if(and(json.get(TotemSpirit,"Bear2")==1,SkillTitle==lsStr),"<br>&#8226; <b>Aspect of the Bear:</b> Advantage on Str checks to push, pull, lift, or break objects.","")]
		[r:if(json.get(LClass,"LRgr")>=8,"<br>&#8226; <b>Land's Stride</b>: Advantage on saving throws against plants that are magically created or manipulated to impede movement, such as those created by the <i>entangle</i> spell.","")]
		[r:if(and(json.get(LClass,"LRgr")>=7,json.get(RgrArchetype,"Hntr")==1,json.get(DefensiveTactics,"StlW")==1),"<br>&#8226; <b>Steel Will</b>: You have advantage on saving throws against being frightened.","")]
		[r:if(json.get(WizTradition,"Abjr")==1,if(json.get(LClass,"LWiz")>=14,"<br>&#8226; <b>Spell Resistance</b>: Advantage on saving throws against spells.",""),"")]

		[r:if(json.get(Feats,"DungeonDelver")==1,"<br>&#8226; <b>Dungeon Delver</b>: Advantage on saving throws made to resist or avoid traps.","")]
		[r:if(json.get(Feats,"MageSlayer")==1,"<br>&#8226; <b>Mage Slayer</b>: Advantage on saving throws against spells cast by creatures within 5 feet of you.","")]
		[r:if(and(json.get(Feats,"ShieldMaster")==1,SkillTitle==lsDex),"<br>&#8226; <b>Shield Master</b>: If you aren't incapacitated, you can add your shield's AC bonus ("+(if(json.get(Shield,0)==0,0,2)+json.get(json.get(Shield,json.get(Shield,0)),"MagicBonus"))+") to any Dexterity saving throw you make against a spell or other harmful effect that targets only you.","")]
		[r:if(and(json.get(LClass,"LArt")>=20,AttunedNumber>0),"<br>&#8226; <b>Soul of Artifice:</b> You gained a +1 bonus to your saving throw for each of the "+AttunedNumber+" magic item"+if(AttunedNumber>1,"s","")+" you are attuned to.","")]
			
		[r,foreach(item,mAdv):"<br>&#8226; <b>"+item+":</b> Your "+item+" grants you advantage on this save."]
		[r,foreach(item,mDis):"<br>&#8226; <b>"+item+":</b> Your "+item+" inflicts disadvantage on this save."]
		[r,foreach(item,mMessage,"","##"):""+item+""]
	</div>
</div>