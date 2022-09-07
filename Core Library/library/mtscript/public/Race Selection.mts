[h:RaceData = macro.args]
[h:RaceSelection = json.get(RaceData,"Name")]
[h:RaceTraits = json.get(RaceData,"Traits")]
[h:RaceSizeOptions = json.get(RaceTraits,"SizeOptions")]
[h:SubraceArray = pm.GetSubraces(RaceSelection)]
[h,if(json.type(SubraceArray)=="ARRAY"): SubraceOptions = json.toList(json.path.read(SubraceArray,"[*].DisplayName")); SubraceOptions = ""]
[h:SubraceSelection = ""]
[h:disSubrace = if(SubraceOptions=="","","SubraceSelection|"+SubraceOptions+"|Choose "+RaceSelection+" Subrace | LIST ")]
[h:disSize = if(RaceSizeOptions=="",""," finalSize | "+RaceSizeOptions+" | Choose a Size | RADIO | VALUE=STRING DELIMITER=JSON ")]

[h:abort(input(
    disSubrace,
    disSize
))]

[h,if(RaceSizeOptions==""),CODE:{
    [h:setSize(json.get(RaceTraits,"Size"))]
    [h:lu.NewAbilities = json.append("",RaceTraits)]
};{
    [h:setSize(finalSize)]
    [h:lu.NewAbilities = json.append("",json.set(RaceTraits,"Size",finalSize))]
}]

[h,if(SubraceSelection!=""): lu.NewAbilities = json.append(lu.NewAbilities,json.get(json.get(SubraceArray,SubraceSelection),"Traits"))]

[h:CreatureType = json.get(RaceData,"CreatureType")]
[h:setProperty("stat.RaceData",json.remove(RaceData,"Traits"))]
[h,if(SubraceSelection==""): Subrace = ""; Subrace = json.get(json.get(SubraceArray,SubraceSelection),"DisplayName")]
[h:macro.return = lu.NewAbilities]