[h:Item = arg(0)]
[h:Inventory = arg(1)]

[h:Item = json.remove(Item,"ItemID")]
[h:Item = json.remove(Item,"Number")]

[h:"<!-- Note: Safe is used because json.path.delete changes RelatedObjects even though it's not told to -->"]
[h:RelatedObjectsSafe = json.path.read(Inventory,"\$[*][?(@.ObjectID == '"+json.get(Item,"ObjectID")+"')]")]
[h:RelatedObjects = json.path.read(Inventory,"\$[*][?(@.ObjectID == '"+json.get(Item,"ObjectID")+"')]")]

[h:RelatedObjectsComparable = json.path.delete(RelatedObjects,"\$[*]['ItemID']")]
[h:RelatedObjectsComparable = json.path.delete(RelatedObjectsComparable,"\$[*]['Number']")]

[h:hasItemTest = json.intersection(RelatedObjectsComparable,json.append("",Item))]
[h,if(json.isEmpty(hasItemTest)),CODE:{
	[h:return(0,"{}")]
};{
	[h,if(json.length(hasItemTest) == json.length(RelatedObjectsComparable)): return(0,json.get(RelatedObjectsSafe,0))]

	[h,foreach(tempItem,RelatedObjectsComparable),CODE:{
		[h,if(json.equals(Item,tempItem)): return(0,json.get(RelatedObjectsSafe,roll.count))]
	}]

	[h:return(0,"{}")]
}]