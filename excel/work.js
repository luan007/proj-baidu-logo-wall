const XlsxExtractor = require('xlsx-extractor');
var tasks = [];
var extractor = new XlsxExtractor('list copy.xlsx');
tasks.push(extractor.extract(1));

Promise
    .all(tasks)
    .then((results) => {
        results[0].cells.shift();
        var patents = [];
        for (var i = 0; i < results[0].cells.length; i++) {
            patents.push({
                manage_id: results[0].cells[i][1],
                id: results[0].cells[i][1],
                name: results[0].cells[i][2],
                engname: results[0].cells[i][3],
                type: results[0].cells[i][4],
                owner: results[0].cells[i][5],
                desc: results[0].cells[i][6],
                world_position: [0, 0, 0]
            });
        }
        console.log(JSON.stringify(patents, null, '  ') + '\n');
    });