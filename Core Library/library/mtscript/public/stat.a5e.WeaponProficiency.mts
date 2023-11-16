[h,if(argCount() > 0),CODE:{
	[h:ParentToken = arg(0)]
	[h:a5e.UnifiedAbilities = arg(1)]
};{
	[h:ParentToken = currentToken()]
	[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
}]

[h:pm.a5e.OverarchingContext = "Stats"]
[h:IsTooltip = 0]

[h:FinalWeaponProficiencies = "{}"]
[h:allWeaponProficiencies = json.path.read(a5e.UnifiedAbilities,"\$[*][?(@.Weapons != null && @.IsActive > 0)]['Weapons']","DEFAULT_PATH_LEAF_TO_NULL")]
[h,foreach(feature,allWeaponProficiencies): FinalWeaponProficiencies = json.merge(FinalWeaponProficiencies,feature)]

[h:FinalWeaponProficiencies = json.remove(FinalWeaponProficiencies,"Backup")]
[h:FinalWeaponProficiencies = json.remove(FinalWeaponProficiencies,"AlreadyProf")]

[h:return(0,FinalWeaponProficiencies)]