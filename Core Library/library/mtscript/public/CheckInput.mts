[h:CheckData = macro.args]
[h:Flavor = json.get(CheckData,"Flavor")]
[h:ParentToken = json.get(CheckData,"ParentToken")]

[h:CheckInputHTML = "<input type='hidden' name='ParentToken' id='ParentToken' value='"+ParentToken+"'><input type='hidden' name='Flavor' id='Flavor' value='"+Flavor+"'>"]

[h:EffectsForcingCheck = "[]"]
[h:"<!-- TODO: Could be a one-liner with json.path.read fixes -->"]
[h,foreach(tempEffect,data.getData("addon:","pm.a5e.core","gd.Effects")),CODE:{
	[h:isTargetTest = json.contains(json.get(tempEffect,"RemainingTargets"),ParentToken)]
	[h,if(isTargetTest),CODE:{
		[h:HasCheckTest = !json.isEmpty(json.path.read(tempEffect,"[?((@.ToResolve.CheckDC.ChecksMade."+ParentToken+" == null || @.ToResolve.CheckDC.ChecksMade == null) && @.ToResolve.CheckDC != null)]","DEFAULT_PATH_LEAF_TO_NULL"))]
		[h,if(HasCheckTest): EffectsForcingCheck = json.append(EffectsForcingCheck,tempEffect)]
	};{}]
}]

[h,if(json.isEmpty(EffectsForcingCheck)),CODE:{
	[h:CheckInputHTML = CheckInputHTML + "<tr id='rowEffectIDChoice' hidden><th><label for='EffectIDChoice'>Make Check for Effect:</label></th><td><input type='hidden' id='EffectIDChoice' name='EffectIDChoice' value=''></td></tr>"]
};{
	[h:"<!-- TODO: Will need to account for effects with multiple check options in the JS -->"]
	[h:EffectsForcingCheckOptions = ""]
	[h,foreach(tempEffect,EffectsForcingCheck),CODE:{
		[h:tempEffectID = json.get(tempEffect,"ID")]
		[h:tempEffectName = getName(json.get(tempEffect,"ParentToken"))+" vs. "+getName(ParentToken)]
		[h:tempEffectSkill = json.get(json.get(json.get(tempEffect,"ToResolve"),"CheckDC"),"CheckType")]
		[h,if(json.type(tempEffectSkill)=="ARRAY"):
			tempEffectSkillDisplay = "("+json.length(tempEffectSkill)+" options)";
			tempEffectSkillDisplay = "("+pm.GetDisplayName(tempEffectSkill,"sb.Skills")+")"
		]

		[h,if(json.get(tempEffect,"ParentSubeffect")==""): 
			NoActiveParentTest = 1;
			NoActiveParentTest = json.isEmpty(json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID == '"+json.get(tempEffect,"ParentSubeffect")+"')]"))
		]

		[h,if(NoActiveParentTest): EffectsForcingCheckOptions = "<option value='"+tempEffectID+"'>"+tempEffectName+" "+tempEffectSkillDisplay+"</option>"]
	}]

	[h:CheckInputHTML = CheckInputHTML + "<tr id='rowEffectIDChoice'><th><label for='EffectIDChoice'>Make Check for Effect:</label></th><td><select id='EffectIDChoice' name='EffectIDChoice' onchange='createRegularCheckRows("+'"CheckInputTable"'+")'>"+EffectsForcingCheckOptions+"<option value=''>Other Check Not Linked to Effect</option></select></td></tr>"]
}]

[h:CheckInputHTML = CheckInputHTML + "<tr id='rowSubmit'><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Make Check'></tr>"]

[h:checkInputData = json.set("",
	"FormData",CheckInputHTML,
	"Inventory",getProperty("a5e.stat.Inventory")
)]

[h:html.dialog5("CheckInput","lib://pm.a5e.core/CheckInput.html?cachelib=false","value="+base64.encode(checkInputData)+"; width=500; height=285; closebutton=0")]