[h:GiveItemData = macro.args]
[h:ParentToken = json.get(GiveItemData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:CurrentInventory = getProperty("a5e.stat.Inventory")]
[h:GiveItemInputHTML = "<tr id='rowHeader'><th text-align='center' colspan='2'>Give Other Tokens Items</th></tr><input type='hidden' id='ParentToken' name='ParentToken' value='"+ParentToken+"'><input type='hidden' id='Inventory' value='"+CurrentInventory+"'>"]

[h:TokensInRange = getTokens("json",json.set("","range",json.set("","distancePerCell",1,"upto",5),"layer",json.append("","TOKEN","OBJECT")))]
[h:TokensInRangeOptions = ""]
[h,foreach(tempToken,TokensInRange): TokensInRangeOptions = TokensInRangeOptions + "<option value='"+tempToken+"'><img src='"+getTokenImage(50,tempToken)+"'> "+getName(tempToken)+"</option>"]

[h:GiveItemInputHTML = GiveItemInputHTML + "<tr id='rowGiveToChoice'><th><label for='GiveToChoice'>Give Item To:</label></th><td><select id='GiveToChoice' name='GiveToChoice'>"+TokensInRangeOptions+"</select></td></tr>"]

[h:ItemOptions = ""]
[h,foreach(tempItem,CurrentInventory): ItemOptions = ItemOptions + "<option value='"+json.get(tempItem,"ItemID")+"'>"+json.get(tempItem,"DisplayName")+"</option>"]
[h:GiveItemInputHTML = GiveItemInputHTML + "<tr id='rowItemChoice'><th><label for='ItemChoice'>Item To Give:</label></th><td><select id='ItemChoice' name='ItemChoice' onchange='adjustMaxNumber()'>"+ItemOptions+"</select></td></tr>"]

[h:GiveItemInputHTML = GiveItemInputHTML + "<tr id='rowNumberGiven'><th><label for='NumberGiven'>Number Given:</label></th><td><input type='number' id='NumberGiven' name='NumberGiven' min=1 value="+json.get(json.get(CurrentInventory,0),"Number")+" style='width:35px'> (Maximum "+json.get(json.get(CurrentInventory,0),"Number")+")</td></tr>"]

[h:GiveItemInputHTML = GiveItemInputHTML + "<tr id='rowSubmit'><th text-align='center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Give Item'></th></tr>"]

[h:html.dialog5("GiveItemInput","lib://pm.a5e.core/GiveItem.html?cachelib=false","value="+base64.encode(GiveItemInputHTML)+"; width=500; height=285; closebutton=0")]