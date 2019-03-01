# Goals

* Should have a simple console to enter PS/OS commands and get results
* Should have a libary of saved commands/scripts commonly used
* Should be able to generate a form by inspecting a command or scripts
* Should be able to pipe data between commands or scripts
* Standard grid, sort, filter and export functions

# Oblets
Oblets are the basic building blocks of data pipelines.
Oblets are special Cmdlets which provide data and data manipulation functions.
Oblets are self-describing and able to provide the UI with information about how they work.
For example:
 the PUFile Oblet can list files with it's Get-PUFile function/Cmdlet.
 the UI can request the parameters it takes and also discover it's output
 So we have the Discover-PUFile Cmdlet which takes the Parameter -Verb
	Discover-PUFile -Verb Get
	{
		parameters: [
			{name: "Path", type: "string", mandatory: false},
			{name: "Filter", type: "string", mandatory: false},
			{name: "Recurse", type: "boolean", mandatory: false, isSwitch: true},
			{name: "Recurse", type: "boolean", mandatory: false, isSwitch: true},
		],
		output: 'PUFile[]'
	}