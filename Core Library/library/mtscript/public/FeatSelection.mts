[h:ft.Array = data.getData("addon:","pm.a5e.core","sb.Feats")]
[h:ft.UseRestrictions = json.get(macro.args,"Restrictions")]
[h:ft.IsLevelUp = json.get(macro.args,"LevelUp")]
[h:ParentToken = json.get(macro.args,"ParentToken")]
[h:switchToken(ParentToken)]
[h:ft.Valid = ""]

[h,foreach(feat,ft.Array),CODE:{
	[h,if(json.get(feat,"Prereqs")=="" || ft.UseRestrictions==0),CODE:{
		[h:ft.Valid = json.append(ft.Valid,feat)]
	};{
		[h:pm.a5e.CheckFeaturePrereqs(json.set(json.get(feat,"Prereqs"),"ParentToken",ParentToken))]
		[h:ft.Valid = if(macro.return,json.append(ft.Valid,feat),ft.Valid)]
	}]
}]

[h,if(json.isEmpty(ft.Valid)),CODE:{
	[h:ft.Options = "No valid feats! Hit cancel to restart leveling."]
};{
	[h:ft.Valid = json.sort(ft.Valid,"a","DisplayName")]
	[h:ft.Options = json.toList(json.path.read(ft.Valid,"\$[*].DisplayName"))]
}]
[h:abort(input(
	if(getProperty("a5e.stat.Level") == 0," junkVar | Note: All feats are displayed without restriction, as all decisions have not been applied to your character yet. |  | LABEL | SPAN=TRUE ## junkVar | Make sure to double-check that you will have all prerequisites to your choice of feat after you have finished leveling. |  | LABEL | SPAN=TRUE ## junkVar | ------------------------------------------------------------------------------------------------- |  | LABEL | SPAN=TRUE",""),
	" ft.Choice | "+ft.Options+" | Choose a feat | RADIO "
))]

[h:macro.return = json.get(ft.Valid,ft.Choice)]