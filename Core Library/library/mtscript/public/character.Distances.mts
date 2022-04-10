[h:numSelected = json.length(getSelected("json"))]
[r,if(numSelected==1),CODE:{
	[r:getDistance(getSelected())]
};{}]