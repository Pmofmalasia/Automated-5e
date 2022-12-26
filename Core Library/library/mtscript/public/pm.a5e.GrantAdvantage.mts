[h:d20Advantage = d20Advantage + 1]

[h,if(argCount()>0),CODE:{
    [h:d20AdvantageMessageArray = json.append(d20AdvantageMessageArray,arg(0))]
}]