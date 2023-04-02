[h:ObjectTypeMultiselection = ut.a5e.GenerateSelectionHTML(pm.a5e.GetCoreData("sb.ObjectTypes",1,"objectType","adjustItemTypeFilters"))]
[h:ItemOptions = ut.a5e.GenerateSelectionHTML(pm.a5e.GetCoreData("sb.Objects"))]
[h:ParentToken = currentToken()]

[h:ItemHTML = "<tr id='rowDisplayName'><th>Item Types to Select From:</th><td><div class='check-multiple' style='width:100%'>"+ObjectTypeMultiselection+"</td></tr>

<tr id='rowItemChoice'><th><label for='ItemChoice'>Select an Item:</label></th><td><select id='ItemChoice' name='ItemChoice' onchange='createItemChoiceRows()'><option value='@@ImpromptuItem'>New Item</option>"+ItemOptions+"</select></td></tr>

<tr id='rowDisplayName'><th><label for='DisplayName'>Item Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName'></td></tr>

<tr><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Give to "+getName(ParentToken)+"'></th></tr><input type='hidden' name='ParentToken' id='ParentToken' value='"+ParentToken+"'>"]

[h:html.dialog5("Add Item","lib://pm.a5e.core/AddItem.html?cachelib=false","value="+base64.encode(ItemHTML)+"; closebutton=0")]