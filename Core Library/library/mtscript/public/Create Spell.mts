[h,if(getLibProperty("ct.NewSpell","Lib:pm.a5e.Core")==""): setLibProperty("ct.NewSpell","{}","Lib:pm.a5e.Core")]
[h:setLibProperty("ct.NewSpell",json.remove(getLibProperty("ct.NewSpell","Lib:pm.a5e.Core"),getPlayerName()),"Lib:pm.a5e.Core")]
[h:MasterSpellInputData = json.set("",
	"FirstPass",1,
	"SpellName","",
	"Duration","{}",
	"School","",
	"SpellLevel",1,
	"CastTime","{}"
)]

[h,MACRO("CreateSpellCore@Lib:pm.a5e.Core"): MasterSpellInputData]

[h:return(0)]

[h,while(EffectsCounter<sMultiEffects),CODE:{
	[h:FirstPassTest = if(EffectsCounter==0,1,0)]
	[h:MasterSpellInputData = json.set("","FirstPass",FirstPassTest,"EffectNumber",sMultiEffects,"IsRandomEffect",IsRandomEffect,"sDescriptionTT",sDescriptionTT,"sName",sName,"RangeType",RangeType,"AoEShape",AoEShape,"sDuration",sDuration,"sSchool",sSchool,"IsSummon",IsSummon,"IsAHLSummon",IsAHLSummon,"sList",sList,"sLevel",sLevel,"CastTime",CastTime)]

	[MACRO("CreateSpellCore@Lib:pm.a5e.Core"):MasterSpellInputData]
	
	[h:sMultiEffects=json.get(macro.return,"EffectNumber")]
	[h:IsRandomEffect=json.get(macro.return,"IsRandomEffect")]
	[h:CommandText=CommandText+json.get(macro.return,"CommandText")]
	[h:sName=if(EffectsCounter==0,json.get(macro.return,"sName"),sName)]
	[h:sLevel=if(EffectsCounter==0,json.get(macro.return,"sLevel"),sLevel)]
	[h:CastTime=if(EffectsCounter==0,json.get(macro.return,"CastTime"),CastTime)]
	[h:IsOngoing=if(EffectsCounter==0,json.get(macro.return,"IsOngoing"),IsOngoing)]
	[h:IsOngoingRandom=if(EffectsCounter==0,json.get(macro.return,"IsOngoingRandom"),IsOngoingRandom)]
	[h:sList=if(EffectsCounter==0,json.get(macro.return,"sList"),sList)]
	[h:RangeType=if(EffectsCounter==0,json.get(macro.return,"RangeType"),RangeType)]
	[h:AoEShape=if(EffectsCounter==0,json.get(macro.return,"AoEShape"),AoEShape)]
	[h:sDuration=if(EffectsCounter==0,json.get(macro.return,"sDuration"),sDuration)]
	[h:sSchool=if(EffectsCounter==0,json.get(macro.return,"sSchool"),sSchool)]
	[h:IsSummon=if(EffectsCounter==0,json.get(macro.return,"IsSummon"),IsSummon)]
	[h:IsAHLSummon=if(EffectsCounter==0,json.get(macro.return,"IsAHLSummon"),IsAHLSummon)]
	[h:sDescriptionTT=if(EffectsCounter==0,json.get(macro.return,"sDescriptionTT"),sDescriptionTT)]
	[h:sDescription=if(EffectsCounter==0,json.get(macro.return,"sDescription"),sDescription)]
	[h:DmgType=if(EffectsCounter==0,json.get(macro.return,"DmgType"),DmgType)]
	[h:DmgType2=if(EffectsCounter==0,json.get(macro.return,"DmgType2"),DmgType2)]
	[h:EffectsCounter=EffectsCounter+1]
}]

[h:CommandText=CommandText+'
[r,if(IsTooltip),CODE:{
	[h:TooltipSpellData = json.get(FinalSpellData,0)]
	[macro("Spell Macro Tooltip@Lib:pm.a5e.Core") : TooltipSpellData]
};{
	[r,if(LibUpdate==0),CODE:{
		[macro("SpellCasting@Lib:pm.a5e.Core") : FinalSpellData]
	};{
		[h,macro("Update Spell Data@Lib:Complete Spellbook"): FinalSpellData]
	}]')]

[h:BttnLabel=sName+" ("+sLevel+")"]
[h:BttnLabelPlayer=sName+" ("+sLevel+")"+if(CastTime=="Action",""," <b>("+CastTime+")</b>")]

[h:CommandText=CommandText+if(IsOngoing>0,'
[h:sLevelSelect=json.get(macro.return,"Slot")]
[h:sClassSelect=json.get(macro.return,"Class")]
[h:FreeCasting=1]
[h:ForcedClass=sClassSelect]
[h:ForcedLevel=sLevelSelect]'+if(IsOngoingRandom,'
[h:OngoingPrelimSpellData = json.set(json.get(FinalSpellData,0),"FreeCasting",1,"ForcedClass",ForcedClass,"ForcedLevel",ForcedLevel)]
[h:FinalOngoingSpellData=json.append("",OngoingPrelimSpellData)]',''),'')]
[h:EffectsCounter=0]

[h,while(EffectsCounter<IsOngoing),CODE:{
	[h:FirstPassTest = if(EffectsCounter==0,1,0)]
	[h:OngoingSpellCreationInfo=json.set("","sName",sName,"RangeType",RangeType,"AoEShape",AoEShape,"sDuration",sDuration,"sSchool",sSchool,"IsSummon",IsSummon,"IsAHLSummon",IsAHLSummon,"sList",sList,"sLevel",sLevel,"IsOngoing",IsOngoing,"sDescription",sDescription,"IsOngoingRandom",IsOngoingRandom,"IsRandomEffect",IsRandomEffect,"DmgType",DmgType,"DmgType2",DmgType2)]
	
	[MACRO("Ongoing Leveled Spell Loop@Lib:Complete Spellbook"):OngoingSpellCreationInfo]
	
	[h:CommandText=CommandText+json.get(macro.return,"CommandText")]
	[h:EffectsCounter=EffectsCounter+1]
}]

[h:CommandText=CommandText+if(and(IsOngoing>1,IsOngoingRandom==1),'
[h:ActiveSpells=json.append(ActiveSpells,FinalOngoingSpellData)]','')]
[h:CommandText=CommandText+'
}]']

[h:ButtonColor="maroon"][h:FontColor="white"]

[h,switch(sLevel),code: 
case 1: {[ButtonColor="red"][FontColor="white"][BttnGrp="Spells - 1st Level"]};
case 2: {[ButtonColor="orange"][FontColor="black"][BttnGrp="Spells - 2nd Level"]};
case 3: {[ButtonColor="yellow"][FontColor="black"][BttnGrp="Spells - 3rd Level"]};
case 4: {[ButtonColor="lime"][FontColor="black"][BttnGrp="Spells - 4th Level"]};
case 5: {[ButtonColor="green"][FontColor="white"][BttnGrp="Spells - 5th Level"]};
case 6: {[ButtonColor="blue"][FontColor="white"][BttnGrp="Spells - 6th Level"]};
case 7: {[ButtonColor="navy"][FontColor="white"][BttnGrp="Spells - 7th Level"]};
case 8: {[ButtonColor="purple"][FontColor="white"][BttnGrp="Spells - 8th Level"]};
case 9 :{[ButtonColor="fuchsia"][FontColor="white"][BttnGrp="Spells - 9th Level"]}
]

[h:TooltipText=encode('[h:Flavor=""][h:BorderColorOverride=""][h:TitleFontColorOverride=""][h:tooltipDisplaySizeOverride=""][h:TitleFont=""][h:BodyFont=""][h:ForcedClass=""][h:DMOnly=0][h:InnateCast=0][h:MonsterCast=0][h:placeholdToAdd=""][h:TooltipData = json.set("","Flavor",Flavor,"BorderColorOverride",BorderColorOverride,"TitleFontColorOverride",TitleFontColorOverride,"tooltipDisplaySizeOverride",tooltipDisplaySizeOverride,"TitleFont",TitleFont,"BodyFont",BodyFont,"ForcedClass",ForcedClass,"DMOnly",DMOnly,"InnateCast",InnateCast,"MonsterCast",MonsterCast,"IsTooltip",1,"placeholdToAdd",placeholdToAdd)][MACRO("'+BttnLabel+'@Lib:Complete Spellbook") : TooltipData]')]

[h:BttnProps=json.set("","color",ButtonColor,"fontColor",FontColor,"group",BttnGrp,"minWidth",90,"tooltip","","sortBy",sLevel,"playerEditable",0)]
[h:createMacro(BttnLabel, decode(CommandText), BttnProps)]