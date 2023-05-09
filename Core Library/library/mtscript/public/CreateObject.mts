[h:ObjectTypeSelection = ut.a5e.GenerateSelectionHTML(pm.a5e.GetCoreData("sb.ObjectTypes"))]
[h:ObjectMaterialMultiselection = ut.a5e.GenerateSelectionHTML(pm.a5e.GetCoreData("sb.ObjectMaterials"),1,"objectMaterial","createChooseMainMaterialRows")]
[h:ObjectMaterialSelection = ut.a5e.GenerateSelectionHTML(pm.a5e.GetCoreData("sb.ObjectMaterials"))]

[h:MaterialTags = pm.a5e.GetCoreData("sb.MaterialTags")]
[h:ObjectTags = pm.a5e.GetCoreData("sb.ObjectTags")]
[h:AllTags = json.sort(json.merge(MaterialTags,ObjectTags),"a","DisplayName")]
[h:ObjectMaterialTagMultiselection = ut.a5e.GenerateSelectionHTML(AllTags,1,"objectMaterialTag")]

[h:allSourcebooks = pm.GetBookInfo()]
[h:sourcebookOptions = ""]
[h,foreach(tempBook,allSourcebooks),CODE:{
	[h:tempBookDisplayName = json.get(tempBook,"DisplayName")]
	[h,if(length(tempBookDisplayName) > 22): tempBookDisplayName = substring(tempBookDisplayName,0,20)+"..."]
	[h:sourcebookOptions = sourcebookOptions + "<option value='"+json.get(tempBook,"Library")+"'>"+tempBookDisplayName+"</option>"]
}]

[h:ObjectHTML = "<tr id='rowDisplayName'><th><label for='DisplayName'>Object Name:</label></th><td><input type='text' id='DisplayName' name='DisplayName' autofocus></td></tr>

<tr id='rowFalseName'><th><label for='FalseName'>False Name:</label></th><td><input type='text' id='FalseName' name='FalseName'></td></tr>

<tr id='rowObjectType'><th><label for='Type'>Object Type:</label></th><td><select id='Type' name='Type' onchange='createObjectSubtypeRows()'>"+ObjectTypeSelection+"</select></td></tr>

<tr id='rowSize'><th><label for='Size'>Object Size:</label></th><td><select id='Size' name='Size'><option value='Diminutive'>Diminutive</option><option value='Tiny' select>Tiny</option><option value='Small'>Small</option><option value='Medium'>Medium</option><option value='Large'>Large</option><option value='Huge'>Huge</option><option value='Gargantuan'>Gargantuan</option><option value='Colossal'>Colossal</option></select></td></tr>

<tr id='rowRarity'><th><label for='Rarity'>Rarity:</label></th><td><select id='Rarity' name='Rarity'><option value='Mundane'>Mundane</option><option value='Common'>Common</option><option value='Uncommon'>Uncommon</option><option value='Rare'>Rare</option><option value='VeryRare'>Very Rare</option><option value='Legendary'>Legendary</option><option value='Artifact'>Artifact</option></select></td></tr>

<tr id='rowCost'><th><label for='Cost'>Cost:</label></th><td><input type='number' id='Cost' name='Cost' value=0 min=0 style='width:35px'><select id='CostUnits' name='CostUnits'><option value='Copper'>Copper</option><option value='Silver'>Silver</option><option value='Gold' selected>Gold</option><option value='Platinum'>Platinum</option></select></td></tr>

<tr id='rowWeight'><th><label for='Weight'>Weight:</label></th><td><input type='number' id='Weight' name='Weight' step='0.01' value=0 min=0 style='width:35px'> lbs.</td></tr>

<tr id='rowIsMagical'><th><label for='isMagical'>Object is a Magic Item?</label></th><td><input type='checkbox' id='isMagical' name='isMagical' onchange='createMagicItemRows()'></td></tr>

<tr id='rowIsWearable'><th><label for='isWearable'>Must be Worn/Held for Effect?</label></th><td><input type='checkbox' id='isWearable' name='isWearable'></td></tr>

<tr id='rowIsConsumable'><th><label for='isConsumable'>Object is Consumable?</label></th><td><input type='checkbox' id='isConsumable' name='isConsumable' onchange='createConsumableRows()'></td></tr>

<tr id='rowIsCharges'><th><label for='isCharges'>Object has Charges?</label></th><td><input type='checkbox' id='isCharges' name='isCharges' onchange='createChargesRows()'></td></tr>

<tr id='rowIsStackable'><th><label for='isStackable'>Object Stacks with Others in Inventory?</label></th><td><input type='checkbox' id='isStackable' name='isStackable'></td></tr>

<tr id='rowMaterials'><th>Materials Used:</th><td><div class='check-multiple' style='width:100%'>"+ObjectMaterialMultiselection+"</div></td></tr>

<tr id='rowCoating'><th><label for='Coating'>Object Coating:</label></th><td><select id='Coating' name='Coating'><option value=''>None</option>"+ObjectMaterialSelection+"</select></td></tr>

<tr id='rowIntegrity'><th><label for='Integrity'>Integrity:</label></th><td><select id='Integrity' name='Integrity'><option value='Resilient'>Resilient</option><option value='Fragile'>Fragile</option></select></td></tr>

<tr id='rowStateOfMatter'><th><label for='StateOfMatter'>State of Matter:</label></th><td><select id='StateOfMatter' name='StateOfMatter'><option value='Solid'>Solid</option><option value='Liquid'>Liquid</option><option value='Gas'>Gas</option><option value='Plasma'>Plasma</option></select></td></tr>

<tr id='rowIsFlammable'><th><label for='isFlammable'>Object is Flammable:</label></th><td><input type='checkbox' id='isFlammable' name='isFlammable'></td></tr>

<tr id='rowIsMagnetic'><th><label for='isMagnetic'>Object is Magnetic:</label></th><td><input type='checkbox' id='isMagnetic' name='isMagnetic'></td></tr>

<tr id='rowObjectTags'><th>General Object Tags:</th><td><div class='check-multiple' style='width:100%'>"+ObjectMaterialTagMultiselection+"</div></td></tr>

<tr id='rowSourcebook'><th><label for='Library'>Object Sourcebook:</label></th><td><select id='Library' name='Library'>"+sourcebookOptions+"</select></td></tr>

<tr id='rowHasPassiveEffects'><th><label for='HasPassiveEffects'>Object Has Passive Effects:</label></th><td><input type='checkbox' id='HasPassiveEffects' name='HasPassiveEffects'></td></tr>

<tr id='rowHasActiveEffects'><th><label for='HasActiveEffects'>Object Has Active Effects:</label></th><td><input type='checkbox' id='HasActiveEffects' name='HasActiveEffects'></td></tr>

<tr><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Submit'></th></tr>"]

[h:html.dialog5("ObjectCreation","lib://pm.a5e.core/CreateObject.html?cachelib=false","value="+base64.encode(ObjectHTML)+"; closebutton=0; height=800")]