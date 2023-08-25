[h,if(currentToken()==""),CODE:{
	[h,if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1),CODE:{
		[h:macro.return = json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkHealingText")]
	};{
		[h:macro.return = json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightHealingText")]
	}]
};{
	[h,if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1),CODE:{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"DarkHealingText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkHealingText"),json.get(getProperty("a5e.stat.ChatColors"),"DarkHealingText"))]
	};{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"LightHealingText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightHealingText"),json.get(getProperty("a5e.stat.ChatColors"),"LightHealingText"))]
	}]
}]