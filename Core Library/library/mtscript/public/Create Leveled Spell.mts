[h:CommandText='[h:pm.SpellStdVars(macro.args)]']
[h:sMultiEffects=1]
[h:IsRandomEffect=0]
[h:sName=""]
[h:sLevel=1]
[h:CastTime=""]
[h:IsOngoing=0]
[h:IsOngoingRandom=0]
[h:sList="{}"]
[h:EffectsCounter=0]
[h:sDescription = ""]
[h:sDescriptionTT=""]
[h:sName = "Name"]
[h:RangeType = "Self"]
[h:AoEShape = "None"]
[h:sDuration = "Instantaneous"]
[h:sSchool = "abjuration"]
[h:IsSummon = "No"]
[h:IsAHLSummon = 1]
[h:DmgType=""]
[h:DmgType2=""]

[h,while(EffectsCounter<sMultiEffects),CODE:{
	[h:FirstPassTest = if(EffectsCounter==0,1,0)]
	[h:MasterSpellInputData = json.set("","FirstPass",FirstPassTest,"EffectNumber",sMultiEffects,"IsRandomEffect",IsRandomEffect,"sDescriptionTT",sDescriptionTT,"sName",sName,"RangeType",RangeType,"AoEShape",AoEShape,"sDuration",sDuration,"sSchool",sSchool,"IsSummon",IsSummon,"IsAHLSummon",IsAHLSummon,"sList",sList,"sLevel",sLevel)]

	[MACRO("Create Spell Core@Lib:pm.a5e.Core"):MasterSpellInputData]
	
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
	[r,macro("Spell Macro Tooltip@Lib:pm.a5e.Core") : TooltipSpellData]
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
[h:BttnProps=json.set("","color",ButtonColor,"fontColor",FontColor,"group",BttnGrp,"minWidth",90,"tooltip",decode(TooltipText),"sortBy",sLevel,"playerEditable",1)]

[h:PlayerCommandText=encode('[h:"<!-- Dont mess with these variables unless you know what they do -->"]
[h:ForcedClass=""]
[h:ForcedLevel=""]
[h:DMOnly=0]
[h:InnateCast=0]
[h:MonsterCast=0]

[h:"<!-- The following are customization options to personalize your macros! They wont actually affect calculations or anything -->"]

[h:"<!-- Flavor text that will appear at the start of the macro. The token.name part outputs the name of your token, remove it if you dont want the name of your token in the flavor text. -->"]
[h:Flavor=token.name+" FLAVOR TEXT"]

[h:"<!-- Output messages when you crit or crit fail-->"]
[h:CritMessage=""]
[h:CritFailMessage=""]

[h:"<!-- If the spell has a summon, you can add a name and images. These will override the default images for the tokens when you summon them! The text you need for the images can be found by running the get images macro on your summon after changing them manually the first time. -->"]
[h:SummonName=""]
[h:SummonTokenImage=""]
[h:SummonPortrait=""]
[h:SummonHandout=""]

[h:"<!-- Aura Color Options: White, Red, Orange, Yellow, Blue, Green, Purple, Black. Type the names of these colors to select, case sensitive. -->"]
[h:AuraColor="Green"]

[h:"<!-- Changes the color of the outputs border and title text. Use a hex code for these colors. -->"]
[h:BorderColorOverride=""]
[h:TitleFontColorOverride=""]

[h:"<!-- Changes the font for the title and body of the spell. If a font is not available, it will use the default font. -->"]
[h:TitleFont=""]
[h:BodyFont=""]

[h:"<!--Changes the color of total damage numbers, crits and crit fails. -->"]
[h:DamageNumberOverride=""]
[h:CritTextOverride=""]
[h:CritFailTextOverride=""]

[h:"<!-- Changes the background and font color for accents (e.g. Flavor text section) -->"]
[h:AccentBackgroundOverride=""]
[h:AccentTextOverride=""]

[h:FlavorData = json.set("",
	"Flavor",Flavor,
	"ForcedClass",ForcedClass,
	"ForcedLevel",ForcedLevel,
	"CritMessage",CritMessage,
	"CritFailMessage",CritFailMessage,
	"SummonName",SummonName,
	"SummonTokenImage",SummonTokenImage,
	"SummonPortrait",SummonPortrait,
	"SummonHandout",SummonHandout,
	"DMOnly",DMOnly,
	"InnateCast",InnateCast,
	"MonsterCast",MonsterCast,
	"AuraColor",AuraColor,
	"BorderColorOverride",BorderColorOverride,
	"TitleFontColorOverride",TitleFontColorOverride,
	"TitleFont",TitleFont,
	"BodyFont",BodyFont,
	"DamageNumberOverride",DamageNumberOverride,
	"CritTextOverride",CritTextOverride,
	"CritFailTextOverride",CritFailTextOverride,
	"AccentBackgroundOverride",AccentBackgroundOverride,
	"AccentTextOverride",AccentTextOverride,
	"IsTooltip",0,
	"ParentToken",currentToken())]

[macro("'+BttnLabel+'@Lib:Complete Spellbook") : FlavorData]')]

[h:createMacro(BttnLabelPlayer, decode(PlayerCommandText), BttnProps,"json","E16E18433D3C47D998C6E6682862C222")]

[if(json.get(sList,"Art")>0),CODE:{
	[h:createMacro(BttnLabelPlayer, decode(PlayerCommandText), BttnProps,"json","E670BE0EC50D44F6BB4317F7AC577FFD")]
};{}]

[if(json.get(sList,"Brd")>0),CODE:{
	[h:createMacro(BttnLabelPlayer, decode(PlayerCommandText), BttnProps,"json","F6570063156C4EE28815CB66BEC4E5ED")]
};{}]

[if(json.get(sList,"Clc")>0),CODE:{
	[h:createMacro(BttnLabelPlayer, decode(PlayerCommandText), BttnProps,"json","73F63729233B429BBACB11D2AA0C0DE5")]
};{}]

[if(json.get(sList,"Drd")>0),CODE:{
	[h:createMacro(BttnLabelPlayer, decode(PlayerCommandText), BttnProps,"json","085FBE6213CD49B891B9BDFE6917D6BB")]
};{}]

[if(json.get(sList,"Pdn")>0),CODE:{
	[h:createMacro(BttnLabelPlayer, decode(PlayerCommandText), BttnProps,"json","15C1BE0B5B6E4C3C9348B34A22F341AA")]
};{}]

[if(json.get(sList,"Rgr")>0),CODE:{
	[h:createMacro(BttnLabelPlayer, decode(PlayerCommandText), BttnProps,"json","3B93FF75B6C7476E9669674798B42B2A")]
};{}]

[if(json.get(sList,"Scr")>0),CODE:{
	[h:createMacro(BttnLabelPlayer, decode(PlayerCommandText), BttnProps,"json","0987D1E51B7849F59F65FB61213D1036")]
};{}]

[if(json.get(sList,"Wlk")>0),CODE:{
	[h:createMacro(BttnLabelPlayer, decode(PlayerCommandText), BttnProps,"json","F0A6DA3394A1428BBBFCAC15B8E7ABFE")]
};{}]

[if(json.get(sList,"Wiz")>0),CODE:{
	[h:createMacro(BttnLabelPlayer, decode(PlayerCommandText), BttnProps,"json","7AD4FB25D1D047CB8E007E7DA3BC1B2B")]
};{}]

[if(json.get(sList,"Wiz")>0 && json.get(sList,"Wiz")<8),CODE:{
	[h:createMacro(BttnLabelPlayer, decode(PlayerCommandText), BttnProps,"json","FFDFAE1FD11C45618017B5283C8B87F2")]
	[h:createMacro(BttnLabelPlayer, decode(PlayerCommandText), BttnProps,"json","B4E00BE0C7B348D9B61C9393C7D92CE4")]
};{}]