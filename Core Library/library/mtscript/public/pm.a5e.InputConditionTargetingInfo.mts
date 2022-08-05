[h,if(argCount()>0),CODE:{
	[h:extraTopLines = json.get(arg(0),"ExtraTop")]
	[h:extraBottomLines = json.get(arg(0),"ExtraBottom")]
};{
	[h:extraTopLines = ""]
	[h:extraBottomLines = ""]
}]

[h:MaxSpellLevel = 9]
[h:spellLevelOptions = ""]
[h,count(MaxSpellLevel): spellLevelOptions = listAppend(spellLevelOptions,(roll.count+1))]

[h:disValidConditions = ""]
[h:conditionArray = pm.GetBaseConditions()]
[h,foreach(condition,conditionArray): disValidConditions = listAppend(disValidConditions,+" |  | "+json.get(condition,"DisplayName")+" | CHECK ","##")]

[h:abort(input(
	"throwaway|---------------------------------------------- Condition Targeting Data ---------------------------------------------||LABEL|SPAN=TRUE",
	extraTopLines,
	"throwaway|------------------------------------------------------ Condition Type -----------------------------------------------------||LABEL|SPAN=TRUE",
	" typeInclusiveExclusive | All (Ignore Selections),Inclusive,Exclusive | <html><span title='Inclusive = Only checked boxes are valid targets. Exclusive = Checked boxes are NOT valid targets, but all others are.'>Below Selections that Are Valid Targets</span></html> | LIST ",
	" reqCurse |  | Curse | CHECK ",
	" reqDisease |  | Disease | CHECK ",
	" reqPoison |  | Poison | CHECK ",
	" reqBoon |  | Boon | CHECK ",
	"throwaway|------------------------------------------------------ Spell Conditions -----------------------------------------------------||LABEL|SPAN=TRUE",
	" reqSpell | Cannot Target Spells,Must Target Spells,Not Relevant | Targets Spell Effects | LIST | SELECT=2 ",
	" spellLevelMax | No Maximum,"+spellLevelOptions+" | Maximum Spell Level Targetable | LIST ",
	"throwaway|------------------------------------------------------ Specific Conditions -----------------------------------------------------||LABEL|SPAN=TRUE",
	" conditionInclusiveExclusive | No Condition Required,Inclusive,Exclusive | <html><span title='Inclusive = Only checked boxes are valid targets. Exclusive = Checked boxes are NOT valid targets, but all others are.'>Below Selections that Are Valid Targets</span></html> | LIST | VALUE=STRING ",
	disValidConditions,
	" reqFeatureCond |  | Add Condition Not Listed Above | CHECK ",
	extraBottomLines
))]

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

[h:macro.return = finalFilterData]