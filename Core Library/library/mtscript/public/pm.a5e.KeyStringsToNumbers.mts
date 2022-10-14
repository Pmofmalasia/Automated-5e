[h:jsonToModify = arg(0)]
[h:keysToConvert = arg(1)]

[h,foreach(tempKey,keysToConvert),CODE:{
    [h:isNumberTest = isNumber(json.get(jsonToModify,tempKey))]
    [h,if(isNumberTest): jsonToModify = json.set(jsonToModify,tempKey,number(json.get(jsonToModify,tempKey)))]
}]

[h:macro.return = jsonToModify]