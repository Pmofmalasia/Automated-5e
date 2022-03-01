[h:SpellData = macro.args]
[h:BorderColorOverride=json.get(SpellData,"BorderColorOverride")]
[h:TitleFontColorOverride=json.get(SpellData,"TitleFontColorOverride")]
[h:TitleFont=json.get(SpellData,"TitleFont")]
[h:BodyFont=json.get(SpellData,"BodyFont")]
[h:ForcedClass=json.get(SpellData,"ForcedClass")]
[h:ForcedLevel=json.get(SpellData,"ForcedLevel")]
[h:tooltipDisplaySizeOverride=json.get(SpellData,"tooltipDisplaySizeOverride")]
[h:DMOnly=json.get(SpellData,"DMOnly")]
[h:SpellName=json.get(SpellData,"SpellName")]
[h:sList=json.get(SpellData,"sList")]
[h:sLevel=json.get(SpellData,"sLevel")]
[h:Ritual=json.get(SpellData,"Ritual")]
[h:sSchool=json.get(SpellData,"sSchool")]
[h:CastTime=json.get(SpellData,"CastTime")]
[h:RangeType=json.get(SpellData,"RangeType")]
[h:AoEShape=json.get(SpellData,"AoEShape")]
[h:sAoENumber=json.get(SpellData,"sAoENumber")]
[h:Range=json.get(SpellData,"sRange")]
[h:sRangeUnits=json.get(SpellData,"sRangeUnits")]
[h:AoESize=json.get(SpellData,"AoESize")]
[h:AoESize2=json.get(SpellData,"AoESize2")]
[h:vComp=json.get(SpellData,"vComp")]
[h:sComp=json.get(SpellData,"sComp")]
[h:mComp=json.get(SpellData,"mComp")]
[h:mCompItems=json.get(SpellData,"mCompItems")]
[h:mCompConsumed=json.get(SpellData,"mCompConsumed")]
[h:sSpellAttack=json.get(SpellData,"sSpellAttack")]
[h:sSpellSave=json.get(SpellData,"sSpellSave")]
[h:sSaveType=json.get(SpellData,"sSaveType")]
[h:Duration=json.get(SpellData,"sDuration")]
[h:DmgHalved=json.get(SpellData,"DmgHalved")]
[h:DmgType=json.get(SpellData,"DmgType")]
[h:DmgDieNumber=json.get(SpellData,"DmgDieNum")]
[h:DmgDieSize=json.get(SpellData,"DmgDieSize")]
[h:DmgDieFlatBonus=json.get(SpellData,"DmgDieFlatBonus")]
[h:DmgDieMODBonus=json.get(SpellData,"DmgDieMODBonus")]
[h:DmgType2=json.get(SpellData,"DmgType2")]
[h:DmgDie2Number=json.get(SpellData,"DmgDie2Num")]
[h:DmgDie2Size=json.get(SpellData,"DmgDie2Size")]
[h:DmgDie2FlatBonus=json.get(SpellData,"DmgDie2FlatBonus")]
[h:DmgDie2MODBonus=json.get(SpellData,"DmgDie2MODBonus")]
[h:IsSight=json.get(SpellData,"IsSight")]
[h:sConcentration=json.get(SpellData,"sConcentration")]
[h:sDescription=json.get(SpellData,"sDescription")]
[h:sDescriptionTT=json.get(SpellData,"sDescriptionTT")]
[h:sDescriptionAHL=json.get(SpellData,"sDescriptionAHL")]
[h:TooltipPretext=json.get(SpellData,"Pretext")]
[h:TooltipPosttext=json.get(SpellData,"Posttext")]
[h:OuterBorderFrame=json.get(SpellData,"OuterBorderFrame")]
[h:OuterBorderTooltip=json.get(SpellData,"OuterBorderTooltip")]
[h:ParentToken = json.get(SpellData,"ParentToken")]
[h:NeedsBorder = if(json.get(SpellData,"NeedsBorder")=="",1,json.get(SpellData,"NeedsBorder"))]
[h:BorderColor="#000000"]
[h:TextColor="#FFFFFF"]

[h:a5e.UnifiedAbilities = a5e.GatherAbilities()]
[h:IsTooltip = 1]

[h,if(ForcedClass==""),CODE:{
	[h:ClassOptionsObj = "{}"]
	[h:pm.PassiveFunction("SpellClass")]

	[h:ClassOptions=json.fields(ClassOptionsObj,"json")]
	
	[h:BarbarianTest=if(json.contains(ClassOptions,"Barbarian"),1,0)]
	[h:BardTest=if(json.contains(ClassOptions,"Bard"),1,0)]
	[h:ClericTest=if(json.contains(ClassOptions,"Cleric"),1,0)]
	[h:DruidTest=if(json.contains(ClassOptions,"Druid"),1,0)]
	[h:FighterTest=if(json.contains(ClassOptions,"Fighter"),1,0)]
	[h:MonkTest=if(json.contains(ClassOptions,"Monk"),1,0)]
	[h:PaladinTest=if(json.contains(ClassOptions,"Paladin"),1,0)]
	[h:RangerTest=if(json.contains(ClassOptions,"Ranger"),1,0)]
	[h:RogueTest=if(json.contains(ClassOptions,"Rogue"),1,0)]
	[h:SorcererTest=if(json.contains(ClassOptions,"Sorcerer"),1,0)]
	[h:WarlockTest=if(json.contains(ClassOptions,"Warlock"),1,0)]
	[h:WizardTest=if(json.contains(ClassOptions,"Wizard"),1,0)]
	[h:ArtificerTest=if(json.contains(ClassOptions,"Artificer"),1,0)]
	[h:MultiClassTest=BarbarianTest+BardTest+ClericTest+DruidTest+FighterTest+MonkTest+PaladinTest+RangerTest+RogueTest+SorcererTest+WarlockTest+WizardTest+ArtificerTest]
};
{
	[h:BarbarianTest=if(ForcedClass=="Barbarian",1,0)]
	[h:BardTest=if(ForcedClass=="Bard",1,0)]
	[h:ClericTest=if(ForcedClass=="Cleric",1,0)]
	[h:DruidTest=if(ForcedClass=="Druid",1,0)]
	[h:FighterTest=if(ForcedClass=="Fighter",1,0)]
	[h:MonkTest=if(ForcedClass=="Monk",1,0)]
	[h:PaladinTest=if(ForcedClass=="Paladin",1,0)]
	[h:RangerTest=if(ForcedClass=="Ranger",1,0)]
	[h:RogueTest=if(ForcedClass=="Rogue",1,0)]
	[h:SorcererTest=if(ForcedClass=="Sorcerer",1,0)]
	[h:WarlockTest=if(ForcedClass=="Warlock",1,0)]
	[h:WizardTest=if(ForcedClass=="Wizard",1,0)]
	[h:ArtificerTest=if(ForcedClass=="Artificer",1,0)]
	[h:MultiClassTest=0]
}]

[h:BarbarianToHit=(Proficiency+json.get(AtrMods, "Constitution"))]
[h:BardToHit=(Proficiency+json.get(AtrMods, "Charisma"))]
[h:ClericToHit=(Proficiency+json.get(AtrMods, "Wisdom"))]
[h:DruidToHit=(Proficiency+json.get(AtrMods, "Wisdom"))]
[h:FighterToHit=(Proficiency+json.get(AtrMods, "Intelligence"))]
[h:MonkToHit=(Proficiency+json.get(AtrMods, "Wisdom"))]
[h:PaladinToHit=(Proficiency+json.get(AtrMods, "Charisma"))]
[h:RangerToHit=(Proficiency+json.get(AtrMods, "Wisdom"))]
[h:RogueToHit=(Proficiency+json.get(AtrMods, "Intelligence"))]
[h:SorcererToHit=(Proficiency+json.get(AtrMods, "Charisma"))]
[h:WarlockToHit=(Proficiency+json.get(AtrMods, "Charisma"))]
[h:WizardToHit=(Proficiency+json.get(AtrMods, "Intelligence"))]
[h:ArtificerToHit=(Proficiency+json.get(AtrMods, "Intelligence"))]

[h:BarbarianDC=(8+Proficiency+json.get(AtrMods, "Constitution"))]
[h:BardDC=(8+Proficiency+json.get(AtrMods, "Charisma"))]
[h:ClericDC=(8+Proficiency+json.get(AtrMods, "Wisdom"))]
[h:DruidDC=(8+Proficiency+json.get(AtrMods, "Wisdom"))]
[h:FighterDC=(8+Proficiency+json.get(AtrMods, "Intelligence"))]
[h:MonkDC=(8+Proficiency+json.get(AtrMods, "Wisdom"))]
[h:PaladinDC=(8+Proficiency+json.get(AtrMods, "Charisma"))]
[h:RangerDC=(8+Proficiency+json.get(AtrMods, "Wisdom"))]
[h:RogueDC=(8+Proficiency+json.get(AtrMods, "Intelligence"))]
[h:SorcererDC=(8+Proficiency+json.get(AtrMods, "Charisma"))]
[h:WarlockDC=(8+Proficiency+json.get(AtrMods, "Charisma"))]
[h:WizardDC=(8+Proficiency+json.get(AtrMods, "Intelligence"))]
[h:ArtificerDC=(8+Proficiency+json.get(AtrMods, "Intelligence"))]

[h:BarbarianStats=json.set("","SpellClass","Barbarian","Test",BarbarianTest,"ToHit",BarbarianToHit,"DC",BarbarianDC)]
[h:BardStats=json.set("","SpellClass","Bard","Test",BardTest,"ToHit",BardToHit,"DC",BardDC)]
[h:ClericStats=json.set("","SpellClass","Cleric","Test",ClericTest,"ToHit",ClericToHit,"DC",ClericDC)]
[h:DruidStats=json.set("","SpellClass","Druid","Test",DruidTest,"ToHit",DruidToHit,"DC",DruidDC)]
[h:FighterStats=json.set("","SpellClass","Fighter","Test",FighterTest,"ToHit",FighterToHit,"DC",FighterDC)]
[h:MonkStats=json.set("","SpellClass","Monk","Test",MonkTest,"ToHit",MonkToHit,"DC",MonkDC)]
[h:PaladinStats=json.set("","SpellClass","Paladin","Test",PaladinTest,"ToHit",PaladinToHit,"DC",PaladinDC)]
[h:RangerStats=json.set("","SpellClass","Ranger","Test",RangerTest,"ToHit",RangerToHit,"DC",RangerDC)]
[h:RogueStats=json.set("","SpellClass","Rogue","Test",RogueTest,"ToHit",RogueToHit,"DC",RogueDC)]
[h:SorcererStats=json.set("","SpellClass","Sorcerer","Test",SorcererTest,"ToHit",SorcererToHit,"DC",SorcererDC)]
[h:WarlockStats=json.set("","SpellClass","Warlock","Test",WarlockTest,"ToHit",WarlockToHit,"DC",WarlockDC)]
[h:WizardStats=json.set("","SpellClass","Wizard","Test",WizardTest,"ToHit",WizardToHit,"DC",WizardDC)]
[h:ArtificerStats=json.set("","SpellClass","Artificer","Test",ArtificerTest,"ToHit",ArtificerToHit,"DC",ArtificerDC)]

[h:AllStats=json.append("",BarbarianStats,BardStats,ClericStats,DruidStats,FighterStats,MonkStats,PaladinStats,RangerStats,RogueStats,SorcererStats,WarlockStats,WizardStats,ArtificerStats)]
[h:ToHitOutput=""]
[h:DCOutput=""]

[h,foreach(SpellClass,AllStats),CODE:{
	[h:ToHitOutput=ToHitOutput+if(json.get(SpellClass,"Test")==1,"; +"+json.get(SpellClass,"ToHit")+if(MultiClassTest>1," ("+json.get(SpellClass,"SpellClass")+")",""),"")]
	[h:DCOutput=DCOutput+if(json.get(SpellClass,"Test")==1,"; "+json.get(SpellClass,"DC")+if(MultiClassTest>1," ("+json.get(SpellClass,"SpellClass")+")",""),"")]
}]

[h:ToHitOutput=if(ToHitOutput==""," ; ",ToHitOutput)]
[h:DCOutput=if(DCOutput==""," ; ",DCOutput)]
[h:ToHitOutput=substring(ToHitOutput,1)]
[h:DCOutput=substring(DCOutput,1)]

[h:ttCastTime=if(CastTime=="Action","Action",CastTime)]
[h:ttCastTime=if(CastTime=="BONUS","Bonus Action",ttCastTime)]
[h:ttCastTime=if(CastTime=="REACTION","Reaction",ttCastTime)]
[h:ttCastTime=if(CastTime=="1 MIN","1 minute",ttCastTime)]
[h:ttCastTime=if(CastTime=="10 MIN","10 Minutes",ttCastTime)]
[h:ttCastTime=if(CastTime=="1 HOUR","1 Hour",ttCastTime)]
[h:ttCastTime=if(CastTime=="8 HOURS","8 Hours",ttCastTime)]
[h:ttCastTime=if(CastTime=="12 HOURS","12 Hours",ttCastTime)]
[h:ttCastTime=if(CastTime=="24 HOURS","12 Hours",ttCastTime)]

[h,switch(sLevel),code: 
	case 1: {[BorderColor="#fd2a19"][TextColor="#FFFFFF"]};
	case 2: {[BorderColor="#f7ae27"][TextColor="#000000"]};
	case 3: {[BorderColor="#fcf734"][TextColor="#000000"]};
	case 4: {[BorderColor="#c3f130"][TextColor="#000000"]};
	case 5: {[BorderColor="#008c14"][TextColor="#FFFFFF"]};
	case 6: {[BorderColor="#103ffb"][TextColor="#FFFFFF"]};
	case 7: {[BorderColor="#052090"][TextColor="#FFFFFF"]};
	case 8: {[BorderColor="#8e268c"][TextColor="#FFFFFF"]};
	case 9 :{[BorderColor="#f84af4"][TextColor="#FFFFFF"]};
	default:{}
]

[h:abilityTable = ""]

[h,if(NeedsBorder==0): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Spell Name, Level, and School",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",SpellName+": Level "+sLevel+" "+upper(sSchool,1)+" Spell",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]
	
[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Casting Time",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",ttCastTime,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Requires Concentration",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",if(sConcentration,"Yes","No"),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Range",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",if(RangeType=="Ranged",Range+" "+sRangeUnits,RangeType)+if(AoEShape=="None","",", "+AoESize+if(or(AoEShape=="Line",AoEShape=="Cylinder"),"x"+AoeSize2,"")+" "+AoEShape),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]
	
[h:ComponentsRequired = if(vComp,"V","")]
[h,if(sComp): ComponentsRequired = listAppend(ComponentsRequired,"S",", ")]
[h,if(mComp): ComponentsRequired = listAppend(ComponentsRequired,"M",", ")]
[h,if(mCompItems!=""): ComponentsRequired + "("+mCompItems+")"]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Components",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",ComponentsRequired,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h,if(mCompConsumed!="" && mCompConsumed!="0" && mCompConsumed!=0): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Components Consumed",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",mCompConsumed,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Requires Sight",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",if(IsSight,"Yes","No"),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Duration",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",Duration,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h,if(sSpellAttack): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","To Hit Bonus",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",ToHitOutput,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h,if(sSpellSave!=0): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Saving Throw",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",sSaveType+", DC "+DCOutput,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h,if(DmgDieNumber!=0): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header",DmgType+" "+if(or(DmgType=="Healing",DmgType=="Temp HP",DmgType=="Special"),"","Damage"),
	"FalseHeader","",
	"FullContents","",
	"RulesContents",DmgDieNumber+"d"+DmgDieSize+if(DmgDieFlatBonus==0,""," + "+DmgDieFlatBonus)+if(DmgDieMODBonus==0,""," + MOD")+if(DmgHalved,", Halved on Save",""),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h,if(DmgDie2Number!=0): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header",DmgType2+" "+if(or(DmgType2=="Healing",DmgType2=="Temp HP",DmgType2=="Special"),"","Damage"),
	"FalseHeader","",
	"FullContents","",
	"RulesContents",DmgDie2Number+"d"+DmgDie2Size+if(DmgDie2FlatBonus==0,""," + "+DmgDie2FlatBonus)+if(DmgDie2MODBonus==0,""," + MOD")+if(DmgHalved,", Halved on Save",""),
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']",
	"LinkText","",
	"Link","",
	"Value",""
	))]

[h:abilityEffect = sDescription+if(or(sDescriptionAHL=="",sDescriptionAHL=="0"),"","<br><br>"+sDescriptionAHL)]

[h,if(NeedsBorder),CODE:{
	[h:ClassFeatureData = json.set("",
		"DMOnly",DMOnly,
		"BorderColorOverride",if(BorderColorOverride=="",BorderColor,BorderColorOverride),
		"TitleFontColorOverride",if(TitleFontColorOverride=="",TextColor,TitleFontColorOverride),
		"TitleFont",TitleFont,
		"BodyFont",BodyFont,
		"Class","zzSpell",
		"Name",pm.RemoveSpecial(SpellName),
		"DisplayName","<b>"+SpellName+"</b>: Level "+sLevel+" "+upper(sSchool,1)+" Spell",
		"Effect",abilityEffect,
		"abilityTable",abilityTable
		)]
	[r:pm.TooltipOutput(ClassFeatureData)]
};{
	[h:macro.return = json.set("","Table",abilityTable,"Effect",abilityEffect)]
}]