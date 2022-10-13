[h:jsonToModify = arg(0)]
[h:keysToConvert = arg(1)]

[h,foreach(tempKey,keysToConvert): jsonToModify = json.set(jsonToModify,tempKey,number(json.get(jsonToModify,tempKey)))]

[h:macro.return = jsonToModify]