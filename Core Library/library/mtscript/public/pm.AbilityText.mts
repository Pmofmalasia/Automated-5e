[h:pm.Ability=json.get(arg(0),"Name")]
[h:pm.Class=json.get(arg(0),"Class")]
[h:pm.Subclass=json.get(arg(0),"Subclass")]
[h:pm.Tooltip=json.get(arg(0),"Tooltip")]
[h:pm.Header=arg(1)]
[h:pm.Body=arg(2)]

[h,if(pm.Tooltip),CODE:{
	[h:macro.return = json.set("","ShowIfCondensed",1,"Header",pm.Header,"FalseHeader","","FullContents","","RulesContents",pm.Body,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value","","Units","")]
};{
	[h:macro.return = json.set("","ShowIfCondensed",1,"Header",pm.Header,"FalseHeader","","FullContents","","RulesContents",pm.Body,"RollContents","","DisplayOrder","['Rules','Roll','Full']","Value","","Units","")]
}]