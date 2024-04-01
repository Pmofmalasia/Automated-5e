[h:AddItemData = macro.args]
[h:ParentToken = json.get(AddItemData,"ParentToken")]

[h,if(json.get(AddItemData,"Type")==""),CODE:{
	[h:ObjectTypeMultiselection = ut.a5e.GenerateSelectionHTML(pm.a5e.GetCoreData("sb.ObjectTypes"),1,"objectTypeFilter","adjustItemTypeFilters")]
	[h:ItemHTML = "<tr id='rowItemTypes'><th>Item Types to Select From:</th><td><div class='check-multiple' style='width:100%'>"+ObjectTypeMultiselection+"</td></tr>"]
};{
	[h:ItemHTML = "<input type='hidden' name='TypeFilterOverride' id='TypeFilterOverride' value='"+json.get(AddItemData,"Type")+"'>"]
}]

[h:ItemHTML = ItemHTML + "<tr id='rowItemChoice'><th><label for='ItemChoice'>Select an Item:</label></th><td><select id='ItemChoice' name='ItemChoice' onchange='createItemChoiceRows()'><option value='@@ImpromptuItem'>New Item</option></select></td></tr>

<tr id='rowDisplayName'><th><label for='DisplayName'>Optional Unique Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName'></td></tr>

<tr id='rowFalseName'><th><label for='FalseName'>Optional False Name:</label></th><td><input type='text' id='FalseName' name='FalseName'></td></tr>

<tr id='rowNumberAdded'><th><label for='NumberAdded'>Number to Add:</label></th><td><input type='number' id='NumberAdded' name='NumberAdded' min=1 value=1 style='width:35px'></td></tr>

<tr><th text-align='center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Give to "+getName(ParentToken)+"'></th></tr><input type='hidden' name='ParentToken' id='ParentToken' value='"+ParentToken+"'>"]

[h:html.dialog5("AddItem","lib://pm.a5e.core/AddItem.html?cachelib=false","value="+base64.encode(ItemHTML)+"; width=500; height=400; closebutton=0")]