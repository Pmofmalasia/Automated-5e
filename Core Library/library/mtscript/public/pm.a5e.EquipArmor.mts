[h:newArmorID = arg(0)]
[h:ParentToken = arg(1)]
[h:switchToken(ParentToken)]

[h:oldArmorID = getProperty("a5e.stat.EquippedArmor")]
[h:inventory = getProperty("a5e.stat.Inventory")]

[h,if(newArmorID == oldArmorID): return(0,json.set("",
	"Success",0,
	"Table","[]"
))]

[h:deactivateArmorTest = (oldArmorID != "")]
[h,if(deactivateArmorTest): UnequipOnlyTableLine = json.get(json.get(pm.a5e.UnequipArmor(oldArmorID,ParentToken),"Table"),0)]

[h:setProperty("a5e.stat.EquippedArmor",newArmorID)]
[h:activateArmorTest = (newArmorID != "")]
[h,if(activateArmorTest),CODE:{
	[h:newArmorData = json.get(json.path.read(inventory,"\$[*][?(@.ItemID == '"+newArmorID+"')]"),0)]
	[h:AttunementTest = pm.a5e.CheckAttunement(newArmorData,ParentToken)]
	[h,if(AttunementTest): newArmorData = json.set(newArmorData,"IsActive",1)]
	[h:newArmorDisplayName = json.get(newArmorData,"DisplayName")]
	[h:inventory = json.path.set(inventory,"\$[*][?(@.ItemID == '"+newArmorID+"')]",newArmorData)]
};{
	[h:newArmorDisplayName = ""]
}]

[h:setProperty("a5e.stat.Inventory",inventory)]

[h:ArmorTableLine = json.set("",
	"ShowIfCondensed",0,
	"Header","Armor",
	"FalseHeader","",
	"FullContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
)]

[h,switch((deactivateArmorTest)+""+(activateArmorTest)),CODE:
	case "01":{
		[h:ArmorTableLine = json.set(ArmorTableLine,
			"RulesContents",newArmorDisplayName+" Equipped",
			"ShowIfCondensed",1
		)]
	};
	case "10":{
		[h:ArmorTableLine = UnequipOnlyTableLine]
	};
	case "11":{
		[h:ArmorTableLine = json.set(ArmorTableLine,
			"RulesContents",newArmorDisplayName+" Equipped",
			"ShowIfCondensed",(oldArmorID != newArmorID)
		)]
	};
	case "00":{
		[h:ArmorTableLine = json.set(ArmorTableLine,
			"RulesContents","Unarmored",
			"ShowIfCondensed",0
		)]
	}
]

[h:return(0,json.set("",
	"Success",1,
	"Table",json.append("",ArmorTableLine)
))]