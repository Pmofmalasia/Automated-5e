[h:InitData = macro.args]

[h,MACRO("Check@Lib:pm.a5e.Core"): json.set(InitData,"Skill","Initiative","Type","Initiative")]
[h:ReturnData = macro.return]

[h:addToInitiative()]
[h:setInitiative(json.get(ReturnData,"Value")+(json.get(getProperty("a5e.stat.AtrMods"),"Dexterity")/100))]
[h:sortInitiative()]