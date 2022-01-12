[h:level.Sorcerer=json.get(LClass,"LScr")]

[h:leveling.Output=""]
[h:GroupSelect = "[]"]
[h:MaxHitDice = json.set(MaxHitDice,"1d6",json.get(MaxHitDice,"1d6")+1)]
[h: HitDice = json.set(HitDice,"1d6",json.get(HitDice,"1d6")+1)]
[h,if(Level==1),code:{
	[h:RolledMaxHP=6]
	[h:HP = MaxHP]
	[h:Saves=json.set(Saves,"sCon",1,"sCha",1)]
	[h:WeaponProficiencies=json.set(WeaponProficiencies,"Dagger",1,"Quarterstaff",1,"LightCrossbow",1,"Dart",1,"Sling",1)]
};{
	[h:HPIncrease=if(macro.args==0,4,eval("1d6"))]
	[h:RolledMaxHP=RolledMaxHP+HPIncrease]
	[h:HP = HP+HPIncrease+Con]
	[h:leveling.Output=leveling.output+"<br><b>HP Increase</b>: "+token.name+" has chosen "+if(macro.args==0,"to take the average","to roll")+" hit points and gained "+(HPIncrease+Con)+" hit points for a total of "+MaxHP+" Hit Points!"]
}]

[h:"<!-- Subclass Selection -->"]
[h,if(level.Sorcerer==1),CODE:{
	[h:pm.SubclassSelection("Sorcerer","Sorcerous Origin")]
};{}]

[h:"<!-- Ouput for display of passive abilities gained during the level up -->"]
[h:leveling.Output=leveling.Output+if(or(level.Sorcerer==10,level.Sorcerer==17),"<br><b>Metamagic</b>: You gain another Metamagic option of your choice.","")]
[h:leveling.Output=leveling.Output+if(level.Sorcerer==20,"<br><b>Sorcerous Restoration</b>: You regain 4 expended sorcery points whenever you finish a short rest.","")]
[h:leveling.Output=leveling.Output+if(or(level.Sorcerer==4,level.Sorcerer==10),"<br><b>Cantrips</b>: You learn an additional cantrip from the Sorcerer spell list.","")]

[h:"<!-- Adds names of buttons to a list to be added later -->"]
[h:lu.AddedButtons = "[]"]
[h:lu.AddedButtons = if(level.Sorcerer==2,json.append(lu.AddedButtons,json.set("","Name","Create Sorcery Points","CastTime","BONUS","Marker","","Library","PHB")),lu.AddedButtons)]
[h:lu.AddedButtons = if(level.Sorcerer==2,json.append(lu.AddedButtons,json.set("","Name","Create Spell Slots","CastTime","BONUS","Marker","","Library","PHB")),lu.AddedButtons)]
[h:lu.AddedButtons = if(level.Sorcerer==3,json.append(lu.AddedButtons,json.set("","Name","Metamagic","CastTime","","Marker","","Library","PHB")),lu.AddedButtons)]

[h:"<!-- Adds spells to the list of macro groups to copy macros from -->"]
[h:GroupSelect = if(level.Sorcerer==1,json.append(GroupSelect,"Spells - Cantrips"),GroupSelect)]
[h:GroupSelect = if(level.Sorcerer==1,json.append(GroupSelect,"Spells - 1st Level"),GroupSelect)]
[h:GroupSelect = if(level.Sorcerer==3,json.append(GroupSelect,"Spells - 2nd Level"),GroupSelect)]
[h:GroupSelect = if(level.Sorcerer==5,json.append(GroupSelect,"Spells - 3rd Level"),GroupSelect)]
[h:GroupSelect = if(level.Sorcerer==7,json.append(GroupSelect,"Spells - 4th Level"),GroupSelect)]
[h:GroupSelect = if(level.Sorcerer==9,json.append(GroupSelect,"Spells - 5th Level"),GroupSelect)]
[h:GroupSelect = if(level.Sorcerer==11,json.append(GroupSelect,"Spells - 6th Level"),GroupSelect)]
[h:GroupSelect = if(level.Sorcerer==13,json.append(GroupSelect,"Spells - 7th Level"),GroupSelect)]
[h:GroupSelect = if(level.Sorcerer==15,json.append(GroupSelect,"Spells - 8th Level"),GroupSelect)]
[h:GroupSelect = if(level.Sorcerer==17,json.append(GroupSelect,"Spells - 9th Level"),GroupSelect)]

[h:"<!-- Adds each ability to the list of abilities -->"]
[h:allAbilities=if(level.Sorcerer==1,json.append(allAbilities,json.set("","Name","Spellcasting","Class","Sorcerer","Level",1,"Library","PHB","CallSpellClass",1,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None")),allAbilities)]
[h:allAbilities = if(level.Sorcerer==2,json.append(allAbilities,json.set("","Name","Font of Magic","Class","Sorcerer","Level",2,"Resource",2,"MaxResource","[r:json.path.read(allAbilities,"+'"'+"[?(@.Name=='FontofMagic')]['Level']"+'"'+")]","RestoreLongRest",1,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None")),allAbilities)]
[h:allAbilities = if(level.Sorcerer==2,json.append(allAbilities,json.set("","Name","Flexible Casting","Class","Sorcerer","Level",2,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None")),allAbilities)]
[h:allAbilities = if(level.Sorcerer==3,json.append(allAbilities,json.set("","Name","Metamagic","Class","Sorcerer","Level",3,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None")),allAbilities)]
[h:allAbilities = if(level.Sorcerer==20,json.append(allAbilities,json.set("","Name","Sorcerous Restoration","Class","Sorcerer","Level",20,"CallShortRest",1,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None")),allAbilities)]

[h:"<!-- Choosing proficiencies at level 1 -->"]
[h,if(level.Sorcerer==1 && Level==1),CODE:{
	[h:SkillSelectData = json.set("","sStr",0,"sDex",0,"sCon",0,"sInt",0,"sWis",0,"sCha",0,"Acb",0,"AnH",0,"Arc",1,"Ath",0,"Dcp",1,"Hst",0,"Ins",1,"Imd",1,"Inv",0,"Med",0,"Ntr",0,"Pcp",0,"Pfm",0,"Prs",1,"Rlg",1,"SoH",0,"Stl",0,"Srv",0,"ArT",0,"DsK",0,"FgK",0,"GmS",0,"HbK",0,"MsI",0,"NgT",0,"PsK",0,"TvT",0,"VLd",0,"VWt",0,"SkillsAvailable","Two Skills")]

	[MACRO("Skill Selection@Lib:pm.a5e.Core"): SkillSelectData]
};{}]

[h:"<!-- Repeat of previous but for the subclasses -->"]
[h,if(json.get(Subclasses,"Sorcerer")=="Draconic Bloodline"),CODE:{
	[h:leveling.Output=leveling.Output+if(level.Sorcerer==1,"<br><b>Dragon Ancestor</b>: You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check.","")]
	[h:leveling.Output=leveling.Output+if(level.Sorcerer==1,"<br><b>Draconic Resilience</b>: Your hit point maximum increases by 1 for each level in this class. Additionally, parts of your skin are covered by a thin sheen of dragon-like scales. When you aren't wearing armor, your AC equals 13 + your Dexterity modifier.","")]

	[h:lu.AddedButtons = if(level.Sorcerer==14,json.append(lu.AddedButtons,json.set("","Name","Dragon Wings","CastTime","BONUS","Marker","","Library","PHB")),lu.AddedButtons)]
	[h:lu.AddedButtons = if(level.Sorcerer==18,json.append(lu.AddedButtons,json.set("","Name","Draconic Presence","CastTime","Action","Marker","","Library","PHB")),lu.AddedButtons)]

	[h,if(level.Sorcerer==1),CODE:{
		[h:BloodlineList="Black,Blue,Brass,Bronze,Copper,Gold,Green,Red,Silver,White"]
		[h:abort(input(
			"BloodlineSelection|"+BloodlineList+"|Choose your Bloodline|LIST|VALUE=STRING"
			))]
		[h:allAbilities = json.append(allAbilities,json.set("","Name","Dragon Ancestor","Class","Sorcerer","Level",1,"StoredValue",BloodlineSelection,"CallAfterCheck",1,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None"))]
		[h:allAbilities json.append(allAbilities,json.set("","Name","Draconic Resilience","Class","Sorcerer","Level",1,"CallMaxHPBonus",1,"CallACSet",1,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None"))]
	};{}]
	[h:allAbilities = if(level.Sorcerer==6,json.append(allAbilities,json.set("","Name","Elemental Affinity","Class","Sorcerer","Level",6,"CallSpellDamage",1,"CallCantripDamage",1,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None")),allAbilities)]
	[h:allAbilities = if(level.Sorcerer==14,json.append(allAbilities,json.set("","Name","Dragon Wings","Class","Sorcerer","Level",14,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None")),allAbilities)]
	[h:allAbilities = if(level.Sorcerer==18,json.append(allAbilities,json.set("","Name","Draconic Presence","Class","Sorcerer","Level",18,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None")),allAbilities)]
};{}]

[h,if(json.get(Subclasses,"Sorcerer")=="Wild Magic"),CODE:{
	[h:leveling.Output=leveling.Output+if(level.Sorcerer==14,"<br><b>Controlled Chaos</b>: Whenever you roll on the Wild Magic Surge table, you can roll twice and use either number.","")]
	[h:leveling.Output=leveling.Output+if(level.Sorcerer==18,"<br><b>Spell Bombardment</b>: When you roll damage for a spell and roll the highest number possible on any of the dice, choose one of those dice, roll it again, and add that roll to the damage. You can use this feature only once per turn.","")]

	[h:lu.AddedButtons = if(level.Sorcerer==1,json.append(lu.AddedButtons,json.set("","Name","Wild Magic Surge","CastTime","","Marker","","Library","PHB")),lu.AddedButtons)]
	[h:lu.AddedButtons = if(level.Sorcerer==6,json.append(lu.AddedButtons,json.set("","Name","Bend Luck","CastTime","REACTION","Marker","","Library","PHB")),lu.AddedButtons)]

	[h:allAbilities = if(level.Sorcerer==1,json.append(allAbilities,json.set("","Name","Wild Magic Surge","Class","Sorcerer","Level",1,"CallAfterSpell",1,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None")),allAbilities)]
	[h:allAbilities = if(level.Sorcerer==1,json.append(allAbilities,json.set("","Name","Tides of Chaos","Class","Sorcerer","Level",1,"Resource",1,"MaxResource","1","RestoreLongRest",1,"CallAfterAttack",1,"CallAfterSave",1,"CallAfterCheck",1,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None")),allAbilities)]
	[h:allAbilities = if(level.Sorcerer==6,json.append(allAbilities,json.set("","Name","Bend Luck","Class","Sorcerer","Level",6,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None")),allAbilities)]
	[h:allAbilities = if(level.Sorcerer==14,json.append(allAbilities,json.set("","Name","Controlled Chaos","Class","Sorcerer","Level",14,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None")),allAbilities)]
	[h:allAbilities = if(level.Sorcerer==18,json.append(allAbilities,json.set("","Name","Spell Bombardment","Class","Sorcerer","Level",18,"CallAfterCantrip",1,"CallAfterSpell",1,"CallSpellRoll",1,"IsDisplayed",1,"IsActive",1,"MagicItemLink","None")),allAbilities)]
};{}]

[h:allAbilities = json.path.set(allAbilities,"[?(@.Class=='Sorcerer' && @.MagicItemLink=='None')]['Level']",level.Sorcerer)]

[h:"<!-- For adding spells from the repository token -->"]
[h:SendForMacros = json.set("","Groups",GroupSelect,"Class","Sorcerer")]
[MACRO("Add Macro Groups@Lib:pm.a5e.Core"):SendForMacros]

[h:"<!-- For adding class abilities made from scratch -->"]
[h:SendForMacros = json.set("","AbilityList",lu.AddedButtons,"Class","Sorcerer")]
[MACRO("Create Player Class Macro@Lib:pm.a5e.Core"):SendForMacros]

[h,if(or(level.Sorcerer == 4,level.Sorcerer == 8,level.Sorcerer == 12,level.Sorcerer == 16,level.Sorcerer == 19)),CODE:{
	[macro("Ability Score Increase@Lib:pm.a5e.Core"):""]
};{}]

[h:macro.return = leveling.Output]