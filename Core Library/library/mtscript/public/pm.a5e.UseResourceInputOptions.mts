[h:resourceData = arg(0)]
[h:min = json.get(resourceData,"Minimum")]
[h:max = json.get(resourceData,"Maximum")]
[h:increment = json.get(resourceData,"Increment")]

[h:options = "[0]"]
[h,if(json.type(increment) == "ARRAY"),CODE:{
	[h:currentAmount = min]
	[h,while(currentAmount <= max),CODE:{
		[h:options = json.append(options,currentAmount)]
		[h:currentAmount = currentAmount + increment]
	}]
};{
	[h,foreach(amount,increment),CODE:{
		[h,if(amount <= max): options = json.append(options,amount)]
	}]
}]

[h:return(0,options)]