[h:ab.LoopExit = 0]
[h:ab.Input = ""]
[h:ab.AtrChoices = ""]
[h,foreach(TempAtr,pm.GetAttributes()): ab.Input = listAppend(ab.Input," ab."+json.get(TempAtr,"Name")+"Choice |  | "+json.get(TempAtr,"DisplayName")+" | CHECK ","##")]
[h,while(ab.LoopExit==0),CODE:{
	[h:abort(input(
		" junkVar | --------- Create Points to Allocate to Select Ability Scores --------- |  | LABEL | SPAN=TRUE ",
		" ab.TempPointsNum | 0,1,2,3,4,5 | Choose number of points to add | LIST | SELECT=1 ",
		" ab.Inclusive | Include Choices,Exclude Choices,Any Ability Score | <html><span title='Include choices is for scenarios where you choose among the selected ability scores. Exclude choices is for scenarios where you choose from any ability score other than the ones indicated (e.g. races that give +2 in one stat and a choice to put +1 in any other stat). Choosing Any Ability Score will ignore your choices below.'>Which ability scores are valid options</span></html> | LIST ",
		ab.Input,
		" ab.LoopExit | 1 | Finish adding options | CHECK "
		))]
	[h:ab.ThisPoint = json.set("","Points",ab.TempPointsNum)]
	[h,if(ab.Inclusive==2),CODE:{
		[h:ab.ThisPoint = json.set(ab.ThisPoint,"AllAttributes",1)]
	};{
		[h,foreach(TempAtr,pm.GetAttributes("Name","json")): ab.ThisPoint = if(eval("ab."+TempAtr+"Choice")==0,ab.ThisPoint,json.set(ab.ThisPoint,TempAtr,eval("ab."+TempAtr+"Choice")))]
		[h:ab.ThisPoint = if(ab.Inclusive==0,json.set(ab.ThisPoint,"Inclusive",1),ab.ThisPoint)]
	}]
	[h:ab.AtrChoices = json.append(ab.AtrChoices,ab.ThisPoint)]
}]

[h:"<!-- Note: Above setting of 'Inclusive' to '' for the 'Exclude Choices' option is on purpose. -->"]
[h:"<!-- In processing the check is if, in this object, 'Inclusive'=='AttributeName', then it is a valid option.-->"]
[h:"<!-- For exclusion, using '' as the value for exclusion allows attributes created after the ability to also have '' as their value, since their key cannot be present. -->"]

[h:macro.return = ab.AtrChoices]