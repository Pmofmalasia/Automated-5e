[h:pm.ResourceInfo = arg(1)]
[h:pm.a5e.FeatureComponentStdVars(arg(0))]

[h:pm.FeatureResourceData = json.get(pm.ResourceInfo,"Feature")]
[h:pm.FeatureBackupResourceData = json.get(pm.ResourceInfo,"FeatureBackup")]
[h:pm.SpellSlotData = json.get(pm.ResourceInfo,"SpellSlots")]
[h:pm.HitDiceData = json.get(pm.ResourceInfo,"HitDice")]

[h,if(pm.FeatureResourceData!=""),CODE:{
	[h:pm.FeatureResource = json.get(pm.FeatureResourceData,"Resource")]
	[h:pm.FeatureResourceUsed = json.get(pm.FeatureResourceData,"ResourceUsed")]
	[h:pm.FeatureResourceUsedMax = if(json.get(pm.FeatureResourceData,"ResourceUsedMax")=="",pm.FeatureResourceUsed,json.get(pm.FeatureResourceData,"ResourceUsedMax"))]
};{
	[h:pm.FeatureResource = ""]
	[h:pm.FeatureResourceUsed = 1]
	[h:pm.FeatureResourceUsedMax = 1]
}]

[h,if(pm.FeatureBackupResourceData!=""),CODE:{
	[h:pm.FeatureBackupResource = json.get(pm.FeatureBackupResourceData,"Resource")]
	[h:pm.FeatureBackupResourceUsed = json.get(pm.FeatureBackupResourceData,"ResourceUsed")]
	[h:pm.FeatureBackupResourceUsedMax = if(json.get(pm.FeatureBackupResourceData,"ResourceUsedMax")=="",pm.FeatureBackupResourceUsed,json.get(pm.FeatureBackupResourceData,"ResourceUsedMax"))]
};{
	[h:pm.FeatureBackupResource = ""]
	[h:pm.FeatureBackupResourceUsed = 1]
	[h:pm.FeatureBackupResourceUsedMax = 1]
}]

[h,if(pm.SpellSlotData!=""),CODE:{
	[h:pm.SpellOption = json.get(pm.SpellSlotData,"Option")]
	[h:pm.SpellLevelMin=if(json.get(pm.SpellSlotData,"SpellLevelMin")=="",1,json.get(pm.SpellSlotData,"SpellLevelMin"))]
	[h:pm.SpellLevelMax=if(json.get(pm.SpellSlotData,"SpellLevelMax")=="",99,json.get(pm.SpellSlotData,"SpellLevelMax"))]
};{
	[h:pm.SpellOption = 0]
	[h:pm.SpellLevelMin=1]
	[h:pm.SpellLevelMax=999]
}]

[h,if(pm.HitDiceData!=""),CODE:{
	[h:pm.HitDiceOption = json.get(pm.HitDiceData,"Option")]
	[h:pm.HitDiceUsed = json.get(pm.HitDiceData,"ResourceUsed")]
	[h:pm.HitDiceUsedMax = if(json.get(pm.HitDiceData,"ResourceUsedMax")=="",pm.HitDiceUsed,json.get(pm.HitDiceData,"ResourceUsedMax"))]
};{
	[h:pm.HitDiceOption = 0]
	[h:pm.HitDiceUsed = 1]
	[h:pm.HitDiceUsedMax = 1]
}]

[h,if(argCount()>2),CODE:{
	[h:pm.ResourceChoiceMsg = json.get(arg(2),"Message")]
	[h:pm.ResourceRestorationSpecial = json.get(arg(2),"SpecialRestoration")]
};{
	[h:pm.ResourceChoiceMsg = ""]
	[h:pm.ResourceRestorationSpecial = ""]
}]

[h:ResourceOptions = "[]"]
[h:ResourceInfo = "[]"]
[h:BackupResourceOptions = "[]"]
[h:BackupResourceInfo = "[]"]
[h:resourcesAsSpellSlot = json.path.read(allAbilities,"[*][?(@.ResourceAsSpellSlot==1)]")]

[h,switch((pm.FeatureResource!="")+""+json.type(pm.FeatureResource)),CODE:
	case "1UNKNOWN":{
		[h:featureResourceData = pm.a5e.GeneralFeatureResourceOptions(pm.FeatureResource,pm.FeatureResourceUsed)]
      
        [h:ResourceInfo = json.append(ResourceInfo,featureResourceData)]
		[h:pm.FeatureResourceUsedMaxFinal = min(json.get(featureResourceData,"Resource"),pm.FeatureResourceUsedMax)]
	};
	case "1OBJECT":{
		[h:pm.ResourceKey = json.get(pm.FeatureResource,"ResourceKey")]
		[h:featureResourceData = pm.a5e.SpecificFeatureResourceOptions(pm.FeatureResource,pm.FeatureResourceUsed,pm.ResourceKey)]
        
		[h:ResourceInfo = json.append(ResourceInfo,featureResourceData)]
		[h,if(pm.ResourceKey==""):
			pm.FeatureResourceUsedMaxFinal = min(json.get(featureResourceData,"Resource"),pm.FeatureResourceUsedMax);
			pm.FeatureResourceUsedMaxFinal = min(json.get(json.get(featureResourceData,"Resource"),pm.ResourceKey),pm.FeatureResourceUsedMax)		
		]
	};
	case "1ARRAY":{
		[h:pm.FeatureResourceUsedMaxFinal = 0]
		[h,foreach(resource,pm.FeatureResource),CODE:{
			[h,if(json.type(resource)=="UNKNOWN"): pm.ResourceKey = ""; pm.ResourceKey = json.get(resource,"ResourceKey")]
			
			[h,if(json.type(resource)=="UNKNOWN"):
				featureResourceData = pm.a5e.GeneralFeatureResourceOptions(pm.FeatureResource,pm.FeatureResourceUsed);
				featureResourceData = pm.a5e.SpecificFeatureResourceOptions(pm.FeatureResource,pm.FeatureResourceUsed,pm.ResourceKey)
			]
			
			[h,if(pm.ResourceKey==""):
				pm.FeatureResourceUsedMaxFinal = max(pm.FeatureResourceUsedMaxFinal,min(json.get(featureResourceData,"Resource"),pm.FeatureResourceUsedMax));
				pm.FeatureResourceUsedMaxFinal = max(pm.FeatureResourceUsedMaxFinal,min(json.get(json.get(featureResourceData,"Resource"),pm.ResourceKey),pm.FeatureResourceUsedMax))
			]
			
			[h:ResourceInfo = json.append(json.get(featureResourceData,"Info"))]
		}]
	};
	default:{[h:pm.FeatureResourceUsedMaxFinal = 0]}
]

[h,switch((pm.FeatureBackupResource!="")+""+json.type(pm.FeatureBackupResource)),CODE:
	case "1UNKNOWN":{
		[h:featureBackupResourceData = pm.a5e.GeneralFeatureResourceOptions(pm.FeatureBackupResource,pm.FeatureBackupResourceUsed)]
		[h:BackupResourceInfo = json.append(BackupResourceInfo,featureBackupResourceData)]
		
		[h:pm.FeatureBackupResourceUsedMaxFinal = min(json.get(featureBackupResourceData,"Resource"),pm.FeatureBackupResourceUsedMax)]
	};
	case "1OBJECT":{
		[h:pm.ResourceKey = json.get(pm.FeatureBackupResource,"ResourceKey")]
		[h:featureBackupResourceData = pm.a5e.SpecificFeatureResourceOptions(pm.FeatureBackupResource,pm.FeatureBackupResourceUsed,pm.ResourceKey)]
		[h:BackupResourceInfo = json.append(BackupResourceInfo,featureBackupResourceData)]
		
		[h,if(pm.ResourceKey==""):
			pm.FeatureBackupResourceUsedMaxFinal = min(json.get(featureBackupResourceData,"Resource"),pm.FeatureBackupResourceUsedMax);
			pm.FeatureBackupResourceUsedMaxFinal = min(json.get(json.get(featureBackupResourceData,"Resource"),pm.ResourceKey),pm.FeatureBackupResourceUsedMax)		
		]
	};
	case "1ARRAY":{
		[h:pm.FeatureBackupResourceUsedMaxFinal = 0]
		[h,foreach(resource,pm.FeatureBackupResource),CODE:{
			[h,if(json.type(resource)=="UNKNOWN"): pm.ResourceKey = ""; pm.ResourceKey = json.get(resource,"ResourceKey")]
			
			[h,if(json.type(resource)=="UNKNOWN"):
				featureBackupResourceData = pm.a5e.GeneralFeatureResourceOptions(pm.FeatureBackupResource,pm.FeatureBackupResourceUsed);
				featureBackupResourceData = pm.a5e.SpecificFeatureResourceOptions(pm.FeatureBackupResource,pm.FeatureBackupResourceUsed,pm.ResourceKey)
			]
			
			[h,if(pm.ResourceKey==""):
				pm.FeatureBackupResourceUsedMaxFinal = max(pm.FeatureBackupResourceUsedMaxFinal,min(json.get(featureBackupResourceData,"Resource"),pm.FeatureBackupResourceUsedMax));
				pm.FeatureBackupResourceUsedMaxFinal = max(pm.FeatureBackupResourceUsedMaxFinal,min(json.get(json.get(featureBackupResourceData,"Resource"),pm.ResourceKey),pm.FeatureBackupResourceUsedMax))
			]
			
			[h:BackupResourceInfo = json.append(json.get(featureBackupResourceData,"Info"))]
		}]
	};
	default:{[h:pm.FeatureBackupResourceUsedMaxFinal = 0]}
]

[h,switch(pm.SpellOption),CODE:
	case 0:{};
	case 1:{
		[h,foreach(resource,resourcesAsSpellSlot),CODE:{
			[h:tempResourceDisplayName = if(json.get(resource,"ResourceDisplayName")=="",json.get(resource,"DisplayName"),json.get(resource,"ResourceDisplayName"))]
			[h:ResourceInfo = json.append(ResourceInfo,
				json.set(resource,
				"TempResourceDisplayName",tempResourceDisplayName,
				"TempResourceType",if(IsTooltip,"Spell Slots","FeatureSpell"),
				"TempEnoughResource",json.get(resource,"Resource")>0)
			)]
		}]
		
		[h,if(pm.SpellLevelMin<=1 && pm.SpellLevelMax>=1 && json.get(MaxSpellSlots,"1")>0),CODE:{
			[h:ResourceInfo = json.append(ResourceInfo,
				json.set("",
				"Name","1",
				"TempResourceDisplayName","1st Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"1")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=2 && pm.SpellLevelMax>=2 && json.get(MaxSpellSlots,"2")>0),CODE:{
			[h:ResourceInfo = json.append(ResourceInfo,
				json.set("",
				"Name","2",
				"TempResourceDisplayName","2nd Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"2")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=3 && pm.SpellLevelMax>=3 && json.get(MaxSpellSlots,"3")>0),CODE:{
			[h:ResourceInfo = json.append(ResourceInfo,
				json.set("",
				"Name","3",
				"TempResourceDisplayName","3rd Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"3")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=4 && pm.SpellLevelMax>=4 && json.get(MaxSpellSlots,"4")>0),CODE:{
			[h:ResourceInfo = json.append(ResourceInfo,
				json.set("",
				"Name","4",
				"TempResourceDisplayName","4th Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"4")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=5 && pm.SpellLevelMax>=5 && json.get(MaxSpellSlots,"5")>0),CODE:{
			[h:ResourceInfo = json.append(ResourceInfo,
				json.set("",
				"Name","5",
				"TempResourceDisplayName","5th Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"5")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=6 && pm.SpellLevelMax>=6 && json.get(MaxSpellSlots,"6")>0),CODE:{
			[h:ResourceInfo = json.append(ResourceInfo,
				json.set("",
				"Name","6",
				"TempResourceDisplayName","6th Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"6")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=7 && pm.SpellLevelMax>=7 && json.get(MaxSpellSlots,"7")>0),CODE:{
			[h:ResourceInfo = json.append(ResourceInfo,
				json.set("",
				"Name","7",
				"TempResourceDisplayName","7th Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"7")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=8 && pm.SpellLevelMax>=8 && json.get(MaxSpellSlots,"8")>0),CODE:{
			[h:ResourceInfo = json.append(ResourceInfo,
				json.set("",
				"Name","8",
				"TempResourceDisplayName","8th Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"8")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=9 && pm.SpellLevelMax>=9 && json.get(MaxSpellSlots,"9")>0),CODE:{
			[h:ResourceInfo = json.append(ResourceInfo,
				json.set("",
				"Name","9",
				"TempResourceDisplayName","9th Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"9")>0))
			]
		};{}]
	};
	case 2:{
		[h,foreach(resource,resourcesAsSpellSlot),CODE:{
			[h:tempResourceDisplayName = if(json.get(resource,"ResourceDisplayName")=="",json.get(resource,"DisplayName"),json.get(resource,"ResourceDisplayName"))]
			[h:BackupResourceInfo = json.append(BackupResourceInfo,
				json.set(resource,
				"TempResourceDisplayName",tempResourceDisplayName,
				"TempResourceType",if(IsTooltip,"Spell Slots","FeatureSpell"),
				"TempEnoughResource",json.get(resource,"Resource")>0)
			)]
		}]
		
		[h,if(pm.SpellLevelMin<=1 && pm.SpellLevelMax>=1 && json.get(MaxSpellSlots,"1")>0),CODE:{
			[h:BackupResourceInfo = json.append(BackupResourceInfo,
				json.set("",
				"Name","1",
				"TempResourceDisplayName","1st Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"1")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=2 && pm.SpellLevelMax>=2 && json.get(MaxSpellSlots,"2")>0),CODE:{
			[h:BackupResourceInfo = json.append(BackupResourceInfo,
				json.set("",
				"Name","2",
				"TempResourceDisplayName","2nd Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"2")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=3 && pm.SpellLevelMax>=3 && json.get(MaxSpellSlots,"3")>0),CODE:{
			[h:BackupResourceInfo = json.append(BackupResourceInfo,
				json.set("",
				"Name","3",
				"TempResourceDisplayName","3rd Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"3")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=4 && pm.SpellLevelMax>=4 && json.get(MaxSpellSlots,"4")>0),CODE:{
			[h:BackupResourceInfo = json.append(BackupResourceInfo,
				json.set("",
				"Name","4",
				"TempResourceDisplayName","4th Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"4")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=5 && pm.SpellLevelMax>=5 && json.get(MaxSpellSlots,"5")>0),CODE:{
			[h:BackupResourceInfo = json.append(BackupResourceInfo,
				json.set("",
				"Name","5",
				"TempResourceDisplayName","5th Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"5")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=6 && pm.SpellLevelMax>=6 && json.get(MaxSpellSlots,"6")>0),CODE:{
			[h:BackupResourceInfo = json.append(BackupResourceInfo,
				json.set("",
				"Name","6",
				"TempResourceDisplayName","6th Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"6")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=7 && pm.SpellLevelMax>=7 && json.get(MaxSpellSlots,"7")>0),CODE:{
			[h:BackupResourceInfo = json.append(BackupResourceInfo,
				json.set("",
				"Name","7",
				"TempResourceDisplayName","7th Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"7")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=8 && pm.SpellLevelMax>=8 && json.get(MaxSpellSlots,"8")>0),CODE:{
			[h:BackupResourceInfo = json.append(BackupResourceInfo,
				json.set("",
				"Name","8",
				"TempResourceDisplayName","8th Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"8")>0))
			]
		};{}]
		[h,if(pm.SpellLevelMin<=9 && pm.SpellLevelMax>=9 && json.get(MaxSpellSlots,"9")>0),CODE:{
			[h:BackupResourceInfo = json.append(BackupResourceInfo,
				json.set("",
				"Name","9",
				"TempResourceDisplayName","9th Level",
				"TempResourceType","Spell Slots",
				"TempEnoughResource",json.get(SpellSlots,"9")>0))
			]
		};{}]
	};
	default:{}
]

[h,switch(pm.HitDiceOption),CODE:
	case 0:{
		[h:pm.HitDiceUsedMaxFinal = 0]
		[h:pm.BackupHitDiceUsedMaxFinal = 0]
	};
	case 1:{
		[h:pm.HitDiceUsedMaxFinal = 0]
		[h:pm.BackupHitDiceUsedMaxFinal = 0]
		[h,if(json.get(MaxHitDice,"1d6")>0),CODE:{
			[h:ResourceInfo = json.append(ResourceInfo,
				json.set("",
				"Name","6",
				"TempResourceDisplayName","Hit Die: d6",
				"TempResourceType","Hit Dice",
				"TempEnoughResource",json.get(HitDice,"1d6")>0))
			]
			[h:pm.HitDiceUsedMaxFinal = max(pm.HitDiceUsedMaxFinal,min(pm.HitDiceUsedMax,json.get(HitDice,"1d6")))]
		};{}]
		[h,if(json.get(MaxHitDice,"1d8")>0),CODE:{
			[h:ResourceInfo = json.append(ResourceInfo,
				json.set("",
				"Name","8",
				"TempResourceDisplayName","Hit Die: d8",
				"TempResourceType","Hit Dice",
				"TempEnoughResource",json.get(HitDice,"1d8")>0))
			]
			[h:pm.HitDiceUsedMaxFinal = max(pm.HitDiceUsedMaxFinal,min(pm.HitDiceUsedMax,json.get(HitDice,"1d8")))]
		};{}]
		[h,if(json.get(MaxHitDice,"1d10")>0),CODE:{
			[h:ResourceInfo = json.append(ResourceInfo,
				json.set("",
				"Name","10",
				"TempResourceDisplayName","Hit Die: d10",
				"TempResourceType","Hit Dice",
				"TempEnoughResource",json.get(HitDice,"1d10")>0))
			]
			[h:pm.HitDiceUsedMaxFinal = max(pm.HitDiceUsedMaxFinal,min(pm.HitDiceUsedMax,json.get(HitDice,"1d10")))]
		};{}]
		[h,if(json.get(MaxHitDice,"1d12")>0),CODE:{
			[h:ResourceInfo = json.append(ResourceInfo,
				json.set("",
				"Name","1d12",
				"TempResourceDisplayName","Hit Die: d12",
				"TempResourceType","Hit Dice",
				"TempEnoughResource",json.get(HitDice,"1d12")>0))
			]
			[h:pm.HitDiceUsedMaxFinal = max(pm.HitDiceUsedMaxFinal,min(pm.HitDiceUsedMax,json.get(HitDice,"1d12")))]
		};{}]
	};
	case 2:{
		[h:pm.HitDiceUsedMaxFinal = 0]
		[h:pm.BackupHitDiceUsedMaxFinal = 0]
		[h,if(json.get(MaxHitDice,"1d6")>0),CODE:{
			[h:BackupResourceInfo = json.append(BackupResourceInfo,
				json.set("",
				"Name","6",
				"TempResourceDisplayName","Hit Die: d6",
				"TempResourceType","Hit Dice",
				"TempEnoughResource",json.get(HitDice,"1d6")>0))
			]
			[h:pm.BackupHitDiceUsedMaxFinal = max(pm.BackupHitDiceUsedMaxFinal,min(pm.HitDiceUsedMax,json.get(HitDice,"1d6")))]
		};{}]
		[h,if(json.get(MaxHitDice,"1d8")>0),CODE:{
			[h:BackupResourceInfo = json.append(BackupResourceInfo,
				json.set("",
				"Name","8",
				"TempResourceDisplayName","Hit Die: d8",
				"TempResourceType","Hit Dice",
				"TempEnoughResource",json.get(HitDice,"1d8")>0))
			]
			[h:pm.BackupHitDiceUsedMaxFinal = max(pm.BackupHitDiceUsedMaxFinal,min(pm.HitDiceUsedMax,json.get(HitDice,"1d8")))]
		};{}]
		[h,if(json.get(MaxHitDice,"1d10")>0),CODE:{
			[h:BackupResourceInfo = json.append(BackupResourceInfo,
				json.set("",
				"Name","10",
				"TempResourceDisplayName","Hit Die: d10",
				"TempResourceType","Hit Dice",
				"TempEnoughResource",json.get(HitDice,"1d10")>0))
			]
			[h:pm.BackupHitDiceUsedMaxFinal = max(pm.BackupHitDiceUsedMaxFinal,min(pm.HitDiceUsedMax,json.get(HitDice,"1d10")))]
		};{}]
		[h,if(json.get(MaxHitDice,"1d12")>0),CODE:{
			[h:BackupResourceInfo = json.append(BackupResourceInfo,
				json.set("",
				"Name","1d12",
				"TempResourceDisplayName","Hit Die: d12",
				"TempResourceType","Hit Dice",
				"TempEnoughResource",json.get(HitDice,"1d12")>0))
			]
			[h:pm.BackupHitDiceUsedMaxFinal = max(pm.BackupHitDiceUsedMaxFinal,min(pm.HitDiceUsedMax,json.get(HitDice,"1d12")))]
		};{}]
	};
	default:{
		[h:pm.HitDiceUsedMaxFinal = 0]
		[h:pm.BackupHitDiceUsedMaxFinal = 0]
	}
]

[h:enoughResourceInfo = json.path.read(ResourceInfo,"[*][?(@.TempEnoughResource==1)]")]
[h:enoughBackupResourceInfo = json.path.read(BackupResourceInfo,"[*][?(@.TempEnoughResource==1)]")]
[h:ResourceOptions = json.path.read(enoughResourceInfo,"[*]['TempResourceDisplayName']")]
[h:BackupResourceOptions = json.path.read(enoughBackupResourceInfo,"[*]['TempResourceDisplayName']")]
[h:ResourceTypes = json.unique(json.path.read(enoughResourceInfo,"[*]['TempResourceType']"))]
[h:BackupResourceTypes = json.unique(json.path.read(enoughBackupResourceInfo,"[*]['TempResourceType']"))]

[h:BackupResourceMax = -1]
[h,if(json.contains(BackupResourceTypes,"HitDice")): BackupResourceMax = max(BackupResourceMax,pm.BackupHitDiceUsedMaxFinal)]
[h,if(json.contains(BackupResourceTypes,"Feature")): BackupResourceMax = max(BackupResourceMax,pm.FeatureBackupResourceUsedMaxFinal)]
[h,if(BackupResourceMax == -1): BackupResourceMax = 1]

[h:BackupResourceMin = -1]
[h,if(json.contains(BackupResourceTypes,"HitDice")): BackupResourceMin = if(BackupResourceMin==-1,pm.HitDiceUsed,min(BackupResourceMin,pm.HitDiceUsed))]
[h,if(json.contains(BackupResourceTypes,"Feature")): BackupResourceMin = if(BackupResourceMin==-1,pm.FeatureBackupResourceUsed,min(BackupResourceMin,pm.FeatureBackupResourceUsed))]
[h,if(BackupResourceMin == -1): BackupResourceMin = 1]

[h:ResourceUsed = BackupResourceMin]
[h:BackupResourceAmountOptions = ""]
[h,count(BackupResourceMax - (BackupResourceMin-1)): BackupResourceAmountOptions = listAppend(BackupResourceAmountOptions,(roll.count+BackupResourceMin))]

[h,if(IsTooltip && json.isEmpty(enoughResourceInfo) && !json.isEmpty(BackupResourceInfo)),CODE:{
	[h:resourceToDisplay = ""]
	[h,if(json.path.read(BackupResourceInfo,"[*][?(@.TempResourceType=='Spell Slots')]")!="[]"): resourceToDisplay = "Spell Slots"]
	[h,if(json.path.read(BackupResourceInfo,"[*][?(@.TempResourceType=='Hit Dice')]")!="[]"): resourceToDisplay = "Hit Dice"]
	[h,if(json.path.read(BackupResourceInfo,"[*][?(@.TempResourceType=='Feature')]")!="[]"): resourceToDisplay = "Feature"]
	
	[h:featureBackupResourceTable = "[]"]
	[h,foreach(resource,BackupResourceInfo),CODE:{
		[h,if(json.get(resource,"ResourceKey")==""):
			featureBackupResourceTable = json.append(featureBackupResourceTable,json.set("",
			"ShowIfCondensed",1,
			"Header",json.get(resource,"TempResourceDisplayName")+" Remaining",
			"FalseHeader","",
			"FullContents","",
			"RulesContents","<b><span style='font-size:1.25em;'>"+json.get(resource,"Resource")+"/"+evalMacro(json.get(resource,"MaxResource"))+"</span></b> - Restored on "+if(json.get(resource,"RestoreShortRest")==1,"Short and ","")+"Long Rests",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
			));
			featureBackupResourceTable = json.append(featureBackupResourceTable,json.set("",
			"ShowIfCondensed",1,
			"Header",json.get(resource,"TempResourceDisplayName")+" Remaining",
			"FalseHeader","",
			"FullContents","",
			"RulesContents","<b><span style='font-size:1.25em;'>"+json.get(json.get(resource,"Resource"),json.get(resource,"ResourceKey"))+"/"+json.get(evalMacro(json.get(resource,"MaxResource")),json.get(resource,"ResourceKey"))+"</span></b> - Restored on "+if(json.get(resource,"RestoreShortRest")==1,"Short and ","")+"Long Rests",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
			))
		]
	}]
	
	[h,SWITCH(resourceToDisplay):
		case "Spell Slots": resourceTable = json.append("",json.set("","ShowIfCondensed",1,"Header","Spell Slots Remaining","FalseHeader","","FullContents","","RulesContents","<b><span style='font-size:1.25em;'>"+pm.SpellSlots()+"</span></b>","RollContents","","DisplayOrder","['Rules','Roll','Full']"));
		case "Hit Dice": resourceTable = json.append("",json.set("","ShowIfCondensed",1,"Header","Hit Dice Remaining","FalseHeader","","FullContents","","RulesContents","<b><span style='font-size:1.25em;'>"+a5e.HitDieDisplay()+"</span></b>","RollContents","","DisplayOrder","['Rules','Roll','Full']"));
		case "Feature": resourceTable = featureBackupResourceTable
	]
	[h:abilityTable = json.merge(abilityTable,resourceTable)]
	[h:currentFeatureSpellLevel = pm.SpellLevelMin]
	[h:currentFeatureHitDieSize = 8]
	[h:currentFeatureResourceSpentType = ""]
	[h:currentFeatureResourceSpentAmount = ResourceUsed]
	[h:currentFeatureResourceSpentName = ""]
	[h:return(0)]
};{}]

[h:ResourceMax = -1]
[h,if(json.contains(ResourceTypes,"HitDice")): ResourceMax = max(ResourceMax,pm.HitDiceUsedMaxFinal)]
[h,if(json.contains(ResourceTypes,"Feature")): ResourceMax = max(ResourceMax,pm.FeatureResourceUsedMaxFinal)]
[h,if(ResourceMax == -1): ResourceMax = 1]

[h:ResourceMin = -1]
[h,if(json.contains(ResourceTypes,"HitDice")): ResourceMin = if(ResourceMin==-1,pm.HitDiceUsed,min(ResourceMin,pm.HitDiceUsed))]
[h,if(json.contains(ResourceTypes,"Feature")): ResourceMin = if(ResourceMin==-1,pm.FeatureResourceUsed,min(ResourceMin,pm.FeatureResourceUsed))]
[h,if(ResourceMin == -1): ResourceMin = 1]

[h:ResourceUsed = ResourceMin]
[h:ResourceAmountOptions = ""]
[h,count(ResourceMax - (ResourceMin-1)): ResourceAmountOptions = listAppend(ResourceAmountOptions,(roll.count+ResourceMin))]

[h,if(IsTooltip),CODE:{
	[h:resourceToDisplay = ""]
	[h,if(json.path.read(ResourceInfo,"[*][?(@.TempResourceType=='Spell Slots')]")!="[]"): resourceToDisplay = "Spell Slots"]
	[h,if(json.path.read(ResourceInfo,"[*][?(@.TempResourceType=='Hit Dice')]")!="[]"): resourceToDisplay = "Hit Dice"]
	[h,if(json.path.read(ResourceInfo,"[*][?(@.TempResourceType=='Feature')]")!="[]"): resourceToDisplay = "Feature"]
	
	[h:featureResourceTable = "[]"]
	[h,foreach(resource,ResourceInfo),CODE:{
		[h,if(json.get(resource,"ResourceKey")==""):
			featureResourceTable = json.append(featureResourceTable,json.set("",
			"ShowIfCondensed",1,
			"Header",json.get(resource,"TempResourceDisplayName")+" Remaining",
			"FalseHeader","",
			"FullContents","",
			"RulesContents","<b><span style='font-size:1.25em;'>"+json.get(resource,"Resource")+" / "+evalMacro(json.get(resource,"MaxResource"))+"</span></b> - Restored on "+if(json.get(resource,"RestoreShortRest")==1,"Short and ","")+"Long Rests",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
			));
			featureResourceTable = json.append(featureResourceTable,json.set("",
			"ShowIfCondensed",1,
			"Header",json.get(resource,"TempResourceDisplayName")+" Remaining",
			"FalseHeader","",
			"FullContents","",
			"RulesContents","<b><span style='font-size:1.25em;'>"+json.get(json.get(resource,"Resource"),json.get(resource,"ResourceKey"))+" / "+json.get(evalMacro(json.get(resource,"MaxResource")),json.get(resource,"ResourceKey"))+"</span></b> - Restored on "+if(json.get(resource,"RestoreShortRest")==1,"Short and ","")+"Long Rests",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']"
			))
		]
	}]
	
	[h,SWITCH(resourceToDisplay):
		case "Spell Slots": resourceTable = json.append("",json.set("","ShowIfCondensed",1,"Header","Spell Slots Remaining","FalseHeader","","FullContents","","RulesContents","<b><span style='font-size:1.25em;'>"+pm.SpellSlots()+"</span></b>","RollContents","","DisplayOrder","['Rules','Roll','Full']"));
		case "Hit Dice": resourceTable = json.append("",json.set("","ShowIfCondensed",1,"Header","Hit Dice Remaining","FalseHeader","","FullContents","","RulesContents","<b><span style='font-size:1.25em;'>"+a5e.HitDieDisplay()+"</span></b>","RollContents","","DisplayOrder","['Rules','Roll','Full']"));
		case "Feature": resourceTable = featureResourceTable
	]
	[h:abilityTable = json.merge(abilityTable,resourceTable)]
	[h:currentFeatureSpellLevel = pm.SpellLevelMin]
	[h:currentFeatureHitDieSize = 8]
	[h:currentFeatureResourceSpentType = ""]
	[h:currentFeatureResourceSpentAmount = ResourceUsed]
	[h:currentFeatureResourceSpentName = ""]
	[h:return(0)]
};{}]

[h:"<!-- A bit annoying to do the logic backwards here (i.e. Has Resource == 0) but using ! to get the opposite requires more parens to not turn the whole thing into a 0 -->"]
[h,SWITCH(json.isEmpty(ResourceOptions)+""+json.isEmpty(BackupResourceOptions)),CODE:
	case "00":{
		[h,if(json.length(enoughResourceInfo)>1),CODE:{
			[h:disResourceAmountChoice = if(listCount(ResourceAmountOptions)>1," ResourceUsed | 0,"+ResourceAmountOptions+" | How much to use | LIST | VALUE=STRING ","")]
			[h:disResourceChoiceMsg = if(pm.ResourceChoiceMsg=="","","junkVar | "+pm.ResourceChoiceMsg+" |  | LABEL | SPAN=TRUE ")]
			
			[h:abort(input(
				disResourceChoiceMsg,
				" ResourceChoice | "+ResourceOptions+" | Choose which Resource to Use | LIST | DELIMITER=JSON ",
				disResourceAmountChoice
			))]
			
			[h:ResourceSelected = json.get(enoughResourceInfo,ResourceChoice)]
		};{
			[h:disResourceAmountChoice = if(listCount(ResourceAmountOptions)>1,"ResourceUsed | 0,"+ResourceAmountOptions+" | How much "+json.get(json.get(enoughResourceInfo,0),"TempResourceDisplayName")+ "to use | LIST | VALUE=STRING ","")]
			[h:disResourceChoiceMsg = if(or(listCount(ResourceAmountOptions)==1,pm.ResourceChoiceMsg==""),"","junkVar | "+pm.ResourceChoiceMsg+" |  | LABEL | SPAN=TRUE ")]
			
			[h:abort(input(
				disResourceChoiceMsg,
				disResourceAmountChoice
			))]
			
			[h:ResourceSelected = json.get(enoughResourceInfo,0)]
		}]
	};
	case "01":{
		[h,if(json.length(enoughResourceInfo)>1),CODE:{
			[h:disResourceAmountChoice = if(listCount(ResourceAmountOptions)>1,"ResourceUsed | 0,"+ResourceAmountOptions+" | How much to use | LIST | VALUE=STRING ","")]
			[h:disResourceChoiceMsg = if(pm.ResourceChoiceMsg=="","","junkVar | "+pm.ResourceChoiceMsg+" |  | LABEL | SPAN=TRUE ")]
			
			[h:abort(input(
				disResourceChoiceMsg,
				" ResourceChoice | "+ResourceOptions+" | Choose which Resource to Use | LIST | DELIMITER=JSON ",
				disResourceAmountChoice
			))]
			
			[h:ResourceSelected = json.get(enoughResourceInfo,ResourceChoice)]
		};{
			[h:disResourceAmountChoice = if(listCount(ResourceAmountOptions)>1,"ResourceUsed | 0,"+ResourceAmountOptions+" | How much "+json.get(json.get(enoughResourceInfo,0),"TempResourceDisplayName")+ "to use | LIST | VALUE=STRING ","")]
			[h:disResourceChoiceMsg = if(or(listCount(ResourceAmountOptions)==1,pm.ResourceChoiceMsg==""),"","junkVar | "+pm.ResourceChoiceMsg+" |  | LABEL | SPAN=TRUE ")]
			
			[h:abort(input(
				disResourceChoiceMsg,
				disResourceAmountChoice
			))]
			
			[h:ResourceSelected = json.get(enoughResourceInfo,0)]
		}]
	};
	case "10":{
		[h,if(json.length(enoughBackupResourceInfo)>1),CODE:{
			[h:ResourceUsed = BackupResourceMin]
			[h:disResourceAmountChoice = if(listCount(BackupResourceAmountOptions)>1,"ResourceUsed | 0,"+BackupResourceAmountOptions+" | How much to use | LIST | VALUE=STRING ","")]
			[h:disResourceChoiceMsg = if(pm.ResourceChoiceMsg=="","","junkVar | "+pm.ResourceChoiceMsg+" |  | LABEL | SPAN=TRUE ")]
			
			[h:abort(input(
				disResourceChoiceMsg,
				" ResourceChoice | "+BackupResourceOptions+" | Choose which Resource to Use | LIST | DELIMITER=JSON ",
				disResourceAmountChoice
			))]
			
			[h:ResourceSelected = json.get(enoughBackupResourceInfo,ResourceChoice)]
		};{
			[h:ResourceUsed = BackupResourceMin]
			[h:disResourceAmountChoice = if(listCount(BackupResourceAmountOptions)>1,"ResourceUsed | 0,"+BackupResourceAmountOptions+" | How much "+json.get(json.get(enoughBackupResourceInfo,0),"TempResourceDisplayName")+ "to use | LIST | VALUE=STRING ","")]
			[h:disResourceChoiceMsg = if(or(listCount(BackupResourceAmountOptions)==1,pm.ResourceChoiceMsg==""),"","junkVar | "+pm.ResourceChoiceMsg+" |  | LABEL | SPAN=TRUE ")]
			
			[h:abort(input(
				disResourceChoiceMsg,
				disResourceAmountChoice
			))]
			
			[h:ResourceSelected = json.get(enoughBackupResourceInfo,0)]
		}]
	};
	case "11":{
		[h,if(json.isEmpty(BackupResourceInfo)): ResourceSelected = json.get(ResourceInfo,0); ResourceSelected = json.get(BackupResourceInfo,0)]
	}
]

[h,SWITCH(json.get(ResourceSelected,"TempResourceType")),CODE:
	case "Spell Slots":{
		[h:SpellLevel = json.get(ResourceSelected,"Name")]
		[h:SpellSlots = json.set(SpellSlots,SpellLevel+"",json.get(SpellSlots,SpellLevel+"")-1)]
		
		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Spell Slots Remaining",
			"FalseHeader","",
			"FullContents","",
			"RulesContents","<b><span style='font-size:1.25em;'>"+pm.SpellSlots()+"</span></b>",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']")
		)]
		[h:currentFeatureSpellLevel = SpellLevel]
		[h:currentFeatureHitDieSize = 8]
		[h:currentFeatureResourceSpentType = "Spell Slots"]
		[h:currentFeatureResourceSpentAmount = 1]
		[h:currentFeatureResourceSpentName = "Spell Slot"]
	};
	case "Hit Dice":{
		[h:HitDieSize = json.get(ResourceSelected,"Name")]
		[h:HitDice = json.set(HitDice,"1d"+HitDieSize,json.get(HitDice,"1d"+HitDieSize)-1)]

		[h:abilityTable = json.append(abilityTable,json.set("",
			"ShowIfCondensed",1,
			"Header","Hit Dice Remaining",
			"FalseHeader","",
			"FullContents","",
			"RulesContents","<b><span style='font-size:1.25em;'>"+a5e.HitDieDisplay()+"</span></b>",
			"RollContents","",
			"DisplayOrder","['Rules','Roll','Full']")
		)]
		[h:currentFeatureSpellLevel = 0]
		[h:currentFeatureHitDieSize = HitDieSize]
		[h:currentFeatureResourceSpentType = "Hit Dice"]
		[h:currentFeatureResourceSpentAmount = 1]
		[h:currentFeatureResourceSpentName = "Hit Dice"]
	};
	case "Feature":{
		[h,if(json.get(ResourceSelected,"TempResourceKey")==""),CODE:{
			[h:ResourceAmount = json.get(ResourceSelected,"Resource") - ResourceUsed]
			[h:allAbilities = json.path.set(allAbilities,"[*][?(@.Name=='"+json.get(ResourceSelected,"Name")+"' && @.Class=='"+json.get(ResourceSelected,"Class")+"' && @.Subclass=='"+json.get(ResourceSelected,"Subclass")+"')]['Resource']",ResourceAmount)]

			[h:abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header",json.get(ResourceSelected,"TempResourceDisplayName")+" Remaining",
				"FalseHeader","",
				"FullContents","",
				"RulesContents","<b><span style='font-size:1.25em;'>"+ResourceAmount+"/"+evalMacro(json.get(ResourceSelected,"MaxResource"))+"</span></b>",
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
			[h:currentFeatureSpellLevel = 0]
			[h:currentFeatureHitDieSize = 8]
			[h:currentFeatureResourceSpentType = "Feature"]
			[h:currentFeatureResourceSpentAmount = ResourceUsed]
			[h:currentFeatureResourceSpentName = pm.RemoveSpecial(json.get(ResourceSelected,"TempResourceDisplayName"))]
		};{
			[h:ResourceAmount = max(json.get(json.get(ResourceSelected,"Resource"),json.get(ResourceSelected,"TempResourceKey")) - ResourceUsed,0)]
			[h:allAbilities = json.path.set(allAbilities,"[*][?(@.Name=='"+json.get(ResourceSelected,"Name")+"' && @.Class=='"+json.get(ResourceSelected,"Class")+"' && @.Subclass=='"+json.get(ResourceSelected,"Subclass")+"')]['Resource']['"+json.get(ResourceSelected,"TempResourceKey")+"']",ResourceAmount)]

			[h:abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header",json.get(ResourceSelected,"TempResourceDisplayName")+" Remaining",
				"FalseHeader","",
				"FullContents","",
				"RulesContents","<b><span style='font-size:1.25em;'>"+ResourceAmount+"/"+evalMacro(json.get(ResourceSelected,"MaxResource"))+"</span></b>",
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
			[h:currentFeatureSpellLevel = 0]
			[h:currentFeatureHitDieSize = 8]
			[h:currentFeatureResourceSpentType = "Feature"]
			[h:currentFeatureResourceSpentAmount = ResourceUsed]
			[h:currentFeatureResourceSpentName = pm.RemoveSpecial(json.get(ResourceSelected,"TempResourceDisplayName"))]
		}]
	};
	case "FeatureSpell":{
		[h,if(json.get(ResourceSelected,"TempResourceKey")==""),CODE:{
			[h:ResourceAmount = max(json.get(ResourceSelected,"Resource") - 1,0)]
			[h:allAbilities = json.path.set(allAbilities,"[*][?(@.Name=='"+json.get(ResourceSelected,"Name")+"' && @.Class=='"+json.get(ResourceSelected,"Class")+"' && @.Subclass=='"+json.get(ResourceSelected,"Subclass")+"')]['Resource']",ResourceAmount)]

			[h:abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header","Spell Slots Remaining",
				"FalseHeader","",
				"FullContents","",
				"RulesContents","<b><span style='font-size:1.25em;'>"+pm.SpellSlots()+"</span></b>",
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
			[h:currentFeatureSpellLevel = evalMacro(json.get(ResourceSelected,"ResourceSpellLevel"))]
			[h:currentFeatureHitDieSize = 8]
			[h:currentFeatureResourceSpentType = "FeatureSpell"]
			[h:currentFeatureResourceSpentAmount = 1]
			[h:currentFeatureResourceSpentName = pm.RemoveSpecial(json.get(ResourceSelected,"TempResourceDisplayName"))]
		};{
			[h:ResourceAmount = max(json.get(json.get(ResourceSelected,"Resource"),json.get(ResourceSelected,"TempResourceKey")) - 1,0)]
			[h:allAbilities = json.path.set(allAbilities,"[*][?(@.Name=='"+json.get(ResourceSelected,"Name")+"' && @.Class=='"+json.get(ResourceSelected,"Class")+"' && @.Subclass=='"+json.get(ResourceSelected,"Subclass")+"')]['Resource']['"+json.get(ResourceSelected,"TempResourceKey")+"']",ResourceAmount)]

			[h:abilityTable = json.append(abilityTable,json.set("",
				"ShowIfCondensed",1,
				"Header","Spell Slots Remaining",
				"FalseHeader","",
				"FullContents","",
				"RulesContents","<b><span style='font-size:1.25em;'>"+pm.SpellSlots()+"</span></b>",
				"RollContents","",
				"DisplayOrder","['Rules','Roll','Full']"
			))]
			[h:currentFeatureSpellLevel = json.get(evalMacro(json.get(ResourceSelected,"ResourceSpellLevel")),json.get(ResourceSelected,"TempResourceKey"))]
			[h:currentFeatureHitDieSize = 8]
			[h:currentFeatureResourceSpentType = "FeatureSpell"]
			[h:currentFeatureResourceSpentAmount = 1]
			[h:currentFeatureResourceSpentName = pm.RemoveSpecial(json.get(ResourceSelected,"TempResourceDisplayName"))]
		}]
	}
]