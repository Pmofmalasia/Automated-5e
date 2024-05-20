[h:TradedItem = arg(0)]
[h:GivenToToken = arg(1)]
[h:TakenFromToken = arg(2)]

[h:"<!-- TODO: Will need to be fleshed out more if there is more distinction between active due to attuned vs. worn vs. held -->"]

[h,if(json.get(TradedItem,"isWearable") == 1),CODE:{
	[h:TradedItem = json.set(TradedItem,"IsActive",0)]
};{
	[h,if(json.get(TradedItem,"isAttunement") == 1): TradedItem = json.set(TradedItem,"IsActive",(json.get(TradedItem,"AttunedTo") == GivenToToken))]
}]

[h:return(0,TradedItem)]