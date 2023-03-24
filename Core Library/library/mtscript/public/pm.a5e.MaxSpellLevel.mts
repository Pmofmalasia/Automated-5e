[h,if(argCount()>0),CODE:{
    [h:CastingLevel = a5e.CastingLevel(arg(0))]
};{
    [h:CastingLevel = a5e.CastingLevel(arg(0))]
}]

[h:macro.return = ceiling(CastingLevel/2)]