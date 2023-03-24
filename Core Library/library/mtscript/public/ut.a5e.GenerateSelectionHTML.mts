[h:CreationData = arg(0)]
[h,if(argCount()>1),CODE:{
	[h:isMultiCheckbox = arg(1)]
	[h:prefix = arg(2)]
};{
	[h:isMultiCheckbox = 0]
	[h:prefix = ""]
}]

[h:SelectionHTML = ""]
[h,if(isMultiCheckbox),CODE:{
	[h,foreach(tempIndex,CreationData),CODE:{
		[h:tempName = json.get(tempIndex,"Name")]
		[h,if(argCount()>3):
			SelectionHTML = SelectionHTML + "<label><input type='checkbox' id='"+prefix+tempName+"' name='"+prefix+tempName+"' onchange='"+arg(3)+"("+'"'+tempName+'"'+")'><span>"+json.get(tempIndex,"DisplayName")+"</span></label>";
			SelectionHTML = SelectionHTML + "<label><input type='checkbox' id='"+prefix+tempName+"' name='"+prefix+tempName+"'><span>"+json.get(tempIndex,"DisplayName")+"</span></label>"
		]
	}]
};{
	[h,foreach(tempIndex,CreationData): SelectionHTML = SelectionHTML + "<option value='"+json.get(tempIndex,"Name")+"'>"+json.get(tempIndex,"DisplayName")+"</option>"]
}]

[h:return(0,SelectionHTML)]