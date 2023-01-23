[h:pm.SourcebookLibs = pm.GetBookInfo("Library","json")]
[h:pm.Classes = ""]
[h:pm.Feats = ""]
[h:pm.Races = ""]
[h:pm.Skills = ""]
[h:pm.Tools = ""]
[h:pm.ToolTypes = ""]
[h:pm.Abilities = ""]
[h:pm.AbilitiesToMerge = ""]
[h:pm.Conditions = ""]
[h:pm.AbilityUpdates = ""]
[h:pm.MonsterFeatures = ""]
[h:pm.Subclasses = ""]
[h:pm.Subraces = ""]
[h:pm.CreatureTypes = ""]
[h:pm.CreatureSubtypes = ""]
[h:pm.Languages = ""]
[h:pm.Backgrounds = ""]
[h:pm.Attributes = ""]
[h:pm.DamageTypes = ""]
[h:pm.CastingAbilities = "{}"]
[h:pm.SpellSchools = ""]
[h:pm.Spells = ""]
[h:pm.DamageTypeTags = ""]
[h:pm.ConditionTags = ""]
[h:pm.SpellLists = "{}"]
[h:"<!-- Since languages may be setting specific, may want to add a function for DMs to exclude languages from certain sourcebooks. Can use this macro as the gate for blocking those books. -->"]
[h,foreach(book,pm.SourcebookLibs),CODE:{
	[h,if(getLibProperty("sb.Attributes","Lib:"+book)!=""): pm.Attributes = if(or(json.get(getLibProperty("AttributeSourcebooks","Lib:pm.a5e.Core"),book)==1,json.get(getLibProperty("AttributeSourcebooks","Lib:pm.a5e.Core"),book)==""),json.merge(pm.Attributes,getLibProperty("sb.Attributes","Lib:"+book)),pm.Attributes)]
	[h,if(getLibProperty("sb.Classes","Lib:"+book)!=""): pm.Classes = json.merge(pm.Classes,getLibProperty("sb.Classes","Lib:"+book))]
	[h,if(getLibProperty("sb.Subclasses","Lib:"+book)!=""): pm.Subclasses = json.merge(pm.Subclasses,getLibProperty("sb.Subclasses","Lib:"+book))]
	[h,if(getLibProperty("sb.Feats","Lib:"+book)!=""): pm.Feats = json.merge(pm.Feats,getLibProperty("sb.Feats","Lib:"+book))]
	[h,if(getLibProperty("sb.Backgrounds","Lib:"+book)!=""): pm.Backgrounds = json.merge(pm.Backgrounds,getLibProperty("sb.Backgrounds","Lib:"+book))]
	[h,if(getLibProperty("sb.Races","Lib:"+book)!=""): pm.Races = json.merge(pm.Races,getLibProperty("sb.Races","Lib:"+book))]
	[h,if(getLibProperty("sb.Subraces","Lib:"+book)!=""): pm.Subraces = json.merge(pm.Subraces,getLibProperty("sb.Subraces","Lib:"+book))]
	[h,if(getLibProperty("sb.CreatureTypes","Lib:"+book)!=""): pm.CreatureTypes = json.merge(pm.CreatureTypes,getLibProperty("sb.CreatureTypes","Lib:"+book))]
	[h,if(getLibProperty("sb.CreatureSubtypes","Lib:"+book)!=""): pm.CreatureSubtypes = json.merge(pm.CreatureSubtypes,getLibProperty("sb.CreatureSubtypes","Lib:"+book))]
	[h,if(getLibProperty("sb.Languages","Lib:"+book)!=""): pm.Languages = if(or(json.get(getLibProperty("LanguageSourcebooks","Lib:pm.a5e.Core"),book)==1,json.get(getLibProperty("LanguageSourcebooks","Lib:pm.a5e.Core"),book)==""),json.merge(pm.Languages,getLibProperty("sb.Languages","Lib:"+book)),pm.Languages)]
	[h,if(getLibProperty("sb.Skills","Lib:"+book)!=""): pm.Skills = json.merge(pm.Skills,getLibProperty("sb.Skills","Lib:"+book))]
	[h,if(getLibProperty("sb.Tools","Lib:"+book)!=""): pm.Tools = json.merge(pm.Tools,getLibProperty("sb.Tools","Lib:"+book))]
	[h,if(getLibProperty("sb.ToolTypes","Lib:"+book)!=""): pm.ToolTypes = json.merge(pm.ToolTypes,getLibProperty("sb.ToolTypes","Lib:"+book))]
	[h,if(getLibProperty("sb.Conditions","Lib:"+book)!=""): pm.Conditions = json.merge(pm.Conditions,getLibProperty("sb.Conditions","Lib:"+book))]
	[h,if(getLibProperty("sb.Abilities","Lib:"+book)!=""): pm.Abilities = json.merge(pm.Abilities,json.path.read(getLibProperty("sb.Abilities","Lib:"+book),"[*][?(@.CreatedForMerging!=1)]"))]
	[h,if(getLibProperty("sb.Abilities","Lib:"+book)!=""): pm.AbilitiesToMerge = json.merge(pm.AbilitiesToMerge,json.path.read(getLibProperty("sb.Abilities","Lib:"+book),"[*][?(@.CreatedForMerging==1)]"))]
	[h,if(getLibProperty("sb.AbilityUpdates","Lib:"+book)!=""): pm.AbilityUpdates = json.merge(pm.AbilityUpdates,getLibProperty("sb.AbilityUpdates","Lib:"+book))]
	[h,if(getLibProperty("sb.MonsterFeatures","Lib:"+book)!=""): pm.MonsterFeatures = json.merge(pm.MonsterFeatures,getLibProperty("sb.MonsterFeatures","Lib:"+book))]
	[h,if(getLibProperty("sb.DamageTypes","Lib:"+book)!=""): pm.DamageTypes = json.merge(pm.DamageTypes,getLibProperty("sb.DamageTypes","Lib:"+book))]
	[h,if(getLibProperty("sb.DamageTypeTags","Lib:"+book)!=""): pm.DamageTypeTags = json.merge(pm.DamageTypeTags,getLibProperty("sb.DamageTypeTags","Lib:"+book))]
	[h,if(getLibProperty("sb.ConditionTags","Lib:"+book)!=""): pm.ConditionTags = json.merge(pm.ConditionTags,getLibProperty("sb.ConditionTags","Lib:"+book))]
	[h,if(getLibProperty("sb.CastingAbilities","Lib:"+book)!=""): pm.CastingAbilities = json.merge(pm.CastingAbilities,getLibProperty("sb.CastingAbilities","Lib:"+book))]
	[h,if(getLibProperty("sb.SpellSchools","Lib:"+book)!=""): pm.SpellSchools = json.merge(pm.SpellSchools,getLibProperty("sb.SpellSchools","Lib:"+book))]
	[h,if(getLibProperty("sb.Spells","Lib:"+book)!=""): pm.Spells = json.merge(pm.Spells,getLibProperty("sb.Spells","Lib:"+book))]
	[h:thisBookSpellLists = getLibProperty("sb.SpellLists","Lib:"+book)]
	[h,foreach(tempClass,json.fields(thisBookSpellLists)),CODE:{
		[h,if(json.get(pm.SpellLists,tempClass)==""):
			pm.SpellLists = json.set(pm.SpellLists,tempClass,json.get(thisBookSpellLists,tempClass));
			pm.SpellLists = json.set(pm.SpellLists,tempClass,json.sort(json.merge(json.get(pm.SpellLists,tempClass),json.get(thisBookSpellLists,tempClass))))
		]
	}]
}]

[h,foreach(ability,pm.AbilitiesToMerge),CODE:{
	[h:BaseAbility = json.get(json.path.read(pm.Abilities,"[*][?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"')]"),0)]
	[h,if(json.get(ability,"FightingStyleList")!=""): pm.Abilities = json.path.set(pm.Abilities,"[*][?(@.Name=='"+json.get(ability,"Name")+"' && @.Class=='"+json.get(ability,"Class")+"' && @.Subclass=='"+json.get(ability,"Subclass")+"')]['FightingStyleList']",json.merge(json.get(BaseAbility,"FightingStyleList"),json.get(ability,"FightingStyleList")))]
}]

[h:setLibProperty("sb.Attributes",pm.Attributes,"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Classes",json.sort(pm.Classes,"a","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Feats",json.sort(pm.Feats,"a","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Backgrounds",json.sort(pm.Backgrounds,"a","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Races",json.sort(pm.Races,"a","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Languages",json.sort(pm.Languages,"a","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Skills",json.sort(pm.Skills,"a","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Tools",json.sort(pm.Tools,"a","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.ToolTypes",json.sort(pm.ToolTypes,"a","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Subclasses",json.sort(pm.Subclasses,"a","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Subraces",json.sort(pm.Subraces,"a","Race","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.CreatureTypes",json.sort(pm.CreatureTypes,"a","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.CreatureSubtypes",json.sort(pm.CreatureSubtypes,"a","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Conditions",json.sort(pm.Conditions,"a","Class","Subclass","Level","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Abilities",json.sort(pm.Abilities,"a","Class","Subclass","Level","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.AbilityUpdates",json.sort(pm.AbilityUpdates,"a","Class","Subclass","Level","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.MonsterFeatures",json.sort(pm.MonsterFeatures,"a","Class","Subclass","Level","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.DamageTypes",pm.DamageTypes,"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.DamageTypeTags",json.sort(pm.DamageTypeTags,"a","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.ConditionTags",json.sort(pm.ConditionTags,"a","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.CastingAbilities",pm.CastingAbilities,"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.SpellSchools",json.sort(pm.SpellSchools,"a","DisplayName"),"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.Spells",pm.Spells,"Lib:pm.a5e.Core")]
[h:setLibProperty("sb.SpellLists",pm.SpellLists,"Lib:pm.a5e.Core")]

[h:"<!-- TODO: See if there's a way to sort spells by name/level, since they're a level deep in an array -->"]

[h:broadcast("Sourcebook Data has been moved to the core library.")]