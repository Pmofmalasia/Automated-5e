[h:FirstPassTest = json.get(macro.args,"FirstPass")]
[h:sMultiEffects = json.get(macro.args,"EffectNumber")]
[h:IsRandomEffect = json.get(macro.args,"IsRandomEffect")]
[h:sDescriptionTT = json.get(macro.args,"sDescriptionTT")]
[h:sName = json.get(macro.args,"sName")]
[h:RangeType = json.get(macro.args,"RangeType")]
[h:AoEShape = json.get(macro.args,"AoEShape")]
[h:sDuration = json.get(macro.args,"sDuration")]
[h:sSchool = json.get(macro.args,"sSchool")]
[h:IsSummon = json.get(macro.args,"IsSummon")]
[h:IsAHLSummon = json.get(macro.args,"IsAHLSummon")]
[h:sList = json.get(macro.args,"sList")]
[h:sLevel = json.get(macro.args,"sLevel")]
[h:finalSpellData = "{}"]
[h:MaxSpellLevel = 9]

[h:listDamageTypes = json.append(pm.GetDamageTypes("DisplayName","json"),"Healing","Temp HP","Choose From Multiple")]
[h:listDamageTypesAHL = json.append(pm.GetDamageTypes("DisplayName","json"),"Healing","Temp HP","Same As Chosen")]
[h:listDamageDieNumber = "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30"]
[h:listDamageDieSize = "0,1,2,4,6,8,10,12"]
[h:listPrimaryStat = pm.GetAttributes("DisplayName","json")]
[h:listsLevel = ""]
[h,count(MaxSpellLevel+1): listsLevel = listAppend(listsLevel,roll.count)]
[h:listCastTime = "Action,BONUS,REACTION,1 MIN,10 MIN,1 HOUR,8 HOURS,12 HOURS,24 HOURS,Custom"]
[h:SaveType="None"]
[h:DmgType=""]
[h:DmgDieNumber="0"]
[h:DmgDieSize="0"]
[h:DmgType2=""]
[h:DmgDie2Number="0"]
[h:DmgDie2Size="0"]
[h:CastTime=""]
[h:EffectName="All Effect Rules"]
[h:disMultiEffectsName=if(FirstPassTest,"","EffectName | Name | Effect Name")]
[h:disIsMultiEffects=if(FirstPassTest,"sMultiEffects | "+listsLevel+" | <html><span title='Increase ONLY for effects where multiple portions of the spell change together, for example Plant Growth, Control Winds, etc. Do NOT use for spells where just the damage type, creature summoned, etc. changes. On the first passthrough, input only features of the spell common to all effects.'>Number of Effects to Choose From</span></html> | LIST | VALUE=STRING ","")]
[h:disRandomEffects=if(FirstPassTest,"IsRandomEffect |  | If Yes, is the Effect Random | Check ","")]
[h:disIsMultiSubEffects=if(FirstPassTest,"sMultiSubEffects | "+listsLevel+" | <html><span title='Increase for a Single Spell Effect that Has Different Parts for Different Targets - e.g. Ice Knife initial attack + AoE, Vampiric Touch damages target and heals self, etc.'>Number of Sub-Effects to Choose From</span></html> | LIST | VALUE=STRING ","")]

[h:spellSchoolsArray = pm.GetSpellSchools("DisplayName","json")]
[h:previousSchoolSelection = json.indexOf(spellSchoolsArray,sSchool)]
[h:previousSchoolSelection = if(previousSchoolSelection==-1,0,previousSchoolSelection)]

[h:abort(input(
	"sName | "+sName+" | Spell Name ",
	disMultiEffectsName,
	"sLevel | "+listsLevel+" | Spell Level | LIST | VALUE=STRING SELECT="+(number(sLevel)-1)+"",
	"CastTime | "+listCastTime+" | Casting time |LIST|VALUE=STRING",
	"Ritual |  | Ritual Spell | Check",	"junkVar|-----------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
	"vComp |  | Verbal Components | Check",
	"sComp |  | Somatic Components | Check",
	"mComp |  | Material Components | Check",
	"IsSight |  | Requires Seeing Target | Check ","junkVar|-----------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
"sDuration | Instantaneous,1 Round,1 Minute,10 Minutes,1 Hour,8 Hours,24 Hours,10 Days,Until Dispelled,Other | Duration | LIST | VALUE=STRING SELECT="+if(sDuration=="Instantaneous",0,if(sDuration=="1 Round",1,if(sDuration=="1 Minute",2,if(sDuration=="10 Minutes",3,if(sDuration=="1 Hour",4,if(sDuration=="8 Hours",5,if(sDuration=="24 Hours",6,if(sDuration=="10 Days",7,8))))))))+"",
	"IsAHLDuration |  | Increased Duration at Higher levels | Check ",
	"sConcentration |  | Concentration | Check",
	"sIsConcentrationLost |  | Concentration Not Required at Higher Level | CHECK ",
"sSchool | "+spellSchoolsArray+" | School | LIST | DELIMITER=JSON VALUE=STRING SELECT="+previousSchoolSelection+"",
	"junkVar|-----------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
	"IsAttack |  | Attack Roll | Check ",
	"IsSave |  | Save Required | Check ",
	"IsDamage |  | Heals or Deals Damage | Check ",
	"IsAHL |  | Increased Healing or Damage at Higher Levels | Check ",
	"IsMissiles | |<html><a href='(Magic Missiles, Scorching Ray)'>Is it a Missile Attack</a></html> | Check",
"junkVar|-----------------------------------------------------------------------------------------------------------------------||LABEL|SPAN=TRUE",
	"IsBuffDebuff |  | Sets a Buff or Debuff | Check ",
	"IsCheck | No,Spellcasting Ability,"+pm.GetAttributes("DisplayName")+","+pm.GetSkills("DisplayName")+" | Makes an Ability Check When Cast | LIST | VALUE=STRING ",
	"IsSummon | No,Single,Multiple | Summons Tokens | LIST | VALUE=STRING ",
	"IsAHLSummon | No Change,Increase Number,Increase CR,Both | If Yes, How Do the Summons Change at Higher Levels | LIST | SELECT="+IsAHLSummon+"",
	"junkVar| ---------------------------------- Advanced Options: Can be Ignored ---------------------------------- ||LABEL|SPAN=TRUE",
	disIsMultiEffects,
	disRandomEffects,
	disIsMultiSubEffects
))]

[h:sMultiEffects=number(sMultiEffects)]
[h:sMultiEffects=if(or(FirstPassTest==0,sMultiEffects==1),sMultiEffects,sMultiEffects+1)]

[h:sLevel=number(sLevel)]

[h:durationInfo = "{}"]
[h,switch(sDuration),CODE:
	case "Instantaneous":{
		[h:AHLDurationPlacehold="0"]
	};
	case "1 Round":{
		[h:AHLDurationPlacehold="1"]
		[h:durationInfo = json.set("","Duration",1,"Units","Round")]
	};
	case "1 Minute":{
		[h:AHLDurationPlacehold="2"]
		[h:durationInfo = json.set("","Duration",1,"Units","Minute")]
	};
	case "10 Minutes":{
		[h:AHLDurationPlacehold="3"]
		[h:durationInfo = json.set("","Duration",10,"Units","Minute")]
	};
	case "1 Hour":{
		[h:AHLDurationPlacehold="4"]
		[h:durationInfo = json.set("","Duration",1,"Units","Hour")]
	};
	case "8 Hours":{
		[h:AHLDurationPlacehold="5"]
		[h:durationInfo = json.set("","Duration",8,"Units","Hour")]
	};
	case "24 Hours":{
		[h:AHLDurationPlacehold="6"]
		[h:durationInfo = json.set("","Duration",24,"Units","Hour")]
	};
	case "10 Days":{
		[h:AHLDurationPlacehold="7"]
		[h:durationInfo = json.set("","Duration",10,"Units","Day")]
	};
	case "Until Dispelled":{
		[h:AHLDurationPlacehold="8"]
	};
	default:{
		[h:AHLDurationPlacehold="0"]
		[h:abort(input(
			" throwaway | -------------- Custom Duration Info -------------- |  | LABEL | SPAN=TRUE",
			" durationValue |  | Duration ",
			" durationUnits | Turn,Round,Minute,Hour,Day,Year | Duration Units | LIST | SELECT=1 "
		))]
		[h:durationInfo = json.set("","Duration",durationValue,"Units",durationUnits)]
	}
]

[h,count(sMultiSubEffects),CODE:{
	[h:abort(input(
		"junkVar|---------------------------------------------- Targeting Info ----------------------------------------------||LABEL|SPAN=TRUE",
		"RangeType | Self,Touch,Ranged | Range |LIST| VALUE=STRING SELECT="+if(RangeType=="Self",0,if(RangeType=="Touch",1,2))+"",
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
	
	[h:sConcentrationLost=99]

	[h:disAHLDurationTitle = ""]
	[h:AHLDurationLevels = ""]
	[h,count(MaxSpellLevel-sLevel),CODE:{
		[h:disAHLDurationTitle = listAppend(disAHLDurationTitle,"AHL"+(roll.count+sLevel+1)+"Duration | Instantaneous,1 Round,1 Minute,10 Minutes,1 Hour,8 Hours,24 Hours,10 Days,Until Dispelled,Custom | Level "+(roll.count+sLevel+1)+" Duration | LIST | VALUE=STRING SELECT="+AHLDurationPlacehold,"##")]
		[h:AHLDurationLevels = json.append(AHLDurationLevels,(roll.count+sLevel+1))]
	}]
	
	[h,if(!IsAHLDuration),CODE:{
		[h:disAHLDurationTitle = ""]
		[h:AHLDurationLevels = ""]
	};{}]

	[h:disAHLDuration=if(or(IsAHLDuration==1,sIsConcentrationLost),"throwaway|-------------------------------- Data for Spell Duration at Higher Levels --------------------------------|  |LABEL|SPAN=TRUE","")]
	[h:dissIsConcentrationLost=if(sIsConcentrationLost,"sConcentrationLost | "+listsLevel+" | Concentration No Longer Required at Level | LIST | VALUE=STRING SELECT="+sLevel+"","")]
		
	[h:mCompItems=""]
	[h:mCompConsumed=""]

	[h:disIsmComp = if(mComp==0,"","throwaway|-------------------------------------- Data for Material Components ---------------------------------------| |LABEL|SPAN=TRUE")]
	[h:dismCompItems = if(mComp==0,"","mCompItems |  | Material Components")]
	[h:dismCompConsumed = if(mComp==0,"","mCompConsumed |  | Consumed Material Components")]

	[h:abort(input(
		disIsmComp,
		dismCompItems,
		dismCompConsumed,
		disAHLDurationTitle,
		disAHLDuration,
		dissIsConcentrationLost
	))]

	[h:mCompItemsTT=replace(mCompItems,"'","")]
	[h:mCompConsumedTT=replace(mCompConsumed,"'","")]
	
	[h:AHLDurationInfo = "{}"]
	[h,foreach(tempLevel,AHLDurationLevels),CODE:{
		[h:customTest = 0]
		[h,switch(eval("AHL"+tempLevel+"Duration")):
			case "Instantaneous": "";
			case "1 Round": tempDurationInfo = json.set("","Duration",1,"Units","Round");
			case "1 Minute": tempDurationInfo = json.set("","Duration",1,"Units","Minute");
			case "10 Minutes": tempDurationInfo = json.set("","Duration",10,"Units","Minute");
			case "1 Hour": tempDurationInfo = json.set("","Duration",1,"Units","Hour");
			case "8 Hours": tempDurationInfo = json.set("","Duration",8,"Units","Hour");
			case "24 Hours": tempDurationInfo = json.set("","Duration",24,"Units","Hour");
			case "10 Days": tempDurationInfo = json.set("","Duration",10,"Units","Day");
			case "Until Dispelled":"";
			default: customTest = 1
		]
		
		[h,if(customTest):
			abort(input(
				" throwaway | ----- Custom Duration Info: Level "+tempLevel+" ----- |  | LABEL | SPAN=TRUE",
				" tempDurationValue |  | Duration ",
				" tempDurationUnits | Turn,Round,Minute,Hour,Day,Year | Duration Units | LIST | SELECT=1 "
			));
			AHLDurationInfo = json.set(AHLDurationInfo,tempLevel,tempDurationInfo)
		]
		[h,if(customTest): AHLDurationInfo = json.set(AHLDurationInfo,tempLevel,json.set("","Duration",tempDurationValue,"Units",tempDurationUnits))]
	}]
	
	[h,if(!json.isEmpty(AHLDurationInfo)): finalSpellData = json.set(finalSpellData,"AHLDuration",AHLDurationInfo)]
	[h,if(sConcentrationLost!=99): finalSpellData = json.set(finalSpellData,"ConcentrationLost",sConcentrationLost)]

	[h:DamageTypeData = pm.a5e.InputSpellDamageTypesDealt()]

	[h:"<!-- Need to add: 
	
		Dynamic Basic Condition Selection,
		Spell Name-Based Condition Naming,
		Multiple Spell Conditions Per Spell (e.g. Enhance Ability, Contagion),
		Which conditions to apply (one, all, mix of both),
		Non-Duration based ending conditions for conditions (e.g. on attack, repeating save, etc.)
		Force to use a reaction (maybe should go elsewhere)
		
	Can look to ability conditions for some of this info -->"]
	[h:IsBuff="None"]
	[h:IsDebuff="None"]
	[h:IsBuffDebuffChoices=0]
	[h:IsAura=0]

	[h:disBuffBars = if(IsBuffDebuff==0,"","throwaway|------------------------- Data for Buffs and Debuffs ---------------------------| |LABEL|SPAN=TRUE")]
	[h:disIsBuff = if(IsBuffDebuff==0,"","IsBuff | None,Self,Target,Both | Sets a Buff On (Self for Auras) | LIST | VALUE=STRING ")]
	[h:disIsDebuff = if(IsBuffDebuff==0,"","IsDebuff | None,Self,Target,Both | Sets a Debuff On | LIST | VALUE=STRING ")]
	[h:disIsBuffDebuffChoices = if(IsBuffDebuff==0,"","IsBuffDebuffChoices |  | <html><a href='e.g. Enhance Ability, Contagion, etc.'>Multiple Choices of Buffs or Debuffs to Choose From</a></html> | Check ")]
	[h:disIsAura = if(IsBuffDebuff==0,"","IsAura |  | Creates an Aura | Check ")]

	[h: BuffDebuffInfo=input(
		""+disBuffBars+"",
		""+disIsBuff+"",
		""+disIsDebuff+"",
		""+disIsBuffDebuffChoices+"",
		""+disIsAura+""
		)]
	[h: abort(BuffDebuffInfo)]

	[h:AuraSize=""]
	[h:sStatusName=""]
	[h:BuffsList=""]
	[h:DebuffsList=""]
	[h:BuffScaling=0]
	[h:DebuffScaling=0]
	[h:sStatus=0]
	[h:sBlind=0]
	[h:sCharmed=0]
	[h:sConfused=0]
	[h:sDeafened=0]
	[h:sFrightened=0]
	[h:sGrappled=0]
	[h:sIncapacitated=0]
	[h:sParalyzed=0]
	[h:sPetrified=0]
	[h:sPoisoned=0]
	[h:sProne=0]
	[h:sRestrained=0]
	[h:sStunned=0]
	[h:sUnconscious=0]
	[h:sReactionUsed=0]

	[h:listAuraSize="5,10,15,20,25,30,35,40,45,50,55,60"]
	[h:disIsState = if(and(IsBuff=="None",IsAura==0),"",if(IsBuffDebuffChoices==0,"throwaway|--------- Data for Buffs ---------| |LABEL|SPAN=TRUE","throwaway|------------------------------------------- Data for Buffs -------------------------------------------| |LABEL|SPAN=TRUE"))]
	[h:disIsBuffNoAura = if(and(IsBuff!="None",IsAura==0,IsBuffDebuffChoices==0),"throwaway| The buff will have the same name as the spell. You must create a new state in the campaign properties with the same name. |  |LABEL|SPAN=TRUE","")]
	[h:disisBuffScaling = if(and(IsBuff!="None",IsBuffDebuffChoices==0),"BuffScaling|  | Does the buff change at higher levels |CHECK","")]
	[h:disAuraSize = if(IsAura==1,"AuraSize | "+listAuraSize+" | Aura Radius | LIST | VALUE=STRING SELECT=1","")]
	[h:disisBuffChoices = if(or(IsBuff=="None",IsBuffDebuffChoices==0),"","BuffsList| | <html><a href='You must create a new state with the spells name in campaign properties.'>List Buff Choices, Separated by a Comma.</a></html>")]
	[h:disisBuffScalingMulti = if(or(IsBuff=="None",IsBuffDebuffChoices==0),"","BuffScaling| | <html><a href='1 for Yes, 0 for No. e.g. 1,1,0.'>List Whether Each Choice Scales AHL, Separated by a Comma.</a></html>")]
	[h:disisDebuff = if(IsDebuff=="None","",if(IsBuffDebuffChoices==0,"throwaway|--------- Data for Debuffs ---------| |LABEL|SPAN=TRUE","throwaway|------------------------------------------ Data for Debuffs -----------------------------------------| |LABEL|SPAN=TRUE"))]
	[h:dissStatus = if(IsDebuff=="None","","sStatus |  | <html><a href='You must create a new state with the spells name in campaign properties.'>Unique to Spell.</a></html> | Check")]
	[h:disisDebuffScaling = if(and(IsDebuff!="None",IsBuffDebuffChoices==0),"DebuffScaling|  | Does the debuff change at higher levels |CHECK","")]
	[h:disisDebuffChoices = if(or(IsDebuff=="None",IsBuffDebuffChoices==0),"","DebuffsList| | <html><a href='You must create a new state with the spells name in campaign properties.'>List Debuff Choices, Separated by a Comma.</a></html>")]
	[h:disisDebuffScalingMulti = if(or(IsDebuff=="None",IsBuffDebuffChoices==0),"","DebuffScaling| | <html><a href='1 for Yes, 0 for No. e.g. 1,1,0.'>List Whether Each Choice Scales AHL, Separated by a Comma.</a></html>")]

	[h:dissBlind = if(isDebuff=="None","","sBlind |  | Blinded | Check")]
	[h:dissCharmed = if(isDebuff=="None","","sCharmed |  | Charmed | Check")]
	[h:dissConfused = if(isDebuff=="None","","sConfused |  | Confused | Check")]
	[h:dissDeafened = if(isDebuff=="None","","sDeafened |  | Deafened | Check")]
	[h:dissFrightened = if(isDebuff=="None","","sFrightened |  | Frightened | Check")]
	[h:dissGrappled = if(isDebuff=="None","","sGrappled |  | Grappled | Check")]
	[h:dissIncapacitated = if(isDebuff=="None","","sIncapacitated |  | Incapacitated | Check")]
	[h:dissParalyzed = if(isDebuff=="None","","sParalyzed |  | Paralyzed | Check")]
	[h:dissPetrified = if(isDebuff=="None","","sPetrified |  | Petrified | Check")]
	[h:dissPoisoned = if(isDebuff=="None","","sPoisoned |  | Poisoned | Check")]
	[h:dissProne = if(isDebuff=="None","","sProne |  | Prone | Check")]
	[h:dissRestrained = if(isDebuff=="None","","sRestrained |  | Restrained | Check")]
	[h:dissStunned = if(isDebuff=="None","","sStunned |  | Stunned | Check")]
	[h:dissUnconscious = if(isDebuff=="None","","sUnconscious |  | Unconscious | Check")]
	[h:dissReactionUsed = if(isDebuff=="None","","sReactionUsed |  | Unable to use Reactions | Check")]

	[h: SpellStates=input(
		""+disIsState+"",
		""+disIsBuffNoAura+"",
		""+disisBuffScaling+"",
		""+disAuraSize+"",
		""+disisBuffChoices+"",
		""+disisBuffScalingMulti+"",
		""+disisDebuff+"",
		""+dissStatus+"",
		""+disisDebuffScaling+"",
		""+disisDebuffChoices+"",
		""+disisDebuffScalingMulti+"",
		""+dissBlind+"",
		""+dissCharmed+"",
		""+dissConfused+"",
		""+dissDeafened+"",
		""+dissFrightened+"",
		""+dissGrappled+"",
		""+dissIncapacitated+"",
		""+dissParalyzed+"",
		""+dissPetrified+"",
		""+dissPoisoned+"",
		""+dissProne+"",
		""+dissRestrained+"",
		""+dissStunned+"",
		""+dissUnconscious+"",
		""+dissReactionUsed+""
		)]
	[h: abort(SpellStates)]

	[h:sSummonType=""]
	[h:sSummonList=""]
	[h:sSummonCR=2]
	[h:AHLSummonNumScaling=""]
	[h:AHLSummonNumAdditive=""]
	[h:AHLSummonNumMultiplier=""]
	[h:AHLSummonCRScaling=""]
	[h:AHLSummonCRAdditive=""]
	[h:AHLSummonCRMultiplier=""]
	[h:sSummonNumber=0]

	[h:disIsSummon=if(IsSummon=="No","","throwaway|--------------------------------------------------- Data for Summons ---------------------------------------------------| |LABEL|SPAN=TRUE")]
	[h:dissSummonType=if(IsSummon=="No","","sSummonType | Spell Effect,Abberation,Beast,Celestial,Construct,Demon,Devil,Dragon,Elemental,Fey,Fiend,Giant,Monstrosity,Ooze,Plant,Undead,Special List | Type of Creature Summoned |LIST| VALUE=STRING")]
	[h:dissSummonCR=if(IsSummon=="Single","sSummonCR | "+listsLevel+" | Max CR of Summon |LIST| VALUE=STRING","")]
	[h:dissSummonNumber=if(IsSummon=="Multiple","sSummonNumber | Standard Table,"+listsLevel+" | <html><a href='Standard Table = Table Used for Conjure Animals, etc.'>Number of Creatures Summoned</a></html> |LIST","")]
	[h:disAHLSummonSpaces = if(and(IsSummon!="No",IsAHLSummon!=0),"throwaway|----------------------------------------------------------------------------------------------------------------------------------| |LABEL|SPAN=TRUE","")]
	[h:disAHLSummonNumScaling = if(and(IsSummon!="No",or(IsAHLSummon==1,IsAHLSummon==3)),"AHLSummonNumScaling | Every Level,Every Other Level,Every Three Levels,Other | How Often Does the Number of Creatures Increase At Higher Levels? | LIST | VALUE=STRING SELECT=1","")]
	[h:disAHLSummonNumAdditive = if(and(IsSummon!="No",or(IsAHLSummon==1,IsAHLSummon==3)),"AHLSummonNumAdditive | No,"+listsLevel+" | Does the Number of Creatures Increase By a Set Amount Each Level? | LIST | VALUE=STRING SELECT=0","")]
	[h:disAHLSummonNumMultiplier = if(and(IsSummon!="No",or(IsAHLSummon==1,IsAHLSummon==3)),"AHLSummonNumMultiplier | No,Doubled,Tripled,Quadrupled,Quintupled | <html><a href='From Base Value, e.g. Doubled = 2x then 3x, Tripled = 3x then 6x, etc.'>Does the Number of Creatures Increase Multiplicatively?</a></html> | LIST | VALUE=STRING SELECT=0","")]
	[h:disAHLSummonCRScaling = if(and(IsSummon!="No",or(IsAHLSummon==2,IsAHLSummon==3)),"AHLSummonCRScaling | Every Level,Every Other Level,Every Three Levels,Other | How Often Does CR Increase At Higher Levels? | LIST | VALUE=STRING SELECT=1","")]
	[h:disAHLSummonCRAdditive = if(and(IsSummon!="No",or(IsAHLSummon==2,IsAHLSummon==3)),"AHLSummonCRAdditive | "+listsLevel+" | Amount CR Increases By Each Level | LIST | VALUE=STRING SELECT=0","")]
	[h:disAHLSummonCRMultiplier = if(and(IsSummon!="No",or(IsAHLSummon==2,IsAHLSummon==3)),"AHLSummonCRMultiplier | No,Doubled,Tripled,Quadrupled,Quintupled | <html><a href='From Base Value, e.g. Doubled = 2x then 3x, Tripled = 3x then 6x, etc.'>Does CR Increase Multiplicatively?</a></html> | LIST | VALUE=STRING SELECT=0","")]

	[h: SpellSummons=input(
		""+disIsSummon+"",
		""+dissSummonType+"",
		""+dissSummonCR+"",
		""+dissSummonNumber+"",
		""+disAHLSummonSpaces+"",
		""+disAHLSummonNumScaling+"",
		""+disAHLSummonNumAdditive+"",
		""+disAHLSummonNumMultiplier+"",
		""+disAHLSummonCRScaling+"",
		""+disAHLSummonCRAdditive+"",
		""+disAHLSummonCRMultiplier+""
		)]
	[h: abort(SpellSummons)]

	[h:sSummonCR=if(or(sSummonType=="Spell Effect",sSummonType=="Special List"),999,if(sSummonNumber==0,2,sSummonCR))]

	[h:sSummonList=if(sSummonType=="Spell Effect",sName,sSummonList)]

	[h:dissSummonList=if(sSummonType=="Special List","sSummonList|Be sure to spell correctly, and case sensitive!|Input the name of each creature you can summon, separated by commas.","")]

	[h: SpellSummonList=input(
		""+dissSummonList+""
		)]
	[h: abort(SpellSummonList)]
	
	[h:"<!-- Need to add:
		Attack Rolls:
			- Does spell fizzle immediately on failed attack? If no, what parts get through?
			- Crit range
			- Parts attached to attack roll
		Saves:
			- Save type
			- Damage halved/nullified? All or by type?
			- Conditions avoided? Different condition if failing by more than X amount?
		
	-->"]
	[h:SaveType=""]
	[h:sBaseMissiles=1]
	[h:sAHLMissiles=0]
	[h:DmgHalved=0]
	[h:sCritThresh=0]

	[h:disDmgSpaces = if(IsDamage==0,"","throwaway|-------------------------------------------------------------------------------------------------------| |LABEL|SPAN=TRUE")]

	[h:disIsSave = if(IsSave==0,"","throwaway|---------------------------------- Data for Saving Throws ----------------------------------| |LABEL|SPAN=TRUE")]
	[h:disSaveType = if(IsSave==0,"","SaveType | "+listPrimaryStat+" | Ability Save Type |LIST|VALUE=STRING")]
	[h:disDmgHalved = if(or(IsDamage==0,IsSave==0),"","DmgHalved |  | Is Damage Halved on a Success |CHECK")]

	[h:disIsAttack = if(IsAttack==0,"","throwaway|--------------------------------------- Data for Attacks ---------------------------------------| |LABEL|SPAN=TRUE")]
	[h:dissCritThresh = if(IsAttack==0,"","sCritThresh | 20,19,18,17,16,15 | Critical Hit Threshhold |LIST")]
	[h:dissBaseMissiles = if(IsMissiles==0,"","sBaseMissiles | "+listsLevel+" | Choose Base Number of Missiles | LIST | VALUE=STRING SELECT=0")]
	[h:dissAHLMissiles = if(IsMissiles==0,"","sAHLMissiles | "+listsLevel+" | How Many More Missiles per Level | LIST | VALUE=STRING SELECT=0")]

	[h:abort(input(
		""+disIsSave+"",
		""+disSaveType+"",
		""+disDmgHalved+"",
		""+disIsAttack+"",
		""+dissCritThresh+"",
		""+dissBaseMissiles+"",
		""+dissAHLMissiles+""
	))]
}]

[h:TooltipDesc=""]
[h:TooltipDesc2=""]
[h:TooltipDesc3=""]
[h:TooltipDesc4=""]
[h:TooltipDesc5=""]
[h:TooltipDesc6=""]
[h:TooltipDesc7=""]
[h:TooltipDesc8=""]
[h:TooltipDesc9=""]
[h:sArt=0]
[h:sBrd=0]
[h:sClc=0]
[h:sDrd=0]
[h:sPdn=0]
[h:sRgr=0]
[h:sScr=0]
[h:sWlk=0]
[h:sWiz=0]

[h:"<!-- Need to add:
	Dynamic class selection from casting classes
-->"]

[h:disTooltipTextBars=if(FirstPassTest,"throwaway|--------------------------------------------------------------------- Tooltip Text ----------------------------------------------------------------------| |LABEL|SPAN=TRUE","")]
[h:disTooltipText1=if(FirstPassTest,"TooltipDesc | Do not include damage, save type/DC, etc. | Shortened Version for Tooltip || WIDTH=30","")]
[h:disTooltipText2=if(FirstPassTest,"TooltipDesc2 |  | Tooltip Paragraph 2|| WIDTH=30","")]
[h:disTooltipText3=if(FirstPassTest,"TooltipDesc3 |  | Tooltip Paragraph 3|| WIDTH=30","")]
[h:disTooltipText4=if(FirstPassTest,"TooltipDesc4 |  | Tooltip Paragraph 4|| WIDTH=30","")]
[h:disTooltipText5=if(FirstPassTest,"TooltipDesc5 |  | Tooltip Paragraph 5|| WIDTH=30","")]
[h:disTooltipText6=if(FirstPassTest,"TooltipDesc6 |  | Tooltip Paragraph 6|| WIDTH=30","")]
[h:disTooltipText7=if(FirstPassTest,"TooltipDesc7 |  | Tooltip Paragraph 7|| WIDTH=30","")]
[h:disTooltipText8=if(FirstPassTest,"TooltipDesc8 |  | Tooltip Paragraph 8|| WIDTH=30","")]
[h:disTooltipText9=if(FirstPassTest,"TooltipDesc9 |  | Tooltip Paragraph 9|| WIDTH=30","")]
	
[h:disSpellListBars=if(FirstPassTest,"throwaway|--------------------------------------------------------- Appears on BASE Spell List For ---------------------------------------------------------| |LABEL|SPAN=TRUE","")]
[h:disSpellListArt=if(FirstPassTest,"sArt |  | Artificer | Check","")]
[h:disSpellListBrd=if(FirstPassTest,"sBrd |  | Bards | Check","")]
[h:disSpellListClc=if(FirstPassTest,"sClc |  | Clerics | Check","")]
[h:disSpellListDrd=if(FirstPassTest,"sDrd |  | Druids | Check","")]
[h:disSpellListPdn=if(FirstPassTest,"sPdn |  | Paladins | Check","")]
[h:disSpellListRgr=if(FirstPassTest,"sRgr |  | Rangers | Check","")]
[h:disSpellListScr=if(FirstPassTest,"sScr |  | Sorcerers | Check","")]
[h:disSpellListWlk=if(FirstPassTest,"sWlk |  | Warlocks| Check","")]
[h:disSpellListWiz=if(FirstPassTest,"sWiz |  | Wizards | Check","")]

[h: SpellClasses=input(
	"throwaway|--------------------------------------------------------------------- Full Spell Text --------------------------------------------------------------------| |LABEL|SPAN=TRUE",
	"sDescription1 | Copy/Paste Full Text | Spell Effect Paragraph 1 || WIDTH=30",
	"sDescription2 |  | Spell Effect Paragraph 2 || WIDTH=30",
	"sDescription3 |  | Spell Effect Paragraph 3 || WIDTH=30",
	"sDescription4 |  | Spell Effect Paragraph 4 || WIDTH=30",
	"sDescription5 |  | Spell Effect Paragraph 5 || WIDTH=30",
	"sDescription6 |  | Spell Effect Paragraph 6 || WIDTH=30",
	"sDescription7 |  | Spell Effect Paragraph 7 || WIDTH=30",
	"sDescription8 |  | Spell Effect Paragraph 8 || WIDTH=30",
	"sDescription9 |  | Spell Effect Paragraph 9 || WIDTH=30",
	"sDescription10 |  | Spell Effect Paragraph 10 || WIDTH=30",
	"sDescriptionAHL |  | At Higher Levels Text (Do Not Include 'At Higher Levels.') || WIDTH=30",
	""+disTooltipTextBars+"",
	""+disTooltipText1+"",
	""+disTooltipText2+"",
	""+disTooltipText3+"",
	""+disTooltipText4+"",
	""+disTooltipText5+"",
	""+disTooltipText6+"",
	""+disTooltipText7+"",
	""+disTooltipText8+"",
	""+disTooltipText9+"",
	"IsOngoing | "+listsLevel+" | <html><a href='e.g. Moonbeam, Delayed Fireball, etc.'>Number of Effects After Initial Casting</a></html> | LIST ",
	"IsOngoingRandom |  | Is the above effect chosen randomly after the initial casting | CHECK ",
	""+disSpellListBars+"",
	""+disSpellListArt+"",
	""+disSpellListBrd+"",
	""+disSpellListClc+"",
	""+disSpellListDrd+"",
	""+disSpellListPdn+"",
	""+disSpellListRgr+"",
	""+disSpellListScr+"",
	""+disSpellListWlk+"",
	""+disSpellListWiz+""
	)]
[h: abort(SpellClasses)]

[h:sDescription=pm.EvilChars(sDescription1)+if(or(sDescription2=="",sDescription2=="0"),"","<br><br>"+pm.EvilChars(sDescription2))+if(or(sDescription3=="",sDescription3=="0"),"","<br><br>"+pm.EvilChars(sDescription3))+if(or(sDescription4=="",sDescription4=="0"),"","<br><br>"+pm.EvilChars(sDescription4))+if(or(sDescription5=="",sDescription5=="0"),"","<br><br>"+pm.EvilChars(sDescription5))+if(or(sDescription6=="",sDescription6=="0"),"","<br><br>"+pm.EvilChars(sDescription6))+if(or(sDescription7=="",sDescription7=="0"),"","<br><br>"+pm.EvilChars(sDescription7))+if(or(sDescription8=="",sDescription8=="0"),"","<br><br>"+pm.EvilChars(sDescription8))+if(or(sDescription9=="",sDescription9=="0"),"","<br><br>"+pm.EvilChars(sDescription9))+if(or(sDescription10=="",sDescription10=="0"),"","<br><br>"+pm.EvilChars(sDescription10))+if(or(sDescriptionAHL=="",sDescriptionAHL=="0"),"","<br><br><b><i>At Higher Levels.</i></b> "+pm.EvilChars(sDescriptionAHL))]

[h:sDescriptionTT=if(or(TooltipDesc=="",TooltipDesc=="0",TooltipDesc=="Do not include damage, save type/DC, etc."),"",pm.EvilChars(TooltipDesc))+if(or(TooltipDesc2=="",TooltipDesc2=="0"),"","<br><br>"+pm.EvilChars(TooltipDesc2))+if(or(TooltipDesc3=="",TooltipDesc3=="0"),"","<br><br>"+pm.EvilChars(TooltipDesc3))+if(or(TooltipDesc4=="",TooltipDesc4=="0"),"","<br><br>"+pm.EvilChars(TooltipDesc4))+if(or(TooltipDesc5=="",TooltipDesc5=="0"),"","<br><br>"+pm.EvilChars(TooltipDesc5))+if(or(TooltipDesc6=="",TooltipDesc6=="0"),"","<br><br>"+pm.EvilChars(TooltipDesc6))+if(or(TooltipDesc7=="",TooltipDesc7=="0"),"","<br><br>"+pm.EvilChars(TooltipDesc7))+if(or(TooltipDesc8=="",TooltipDesc8=="0"),"","<br><br>"+pm.EvilChars(TooltipDesc8))+if(or(TooltipDesc9=="",TooltipDesc9=="0"),"","<br><br>"+pm.EvilChars(TooltipDesc9))+if(or(sDescriptionAHL=="",sDescriptionAHL=="0"),"","<br><br><b><i>At Higher Levels.</i></b> "+pm.EvilChars(sDescriptionAHL))]

[h:sNameTT=replace(sName,"'","")]

[h:sList=if(FirstPassTest,json.set('',"Brb",0,"Brd",if(sBrd,(sLevel*2)-1,0),"Clc",if(sClc,(sLevel*2)-1,0),"Drd",if(sDrd,(sLevel*2)-1,0),"Ftr",if(sWiz,if(sLevel==1,3,(sLevel*6)-5),0),"Mnk",0,"Pdn",if(sPdn,if(sLevel==1,2,(sLevel*4)-3),0),"Rgr",if(sRgr,if(sLevel==1,2,(sLevel*4)-3),0),"Rog",if(sWiz,if(sLevel==1,3,(sLevel*6)-5),0),"Scr",if(sScr,(sLevel*2)-1,0),"Wlk",if(sWlk,(sLevel*2)-1,0),"Wiz",if(sWiz,(sLevel*2)-1,0),"Art",if(sArt,(sLevel*4)-3,0),"PlaceholdtoAddClass",0),sList)]

[h:CommandText=encode('
[h:SpellName="'+pm.EvilChars(sName)+'"]
[h:EffectName="'+EffectName+'"]
[h:RandomEffect='+IsRandomEffect+']
[h:sList='+"'"+sList+"'"+']
[h:sLevel='+sLevel+']
[h:Ritual='+Ritual+']
[h:sSchool="'+sSchool+'"]
[h:CastTime="'+CastTime+'"]
[h:sDuration="'+sDuration+'"]
[h:RangeType="'+RangeType+'"]
[h:AoEShape="'+AoEShape+'"]
[h:sAoENumber='+sAoENumber+']
[h:sRange='+sRange+']
[h:sRangeUnits="'+sRangeUnits+'"]
[h:sRangeScalingAHL="'+sRangeScalingAHL+'"]
[h:sRangeAHL='+sRangeAHL+']
[h:AoESize='+(sConeSize+sCubeSize+sCylinderRadius+sLineLength+sSphereSize)+']
[h:AoESize2='+(sCylinderHeight+sLineWidth)+']
[h:sAoEUnits="'+sAoEUnits+'"]
[h:sAoESizeScalingAHL="'+sAoESizeScalingAHL+'"]
[h:sAoESizeAHL='+sAoESizeAHL+']
[h:vComp='+vComp+']
[h:sComp='+sComp+']
[h:mComp='+mComp+']
[h:mCompItems="'+mCompItems+'"]
[h:mCompConsumed="'+mCompConsumed+'"]
[h:IsSight='+IsSight+']
[h:sConcentration='+sConcentration+']
[h:sConcentrationLost='+sConcentrationLost+']
[h:sSpellSave='+IsSave+']
[h:IsAHL='+IsAHL+']
[h:IsOngoing='+IsOngoing+']
[h:IsOngoingRandom='+IsOngoingRandom+']
[h:DmgHalved='+DmgHalved+']
[h:sSaveType="'+SaveType+'"]
[h:sSpellAttack='+IsAttack+']
[h:sCritThresh='+sCritThresh+']
[h:IsCheck="'+IsCheck+'"]
[h:IsMissiles='+IsMissiles+']
[h:sBaseMissiles='+sBaseMissiles+']
[h:sAHLMissiles='+sAHLMissiles+']
[h:IsDamage='+IsDamage+']
[h:DmgTypeOptions="'+DmgTypeOptions+'"]
[h:isRandomType='+isRandomType+']
[h:DmgType="'+DmgType+'"]
[h:DmgDieNumber='+DmgDieNumber+']
[h:DmgDieSize='+DmgDieSize+']
[h:DmgDieFlatBonus="'+DmgDieFlatBonus+'"]
[h:DmgDieMODBonus="'+DmgDieMODBonus+'"]
[h:DmgType2Options="'+DmgType2Options+'"]
[h:isRandomType2='+isRandomType2+']
[h:DmgType2="'+DmgType2+'"]
[h:DmgDie2Number='+DmgDie2Number+']
[h:DmgDie2Size='+DmgDie2Size+']
[h:DmgDie2FlatBonus="'+DmgDie2FlatBonus+'"]
[h:DmgDie2MODBonus="'+DmgDie2MODBonus+'"]
[h:AHLScaling="'+AHLScaling+'"]
[h:AHLDmgType="'+AHLDmgType+'"]
[h:AHLDamageNumber='+AHLDamageNumber+']
[h:AHLDmgDieSize='+AHLDmgDieSize+']
[h:AHLFlatBonus="'+AHLFlatBonus+'"]
[h:AHLDmgType2="'+AHLDmgType2+'"]
[h:AHLDmgDie2Number='+AHLDmgDie2Number+']
[h:AHLDmgDie2Size='+AHLDmgDie2Size+']
[h:AHL2FlatBonus="'+AHL2FlatBonus+'"]
[h:sMultiTarget='+sMultiTarget+']
[h:IsTargetsAHL='+IsTargetsAHL+']
[h:sMultiTargetRange="'+sMultiTargetRange+'"]
[h:AHLTargetScaling="'+AHLTargetScaling+'"]
[h:AHL2Duration="'+AHL2Duration+'"]
[h:AHL3Duration="'+AHL3Duration+'"]
[h:AHL4Duration="'+AHL4Duration+'"]
[h:AHL5Duration="'+AHL5Duration+'"]
[h:AHL6Duration="'+AHL6Duration+'"]
[h:AHL7Duration="'+AHL7Duration+'"]
[h:AHL8Duration="'+AHL8Duration+'"]
[h:AHL9Duration="'+AHL9Duration+'"]
[h:IsAura='+IsAura+']
[h:AuraSize="'+AuraSize+'"]
[h:sStatusName="'+sStatusName+'"]
[h:sStatus='+sStatus+']
[h:sBlind='+sBlind+']
[h:sCharmed='+sCharmed+']
[h:sConfused='+sConfused+']
[h:sDeafened='+sDeafened+']
[h:sFrightened='+sFrightened+']
[h:sGrappled='+sGrappled+']
[h:sIncapacitated='+sIncapacitated+']
[h:sParalyzed='+sParalyzed+']
[h:sPetrified='+sPetrified+']
[h:sPoisoned='+sPoisoned+']
[h:sProne='+sProne+']
[h:sRestrained='+sRestrained+']
[h:sStunned='+sStunned+']
[h:sUnconscious='+sUnconscious+']
[h:sReactionUsed='+sReactionUsed+']
[h:IsBuff="'+IsBuff+'"]
[h:BuffsList="'+BuffsList+'"]
[h:BuffScaling="'+BuffScaling+'"]
[h:IsDebuff="'+IsDebuff+'"]
[h:DebuffsList="'+DebuffsList+'"]
[h:DebuffScaling="'+DebuffScaling+'"]
[h:IsSummon="'+IsSummon+'"]
[h:IsAHLSummon="'+IsAHLSummon+'"]
[h:sSummonType="'+sSummonType+'"]
[h:sSummonList="'+sSummonList+'"]
[h:sSummonNumber='+sSummonNumber+']
[h:sSummonCR='+sSummonCR+']
[h:AHLSummonCRScaling="'+AHLSummonCRScaling+'"]
[h:AHLSummonCRMultiplier="'+AHLSummonCRMultiplier+'"]
[h:AHLSummonCRAdditive="'+AHLSummonCRAdditive+'"]
[h:AHLSummonNumMultiplier="'+AHLSummonNumMultiplier+'"]
[h:AHLSummonNumAdditive="'+AHLSummonNumAdditive+'"]
[h:AHLSummonNumScaling="'+AHLSummonNumScaling+'"]
[h:sDescription="'+sDescription+'"]
[h:sDescriptionTT="'+sDescriptionTT+'"]
[h:placeholdToAdd=""]
	
[h:pm.SpellDataSet()]
	
[h,foreach(SpellVariable,SpellModArrayVars),CODE:{[h:SpellData=json.set(SpellData,SpellVariable,listGet(SpellModArrayValues,roll.count))]}]

[h:FinalSpellData=json.append(FinalSpellData,SpellData)]')]

[h:macro.return=json.set("","CommandText",CommandText,"EffectNumber",sMultiEffects,"IsRandomEffect",IsRandomEffect,"sName",pm.EvilChars(sName),"sLevel",sLevel,"CastTime",CastTime,"IsOngoing",IsOngoing,"sList",sList,"IsOngoingRandom",IsOngoingRandom,"sDescription",sDescription,"sDescriptionTT",sDescription,"IsAHLSummon",IsAHLSummon,"IsSummon",IsSummon,"sSchool",sSchool,"sDuration",sDuration,"AoEShape",AoEShape,"RangeType",RangeType,"DmgType",DmgType,"DmgType2",DmgType2)]