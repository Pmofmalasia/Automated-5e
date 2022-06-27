[h:pm.Header=arg(1)]
[h:pm.Body=arg(2)]
[h,if(argCount()>3): pm.ExtraLines = arg(3)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h,if(argCount()>3):
	ReturnMessage = pm.a5e.CreateBasicTableLine(pm.Header,pm.Body,pm.ExtraLines);
	ReturnMessage = pm.a5e.CreateBasicTableLine(pm.Header,pm.Body)
]

[h:abilityTable = json.append(abilityTable,ReturnMessage)]