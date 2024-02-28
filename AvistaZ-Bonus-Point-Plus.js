// ==UserScript==
// @name         AvistaZ Bonus Point Plus+
// @namespace    https://github.com/royspace/AvistaZ-Bonus-Point-Plus
// @homepage     https://github.com/royspace/AvistaZ-Bonus-Point-Plus
// @version      0.3
// @author       Roy
// @description  Adds a "Shortfall" and "Time Calculation" to Exchange table, Adds BP per second, minute,...
// @match        https://avistaz.to/profile/*/bonus
// @icon         https://avistaz.to/images/avistaz-favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482432/AvistaZ%20Bonus%20Point%20Plus%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/482432/AvistaZ%20Bonus%20Point%20Plus%2B.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function createCalculationTable(pointsPerHour) {
        var pointsPerSecond = pointsPerHour / 3600;
        var pointsPerMinute = pointsPerHour / 60;
        var pointsPerDay = pointsPerHour * 24;
        var pointsPerWeek = pointsPerDay * 7;
        var pointsPerMonth = pointsPerDay * 30;
        var pointsPerYear = pointsPerDay * 365;

        var table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';
        table.style.width = '100%';

        var tableHeader = table.createTHead();
        var headerRow = tableHeader.insertRow();
        var headerCellLabel = headerRow.insertCell();
        var headerCellValue = headerRow.insertCell();

        headerCellLabel.innerHTML = 'Calculation';
        headerCellLabel.style.backgroundColor = '#001F3F';
        headerCellLabel.style.fontWeight = 'bold';
        headerCellLabel.style.padding = '10px';

        headerCellValue.innerHTML = 'Value';
        headerCellValue.style.backgroundColor = '#001F3F';
        headerCellValue.style.fontWeight = 'bold';
        headerCellValue.style.padding = '10px';



        var tableBody = table.createTBody();

        function addRow(label, value) {
            var row = tableBody.insertRow();
            var cellLabel = row.insertCell(0);
            var cellValue = row.insertCell(1);

            cellLabel.innerHTML = label;
            cellLabel.style.textAlign = 'left';
            cellLabel.style.paddingLeft = '10px';
            cellLabel.style.fontWeight = '400';


            cellValue.innerHTML = value.toFixed(2);
            cellValue.style.textAlign = 'right';
            cellValue.style.paddingRight = '10px';
            cellValue.style.fontWeight = '550';
        }

        addRow('Points Per Second', pointsPerSecond);
        addRow('Points Per Minute', pointsPerMinute);
        addRow('Points Per Hour', pointsPerHour);
        addRow('Points Per Day', pointsPerDay);
        addRow('Points Per Week', pointsPerWeek);
        addRow('Points Per Month', pointsPerMonth);
        addRow('Points Per Year', pointsPerYear);

        return table;
    }

    function addCalculationColumn() {
        var pointsPerHour = parseFloat(document.querySelector('td:nth-child(3) strong').textContent);
        const header = document.querySelector('div > div > .col-sm-8 > table > thead > tr');

        if (header) {
            const shortfallHeaderCell = document.createElement('th');
            shortfallHeaderCell.textContent = 'Shortfall';
            header.querySelector('th:nth-child(2)').after(shortfallHeaderCell);

            const timeCalculationHeaderCell = document.createElement('th');
            timeCalculationHeaderCell.textContent = 'Time Calculation';
            shortfallHeaderCell.after(timeCalculationHeaderCell);
        }

        const tbody = document.querySelector('div > div > .col-sm-8 > table > tbody');
        const trimValueElement = document.querySelector('h2');
        const trimValue = parseFloat(trimValueElement.textContent.replace(/[^\d.]/g, '')) || 0;

        function formatTime(hours) {
            const months = Math.floor(hours / (30 * 24));
            const days = Math.floor((hours % (30 * 24)) / 24);
            const remainingHours = Math.round(hours % 24);
            let result = '';

            if (months > 0) {
                result += `${months} month${months > 1 ? 's' : ''}, `;
            }

            if (days > 0) {
                result += `${days} day${days > 1 ? 's' : ''}, `;
            }

            if (remainingHours > 0) {
                result += `${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
            }

            return result.trim();
        }

        if (tbody) {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach((row, index) => {
                const pointsCell = row.querySelector('td:nth-child(2)');
                const pointsValue = parseInt(pointsCell.textContent.replace(/,/g, ''), 10);
                const shortfallValue = Math.max(pointsValue - trimValue, 0).toFixed(0);

                const shortfallCell = document.createElement('td');
                shortfallCell.textContent = shortfallValue;
                pointsCell.after(shortfallCell);

                const timeCalculationValue = shortfallValue / pointsPerHour;
                const timeCalculationCell = document.createElement('td');
                timeCalculationCell.textContent = formatTime(timeCalculationValue);
                shortfallCell.after(timeCalculationCell);
            });
        }
    }

    var targetElement = document.querySelector('div > div .well-sm > h3');

    if (targetElement) {
        var pointsPerHour = parseFloat(document.querySelector('td:nth-child(3) strong').textContent);
        var calculationTable = createCalculationTable(pointsPerHour);
        targetElement.parentNode.insertBefore(calculationTable, targetElement.nextSibling);
    }

    addCalculationColumn();
})();
