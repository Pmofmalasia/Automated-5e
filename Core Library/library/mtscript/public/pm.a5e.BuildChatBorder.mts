[h:abilityName = json.get(arg(0),"Name")]
[h:abilityDisplayName = if(json.get(arg(0),"DisplayName")=="",abilityName,json.get(arg(0),"DisplayName"))]
[h:Flavor = json.get(arg(0),"Flavor")]
[h:FalseName = json.get(arg(0),"FalseName")]
[h,if(FalseName == ""): FalseName = abilityDisplayName]

[h:outputRules = arg(1)]
[h:outputTest.NoRules = json.get(outputRules,"NoRules")]
[h:outputTest.NoRolls = json.get(outputRules,"NoRolls")]
[h:outputTest.NoFullMacro = json.get(outputRules,"NoFullMacro")]

[h:output.Temp = "<div style='background-color: %{BorderColor}; color: %{TitleColor}; padding-top:2px; padding-bottom:2px; padding-left:8px; padding-right:8px; font-family:%{TitleFont}; %{TableWidth}'>"]
[h:output.PC = if(outputTest.NoFullMacro,"",output.Temp)]
[h:output.GM = output.Temp]

[h:output.Temp = "<b>"+abilityDisplayName+"</b>"]
[h:output.PC = if(outputTest.NoFullMacro,output.PC,if(outputTest.NoRules,output.PC+"<b>"+FalseName+"</b>",output.PC+output.Temp))]
[h:output.GM = output.GM + output.Temp]

[h:output.Temp = "<div style='background-color:%{BackgroundColor}; color: %{BackgroundTextColor}; padding:2px; width:100%; font-family:%{BodyFont}'>"]

[h:output.PC = if(outputTest.NoFullMacro,output.PC,output.PC+output.Temp)]
[h:output.GM = output.GM + output.Temp]

[h:output.Temp = if(Flavor=="","","<div style='text-align:center; background-color:%{AccentBackground}; color:%{AccentText};'>"+"<i>"+Flavor+"</i></div>")]
[h:output.PC = if(outputTest.NoFullMacro,output.PC,output.PC+output.Temp)]
[h:output.GM = output.GM + output.Temp]

[h:BackgroundFormat = "background-color:%{BackgroundColor}; color: %{BackgroundText}; padding:2px; font-family:%{BodyFont}"]

[h:macro.return = json.set("","Player",output.PC,"GM",output.GM)]