[h:EndConditionOptions = "No,Always,On Save Success,On Save Failure"]
[h:abort(input(
	" junkVar | -------------------- Enter Information About How the Condition is Removed -------------------- |  | LABEL | SPAN=TRUE ",
	" ec.SaveType | None,"+pm.GetAttributes()+" | Saving Throw Type | LIST | VALUE=STRING ";
	" ec.TriggeredBy | All,Allies,Enemies, | 
	
	
	Workflow: Save Type at the top. Rest is yes/no checkboxes for specific instances at which the condition ends.
	If a checkbox is checked, additional options are revealed for how to determine if it is removed - after a save, after the stated event is triggered by an ally, etc.
	
	Needs dialog5(), I guess I need to learn things."