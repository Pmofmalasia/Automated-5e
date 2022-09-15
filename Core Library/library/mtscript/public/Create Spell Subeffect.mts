[h:abort(input(
    "junkVar|------------------------------------------------------------------------------------------------------------------- |  | LABEL | SPAN=TRUE",
	"IsAttack |  | Attack Roll | Check ",
	"IsSave |  | Save Required | Check ",
	"IsDamage |  | Heals or Deals Damage | Check ",
	"IsAHL |  | Increased Healing or Damage at Higher Levels | Check ",
	"IsMissiles | |<html><span title='(Magic Missiles, Scorching Ray)'>Is it a Missile Spell</span></html> | Check",
    "junkVar | ---------------------------------------------- Targeting Info ---------------------------------------------- | | LABEL | SPAN=TRUE",
    "RangeType | Self,Touch,Ranged | Range |LIST| VALUE=STRING SELECT="+if(RangeType=="Self",0,if(RangeType=="Touch",1,2)),
    "TargetType | Creature,Object,Creature or Object,Point,Condition,Free Hand | What is Targeted |LIST| VALUE=STRING ",
    "AoEShape | None,Cone,Cube,Cylinder,Half Sphere,Line,Sphere,Wall,Choose From Multiple | Area of Effect |LIST| VALUE=STRING ",
    "secondStepTest |  | <html><span title='e.g. Acid Splash needs to target a creature first, then a creature within 5 feet.'>Needs a Second Step to Complete Targeting</html></span> | CHECK ",
    "junkVar|---------------------------------------------- Target Number Info ----------------------------------------------||LABEL|SPAN=TRUE",
    "sMultiTarget | Unlimited,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 | Maximum Number of Targets | LIST | SELECT=1 ",
    " AHLTargetScaling | No Change,Every Level,Every Other Level,Every Three Levels | How Often Targets Increase AHL | LIST | VALUE=STRING ",
    "sMultiTargetRange | -- N/A -- | <html><span title='Ignore for Single Target, Not Specified By Spell. Look for text like in Charm Person: The creatures must be within X feet of each other when you target them.'>Creatures Must Be Within What Distance of Each Other</span></html> "
))]

[h:dissRangeScalingAHL = if(RangeType=="Ranged","","")]
[h:dissRangeAHL = if(RangeType=="Ranged","","")]
[h,if(RangeType=="Ranged"):
    rangeInput = " junkVar| ---------------------------------------------- Range Info ---------------------------------------------- ||LABEL|SPAN=TRUE ## rangeValue |  | Range ## rangeUnits | Feet,Miles | Range Units | LIST | VALUE=STRING ## rangeScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Range Increases At Higher Levels | LIST | VALUE=STRING ## rangeAHL | 0 | How Much Range Increases When it Changes AHL ";
    rangeInput = ""
]

[h,switch(AoEShape),CODE:
    case "Cone":{
        [h:aoeInput = " junkVar| ---------------------------------------------- AoE Info ---------------------------------------------- ||LABEL|SPAN=TRUE ## aoeSize |  | Cone Size ## aoeUnits | Feet,Miles | Cone Size Units | LIST | VALUE=STRING ## aoeSizeScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Cone Size Increases At Higher Levels | LIST | VALUE=STRING ## aoeSizeAHL |  | How Much Cone Size Increases AHL ## aoeNumber | "+listsLevel+" | Number of Areas of Effect | LIST | VALUE=STRING ## aoeNumberScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Number of Cones Increases At Higher Levels | LIST | VALUE=STRING ## aoeNumberAHL | "+listsLevel+" | Additional Areas of Effect Per Increase | LIST "]
        [h:aoeDimensionsNum = 1]
    };
    case "Cube":{
        [h:aoeInput = " junkVar| ---------------------------------------------- AoE Info ---------------------------------------------- ||LABEL|SPAN=TRUE ## aoeSize |  | Cube Size ## aoeUnits | Feet,Miles | Cube Size Units | LIST | VALUE=STRING ## aoeSizeScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Cube Size Increases At Higher Levels | LIST | VALUE=STRING ## aoeSizeAHL |  | How Much Cube Size Increases AHL ## aoeNumber | "+listsLevel+" | Number of Areas of Effect | LIST | VALUE=STRING ## aoeNumberScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Number of Cubes Increases At Higher Levels | LIST | VALUE=STRING ## aoeNumberAHL | "+listsLevel+" | Additional Areas of Effect Per Increase | LIST "]
        [h:aoeDimensionsNum = 1]
    };
    case "Cylinder":{
        [h:aoeInput = " junkVar| ---------------------------------------------- AoE Info ---------------------------------------------- ||LABEL|SPAN=TRUE ## aoeSize |  | Cylinder Radius ## aoeUnits | Feet,Miles | Cylinder Radius Units | LIST | VALUE=STRING ## aoeSize2 |  | Cylinder Height ## aoeUnits2 | Feet,Miles | Cylinder Height Units | LIST | VALUE=STRING ## aoeSizeScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Cylinder Size Increases At Higher Levels | LIST | VALUE=STRING ## aoeSizeAHL |  | How Much Cylinder Radius Increases AHL ## aoeSizeAHL2 |  | How Much Cylinder Height Increases AHL ## aoeNumber | "+listsLevel+" | Number of Areas of Effect | LIST | VALUE=STRING ## aoeNumberScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Number of Cylinders Increases At Higher Levels | LIST | VALUE=STRING ## aoeNumberAHL | "+listsLevel+" | Additional Areas of Effect Per Increase | LIST "]
        [h:aoeDimensionsNum = 2]
    };
    case "Half Sphere":{
        [h:aoeInput = " junkVar| ---------------------------------------------- AoE Info ---------------------------------------------- ||LABEL|SPAN=TRUE ## aoeSize |  | Half Sphere Radius ## aoeUnits | Feet,Miles | Half Sphere Radius Units | LIST | VALUE=STRING ## aoeSizeScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Half Sphere Size Increases At Higher Levels | LIST | VALUE=STRING ## aoeSizeAHL |  | How Much Half Sphere Radius Increases AHL ## aoeNumber | "+listsLevel+" | Number of Areas of Effect | LIST | VALUE=STRING ## aoeNumberScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Number of Half Spheres Increases At Higher Levels | LIST | VALUE=STRING ## aoeNumberAHL | "+listsLevel+" | Additional Areas of Effect Per Increase | LIST "]
        [h:aoeDimensionsNum = 1]
    };
    case "Line":{
        [h:aoeInput = " junkVar| ---------------------------------------------- AoE Info ---------------------------------------------- ||LABEL|SPAN=TRUE ## aoeSize |  | Line Length ## aoeUnits | Feet,Miles | Line Length Units | LIST | VALUE=STRING ## aoeSize2 | 5 | Line Width ## aoeUnits2 | Feet,Miles | Line Width Units | LIST | VALUE=STRING ## aoeSizeScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Line Size Increases At Higher Levels | LIST | VALUE=STRING ## aoeSizeAHL |  | How Much Line Length Increases AHL ## aoeSizeAHL2 |  | How Much Line Width Increases AHL ## aoeNumber | "+listsLevel+" | Number of Areas of Effect | LIST | VALUE=STRING ## aoeNumberScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Number of Lines Increases At Higher Levels | LIST | VALUE=STRING ## aoeNumberAHL | "+listsLevel+" | Additional Areas of Effect Per Increase | LIST "]
        [h:aoeDimensionsNum = 2]
    };
    case "Sphere":{
        [h:aoeInput = " junkVar| ---------------------------------------------- AoE Info ---------------------------------------------- ||LABEL|SPAN=TRUE ## aoeSize |  | Sphere Radius ## aoeUnits | Feet,Miles | Sphere Radius Units | LIST | VALUE=STRING ## aoeNumberScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Number of Spheres Increases At Higher Levels | LIST | VALUE=STRING ## aoeNumberAHL | "+listsLevel+" | Additional Areas of Effect Per Increase | LIST "]
        [h:aoeDimensionsNum = 1]
    };
    case "Wall":{
        [h:aoeInput = " junkVar| ---------------------------------------------- AoE Info ---------------------------------------------- ||LABEL|SPAN=TRUE ## aoeSize |  | Wall Length ## aoeUnits | Feet,Miles | Wall Length Units | LIST | VALUE=STRING ## aoeSize2 | 5 | Wall Width ## aoeUnits2 | Feet,Miles | Wall Width Units | LIST | VALUE=STRING ## aoeSizeScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Wall Size Increases At Higher Levels | LIST | VALUE=STRING ## aoeSizeAHL |  | How Much Wall Length Increases AHL ## aoeSizeAHL2 |  | How Much Wall Width Increases AHL ## aoeNumber | "+listsLevel+" | Number of Areas of Effect | LIST | VALUE=STRING ## aoeNumberScalingAHL | No Change,Every Level,Every Other Level,Every Three Levels | How Often Number of Walls Increases At Higher Levels | LIST | VALUE=STRING ## aoeNumberAHL | "+listsLevel+" | Additional Areas of Effect Per Increase | LIST "]
        [h:aoeDimensionsNum = 2]
    };
    case "Choose From Multiple":{
        [h:aoeInput = " junkVar| ---------------------------------------------- AoE Info: Valid Shapes ---------------------------------------------- ||LABEL|SPAN=TRUE ## isCone |  | Cone | CHECK  ## isCube |  | Cube | CHECK  ## isCylinder |  | Cylinder | CHECK  ## isHalfSphere |  | Half Sphere | CHECK  ## isLine |  | Line | CHECK  ## isSphere |  | Sphere | CHECK  ## isWall |  | Wall | CHECK "]
        [h:aoeDimensionsNum = 4]
    };
    default:{
        [h:aoeInput = ""]
        [h:aoeDimensionsNum = 0]
    };
]

[h:abort(input(
    rangeInput,
    aoeInput
))]

[h:"<!-- Need to decide how I want range, number of targets, and AoE info to be stored. -->"]

[h,switch(aoeDimensionsNum),CODE:
    case 0:{};
    case 1:{
        
    };
    case 2:{
    
    };
    case 4:{
        [h:variableShapeInput = " junkVar| ---------------------------------------------- Variable Shape Info ---------------------------------------------- ||LABEL|SPAN=TRUE"]
        [h,if(isCone): variableShapeInput = listAppend(variableShapeInput," coneSize |  | Cone Size ## coneUnits | Feet,Miles | Cone Size Units | LIST | VALUE=STRING ","##")]
        [h,if(isCube): variableShapeInput = listAppend(variableShapeInput," cubeSize |  | Cube Size ## cubeUnits | Feet,Miles | Cube Size Units | LIST | VALUE=STRING ","##")]
        [h,if(isCylinder): variableShapeInput = listAppend(variableShapeInput," cylinderSize |  | Cylinder Radius ## cylinderUnits | Feet,Miles | Cylinder Radius Units | LIST | VALUE=STRING ## cylinderSize2 |  | Cylinder Height ## cylinderUnits2 | Feet,Miles | Cylinder Height Units | LIST | VALUE=STRING ","##")]
        [h,if(isHalfSphere): variableShapeInput = listAppend(variableShapeInput," halfSphereSize |  | Half Sphere Radius ## halfSphereUnits | Feet,Miles | Half Sphere Radius Units | LIST | VALUE=STRING ","##")]
        [h,if(isLine): variableShapeInput = listAppend(variableShapeInput," lineSize |  | Line Length ## lineUnits | Feet,Miles | Line Length Units | LIST | VALUE=STRING ## lineSize2 | 5 | Line Width ## lineUnits2 | Feet,Miles | Line Width Units | LIST | VALUE=STRING ","##")]
        [h,if(isSphere): variableShapeInput = listAppend(variableShapeInput," sphereSize |  | Sphere Radius ## sphereUnits | Feet,Miles | Sphere Radius Units | LIST | VALUE=STRING ","##")]
        [h,if(isWall): variableShapeInput = listAppend(variableShapeInput," wallSize |  | Wall Length ## wallUnits | Feet,Miles | Wall Length Units | LIST | VALUE=STRING ## wallSize2 | 5 | Wall Width ## wallUnits2 | Feet,Miles | Wall Width Units | LIST | VALUE=STRING ","##")]
        [h:abort(input(variableShapeInput))]
    };
    default:{}
]

[h:targetingInfo = "{}"]
[h,switch(TargetType),CODE:
    case "Creature":{
        [h:validTargetFilters = pm.a5e.InputCreatureTargetingInfo()]
        [h:targetingInfo = json.set(targetingInfo,"Creature",validTargetFilters)]
    };
    case "Object":{
        
    };
    case "Creature or Object":{
        [h:abort(input(
            " targetFiltersTest |  | Any restrictions on valid Creature or Object targets? | CHECK "
        ))]
        [h,if(targetFiltersTest): validTargetFilters = pm.a5e.InputCreatureTargetingInfo()]
        [h,if(targetFiltersTest): targetingInfo = json.set(targetingInfo,"Creature",validTargetFilters)]
    };
    case "Point":{
        [h:validTargetFilters = pm.a5e.InputPointTargetingInfo()]
        [h:targetingInfo = json.set(targetingInfo,"Point",validTargetFilters)]
        
        [h:abort(input(
            " targetFiltersTest |  | Point Targeting: Any Restrictions on Creatures affected? | CHECK "
        ))]
            [h,if(targetFiltersTest): validTargetFilters = pm.a5e.InputCreatureTargetingInfo()]
            [h,if(targetFiltersTest): targetingInfo = json.set(targetingInfo,"Creature",validTargetFilters)]
    };
    case "Condition":{
        [h:validTargetFilters = pm.a5e.InputConditionTargetingInfo()]
        [h:targetingInfo = json.set(targetingInfo,"Creature",validTargetFilters)]
        [h:validTargetFilters = pm.a5e.InputCreatureTargetingInfo(json.set("","ExtraTop","throwaway|------------------------------------------- Creatures Targeted Condition Can Be On -------------------------------------------||LABEL|SPAN=TRUE"))]
        [h:targetingInfo = json.set(targetingInfo,"Creature",validTargetFilters)]
    };
    case "Free Hand":{
        [h:abort(input(
            " selfOnlyTest |  | Can Only Target Your Own Hands | CHECK "
        ))]
        
        [h,if(selfOnlyTest):
            targetingInfo = json.set(targetingInfo,"Creature",json.set("","Allegiance",json.set("","Self",1)));
            validTargetFilters = pm.a5e.InputCreatureTargetingInfo(json.set("","ExtraTop","throwaway|------------------------------------------- Creatures Targeted Condition Can Be On -------------------------------------------||LABEL|SPAN=TRUE"))
        ]
        
        [h,if(!selfOnlyTest): targetingInfo = json.set(targetingInfo,"Creature",validTargetFilters)]
    }
]

[h,if(secondStepTest),CODE:{
    [h:abort(input(
        "junkVar|------------------------------------------ Follow Up Targeting Info ------------------------------------------||LABEL|SPAN=TRUE",
        "secondTargetType | Creature,Object,Creature or Object,Point,Condition,Free Hand | What is Targeted |LIST| VALUE=STRING ",
        "secondAoEShape | None,Cone,Cube,Cylinder,Half Sphere,Line,Sphere,Wall,Varies | Area of Effect |LIST| VALUE=STRING SELECT="+if(AoEShape=="None",0,if(AoEShape=="Cone",1,if(AoEShape=="Cube",2,if(AoEShape=="Cylinder",3,if(AoEShape=="Line",4,5)))))+""
    ))]
};{}]

[h:secondTargetInfo = "{}"]
[h,switch(secondStepTest+secondTargetType),CODE:
    case "1Creature":{
        [h:validTargetFilters = pm.a5e.InputCreaturesecondTargetInfo()]
        [h:secondTargetInfo = json.set(secondTargetInfo,"Creature",validTargetFilters)]
    };
    case "1Object":{
        
    };
    case "1Creature or Object":{
        [h:abort(input(
            " targetFiltersTest |  | Any restrictions on valid Creature or Object targets? | CHECK "
        ))]
        [h,if(targetFiltersTest): validTargetFilters = pm.a5e.InputCreaturesecondTargetInfo()]
        [h,if(targetFiltersTest): secondTargetInfo = json.set(secondTargetInfo,"Creature",validTargetFilters)]
    };
    case "1Point":{
        [h:validTargetFilters = pm.a5e.InputPointsecondTargetInfo()]
        [h:secondTargetInfo = json.set(secondTargetInfo,"Point",validTargetFilters)]
        
        [h:abort(input(
            " targetFiltersTest |  | Point Targeting: Any Restrictions on Creatures affected? | CHECK "
        ))]
            [h,if(targetFiltersTest): validTargetFilters = pm.a5e.InputCreaturesecondTargetInfo()]
            [h,if(targetFiltersTest): secondTargetInfo = json.set(secondTargetInfo,"Creature",validTargetFilters)]
    };
    case "1Condition":{
        [h:validTargetFilters = pm.a5e.InputConditionsecondTargetInfo()]
        [h:secondTargetInfo = json.set(secondTargetInfo,"Creature",validTargetFilters)]
        [h:validTargetFilters = pm.a5e.InputCreaturesecondTargetInfo(json.set("","ExtraTop","throwaway|------------------------------------------- Creatures Targeted Condition Can Be On -------------------------------------------||LABEL|SPAN=TRUE"))]
        [h:secondTargetInfo = json.set(secondTargetInfo,"Creature",validTargetFilters)]
    };
    case "1Free Hand":{
        [h:abort(input(
            " selfOnlyTest |  | Can Only Target Your Own Hands | CHECK "
        ))]
        
        [h,if(selfOnlyTest):
            secondTargetInfo = json.set(secondTargetInfo,"Creature",json.set("","Allegiance",json.set("","Self",1)));
            validTargetFilters = pm.a5e.InputCreaturesecondTargetInfo(json.set("","ExtraTop","throwaway|------------------------------------------- Creatures Targeted Condition Can Be On -------------------------------------------||LABEL|SPAN=TRUE"))
        ]
        
        [h,if(!selfOnlyTest): secondTargetInfo = json.set(secondTargetInfo,"Creature",validTargetFilters)]
    };
    default:{}
]