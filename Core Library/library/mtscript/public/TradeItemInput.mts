[h:TradeItemData = macro.args]
[h:ParentToken = json.get(TradeItemData,"ParentToken")]
[h:switchToken(ParentToken)]

[h:TokensInRange = getTokens("json",json.set("","range",json.set("","distancePerCell",1,"upto",5),"layer",json.append("","TOKEN","OBJECT")))]

[h:"<!-- NOTE: Needs HTML5 input to adjust the number available to trade based on the number in inventory. Should make separate inputs for a trading input (token gives item to target tokens) and a pick up input (token takes item from target tokens (usually object tokens)) -->"]