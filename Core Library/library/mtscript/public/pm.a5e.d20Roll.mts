[h:d20Data = arg(0)]
[h,if(argCount()>1),CODE:{
	[h,if(arg(1) != ""):
    	d20PassivePrefixes = if(json.type(arg(1))=="UNKNOWN",json.append("",arg(1)),arg(1));
		d20PassivePrefixes = "[]"
	]
};{
	[h:d20PassivePrefixes = "[]"]
}]
[h,if(argCount()>2): 
    d20Target = arg(2);
    d20Target = ""
]

[h:d20AllRolls = if(json.get(d20Data,"d20Rolls")=="","[]",json.get(d20Data,"d20Rolls"))]
[h:d20ExtraRolls = if(json.get(d20Data,"ExtraRolls")=="",0,json.get(d20Data,"ExtraRolls"))]

[h:d20ForcedResult = json.get(d20Data,"ForcedResult")]
[h:d20MinimumResult = json.get(d20Data,"MinimumResult")]
[h:d20MaximumResult = json.get(d20Data,"MaximumResult")]

[h,foreach(prefix,d20PassivePrefixes),CODE:{
	[h:pm.PassiveFunction(prefix+"Roll")]
	[h,if(d20Target != ""): pm.PassiveFunction(prefix+"RollTargeted",json.set("","ParentToken",d20Target))]  
}]

[h,if(d20ForcedResult != ""),CODE:{
	[h:d20ForcedAdvantage = 1]
	[h:d20Advantage = 0]
	[h:d20Disadvantage = 0]
};{
	[h:d20ForcedAdvantage = if(json.get(d20Data,"ForcedAdvantage")=="",0,json.get(d20Data,"ForcedAdvantage"))]
	[h:d20Advantage = if(json.get(d20Data,"Advantage")=="",0,json.get(d20Data,"Advantage"))]
	[h:d20Disadvantage = if(json.get(d20Data,"Disadvantage")=="",0,json.get(d20Data,"Disadvantage"))]	
}]

[h:d20AdvantageMessageArray = json.get(d20Data,"AdvantageMessageArray")]

[h:d20RolledNum = 1 + d20ExtraRolls]

[h,if(d20ForcedAdvantage==0),CODE:{
    [h,foreach(prefix,d20PassivePrefixes),CODE:{
        [h:pm.PassiveFunction(prefix+"Adv")]
        [h,if(d20Target != ""): pm.PassiveFunction(prefix+"AdvTargeted",json.set("","ParentToken",d20Target))]  
    }]
    [h:d20AdvantageBalance = if(or(and(d20Disadvantage == 0,d20Advantage == 0),and(d20Disadvantage !=0,d20Advantage != 0)),0,if(d20Disadvantage == 0,1,-1))]
    [h:d20RolledNum = if(d20AdvantageBalance!=0,d20RolledNum + 1,d20RolledNum)]
};{
    [h:d20ForcedAdvantageBalance = if(or(and(d20Disadvantage == 0,d20Advantage == 0),and(d20Disadvantage != 0,d20Advantage != 0)),0,if(d20Disadvantage == 0,1,-1))]

    [h,switch(d20ForcedAdvantageBalance),CODE:
        case -1:{
			[h:d20AdvantageBalance = -1]
			[h:d20RolledNum = d20RolledNum + 1]
            [h:d20ForcedAdvantageMessage = "Disadvantage Forced"]
        };
        case 0:{
			[h:d20AdvantageBalance = 0]
            [h,if(d20ForcedResult ==""):
				d20ForcedAdvantageMessage = "Neutral Roll Forced"; 
				d20ForcedAdvantageMessage = "Result Forced"
			]
        };
        case 1:{
			[h:d20AdvantageBalance = 1]
			[h:d20RolledNum = d20RolledNum + 1]
            [h:d20ForcedAdvantageMessage = "Advantage Forced"]
        }
    ]

    [h,if(!json.contains(d20AdvantageMessageArray,d20ForcedAdvantageMessage)): d20AdvantageMessageArray = json.merge("['"+d20ForcedAdvantageMessage+"']",d20AdvantageMessageArray)]
}]

[h,if(d20ForcedResult == ""),CODE:{
	[h:d20RolledNum = d20RolledNum - json.length(d20AllRolls)]
	[h,if(d20RolledNum < 0),CODE:{
		[h,count(abs(d20RolledNum)): d20AllRolls = if((json.length(d20AllRolls)-1-roll.count)<1,d20AllRolls,json.remove(d20AllRolls,max(0,json.length(d20AllRolls)-1-roll.count)))]
	};{
		[h,count(d20RolledNum): d20AllRolls = json.append(d20AllRolls,1d20)]
	}]
};{
	[h:d20AllRolls = json.append("",d20ForcedResult)]
}]

[h,foreach(tempRoll,d20AllRolls),CODE:{
	[h:finalRoll = tempRoll]
	[h,if(d20MinimumResult != ""): finalRoll = if(finalRoll < d20MinimumResult,d20MinimumResult,finalRoll)]
	[h,if(d20MaximumResult != ""): finalRoll = if(finalRoll > d20MaximumResult,d20MaximumResult,finalRoll)]
	[h:d20AllRolls = json.set(d20AllRolls,roll.count,finalRoll)]
}]

[h:d20TotalRolled = json.length(d20AllRolls)]