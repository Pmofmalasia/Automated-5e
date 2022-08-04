[h:d20Data = arg(0)]
[h,if(argCount()>1):
    d20PassivePrefixes = if(json.type(arg(1))=="UNKNOWN",json.append("",arg(1)),arg(1));
    d20PassivePrefixes = "[]"
]

[h:d20AllRolls = if(json.get(d20Data,"PreviousRoll")=="","[]",json.get(d20Data,"PreviousRoll"))]
[h:d20ExtraRolls = if(json.get(d20Data,"ExtraRolls")=="",0,json.get(d20Data,"ExtraRolls"))]
[h:d20ForcedAdvantage = if(json.get(d20Data,"ForcedAdvantage")=="",0,json.get(d20Data,"ForcedAdvantage"))]
[h:d20Advantage = json.get(d20Data,"Advantage")]
[h:d20Disadvantage = json.get(d20Data,"Disadvantage")]

[h:d20RolledNum = 1 + d20ExtraRolls]

[h,if(d20ForcedAdvantage==0),CODE:{
    [h,foreach(prefix,d20PassivePrefixes): pm.PassiveFunction(prefix+"Adv")]
    [h:d20AdvantageBalance = if(or(and(d20Disadvantage == 0,d20Advantage == 0),and(d20Disadvantage !=0,d20Advantage != 0)),0,if(d20Disadvantage == 0,1,-1))]
    [h:d20RolledNum = if(d20AdvantageBalance!=0,d20RolledNum + 1,d20RolledNum)]
};{
    [h:d20ForcedAdvantageBalance = if(or(and(d20Disadvantage == 0,d20Advantage == 0),and(d20Disadvantage !=0,d20Advantage != 0)),0,if(d20Disadvantage == 0,1,-1))]

    [h,switch(d20ForcedAdvantageBalance),CODE:
        case -1:{
			[h:d20AdvantageBalance = -1]
			[h:d20RolledNum = d20RolledNum + 1]
        };
        case 0:{
			[h:d20AdvantageBalance = 0]
        };
        case 1:{
			[h:d20AdvantageBalance = 1]
			[h:d20RolledNum = d20RolledNum + 1]
        }
    ]
}]

[h:d20RolledNum = d20RolledNum - json.length(d20AllRolls)]
[h,if(d20RolledNum < 0),CODE:{
	[h,count(abs(d20RolledNum)): d20AllRolls = if((json.length(d20AllRolls)-1-roll.count)<1,d20AllRolls,json.remove(d20AllRolls,max(0,json.length(d20AllRolls)-1-roll.count)))]
};{
	[h,count(d20RolledNum): d20AllRolls = json.append(d20AllRolls,1d20)]
}]