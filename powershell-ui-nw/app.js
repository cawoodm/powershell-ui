const pjson = require('./package.json'),
			fs  = require('fs'),
			sh = require('child_process');
//console.log();
const SEP = (process.platform === "win32"?"\\":"/");
const TMP = (process.env.TMPDIR
        	|| process.env.TMP
        	|| process.env.TEMP
        	|| (process.platform === "win32"?"c:\\windows\\temp":"/tmp")
	 	) + SEP;
console.log("PowerShell UI v"+pjson.version+" starting...");
//alert(process.versions['nw-flavor'])
//DEBUG: Watch for changes and reload automatically
fs.watch('./', {recursive:true}, function() {if (location) location.reload();});


$(function() {
	$("#tabs").tabs();
	$("#command").focus()
	if (1 == 1) {
		$("#command").val("ls -filter *.* | select Name,Length,CreationTime | sort length")
		jQuery("#optFormatOut").val("csv")
		$("#optNoSecurity").checked = true
	}
	//ExecuteHelp()
	//window.resizeTo(800,450)
});

function ExecutePowerShell() {
	
	var sCommand = $("#command").val()

	if (jQuery("#optFormatOut").val()=="html" && sCommand.substring(sCommand.length-14) != "ConvertTo-Html") {
		if (sCommand.indexOf(" | ConvertTo-")>=0) sCommand = Before(sCommand, " | ConvertTo-")
		sCommand = sCommand + " | ConvertTo-Html"
	} else if (jQuery("#optFormatOut").val()=="csv" && sCommand.substring(sCommand.length-13) != "ConvertTo-Csv") {
		if (sCommand.indexOf(" | ConvertTo-")>=0) sCommand = Before(sCommand, " | ConvertTo-")
		sCommand = sCommand + " | ConvertTo-Csv"
	} else if (jQuery("#optFormatOut").val()=="json" && sCommand.substring(sCommand.length-13) != "ConvertTo-JSon") {
		if (sCommand.indexOf(" | ConvertTo-")>=0) sCommand = Before(sCommand, " | ConvertTo-")
		sCommand = sCommand + " | ConvertTo-Json"
	}
	$("#command").val(sCommand)

	var sResultData = ExecutePS(sCommand)
	if (jQuery("#optFormatOut").val()=="html")
		outHtml(sResultData)
	else if (jQuery("#optFormatOut").val()=="json")
		outJson(sResultData)
	else
		out(sResultData)
}
function ExecuteHelp() {
	var cmdLet = $("#inpHelp").val()
	let res = ExecutePS(`help "${cmdLet}"`);
	//console.log(`Get-Content "${TMP}\help.txt"`)
	//let res = ExecutePS(`Get-Content "${TMP}\\help.txt"`);
	//var res = ExecutePS("Help " + cmdLet)
	$('#outHelp').text(res) // PS Output is text by default
	//var cmd = JSON.parse(res);jsShowObject(cmd)
}
function jsShowObject(obj) {
	alert(JSON.stringify(obj))
	//alert(obj)
}
function ExecutePS(sCommand) {
	
	if (sCommand == "") return
	
	SaveToFile(TMP+"command.ps1", sCommand)
	
	dp(sCommand)
	if (!$("#optNoSecurity").checked)
		sCmd = "POWERSHELL -File \""+TMP+"command.ps1\""
	else
		sCmd = "POWERSHELL -Command \"$enccmd=[Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes((Get-Content -Path 'command.ps1')));POWERSHELL -EncodedCommand $enccmd\""

	// Output capture
	DeleteFile(TMP+"output.txt");
	DeleteFile(TMP+"error.txt");
	sCmd = sCmd + " > \""+TMP+"output.txt\""
	sCmd = sCmd + " 2> \""+TMP+"error.txt\""

	// Have to do this or errors are not piped to 2> error.txt
	sCmd = "%COMSPEC% /C " + sCmd
	//sCmd = sCmd + "\nPAUSE"
	dp(sCmd)
	try {
		sh.execSync(sCmd);
		DeleteFile(TMP+"command.ps1");
		var sErrorData = LoadFromFile(TMP+"error.txt")
		if (sErrorData) {
			DeleteFile(TMP+"output.txt");
			DeleteFile(TMP+"error.txt");
			alert("Script Error:\n"+sErrorData)
		}
		return LoadFromFile(TMP+"output.txt")

	} catch (err) {
		console.log("err")
		alert("System Error:\n"+err.message)
		DeleteFile(TMP+"output.txt");
		DeleteFile(TMP+"error.txt");
	}

}
function Elem(Id) {
	return document.getElementById(id)
}
function doKeyUp() {
	var key = window.event.keyCode
	var el = window.event.srcElement
	if (el.id == "command") {
		if (key == 13) ExecutePowerShell()
	} else if (el.id == "inpHelp") {
		if (key == 13) ExecuteHelp()
	}
}
function out(d) {
	//d = d.replace(/\n/g, ''); // Fix extra spaces in <pre>
	var el = $("#results")
	el.text(d)
	el.scrollTop = el.scrollHeight
}
function outJson(d) {
	try {
		out(d)
		let obj = JSON.parse(d);
		alert(obj.length + " entries returned!")
	} catch {
		alert("Error parsing JSON result:\n" + d)
	}
}
function outHtml(d) {
	var el = $("#results")
	el.html(d);
	el.scrollTop = 0
	//SaveToFile "output.html", d
	//oShell.Exec("CMD /C output.html")
}
function dp(...params) {
	//console.log(params);return;
	var el = $("#debug")
	el.html(el.html() + params + "<br>")
	el.scrollTop = el.scrollHeight
}
function Before(d, s) {
	return d.substr(0, d.indexOf(s));
}

function LoadFromFile(filename) {
	return fs.readFileSync(filename).toString();
}
function SaveToFile(filename, data) {
	fs.writeFileSync(filename, data);
}
function DeleteFile(filename) {
	if (fs.existsSync(filename)) fs.unlinkSync(filename)
}