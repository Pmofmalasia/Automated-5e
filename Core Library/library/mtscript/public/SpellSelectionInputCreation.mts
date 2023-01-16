[h:SpellPrepData = macro.args]
[h:ParentToken = json.get(SpellPrepData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:IsTooltip = 0]
[h:SpellSelectionFeature = json.get(SpellPrepData,"Feature")]
[h:InputType = json.get(SpellPrepData,"InputType")]
[h:"<!-- For dialog5 vs. input -->"]

[h:SelectionData = json.get(SpellSelectionFeature,"SpellOptions")]
[h,switch(InputType): 
    case "Input": SelectionInput = " junkVar | --------- "+if(json.get(SpellSelectionFeature,"DisplayName")=="Spellcasting",pm.GetDisplayName(json.get(SpellSelectionFeature,"Class"),"sb.Classes")+" ","")+json.get(SpellSelectionFeature,"DisplayName")+" Spell Selection --------- |  | LABEL | SPAN=TRUE ";
    case "Dialog": SelectionInput = "<tr id='row"+json.get(SpellSelectionFeature,"Name")+"Header'><th colspan='2'>"+if(json.get(SpellSelectionFeature,"DisplayName")=="Spellcasting",pm.GetDisplayName(json.get(SpellSelectionFeature,"Class"),"sb.Classes")+" ","")+json.get(SpellSelectionFeature,"DisplayName")+" Spell Selection"+"</th></tr>";
    default: ""
]

[h:AllPriorSpellSelections = json.get(SpellSelectionFeature,"SpellsSelected")]
[h:outerCounter = 0]
[h,foreach(selectionInstance,SelectionData),CODE:{
    [h:TotalSelectionNumber = json.get(selectionInstance,"Number")]
    [h,if(!isNumber(TotalSelectionNumber)): TotalSelectionNumber = evalMacro(TotalSelectionNumber)]

    [h:tempSelectionList = json.get(selectionInstance,"List")]
    [h,if(tempSelectionList==""),CODE:{
        [h:SelectionList = getLibProperty("sb.Spells","Lib:pm.a5e.Core")]
    };{
        [h:"<!-- If List is a feature object, find the list in that feature. If no feature, use all spells. If List is a string, assume it to be a casting class and get the stored list from that class. -->"]
        [h,if(json.type(tempSelectionList)=="UNKNOWN"): 
            SelectionListFeature = "[]";
            SelectionListFeature = json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[*][?(@.Name=='"+json.get(tempSelectionList,"Name")+"' && @.Class=='"+json.get(tempSelectionList,"Class")+"' && @.Subclass=='"+json.get(tempSelectionList,"Subclass")+"')]['SpellList']")
        ]
        [h,if(json.isEmpty(SelectionListFeature)):
            SelectionList = getLibProperty("sb.Spells","Lib:pm.a5e.Core");
            SelectionList = json.path.read(getLibProperty("sb.Spells","Lib:pm.a5e.Core"),"[*][?(@.Name in "+json.get(SelectionListFeature,0)+")]")
        ]
        [h,if(json.type(tempSelectionList)=="UNKNOWN"): SelectionList = if(json.get(getLibProperty("sb.SpellLists","Lib:pm.a5e.Core"),tempSelectionList)!="",json.path.read(getLibProperty("sb.Spells","Lib:pm.a5e.Core"),"[*][?(@.Name in "+json.get(getLibProperty("sb.SpellLists","Lib:pm.a5e.Core"),tempSelectionList)+")]"),SelectionList)]
    }]

    [h:SpellFilter = json.get(selectionInstance,"Filter")]
    [h,if(SpellFilter!=""),CODE:{
        [h,if(json.get(SpellFilter,"LevelBasedMaxLevel")==1): SpellFilter = json.set(SpellFilter,"LevelBasedMaxLevel",json.get(SpellSelectionFeature,"Class"))]
        [h:FilteredListData = pm.a5e.SpellFilter(json.set("","List",SelectionList,"Filter",SpellFilter))]
        [h:FinalSelectionList = json.get(FilteredListData,"SpellList")]
        [h:FilterDescription = json.get(FilteredListData,"Description")]
    };{
        [h:FilterDescription = "Spell"]
    }]
    
    [h,if(AllPriorSpellSelections!=""),CODE:{
        [h,if(json.length(AllPriorSpellSelections) > outerCounter):
            thisInstancePriorSelections = json.get(AllPriorSpellSelections,outerCounter);
            thisInstancePriorSelections = "[]"
        ]
        [h:CurrentSelectionsNumber = json.length(thisInstancePriorSelections)]
    };{
        [h:thisInstancePriorSelections = "[]"]
        [h:CurrentSelectionsNumber = 0]
    }]

    [h:"<!-- This stupid method of counting twice is to avoid attempting to pull from an index out of range of the current 'SpellsSelected'. You can thank CODE block limits for this, as usual. Thank them for the godawful oneliner in case 'Dialog' as well. -->"]
    [h,switch(InputType),CODE:
        case "Input":{
            [h:NoNumberTest = TotalSelectionNumber == 1]

            [h,count(CurrentSelectionsNumber): SelectionInput = listAppend(SelectionInput," choice"+json.get(SpellSelectionFeature,"Name")+json.get(SpellSelectionFeature,"Class")+json.get(SpellSelectionFeature,"Subclass")+outerCounter+roll.count+" | "+FinalSelectionList+" | "+FilterDescription+if(NoNumberTest,""," #"+(roll.count+1))+" | LIST | DELIMITER=JSON VALUE=STRING SELECT="+max(0,json.indexOf(FinalSelectionList,json.get(thisInstancePriorSelections,roll.count)))," ## ")]

            [h,count(TotalSelectionNumber - CurrentSelectionsNumber): SelectionInput = listAppend(SelectionInput," choice"+json.get(SpellSelectionFeature,"Name")+json.get(SpellSelectionFeature,"Class")+json.get(SpellSelectionFeature,"Subclass")+outerCounter+(roll.count+CurrentSelectionsNumber)+" | "+FinalSelectionList+" | "+FilterDescription+if(NoNumberTest,""," #"+(roll.count+1+CurrentSelectionsNumber))+" | LIST | DELIMITER=JSON VALUE=STRING "," ## ")]
        };
        case "Dialog":{
            [h:SpellOptions = ""]
            [h,foreach(tempSpell,FinalSelectionList): SpellOptions = SpellOptions + "<option value='"+pm.RemoveSpecial(tempSpell)+"'>"+tempSpell+"</option>"]
            [h:NoNumberTest = TotalSelectionNumber == 1]

            [h,count(CurrentSelectionsNumber): SelectionInput = SelectionInput + "<tr><th><label for='choice"+json.get(SpellSelectionFeature,"Name")+json.get(SpellSelectionFeature,"Class")+json.get(SpellSelectionFeature,"Subclass")+outerCounter+roll.count+"'>"+FilterDescription+if(NoNumberTest,""," #"+(roll.count+1))+":</label></th><td><select id='choice"+json.get(SpellSelectionFeature,"Name")+json.get(SpellSelectionFeature,"Class")+json.get(SpellSelectionFeature,"Subclass")+outerCounter+roll.count+"' name='choice"+json.get(SpellSelectionFeature,"Name")+json.get(SpellSelectionFeature,"Class")+json.get(SpellSelectionFeature,"Subclass")+outerCounter+roll.count+"'>"+
            
            substring(SpellOptions,0,indexOf(SpellOptions,json.get(thisInstancePriorSelections,roll.count))+length(json.get(thisInstancePriorSelections,roll.count))+1)+" selected"+substring(SpellOptions,indexOf(SpellOptions,json.get(thisInstancePriorSelections,roll.count))+length(json.get(thisInstancePriorSelections,roll.count))+1)+"</select></td></tr>"]

            [h,count(TotalSelectionNumber - CurrentSelectionsNumber): SelectionInput = SelectionInput + "<tr><th><label for='choice"+json.get(SpellSelectionFeature,"Name")+json.get(SpellSelectionFeature,"Class")+json.get(SpellSelectionFeature,"Subclass")+outerCounter+(roll.count+CurrentSelectionsNumber)+"'>"+FilterDescription+if(NoNumberTest,""," #"+(roll.count+1+CurrentSelectionsNumber))+":</label></th><td><select id='choice"+json.get(SpellSelectionFeature,"Name")+json.get(SpellSelectionFeature,"Class")+json.get(SpellSelectionFeature,"Subclass")+outerCounter+(roll.count+CurrentSelectionsNumber)+"' name='choice"+json.get(SpellSelectionFeature,"Name")+json.get(SpellSelectionFeature,"Class")+json.get(SpellSelectionFeature,"Subclass")+outerCounter+(roll.count+CurrentSelectionsNumber)+"'>"+SpellOptions+"</select></td></tr>"]
        };
        default: {}
    ]
    [h:outerCounter = outerCounter + 1]
}]
[h:macro.return = SelectionInput]

[h:"<!-- TODO: Add capability to prepare spells from a spellbook - current method is ok to prepare TO a spellbook, but not from spellbook to prep -->"]