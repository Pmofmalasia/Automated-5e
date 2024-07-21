[h:ConditionData = arg(0)]
[h:ParentToken = json.get(ConditionData,"ParentToken")]
[h:SourceID = json.get(ConditionData,"SourceID")]
[h:SourceEffect = json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"\$[*][?(@.ID == '"+SourceID+"')]")]
[h,if(json.isEmpty(SourceEffect)): SourceEffect = "{}"; SourceEffect = json.get(SourceEffect,0)]
[h:ConditionSetBy = json.get(ConditionData,"SetBy")]
[h:switchToken(ParentToken)]

[h:ConditionImmunityInstances = pm.a5e.ConditionImmunities(json.set("","ParentToken",ParentToken))]

[h:ConditionImmunities = "[]"]
[h:ConditionTypeImmunities = "[]"]
[h,foreach(tempInstance,ConditionImmunityInstances),CODE:{
	[h:thisInstancePrerequisites = json.get(tempInstance,"Prereqs")]
	[h,if(json.isEmpty(thisInstancePrerequisites)):
		ThisInstanceImmuneTest = 1;
		ThisInstanceImmuneTest = pm.a5e.EffectMeetsPrereqs(SourceEffect,thisInstancePrerequisites,ParentToken)
	]

	[h,if(ThisInstanceImmuneTest),CODE:{
		[h:tempConditionImmunities = json.get(tempInstance,"Conditions")]
		[h,if(tempConditionImmunities==""): tempConditionImmunities = "[]"]
		[h,if(json.type(tempConditionImmunities)=="UNKNOWN"):
			ConditionImmunities = json.append(ConditionImmunities,tempConditionImmunities);
			ConditionImmunities = json.merge(ConditionImmunities,tempConditionImmunities)
		]

		[h:tempConditionTypeImmunities = json.get(tempInstance,"ConditionTypes")]
		[h,if(tempConditionTypeImmunities==""): tempConditionTypeImmunities = "[]"]
		[h,if(json.type(tempConditionTypeImmunities)=="UNKNOWN"):
			ConditionTypeImmunities = json.append(ConditionTypeImmunities,tempConditionTypeImmunities);
			ConditionTypeImmunities = json.merge(ConditionTypeImmunities,tempConditionTypeImmunities)
		]
	};{}]
}]

[h:return(0,json.set("","Conditions",ConditionImmunities,"ConditionTypes",ConditionTypeImmunities))]