[h:d20Disadvantage = d20Disadvantage + 1]

[h,if(argCount()>0),CODE:{
    [h:d20AdvantageMessageArray = json.append(d20AdvantageMessageArray,arg(0))]
}]