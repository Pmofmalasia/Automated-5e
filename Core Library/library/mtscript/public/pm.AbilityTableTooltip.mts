[h:output.TempFrame=""]
[h:output.Temp=""]

[h,foreach(tableline,abilityTable,""),CODE:{
	[h:output.TempFrame=output.TempFrame+"<tr><th style = '"+FrameAccentFormat+"'>"+json.get(tableline,"Header")+VerticalFormat]
	[h,foreach(displayType,json.get(tableline,"DisplayOrder"),""):output.TempFrame=output.TempFrame+json.get(tableline,displayType+"Contents")]
	[h:output.TempFrame=output.TempFrame+"</td></tr>"]

	[h:output.Temp=output.Temp+"<tr><th style = '"+AccentFormat+"'>"]
	[h:output.Temp=output.Temp+json.get(tableline,"Header")]
	[h:output.Temp=output.Temp+"</th><td>"]
	[h,foreach(displayType,json.get(tableline,"DisplayOrder"),""):output.Temp=output.Temp+json.get(tableline,displayType+"Contents")]
	[h:output.Temp=output.Temp+"</td></tr>"]
}]

[h:tooltipTables=json.set("","FrameTable",output.TempFrame,"TooltipTable",output.Temp)]