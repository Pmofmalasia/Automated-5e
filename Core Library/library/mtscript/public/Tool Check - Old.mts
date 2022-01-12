[h:Flavor=json.get(macro.args,"Flavor")]
[h:ParentToken=json.get(macro.args,"ParentToken")]

[h:Alch=json.get(ArtisansTools,"Alch")]
[h:Brew=json.get(ArtisansTools,"Brew")]
[h:Callig=json.get(ArtisansTools,"Callig")]
[h:Carp=json.get(ArtisansTools,"Carp")]
[h:Cartog=json.get(ArtisansTools,"Cartog")]
[h:Cobb=json.get(ArtisansTools,"Cobb")]
[h:Cook=json.get(ArtisansTools,"Cook")]
[h:Glass=json.get(ArtisansTools,"Glass")]
[h:Jewel=json.get(ArtisansTools,"Jewel")]
[h:Leather=json.get(ArtisansTools,"Leather")]
[h:Mason=json.get(ArtisansTools,"Mason")]
[h:Paint=json.get(ArtisansTools,"Paint")]
[h:Potter=json.get(ArtisansTools,"Potter")]
[h:Smith=json.get(ArtisansTools,"Smith")]
[h:Tink=json.get(ArtisansTools,"Tink")]
[h:Weav=json.get(ArtisansTools,"Weav")]
[h:Wood=json.get(ArtisansTools,"Wood")]

[h:roll1=1d20]
[h:roll2=1d20]
[h:NO=0]
[h:SkillBonus=0]

[h:bAlch=json.get(AtrMods, "Intelligence")+if(Alch==0,if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Alch*Proficiency),Alch*Proficiency)][h:lAlch=if(bAlch>-1,"+","")][h:lAlch=lAlch+bAlch+" - Alchemist's Supplies (Int)"]
[h:bBrew=json.get(AtrMods, "Wisdom")+if(Brew==0,if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Brew*Proficiency),Brew*Proficiency)][h:lBrew=if(bBrew>-1,"+","")][h:lBrew=lBrew+bBrew+" - Brewer's Supplies (Wis)"]
[h:bCallig=json.get(AtrMods, "Dexterity")+if(Callig==0,if(json.get(LClass,"LFtr")>=7,if(json.get(FtrArchetype,"Chmp")==1,ceiling(1/2*Proficiency),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Callig*Proficiency)),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Callig*Proficiency)),Callig*Proficiency)][h:lCallig=if(bCallig>-1,"+","")][h:lCallig=lCallig+bCallig+" - Calligrapher's Supplies (Dex)"]
[h:bCarp=json.get(AtrMods, "Dexterity")+if(Carp==0,if(json.get(LClass,"LFtr")>=7,if(json.get(FtrArchetype,"Chmp")==1,ceiling(1/2*Proficiency),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Carp*Proficiency)),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Carp*Proficiency)),Carp*Proficiency)][h:lCarp=if(bCarp>-1,"+","")][h:lCarp=lCarp+bCarp+" - Carpenter's Tools (Dex)"]
[h:bCartog=json.get(AtrMods, "Intelligence")+if(Cartog==0,if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Cartog*Proficiency),Cartog*Proficiency)][h:lCartog=if(bCartog>-1,"+","")][h:lCartog=lCartog+bCartog+" - Cartographer's Tools (Int)"]
[h:bCobb=json.get(AtrMods, "Intelligence")+if(Cobb==0,if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Cobb*Proficiency),Cobb*Proficiency)][h:lCobb=if(bCobb>-1,"+","")][h:lCobb=lCobb+bCobb+" - Cobbler's Tools (Int)"]
[h:bCook=json.get(AtrMods, "Wisdom")+if(Cook==0,if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Cook*Proficiency),Cook*Proficiency)][h:lCook=if(bCook>-1,"+","")][h:lCook=lCook+bCook+" - Cook's Tools (Wis)"]
[h:bGlass=json.get(AtrMods, "Intelligence")+if(Glass==0,if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Glass*Proficiency),Glass*Proficiency)][h:lGlass=if(bGlass>-1,"+","")][h:lGlass=lGlass+bGlass+" - Glassblower's Tools (Int)"]
[h:bJewel=json.get(AtrMods, "Intelligence")+if(Jewel==0,if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Jewel*Proficiency),Jewel*Proficiency)][h:lJewel=if(bJewel>-1,"+","")][h:lJewel=lJewel+bJewel+" - Jeweler's Tools (Int)"]
[h:bLeather=json.get(AtrMods, "Dexterity")+if(Leather==0,if(json.get(LClass,"LFtr")>=7,if(json.get(FtrArchetype,"Chmp")==1,ceiling(1/2*Proficiency),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Leather*Proficiency)),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Leather*Proficiency)),Leather*Proficiency)][h:lLeather=if(bLeather>-1,"+","")][h:lLeather=lLeather+bLeather+" - Leatherworker's Tools (Dex)"]
[h:bMason=json.get(AtrMods, "Strength")+if(Mason==0,if(json.get(LClass,"LFtr")>=7,if(json.get(FtrArchetype,"Chmp")==1,ceiling(1/2*Proficiency),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Mason*Proficiency)),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Mason*Proficiency)),Mason*Proficiency)][h:lMason=if(bMason>-1,"+","")][h:lMason=lMason+bMason+" - Mason's Tools (Str)"]
[h:bPaint=json.get(AtrMods, "Dexterity")+if(Paint==0,if(json.get(LClass,"LFtr")>=7,if(json.get(FtrArchetype,"Chmp")==1,ceiling(1/2*Proficiency),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Paint*Proficiency)),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Paint*Proficiency)),Paint*Proficiency)][h:lPaint=if(bPaint>-1,"+","")][h:lPaint=lPaint+bPaint+" - Painter's Supplies (Dex)"]
[h:bPotter=json.get(AtrMods, "Dexterity")+if(Potter==0,if(json.get(LClass,"LFtr")>=7,if(json.get(FtrArchetype,"Chmp")==1,ceiling(1/2*Proficiency),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Potter*Proficiency)),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Potter*Proficiency)),Potter*Proficiency)][h:lPotter=if(bPotter>-1,"+","")][h:lPotter=lPotter+bPotter+" - Potter's Tools (Dex)"]
[h:bSmith=json.get(AtrMods, "Strength")+if(Smith==0,if(json.get(LClass,"LFtr")>=7,if(json.get(FtrArchetype,"Chmp")==1,ceiling(1/2*Proficiency),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Smith*Proficiency)),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Smith*Proficiency)),Smith*Proficiency)][h:lSmith=if(bSmith>-1,"+","")][h:lSmith=lSmith+bSmith+" - Smith's Tools (Str)"]
[h:bTink=json.get(AtrMods, "Intelligence")+if(Tink==0,if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Tink*Proficiency),Tink*Proficiency)][h:lTink=if(bTink>-1,"+","")][h:lTink=lTink+bTink+" - Tinker's Tools (Int)"]
[h:bWeav=json.get(AtrMods, "Dexterity")+if(Weav==0,if(json.get(LClass,"LFtr")>=7,if(json.get(FtrArchetype,"Chmp")==1,ceiling(1/2*Proficiency),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Weav*Proficiency)),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Weav*Proficiency)),Weav*Proficiency)][h:lWeav=if(bWeav>-1,"+","")][h:lWeav=lWeav+bWeav+" - Weaver's Tools (Dex)"]
[h:bWood=json.get(AtrMods, "Dexterity")+if(Wood==0,if(json.get(LClass,"LFtr")>=7,if(json.get(FtrArchetype,"Chmp")==1,ceiling(1/2*Proficiency),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Wood*Proficiency)),if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),Wood*Proficiency)),Wood*Proficiency)][h:lWood=if(bWood>-1,"+","")][h:lWood=lWood+bWood+" - Woodcarver's Tools (Dex)"]

[h:listSkills="--Choose--,"+lAlch+","+lBrew+","+lCallig+","+lCarp+","+lCartog+","+lCobb+","+lCook+","+lGlass+","+lJewel+","+lLeather+","+lMason+","+lPaint+","+lPotter+","+lSmith+","+lTink+","+lWeav+","+lWood]

[h:SkillCheck=input(
	"SkillDesc|--Description Here--|Description||WIDTH=40",
	"iSkills|"+listSkills+"|Skills|LIST",
	"Alternate|-NO-,Str,Dex,Con,Int,Wis,Cha|Use Alternate Ability|LIST|VALUE=STRING",
	"sBonus||Bonus||WIDTH=20",
	"dmOnly|0|Only show DM?|CHECK"
)]
[h:abort(SkillCheck)]

[h:AddedBonus=eval(sBonus+"+1d1-1")]

[h,switch(iSkills),code:
	case 0: {[SkillTitle="-No Skill Selected"]};
	case 1: {[SkillTitle=lAlch][SkillBonus=bAlch+if(Alternate=="-NO-",0,if(and(Alch==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Intelligence")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Intelligence")))]};
	case 2: {[SkillTitle=lBrew][SkillBonus=bBrew+if(Alternate=="-NO-",0,if(and(Brew==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Wisdom")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Wisdom")))]};
	case 3: {[SkillTitle=lCallig][SkillBonus=bCallig+if(Alternate=="-NO-",0,if(and(Callig==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Dexterity")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Dexterity"))]};
	case 4: {[SkillTitle=lCarp][SkillBonus=bCarp+if(Alternate=="-NO-",0,if(and(Carp==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Strength")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Strength")))]};
	case 5: {[SkillTitle=lCartog][SkillBonus=bCartog+if(Alternate=="-NO-",0,if(and(Cartog==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Intelligence")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Intelligence")))]};
	case 6: {[SkillTitle=lCobb][SkillBonus=bCobb+if(Alternate=="-NO-",0,if(and(Cobb==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Intelligence")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Intelligence")))]};
	case 7: {[SkillTitle=lCook][SkillBonus=bCook+if(Alternate=="-NO-",0,if(and(Cook==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Wisdom")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Wisdom")))]};
	case 8: {[SkillTitle=lGlass][SkillBonus=bGlass+if(Alternate=="-NO-",0,if(and(Glass==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Intelligence")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Intelligence")))]};
	case 9: {[SkillTitle=lJewel][SkillBonus=bJewel+if(Alternate=="-NO-",0,if(and(Jewel==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Intelligence")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Intelligence")))]};
	case 10: {[SkillTitle=lLeather][SkillBonus=bLeather+if(Alternate=="-NO-",0,if(and(Leather==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Dexterity")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Dexterity")))]};
	case 11: {[SkillTitle=lMason][SkillBonus=bMason+if(Alternate=="-NO-",0,if(and(Mason==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Strength")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Strength")))]};
	case 12: {[SkillTitle=lPaint][SkillBonus=bPaint+if(Alternate=="-NO-",0,if(and(Paint==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Dexterity")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Dexterity")))]};
	case 13: {[SkillTitle=lPotter][SkillBonus=bPotter+if(Alternate=="-NO-",0,if(and(Potter==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Dexterity")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Dexterity")))]};
	case 14: {[SkillTitle=lSmith][SkillBonus=bSmith+if(Alternate=="-NO-",0,if(and(Smith==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Strength")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Strength")))]};
	case 15: {[SkillTitle=lTink][SkillBonus=bTink+if(Alternate=="-NO-",0,if(and(Tink==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Str",Alternate=="Dex",Alternate=="Con")),eval(Alternate)-json.get(AtrMods, "Intelligence")+ceiling(1/2*Proficiency)-if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Intelligence")))]};
	case 16: {[SkillTitle=lWeav][SkillBonus=bWeav+if(Alternate=="-NO-",0,if(and(Weav==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Dexterity")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Dexterity")))]};
	case 17: {[SkillTitle=lWood][SkillBonus=bWood+if(Alternate=="-NO-",0,if(and(Wood==0,json.get(LClass,"LFtr")>=7,json.get(FtrArchetype,"Chmp")==1,or(Alternate=="Int",Alternate=="Wis",Alternate=="Cha")),eval(Alternate)-json.get(AtrMods, "Dexterity")-ceiling(1/2*Proficiency)+if(json.get(LClass,"LBrd")>=2,floor(1/2*Proficiency),0),eval(Alternate)-json.get(AtrMods, "Dexterity")))]}
]

[h:ReliableResult=10+SkillBonus+AddedBonus]

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

		[if(dmOnly==1), code:{
			<span style='font-size:1.5em;'>Skill Check: <b><span style='{if(roll1>=20,'font-size:2em; color:#AA2222;','')}{if(roll1==1,'font-size:2em; color:#2222AA;','')}'>[g:roll1+SkillBonus+AddedBonus]</span></b></span><i>HIDDEN</i><br>
			(Adv: <b><span style='{if(Max(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Max(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[g:Max(roll1,roll2)+SkillBonus+AddedBonus]</span></b></span><i>HIDDEN</i> / Dis: <b><span style='{if(Min(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Min(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[g:Min(roll1,roll2)+SkillBonus+AddedBonus]</span></b></span><i>HIDDEN</i>)
		};{
			<span style='font-size:1.5em;'>Skill Check: <b><span style='{if(roll1>=20,'font-size:2em; color:#AA2222;','')}{if(roll1==1,'font-size:2em; color:#2222AA;','')}'>[r:roll1+SkillBonus+AddedBonus]</span></b> ([r:roll1])</span><br>
			(Adv: <b><span style='{if(Max(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Max(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[r:Max(roll1,roll2)+SkillBonus+AddedBonus]</span></b> / Dis: <b><span style='{if(Min(roll1,roll2)>=20,'font-size:2em; color:#AA2222;','')}{if(Min(roll1,roll2)==1,'font-size:2em; color:#2222AA;','')}'>[r:Min(roll1,roll2)+SkillBonus+AddedBonus]</span></b>)
		}]

		{if(Alternate=="-NO-","","<br>Skill check rolled as a "+Alternate+" Check.")}

		{if(or(sBonus=="",sBonus==0),"","<br><b>Additional Bonus Included:</b> ")}{if(or(sBonus=="",sBonus==0),"",sBonus)}
		<table>
		
			{if(getState("Guidance"),"<tr><td><b>Guidance:</b> Add 1d4 to your check:<span style='font-size:1.5em;'> "+1d4+"</span></td></tr>","")}
			[h:setState("Guidance",0)]
			{if(getState("Blinded"),"<tr><td><b>Blinded:</b> You automatically fail any ability check that requires sight.</td></tr>","")}
			{if(getState("Deafened"),"<tr><td><b>Deafened:</b> You automatically fail any ability check that requires hearing.</td></tr>","")}
			{if(getState("Poisoned"),"<tr><td><b>Poisoned:</b> You have disadvantage on all ability checks.</td></tr>","")}
			{if(getState("Frightened"),"<tr><td><b>Frightened:</b> You have disadvantage on all ability checks while the source of your fear is within line of sight.</td></tr>","")}
			{if(Exhaustion>=1,"<tr><td><b>Exhausted:</b> You have disadvantage on all ability checks.</td></tr>","")}
			{if(getState("Foresight"),"<tr><td><b>Foresight:</b> You have advantage on all ability checks.</td></tr>","")}
			{if(and(getState("Enlarge"),or(SkillTitle==lSmith,Alternate=="Str",SkillTitle==lMason)),"<tr><td><b>Enlarge:</b> You have advantage on your check.</td></tr>","")}
			{if(and(getState("Reduce"),or(SkillTitle==lSmith,Alternate=="Str",SkillTitle==lMason)),"<tr><td><b>Reduce:</b> You have disadvantage on your check.</td></tr>","")}
			
			{if(json.get(LClass,"LBrb")>1,if(and(getState("Rage")==1,or(Alternate=="Str",SkillTitle==lSmith,SkillTitle==lMason)),"<tr><td>&#8226;</td><td> <b>Rage:</b> Advantage on <b>Str Checks</b> and <b>Str Saves</b>.</td></tr>",""),"")}
			{if(and(json.get(LClass,"LBrb")>17,or(Alternate=="Str",SkillTitle==lSmith,SkillTitle==lMason)),"<tr><td>&#8226;</td><td> <b>Indomitable Might:</b> If <b>Str Check</b> result is less than <b>Strength:</b> "+json.get(Attributes,"Strength")+", use "+json.get(Attributes,"Strength")+" as the result instead.</td></tr>","")}
			{if(json.get(LClass,"LRog")>=11,"<tr><td>&#8226;</td><td> <b>Reliable Talent:</b> If you are proficient in this tool, You can use <b>"+ReliableResult+"</b> instead of your lower rolled result.</b> </td></tr>","")}
			{if(json.get(LClass,"LArt")>=6,"<tr><td>&#8226;</td><td> <b>Tool Expertise:</b> Your proficiency bonus is doubled for any ability check you make that uses your proficiency with a tool. </td></tr>","")}

			[r:if(and(or(Race=="Lightfoot Halfling",Race=="Stout Halfling"),or(roll1==1,roll2==1)),"<tr><td>&#8226;</td><td> <b>Halfling Luck</b>: You can reroll the 1 on your ability check, and must use the new roll.</td></tr>","")]
		</table>
	</div>
</div>