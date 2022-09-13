[h:"<!-- TODO: Needs adaptive window theming when getInfo(Theme) is more set in stone -->"]
[h:pm.TooltipBorder(json.set("",
    "Class","zzWeaponAttack",
    "Name","Effect Management",
    "DisplayName","Effect Management"
))]

[h:incompleteEffects = getLibProperty("gd.Effects","Lib:pm.a5e.Core")]
[h:em.TableLines = ""]
[h,foreach(effect,incompleteEffects),CODE:{
	[h:targetList = json.get(effect,"Targets")]
	[h:targetName = ""]
	[h,switch(json.length(targetList)):
		case 1: targetName = getName(json.get(targetList,0));
		case 2: targetName = getName(json.get(targetList,0))+" and "+getName(json.get(targetList,1));
		case 3: targetName = getName(json.get(targetList,0))+", "+getName(json.get(targetList,1))+", and "+getName(json.get(targetList,2));
		default: targetName = "Multiple Targets"
	]
	
	[h,if(json.get(effect,"ParentToken")==""):
		parentName = "World";
		parentName = getName(json.get(effect,"ParentToken"))
	]
	
	[h:effectsToResolve = json.get(effect,"ToResolve")]
	[h,if(json.get(effectsToResolve,"CheckDC")!=""): em.SecondPassDisplay = if(!json.isEmpty(json.get(json.get(effectsToResolve,"CheckDC"),"ChecksMade")),"Checks",""); em.SecondPassDisplay = ""]
	[h,if(json.get(effectsToResolve,"SaveDC")!=""): em.SecondPassDisplay = if(!json.isEmpty(json.get(json.get(effectsToResolve,"SaveDC"),"SavesMade")),listAppend(em.SecondPassDisplay,"Saves"),em.SecondPassDisplay)]
	[h:em.SecondPassDisplay = pm.a5e.CreateDisplayList(em.SecondPassDisplay,"and")]
	[h,if(em.SecondPassDisplay!=""): em.SecondPassDisplay = ": "+em.SecondPassDisplay+" Made"]
	
	[h:em.EffectDisplay = parentName+" vs. "+targetName+em.SecondPassDisplay]

    [h:em.TableLines = json.append("<tr><th style = '"+FrameAccentFormat+"'>"+em.EffectDisplay+"</th><td style='padding-left:4px'><input type='submit' value")]
}]

[dialog("effectManagement"): {
    [h: weaponNum = getStrProp(macro.args, "Number")]
    [h: name = getStrProp(macro.args, "Name")]
    [h: bonus = getStrProp(macro.args, "Bonus")]
    [h: damage = getStrProp(macro.args, "Damage")]
    <!-- If we do not have a weapon number grab the next one -->
    [h, if(weaponNum == ""), code: {
      [h,macro("NextWeaponNumber@this"): ""]
      [h: weaponNum = macro.return]
    }]
[r:'<html>
      <head>
        <title>Effect Management</title>
        <meta name="input" content="true">
      </head>
      <body>
        <form name="EffectManagement" action="[r:macroLinkText('EffectManagementChoiceSend@Lib:pm.a5e.Core')]">
          <table style="font-size:1em; color: '+BodyTextFinal.tooltip+';">
            <tr>
              <th>
                <label for="Name">Weapon Name</label>
              </th>
              <td>
                <input type="text" name="Name" value="[r: name]"></input> <br>
              </td>
            </tr>
            <tr>
              <th>
                <label for="Damage">Weapon Damage</label>
              </th>
              <td>
                <input type="text" name="Damage" value="[r: damage]"></input> <br>
              </td>
            </tr>
            <tr>
              <th>
                <label for="Bonus">Weapon Bonus</label>
              </th>
              <td>
                <input type="text" name="Bonus" value="[r: bonus]"></input>
              </td>
            </tr>
            </table>
          <!-- hidden input with the weapon number -->
          <input type="hidden" name="Number" value="[r: weaponNum]"></input>
  
          <input type="submit" name="Save" value="Save"> </input>
        </form>
      </body>
    </html>']
  }]