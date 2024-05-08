javascript: (function () {
    function showError() {
        var errorDiv = document.createElement('div');
        errorDiv.style = {position: 'fixed', top: '0', left: '0', width: '100%', backgroundColor: 'red', color: 'white', textAlign: 'center', fontSize: '20px', zIndex: '1000' }
        errorDiv.textContent = 'Sorry, some error'
        document.body.prepend(errorDiv);
    }

    var jumbotron = document.querySelector('div.jumbotron > b');
    var centerDiv = document.querySelector('div[align="center"] > b');

    if (jumbotron && jumbotron.textContent.startsWith('AGENTUL ECONOMIC CU CODUL UNIC DE IDENTIFICARE')) {
        // Extract unique code from the jumbotron
        var uniqueCode = jumbotron.textContent.match(/\d+/g).pop();
        var containers = document.querySelectorAll('div.container');
        var targetContainer;
        for (var i = 0; i < containers.length; i++) {
            if (containers[i].querySelectorAll('div.row').length >= 3) {
                targetContainer = containers[i];
                break;
            }
        }
        if (!targetContainer) {
            showError();
            return;
        }

        var rows = targetContainer.querySelectorAll('div.row');
        var csvContent = 'Label,Value\n';
        var companyName = '';

        rows.forEach(function (row) {
            var cells = row.querySelectorAll('div');
            if (cells.length === 2) {
                var label = cells[0].textContent.trim();
                var value = cells[1].textContent.trim();
                csvContent += `"${label}","${value}"\n`;

                if (label === 'Denumire platitor:') {
                    companyName = value.replace(/[^a-zA-Z0-9\-_]+/g, '_');
                }
            }
        });

        var fileName = uniqueCode + (companyName ? '-' + companyName : '') + '-info.csv';
        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    } else if (centerDiv && centerDiv.textContent.trim().startsWith('Indicatori din situaţiile financiare anuale')) {
        var yearMatch = centerDiv.textContent.match(/20\d{2}/);
        var codMatch = centerDiv.textContent.match(/cod unic de identificare:\s*(\d+)/);
        var year = yearMatch ? yearMatch[0] : 'unknown';
        var cod = codMatch ? codMatch[1] : 'unknown';

        var table = document.querySelector('center > table[bgcolor="white"]');
        if (table) {
            var rows = table.querySelectorAll('tr');
            var csv = [];
            rows.forEach(row => {
                var cells = row.querySelectorAll('td, th');
                var rowCsv = Array.from(cells).map(cell => '"' + cell.innerText.replace(/"/g, '""') + '"').join(',');
                csv.push(rowCsv);
            });
            var csvData = csv.join('\r\n');
            var blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${cod}-${year}.csv`;
            link.click();
        } else {
            showError();
        }
    } else {
        showError();
    }
})();
