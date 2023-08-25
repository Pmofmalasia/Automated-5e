[h,if(currentToken()==""),CODE:{
	[h,if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1),CODE:{
		[h:macro.return = json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkDamageText")]
	};{
		[h:macro.return = json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightDamageText")]
	}]
};{
	[h,if(getLibProperty("DarkMode","Lib:pm.a5e.Core")==1),CODE:{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"DarkDamageText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"DarkDamageText"),json.get(getProperty("a5e.stat.ChatColors"),"DarkDamageText"))]
	};{
		[h:macro.return=if(json.get(getProperty("a5e.stat.ChatColors"),"LightDamageText")=="",json.get(getLibProperty("ChatColors","Lib:pm.a5e.Core"),"LightDamageText"),json.get(getProperty("a5e.stat.ChatColors"),"LightDamageText"))]
	}]
}]