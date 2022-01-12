[h:pm.AbilityTable=arg(0)]
[h:outputTest.NoFullMacro = json.get(arg(1),"NoFullMacro")]
[h:outputTest.NoRules = json.get(arg(1),"NoRules")]
[h:outputTest.NoRolls = json.get(arg(1),"NoRolls")]
[h:AccentColor = json.get(arg(1),"AccentColor")]
[h:AccentText = json.get(arg(1),"AccentText")]
[h:BackgroundColor = json.get(arg(1),"BackgroundColor")]
[h:BackgroundText = json.get(arg(1),"BackgroundText")]
[h:ShowFullRules = arg(2)]

[h:TableFormat='padding:3px; '+if(getLibProperty("VerticalDisplay","Lib:pm.a5e.Core"),"width:100%",if(getLibProperty("useWidth","Lib:pm.a5e.Core")==2,"",if(getLibProperty("useWidth","Lib:pm.a5e.Core"),"max-","")+'width:'+string(getLibProperty("DisplaySize","Lib:pm.a5e.Core"))+'px;'))]

[h:output.Temp=if(or(ShowFullRules,json.path.read(pm.AbilityTable,"[?(@.ShowIfCondensed>0)]")!="[]"),"<table style='"+TableFormat+"'>","")]
[h:ContainsRollTest = if(json.path.read(pm.AbilityTable,"[?(@.ShowIfCondensed>0)]['RollContents']")!="[]",outputTest.NoFullMacro,outputTest.NoRules)]
[h:output.PC = if(ContainsRollTest,"",output.Temp)]
[h:output.GM = output.Temp]

[h:pm.PassiveTableProcessing(pm.AbilityTable)]
[h:macro.return = json.set("","Player",output.PC,"GM",output.GM)]