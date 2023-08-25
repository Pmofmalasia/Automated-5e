[h:PassiveFeatureData = arg(0)]
[h:passCritThreshData = arg(1)]

[h,if(json.contains(passCritThreshData,"CritThresh")): attack.CritThresh = min(attack.CritThresh,json.get(passCritThreshData,"CritThresh"))]

[h,if(json.contains(passCritThreshData,"CritThreshReduction")): attack.CritThreshReduction = attack.CritThreshReduction + json.get(passCritThreshData,"CritThreshReduction")]