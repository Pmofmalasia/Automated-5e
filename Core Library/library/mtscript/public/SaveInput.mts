[h:SaveData = macro.args]
[h:Flavor = json.get(SaveData,"Flavor")]
[h:ParentToken = json.get(SaveData,"ParentToken")]

[h:SaveInputHTML = "<input type='hidden' name='ParentToken' id='ParentToken' value='"+ParentToken+"'><input type='hidden' name='Flavor' id='Flavor' value='"+Flavor+"'>"]

[h:EffectsForcingSave = "[]"]
[h:"<!-- TODO: Could be a one-liner with json.path.read fixes -->"]
[h,foreach(tempEffect,data.getData("addon:","pm.a5e.core","gd.Effects")),CODE:{
	[h:isTargetTest = json.contains(json.get(tempEffect,"RemainingTargets"),ParentToken)]
	[h,if(isTargetTest),CODE:{
		[h:HasSaveTest = !json.isEmpty(json.path.read(tempEffect,"[?((@.ToResolve.SaveDC.SavesMade."+ParentToken+" == null || @.ToResolve.SaveDC.SavesMade == null) && @.ToResolve.SaveDC != null)]","DEFAULT_PATH_LEAF_TO_NULL"))]
		[h,if(HasSaveTest): EffectsForcingSave = json.append(EffectsForcingSave,tempEffect)]
	};{}]
}]

[h,if(json.isEmpty(EffectsForcingSave)),CODE:{
	[h:SaveInputHTML = SaveInputHTML + "<tr id='rowEffectIDChoice' hidden><th><label for='EffectIDChoice'>Make Save for Effect:</label></th><td><input type='hidden' id='EffectIDChoice' name='EffectIDChoice' value=''></td></tr>"]
};{
	[h:EffectsForcingSaveOptions = ""]
	[h,foreach(tempEffect,EffectsForcingSave),CODE:{
		[h:tempEffectID = json.get(tempEffect,"ID")]
		[h:tempEffectName = getName(json.get(tempEffect,"ParentToken"))+" vs. "+getName(ParentToken)]
		[h:tempEffectSkill = json.get(json.get(json.get(tempEffect,"ToResolve"),"SaveDC"),"SaveType")]
		[h,if(json.type(tempEffectSkill)=="ARRAY"):
			tempEffectSkillDisplay = "("+json.length(tempEffectSkill)+" options)";
			tempEffectSkillDisplay = "("+pm.GetDisplayName(tempEffectSkill,"sb.Skills")+")"
		]

		[h,if(json.get(tempEffect,"ParentSubeffect")==""): 
			NoActiveParentTest = 1;
			NoActiveParentTest = json.isEmpty(json.path.read(data.getData("addon:","pm.a5e.core","gd.Effects"),"[*][?(@.ID == "+json.get(tempEffect,"ParentSubeffect")+")]"))
		]

		[h,if(NoActiveParentTest): EffectsForcingSaveOptions = "<option value='"+tempEffectID+"'>"+tempEffectName+" "+tempEffectSkillDisplay+"</option>"]
	}]

	[h:SaveInputHTML = SaveInputHTML + "<tr id='rowEffectIDChoice'><th><label for='EffectIDChoice'>Make Save for Effect:</label></th><td><select id='EffectIDChoice' name='EffectIDChoice' onchange='createRegularSaveRows("+'"SaveInputTable"'+")'>"+EffectsForcingSaveOptions+"<option value=''>Other Save Not Linked to Effect</option></select></td></tr>"]
}]

[h:SaveInputHTML = SaveInputHTML + "<tr id='rowSubmit'><th text-align='center' colspan='2'><input type='submit' id='submitButton' value='Make Save'></tr>"]

[h:html.dialog5("SaveInput","lib://pm.a5e.core/SaveInput.html?cachelib=false","value="+base64.encode(SaveInputHTML)+"; width=500; height=285; closebutton=0")]