[h:SpellPrepData = macro.args]
[h:ParentToken = json.get(SpellPrepData,"ParentToken")]
[h:switchToken(ParentToken)]
[h:IsTooltip = 0]
[h:FeaturesForSelection = json.get(SpellPrepData,"Features")]
[h,if(json.type(FeaturesForSelection)=="OBJECT"): FeaturesForSelection = json.append("",FeaturesForSelection)]

[h:FeaturesWithSpellOptions = json.path.read(FeaturesForSelection,"[*][?(@.SpellOptions != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:]