[h:ab.Input = " junkVar | --------- Select Points to Allocate to Ability Scores --------- |  | LABEL | SPAN=TRUE ## ab.AllChoice | -4,-3,-2,-1,0,1,2,3,4 | <html><span title='Will apply bonus to all attributes including any added in the future. Any other bonuses applied will add on top of this number.'>All Attributes</span></html> | LIST | SELECT=4 VALUE=STRING "]
[h,foreach(TempAtr,pm.GetAttributes()): ab.Input = listAppend(ab.Input," ab."+json.get(TempAtr,"Name")+"Choice | -4,-3,-2,-1,0,1,2,3,4 | "+json.get(TempAtr,"DisplayName")+" | LIST | SELECT=4 VALUE=STRING ","##")]

[h:abort(input(ab.Input))]

[h:ab.AtrChoices = ""]
[h,if(ab.AllChoice!=0): ab.AtrChoices = json.set(ab.AtrChoices,"All",number(ab.AllChoice))]
[h,foreach(TempAtr,pm.GetAttributes("Name","json")): ab.AtrChoices = if(number(eval("ab."+TempAtr+"Choice"))==0,ab.AtrChoices,json.set(ab.AtrChoices,TempAtr,number(eval("ab."+TempAtr+"Choice"))))]
[h:macro.return = ab.AtrChoices]