[h:allRangeData = arg(1)]
[h:pm.RangeNum = json.get(allRangeData,"Value")]
[h:pm.RangeUnits = json.get(allRangeData,"Units")]
[h:pm.RangeType = json.get(allRangeData,"Type")]

[h,switch(pm.RangeType),CODE:
    case "Self":{ 
        [h,if(pm.RangeNum==""),CODE:{
            [h:pm.RangeNum = 5]
            [h:pm.RangeUnits = "feet"]
        };{}]
    };
    case "Touch":{
        [h:"<!-- TO CHANGE: default range to minimum of 'touch distance' 'stat' and range given -->"]
        [h,if(pm.RangeNum==""),CODE:{
            [h:pm.RangeNum = 5]
            [h:pm.RangeUnits = "feet"]
        };{}]
    };
    default: {}
]

[h:currentFeatureRangeUnits = pm.StandardRange(pm.RangeUnits)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:"<!-- TODO: Re-add magic item changing range here -->"]

[h:currentFeatureRange = pm.RangeNum]

[h:abilityTable = json.append(abilityTable,json.set("",
    "ShowIfCondensed",0,
    "Header","Range",
    "FalseHeader","",
    "FullContents","",
    "RulesContents",if(or(pm.RangeType=="Other",pm.RangeType=="Touch",pm.RangeType=="Self"),"",currentFeatureRange+" ")+currentFeatureRangeUnits,
    "RollContents","",
    "DisplayOrder","['Rules','Roll','Full']"
))]

[h:return(!IsTooltip)]
	
[h:effectsToMerge = json.append("",json.set("","Range",json.set("","Value",currentFeatureRange,"Units",currentFeatureRangeUnits)))]

[h,MACRO("Build Effect@Lib:pm.a5e.Core"): json.set("","CurrentEffects",pm.a5e.EffectData,"ToMerge",effectsToMerge,"BaseEffect",pm.a5e.BaseEffectData,"WhichEffect",whichEffect)]

[h:pm.a5e.EffectData = macro.return]