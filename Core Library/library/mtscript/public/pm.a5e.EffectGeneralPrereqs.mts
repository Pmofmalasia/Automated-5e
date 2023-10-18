[h:EffectToCheck = arg(0)]
[h:GeneralPrerequisites = arg(1)]

[h,if(json.contains(GeneralPrerequisites,"Magical")): return(json.get(EffectToCheck,"Magical") == json.get(GeneralPrerequisites,"Magical"),0)]

[h:return(0,1)]