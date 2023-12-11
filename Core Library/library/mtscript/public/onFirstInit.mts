[h:tempBorderColors = '{"Artificer":"#D4AF37","Barbarian":"#AA2222","Bard":"#FCF734","Cleric":"#02F5F5","Druid":"#22AA22","Fighter":"#051E89","Monk":"#F7AE27","Paladin":"#F4C544","Ranger":"#22AA22","Rogue":"#444444","Sorcerer":"#F84AF4","Warlock":"#8E268C","Wizard":"#018C8D","Monster":"#F5D277","Innate":"#2F1266","Feat":"#BFBFBF","FightingStyle":"#D2A76B","Item":"#AE8F26","Error":"#FFFFFF","zzChecksAndSaves":"#2222AA","zzChangeHP":{"Healing":"#22AA22","Damage":"AA2222"},"zzInitiative":"#C67F43","zzDeath":"#211d1a","zzWeaponAttack":"#000000","zzOtherCombatActions":"#000000","zzGeneral":"#2222AA"}']
[h:setLibProperty("ClassBorderColors",tempBorderColors,"Lib:pm.a5e.Core")]

[h:tempTitleColors = '{"Artificer":"#000000","Barbarian":"#FFFFFF","Bard":"#000000","Cleric":"#000000","Druid":"#FFFFFF","Fighter":"#FFFFFF","Monk":"#000000","Paladin":"#000000","Ranger":"#FFFFFF","Rogue":"#FFFFFF","Sorcerer":"#000000","Warlock":"#FFFFFF","Wizard":"#FFFFFF","Monster":"#000000","Innate":"#FFFFFF","Feat":"#000000","FightingStyle":"#000000","Item":"#000000","Error":"#000000","zzChecksAndSaves":"#FFFFFF","zzChangeHP":{"Healing":"#000000","Damage":"#FFFFFF"},"zzInitiative":"#000000","zzDeath":"#FFFFFF","zzWeaponAttack":"#FFFFFF","zzOtherCombatActions":"#FFFFFF","zzGeneral":"#FFFFFF"}']
[h:setLibProperty("ClassTitleColors",tempTitleColors,"Lib:pm.a5e.Core")]

[h:defaultChatSettings = json.set("",
	"DisplaySize",150,
	"VerticalDisplay",1,
	"UseWidth",0,
	"DarkMode",1,
	"ChatColors",'{"DarkBackground":"#27241D","DarkText":"#FAF9F7","DarkAccentBackground":"#504A40","DarkAccentText":"#FAF9F7","DarkDamageText":"#AA2222","DarkHealingText":"#22AA22","DarkCritText":"#AA2222","DarkCritFailText":"#00B8D9","DarkLinkColor":"#FF0000","LightBackground":"#FAF9F7","LightText":"#27241D","LightAccentBackground":"#D3CEC4","LightAccentText":"#27241D","LightDamageText":"#AA2222","LightHealingText":"#22AA22","LightCritText":"#AA2222","LightCritFailText":"#00B8D9","LightLinkColor":"#303F9F"}',
	"ClassBorderColors",tempBorderColors,
	"ClassTitleColors",tempTitleColors,
	"SpellBorderColors",'{"Arcane":{"0":"#93160D","1":"#fd2a19","2":"#f7ae27","3":"#fcf734","4":"#c3f130","5":"#008c14","6":"#103ffb","7":"#052090","8":"#8e268c","9":"#f84af4"},"Divine":{"0":"#93160D","1":"#DE3163","2":"#03758B","3":"#FFB70B","4":"#FE5BAC","5":"#04D4CE","6":"#FDE44E","7":"#FCA3B7","8":"#8EFAF7","9":"#F9EE89"},"Primal":{"0":"#93160D","1":"#98CBF7","2":"#DA9E83","3":"#A0CE90","4":"#107EDB","5":"#A45430","6":"#4c8238","7":"#083D6A","8":"#582D19","9":"#315525"}}',
	"SpellTitleColors",'{"Arcane":{"0":"#FFFFFF","1":"#FFFFFF","2":"#000000","3":"#000000","4":"#000000","5":"#FFFFFF","6":"#FFFFFF","7":"#FFFFFF","8":"#FFFFFF","9":"#FFFFFF"},"Divine":{"0":"#FFFFFF","1":"#000000","2":"#FFFFFF","3":"#000000","4":"#000000","5":"#000000","6":"#000000","7":"#000000","8":"#000000","9":"#000000"},"Primal":{"0":"#FFFFFF","1":"#000000","2":"#000000","3":"#000000","4":"#FFFFFF","5":"#FFFFFF","6":"#FFFFFF","7":"#FFFFFF","8":"#FFFFFF","9":"#FFFFFF"}}',
	"BodyFont","Default",
	"TitleFont","Default"
)]
[h:data.setData("addon:","pm.a5e.core","DefaultChatSettings",defaultChatSettings)]
[h:data.setData("addon:","pm.a5e.core","ChatSettings",defaultChatSettings)]
[h:data.setData("addon:","pm.a5e.core","PlayerChatSettings","{}")]

[h:setLibProperty("DisplaySize",150,"Lib:pm.a5e.Core")]
[h:setLibProperty("VerticalDisplay",1,"Lib:pm.a5e.Core")]
[h:setLibProperty("useWidth",0,"Lib:pm.a5e.Core")]
[h:setLibProperty("DarkMode",1,"Lib:pm.a5e.Core")]
[h:setLibProperty("ChatColors",'{"DarkBackground":"#27241D","DarkText":"#FAF9F7","DarkAccentBackground":"#504A40","DarkAccentText":"#FAF9F7","DarkDamageText":"#AA2222","DarkHealingText":"#22AA22","DarkCritText":"#AA2222","DarkCritFailText":"#00B8D9","DarkLinkColor":"#FF0000","LightBackground":"#FAF9F7","LightText":"#27241D","LightAccentBackground":"#D3CEC4","LightAccentText":"#27241D","LightDamageText":"#AA2222","LightHealingText":"#22AA22","LightCritText":"#AA2222","LightCritFailText":"#00B8D9","LightLinkColor":"#303F9F"}',"Lib:pm.a5e.Core")]

[h:setLibProperty("SpellBorderColors",'{"Arcane":{"0":"#93160D","1":"#fd2a19","2":"#f7ae27","3":"#fcf734","4":"#c3f130","5":"#008c14","6":"#103ffb","7":"#052090","8":"#8e268c","9":"#f84af4"},"Divine":{"0":"#93160D","1":"#DE3163","2":"#03758B","3":"#FFB70B","4":"#FE5BAC","5":"#04D4CE","6":"#FDE44E","7":"#FCA3B7","8":"#8EFAF7","9":"#F9EE89"},"Primal":{"0":"#93160D","1":"#98CBF7","2":"#DA9E83","3":"#A0CE90","4":"#107EDB","5":"#A45430","6":"#4c8238","7":"#083D6A","8":"#582D19","9":"#315525"}}',"Lib:pm.a5e.Core")]
[h:setLibProperty("SpellTitleColors",'{"Arcane":{"0":"#FFFFFF","1":"#FFFFFF","2":"#000000","3":"#000000","4":"#000000","5":"#FFFFFF","6":"#FFFFFF","7":"#FFFFFF","8":"#FFFFFF","9":"#FFFFFF"},"Divine":{"0":"#FFFFFF","1":"#000000","2":"#FFFFFF","3":"#000000","4":"#000000","5":"#000000","6":"#000000","7":"#000000","8":"#000000","9":"#000000"},"Primal":{"0":"#FFFFFF","1":"#000000","2":"#000000","3":"#000000","4":"#FFFFFF","5":"#FFFFFF","6":"#FFFFFF","7":"#FFFFFF","8":"#FFFFFF","9":"#FFFFFF"}}',"Lib:pm.a5e.Core")]
[h:setLibProperty("ChatFonts",'{"Title":"Default","Body":"Default"}',"Lib:pm.a5e.Core")]
[h:setLibProperty("FontOptions","Default,Century Gothic,Comic Sans MS,Courier New,Georgia,Lucida Bright,Papyrus,Tahoma,Times New Roman,Trebuchet MS,Verdana,Custom","Lib:pm.a5e.Core")]
[h:setLibProperty("AuraOptions","Green,Red,White,Orange,Yellow,Blue,Purple,Black","Lib:pm.a5e.Core")]
[h:setLibProperty("FullSpellRules",0,"Lib:pm.a5e.Core")]
[h:setLibProperty("FullAbilityRules",0,"Lib:pm.a5e.Core")]
[h:setLibProperty("ChatIndividual",0,"Lib:pm.a5e.Core")]
[h:setLibProperty("ShowAllDice",0,"Lib:pm.a5e.Core")]
[h:setLibProperty("HideAllyMacros",0,"Lib:pm.a5e.Core")]
[h:setLibProperty("HideEnemyMacros",2,"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipFrame",'{"Default":1}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipMouseover",'{"Default":0}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkMode",'{"Default":1}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDisplaySize",'{"Default":500}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDisplayType",'{"Default":0}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipVertical",'{"Default":0}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkBackground",'{"Default":"#27241D"}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkText",'{"Default":"#FAF9F7"}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkAccent",'{"Default":"#504A40"}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipDarkAccentText",'{"Default":"#FAF9F7"}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipLightBackground",'{"Default":"#FAF9F7"}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipLightText",'{"Default":"#27241D"}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipLightAccent",'{"Default":"#D3CEC4"}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipLightAccentText",'{"Default":"#27241D"}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipTitleFont",'{"Default":""}',"Lib:pm.a5e.Core")]
[h:setLibProperty("TooltipBodyFont",'{"Default":""}',"Lib:pm.a5e.Core")]
[h:data.setData("addon:","pm.a5e.core","PlayerChatSettings",'{}')]
[h:data.setData("addon:","pm.a5e.core","gd.RandomEncounterSettings",'{"BaseChance":5,"AccumulatedChance":0,"MaxChance":"15","ChanceIncrement":1}')]

[h:setLibProperty("ms.Sources",'[{"DisplayName":"Systems Reference Document","Name":"SystemsReferenceDocument","Library":"SRD","Banned":0},{"DisplayName":"Automated 5th Edition","Name":"Automated5thEdition","Library":"A5E","Banned":0}]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Attributes",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Skills",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Tools",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.ToolTypes",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Backgrounds",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Classes",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Subclasses",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Races",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Subraces",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.CreatureTypes",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Languages",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Abilities",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.AbilityUpdates",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Conditions",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Feats",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.DamageTypes",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.CastingAbilities",'{}',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.ConditionTags",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.DamageTypeTags",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.SpellSchools",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Spells",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.SpellLists",'{}',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.MonsterFeatures",'[]',"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.CreatureSubtypes",'[]',"Lib:pm.a5e.Core")]

[h:setLibProperty("LanguageOptions",'{"Standard":1,"Exotic":1,"Monstrous":0,"Secret":0}',"Lib:pm.a5e.Core")]
[h:setLibProperty("LanguageSourcebooks",'{}',"Lib:pm.a5e.Core")]
[h:setLibProperty("AttributeSourcebooks",'{}',"Lib:pm.a5e.Core")]
[h:setLibProperty("BackgroundSourcebooks",'{}',"Lib:pm.a5e.Core")]

[h:setLibProperty("gd.Effects",'[]',"Lib:pm.a5e.Core")]

[broadcast("First-time setup complete.")]
[h:"<!-- TODO: Add link to Gather Sourcebook Effects here since it cannot be called in on(First)Init in an addon -->"]