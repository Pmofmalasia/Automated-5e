[h,if(argCount()>0): switchToken(arg(0))]
[h:ArmorItemID = getProperty("a5e.stat.EquippedArmor")]
[h,if(ArmorItemID == ""),CODE:{
	[h:return(0,"")]
};{
	[h:tempArmorItemData = json.path.read(getProperty("a5e.stat.Inventory"),"[*][?(@.ItemID == "+ArmorItemID+")]")]
	[h,if(json.isEmpty(tempArmorItemData)): assert(0,"Error: Equipped armor not found in inventory!")]
	[h:ArmorItemData = json.get(tempArmorItemData,0)]
	[h:return(0,ArmorItemData)]
}]