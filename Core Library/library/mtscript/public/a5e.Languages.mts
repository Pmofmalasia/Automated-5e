[h:pm.Languages = json.path.read(allAbilities,"[?(@.Languages!=null && @.IsActive>0)]['Languages']","DEFAULT_PATH_LEAF_TO_NULL")]
[h:pm.FinalLanguages = "{}"]
[h,foreach(feature,pm.Languages): pm.FinalLanguages = json.merge(pm.FinalLanguages,feature)]
[h:macro.return = pm.FinalLanguages]