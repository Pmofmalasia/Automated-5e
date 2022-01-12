[h:abilityTable = json.get(arg(0),"abilityTable")]
[h:pm.TooltipBorder(arg(0))]

[h:output.TempFrame=""]
[h:output.Temp=""]

[h:pm.AbilityTableTooltip()]

[h:tooltipTableText=json.get(tooltipTables,"TooltipTable")]
[h:tooltipFrameTableText=json.get(tooltipTables,"FrameTable")]

[h:TooltipPermission=if(or(DMOnly==0,isGM(),isOwner()),1,0)]
	
[r,if(Frame.tooltip && TooltipPermission),CODE:{
	[r,frame5("Ability Info"):{[r:strformat('<html>'+pm.BorderFrame+if(tooltipFrameTableText=="","",'<table style="font-size:1em; color: '+BodyTextFinal.tooltip+';">'+tooltipFrameTableText+'</table><br>')+abilityEffect+'</div></div></html>')]}]
};{}]

[r,if(Mouseover.tooltip && TooltipPermission),CODE:{
	[r:strformat('<html>'+pm.BorderTooltip+if(tooltipTableText=="","",'<table style="font-size:1em; color: '+BodyTextFinal.tooltip+';">'+tooltipTableText+'</table><br>')+abilityEffect+'</div></div></html>')]
};{}]