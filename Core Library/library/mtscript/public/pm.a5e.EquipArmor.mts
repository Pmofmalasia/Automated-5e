[h:newArmorID = arg(0)]
[h:ParentToken = arg(1)]
[h:switchToken(ParentToken)]

[h:oldArmorID = getProperty("a5e.stat.EquippedArmor")]

[h:setProperty("a5e.stat.EquippedArmor",newArmorID)]
[h,if(newArmorID!=""): NewInventory = json.path.set(NewInventory,"\$[*][?(@.ItemID == '"+newArmorID+"')]['IsActive']",1)]

[h:ArmorTableLine = json.set("",
	"ShowIfCondensed",0,
	"Header","Armor",
	"FalseHeader","",
	"FullContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
)]

[h,switch((oldArmorID == "")+""+(newArmorID == "")),CODE:
	case "01":{
		[h:OldArmorName = json.get(json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+oldArmorID+"')]['DisplayName']"),0)]

		[h:ArmorTableLine = json.set(ArmorTableLine,
			"RulesContents",OldArmorName+" Unequipped",
			"ShowIfCondensed",1
		)]
	};
	case "10":{
		[h:ArmorName = json.get(json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+newArmorID+"')]['DisplayName']"),0)]

		[h:ArmorTableLine = json.set(ArmorTableLine,
			"RulesContents",ArmorName+" Equipped",
			"ShowIfCondensed",1
		)]
	};
	case "11":{
		[h:ArmorTableLine = json.set(ArmorTableLine,
			"RulesContents","Unarmored",
			"ShowIfCondensed",0
		)]
	};
	case "00":{
		[h:ArmorName = json.get(json.path.read(NewInventory,"\$[*][?(@.ItemID == '"+newArmorID+"')]['DisplayName']"),0)]

		[h:ArmorTableLine = json.set(ArmorTableLine,
			"RulesContents",ArmorName+" Equipped",
			"ShowIfCondensed",(oldArmorID != newArmorID)
		)]
	}
]

[h:return(0,json.set("",
	"Success","1",
	"Table",ArmorTableLine
))]