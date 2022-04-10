[h:abilityInfo = json.set(abilityInfo,"OnlyRules",if(json.path.read(abilityTable,"[?(@.RollContents != '' || @.FullContents != '')]['Header']")=="[]",1,0))]
[h:pm.MacroFormat(abilityInfo)]
[h:pm.ProcessingData = macro.return]

[h:outputTest.NoFullMacro = json.get(macro.return,"NoFullMacro")]
[h:outputTest.NoRolls = json.get(macro.return,"NoRolls")]
[h:outputTest.NoRules = json.get(macro.return,"NoRules")]
[h:output.PC = json.get(json.get(macro.return,"Output"),"Player")]
[h:output.GM = json.get(json.get(macro.return,"Output"),"GM")]

[h:output.Temp = pm.AbilityTableProcessing(abilityTable,pm.ProcessingData,json.get(abilityInfo,"FullRules"))]
[h:output.PC = output.PC + json.get(output.Temp,"Player")]
[h:output.GM = output.GM + json.get(output.Temp,"GM")]

[h:output.Temp=abilityEffect+"</div></div>"]
[h:output.PC = if(outputTest.NoRules,output.PC,output.PC + output.Temp)]
[h:output.GM = output.GM + output.Temp]

[h:broadcastAsToken(output.PC,"not-gm")]
[h:broadcastAsToken(output.GM,"gm")]

[h:pm.a5e.AbilityGatherEffect()]