[h:jsonToModify = arg(0)]
[h:keysToConvert = json.fields(jsonToModify)]

[h,foreach(tempKey,keysToConvert),CODE:{
    [h:isNumberTest = isNumber(json.get(jsonToModify,tempKey))]
    [h,if(isNumberTest): jsonToModify = json.set(jsonToModify,tempKey,number(json.get(jsonToModify,tempKey)))]
	[h,if(json.get(jsonToModify,tempKey) == "on"): jsonToModify = json.set(jsonToModify,tempKey,1)]
}]

[h:macro.return = jsonToModify]