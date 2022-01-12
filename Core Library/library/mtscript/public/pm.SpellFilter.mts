[h:SpellOptions = ""]
[h:SpellArray = ""]
[h:ClassFilter = json.get(arg(0),"Class")]
[h:SchoolFilter = json.get(arg(0),"School")]
[h:LevelFilter = json.get(arg(0),"Level")]
[h:CastTimeFilter = json.get(arg(0),"Time")]
[h:RitualFilter = json.get(arg(0),"Ritual")]
[h:UseLevelCap = if(and(LevelFilter!="",json.get(arg(0),"LevelCap")!=1),0,if(json.get(arg(0),"LevelCap")=="",1,json.get(arg(0),"LevelCap")))]
[h:LevelCapClass = json.get(arg(0),"LevelCapClass")]
[h:LevelCapSubclass = json.get(arg(0),"LevelCapSubclass")]
[h:LevelCapBonus = if(json.get(arg(0),"LevelCapBonus")=="",0,json.get(arg(0),"LevelCapBonus"))]

[h,if(UseLevelCap),CODE:{
	[h,if(LevelCapClass==""),CODE:{
		[h:LevelCap = 0]
		[h,foreach(TempClass,ClassFilter): LevelCap = max(ceiling(json.get(json.path.read(allAbilities,"[?(@.CasterType!=null && @.SharedSpellSlots == 1 && @.IsActive>0 && @.Class == '"+TempClass+"')]['Level']","DEFAULT_PATH_LEAF_TO_NULL"),0)*json.get(json.path.read(allAbilities,"[?(@.CasterType!=null && @.SharedSpellSlots == 1 && @.IsActive>0 && @.Class == '"+TempClass+"')]['CasterType']","DEFAULT_PATH_LEAF_TO_NULL"),0)),LevelCap)]
		[h:LevelCap = if(LevelCap==0,10,LevelCap)]
	};{
		[h:LevelCap = max(ceiling(json.get(json.path.read(allAbilities,"[?(@.CasterType!=null && @.SharedSpellSlots == 1 && @.IsActive>0 && @.Class == '"+LevelCapClass+"' && @.Subclass == '"+LevelCapSubclass+"')]['Level']","DEFAULT_PATH_LEAF_TO_NULL"),0)*json.get(json.path.read(allAbilities,"[?(@.CasterType!=null && @.SharedSpellSlots == 1 && @.IsActive>0 && @.Class == '"+LevelCapClass+"' && @.Subclass == '"+LevelCapSubclass+"')]['CasterType']","DEFAULT_PATH_LEAF_TO_NULL"),0)),1)]
	}]
	[h:LevelCap = LevelCap+LevelCapBonus]
};{
	[h:LevelCap=999]
}]

[h,foreach(spell,getLibProperty("AllSpells","Lib:Complete Spellbook")),CODE:{
	[h:SpellData = getLibProperty("sp."+spell,"Lib:Complete Spellbook")]
	[h:HasDataTest = if(json.type(SpellData)=="ARRAY",1,0)]
	[h,if(HasDataTest),CODE:{
		[h:ClassTest=if(ClassFilter=="",1,0)]
		[h,foreach(option,ClassFilter): ClassTest=max(ClassTest,json.get(json.path.read(SpellData,"[0].sList."+option),0))]
		[h:SchoolTest = if(or(SchoolFilter=="",json.contains(SchoolFilter,json.get(json.get(SpellData,0),"sSchool"))),1,0)]
		[h:LevelTest = if(and(json.get(json.get(SpellData,0),"sLevel")<LevelCap,or(LevelFilter=="",json.contains(LevelFilter,json.get(json.get(SpellData,0),"sLevel")))),1,0)]
		[h:CastTimeTest = if(or(CastTimeFilter=="",json.contains(CastTimeFilter,json.get(json.get(SpellData,0),"CastTime"))),1,0)]
		[h:RitualTest = if(or(RitualFilter==0,RitualFilter=="",json.get(json.get(SpellData,0),"Ritual")==1),1,0)]
		[h:"<!-- Need to have the ability for multiple schools/levels/classes. Might need an extra code block for this (which would be fixed if I finished all the spells....) -->"]
		[h:SpellOptions=if(and(ClassTest>0,SchoolTest,LevelTest,CastTimeTest,RitualTest),listAppend(SpellOptions,json.get(json.get(SpellData,0),"SpellName"),","),SpellOptions)]
		[h:SpellArray=if(and(ClassTest>0,SchoolTest,LevelTest,CastTimeTest,RitualTest),json.append(SpellArray,SpellData),SpellArray)]
	};{}]
}]

[h:macro.return=json.set("","Options",SpellOptions,"Spells",SpellArray)]