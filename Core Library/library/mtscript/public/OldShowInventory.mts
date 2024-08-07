[h:ShowInventoryData = macro.args]
[h:ParentToken = json.get(ShowInventoryData,"ParentToken")]
[h:CurrentInventory = getProperty("a5e.stat.Inventory")]

[h:TableCellFormat = "<td style='text-align:center; padding-left:4px'>"]

[h:"<!-- TODO: Rework following colors to be adjustable -->"]
[h:InventoryHTML = "<tr><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Item<input type='hidden' id='ParentToken' name='ParentToken' value='"+ParentToken+"'></th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Number</th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Weight</th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Use?</th></tr>"]

[h:TotalWeight = 0]
[h,foreach(tempItem,CurrentInventory),CODE:{
	[h:tempDisplayName = json.get(tempItem,"DisplayName")]
	[h,if(length(tempDisplayName) > 21): tempDisplayName = "<span title='"+tempDisplayName+"'>"+substring(tempDisplayName,0,18)+"...</span>"]

	[h:tempNumber = json.get(tempItem,"Number")]
	[h:tempWeight = json.get(tempItem,"Weight")]
	[h:tempTotalWeight = number(tempWeight) * number(tempNumber)]
	[h:weightNeedsRounding = (tempWeight != floor(tempWeight))]

	[h:tempResourceData = evalMacro(json.get(tempItem,"MaxResource"))]
	[h,if(json.type(tempResourceData) == "OBJECT"),CODE:{
		[h:tempNumberDisplay = ""]
		[h:resourceNames = json.fields(tempResourceData)]
		[h,foreach(resource,resourceNames): tempNumberDisplay = listAppend(tempNumberDisplay,json.get(json.get(tempItem,"ResourceDisplayName"),resource)+": "+json.get(json.get(tempItem,"Resource"),resource)+"<b>/</b>"+json.get(tempResourceData,resource),"<br>")]
	};{
		[h,if(tempResourceData == ""):
			tempNumberDisplay = tempNumber;
			tempNumberDisplay = json.get(tempItem,"Resource")+"<b>/</b>"+evalMacro(json.get(tempItem,"MaxResource"))
		]
	}]

	[h:tempUseButton = ""]
	[h:tempEffects = json.get(tempItem,"Effects")]
	[h,if(tempEffects != "" && json.get(tempItem,"IsActive")),CODE:{
		[h:tempLink = macroLinkText("UseItem@Lib:pm.a5e.Core","self-gm",json.set(tempItem,"ParentToken",ParentToken),ParentToken)]
		[h:tempUseButton = "<a href = '"+tempLink+"'>Use</a>"]
	};{}]

	[h,if(json.get(tempItem,"isActivatable") == 1),CODE:{
		[h:NeedsActivation = json.get(tempItem,"IsActive") < 1]
		[h:tempActivationLink = macroLinkText("ActivateItem@Lib:pm.a5e.Core","self-gm",json.set("","Item",json.get(tempItem,"ItemID"),"Activate",NeedsActivation,"ParentToken",ParentToken),ParentToken)]
		[h,if(tempUseButton != ""): tempUseButton = tempUseButton + " / "]
		[h:tempUseButton = "<a href = '"+tempActivationLink+"'>"+if(NeedsActivation,"Activate","Deactivate")+"</a>"]
	};{}]

	[h,if(json.get(tempItem,"ItemSpellcasting") != "" && json.get(tempItem,"IsActive")),CODE:{
		[h:tempActivationLink = macroLinkText("ItemSpellcastingInput@Lib:pm.a5e.Core","self-gm",json.set("","ItemID",json.get(tempItem,"ItemID"),"ParentToken",ParentToken,"IsTooltip",0),ParentToken)]
		[h,if(tempUseButton != ""): tempUseButton = tempUseButton + " / "]
		[h:tempUseButton = "<a href = '"+tempActivationLink+"'>Cast Spell</a>"]
	};{}]

	[h,if(tempUseButton == ""): tempUseButton = "---"]

	[h:InventoryHTML = InventoryHTML + "<tr draggable='true' ondragstart='dragItem(event)' ondrop='dropItem(event)' ondragover='allowDrop(event)' id='rowItemID"+json.get(tempItem,"ItemID")+"'>"+TableCellFormat+tempDisplayName+"</td>"+TableCellFormat+tempNumberDisplay+"</td>"+TableCellFormat+"<span title='"+tempWeight+" Each'>"+if(weightNeedsRounding,round(tempTotalWeight,1),tempTotalWeight)+"</span></td>"+TableCellFormat+tempUseButton+"</td></tr>"]

	[h:TotalWeight = TotalWeight + tempTotalWeight]
}]

[h:InventoryHTML = InventoryHTML + "<tr ondrop='dropItem(event)' ondragover='allowDrop(event)'><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Weight Data</th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Total Carried</th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Carry Capacity</th><th style = 'text-align:center; background-color:#504A40; color#FAF9F7; width:120px;'>Push Capacity</th></tr>"]

[h:WeightData = stat.a5e.CarryCapacity(json.set("","ParentToken",ParentToken))]
[h:totalWeightNeedsRounding = (TotalWeight != floor(TotalWeight))]
[h:InventoryHTML = InventoryHTML + "<tr>"+TableCellFormat+" --- </td>"+TableCellFormat+if(totalWeightNeedsRounding,round(TotalWeight,1),floor(TotalWeight))+"</td>"+TableCellFormat+json.get(WeightData,"Carry")+"</td>"+TableCellFormat+json.get(WeightData,"Push")+"</td></tr>"]

[h:html.frame5("Inventory"+ParentToken,"lib://pm.a5e.core/ShowInventory.html?cachelib=false","value="+base64.encode(InventoryHTML)+"; closebutton=0; height=300")]