[h,if(argCount()>0),CODE:{
	[h:extraTopLines = json.get(arg(0),"ExtraTop")]
	[h:extraBottomLines = json.get(arg(0),"ExtraBottom")]
};{
	[h:extraTopLines = ""]
	[h:extraBottomLines = ""]
}]

[h:disValidCreatures = ""]
[h:CreatureTypesArray = pm.GetCreatureTypes()]
[h,foreach(creature,CreatureTypesArray): disValidCreatures = listAppend(disValidCreatures," choiceCreature"+json.get(creature,"Name")+" |  | "+json.get(creature,"DisplayName")+" | CHECK ","##")]

[h:disValidConditions = ""]
[h:conditionArray = pm.GetBaseConditions()]
[h,foreach(condition,conditionArray): disValidConditions = listAppend(disValidConditions,+" |  | "+json.get(condition,"DisplayName")+" | CHECK ","##")]

[h:disValidAbilityScores = ""]
[h:attributeArray = pm.GetAttributes()]
[h,foreach(tempAttribute,attributeArray): disValidConditions = listAppend(disValidConditions," choiceMax"+json.get(tempAttribute,"Name")+" | No Maximum,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 | Maximum "+json.get(tempAttribute,"DisplayName")+" | LIST ## choiceMin"+json.get(tempAttribute,"Name")+" | No Minimum,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 | Minumum "+json.get(tempAttribute,"DisplayName")+" | LIST ","##")]

[h:abort(input(
	"throwaway|---------------------------------------------- Creature Targeting Data ---------------------------------------------||LABEL|SPAN=TRUE",
	extraTopLines,
	"throwaway|------------------------------------------------------ Creature Allegiance -----------------------------------------------------||LABEL|SPAN=TRUE",
	" reqAllegiance | Anyone,Self Only,Allies,Allies Other Than Self,Enemies | Who Can Be Targeted | LIST | VALUE=STRING ",
	"throwaway|------------------------------------------------------ Creature Type -----------------------------------------------------||LABEL|SPAN=TRUE",
	" creaturesInclusiveExclusive | All (Ignore Selections),Inclusive,Exclusive | <html><span title='Inclusive = Only checked boxes are valid targets. Exclusive = Checked boxes are NOT valid targets, but all others are.'>Below Selections that Are Valid Targets</span></html> | LIST ",
	disValidCreatures,
	"throwaway|------------------------------------------------------ Senses -----------------------------------------------------||LABEL|SPAN=TRUE",
	" reqSight |  | Requires Target to See You | CHECK ",
	" reqHearing |  | Requires Target to Hear You | CHECK ",
	" reqUnderstand |  | Requires Target to Understand You | CHECK ",
	" coverMax | None,Half,Three-Quarters,Full | Most Cover Target Can Be Behind and Still Be Targeted | LIST | SELECT=2 VALUE=STRING ",
	"throwaway|------------------------------------------------------ Condition Requirements -----------------------------------------------------||LABEL|SPAN=TRUE",
	" conditionInclusiveExclusive | No Condition Required,Inclusive,Exclusive | <html><span title='Inclusive = Only checked boxes are valid targets. Exclusive = Checked boxes are NOT valid targets, but all others are.'>Below Selections that Are Valid Targets</span></html> | LIST | VALUE=STRING ",
	disValidConditions,
	" reqFeatureCond |  | Add Condition Not Listed Above | CHECK ",
	" reqSetByYou |  | Requires Above Condition to be Set By You | CHECK ",
	"throwaway|------------------------------------------------------ Ability Scores -----------------------------------------------------||LABEL|SPAN=TRUE",
	disValidAbilityScores,
	"throwaway|------------------------------------------------------ Alignment -----------------------------------------------------||LABEL|SPAN=TRUE",
	" alignmentInclusiveExclusive | All (Ignore Selections),Inclusive,Exclusive | <html><span title='Inclusive = Only checked boxes are valid targets. Exclusive = Checked boxes are NOT valid targets, but all others are.'>Below Selections that Are Valid Targets</span></html> | LIST | VALUE=STRING ",
	" choiceAlignmentLawful |  | Lawful | CHECK ",
	" choiceAlignmentNeutralOrder |  | Neutral (Order) | CHECK ",
	" choiceAlignmentChaotic |  | Chaotic | CHECK ",
	" choiceAlignmentGood |  | Good | CHECK ",
	" choiceAlignmentNeutralMorality |  | Neutral (Morality) | CHECK ",
	" choiceAlignmentEvil |  | Evil | CHECK ",
	" choiceAlignmentUnaligned |  | Unaligned | CHECK ",
	extraBottomLines
))]

[h:finalFilterData = "{}"]

[h,switch(reqAllegiance),CODE:
	case 0:{};
	case 1:{
		[h:allegianceData = json.set("","Self",1)]
		[h:finalFilterData = json.set(finalFilterData,"Allegiance",allegianceData)]
	};
	case 2:{
		[h:allegianceData = json.set("","Self",1,"Ally",1)]
		[h:finalFilterData = json.set(finalFilterData,"Allegiance",allegianceData)]
	};
	case 3:{
		[h:allegianceData = json.set("","Ally",1)]
		[h:finalFilterData = json.set(finalFilterData,"Allegiance",allegianceData)]
	};
	case 4:{
		[h:allegianceData = json.set("","Enemy",1)]
		[h:finalFilterData = json.set(finalFilterData,"Allegiance",allegianceData)]
	}
]

[h:creatureTypeInclusiveData = "[]"]
[h:creatureTypeExclusiveData = "[]"]
[h,switch(creaturesInclusiveExclusive),CODE:
	case 0:{};
	case 1:{
		[h,foreach(creature,CreatureTypesArray): creatureTypeInclusiveData = if(eval("choiceCreature"+json.get(creature,"Name")),json.append(creatureTypeInclusiveData,json.get(creature,"Name")),creatureTypeInclusiveData)]
	};
	case 2:{
		[h,foreach(creature,CreatureTypesArray): creatureTypeExclusiveData = if(eval("choiceCreature"+json.get(creature,"Name")),json.append(creatureTypeExclusiveData,json.get(creature,"Name")),creatureTypeExclusiveData)]
	}
]

[h,if(!json.isEmpty(creatureTypeInclusiveData)): finalFilterData = json.set(finalFilterData,"CreatureTypeInclusive",creatureTypeInclusiveData)]
[h,if(!json.isEmpty(creatureTypeExclusiveData)): finalFilterData = json.set(finalFilterData,"CreatureTypeExclusive",creatureTypeExclusiveData)]

[h,if(reqSight): finalFilterData = json.set(finalFilterData,"Sight",reqSight)]
[h,if(reqHearing): finalFilterData = json.set(finalFilterData,"Hearing",reqHearing)]
[h,if(reqUnderstand): finalFilterData = json.set(finalFilterData,"Understanding",reqUnderstand)]
[h:finalFilterData = json.set(finalFilterData,"CoverMax",coverMax)]

[h:conditionInclusiveData = "[]"]
[h:conditionExclusiveData = "[]"]
[h,switch(creaturesInclusiveExclusive),CODE:
	case 0:{};
	case 1:{
		[h,foreach(condition,conditionArray): conditionInclusiveData = if(eval("choiceCondition"+json.get(condition,"Name")),json.append(conditionInclusiveData,json.set("","Name",json.get(condition,"Name"),"Class",json.get(condition,"Class"),"Subclass",json.get(condition,"Subclass")),conditionInclusiveData)]

		[h:tempConditionFilter = json.set("","InputTitle"," junkVar | ------------------ Choose a Condition that the Target Must Have ------------------ | LABEL | SPAN=TRUE ")]
		[h:repeatFilterTest = 0]
		[h,while(reqFeatureCond>0),CODE:{
			[h,if(reqFeatureCond-1):
				tempNewCond = pm.a5e.ConditionFilter(json.set(tempConditionFilter,"AddAnother",1))
				tempNewCond = pm.a5e.ConditionFilter(json.set("","InputTitle"," junkVar | ------------------ Choose a Condition that the Target Must Have ------------------ | LABEL | SPAN=TRUE ","AddAnother",1))
			]
			[h:tempConditionFilter = macro.return]
			[h:reqFeatureCond = json.get(tempConditionFilter,"AddAnother")]
			[h:conditionInclusiveData = json.append(conditionInclusiveData,json.delete(tempConditionFilter,"AddAnother"))]
		}]
	};
	case 2:{
		[h,foreach(condition,conditionArray): conditionExclusiveData = if(eval("choiceCondition"+json.get(condition,"Name")),json.append(conditionExclusiveData,json.set("","Name",json.get(condition,"Name"),"Class",json.get(condition,"Class"),"Subclass",json.get(condition,"Subclass")),conditionExclusiveData)]

		[h:tempConditionFilter = json.set("","InputTitle"," junkVar | ------------------ Choose a Condition that the Target Must Not Have ------------------ | LABEL | SPAN=TRUE ")]
		[h:repeatFilterTest = 0]
		[h,while(reqFeatureCond>0),CODE:{
			[h,if(reqFeatureCond-1):
				tempNewCond = pm.a5e.ConditionFilter(json.set(tempConditionFilter,"AddAnother",1))
				tempNewCond = pm.a5e.ConditionFilter(json.set("","InputTitle"," junkVar | ------------------ Choose a Condition that the Target Must Not Have ------------------ | LABEL | SPAN=TRUE ","AddAnother",1))
			]
			[h:tempConditionFilter = macro.return]
			[h:reqFeatureCond = json.get(tempConditionFilter,"AddAnother")]
			[h:conditionExclusiveData = json.append(conditionExclusiveData,json.delete(tempConditionFilter,"AddAnother"))]
		}]
	}
]

[h,if(!json.isEmpty(conditionInclusiveData)): finalFilterData = json.set(finalFilterData,"ConditionsInclusive",conditionInclusiveData)]
[h,if(!json.isEmpty(conditionExclusiveData)): finalFilterData = json.set(finalFilterData,"ConditionsExclusive",conditionExclusiveData)]
[h,if(reqSetByYou): finalFilterData = json.set(finalFilterData,"CondSetByYou",reqSetByYou)]

[h:attributeData = "{}"]
[h,foreach(tempAttribute,attributeArray),CODE:{
	[h:tempMaxAttr = eval("choiceMax"+json.get(tempAttribute,"Name"))]
	[h:tempMinAttr = eval("choiceMin"+json.get(tempAttribute,"Name"))]
	[h,if(tempMaxAttr > 0): attributeData = json.set(attributeData,json.get(tempAttribute,"Name")+"Max",tempMaxAttr)]
	[h,if(tempMinAttr > 0): attributeData = json.set(attributeData,json.get(tempAttribute,"Name")+"Min",tempMinAttr)]
}]

[h,if(!json.isEmpty(attributeData)): finalFilterData = json.set(finalFilterData,"AbilityScores",attributeData)]

[h:alignmentInclusiveData = "[]"]
[h:alignmentExclusiveData = "[]"]
[h,switch(alignmentInclusiveExclusive),CODE:
	case 0:{};
	case 1:{
		[h:alignmentInclusiveData = if(choiceAlignmentLawful,json.append(alignmentInclusiveData,"Lawful"),alignmentInclusiveData)]
		[h:alignmentInclusiveData = if(choiceAlignmentNeutralOrder,json.append(alignmentInclusiveData,"NeutralOrder"),alignmentInclusiveData)]
		[h:alignmentInclusiveData = if(choiceAlignmentChaotic,json.append(alignmentInclusiveData,"Chaotic"),alignmentInclusiveData)]
		[h:alignmentInclusiveData = if(choiceAlignmentGood,json.append(alignmentInclusiveData,"Good"),alignmentInclusiveData)]
		[h:alignmentInclusiveData = if(choiceAlignmentNeutralMorality,json.append(alignmentInclusiveData,"NeutralMorality"),alignmentInclusiveData)]
		[h:alignmentInclusiveData = if(choiceAlignmentEvil,json.append(alignmentInclusiveData,"Evil"),alignmentInclusiveData)]
		[h:alignmentInclusiveData = if(choiceAlignmentUnaligned,json.append(alignmentInclusiveData,"Unaligned"),alignmentInclusiveData)]
	};
	case 2:{
		[h:alignmentExclusiveData = if(choiceAlignmentLawful,json.append(alignmentExclusiveData,"Lawful"),alignmentExclusiveData)]
		[h:alignmentExclusiveData = if(choiceAlignmentNeutralOrder,json.append(alignmentExclusiveData,"NeutralOrder"),alignmentExclusiveData)]
		[h:alignmentExclusiveData = if(choiceAlignmentChaotic,json.append(alignmentExclusiveData,"Chaotic"),alignmentExclusiveData)]
		[h:alignmentExclusiveData = if(choiceAlignmentGood,json.append(alignmentExclusiveData,"Good"),alignmentExclusiveData)]
		[h:alignmentExclusiveData = if(choiceAlignmentNeutralMorality,json.append(alignmentExclusiveData,"NeutralMorality"),alignmentExclusiveData)]
		[h:alignmentExclusiveData = if(choiceAlignmentEvil,json.append(alignmentExclusiveData,"Evil"),alignmentExclusiveData)]
		[h:alignmentExclusiveData = if(choiceAlignmentUnaligned,json.append(alignmentExclusiveData,"Unaligned"),alignmentExclusiveData)]
	}
]

[h,if(!json.isEmpty(alignmentInclusiveData)): finalFilterData = json.set(finalFilterData,"AlignmentInclusive",alignmentInclusiveData)]
[h,if(!json.isEmpty(alignmentExclusiveData)): finalFilterData = json.set(finalFilterData,"AlignmentExclusive",alignmentExclusiveData)]

[h:macro.return = finalFilterData]