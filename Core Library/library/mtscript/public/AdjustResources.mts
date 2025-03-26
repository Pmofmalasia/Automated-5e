[h:ParentToken = json.get(macro.args,"ParentToken")]
[h:allFeatures = js.a5e.GatherFeatures(ParentToken,json.set("","ignoreRequirePassive",true,"ignoreIsActive",true))]

[h:featuresWithResource = json.path.read(allFeatures,"\$[*][?(@.ResourceData != null)]","DEFAULT_PATH_LEAF_TO_NULL")]
[h:switchToken(ParentToken)]

[h:disAbilityResourceSelection = js.a5e.BuildAdjustResourceInput(featuresWithResource,ParentToken)]

[h:disAbilityResourceSelection = disAbilityResourceSelection + "<tr id='rowSubmit'><th style='text-align:center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Submit'><input type='hidden' name='ParentToken' value='"+ParentToken+"'></tr>"]

[h:html.dialog5("AdjustResources","lib://pm.a5e.core/AdjustResources.html?cachelib=false","value="+base64.encode(disAbilityResourceSelection)+"; width=500; height=285; closebutton=0")]