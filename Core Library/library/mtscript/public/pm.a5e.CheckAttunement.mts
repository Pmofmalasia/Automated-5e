[h:itemData = arg(0)]
[h:ParentToken = arg(1)]

[h:reqAttune = number(json.get(itemData,"isAttunement"))]
[h,if(reqAttune):
	return(0,json.get(itemData,"AttunedTo") == ParentToken);
	return(0,1)
]