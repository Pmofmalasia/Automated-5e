[h,if(argCount() == 0),CODE:{
	[h:ParentToken = currentToken()]
	[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
};{
	[h:ParentToken = arg(0)]
	[h:a5e.UnifiedAbilities = arg(1)]
}]

[h:pm.Languages = json.path.read(a5e.UnifiedAbilities,"\$[*][?(@.Languages!=null && @.IsActive>0)]['Languages']","DEFAULT_PATH_LEAF_TO_NULL")]
[h:pm.FinalLanguages = "{}"]
[h,foreach(feature,pm.Languages): pm.FinalLanguages = json.merge(pm.FinalLanguages,feature)]
[h:macro.return = pm.FinalLanguages]