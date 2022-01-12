[h,if(arg(1)=="Active"),CODE:{	
	[h:macro.return = json.get(arg(0),"Name")+" ### "+json.get(arg(0),"Class")+if(json.get(arg(0),"Subclass")=="",""," ### "+json.get(arg(0),"Subclass"))+"@Lib:"+json.get(arg(0),"Library")]
};{}]
[h,if(arg(1)=="Passive"),CODE:{
	[h:macro.return = "pm."+json.get(arg(0),"Name")+json.get(arg(0),"Class")+json.get(arg(0),"Subclass")]
};{}]