[h:pm.AbilityData=arg(0)]
[h:abilityTable=json.get(arg(0),"Table")]
[h:pm.SpellData=arg(1)]
[h:pm.SpellResourceData=arg(2)]
[h:pm.ResourceKeyTest = json.type(json.get(arg(2),"ResourceBaseUsed"))]
[h,if(pm.ResourceKeyTest=="OBJECT"),CODE:{
	[h:pm.TooltipResource = json.set("","Amount",0,"ResourceKey",json.get(json.get(pm.SpellResourceData,"ResourceBaseUsed"),"ResourceKey"))]
};{
	[h:pm.TooltipResource = 0]
}]
[h:pm.AbilityEffect=json.get(pm.AbilityData,"Effect")]
[h:pm.SpellPosttext=""]
[h:pm.IsTooltip=json.get(pm.SpellData,"IsTooltip")]
[h:pm.SpellData = json.set(pm.SpellData,"Name",json.get(pm.AbilityData,"Name"),"Class",if(json.get(pm.SpellData,"InnateCast")==1,Race,json.get(pm.SpellData,"ForcedClass")),"MonsterCast",0)]

[r,if(pm.IsTooltip==1),CODE:{
	[h:pm.TooltipBorder(pm.SpellData)]
	
	[h,if(json.get(pm.SpellResourceData,"Resource")==""),CODE:{[h:pm.ResourceMessage = ""][h:abilityResourceLegal=1]};{
	[h:ResourceInfo = pm.AbilityResources(pm.AbilityData,json.get(pm.SpellResourceData,"Resource"),json.get(pm.SpellResourceData,"ResourceUsedVar"),pm.TooltipResource,json.get(pm.SpellResourceData,"SpellSlotOption"),json.get(pm.SpellResourceData,"SpecialRecharge"))]
	[h:abilityResourceUsed = json.get(ResourceInfo,"Value")]
	[h:abilityResourceLegal = json.get(ResourceInfo,"Units")]
	[h:abilityTable = json.append(abilityTable,ResourceInfo)]
	}]
	[h,if(abilityResourceLegal==0),CODE:{[h:pm.ErrorFormat()]};{}]
	
	[h:pm.AbilityTableTooltip(abilityTable,pm.AccentFormat,pm.FrameAccentFormat)]
	[h:tooltipTableText="<table style='color:"+pm.TableFontColor+"'>"+json.get(tooltipTables,"TooltipTable")+"</table>"]
	[h:tooltipFrameTableText="<table style='color:"+pm.TableFontColor+"'>"+json.get(tooltipTables,"FrameTable")+"</table>"]
	
	[h:pm.FinalPretext = tooltipFrameTableText+pm.AbilityEffect]
	[h:pm.FinalPosttext = pm.SpellPosttext+"</div></div>"]
	[h:pm.SpellData = json.set(pm.SpellData,"Pretext",pm.FinalPretext,"Posttext",pm.FinalPosttext,"OuterBorderTooltip",pm.BorderTooltip,"OuterBorderFrame",pm.BorderFrame)]
	[r,MACRO(json.get(pm.SpellData,"SpellName")+" ("+json.get(pm.SpellData,"sLevel")+")@Lib:Complete Spellbook"):pm.SpellData]
};{
	[h,if(json.get(pm.SpellResourceData,"Resource")==""),CODE:{[h:pm.ResourceMessage = ""][h:abilityResourceLegal=1]};{
	[h:ResourceInfo = pm.AbilityResources(pm.AbilityData,json.get(pm.SpellResourceData,"Resource"),json.get(pm.SpellResourceData,"ResourceUsedVar"),json.get(pm.SpellResourceData,"ResourceBaseUsed"),json.get(pm.SpellResourceData,"SpellSlotOption"),json.get(pm.SpellResourceData,"SpecialRecharge"))]
	[h:abilityResourceUsed = json.get(ResourceInfo,"Value")]
	[h:abilityResourceLegal = json.get(ResourceInfo,"Units")]
	[h:abilityTable = json.append(abilityTable,ResourceInfo)]
	}]
	[h,if(abilityResourceLegal==0),CODE:{[h:pm.ErrorFormat()]};{}]
	
	[h:pm.FinalPosttext = pm.SpellPosttext+"</div></div>"]
	[h:pm.SpellData = json.set(pm.SpellData,"Pretext",pm.AbilityEffect,"Posttext",pm.FinalPosttext)]	
	[r:pm.MacroFormat(pm.AbilityData)]
	[h:outputTest.NoFullMacro = json.get(macro.return,"NoFullMacro")]
	[h:outputTest.NoRolls = json.get(macro.return,"NoRolls")]
	[h:outputTest.NoRules = json.get(macro.return,"NoRules")]
	
	[h:pm.AbilityTableFinal = pm.AbilityTableProcessing(abilityTable,macro.return,json.get(pm.AbilityData,"ShowFullRules"))]
	[h:output.Temp=pm.AbilityTableFinal+pm.AbilityEffect]
	[r:if(outputTest.NoRules,"",output.Temp)]
	[g,r:if(outputTest.NoRules,output.Temp,"")]
	
	[r,MACRO(json.get(pm.SpellData,"SpellName")+" ("+json.get(pm.SpellData,"sLevel")+")@Lib:Complete Spellbook"):pm.SpellData]
	
	[h:output.Temp="</div></div>"]
	[r:if(outputTest.NoRules,"",output.Temp)]
	[g,r:if(outputTest.NoRules,output.Temp,"")]
}]