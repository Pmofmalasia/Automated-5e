[h:newFeature = macro.args]
[h:CreateFeatureHTML = "<tr id='rowChoicesWhenGainedTitle'><th colspan='2' style='text-align:center'>Choices Made on Gaining Feature</th>"]
[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowPassiveFeaturesTitle'><th colspan='2' style='text-align:center'>Passive Effects of Feature</th>"]
[h:CreateFeatureHTML = CreateFeatureHTML + "<tr id='rowActiveFeaturesTitle'><th colspan='2' style='text-align:center'>Active Effects of Feature</th>"]
[h:CreateFeatureHTML = CreateFeatureHTML + "<tr><th style='text-align:center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Submit'></th></tr>"]

[h:createFeatureData = json.set("",
	"Input",CreateFeatureHTML,
	"ParentToken",currentToken(),
	"PriorData",newFeature
)]

[h:html.dialog5("CreateFeatureCore","lib://pm.a5e.core/CreateFeatureCore.html?cachelib=false","value="+base64.encode(createFeatureData)+"; closebutton=0; width=500; height=700")]