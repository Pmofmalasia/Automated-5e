[h:ConditionData = arg(0)]
[h:ParentToken = json.get(ConditionData,"ParentToken")]
[h:ConditionSource = json.get(ConditionData,"SourceType")]
[h:ConditionSetBy = json.get(ConditionData,"SetBy")]
[h:switchToken(ParentToken)]

[h:ConditionImmunityInstances = pm.a5e.ConditionImmunities(json.set("","ParentToken",ParentToken))]

[h:ConditionImmunities = "[]"]
[h,foreach(tempInstance,ConditionImmunityInstances),CODE:{
	[h,if(json.get(tempInstance,"All")==1),CODE:{
		[h:ThisInstanceImmuneTest = 1]
	};{
		[h,if(json.get(tempInstance,"SourceToken")==""):
			SpecificTokenTest = 1;
			SpecificTokenTest = if(ConditionSetBy=="",0,json.contains(json.get(tempInstance,"SourceToken"),ConditionSetBy))
		]

		[h,if(json.get(tempInstance,"ExcludeSourceToken")==""):
			ExcludeTokenTest = 1;
			ExcludeTokenTest = if(ConditionSetBy=="",1,!json.contains(json.get(tempInstance,"ExcludeSourceToken"),ConditionSetBy))
		]

		[h,if(json.get(tempInstance,"IncludeCreatureType")==""):
			CreatureTypeTest = 1;
			CreatureTypeTest = if(json.get(ConditionData,"")=="SourceToken",0,json.contains(json.get(tempInstance,"IncludeCreatureType"),getProperty("a5e.stat.CreatureType",ConditionSetBy)))
		]

		[h,if(json.get(tempInstance,"ExcludeCreatureType")==""):
			ExcludeCreatureTypeTest = 1;
			ExcludeCreatureTypeTest = if(ConditionSetBy=="",1,!json.contains(json.get(tempInstance,"ExcludeCreatureType"),getProperty("a5e.stat.CreatureType",json.get(tempInstance,"SourceToken"))))
		]

		[h,if(json.get(tempInstance,"HasCondition")==""):
			HasConditionTest = 1;
			HasConditionTest = if(ConditionSetBy=="",0,!json.isEmpty(json.intersection(json.get(tempInstance,"HasCondition"),json.path.read(getProperty("a5e.stat.ConditionList",json.get(tempInstance,"SourceToken")),"[*]['Name']"))))
		]

		[h,if(json.get(tempInstance,"IncludeMorality")==""):
			IncludeMoralityTest = 1;
			IncludeMoralityTest = if(ConditionSetBy=="",0,json.contains(json.get(tempInstance,"IncludeMorality"),json.get(getProperty("a5e.stat.Alignment",json.get(tempInstance,"SourceToken")),"Morality")))
		]

		[h,if(json.get(tempInstance,"ExcludeMorality")==""):
			ExcludeMoralityTest = 1;
			ExcludeMoralityTest = if(ConditionSetBy=="",1,!json.contains(json.get(tempInstance,"ExcludeMorality"),json.get(getProperty("a5e.stat.Alignment",json.get(tempInstance,"SourceToken")),"Morality")))
		]

		[h,if(json.get(tempInstance,"IncludeOrder")==""):
			IncludeOrderTest = 1;
			IncludeOrderTest = if(ConditionSetBy=="",0,json.contains(json.get(tempInstance,"IncludeOrder"),json.get(getProperty("a5e.stat.Alignment",json.get(tempInstance,"SourceToken")),"Order")))
		]

		[h,if(json.get(tempInstance,"ExcludeOrder")==""):
			ExcludeOrderTest = 1;
			ExcludeOrderTest = if(ConditionSetBy=="",1,!json.contains(json.get(tempInstance,"ExcludeOrder"),json.get(getProperty("a5e.stat.Alignment",json.get(tempInstance,"SourceToken")),"Order")))
		]

		[h:ThisInstanceImmuneTest = and(ExcludeOrderTest,IncludeOrderTest,ExcludeMoralityTest,IncludeMoralityTest,HasConditionTest,ExcludeCreatureTypeTest,CreatureTypeTest,ExcludeTokenTest,SpecificTokenTest)]
	}]
	
	[h,if(ThisInstanceImmuneTest),CODE:{
		[h:tempConditionImmunities = json.get(tempInstance,"Conditions")]
		[h,if(json.type(tempConditionImmunities)=="UNKNOWN"):
			ConditionImmunities = json.append(ConditionImmunities,tempConditionImmunities);
			ConditionImmunities = json.merge(ConditionImmunities,tempConditionImmunities)
		]
	};{}]
}]

[h:macro.return = ConditionImmunities]