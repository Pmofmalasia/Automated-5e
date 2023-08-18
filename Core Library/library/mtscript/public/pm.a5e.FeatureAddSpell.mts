[h:"<!-- Likely replaced by the general spell prep/knowledge macros -->"]
[h:pm.AllSpellInfo = arg(1)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h,if(IsTooltip),CODE:{
	[h:pm.ChosenSpells=json.get(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Name=='"+currentFeatureName+"' && @.Class=='"+currentFeatureClass+"' && @.Subclass=='"+currentFeatureSubclass+"')]['SpellList']"),0)]
};{
	[h:pm.SpellChoiceInput = "junkVar | -------------- Choose Your Spells -------------- | | LABEL | SPAN=TRUE"]
	[h:filterNum = 0]
	[h:spellNum = 0]
	[h:pm.CurrentSpellList=json.get(json.path.read(getProperty("a5e.stat.AllFeatures"),"[?(@.Name=='"+currentFeatureName+"' && @.Class=='"+currentFeatureClass+"' @.Subclass=='"+currentFeatureSubclass+"')]['SpellList']"),0)]
	[h:pm.CurrentSpellPosition=0]

	[h:pm.AbilityAddSpellInput()]
	[h:abort(input(pm.SpellChoiceInput))]
	[h:pm.ChosenSpells = ""]

	[h,count(spellNum): pm.ChosenSpells = json.append(pm.ChosenSpells,eval("spell"+(roll.count+1)))]

	[h:setProperty("a5e.stat.AllFeatures",json.path.set(getProperty("a5e.stat.AllFeatures"),"[?(@.Name=='"+currentFeatureName+"' && @.Class=='"+currentFeatureClass+"' && @.Subclass=='"+currentFeatureSubclass+"')]['SpellList']",pm.ChosenSpells))]
}]

[h:pm.SpellList = json.toList(pm.ChosenSpells,if(getLibProperty("VerticalFormat","Lib:pm.a5e.Core"),"<br>",", "))]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Spell List",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",pm.SpellList,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]