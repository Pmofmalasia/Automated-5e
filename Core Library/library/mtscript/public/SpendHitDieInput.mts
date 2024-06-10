[h:HitDiceData = macro.args]
[h:Flavor = json.get(HitDiceData,"Flavor")]
[h:ParentToken = json.get(HitDiceData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:validHitDieSizes = "[]"]
[h:MaxHitDice = getProperty("a5e.stat.MaxHitDice")]
[h:HitDieSizes = json.fields(MaxHitDice)]
[h,foreach(size,HitDieSizes),if(json.get(MaxHitDice,size) != 0): validHitDieSizes = json.append(validHitDieSizes,size)]

[h:currentHitDice = getProperty("a5e.stat.HitDice")]
[h:HitDieInput = ""]
[h,foreach(dieSize,validHitDieSizes),CODE:{
	[h:thisDieSizeNum = json.get(currentHitDice,dieSize)]
	[h:isDefaultOne = and(json.length(validHitDieSizes) == 1,thisDieSizeNum != 0)]
	[h:spendOptions = "<option value=0>0</option>"]
	[h,count(thisDieSizeNum): spendOptions = spendOptions + "<option value="+(roll.count+1)+">"+(roll.count+1)+"</option>"]
	[h:thisRow = "<tr id='rowSpend"+dieSize+"'><th><label for='"+dieSize+"Num'>"+substring(dieSize,1)+"s Spent:</label></th><td><select value='"+if(isDefaultOne,"1","")+"'>"+spendOptions+"</select></td></tr>"]

	[h:HitDieInput = HitDieInput + thisRow]
}]

[h:HitDieInput = HitDieInput + "<tr id='rowSubmit'><th text-align='center' colspan='2'><input type='submit' class='theme-fix-submit' id='submitButton' value='Spend Hit Dice'><input type='hidden' name='ParentToken' value='"+ParentToken+"'></tr>"]

[h:html.dialog5("SpendHitDieInput","lib://pm.a5e.core/SpendHitDieInput.html?cachelib=false","value="+base64.encode(HitDieInput)+"; width=250; height=150; closebutton=0")]