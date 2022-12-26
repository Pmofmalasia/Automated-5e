[h:output.TempFrame=""]
[h:output.Temp=""]

[h:pm.MaxColNumTemp = json.path.read(abilityTable,"[*][?(@.BonusSectionNum!=null)]['BonusSectionNum']","DEFAULT_PATH_LEAF_TO_NULL")]
[h,if(json.isEmpty(pm.MaxColNumTemp)): pm.MaxColNum = 2; pm.MaxColNum = math.arrayMax(pm.MaxColNumTemp)+2]

[h,foreach(tableline,abilityTable,""),CODE:{
	[h:pm.BigHeaderTest = and(json.get(tableline,"RollContents")=="",json.get(tableline,"RulesContents")=="",json.get(tableline,"FullContents")=="")]

	[h:output.TempFrame=output.TempFrame+"<tr><th style = '"+FrameAccentFormat+"'"+if(pm.BigHeaderTest,"; colspan='"+pm.MaxColNum+"'","")+">"+json.get(tableline,"Header")+VerticalFormat]
	[h,foreach(displayType,json.get(tableline,"DisplayOrder"),""):output.TempFrame=output.TempFrame+json.get(tableline,displayType+"Contents")]
	[h:output.TempFrame=output.TempFrame+"</td></tr>"]

	[h:output.Temp=output.Temp+"<tr><th style = '"+AccentFormat+"'"+if(pm.BigHeaderTest,"; colspan='"+pm.MaxColNum+"'","")+">"]
	[h:output.Temp=output.Temp+json.get(tableline,"Header")]
	[h:output.Temp=output.Temp+"</th><td>"]
	[h,foreach(displayType,json.get(tableline,"DisplayOrder"),""):output.Temp=output.Temp+json.get(tableline,displayType+"Contents")]
	[h:output.Temp=output.Temp+"</td></tr>"]
}]

[h:tooltipTables=json.set("","FrameTable",output.TempFrame,"TooltipTable",output.Temp)]