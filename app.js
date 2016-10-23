var $ = jQuery = require('jquery');
const sh = require('child_process');
const fs = require('fs');

$(function() {
	$("#tabs").tabs();
	$("#command").focus()
	if (1 == 1) {
		$("#command").val("ls -filter *.* | select Name,Length,CreationTime | sort length")
		jQuery("#optFormatOut").val("csv")
		$("#optNoSecurity").checked = true
	}
	//ExecuteHelp()
	//window.resizeTo 500,450
});

function ExecutePowerShell() {
	
	var sCommand = $("#command").val()

	if (jQuery("#optFormatOut").val()=="html" && sCommand.substring(sCommand.length-14) != "ConvertTo-Html") {
		if (sCommand.indexOf(" | ConvertTo-")>=0) sCommand = Before(sCommand, " | ConvertTo-")
		sCommand = sCommand + " | ConvertTo-Html"
	} else if (jQuery("#optFormatOut").val()=="csv" && sCommand.substring(sCommand.length-13) != "ConvertTo-Csv") {
		if (sCommand.indexOf(" | ConvertTo-")>=0) sCommand = Before(sCommand, " | ConvertTo-")
		sCommand = sCommand + " | ConvertTo-Csv"
	}
	$("#command").val(sCommand)

	var sResultData = ExecutePS(sCommand)
	
	if (jQuery("#optFormatOut").val()=="html")
		outHtml(sResultData)
	else
		out(sResultData)
}
function ExecuteHelp() {
	var cmdLet = $("#inpHelp").val()
	var res = ExecutePS("Get-Command " + cmdLet + " | ConvertTo-Json")
	//var res = ExecutePS("Help " + cmdLet)
	$('#outHelp').text(res) // PS Output is text by default
	var cmd = JSON.parse(res);
	jsShowObject(cmd)
}
function jsShowObject(obj) {
	alert(JSON.stringify(obj))
	//alert(obj)
}
function ExecutePS(sCommand) {
	
	if (sCommand == "") return
	
	SaveToFile("command.ps1", sCommand)
	
	dp(sCommand)
	if (!$("#optNoSecurity").checked)
		sCmd = "POWERSHELL -File \"command.ps1\""
	else
		sCmd = "POWERSHELL -Command \"$enccmd=[Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes((Get-Content -Path 'command.ps1')));POWERSHELL -EncodedCommand $enccmd\""

	var ExecMode = "Run"
	if (fs.existsSync("output.txt")) fs.unlinkSync("output.txt")
	if (ExecMode == "Run") sCmd = sCmd + " > output.txt"

	// Error redirection
	sCmd = sCmd + " 2> error.txt"

	// Have to do this or errors are not piped to 2> error.txt
	sCmd = "%COMSPEC% /C " + sCmd
	//sCmd = sCmd + "\nPAUSE"
	dp(sCmd)
	try {
		sh.execSync(sCmd);
		var sErrorData = LoadFromFile("error.txt")
		if (sErrorData) return alert("Script Error:\n"+sErrorData)

		if (ExecMode == "Run")
			return LoadFromFile("output.txt")
		else
			return oExec.StdOut.ReadAll

		} catch (err) {
		return alert("System Error:\n"+err.message)
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
function outHtml(d) {
	var el = $("#results")
	el.html(d);
	el.scrollTop = 0
	//SaveToFile "output.html", d
	//oShell.Exec("CMD /C output.html")
}
function dp(d) {
	var el = $("#debug")
	el.html(el.html() + d + "<br>")
	el.scrollTop = el.scrollHeight
}
function Before(d, s) {
	return d.substr(0, addy.indexOf(s));
}

function LoadFromFile(filename) {
	return fs.readFileSync(filename).toString();
}
function SaveToFile(filename, data) {
	fs.writeFileSync(filename, data)
}