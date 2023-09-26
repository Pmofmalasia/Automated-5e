[h,if(currentToken()==""),CODE:{
	[h,if(data.getData("addon:","pm.a5e.core","DarkMode")==1),CODE:{
		[h:macro.return = json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"DarkLinkColor")]
	};{
		[h:macro.return = json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"LightLinkColor")]
	}]
};{
	[h,if(data.getData("addon:","pm.a5e.core","DarkMode")==1),CODE:{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"DarkLinkColor")=="",json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"DarkLinkColor"),json.get(getProperty("a5e.stat.ChatColors"),"DarkLinkColor"))]
	};{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"LightLinkColor")=="",json.get(data.getData("addon:","pm.a5e.core","ChatColors"),"LightLinkColor"),json.get(getProperty("a5e.stat.ChatColors"),"LightLinkColor"))]
	}]
}]