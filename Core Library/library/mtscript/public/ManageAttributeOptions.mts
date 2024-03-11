[h:lg.SourcebookLibs = pm.GetBookInfo()]
[h:priorAttributeSourcebooks = data.getData("addon:","pm.a5e.core","AttributeSourcebooks")]
[h:lg.Input = " junkVar | -------- Choose Sourcebooks to Use Attributes From -------- |  | LABEL | SPAN=TRUE "]
[h,foreach(book,lg.SourcebookLibs): lg.Input = if(getLibProperty("sb.Attributes","Lib:"+json.get(book,"Library"))=="",lg.Input,listAppend(lg.Input," lg."+json.get(book,"Name")+"Allowed | "+if(json.get(priorAttributeSourcebooks,json.get(book,"Library"))=="",1,json.get(priorAttributeSourcebooks,json.get(book,"Library")))+" | "+json.get(book,"DisplayName")+" | CHECK ","##"))]

[h:abort(input(
	lg.Input
))]

[h:lg.ChoicesFinal = ""]
[h,foreach(book,lg.SourcebookLibs),CODE:{
	[h:lg.HasAttributes = getLibProperty("sb.Attributes","Lib:"+json.get(book,"Library"))]
	[h,if(lg.HasAttributes!=""): lg.ChoicesFinal = json.set(lg.ChoicesFinal,json.get(book,"Library"),eval("lg."+json.get(book,"Name")+"Allowed"))]
}]
[h:data.setData("addon:","pm.a5e.core","AttributeSourcebooks",lg.ChoicesFinal)]
[h:broadcast("Attribute Settings Updated.")]