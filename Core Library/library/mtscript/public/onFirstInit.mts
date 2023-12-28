[h:BorderColors = '{"Artificer":"#D4AF37","Barbarian":"#AA2222","Bard":"#FCF734","Cleric":"#02F5F5","Druid":"#22AA22","Fighter":"#051E89","Monk":"#F7AE27","Paladin":"#F4C544","Ranger":"#22AA22","Rogue":"#444444","Sorcerer":"#F84AF4","Warlock":"#8E268C","Wizard":"#018C8D","Monster":"#F5D277","Innate":"#2F1266","Feat":"#BFBFBF","FightingStyle":"#D2A76B","Item":"#AE8F26","zzRest":"#73B9EE","Error":"#FFFFFF","zzChecksAndSaves":"#2222AA","zzChangeHP":{"Healing":"#22AA22","Damage":"AA2222"},"zzInitiative":"#C67F43","zzDeath":"#211d1a","zzWeaponAttack":"#000000","zzOtherCombatActions":"#000000","zzGeneral":"#2222AA"}']
[h:BorderColors = json.set(BorderColors,
	"zzSpell",'{"Arcane":{"0":"#93160D","1":"#fd2a19","2":"#f7ae27","3":"#fcf734","4":"#c3f130","5":"#008c14","6":"#103ffb","7":"#052090","8":"#8e268c","9":"#f84af4"},"Divine":{"0":"#93160D","1":"#DE3163","2":"#03758B","3":"#FFB70B","4":"#FE5BAC","5":"#04D4CE","6":"#FDE44E","7":"#FCA3B7","8":"#8EFAF7","9":"#F9EE89"},"Primal":{"0":"#93160D","1":"#98CBF7","2":"#DA9E83","3":"#A0CE90","4":"#107EDB","5":"#A45430","6":"#4c8238","7":"#083D6A","8":"#582D19","9":"#315525"}}'
)]

[h:TitleColors = '{"Artificer":"#000000","Barbarian":"#FFFFFF","Bard":"#000000","Cleric":"#000000","Druid":"#FFFFFF","Fighter":"#FFFFFF","Monk":"#000000","Paladin":"#000000","Ranger":"#FFFFFF","Rogue":"#FFFFFF","Sorcerer":"#000000","Warlock":"#FFFFFF","Wizard":"#FFFFFF","Monster":"#000000","Innate":"#FFFFFF","Feat":"#000000","FightingStyle":"#000000","Item":"#000000","zzRest":"#000000","Error":"#000000","zzChecksAndSaves":"#FFFFFF","zzChangeHP":{"Healing":"#000000","Damage":"#FFFFFF"},"zzInitiative":"#000000","zzDeath":"#FFFFFF","zzWeaponAttack":"#FFFFFF","zzOtherCombatActions":"#FFFFFF","zzGeneral":"#FFFFFF"}']
[h:TitleColors = json.set(TitleColors,
	"zzSpell",'{"Arcane":{"0":"#FFFFFF","1":"#FFFFFF","2":"#000000","3":"#000000","4":"#000000","5":"#FFFFFF","6":"#FFFFFF","7":"#FFFFFF","8":"#FFFFFF","9":"#FFFFFF"},"Divine":{"0":"#FFFFFF","1":"#000000","2":"#FFFFFF","3":"#000000","4":"#000000","5":"#000000","6":"#000000","7":"#000000","8":"#000000","9":"#000000"},"Primal":{"0":"#FFFFFF","1":"#000000","2":"#000000","3":"#000000","4":"#FFFFFF","5":"#FFFFFF","6":"#FFFFFF","7":"#FFFFFF","8":"#FFFFFF","9":"#FFFFFF"}}'
)]

[h:defaultChatSettings = json.set("",
	"DisplaySize",150,
	"VerticalDisplay",1,
	"UseWidth",0,
	"DarkMode",1,
	"ChatColors",'{
		"DarkBackground":"#27241D",
		"DarkText":"#FAF9F7",
		"DarkAccentBackground":"#504A40",
		"DarkAccentText":"#FAF9F7",
		"DarkDamageText":"#AA2222",
		"DarkHealingText":"#22AA22",
		"DarkFailureText":"#AA2222",
		"DarkSuccessText":"#22AA22",
		"DarkCritText":"#AA2222",
		"DarkCritFailText":"#00B8D9",
		"DarkLinkColor":"#FF0000",
		"LightBackground":"#FAF9F7",
		"LightText":"#27241D",
		"LightAccentBackground":"#D3CEC4",
		"LightAccentText":"#27241D",
		"LightDamageText":"#AA2222",
		"LightHealingText":"#22AA22",
		"LightFailureText":"#AA2222",
		"LightSuccessText":"#22AA22",
		"LightCritText":"#AA2222",
		"LightCritFailText":"#00B8D9",
		"LightLinkColor":"#303F9F"
	}',
	"BorderColors",BorderColors,
	"TitleColors",TitleColors,
	"BodyFont","Default",
	"TitleFont","Default"
)]
[h:data.setData("addon:","pm.a5e.core","DefaultChatSettings",defaultChatSettings)]
[h:data.setData("addon:","pm.a5e.core","ChatSettings",defaultChatSettings)]
[h:data.setData("addon:","pm.a5e.core","PlayerChatSettings","{}")]
[h:data.setData("addon:","pm.a5e.core","FullRulesSettings",json.set("","Default",0))]

[h:defaultTooltipSettings = json.set(defaultChatSettings,
	"VerticalDisplay",0,
	"DisplaySize",400,
	"UseWidth",1,
	"isTooltipFrame",1,
	"isTooltipMouseover",0
)]
[h:data.setData("addon:","pm.a5e.core","DefaultTooltipSettings",defaultTooltipSettings)]
[h:data.setData("addon:","pm.a5e.core","TooltipSettings",defaultTooltipSettings)]
[h:data.setData("addon:","pm.a5e.core","PlayerTooltipSettings","{}")]

[h:data.setData("addon:","pm.a5e.core","FontOptions",json.append("","Default","Century Gothic","Comic Sans MS","Courier New","Georgia","Lucida Bright","Papyrus","Tahoma","Times New Roman","Trebuchet MS","Verdana","Custom"))]
[h:data.setData("addon:","pm.a5e.core","AuraOptions",json.append("","Green","Red","White","Orange","Yellow","Blue","Purple","Black"))]
[h:data.setData("addon:","pm.a5e.core","FullSpellRules",0)]
[h:data.setData("addon:","pm.a5e.core","ChatIndividual",0)]
[h:data.setData("addon:","pm.a5e.core","HideAllyMacros",0)]
[h:data.setData("addon:","pm.a5e.core","HideEnemyMacros",2)]

[h:data.setData("addon:","pm.a5e.core","gd.RandomEncounterSettings",'{"BaseChance":5,"AccumulatedChance":0,"MaxChance":"15","ChanceIncrement":1}')]

[h:data.setData("addon:","pm.a5e.core","ms.Sources",'[{"DisplayName":"Systems Reference Document","Name":"SystemsReferenceDocument","Library":"SRD","Banned":0},{"DisplayName":"Automated 5th Edition","Name":"Automated5thEdition","Library":"A5E","Banned":0}]')]
[h:data.setData("addon:","pm.a5e.core","sb.Attributes",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.Skills",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.Tools",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.ToolTypes",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.Backgrounds",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.Classes",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.Subclasses",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.Races",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.Subraces",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.CreatureTypes",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.Languages",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.Abilities",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.AbilityUpdates",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.Conditions",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.Feats",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.DamageTypes",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.CastingAbilities",'{}')]
[h:data.setData("addon:","pm.a5e.core","sb.ConditionTags",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.DamageTypeTags",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.SpellSchools",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.Spells",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.SpellLists",'{}')]
[h:data.setData("addon:","pm.a5e.core","sb.MonsterFeatures",'[]')]
[h:data.setData("addon:","pm.a5e.core","sb.CreatureSubtypes",'[]')]

[h:data.setData("addon:","pm.a5e.core","LanguageOptions",'{"Standard":1,"Exotic":1,"Monstrous":0,"Secret":0}')]
[h:data.setData("addon:","pm.a5e.core","LanguageSourcebooks",'{}')]
[h:data.setData("addon:","pm.a5e.core","AttributeSourcebooks",'{}')]
[h:data.setData("addon:","pm.a5e.core","BackgroundSourcebooks",'{}')]

[h:data.setData("addon:","pm.a5e.core","gd.Effects",'[]')]

[broadcast("First-time setup complete.")]
[h:"<!-- TODO: Add link to Gather Sourcebook Effects here since it cannot be called in on(First)Init in an addon -->"]