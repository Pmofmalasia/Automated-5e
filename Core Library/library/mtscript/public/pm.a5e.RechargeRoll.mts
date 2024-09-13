[h:RechargeData = arg(0)]
[h:RechargeFeature = arg(1)]

[h:"<!-- TODO: MaxResource fix -->"]
[h:"<!-- Remove -->"]
[h:ParentToken = json.get(RechargeData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:IsTooltip = 0]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Recharge"]
[h:abilityTable = "[]"]

[h:RechargeRollInfo = json.get(RechargeFeature,"RechargeRoll")]

[h:RollData = pm.DieRoller(1,json.get(RechargeRollInfo,"DieSize"),0)]
[h:RollSuccess = json.get(RollData,"Total") >= json.get(RechargeRollInfo,"Target")]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Recharge Roll",
	"FalseHeader","",
	"FullContents","<b><span style='color:"+if(RollSuccess,"%{SuccessTextColor}","%{FailureTextColor}")+"; font-size:1.5em'>"+json.get(RollData,"Total")+"</span></b>",
	"RulesContents",1+"d"+json.get(RechargeRollInfo,"DieSize")+" = ",
	"RollContents",json.get(RollData,"String")+" = ",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,if(RollSuccess): setProperty("a5e.stat.AllFeatures",json.path.set(getProperty("a5e.stat.AllFeatures"),"\$[*][?("+pm.a5e.PathFeatureFilter(RechargeFeature)+")]['Resource']",evalMacro(json.get(RechargeFeature,"MaxResource"))))]

[h:macro.return = json.set("","Table",abilityTable)]