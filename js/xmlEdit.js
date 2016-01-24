
var CELL_Number = 4;







function validator(input,type) {
    var value = input.value;
    //onkeydown
    if (isValueValid(input, type) === false) {
        input.setAttribute('id', 'wrong');
        return false;
    }
    else
        input.setAttribute('id', 'complete');

    if (type === 'System.Int32') {
        var Reg = new RegExp("(^([+-]?)([1-9]+?)[0-9]*)|^0$");
        if (Reg.test(value)) {
            input.setAttribute('id', 'complete')
            return true;
        }
        input.setAttribute('id', 'wrong');
        return false;
    }
}




function ReadInput() {
    var input = new XMLHttpRequest();
    input.open("GET", "Files/input.xml", false);
    input.send();
    var data = input.responseXML;
    if (data) {
        data = (new DOMParser()).parseFromString(input.responseText, 'text/xml');
        var params = data.getElementsByTagName("Parameter");
        console.log(params);
        var display = '<tr><td id="title">Id</td><td id="title">Name</td><td id="title">Description</td><td id="title">Type</td></tr>';
        for (var i = 0; i < params.length; i++) {
            var type = initializeType(params[i].getElementsByTagName("Type")[0].textContent);
            var value = params[i].getElementsByTagName("Value")[0].textContent;
            var typeField = getFieldType(type, value);
            var idField = params[i].getElementsByTagName("Id")[0].textContent;
            var nameField = params[i].getElementsByTagName("Name")[0].textContent;
            var descriptionField = params[i].getElementsByTagName("Description")[0].textContent;
            display += '<tr>';
            display += '<td>' + "<input type=\"text\" value=\"" + idField + "\" />" + '</td>';
            display += '<td>' + "<input type=\"text\" value=\"" + nameField + "\" />" + '</td>';
            display += '<td>' + "<input type=\"text\" value=\"" + descriptionField + "\" />" + '</td>';
            display += '<td>' + typeField + '</td>';
            display += "<td><input type=\"image\" src=\"/Files/unnamed.png\" width=\"30\" onclick=\"deleteRow(this)\"></td>";
            display += '</tr>';
        }
        document.getElementById('id_Table').innerHTML = display;
    }
}






function initializeType(str) {
    if (str.indexOf('String') > -1) {
        return 'String';
    }
    else if (str.indexOf('Int') > -1) {
        return 'Int';
    }
    else if (str.indexOf('Boolean') > -1)
        return 'Boolean';
    return '';
}

function getFieldType(type, value) {
    switch (type) {
        case 'String':
            if (value === "")
                return "<input type=\"text\"  onpaste=\"return false;\" onchange = \"validator(this)\" />";
            return "<input type=\"text\"  onpaste=\"return false;\" onchange = \"validator(this,'System.String')\" value=" + value + " />";
        case 'Int':
            return "<input type=\"number\" onpaste=\"return false;\" onchange = \"validator(this,'System.Int32')\"  oninput = \"checkFieldForNumber(this)\"  value=" + value + " />";
        case 'Boolean':
        case 'Boolean':
            {
                var val_checkbox = "";
                if (value === "True")
                    val_checkbox = "checked";
                return "<input type=\"checkbox\"" + val_checkbox + "/>";
            }
    }
}





function CreateRow() {

    var table = document.getElementById('id_Table');
    var newRow = table.insertRow(1);
    for (var i = 0; i < CELL_Number; i++) {
        var newColumn = newRow.insertCell(i);
        newColumn.innerHTML = "<input type=\"text\" value=\"\" />";
    }
    var newColumn = newRow.insertCell(CELL_Number);
    newColumn.innerHTML = " <select id=\"SelType\" size=\"2\" onchange=\"SelectChanging( this )\" ><option>String</option><option>Int</option><option>Boolean</option></select>"
    newColumn = newRow.insertCell(CELL_Number + 1);
    newColumn.innerHTML = " <input type=\"image\" src=\"/Files/unnamed.png\" width=\"30\" onclick=\"deleteRow(this)\">"
}




function SelectChanging(select) {
    var table = document.getElementById('id_Table');
    var allRows = table.getElementsByTagName("tr");
    var i = select.parentNode.parentNode.rowIndex;
    var cell = allRows[i].getElementsByTagName("td")[CELL_Number - 1];
    var value = "";
    switch (select.value) {
        case 'String':
            value = "";
        case 'Int':
            value = 0;
        case 'Boolean':
            value = "False";
    }

    cell.innerHTML = getFieldType(select.value, value);
}






function deleteRow(r) {
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById('id_Table').deleteRow(i);
}




function download(name, typeOfFile) {
    var text = getOutputFile();
    if (text === "")
        return;
    var link = document.createElement("a");
    link.setAttribute('href', 'data:xml/plain;charset=utf-8,' + encodeURIComponent(text));
    var file = new Blob([text], { type: typeOfFile });
    link.setAttribute('download', name);
    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}





function getOutputFile() {
    var res = "<?xml version='1.0' encoding='utf-8' ?> \n" +
           "<Parameters xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema'> " + '\n';
    var table = document.getElementById("id_Table");
    var countRows = table.getElementsByTagName("tr");
    res += "<Params>\n";
    var isBool = false;
    var isWrong = false;
    for (var i = 1; i < countRows.length; i++) {
        res += "<Param>\n"
        var allColumns = countRows[i].getElementsByTagName("td");
        res += "<Id>" + allColumns[0].childNodes[0].value + "</Id>\n";
        res += "<Name>" + allColumns[1].childNodes[0].value + "</Name>\n";

        res += "<Description>" + allColumns[2].childNodes[0].value + "</Description>\n";
        console.log(allColumns[3].childNodes[0].getAttribute('type'));
        var type = "";
        if (allColumns[3].childNodes[0].getAttribute('type') == 'number') {
            type = "System.Int32";
        }
        else if (allColumns[3].childNodes[0].getAttribute('type') == 'text') {
            var value = allColumns[3].childNodes[0].getAttribute('value');
            value = allColumns[3].childNodes[0].value;
            type = "System.String";
        }
        else if (allColumns[3].childNodes[0].getAttribute('type') == 'checkbox') {
            allColumns[3].childNodes[0].setAttribute('id', 'checkbox');
            type = "System.Boolean";
            console.log(allColumns[3].childNodes[0].value);
        }



        if (allColumns[3].childNodes[0].value == "on")
            res += "<Value>" + "True" + "</Value>\n";
        else {
            if (allColumns[3].childNodes[0].value == "off")
                res += "<Value>" + "False" + "</Value>\n";
            else {

                res += "<Value>" + allColumns[3].childNodes[0].value + "</Value>\n";
            }
        }

        if (type === 'System.Boolean') {
            console.log("Znachenie Bool")
            console.log(allColumns[3].childNodes[0].value);

        }




        if ((isValueValid(allColumns[3].childNodes[0], type) === true) && (type === 'System.Boolean')) {
            allColumns[3].childNodes[0].setAttribute('id', 'complete');
            isBool = true;
        }


        if ((isValueValid(allColumns[3].childNodes[0], type) === true)) {
            switch (type) {
                case 'System.String':
                    {
                        allColumns[3].childNodes[0].setAttribute('id', 'complete');
                    }
                case 'System.Int32':
                    {
                        allColumns[3].childNodes[0].setAttribute('id', 'complete');
                    }

            }

        }

        if ((isValueValid(allColumns[3].childNodes[0], type) === false))
            switch (type) {
            case 'System.String':
                {
                    allColumns[3].childNodes[0].setAttribute('id', 'wrong');
                    alert('Количество символов  не может быть больше 10  !!!');
                    isWrong = true;
                }
            case 'System.Int32':
                {
                    allColumns[3].childNodes[0].setAttribute('id', 'wrong');
                    alert('Введенное число меньше минимально  числа !!!');
                    isWrong = true;
                }
            case 'System.Boolean':
                {
                }
        }
    }
    if (!isBool) {
        alert('Хотя бы 1 Checkbox должен быть true !!!');
        isWrong = true;
    }
    res += "</Param>";
    res += "</Params>";
    if (isWrong === true)
        return "";
    else {
        console.log(res);
        return res;
    }

}











function isValueValid(value, type) {
    switch (type) {
        case 'System.String':
            {
                if (value.value.length > 10) {

                    return false;
                }
                return true;
            }
        case 'System.Int32':
            {
                if (value.value > 32768)
                    return false;
                if (value.value < -32768) {
                    return false;
                }
                return true;
            }
        case 'System.Boolean':
            {

                console.log("value Bool");
                if (value.checked === true) {
                    console.log(true);
                    return true;
                }
                else {
                    console.log("Это False");
                    return false;
                }
            }
    }
}



function checkFieldForNumber(field) {
    if (field.getAttribute('value').length < 2) {
        field.setAttribute("value", field.value);
        return;
    }
    var regular = new RegExp("(^([+-]?)([1-9]+?)[0-9]*$)|^0$");
    if (!regular.test(field.value)) {
        field.value = field.getAttribute('value');
        return;
    }
    field.setAttribute("value", field.value);
}









