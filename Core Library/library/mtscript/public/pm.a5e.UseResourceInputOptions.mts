[h:resourceData = arg(0)]
[h:min = json.get(resourceData,"Minimum")]
[h:max = json.get(resourceData,"Maximum")]
[h:increment = json.get(resourceData,"Increment")]

[h:"<!-- TODO: Resource - Need the ability to spend 0 resource if multiple resources can be spent at the same time (Hit Dice) -->"]
[h:options = ""]
[h,if(json.type(increment) == "ARRAY"),CODE:{
	[h:currentAmount = min]
	[h,while(currentAmount <= max),CODE:{
		[h:options = json.append(options,currentAmount)]
		[h:currentAmount = currentAmount + increment]
	}]
};{
	[h:currentAmount = min]
	[h,while(currentAmount <= max),CODE:{
		[h:options = json.append(options,currentAmount)]
		[h:currentAmount = currentAmount + increment]
	}]
}]

[h:return(0,options)]