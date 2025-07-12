[h:currentHideAllyMacros = data.getData("addon:","pm.a5e.core","HideAllyMacros")]
[h:currentHideEnemyMacros = data.getData("addon:","pm.a5e.core","HideEnemyMacros")]

[h:abort(input(
	" junkVar | ------------- Select GM Chat Settings ------------- |  | LABEL | SPAN=TRUE ",
	" HideAllyMacros | Hide Nothing,Only Show Rules,Show Rules and Dice Rolled,Show Nothing | Ally Macro Details Visible to Players | LIST | SELECT="+currentHideAllyMacros+" ",
	" HideEnemyMacros | Hide Nothing,Only Show Rules,Show Rules and Dice Rolled,Show Nothing | Enemy Macro Details Visible to Players | LIST | SELECT="+currentHideEnemyMacros+""
))]

[h:data.setData("addon:","pm.a5e.core","HideAllyMacros",HideAllyMacros)]
[h:data.setData("addon:","pm.a5e.core","HideEnemyMacros",HideEnemyMacros)]