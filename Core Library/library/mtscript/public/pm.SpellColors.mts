[h:macro.return = json.set("",
	"Border",json.get(json.get(data.getData("addon:","pm.a5e.core","SpellBorderColors"),json.get(arg(0),"Source")),json.get(arg(0),"Level")),
	"Title",json.get(json.get(data.getData("addon:","pm.a5e.core","SpellTitleColors"),json.get(arg(0),"Source")),json.get(arg(0),"Level"))
)]