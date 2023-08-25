[h,if(currentToken()==""),CODE:{
	[h,if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1),CODE:{
		[h:macro.return = json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkLinkColor")]
	};{
		[h:macro.return = json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightLinkColor")]
	}]
};{
	[h,if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1),CODE:{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"DarkLinkColor")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkLinkColor"),json.get(getProperty("a5e.stat.ChatColors"),"DarkLinkColor"))]
	};{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"LightLinkColor")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightLinkColor"),json.get(getProperty("a5e.stat.ChatColors"),"LightLinkColor"))]
	}]
}]