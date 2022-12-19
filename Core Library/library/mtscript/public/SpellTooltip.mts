[h:SpellData = pm.a5e.GetSpecificSpell(json.get(macro.args,"Spell"))]
[h:NonSpellData = json.remove(macro.args,"Spell")]
[h:ParentToken = json.get(NonSpellData,"ParentToken")]
[h:IsTooltip = 1]
[h:switchToken(ParentToken)]
[h:a5e.UnifiedAbilities = a5e.GatherAbilities(ParentToken)]
[h:pm.a5e.OverarchingContext = "Spell"]

[h:BaseSpellData = json.get(SpellData,0)]

[h:"<!-- TODO: Make a SpellTooltipBorder so the table can be inserted into other things -->"]

[h:SpellName = json.get(BaseSpellData,"Name")]
[h:SpellDisplayName = json.get(BaseSpellData,"DisplayName")]
[h:SpellLevel = json.get(BaseSpellData,"Level")]
[h:SpellSchool = json.get(BaseSpellData,"School")]
[h:ForcedClass = json.get(NonSpellData,"ForcedClass")]
[h:isRitualTest = json.contains(json.path.read(SpellData,"[*]['isRitual']"),1)]
[h:SpellTitle = SpellDisplayName+": Level "+SpellLevel+" "+pm.GetDisplayName(SpellSchool,"sb.SpellSchools")+" Spell"+if(isRitualTest," (ritual)","")]

[h:"<!-- Note: The below is the first entry in abilityTable so that it can be removed in SpellTooltipBorder but present in other tables. -->"]
[h:abilityTable = json.append("",json.set("",
	"ShowIfCondensed",1,
	"Header",SpellTitle,
	"FalseHeader","",
	"FullContents","",
	"RulesContents","",
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:UniqueCastTimes = json.unique(json.path.read(SpellData,"[*]['CastTime']"))]
[h:UniqueCastTimeStrings = "[]"]
[h,foreach(tempTime,UniqueCastTimes): UniqueCastTimeStrings = json.append(UniqueCastTimeStrings,json.get(tempTime,"Value")+" "+json.get(tempTime,"Units")+if(json.get(tempTime,"Value")==1,"","s"))]
[h:CastTimeDisplay = pm.a5e.CreateDisplayList(UniqueCastTimeStrings,"or")]
[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Casting Time",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",CastTimeDisplay,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:UniqueReactionDescriptions = json.unique(json.path.read(SpellData,"[*]['ReactionDescription']"))]
[h:UniqueReactionDescriptionStrings = "[]"]
[h,foreach(tempTrigger,UniqueReactionDescriptions): UniqueReactionDescriptionStrings = json.append(UniqueReactionDescriptionStrings,base64.decode(tempTrigger))]
[h:ReactionDescriptionDisplay = upper(pm.a5e.CreateDisplayList(UniqueReactionDescriptionStrings,"or"),1)]
[h,if(ReactionDescriptionDisplay != ""): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Reaction Trigger",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",ReactionDescriptionDisplay,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:isConcentrationTest = json.contains(json.path.read(SpellData,"[*]['isConcentration']"),1)]
[h:ConcentrationLost = json.path.read(SpellData,"[*]['ConcentrationLost']")]
[h,if(!json.isEmpty(ConcentrationLost)): 
    ConcentrationLostString = ", no longer required at level "+json.get(ConcentrationLost,0);
    ConcentrationLostString = ""
]
[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Requires Concentration",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",if(isConcentrationTest,"Yes","No")+ConcentrationLostString,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]


[h:sComp = json.contains(json.path.read(SpellData,"[*]['sComp']"),1)]
[h:vComp = json.contains(json.path.read(SpellData,"[*]['vComp']"),1)]
[h:mComp = json.contains(json.path.read(SpellData,"[*]['mComp']"),1)]
[h,if(mComp),CODE:{
    [h:tempComponents = json.path.read(SpellData,"[*]['mComponents']")]
    [h,if(json.isEmpty(tempComponents)):
        materialComponents = "";
        materialComponents = json.get(tempComponents,0)
    ]
    [h:tempConsumedComponents = json.path.read(SpellData,"[*]['mComponentsConsumed']")]
    [h,if(json.isEmpty(tempConsumedComponents)):
        materialComponentsConsumed = "";
        materialComponentsConsumed = json.get(tempConsumedComponents,0)
    ]
};{
    [h:componentsDisplay = ""]
    [h:materialComponents = ""]
    [h:materialComponentsConsumed = ""]
}]

[h:componentsDisplay = if(vComp,"V","")]
[h:componentsDisplay = if(sComp,listAppend(componentsDisplay,"S",", "),componentsDisplay)]
[h:componentsDisplay = if(mComp,listAppend(componentsDisplay,"M"+if(materialComponents=="",""," ("+materialComponents+")"),", "),componentsDisplay)]
[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Components",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",componentsDisplay,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h,if(materialComponentsConsumed != ""): abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Components Consumed",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",materialComponentsConsumed,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:UniqueDurations = json.unique(json.path.read(SpellData,"[*]['Duration']"))]
[h:UniqueDurationStrings = ""]
[h,foreach(tempTime,UniqueDurations): UniqueDurationStrings = json.append(UniqueDurationStrings,if(json.isEmpty(tempTime),"Instantaneous",json.get(tempTime,"Value")+" "+json.get(tempTime,"Units")+if(json.get(tempTime,"Value")==1,"","s")))]
[h:DurationDisplay = pm.a5e.CreateDisplayList(UniqueDurationStrings,"or")]

[h:abilityTable = json.append(abilityTable,json.set("",
	"ShowIfCondensed",1,
	"Header","Duration",
	"FalseHeader","",
	"FullContents","",
	"RulesContents",DurationDisplay,
	"RollContents","",
	"DisplayOrder","['Rules','Roll','Full']"
))]

[h:SpellDescription = base64.decode(json.get(BaseSpellData,"Description"))]

[h:macro.return = json.set("","Table",abilityTable,"Source","Arcane","Description",SpellDescription,"DisplayName",SpellTitle)]