[h:macro.return = json.set("",
	"Border",json.get(json.get(getLibProperty("SpellBorderColors","Lib:pm.a5e.Core"),json.get(arg(0),"Source")),json.get(arg(0),"Level")),
	"Title",json.get(json.get(getLibProperty("SpellTitleColors","Lib:pm.a5e.Core"),json.get(arg(0),"Source")),json.get(arg(0),"Level"))
	)]