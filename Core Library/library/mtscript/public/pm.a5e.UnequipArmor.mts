[h:removedArmorID = arg(0)]
[h:ParentToken = arg(1)]
[h:switchToken(ParentToken)]

[h:inventory = getProperty("a5e.stat.Inventory",ParentToken)]
[h:removedArmorData = json.get(json.path.read(inventory,"\$[*][?(@.ItemID == '"+removedArmorID+"')]"),0)]
[h:removedArmorData = json.set(removedArmorData,"IsActive",0)]
[h:removedArmorDisplayName = json.get(removedArmorData,"DisplayName")]
[h:inventory = json.path.set(inventory,"\$[*][?(@.ItemID == '"+removedArmorID+"')]",removedArmorData)]

[h:setProperty("a5e.stat.EquippedArmor","")]
[h:setProperty("a5e.stat.Inventory",inventory)]

[h:returnData = json.set("",
	"Success",1,
	"Table",json.append("",json.set("",
		"ShowIfCondensed",1,
		"Header","Armor",
		"FalseHeader","",
		"RulesContents",removedArmorDisplayName+" Unequipped",
		"FullContents","",
		"RollContents","",
		"DisplayOrder","['Rules','Roll','Full']")),
	"Inventory",inventory
)]
[h:return(0,returnData)]