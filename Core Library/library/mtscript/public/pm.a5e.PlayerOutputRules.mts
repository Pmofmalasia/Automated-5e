[h:needsSplitGMOutput = json.get(arg(0),"needsSplitGMOutput")]
[h:abilityTable = json.get(arg(0),"Table")]
[h:ParentToken = json.get(arg(0),"ParentToken")]
[h,if(ParentToken!=""): switchToken(ParentToken)]

[h,if(currentToken() == ""),CODE:{
	[h:outputTest.NoRules = needsSplitGMOutput]
	[h:outputTest.NoRolls = needsSplitGMOutput]
	[h:outputTest.NoFullMacro = needsSplitGMOutput]
	[h:return(0,json.set("","NoFullMacro",outputTest.NoFullMacro,"NoRolls",outputTest.NoRolls,"NoRules",outputTest.NoRules))]
};{}]

[h,if(needsSplitGMOutput),CODE:{
	[h:isOnlyRules = json.isEmpty(json.path.read(abilityTable,"\$[*][?((@.FullContents != '' && @.FullContents != null) || (@.RollContents != '' && @.RollContents != null) || (@.BonusSectionNum != 0 && @.BonusSectionNum != null))]","DEFAULT_PATH_LEAF_TO_NULL"))]
	[h,switch(getProperty("a5e.stat.Allegiance")),CODE:
		case "Enemy":{
			[h:enemyMacroHidingSelection = number(data.getData("addon:","pm.a5e.core","HideEnemyMacros"))]
			[h:outputTest.NoRules = enemyMacroHidingSelection < 1]
			[h:outputTest.NoRolls = enemyMacroHidingSelection < 2]
			[h:outputTest.NoFullMacro = if(enemyMacroHidingSelection < 3,if(and(isOnlyRules,outputTest.NoRules),1,0),1)]
		};
		case "Ally":{
			[h:allyMacroHidingSelection = number(data.getData("addon:","pm.a5e.core","HideAllyMacros"))]
			[h:outputTest.NoRules = allyMacroHidingSelection < 1]
			[h:outputTest.NoRolls = allyMacroHidingSelection < 2]
			[h:outputTest.NoFullMacro = if(allyMacroHidingSelection < 3,if(and(isOnlyRules,outputTest.NoRules),1,0),1)]
		};
		default:{
			[h:outputTest.NoRules = 0]
			[h:outputTest.NoRolls = 0]
			[h:outputTest.NoFullMacro = 0]	
		}
	]
};{
	[h:outputTest.NoRules = 0]
	[h:outputTest.NoRolls = 0]
	[h:outputTest.NoFullMacro = 0]
}]

[h:return(0,json.set("","NoFullMacro",outputTest.NoFullMacro,"NoRolls",outputTest.NoRolls,"NoRules",outputTest.NoRules))]