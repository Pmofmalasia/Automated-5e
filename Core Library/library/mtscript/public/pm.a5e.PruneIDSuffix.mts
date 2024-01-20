[h:DataSource = arg(0)]
[h:DataDestination = arg(1)]
[h:IDSuffix = arg(2)]
[h:KeysToConvert = arg(3)]

[h,foreach(key,KeysToConvert),CODE:{
	[h,if(json.contains(DataSource,key+IDSuffix)),CODE:{
		[h:DataDestination = json.set(DataDestination,key,json.get(DataSource,key+IDSuffix))]
		[h:DataSource = json.remove(DataSource,key+IDSuffix)]
	}]
}]

[h:"<!-- Note: This does not work if DataSource and DataDestination are meant to be the same object -->"]
[h:return(0,json.set("","Source",DataSource,"Destination",DataDestination))]