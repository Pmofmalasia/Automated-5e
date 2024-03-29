[h:startingSize = arg(0)]
[h:changeDirection = arg(1)]
[h:changeAmount = arg(2)]

[h:sizeArray = json.append("","Fine","Diminutive","Tiny","Small","Medium","Large","Huge","Gargantuan","Colossal")]

[h:startingIndex = json.indexOf(sizeArray,startingSize)]
[h,if(changeDirection): newIndex = startingIndex + changeAmount; newIndex = startingIndex - changeAmount]

[h,if(newIndex<0),CODE:{
	[h:finalSize = "Fine"]
};{
	[h,if(newIndex > json.length(sizeArray)-1): finalSize = "Colossal"; finalSize = json.get(sizeArray,newIndex)]
}]

[h:macro.return = json.get(sizeArray,newIndex)]