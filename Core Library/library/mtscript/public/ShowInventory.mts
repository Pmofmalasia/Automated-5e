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

	[h,if(json.get(tempItem,"MaxResource") == ""):
		tempNumberDisplay = tempNumber;
		tempNumberDisplay = json.get(tempItem,"Resource")
	]

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

	[h:InventoryHTML = InventoryHTML + "<tr>"+TableCellFormat+tempDisplayName+"</td>"+TableCellFormat+tempNumberDisplay+"</td>"+TableCellFormat+"<span title='"+tempWeight+" Each'>"+tempTotalWeight+"</span></td>"+TableCellFormat+tempUseButton+"</td></tr>"]
}]

[h:html.frame5("Inventory","lib://pm.a5e.core/ShowInventory.html?cachelib=false","value="+base64.encode(InventoryHTML)+"; closebutton=0; height=300")]