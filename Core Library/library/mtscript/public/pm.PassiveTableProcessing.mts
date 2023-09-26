[h:pm.AbilityTable = arg(0)]

[h:AccentFormat="text-align:center; background-color:"+AccentColor+"; color:"+AccentText+";"+if(number(data.getData("addon:","pm.a5e.core","VerticalDisplay")),""," width:20%;")]

[h:VerticalFormat=if(
data.getData("addon:","pm.a5e.core","VerticalDisplay")==1,"</th></tr><tr style='text-align:center;'><td style='","</th><td style='padding-left:4px; valign:middle;")]
[h:VerticalFormatFinalBonus=if(
data.getData("addon:","pm.a5e.core","VerticalDisplay")==1,"</td></tr><tr style='text-align:center;'><td style='","</td><td style='padding-left:4px; valign:middle; text-align:right")]

[h:pm.MaxColNumTemp = json.path.read(pm.AbilityTable,"[*][?(@.BonusSectionNum!=null)]['BonusSectionNum']","DEFAULT_PATH_LEAF_TO_NULL")]
[h,if(json.isEmpty(pm.MaxColNumTemp)): pm.MaxColNum = 2; pm.MaxColNum = math.arrayMax(pm.MaxColNumTemp)+2]

[h,foreach(tableline,pm.AbilityTable,""),CODE:{
	[h:pm.BonusSections = if(json.get(tableline,"BonusSectionNum")=="",0,json.get(tableline,"BonusSectionNum"))]
	[h:pm.BigHeaderTest = and(json.get(tableline,"RollContents")=="",json.get(tableline,"RulesContents")=="",json.get(tableline,"FullContents")=="")]
	
	[h:showPCsLineTest = if(or(outputTest.NoFullMacro,and(outputTest.NoRules,json.get(tableline,"FullContents")=="",json.get(tableline,"RollContents")==""),and(outputTest.NoRolls,json.get(tableline,"FullContents")=="")),0,1)]
	[h:showLineTest = if(or(json.get(tableline,"ShowIfCondensed")==1,ShowFullRules==1),1,0)]
	
	[h:output.Temp="<tr valign:middle><th style = '"+AccentFormat+"'"+if(pm.BigHeaderTest && data.getData("addon:","pm.a5e.core","VerticalDisplay")==0,"; colspan='"+pm.MaxColNum+"'","")+">"]
	[h:output.PC = if(and(showPCsLineTest,showLineTest),output.PC+output.Temp,output.PC)]
	[h:output.GM = if(showLineTest,output.GM + output.Temp,output.GM)]

	[h:output.Temp=json.get(tableline,"Header")]
	[h:output.PC = if(and(showPCsLineTest,showLineTest),if(and(outputTest.NoRules,json.get(tableline,"FalseHeader")!=""),output.PC+json.get(tableline,"FalseHeader"),output.PC+output.Temp),output.PC)]
	[h:output.GM = if(showLineTest,output.GM + output.Temp,output.GM)]

	[h,if(!pm.BigHeaderTest),CODE:{
		[h:output.Temp = VerticalFormat+"'"+if(
	data.getData("addon:","pm.a5e.core","VerticalDisplay")==1,""," colspan='"+(pm.MaxColNum-1-pm.BonusSections)+"'")+">"]
		[h:output.PC = if(and(showPCsLineTest,showLineTest),output.PC+output.Temp,output.PC)]
		[h:output.GM = if(showLineTest,output.GM + output.Temp,output.GM)]
	};{}]

	[h,foreach(displayType,json.get(tableline,"DisplayOrder"),""),CODE:{
		[h:outputTest.NoThisPart = if(displayType=="Full",outputTest.NoFullMacro,if(displayType=="Roll",outputTest.NoRolls,outputTest.NoRules))]
		[h,if(!pm.BigHeaderTest): output.PC = if(and(showPCsLineTest,showLineTest),if(outputTest.NoThisPart,output.PC,output.PC+json.get(tableline,displayType+"Contents")),output.PC)]
		[h,if(!pm.BigHeaderTest): output.GM = if(showLineTest,output.GM + json.get(tableline,displayType+"Contents"),output.GM)]
	}]

	[h:pm.BonusCount = 1]
	[h,count(pm.BonusSections),CODE:{
		[h,switch(json.get(tableline,"BonusSectionType"+pm.BonusCount)):
			case "Full": outputTest.NoBonusSection = outputTest.NoFullMacro;
			case "Roll": outputTest.NoBonusSection = outputTest.NoRolls;
			case "Rules": outputTest.NoBonusSection = outputTest.NoRules;
			default: outputTest.NoBonusSection = outputTest.NoRules
		]
		
		[h,if(json.get(tableline,"BonusHeader"+pm.BonusCount)==""): output.Temp = ""; output.Temp = VerticalFormat+json.get(tableline,"BonusSectionStyling"+pm.BonusCount)+"'>"+"<span style = '"+AccentFormat+"'>"+json.get(tableline,"BonusHeader"+pm.BonusCount)+"</span>"]
		[h,if(!pm.BigHeaderTest): output.PC = if(and(showPCsLineTest,showLineTest),if(outputTest.NoBonusSection,output.PC,output.PC+output.Temp),output.PC)]
		[h,if(!pm.BigHeaderTest): output.GM = if(showLineTest,output.GM + output.Temp,output.GM)]
		
		[h,if(json.get(tableline,"BonusBody"+pm.BonusCount)==""): output.Temp == ""; output.Temp = if(pm.BonusCount==pm.BonusSections,VerticalFormatFinalBonus,VerticalFormat)+json.get(tableline,"BonusSectionStyling"+pm.BonusCount)+"'>"+json.get(tableline,"BonusBody"+pm.BonusCount)]
		[h,if(!pm.BigHeaderTest): output.PC = if(and(showPCsLineTest,showLineTest),if(outputTest.NoBonusSection,output.PC,output.PC+output.Temp),output.PC)]
		[h,if(!pm.BigHeaderTest): output.GM = if(showLineTest,output.GM + output.Temp,output.GM)]

		[h:pm.BonusCount = pm.BonusCount+1]
	}]

	[h,if(!pm.BigHeaderTest): output.Temp="</td></tr>"; output.Temp="</th></tr>"]
	[h:output.PC = if(and(showPCsLineTest,showLineTest),output.PC+output.Temp,output.PC)]
	[h:output.GM = if(showLineTest,output.GM + output.Temp,output.GM)]

}]

[h:output.Temp=if(or(ShowFullRules,json.path.read(pm.AbilityTable,".[?(@.ShowIfCondensed>0)]['Header']")!="[]"),"</table>","")]
[h:output.PC = if(outputTest.NoRules,output.PC,output.PC+output.Temp)]
[h:output.GM = output.GM + output.Temp]