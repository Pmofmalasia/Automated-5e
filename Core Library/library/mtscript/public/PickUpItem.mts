[h:PickUpItemData = macro.args]
[h:ParentToken = json.get(PickUpItemData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:TokensInRange = getTokens("json",json.set("","range",json.set("","distancePerCell",1,"upto",5),"layer",json.append("","TOKEN","OBJECT"),"propertyType","A5EObject"))]

[h:assert(!json.isEmpty(TokensInRange),"There is nothing within 5 feet to pick up!")]

[h:allTokenInventories = "{}"]
[h,foreach(tempToken,TokensInRange): allTokenInventories = json.set(allTokenInventories,tempToken,getProperty("a5e.stat.Inventory",tempToken))]

[h:PickUpItemHTML = "<tr id='rowHeader'><th text-align='center' colspan='2'>Pick Up Items</th></tr><input type='hidden' id='ParentToken' name='ParentToken' value='"+ParentToken+"'><input type='hidden' id='Inventories' value='"+allTokenInventories+"'>"]

[h:TokensInRangeOptions = ""]
[h,foreach(tempToken,TokensInRange): TokensInRangeOptions = TokensInRangeOptions + "<option value='"+tempToken+"'></option>"]
[h:FirstToken = json.get(TokensInRange,0)]

[h,if(json.length(TokensInRange) == 1):
	PickUpItemHTML = PickUpItemHTML + "<tr id='rowTakeFromChoice'><th><label for='TakeFromChoice'>Taking Items From:</label></th><td><input type='hidden' id='TakeFromChoice' name='TakeFromChoice' value='"+FirstToken+"'><img src='"+getTokenImage(50,FirstToken)+"'> "+getName(FirstToken)+"</td></tr>";
	PickUpItemHTML = PickUpItemHTML + "<tr id='rowTakeFromChoice'><th><label for='TakeFromChoice'>Taking Items From:</label></th><td><select id='TakeFromChoice' name='TakeFromChoice' onchange='adjustInventoryOptions()'>"+TokensInRangeOptions+"</select></td></tr>"
]

[h:ItemOptions = ""]
[h:FirstTokenInventory = getProperty("a5e.stat.Inventory",FirstToken)]
[h,foreach(tempItem,FirstTokenInventory): ItemOptions = ItemOptions + "<option value='"+json.get(tempItem,"ItemID")+"'>"+json.get(tempItem,"DisplayName")+"</option>"]
[h:PickUpItemHTML = PickUpItemHTML + "<tr id='rowItemChoice'><th><label for='ItemChoice'>Item To Take:</label></th><td><select id='ItemChoice' name='ItemChoice' onchange='adjustMaxNumber()'>"+ItemOptions+"</select></td></tr>"]

[h:PickUpItemHTML = PickUpItemHTML + "<tr id='rowNumberTaken'><th><label for='NumberTaken'>Number To Take:</label></th><td><input type='number' id='NumberTaken' name='NumberTaken' min=1 value="+json.get(json.get(FirstTokenInventory,0),"Number")+" style='width:35px'> (Maximum "+json.get(json.get(FirstTokenInventory,0),"Number")+")</td></tr>"]

[h:PickUpItemHTML = PickUpItemHTML + "<tr id='rowSubmit'><th text-align='center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Take Item'></th></tr>"]

[h:html.dialog5("PickUpItem","lib://pm.a5e.core/PickUpItem.html?cachelib=false","value="+base64.encode(PickUpItemHTML)+"; width=500; height=285; closebutton=0")]