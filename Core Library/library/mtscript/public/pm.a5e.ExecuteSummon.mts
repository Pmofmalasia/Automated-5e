[h:SummonData = arg(0)]
[h:OtherSubeffectData = arg(1)]
[h:AHLTier = json.get(OtherSubeffectData,"AHLTier")]
[h:ParentToken = json.get(OtherSubeffectData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:SummonPrereqs = json.get(SummonData,"Prereqs")]

[h,if(json.contains(SummonPrereqs,"CRMaximum")),CODE:{
	[h:CRMaxData = json.get(SummonPrereqs,"CRMaximum")]
	[h:CRMax = json.get(CRMaxData,"CRMax")]
	[h:CRMaxAHL = json.get(CRMaxData,"CRMaxAHL")]
	[h:CRMaxAHLScaling = json.get(CRMaxData,"CRMaxAHLScaling")]
	[h:CRMaxAHLScalingMethod = json.get(CRMaxData,"CRMaxAHLScalingMethod")]

	[h,if(number(CRMaxAHLScaling) > 0),CODE:{
		[h:finalCRMax = eval(CRMax + if(CRMaxAHLScalingMethod == "Add","+","*") + floor(AHLTier/CRMaxAHLScaling))]
	};{
		[h:finalCRMax = CRMax]
	}]

	[h:SummonPrereqs = json.set(SummonPrereqs,"CRMaximum",finalCRMax)]
}]

[h,if(0),CODE:{
	[h:validSummons = js.evalURI("filterCreatures","lib://pm.a5e.core/GraalVM/FilterCreatures.js",data.getData("addon:","pm.a5e.core","sb.Bestiary"),SummonPrereqs,ParentToken)]
};{
	[h:bestiary = data.getData("addon:","pm.a5e.core","sb.Bestiary")]
	[h:validSummons = ""]
	[h,foreach(creature,bestiary): validSummons = if(pm.a5e.CreaturePrereqs(creature,SummonPrereqs,ParentToken),json.append(validSummons,creature),validSummons)]
}]
[h:SummonData = json.remove(SummonData,"Prereqs")]

[h:SummonNumber = json.get(SummonData,"Number")]
[h:SummonNumberAHLScaling = number(json.get(SummonData,"NumberAHLScaling"))]
[h:SummonNumberMultiplierAHL = 1]
[h:SummonNumberBonusAHL = 0]

[h,if(SummonNumberAHLScaling > 0),CODE:{
	[h:SummonNumberAHL = json.get(SummonData,"NumberAHL")]
	[h:SummonNumberAHLScalingMethod = json.get(SummonData,"NumberAHLScalingMethod")]

	[h,if(SummonNumberAHLScalingMethod == "Add"):
		SummonNumberBonusAHL = SummonNumberAHL * floor(AHLTier/SummonNumberAHLScaling);
		SummonNumberMultiplierAHL = SummonNumberAHL + floor(AHLTier/SummonNumberAHLScaling)
	]
	[h:SummonData = json.remove(SummonData,"NumberAHL")]
	[h:SummonData = json.remove(SummonData,"NumberAHLScalingMethod")]
	[h:SummonData = json.remove(SummonData,"NumberAHLScaling")]

	[h:SummonNumber = (SummonNumber * SummonNumberMultiplierAHL) + SummonNumberBonusAHL]
};{}]

[h:summonOptionNamesFinal = "[]"]
[h,foreach(summon,validSummons),CODE:{
	[h:summonDisplayData = json.get(summon,"MTProperties")]
	[h:summonOptionNamesFinal = json.append(summonOptionNamesFinal,base64.decode(json.get(summonDisplayData,"name"))+" "+json.get(summonDisplayData,"tokenImage"))]
}]

[h,switch(json.length(summonOptionNamesFinal)),CODE:
	case 0:{
		[h,if(1):
			SummonChoice = "";
			assert(0,"No valid summons found in the bestiary!")
		]
		[h:SummonName = ""]
	};
	case 1:{
		[h:SummonChoice = json.get(validSummons,0)]
		[h:SummonName = json.get(summonOptionNamesFinal,0)]
	};
	default:{
		[h:abort(input(" SummonChoiceIndex | "+summonOptionNamesFinal+" | Choose a Summon | LIST | ICON=TRUE ICONSIZE=50 DELIMITER=JSON "))]
		[h:SummonChoice = json.get(validSummons,SummonChoiceIndex)]
		[h:SummonName = base64.decode(json.get(json.get(SummonChoice,"MTProperties"),"name"))]
	}
]

[h:SummonData = json.append("",json.set(SummonData,
	"TokenData",SummonChoice,
	"Number",SummonNumber,
	"ParentToken",ParentToken
))]

[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header","Summons",
	"FalseHeader","",
	"FullContents",SummonName+if(SummonNumber > 1," x"+SummonNumber,""),
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:SummonReturnData = json.set("",
	"Summon",SummonData,
	"Table",abilityTable
)]

[h:return(0,SummonReturnData)]