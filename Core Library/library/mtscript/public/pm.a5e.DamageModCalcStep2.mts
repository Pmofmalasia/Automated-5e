[h:hp.Data = arg(0)]
[h:modifierInstance = arg(1)]
[h:hp.Source = json.get(hp.Data,"SourceType")]
[h:switchToken(json.get(hp.Data,"ParentToken"))]

[h:AllSourcesTest = if(json.get(modifierInstance,"All")==1,1,0)]

[h:"<!-- Damage modifiers are calculated in instances - at this level, there is only one instance of damage, but instances of effects that modify the damage. This is because separate features that provide damage modifiers may only be *situationally* better than the other, as opposed to strictly better. Therefore, each feature that can provide damage modification is checked to see what provides the best benefit. That being said, all of this feels like insanity and hopefully there is a better way. -->"]

[h:"<!-- Additional note: I think Physical damage does not need a separate note from magical, since if something is not magical then it is physical by default, but will need to consider this. --> "]

[h,if(AllSourcesTest),CODE:{
	[h:macro.return = json.get(modifierInstance,"DamageTypes")]
};{
	[h:hp.TempDmgModTest = 1]
	[h:tempSourceToken = json.get(hp.Data,"SourceToken")]

	[h,if(json.get(modifierInstance,"SourceToken")!=""): hp.TempDmgModTest = if(tempSourceToken=="",0,json.contains(json.get(modifierInstance,"SourceToken"),tempSourceToken))]
	[h,if(json.get(modifierInstance,"ExcludeSourceToken")!=""): hp.TempDmgModTest = if(tempSourceToken=="",1,!json.contains(json.get(modifierInstance,"ExcludeSourceToken"),tempSourceToken))]

	[h,if(json.get(modifierInstance,"IncludeCreatureType")!=""): hp.TempDmgModTest = if(tempSourceToken=="",0,json.contains(json.get(modifierInstance,"IncludeCreatureType"),getProperty("a5e.stat.CreatureType",tempSourceToken)))]
	[h,if(json.get(modifierInstance,"ExcludeCreatureType")!=""): hp.TempDmgModTest = if(tempSourceToken=="",1,!json.contains(json.get(modifierInstance,"ExcludeCreatureType"),getProperty("a5e.stat.CreatureType",tempSourceToken)))]

	[h,switch(json.get(modifierInstance,"Allegiance")):
		case "Ally": hp.TempDmgModTest = (getProperty("a5e.stat.WhichTeam") == getProperty("a5e.stat.WhichTeam",tempSourceToken));
		case "Foe": hp.TempDmgModTest = (getProperty("a5e.stat.WhichTeam") != getProperty("a5e.stat.WhichTeam",tempSourceToken));
		case "Self": hp.TempDmgModTest = (currentToken() == tempSourceToken);
		case "NotSelf": hp.TempDmgModTest = (currentToken() != tempSourceToken);
		default: ""
	]

	[h,if(json.get(modifierInstance,"HasCondition")!=""): hp.TempDmgModTest = if(tempSourceToken=="",0,!json.isEmpty(json.intersection(json.get(modifierInstance,"HasCondition"),json.path.read(getProperty("a5e.stat.ConditionList",tempSourceToken),"[*]['Name']"))))]

	[h,if(json.get(modifierInstance,"IncludeMorality")!=""): hp.TempDmgModTest = if(tempSourceToken=="",0,json.contains(json.get(modifierInstance,"IncludeMorality"),json.get(getProperty("a5e.stat.Alignment",tempSourceToken),"Morality")))]
	[h,if(json.get(modifierInstance,"ExcludeMorality")!=""): hp.TempDmgModTest = if(tempSourceToken=="",1,!json.contains(json.get(modifierInstance,"ExcludeMorality"),json.get(getProperty("a5e.stat.Alignment",tempSourceToken),"Morality")))]

	[h,if(json.get(modifierInstance,"IncludeOrder")!=""): hp.TempDmgModTest = if(tempSourceToken=="",0,json.contains(json.get(modifierInstance,"IncludeOrder"),json.get(getProperty("a5e.stat.Alignment",tempSourceToken),"Order")))]
	[h,if(json.get(modifierInstance,"ExcludeOrder")!=""): hp.TempDmgModTest = if(tempSourceToken=="",1,!json.contains(json.get(modifierInstance,"ExcludeOrder"),json.get(getProperty("a5e.stat.Alignment",tempSourceToken),"Order")))]

	[h,switch(hp.Source),CODE:
		case "Spell":{
			[h:hp.TempDmgModTest = if(json.get(modifierInstance,"Magical")==0,0,1)]
			[h,if(json.get(modifierInstance,"IncludeSchool")!=""): hp.TempDmgModTest = json.contains(json.get(modifierInstance,"IncludeSchool"),json.get(hp.Data,"School"))]
			[h,if(json.get(modifierInstance,"ExcludeSchool")!=""): hp.TempDmgModTest = !json.contains(json.get(modifierInstance,"ExcludeSchool"),json.get(hp.Data,"School"))]
			
		};
		case "Weapon":{
			[h:hp.TempDmgModTest = or(json.get(modifierInstance,"MeleeRanged")=="",json.get(modifierInstance,"MeleeRanged") == json.get(hp.Data,"MeleeRanged"))]
			[h:hp.TempDmgModTest = or(json.get(modifierInstance,"Magical")=="",json.get(modifierInstance,"Magical") == json.get(hp.Data,"Magical"))]
			[h,if(json.get(modifierInstance,"IncludeMaterial")!=""): hp.TempDmgModTest = json.contains(json.get(modifierInstance,"IncludeMaterial"),json.get(hp.Data,"Material"))]
			[h,if(json.get(modifierInstance,"ExcludeMaterial")!=""): hp.TempDmgModTest = !json.contains(json.get(modifierInstance,"ExcludeMaterial"),json.get(hp.Data,"Material"))]
		};
		default:{}
	]

	[h,if(hp.TempDmgModTest): macro.return = json.get(modifierInstance,"DamageTypes"); macro.return = "[]"]
}]