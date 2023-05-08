[h:ShowInventoryData = macro.args]
[h:ParentToken = json.get(ShowInventoryData,"ParentToken")]
[h:CurrentInventory = getProperty("a5e.stat.Inventory")]

[h:pm.TooltipBorder(json.set("",
    "Class","zzWeaponAttack",
    "Name","Inventory",
    "DisplayName","Inventory"
))]
[h:TableCellFormat = "<td style='text-align:center; padding-left:4px'>"]

[h:InventoryHTML = "<tr><th style = '"+FrameAccentFormat+"'>Item</th><th style = '"+FrameAccentFormat+"'>Number</th><th style = '"+FrameAccentFormat+"'>Weight</th><th style = '"+FrameAccentFormat+"'>Use?</th></tr>"]

[h,foreach(tempItem,CurrentInventory),CODE:{
	[h:tempDisplayName = json.get(tempItem,"DisplayName")]
	[h,if(length(tempDisplayName) > 15): tempDisplayName = "<span title='"+tempDisplayName+"'>"+substring(tempDisplayName,0,12)+"...</span>"]

	[h:tempNumber = json.get(tempItem,"Number")]
	[h:tempWeight = json.get(tempItem,"Weight")]
	[h:tempTotalWeight = number(tempWeight) * number(tempNumber)]

	[h:InventoryHTML = InventoryHTML + "<tr>"+TableCellFormat+tempDisplayName+"</td>"+TableCellFormat+tempNumber+"</td>"+TableCellFormat+"<span title='"+tempWeight+" Each'>"+tempTotalWeight+"</span></td>"+TableCellFormat+"In Dev</td></tr>"]
}]

[h:html.frame5("Inventory","lib://pm.a5e.core/ShowInventory.html?cachelib=false","value="+base64.encode(InventoryHTML)+"; closebutton=0; height=300")]