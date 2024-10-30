[h:ParentToken = json.get(macro.args,"ParentToken")]
[h:allFeatures = js.a5e.GatherFeatures(ParentToken,json.set("","ignoreRequirePassive",true))]
[h:featuresWithResource = json.path.read(allFeatures,"\$[*][?(@.ResourceData != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:switchToken(ParentToken)]

[h:"<!-- TODO: Resource - needs ability to do time resource -->"]
[h:disAbilityResourceSelection = ""]
[h,foreach(feature,featuresWithResource),CODE:{
	[h:thisAbilityIdentifier = json.get(feature,"AbilityType")+json.get(feature,"Name")+json.get(feature,"Class")+json.get(feature,"Subclass")]
	[h:thisFeatureResourceData = js.a5e.CalculateResourceData(feature,ParentToken)]
	[h:thisResourceCurrentAmounts = json.get(feature,"Resource")]
	[h:resourceKeys = json.fields(thisFeatureResourceData,"json")]

	[h,foreach(resource,resourceKeys),CODE:{
		[h:thisResourceData = json.get(thisFeatureResourceData,resource)]
		[h:thisResourceDisplayName = json.get(thisResourceData,"DisplayName")]
		[h:thisResourceMax = json.get(thisResourceData,"MaxResource")]
		[h:disAbilityResourceSelection = disAbilityResourceSelection + "<tr id='row"+thisAbilityIdentifier+resource+"'><th><label for='"+thisAbilityIdentifier+resource+"'>"+json.get(feature,"DisplayName")+if(json.get(feature,"DisplayName") != thisResourceDisplayName," - "+thisResourceDisplayName,"")+":</label></th><td><input type='number' class='small-number' id='"+thisAbilityIdentifier+resource+"' name='"+thisAbilityIdentifier+resource+"' min=0 max="+thisResourceMax+" value="+json.get(thisResourceCurrentAmounts,resource)+"> / "+thisResourceMax+"</td>"]
	}]
}]

[h:disAbilityResourceSelection = disAbilityResourceSelection + "<tr id='rowSubmit'><th style='text-align:center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Submit'><input type='hidden' name='ParentToken' value='"+ParentToken+"'></tr>"]

[h:html.dialog5("AdjustResources","lib://pm.a5e.core/AdjustResources.html?cachelib=false","value="+base64.encode(disAbilityResourceSelection)+"; width=500; height=285; closebutton=0")]