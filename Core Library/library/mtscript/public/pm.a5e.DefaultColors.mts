[h:DisplayClass = json.get(arg(0),"DisplayClass")]
[h:ColorSubtype = json.get(arg(0),"ColorSubtype")]

[h:ParentToken = json.get(arg(0),"ParentToken")]
[h,if(ParentToken!=""): switchToken(ParentToken)]

[h,if(DisplayClass == "zzSpell"),CODE:{
	[h:tempColors = pm.SpellColors(ColorSubtype)]
	[h:chat.Border = json.get(tempColors,"Border")]
	[h:chat.Title = json.get(tempColors,"Title")]
};{
	[h:chat.Border = pm.BorderColor(DisplayClass,ColorSubtype)]
	[h:chat.Title = pm.TitleColor(DisplayClass,ColorSubtype)]
}]

[h:finalColors = json.set("",
	"BorderColor",chat.Border,
	"TitleColor",chat.Title
)]

[h:return(0,finalColors)]