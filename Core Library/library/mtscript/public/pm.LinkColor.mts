[h,if(currentToken()==""),CODE:{
	[h,if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1),CODE:{
		[h:macro.return = json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkLinkText")]
	};{
		[h:macro.return = json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightLinkText")]
	}]
};{
	[h,if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1),CODE:{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"DarkLinkText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkLinkText"),json.get(getProperty("a5e.stat.ChatColors"),"DarkLinkText"))]
	};{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"LightLinkText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightLinkText"),json.get(getProperty("a5e.stat.ChatColors"),"LightLinkText"))]
	}]
}]