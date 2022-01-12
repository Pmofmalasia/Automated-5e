[h:abilityName = json.get(arg(0),"Name")]
[h:abilityClass = json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:pm.AllSpellInfo = arg(1)]

[h,if(pm.Tooltip == 1),CODE:{
	[h:pm.ChosenSpells=json.get(json.path.read(allAbilities,"[?(@.Name=='"+abilityName+"' && @.Class=='"+abilityClass+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['SpellList']"),0)]
};{
	[h:pm.SpellChoiceInput = "junkVar | -------------- Choose Your Spells -------------- | | LABEL | SPAN=TRUE"]
	[h:filterNum = 0]
	[h:spellNum = 0]
	[h:pm.CurrentSpellList=json.get(json.path.read(allAbilities,"[?(@.Name=='"+abilityName+"' && @.Class=='"+abilityClass+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['SpellList']"),0)]
	[h:pm.CurrentSpellPosition=0]

	[h:pm.AbilityAddSpellInput()]
	[h:abort(input(pm.SpellChoiceInput))]
	[h:pm.ChosenSpells = ""]

	[h,count(spellNum): pm.ChosenSpells = json.append(pm.ChosenSpells,eval("spell"+(roll.count+1)))]

	[h:allAbilities=json.path.set(allAbilities,"[?(@.Name=='"+abilityName+"' && @.Class=='"+abilityClass+"' && (@.Subclass=='"+pm.Subclass+"' || @.Subclass==''))]['SpellList']",pm.ChosenSpells)]
}]

[h:pm.SpellList = json.toList(pm.ChosenSpells,if(getLibProperty("VerticalFormat","Lib:pm.a5e.Core"),"<br>",", "))]

[h:macro.return = json.set("","ShowIfCondensed",1,"Header","Spell List","FalseHeader","","FullContents","","RulesContents",pm.SpellList,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value",pm.ChosenSpells,"Units","")]