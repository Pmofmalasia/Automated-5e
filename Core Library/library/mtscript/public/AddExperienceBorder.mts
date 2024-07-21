[h:AddXPData = macro.args]
[h:XPGained = json.get(AddXPData,"XP")]
[h:XPGainTokens = json.get(AddXPData,"Tokens")]
[h,if(json.isEmpty(XPGainTokens)): XPGainTokens = getSelected("json")]
[h,if(json.isEmpty(XPGainTokens)): assert(0,"No tokens are selected to give experience to!")]
[h:AddXPData = json.set(AddXPData,"Tokens",XPGainTokens)]
[h:closeDialog("AddExperienceInput")]
[h:outputTargets = "not-gm"]

[h,MACRO("AddExperience@Lib:pm.a5e.Core"): AddXPData]
[h:ExperienceData = macro.return]
[h:abilityTable = json.get(ExperienceData,"Table")]
[h:isLevelUp = json.get(ExperienceData,"isLevelUp")]

[h:BorderData = json.set("",
	"Flavor","",
	"Name","Experience Gained",
	"DisplayName","Experience Gained",
	"FalseName","",
	"DisplayClass",if(isLevelUp,"zzChangeHP","zzChecksAndSaves"),
	"ColorSubtype",if(isLevelUp,"Healing","")
)]
[h:AllOutputComponents = json.set("",
	"ParentToken",if(json.length(XPGainTokens) == 1,json.get(XPGainTokens,0),""),
	"needsSplitGMOutput",0,
	"BorderData",BorderData,
	"Table",abilityTable,
	"ShowFullRulesType",json.append("","Experience","LevelUp","ChecksAndSaves"),
	"OutputTargets",""
)]

[h,MACRO("GatherOutputComponents@Lib:pm.a5e.Core"): AllOutputComponents]