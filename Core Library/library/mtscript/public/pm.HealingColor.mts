[h,if(currentToken()==""),CODE:{
	[h,if(data.getData("addon:","pm.a5e.core","DarkMode")==1),CODE:{
		[h:macro.return = json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"DarkHealingText")]
	};{
		[h:macro.return = json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"LightHealingText")]
	}]
};{
	[h,if(data.getData("addon:","pm.a5e.core","DarkMode")==1),CODE:{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"DarkHealingText")=="",json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"DarkHealingText"),json.get(getProperty("a5e.stat.ChatColors"),"DarkHealingText"))]
	};{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"LightHealingText")=="",json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"LightHealingText"),json.get(getProperty("a5e.stat.ChatColors"),"LightHealingText"))]
	}]
}]