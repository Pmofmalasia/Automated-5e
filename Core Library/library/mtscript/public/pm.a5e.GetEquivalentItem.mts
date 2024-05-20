[h:Item = arg(0)]
[h:Inventory = arg(1)]

[h:Item = json.remove(Item,"ItemID")]
[h:Item = json.remove(Item,"Number")]

[h:RelatedObjects = json.path.delete(Inventory,"\$[*][?(@.ObjectID != '"+json.get(Item,"ItemID")+"')]")]

[h:RelatedObjectsComparable = json.path.delete(RelatedObjects,"\$[*]['ItemID']")]
[h:RelatedObjectsComparable = json.path.delete(RelatedObjectsComparable,"\$[*]['Number']")]

[h:hasItemTest = json.intersection(RelatedObjectsComparable,json.append("",Item))]
[h,if(json.isEmpty(hasItemTest)),CODE:{
	[h:return(0,"{}")]
};{
	[h,if(json.length(hasItemTest) == json.length(RelatedObjectsComparable)): return(0,json.get(RelatedObjects,0))]
	
	[h,foreach(tempItem,RelatedObjects),CODE:{
		[h:comparableItem = json.remove(tempItem,"ItemID")]
		[h:comparableItem = json.remove(comparableItem,"Number")]
		[h,if(json.equals(Item,comparableItem)): return(0,json.get(RelatedObjects,roll.count))]
	}]

	[h:return(0,"{}")]
}]