[h:SpellPrepData = macro.args]
[h:ParentToken = json.get(SpellPrepData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:IsTooltip = 0]
[h:SpellSelectionFeature = json.get(SpellPrepData,"Feature")]
[h:InputType = json.get(SpellPrepData,"InputType")]
[h:"<!-- For dialog5 vs. input -->"]

[h:SelectionData = json.get(SpellSelectionFeature,"SpellOptions")]
[h,switch(InputType): 
    case "Input": SelectionInput = " junkVar |  | --------- "+if(json.get(SpellSelectionFeature,"DisplayName")=="Spellcasting",pm.GetDisplayName(json.get(SpellSelectionFeature,"Class"),"sb.Classes")+" ","")+json.get(SpellSelectionFeature,"DisplayName")+" Spell Selection --------- | LABEL | SPAN=TRUE ";
    case "Dialog": SelectionInput = "<tr id='row"+json.get(SpellSelectionFeature,"Name")+"Header'><th colspan='2'>"+if(json.get(SpellSelectionFeature,"DisplayName")=="Spellcasting",pm.GetDisplayName(json.get(SpellSelectionFeature,"Class"),"sb.Classes")+" ","")+json.get(SpellSelectionFeature,"DisplayName")+" Spell Selection"+"</th></tr>";
    default: ""
]
[h:outerCounter = 0]
[h,foreach(selectionInstance,SelectionData),CODE:{
    [h:SelectionNumber = json.get(selectionInstance,"Number")]
    [h:tempSelectionList = json.get(selectionInstance,"List")]
    [h:SelectionListFeature = json.path.read(getLibProperty("sb.Abilities","Lib:pm.a5e.Core"),"[*][?(@.Name=='"+json.get(tempSelectionList,"Name")+"' && @.Class=='"+json.get(tempSelectionList,"Class")+"' && @.Subclass=='"+json.get(tempSelectionList,"Subclass")+"')]['SpellList']")]
    [h,if(json.isEmpty(SelectionListFeature)):
        SelectionList = getLibProperty("sb.Spells","Lib:pm.a5e.Core");
        SelectionList = json.path.read(getLibProperty("sb.Spells","Lib:pm.a5e.Core"),"[*][?(@.Name in "+json.get(SelectionListFeature,0)+")]")
    ]
[h:"<!-- If I can't get this to work, the solution may be to just send it as is and weed out any duplicates - could solve the issue with it working for spells where only one effect matches as well -->"]
    [h,if(json.get(selectionInstance,"Filter")!=""),CODE:{
        [h:FilteredListData = pm.a5e.SpellFilter(json.set("","List",SelectionList,"Parameters",json.get(selectionInstance,"Filter")))]
        [h:FilteredList = json.get(FilteredListData,"SpellList")]
        [h:FilterDescription = json.get(FilteredListData,"Description")]
    };{
        [h:FilterDescription = "Spell"]
    }]
    [h:FinalSelectionList = json.sort(json.path.read(FilteredList,"[*]['DisplayName']"))]
            [h:"<!-- TODO: Add ability to have current spell selections already chosen in input -->"]
    [h,switch(InputType),CODE:
        case "Input":{
            [h:NoNumberTest = SelectionNumber == 1]
            [h,count(SelectionNumber): SelectionInput = listAppend(SelectionInput," choice"+json.get(SpellSelectionFeature,"Name")+outerCounter+roll.count+" | "+FinalSelectionList+" | "+FilterDescription+if(NoNumberTest,""," #"+(outerCounter+roll.count+1))+" | LIST | DELIMITER=JSON VALUE=STRING "," ## ")]
        };
        case "Dialog":{
            [h:SpellOptions = ""]
            [h,foreach(tempSpell,FinalSelectionList): SpellOptions = SpellOptions + "<option value='"+pm.RemoveSpecial(tempSpell)+"'>"+tempSpell+"</option>"]

            [h:NoNumberTest = SelectionNumber == 1]
            [h,count(SelectionNumber): SelectionInput = SelectionInput + "<tr><th><label for='choice"+json.get(SpellSelectionFeature,"Name")+outerCounter+roll.count+"'>"+FilterDescription+if(NoNumberTest,""," #"+(outerCounter+roll.count+1))+":</label></th><td><select id='choice"+json.get(SpellSelectionFeature,"Name")+outerCounter+roll.count+"' name='choice"+json.get(SpellSelectionFeature,"Name")+outerCounter+roll.count+"'>"+SpellOptions+"</select></td></tr>"]
        };
        default: {}
    ]
}]
[h:macro.return = SelectionInput]

[h:'<-- for each feature, create X number of entries, where X is number of spells allowed to choose from. for each entry, the list of options should come from:

a) straight up just a list of spells, no limits within the list (base spellcasting stuff)

b) some entries like in (a), some with limitations (e.g. divination/illusion only; ritual only)

c) The above, but with entries on another feature (e.g. Arcane Trickster casting takes from the Wizard entry)

d) any combination of the above, with options coming from a spellbook (which in turn necessitates the ability to add spells to a spellbook)

TODO: Add a "Descriptor" key to each instance that describes the filter - e.g. cantrips only, leveled spells only, x class only. May be able to use pm.SpellFilterDescription instead.

Contents of key "SpellOptions": Array of objects containing number of choices associated + (List of spell names OR object of spell parameters)

Create key "SpellPrepType": Options = Known, Prepared, Spellbook

On spell features, will have multiple keys for spell storage:
    "SpellList": Spells which are always known/prepared no matter what
    "SpellsKnown": Spells chosen from "SpellOptions" to become known
    "SpellsPrepared": Same as above with prepared
    "Spellbook": SpellOptions --> Spellbook --> SpellsPrepared. May go away with spellbook item.']