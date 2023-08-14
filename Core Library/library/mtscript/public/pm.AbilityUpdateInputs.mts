[h:ab.CurrentLevel = arg(0)]
[h:ab.Updates = arg(1)]
[h:ab.Name = json.get(ab.Updates,"Name")]
[h:ab.Class = json.get(ab.Updates,"Class")]
[h:ab.Subclass = json.get(ab.Updates,"Subclass")]
[h:ab.Final = json.get(ab.Updates,ab.CurrentLevel)]
[h:abort(input(
	" junkVar | ------------ Enter changes to "+json.get(ab.Updates,"DisplayName")+" at level "+ab.CurrentLevel+". Mark new effects only. ------------ |  | LABEL | SPAN=TRUE ",
	" ab.Attributes | No,By Choice,Preset,Some of Both | Affects ability scores | LIST ",
	" ab.SkillProficiencies | No,By Choice,Preset,Some of Both | Affects skill proficiencies | LIST ",
	" ab.SaveProficiencies | No,By Choice,Preset,Some of Both | Affects save proficiencies | LIST ",
	" ab.WeaponProficiencies | No,By Choice,Preset,Some of Both | Affects weapon proficiencies | LIST ",
	" ab.ArmorProficiencies | No,By Choice,Preset,Some of Both | Affects armor proficiencies | LIST ",	" ab.MiscProficiencies | 0 | <html><span title='Non-Permanent Proficiency or Effects not granting Expertise/Proficiency (e.g. Jack of All Trades)'>Affects Proficiencies in Some Other Way</span></html> | CHECK ",
	" ab.PassiveScore | 0 | Affects passive abilities | LIST ",
	" junkVar | ---------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" ab.AtrOther | 0 | <html><span title='For things that set a score to a certain value, raise the stat cap, or give a bonus conditionally'>Affects Ability Scores - Not Flat Bonuses</span></html> | CHECK ",
	" ab.AC | 0 | Affects AC | CHECK ",
	" ab.HP | 0 | Affects Max HP | CHECK ",
	" ab.DamageMod | 0 | Affects damage modifiers (e.g. Resistances) | CHECK ",
	" ab.CondImmun | 0 | Affects condition immunities | CHECK ",
	" ab.Speed | 0 | Affects movement speed | CHECK ",
	" ab.Languages | 0 | Affects languages known | CHECK ",
	" ab.Senses | 0 | Affects senses | CHECK ",
	" junkVar | ---------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" ab.Check | 0 | Affects checks | CHECK ",
	" ab.Save | 0 | Affects saves | CHECK ",
	" ab.Init | 0 | Affects initiative | CHECK ",
	" ab.Conc | 0 | Affects concentration | CHECK ",
	" ab.Death | 0 | Affects death saves | CHECK ",
	" junkVar | ---------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" ab.Attacks | 0 | Affects weapon attacks | CHECK ",
	" ab.Spells | 0 | Affects spells | CHECK ",
	" ab.Abilities | 0 | Affects other abilities | CHECK ",
	" junkVar | ---------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" ab.Damaged | 0 | Effect triggers when damaged | CHECK ",
	" ab.CondGain | 0 | Effect triggers when gaining a condition | CHECK ",
	" ab.Rest | 0 | Effect triggers after rests | CHECK ",
	" ab.HitDie | 0 | Effect triggers after spending Hit Dice | CHECK ",
	" ab.StartTurn | 0 | Effect triggers on start of turn | CHECK ",
	" ab.EndTurn | 0 | Effect triggers on end of turn | CHECK ",
	" junkVar | ---------------------------------------------------------------------- | 0 | LABEL | SPAN=TRUE ",
	" ab.Button | 0 | <html><span title='Things that have their own action/reaction like granting Bardic Inspiration, going into a rage, etc. Can also be used for passive abilities that do not have a mechanical trigger that is feasible to program, like the Fighter Maneuver - Evasive Footwork'>Ability can be used independently of the above</span></html> | CHECK "
	))]

[h,if(ab.Attributes==1 || ab.Attributes==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"AttributeOptions",pm.AttributeSelectionChoices())]
};{}]

[h,if(ab.Attributes==2 || ab.Attributes==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"Attributes",pm.AttributeSelectionPreset())]
};{}]

[h,if(ab.AtrOther),CODE:{
	[h:abort(input(
		" junkVar | Choose aspects of attributes affected | 0 | LABEL | SPAN=TRUE ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.StrSet | 0 | Sets Strength Score | CHECK ",
		" ab.DexSet | 0 | Sets Dexterity Score | CHECK ",
		" ab.ConSet | 0 | Sets Constitution Score | CHECK ",
		" ab.IntSet | 0 | Sets Intelligence Score | CHECK ",
		" ab.WisSet | 0 | Sets Wisdom Score | CHECK ",
		" ab.ChaSet | 0 | Sets Charisma Score | CHECK ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.StrBonus | 0 | Gives Strength Score Bonus | CHECK ",
		" ab.DexBonus | 0 | Gives Dexterity Score Bonus | CHECK ",
		" ab.ConBonus | 0 | Gives Constitution Score Bonus | CHECK ",
		" ab.IntBonus | 0 | Gives Intelligence Score Bonus | CHECK ",
		" ab.WisBonus | 0 | Gives Wisdom Score Bonus | CHECK ",
		" ab.ChaBonus | 0 | Gives Charisma Score Bonus | CHECK ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.StrMax | 0 | Increases Strength Score Maximum | CHECK ",
		" ab.DexMax | 0 | Increases Dexterity Score Maximum | CHECK ",
		" ab.ConMax | 0 | Increases Constitution Score Maximum | CHECK ",
		" ab.IntMax | 0 | Increases Intelligence Score Maximum | CHECK ",
		" ab.WisMax | 0 | Increases Wisdom Score Maximum | CHECK ",
		" ab.ChaMax | 0 | Increases Charisma Score Maximum | CHECK "
		))]

	[h:ab.Final = json.set(ab.Final,
		"CallStrSet",ab.StrSet,
		"CallDexSet",ab.DexSet,
		"CallConSet",ab.ConSet,
		"CallIntSet",ab.IntSet,
		"CallWisSet",ab.WisSet,
		"CallChaSet",ab.ChaSet,
		"CallStrBonus",ab.IntBonus,
		"CallDexBonus",ab.IntBonus,
		"CallConBonus",ab.IntBonus,
		"CallIntBonus",ab.IntBonus,
		"CallWisBonus",ab.WisBonus,
		"CallChaBonus",ab.ChaBonus,
		"CallStrMax",ab.StrMax,
		"CallDexMax",ab.DexMax,
		"CallConMax",ab.ConMax,
		"CallIntMax",ab.IntMax,
		"CallWisMax",ab.WisMax,
		"CallChaMax",ab.ChaMax
	)]
};{}]

[h,if(ab.SkillProficiencies==1 || ab.SkillProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"SkillOptions",pm.SkillSelectionChoices())]
};{}]
	
[h,if(ab.SkillProficiencies==2 || ab.SkillProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"Skills",pm.SkillSelectionPreset())]
}]

[h,if(ab.SaveProficiencies==1 || ab.SaveProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"SaveOptions",pm.SaveSelectionChoices())]
};{}]

[h,if(ab.SaveProficiencies==2 || ab.SaveProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"Saves",pm.SaveSelectionPreset())]
}]

[h,if(ab.WeaponProficiencies==1 || ab.WeaponProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"WeaponOptions",pm.WeaponSelectionChoices())]
};{}]

[h,if(ab.WeaponProficiencies==2 || ab.WeaponProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"Weapons",pm.WeaponSelectionPreset())]
};{}]

[h,if(ab.ArmorProficiencies==1 || ab.WeaponProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"ArmorOptions",pm.ArmorSelectionChoices())]
};{}]

[h,if(ab.ArmorProficiencies==2 || ab.WeaponProficiencies==3),CODE:{
	[h:ab.Final = json.set(ab.Final,"Armor",pm.ArmorSelectionPreset())]
};{}]

[h,if(ab.MiscProficiencies),CODE:{
	[h:abort(input(
		" junkVar | Instances Where Proficiency is Indirectly Affected | 0 | LABEL | SPAN=TRUE ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.SaveMisc | 0 | Affects Save Proficiencies | CHECK ",
		" ab.CheckMisc | 0 | Affects Check Proficiencies | CHECK ",
		" ab.DeathMisc | 0 | Affects Death Save Proficiency | CHECK ",
		" ab.InitMisc | 0 | Affects Initiative Proficiency | CHECK ",
		" ab.ConcMisc | 0 | Affects Concentration Save Proficiency | CHECK ",
		" ab.WeaponMisc | 0 | Affects Weapon Proficiencies | CHECK ",
		" ab.ArmorMisc | 0 | Affects Armor Proficiencies | CHECK "
		)]
		[h:ab.Final = json.set(ab.Final,
		"CallSaveProf",ab.SaveMisc,
		"CallCheckProf",ab.CheckMisc,
		"CallDeathProf",ab.DeathMisc,
		"CallInitProf",ab.InitMisc,
		"CallConcProf",ab.ConcMisc,
		"CallWeaponProf",ab.WeaponMisc,
		"CallArmorProf",ab.ArmorMisc
		)]
};{}]

[h,if(ab.PassiveScore),CODE:{
[h:abort(input(
	" junkVar | Choose passive ability scores affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.PassIns | 0 | Gives Passive Insight Bonus | CHECK ",
	" ab.PassInv | 0 | Gives Passive Investigation Bonus | CHECK ",
	" ab.PassPcp | 0 | Gives Passive Perception Bonus | CHECK "
))]

[h:ab.Final = json.set(ab.Final,
	"CallPassiveIns",ab.PassIns,
	"CallPassiveInv",ab.PassInv,
	"CallPassivePcp",ab.PassPcp
	)]
};{}]

[h,if(ab.AC),CODE:{
[h:abort(input(
	" junkVar | Choose how AC is affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.ACBonus | 0 | Grants Bonus to AC | CHECK ",
	" ab.ACSet | 0 | Sets Base AC | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallSetAC",ab.ACBonus,
	"CallACBonus",ab.ACSet
)]
};{}]

[h,if(ab.HP),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of Max HP affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.HPMaxBonus | 0 | Grants Bonus to Maximum HP | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallMaxHPBonus",ab.HPMaxBonus
)]
};{}]

[h,if(ab.DamageMod),CODE:{
[h:abort(input(
	" junkVar | Choose damage modifiers affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.Vuln | 0 | Grants Damage Vulnerability | CHECK ",
	" ab.Res | 0 | Grants Damage Resistance | CHECK ",
	" ab.Immun | 0 | Grants Damage Immunity | CHECK ",
	" ab.Absorb | 0 | Grants Damage Absorption | CHECK ",
	" ab.DR | 0 | Grants Damage Reduction (DR) | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallVuln",ab.Vuln,
	"CallRes",ab.Res,
	"CallImmun",ab.Immun,
	"CallAbsorb",ab.Absorb,
	"CallDR",ab.DR
)]
};{}]

[h,if(ab.CondImmun),CODE:{
[h:ab.Final = json.set(ab.Final,
	"CallCondImmun",1
)]
};{}]

[h,if(ab.Speed),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of attributes affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.SpeedBonus | 0 | Grants Bonus to Speed | CHECK ",
	" ab.SpeedSet | 0 | Sets Base Speed | CHECK ",
	" ab.BurrowBonus | 0 | Grants Bonus to Burrowing Speed | CHECK ",
	" ab.BurrowSet | 0 | Sets Base Burrowing Speed | CHECK ",
	" ab.ClimbBonus | 0 | Grants Bonus to Climbing Speed | CHECK ",
	" ab.ClimbSet | 0 | Sets Base Climbing Speed | CHECK ",
	" ab.FlyBonus | 0 | Grants Bonus to Flying Speed | CHECK ",
	" ab.FlySet | 0 | Sets Base Flying Speed | CHECK ",
	" ab.SwimBonus | 0 | Grants Bonus to Swimming Speed | CHECK ",
	" ab.SwimSet | 0 | Sets Base Swimming Speed | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallSpeedSet",ab.SpeedBonus,
	"CallSpeedBonus",ab.SpeedSet,
	"CallBurrowSet",ab.BurrowBonus,
	"CallBurrowBonus",ab.BurrowSet,
	"CallClimbSet",ab.ClimbBonus,
	"CallClimbBonus",ab.ClimbSet,
	"CallFlySet",ab.FlyBonus,
	"CallFlyBonus",ab.FlySet,
	"CallSwimSet",ab.SwimBonus,
	"CallSwimBonus",ab.SwimSet
)]
};{}]

[h,if(ab.Languages),CODE:{
	[h:ab.Final = json.set(ab.Final,
		"CallLanguages",1
	)]
	[h:ab.Final = json.merge(ab.Final,pm.LanguageChoices())]
};{}]

[h,if(ab.Senses),CODE:{
[h:ab.Final = json.set(ab.Final,
	"CallSenses",1
)]
};{}]

[h,if(ab.Check),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of checks affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.CheckAdv | 0 | Grants (Dis)Advantage on Checks | CHECK ",
	" ab.CheckBonus | 0 | Grants Bonus to Checks | CHECK ",
	" ab.CheckProf | 0 | <html><span title='Non-Permanent Effects or Effects not granting Expertise/Proficiency (e.g. Jack of All Trades)'>Affects Proficiency of Checks</span></html> | CHECK ",
	" ab.CheckMsg | 0 | <html><span title='Use for misc effects that occur after a check, or situational bonuses that the program is unable to determine (e.g. History checks about stone)'>Shows Message Following Checks</span></html> | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallCheckAdv",ab.CheckAdv,
	"CallCheckBonus",ab.CheckBonus,
	"CallCheckProf",ab.CheckProf,
	"CallAfterCheck",ab.CheckMsg
)]
};{}]

[h,if(ab.Save),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of Saves affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.SaveAdv | 0 | Grants (Dis)Advantage on Saves | CHECK ",
	" ab.SaveBonus | 0 | Grants Bonus to Saves | CHECK ",
	" ab.SaveProf | 0 | <html><span title='Non-Permanent Effects or Effects not granting Expertise/Proficiency (e.g. Jack of All Trades)'>Affects Proficiency of Saves</span></html> | CHECK ",
	" ab.SaveMsg | 0 | <html><span title='Use for misc effects that occur after a check, or situational bonuses that the program is unable to determine (e.g. History checks about stone)'>Shows Message Following Saves</span></html> | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallSaveAdv",ab.SaveAdv,
	"CallSaveBonus",ab.SaveBonus,
	"CallSaveProf",ab.SaveProf,
	"CallAfterSave",ab.SaveMsg
)]
};{}]

[h,if(ab.Init),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of checks affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.InitAdv | 0 | Grants (Dis)Advantage on Initiative | CHECK ",
	" ab.InitBonus | 0 | Grants Bonus to Initiative | CHECK ",
	" ab.InitProf | 0 | <html><span title='Non-Permanent Effects or Effects not granting Expertise/Proficiency (e.g. Jack of All Trades)'>Affects Initiative Proficiency</span></html> | CHECK ",
	" ab.InitMsg | 0 | <html><span title='Use for misc effects that occur after initiative, or situational bonuses that the program is unable to determine (e.g. History checks about stone)'>Shows Message Following Initiative</span></html> | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallInitAdv",ab.InitAdv,
	"CallInitBonus",ab.InitBonus,
	"CallInitProf",ab.InitProf,
	"CallAfterInit",ab.InitMsg
)]
};{}]

[h,if(ab.Conc),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of concentration saves affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.ConcAdv | 0 | Grants (Dis)Advantage on Concentration Saves | CHECK ",
	" ab.ConcBonus | 0 | Grants Bonus to Concentration Saves | CHECK ",
	" ab.ConcProf | 0 | <html><span title='Non-Permanent Effects or Effects not granting Expertise/Proficiency (e.g. Jack of All Trades)'>Affects Proficiency of Concentration Saves</span></html> | CHECK ",
	" ab.ConcMsg | 0 | <html><span title='Use for misc effects that occur after a check, or situational bonuses that the program is unable to determine (e.g. History checks about stone)'>Shows Message Following Concentration Saves</span></html> | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallConcAdv",ab.ConcAdv,
	"CallConcBonus",ab.ConcBonus,
	"CallConcProf",ab.ConcProf,
	"CallAfterConc",ab.ConcMsg
)]
};{}]

[h,if(ab.Death),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of death saves affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.DeathAdv | 0 | Grants (Dis)Advantage on Death Saves | CHECK ",
	" ab.DeathBonus | 0 | Grants Bonus to Death Saves | CHECK ",
	" ab.DeathProf | 0 | <html><span title='Non-Permanent Effects or Effects not granting Expertise/Proficiency (e.g. Jack of All Trades)'>Affects Proficiency of Death Saves</span></html> | CHECK ",
	" ab.DeathMsg | 0 | <html><span title='Use for misc effects that occur after a check, or situational bonuses that the program is unable to determine (e.g. History checks about stone)'>Shows Message Following Death Saves</span></html> | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallDeathAdv",ab.DeathAdv,
	"CallDeathBonus",ab.DeathBonus,
	"CallDeathProf",ab.DeathProf,
	"CallAfterDeath",ab.DeathMsg
)]
};{}]

[h,if(ab.Attacks),CODE:{
[h:abort(input(
	" junkVar | Choose aspects of weapon attacks affected | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.AttackAdv | 0 | Grants (Dis)Advantage on Weapon Attacks | CHECK ",
	" ab.AttackBonus | 0 | Grants Bonus to Weapon Attack Rolls | CHECK ",
	" ab.AttackStat | 0 | Modifies Weapon Attack Primary Stat | CHECK ",
	" ab.AttackCritThresh | 0 | Affects Critical Hit Threshhold | CHECK ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.AttackNumber | 0 | <html><span title='Specifically for effects like Extra Attack - Does not apply to effects that let you make an attack as a bonus action, etc.'>Increases number of attacks granted by the Attack action</span></html> | CHECK ",
	" ab.AttackProps | 0 | <html><span title='Making weapons count as magical, count as monk weapons, etc.'>Modifies properties of weapons</span></html> | CHECK ",	" ab.AttackOptions | 0 | <html><span title='e.g. Feat - Great Weapons Master'>Has an optional effect which must be chosen when cast</span></html>| CHECK ",
	" ab.AttackRange | 0 | Affects range or reach of the attack | CHECK ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.AttackDamage | 0 | <html><span title='Use for effects that grant a damage type based on the weapon used. For effects that grant damage independent of the weapons damage type, use effect after attack or after each attack (whichever is appropriate)'>Grants Flat Bonus to Weapon Damage</span></html> | CHECK ",
	" ab.AttackRoll | 0 | <html><span title='Effects that change the value of the die, adding dice to the roll, using max damage, etc. (e.g. Great Weapon Fighting rerolling 1s and 2s, Barbarian - Brutal Critical, Tempest Cleric - Destructive Wrath)'>Modifies dice rolled for weapon damage</span></html> | CHECK ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.AfterAttack | 0 | <html><span title='Catch-all for effects that operate independently of the weapon damage itself. Can deal damage, force saving throws, force a condition upon an enemy, just display a message, and more. (e.g. Cleric - Divine Strike, Assassin - Death Strike, Eldritch Knight - Eldritch Strike, and Tempest Cleric - Thunderbolt Strike, respectively)'>Effect occurs after attacks</span></html> | CHECK ",
	" ab.AfterEachAttack | 0 | <html><span title='Same as above, but triggers on every attack instead of once per turn.'>Effect occurs after every attack</span></html> | CHECK ",
	" ab.AttackCrit | 0 | <html><span title='Same as above, but triggers only on critical hits.'>Effect occurs after critical hits</span></html> | CHECK "
))]
[h:ab.Final = json.set(ab.Final,
	"CallAttackAdv",ab.AttackAdv,
	"CallAttackBonus",ab.AttackBonus,
	"CallAttackStat",ab.AttackStat,
	"CallAttackCritThresh",ab.AttackCritThresh,
	"CallAttackNum",ab.AttackNumber,
	"CallAttackProps",ab.AttackProps,
	"CallAttackOptions",ab.AttackOptions,
	"CallAttackRange",ab.AttackRange,
	"CallAttackDamage",ab.AttackDamage,
	"CallAttackRoll",ab.AttackRoll,
	"CallAfterAttack",ab.AfterAttack,
	"CallAfterEachAttack",ab.AfterEachAttack,
	"CallAttackCrit",ab.AttackCrit
)]
};{}]

[h,if(ab.Spells),CODE:{
	[h:abort(input(
		" junkVar | Choose aspects of spells affected | 0 | LABEL | SPAN=TRUE ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",

		" ab.SpellClass | No,Chosen on Level Up,Chosen through Button | <html><span title='Intended for abilities like Domain spells or Arcane Trickster. Effects that use their own resources and cannot use spell slots are intended to operate through a separate mechanism (e.g. NOT for Monk - Way of the Four Elements)'>Allows hardcast use of spells from outside of the regular class list</span></html> | CHECK ",	" ab.SpellParams | 0 | <html><span title='e.g. Duration, range, components, but can also extend to things like if a spell deals half damage on a successful save (Evocation Wizard - Potent Cantrip)'>Affects general parameters of the spell </span></html>| LIST ",
		" ab.SpellOptions | 0 | <html><span title='e.g. Evocation Wizard - Overchannel, Sorcerer - Metamagic'>Has an optional effect which must be chosen when cast</span></html>| CHECK ",
		" ab.SpellStat | 0 | Modifies Spell Primary Stat | CHECK ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.SpellAdv | 0 | Grants (Dis)Advantage on Spell Attacks | CHECK ",
		" ab.SpellBonus | 0 | Grants Bonus to Spell Attack Rolls | CHECK ",
		" ab.SpellCritThresh | 0 | Affects Spell Critical Hit Threshhold | CHECK ",
		" ab.SpellCrit | 0 | <html><span title='See &#39;Event occurs after spells&#39; below, but triggers only on critical hits.'>Effect occurs after critical hits</span></html> | CHECK ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.SpellDamage | 0 | <html><span title='Use for effects that grant a damage bonus based on the damage of the spell. (e.g. Cleric - Disciple of Life, Potent Spellcasting) For effects that grant damage independent of the spell&#39;s damage type, use effect after attack or after each attack (whichever is appropriate)'>Grants Flat Bonus to Spell Damage or Healing</span></html> | CHECK ",
		" ab.SpellRoll | 0 | <html><span title='Effects that change the value of the die, adding dice to the roll, using max damage, etc. (e.g. Elemental Adept feat setting 1s to 2s, Life Cleric - Supreme Healing)'>Modifies dice rolled for weapon damage</span></html> | CHECK ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.AfterSpell | 0 | <html><span title='Catch-all for effects that operate independently of the spell itself. Can deal damage, force saving throws, force a condition upon an enemy, just display a message, and more. Can still have conditions for types of spells they are triggered by. (e.g. Cleric - Divine Strike, Enchantment Wizard - Alter Memories, Cant find a PHB example, and Eldritch Knight - War Magic, respectively)'>Effect occurs after attacks</span></html> | CHECK "
	))]
	[h:ab.Final = json.set(ab.Final,
		"CallSpellParams",ab.SpellParams,
		"CallSpellOptions",ab.SpellOptions,
		"CallSpellStat",ab.SpellStat,
		"CallSpellAdv",ab.SpellAdv,
		"CallSpellBonus",ab.SpellBonus,
		"CallSpellCritThresh",ab.SpellCritThresh,
		"CallSpellCrit",ab.SpellCrit
		"CallSpellDamage",ab.SpellDamage,
		"CallSpellRoll",ab.SpellRoll,
		"CallAfterSpell",ab.AfterSpell
	)]
};{
	[h:ab.SpellClass=0]
}]

[h,if(ab.SpellClass>0),CODE:{
	[h:ab.SpellList = ""]
	[h:ab.disCurrentSpells = ""]
	[h,while(ab.SpellClass==1),CODE:{
		[h:ab.disCurrentSpellsBars = if(ab.SpellList=="",""," junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ")]		
		[h:abort(input(
			" ab.TempSpellName | -- Spell Name Here -- | Enter name of spell added to list ",
			ab.disCurrentSpellsBars,
			ab.disCurrentSpells,
			ab.disCurrentSpellsBars,
			" ab.SpellClass | 1 | Add another spell | CHECK "
		))]
		[h:ab.SpellList = json.append(ab.SpellList,pm.RemoveSpecial(ab.TempSpellName))]
		[h:ab.disCurrentSpells = listAppend(ab.disCurrentSpells," junkVar | "+ab.TempSpellName+" |  | LABEL | SPAN = TRUE ","##")]
	}]
	[h:ab.Final = json.set(ab.Final,"SpellList",ab.SpellList,"CallSpellClass",1)]
};{}]

[h,if(ab.Damaged),CODE:{
	[h:abort(input(
		" junkVar | Choose triggers for an ability after taking damage | 0 | LABEL | SPAN=TRUE ",
		" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
		" ab.AfterDamage | 0 | Triggers after taking damage | CHECK ",
		" ab.TempHPLost | 0 | <html><span title='Mostly for abilities that end when Temp HP is lost'>Triggers when losing all Temporary Hit Points</span></html> | CHECK "
	))]
	[h:ab.Final = json.set(ab.Final,
		"CallAfterDamaged",ab.AfterDamage,
		"CallTempHPLost",ab.TempHPLost
	)]
};{}]

[h,if(ab.Rest),CODE:{
[h:abort(input(
	" junkVar | Choose triggers for an ability after resting | 0 | LABEL | SPAN=TRUE ",
	" junkVar | ------------------------------------------------------------ | 0 | LABEL | SPAN=TRUE ",
	" ab.AfterShort | 0 | Triggers after short rests | CHECK ",
	" ab.AfterLong | 0 | Triggers after long rests | CHECK "
))]
	[h:ab.Final = json.set(ab.Final,
		"CallShortRest",ab.AfterShort,
		"CallLongRest",ab.AfterLong
	)]
};{}]

[h,if(ab.HitDie),CODE:{
	[h:ab.Final = json.set(ab.Final,
		"CallHitDieSpend",1
	)]
};{}]

[h,if(ab.StartTurn),CODE:{
	[h:ab.Final = json.set(ab.Final,
		"CallStartTurn",1
	)]
};{}]

[h,if(ab.EndTurn),CODE:{
	[h:ab.Final = json.set(ab.Final,
		"CallEndTurn",1
	)]
};{}]

[h,if(ab.CondGain),CODE:{
	[h:ab.Final = json.set(ab.Final,
		"CallCondGain",1
	)]
};{}]

[h,if(ab.Button),CODE:{
	[h:ab.MoreButtons = 1]
	[h:ab.NewButtons = ""]
	[h,while(ab.MoreButtons==1),CODE:{
		[h:abort(input(
	" ab.ButtonName | -- Name Here -- | Input Name of Button ",	" ab.CastTime | Action,BONUS,REACTION,1 MIN,10 MIN, 1 HOUR, 8 HOURS,None,Custom | Enter casting time for display on the button | LIST | VALUE=STRING ",
			"ab.Marker | -- Ignore/Blank for None -- | Enter marker for button group if desired ",
			"ab.MoreButtons |  | Add an additional button | CHECK "
			))]
		[h:abort(input(if(ab.CastTime=="Custom"," ab.CastTime |  | Enter custom casting time ","")))]
		[h:ab.Marker = if(ab.Marker=="-- Ignore/Blank for None --","",ab.Marker)]
		[h:ab.NewButtons = json.append(ab.NewButtons,json.set("","UseTime",if(ab.CastTime=="None","",ab.CastTime),"Marker",ab.Marker,"Class",json.get(ab.Final,"Class"),"Subclass",json.get(ab.Final,"Subclass"),"Name",pm.RemoveSpecial(ab.ButtonName),"DisplayName",ab.ButtonName,"Library",ab.SourceLib))]
	}]
	[h:ab.Final = json.set(ab.Final,"ButtonInfo",ab.NewButtons)]
};{}]

[h:macro.return = ab.Final]