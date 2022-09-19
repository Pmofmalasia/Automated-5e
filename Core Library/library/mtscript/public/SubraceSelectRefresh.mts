[h:priorRaceSelection = macro.args]
[h:RaceData = json.get(pm.GetRaces(),priorRaceSelection)]

[h:SubraceArray = pm.GetSubraces(json.get(RaceData,"Name"))]
[h,if(json.isEmpty(SubraceArray)),CODE:{
    [h:subraceOptions = "<option value='0'>No Subrace</option>"]

    [h:subraceData = json.set("","isDisabled",1,"Options",subraceOptions)]
};{
    [h:subraceOptions = ""]
    [h:tempSubraceOptions = json.path.read(SubraceArray,"[*].DisplayName")]
    [h,foreach(tempSubrace,tempSubraceOptions): subraceOptions = subraceOptions + "<option value='"+roll.count+"'>"+tempSubrace+"</option>"]

    [h:subraceData = json.set("","isDisabled",0,"Options",subraceOptions)]
}]

[h:RaceTraits = json.get(RaceData,"Traits")]
[h:RaceSizeOptions = json.get(RaceTraits,"SizeOptions")]
[h,if(RaceSizeOptions==""),CODE:{
    [h:subraceData = json.set(subraceData,"hasSizeChoice",0,"Size","<input type='hidden' name='sizeChoice' value='"+json.get(RaceTraits,"Size")+"'>")]
};{
    [h:sizeOptions = ""]
    [h,foreach(tempSize,json.get(RaceTraits,"SizeOptions")): sizeOptions = sizeOptions + "<option value='"+tempSize+"'>"+tempSize+"</option>"]
    [h:subraceData = json.set(subraceData,"hasSizeChoice",0,"SizeOptions",sizeOptions)]
}]

[h:return(0,subraceData)]