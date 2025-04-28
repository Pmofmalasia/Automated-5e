[h:InventorySettingsData = arg(0)]
[h:CurrentSettings = data.getData("addon:","pm.a5e.core","InventorySettings")]
[h:thisPlayerSettings = json.get(CurrentSettings,getPlayerName())]
[h,if(thisPlayerSettings == ""): thisPlayerSettings = "{}"]
[h:ParentToken = json.get(InventorySettingsData,"ParentToken")]

[h:GMSettings = " junkVar |  | -------- Visible Footer Equipment Buttons -------- | LABEL | SPAN=TRUE ## 
isGiveButton | "+json.get(CurrentSettings,"isGiveButton)+" | Give Item | CHECK ## 
isTakeButton | "+json.get(CurrentSettings,"isTakeButton)+" | Take Item | CHECK ## 
isSplitButton | "+json.get(CurrentSettings,"isSplitButton)+" | Split Item | CHECK ## 
isAttuneButton | "+json.get(CurrentSettings,"isAttuneButton)+" | Attune to Item | CHECK ## 
isHoldButton | "+json.get(CurrentSettings,"isHoldButton)+" | Hold Item | CHECK ## 
isEquipButton | "+json.get(CurrentSettings,"isEquipButton)+" | Equip Armor | CHECK ## 
isWearButton | "+json.get(CurrentSettings,"isWearButton)+" | Wear Item | CHECK ## 
isThrowButton | "+json.get(CurrentSettings,"isThrowButton)+" | Throw Item | CHECK ## 
isQuiverButton | "+json.get(CurrentSettings,"isQuiverButton)+" | Active Ammunition | CHECK ## 
junkVar |  | -------- Context Buttons Used -------- | LABEL | SPAN=TRUE ## 
isUseButton | "+json.get(CurrentSettings,"isUseButton)+" | Use Item | CHECK ## 
isCastButton | "+json.get(CurrentSettings,"isCastButton)+" | Cast Spell | CHECK ## 
isActivateButton | "+json.get(CurrentSettings,"isActivateButton)+" | Activate Item | CHECK ## 
isRechargeButton | "+json.get(CurrentSettings,"isRechargeButton)+" | Recharge Item | CHECK ## 
isIdentifyButton | "+json.get(CurrentSettings,"isIdentifyButton)+" | Identify Item | CHECK ## 
isCurseButton | "+json.get(CurrentSettings,"isCurseButton)+" | Curse Item | CHECK ## 
isItemLevelButton | "+json.get(CurrentSettings,"isItemLevelButton)+" | Item Leveling Button | CHECK ## 
isRechargeButton | "+json.get(CurrentSettings,"isRechargeButton)+" | Recharge Item | CHECK ## 
junkVar |  | -------- Other Settings -------- | LABEL | SPAN=TRUE ## 
isPlayerIdentifyItems | "+json.get(CurrentSettings,"isPlayerIdentifyItems)+" | Allow Players to Identify Items | CHECK ## 
isSendAllToChat | "+json.get(CurrentSettings,"isSendAllToChat)+" | Send All Equipment Changes to GM | CHECK"]

[h:abort(input(
	if(isGM(),GMSettings,""),
	"junkVar |  | -------- Appearance Settings -------- | LABEL | SPAN=TRUE",
	" isSimpleDND | "+json.get(thisPlayerSettings,"isSimpleDND)+" | Always Show All Hand/Attunement Slots | CHECK ",
	" backgroundColor | "+json.get(thisPlayerSettings,"LineColor")+" | Row Background Color - All Inventories | ",
	if(ParentToken == "",""," thisTokenBackgroundColor | "+json.get(thisPlayerSettings,"LineColor"+ParentToken)+" | Row Background Color - "+getName(ParentToken)+" Only | "),
	" fontColor | "+json.get(thisPlayerSettings,"FontColor")+" | Font Color - All Inventories | ",
	if(ParentToken == "",""," thisTokenFontColor | "+json.get(thisPlayerSettings,"FontColor"+ParentToken)+" | Font Color - "+getName(ParentToken)+" Only | ")
))]