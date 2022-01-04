import {readFileSync} from 'fs'
import {jsPDF} from 'jspdf'

// Load true type fonts
(function (api) {
  var font = readFileSync('./fonts/LiberationSans-Regular.ttf', 'base64');
  var callAddFont = function () {
    this.addFileToVFS('LiberationSans-Regular.ttf', font);
    this.addFont('LiberationSans-Regular.ttf', 'LiberationSans', 'normal');
  };
  api.events.push(['addFonts', callAddFont]);
})(jsPDF.API);

(function (api) {
  var font = readFileSync('./fonts/LiberationSans-Bold.ttf', 'base64');
  var callAddFont = function () {
    this.addFileToVFS('LiberationSans-Bold.ttf', font);
    this.addFont('LiberationSans-Bold.ttf', 'LiberationSans', 'bold');
  };
  api.events.push(['addFonts', callAddFont]);
})(jsPDF.API);

function parseInput() {
  var lines = document.getElementById('form_input').value.split("\n")
  var i, item
  var items = []
  var separator = document.getElementById('separator').value.replace("\\t", "\t")
  for (i = 0; i < lines.length; i++) {
    item = (function() {
      let values = lines[i].trim().split(separator)
      function strip(name, def) {
        var index = document.getElementById('col_' + name).value - 1
        return values[index] ? values[index] : def
      }
      return {
        number: strip('number', ''),
        date: strip('date', '-'),
        parcel: strip('parcel', '-'),
        trench: strip('trench', '-'),
        object: strip('object', '-'),
        context: strip('context', '-'),
        material: strip('material', '-'),
        type: strip('type', '-'),
        comment: strip('comment', ''),
      }
    })()
    if (item.number) {
      items.push(item)
    }
  }
  return items
}

function Label() {
  this.width = 57.0
  this.height = 77.0
  this.lineHeight = 8.5
  this.columns = [21.5, 37.0, 29.3,  21.5]
}

Label.prototype.drawLines = function(x, y, doc) {
  var i
  doc.setLineWidth(0.35)
  // Rect
  doc.rect(x, y, this.width, this.height, 'S')
  doc.setLineWidth(0.22)
  // Horizontal lines
  for (i = 1; i < 7; i++) {
    doc.line(x, y + this.height - (this.lineHeight * i),
             x + this.width, y + this.height - (this.lineHeight * i))
  }
  // Vertical lines
  for (i = 0; i < this.columns.length; i++) {
    doc.line(x + this.columns[i], y + this.height - (this.lineHeight * (i + 2)),
             x + this.columns[i], y + this.height - (this.lineHeight * (i + 3)))
  }
}

Label.prototype.render = function(item, x, y, doc) {
  doc.setDrawColor('black')
  this.drawLines(x, y, doc)
};

module.exports.generate = function() {

  // Parse input data (from spread sheet, tab separated)
  var items = parseInput()

  // Create document
  var doc = new jsPDF({
    putOnlyUsedFonts: true,
    unit: 'mm',
    format: 'a4'
  })

  // Card size
  var card_width = 57
  var card_height = 77

  // Card line height
  var line_height = 8.5

  // Size of colums
  var col_0 = 21.5
  var col_1 = 29.3
  var col_2 = 37

  var row_count = 3
  var col_count = 3
  var card_count = col_count * row_count

  var marginLeft = 15.0
  var marginTop = 20.0
  var padding = 4.0

  var i
  var item
  var pos_y
  var pos_x

  for (i = 0; i < items.length; i++) {
    var label = new Label()
    item = items[i]

    pos_y = marginTop + (Math.floor((i % card_count) / col_count) * (card_height + padding))
    pos_x = marginLeft + ((i % row_count) * (card_width + padding))

    // Put 9 cards on every page
    if (i != 0 && i % card_count == 0) {
      doc.addPage()
    }

    // Set default font
    doc.setFont('LiberationSans', 'normal', 'normal')
    doc.setFontSize(7)

    // Top label
    doc.text(pos_x+1,pos_y+2.9, "Maßnahme/Nr.")

    doc.setFontSize(10)

    // Address
    doc.text(pos_x+1,pos_y+7.3, document.getElementById('form_pp').value)
    doc.text(pos_x+1,pos_y+12, document.getElementById('form_kg').value)

    doc.setFont('LiberationSans', 'normal', 'bold')

    // Project
    doc.text(pos_x+1,pos_y+16.5, document.getElementById('form_mn').value)

    doc.setFontSize(14)

    // Project ID
    doc.text(pos_x+1,pos_y+22.5, document.getElementById('form_mnr').value)

    doc.setFont('LiberationSans', 'normal', 'normal')
    doc.setFontSize(7)

    // Left column labels
    var keys, values
    keys = ['Fund-Nr.', 'Anmerkung', 'Material', 'Fläche-Nr.', 'Datum', 'Grundstück-Nr.']
    var j
    for (j = 0; j < keys.length; j++) {
      doc.text(pos_x + 1.0, pos_y + label.height - (label.lineHeight * (j + 1)) + 2.7, keys[j])
    }

    // Right column labels
    keys = ['Fundbezeichnung', 'SE-Nr.', 'Objekt-Nr.', 'Institution']
    for (j = 0; j < keys.length; j++) {
      doc.text(pos_x + label.columns[j] + 1.0 , pos_y + label.height-(label.lineHeight * (j + 3)) + 2.7, keys[j])
    }
    doc.setFont('LiberationSans', 'normal', 'normal')
    doc.setFontSize(10)

    // Left column values
    doc.text(pos_x+card_width-1.5, pos_y+card_height-(line_height*6)+6.5, document.getElementById('form_institution').value, 'right')
    doc.text(pos_x+card_width-1.5, pos_y+card_height-(line_height*5)+6.5, item.object, 'right')
    doc.text(pos_x+card_width-1.5, pos_y+card_height-(line_height*4)+6.5, item.context, 'right')
    doc.text(pos_x+card_width-1.5, pos_y+card_height-(line_height*3)+6.5, item.type, 'right')

    // Right column values
    doc.text(pos_x+col_0-1.5, pos_y+card_height-(line_height*6)+6.5, item.parcel, 'right')
    doc.text(pos_x+col_1-1.5, pos_y+card_height-(line_height*5)+6.5, item.date, 'right')
    doc.text(pos_x+col_2-1.5, pos_y+card_height-(line_height*4)+6.5, item.trench, 'right')
    doc.text(pos_x+col_0-1.5, pos_y+card_height-(line_height*3)+6.5, item.material, 'right')

    // Comment
    doc.text(pos_x+card_width-1.5,pos_y+card_height-(line_height*2)+6.5, item.comment, {align: 'right', maxWidth: card_width-5})

    doc.setFontSize(20)

    // Find number
    doc.text(pos_x+card_width-2, pos_y+card_height-1.8, item.number, 'right')

    label.render(item, pos_x, pos_y, doc)
  }

  // Write output
  doc.output('dataurlnewwindow');
}
