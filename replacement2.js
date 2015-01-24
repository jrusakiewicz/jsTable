/**
* Author: Jan Rusakiewicz (jan.rusakiewicz@gmail.com)
*/
var KEY_BACK = 8;
var KEY_DEL = 46;

/**
 * Creates JTable instance
 * @param data - data to be processed
 * @param data.rows - rows of table
 * @param data.headers - headers of table
 * @param options - additional options
 * @param options.inputs - defines if inputs should be generated
 * @constructor
 */
function JTable (data, options) {

    /**
     * Creates rows
     * @param {string[][]} rawData
     * @returns {{rows: Array, $rowsWrapper: HTMLElement}}
     */
    function createRows(rawData) {
        debugger;
        var len = rawData.length;
        var i;
        var rows = [];
        var $rowsWrapper = document.createElement('tbody');

        for (i = 0; i < len; i++) {
            rows[i] = new JRow(rawData[i]);
            $rowsWrapper.appendChild(rows[i].$el);
        }

        return {rows: rows, $rowsWrapper: $rowsWrapper};
    }

    this.rows = createRows(data.rows);

    this.$el = document.createElement('div');
    this.$el.className = 'JTable';

    if (options && options.inputs) {
        //prepare inputs;
        this.inputs = new JInputs(data.headers, this.rows.rows);
        this.$el.appendChild(this.inputs.$el);
    }

    this.$el.appendChild(this.rows.$rowsWrapper);
}

/**
 * Creates JInputs
 * @param headers
 *
 * @param rows
 * @returns {{$el: HTMLElement}}
 * @constructor
 */
function JInputs(headers, rows) {
    var i;
    var currentInput;
    var $inputs = document.createElement('div');

    function refreshData(column, needle) {
        var i;

        for (i = 0; i < rows.length; i++) {
            if (rows[i].cells[column].$el.textContent.indexOf(needle) === -1) {
                rows[i].$el.style.display = 'none';
            } else {
                //rows[i].$el.style.display = '';
            }
        }
    }

    function onKeyPress (e) {
        /*if(e === KEY_BACK || e === KEY_DEL){

        } else {*/
            refreshData(e.target.index, e.target.value + String.fromCharCode(e.keyCode));
        //}
    }

    for (i = 0; i < headers.length; i++) {
        currentInput = document.createElement('input');
        currentInput.type = 'text';

        currentInput.index = i;
        currentInput.addEventListener('keypress', onKeyPress);
        $inputs.appendChild(currentInput);
    }

    return {
        $el: $inputs
    };
}

/**
 * Creates JRow
 * @param {string[]} data - an array of data from cells
 * @constructor
 */
function JRow (data) {
    var i;

    this.$el = document.createElement('tr');
    this.$el.className = 'JRow';
    this.cells = [];

    for (i = 0; i < data.length; i++) {
        this.cells[i] = new JCell(data[i]);
        this.$el.appendChild(this.cells[i].$el);
    }
}

/**
 * Creates JCell
 * @param {string} data - data from cell
 * @constructor
 */
function JCell (data) {
    this.data = data;
    this.$el = document.createElement('td');
    this.$el.className = 'JCell';
    this.$el.textContent = data;
}

/**
 * Gets data from table (You must personalize this function)
 * @returns {{rows: Array, headers: string[]}}
 */
function getData () {
    var rows = document.querySelectorAll('tr');
    var i;
    var len = rows.length;
    var output = [];
    var j;
    var index = 0;

    for (i = 0; i < len; i++) {
        if (rows[i].children.length === 6) {
            output[index] = [];
            for (j = 0; j < 6; j++) {
                output[index][j] = rows[i].children[j].textContent;
            }
            index++;
        }
    }

    return {
        rows: output,
        headers: ['klasa', 'lekcja', 'nauczyciel', 'typ', 'nazwa', 'data']
    };
}

/**
 * Creates JTable
 * @param {string} $target - DOM element, parent for table
 * @param {array} data - array with data for table
 */
function createJTable ($target, data) {
    var table;

    table = new JTable(data, {
        inputs: true
    });
    $target.appendChild(table.$el);
}

/**
 * Prepares drop down list inputs for sorting the array
 * @param names
 * @returns {HTMLElement}
 */
function prepareInputs (names) {
    var i;
    var len; //= Object.keys(names).length;
    var $inputs = document.createElement('div');
    var $currentInput;
    $inputs.className = 'jInputs';

    for (i = 0; i < len; i++) {
        $currentInput = document.createElement('input');
        $currentInput.type = 'text';
        $currentInput.textContent = names[i];
        $currentInput.placeholder = 'test';
        $inputs.appendChild($currentInput);
        $currentInput.keydown(function(e){
            debugger;
            refreshTable(i, $currentInput.textContent);
        });
    }

    return $inputs;
}

/**
 * Creates function for refresh table on enter character in input
 * @param columnNumber
 * @param needle
 */
function refreshTable(columnNumber, needle){

    for (i = 0; i < len; i++) {
        var $cell = $rows[i][columnNumber];

        if ($cell.textContent.indexOf(needle) === -1) {
            hide($rows[i]);
        } else {
            show($rows[i]);
        }
    }
}

/**
 * Prepares Table
 * @param names
 * @param names.length
 * @param rows
 * @param rows.length
 * @returns {HTMLElement}
 */
function prepareTable (names, rows) {
    /*
    <table>
        <thead>
            <th></th>
        </thead>
        <tbody>
            <tr>
                <td></td>
            </tr>
        </tbody>
    </table>
    */

    var $table = document.createElement('table');
    var $head = document.createElement('thead');
    var $currentHead;
    var $tableBody = document.createElement('tbody');
    var $currentRow;
    var $currentCell;

    for (i = 0; i < names.length; i++) {
        $currentHead = document.createElement('input');
        $currentHead.textContent = names[i];
        $head.appendChild($currentHead);
    }

    for (i = 0; i < rows.length; i++) {
        $currentRow = document.createElement('tr');
        $tableBody.appendChild($currentRow);
    }


    return $table;
}

$(document).ready(function(){
    $target = document.getElementById("j-table")
    createJTable($target, getData());

});
