[h:OldRollData = arg(0)]
[h:RerollInfo = arg(1)]

[h,if(RerollInfo==""),CODE:{
    [h:macro.return = OldRollData]
};{
    [h,if(json.get(RerollInfo,"ForcedAdvantage")=="" || json.get(RerollInfo,"ForcedAdvantage")==0),CODE:{
        [h:NewAdvantage = if(json.get(RerollInfo,"Advantage")=="",0,json.get(RerollInfo,"Advantage"))]
        [h:NewDisadvantage = if(json.get(RerollInfo,"Disadvantage")=="",0,json.get(RerollInfo,"Disadvantage"))]
        [h:NewAdvantage = if(json.get(RerollInfo,"Advantage")=="",0,json.get(RerollInfo,"Advantage"))]
        [h:NewDisadvantage = if(json.get(RerollInfo,"Disadvantage")=="",0,json.get(RerollInfo,"Disadvantage"))]
        [h:OldRollData = json.set(OldRollData,
            "Advantage",json.get(OldRollData,"Advantage")+NewAdvantage,
            "Disadvantage",json.get(OldRollData,"Disadvantage")+NewDisadvantage
        )]
    };{
        [h:NewAdvantage = if(json.get(RerollInfo,"Advantage")=="",0,json.get(RerollInfo,"Advantage"))]
        [h:NewDisadvantage = if(json.get(RerollInfo,"Disadvantage")=="",0,json.get(RerollInfo,"Disadvantage"))]
        [h:OldRollData = json.set(OldRollData,
            "Advantage",NewAdvantage,
            "Disadvantage",NewDisadvantage,
            "ForcedAdvantage",1
        )]
    }]

    [h:chooseRoll = if(json.get(RerollInfo,"ChooseRoll")=="",0,json.get(RerollInfo,"ChooseRoll"))]

    [h,if(chooseRoll==1):
        OldRollData = json.set(OldRollData,
            "Advantage",0,
            "Disadvantage",0,
            "ForcedAdvantage",1
    )]

    [h:"<!-- 1 = replace all rolls; 2 = keep only the final roll; anything else = keep all rolls -->"]

    [h,switch(json.get(RerollInfo,"ReplacePrevious")):
        case 1: OldRollData = json.set(OldRollData,"d20Rolls","");
        case 2: OldRollData = json.set(OldRollData,"d20Rolls",json.append("",json.get(OldRollData,"FinalRoll")));
        default: ""
    ]

    [h,if(json.get(RerollInfo,"ExtraRolls")!=""):
        OldRollData = json.set(OldRollData,
            "ExtraRolls",if(
                json.get(OldRollData,"ExtraRolls")=="",
                    json.get(RerollInfo,"ExtraRolls"),
                    json.get(OldRollData,"ExtraRolls")+json.get(RerollInfo,"ExtraRolls")
                )
            )
    ]
}]

[h:macro.return = OldRollData]