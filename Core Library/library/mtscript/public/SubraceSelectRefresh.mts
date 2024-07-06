[h:priorRaceSelection = macro.args]
[h:tempRaceData = json.get(pm.GetRaces(),priorRaceSelection)]

[h:SubraceArray = pm.GetSubraces(json.get(tempRaceData,"Name"))]
[h,if(json.isEmpty(SubraceArray)),CODE:{
    [h:subraceOptions = "<option value='None'>No Subrace</option>"]

    [h:subraceData = json.set("","isReadonly",1,"Options",subraceOptions)]
};{
    [h:subraceOptions = ""]
	[h:subraceAddedLaterTest = json.get(tempRaceData,"hasSubrace") == 0]
	[h,if(subraceAddedLaterTest): subraceOptions = subraceOptions + "<option value='Base'>Base "+json.get(tempRaceData,"DisplayName")+"</option>"]
    [h:tempSubraceOptions = json.path.read(SubraceArray,"\$[*].DisplayName")]
    [h,foreach(tempSubrace,tempSubraceOptions): subraceOptions = subraceOptions + "<option value='"+roll.count+"'>"+tempSubrace+"</option>"]

    [h:subraceData = json.set("","isReadonly",0,"Options",subraceOptions)]
}]

[h:RaceTraits = json.get(tempRaceData,"Traits")]
[h:RaceSizeOptions = json.get(RaceTraits,"SizeOptions")]
[h,if(RaceSizeOptions==""),CODE:{
    [h:subraceData = json.set(subraceData,"hasSizeChoice",0,"Size",json.get(RaceTraits,"Size"),"SizeOptions","<option value='"+json.get(RaceTraits,"Size")+"'>"+json.get(RaceTraits,"Size")+"</option>")]
};{
    [h:sizeOptions = ""]
    [h,foreach(tempSize,json.get(RaceTraits,"SizeOptions")): sizeOptions = sizeOptions + "<option value='"+tempSize+"'>"+tempSize+"</option>"]
    [h:subraceData = json.set(subraceData,"hasSizeChoice",1,"SizeOptions",sizeOptions)]
}]

[h:return(0,subraceData)]