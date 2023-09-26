[h,if(currentToken()==""),CODE:{
	[h,if(data.getData("addon:","pm.a5e.core","DarkMode")==1),CODE:{
		[h:macro.return = json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"DarkDamageText")]
	};{
		[h:macro.return = json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"LightDamageText")]
	}]
};{
	[h,if(data.getData("addon:","pm.a5e.core","DarkMode")==1),CODE:{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"DarkDamageText")=="",json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"DarkDamageText"),json.get(getProperty("a5e.stat.ChatColors"),"DarkDamageText"))]
	};{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"LightDamageText")=="",json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"LightDamageText"),json.get(getProperty("a5e.stat.ChatColors"),"LightDamageText"))]
	}]
}]