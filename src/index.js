import readFileSync from 'fs'
import jsPDF from 'jspdf'

// Load true type fonts
(function (jsPDFAPI) {
  var font = readFileSync('fonts/LiberationSans-Regular.ttf', "base64");
  var callAddFont = function () {
    this.addFileToVFS('LiberationSans-normal.ttf', font);
    this.addFont('LiberationSans-normal.ttf', 'LiberationSans', 'normal');
  };
  jsPDFAPI.events.push(['addFonts', callAddFont]);
})(jsPDF.API);

(function (jsPDFAPI) {
  var font = readFileSync('fonts/LiberationSans-Bold.ttf', "base64");
  var callAddFont = function () {
    this.addFileToVFS('LiberationSans-Bold.ttf', font);
    this.addFont('LiberationSans-Bold.ttf', 'LiberationSans', 'bold');
  };
  jsPDFAPI.events.push(['addFonts', callAddFont]);
})(jsPDF.API);

document.getElementById('form_submit').onclick = function() {

  // Parse input data (from spread sheet, tab separated)
  var items = function() {
    var lines = document.getElementById('form_input').value.split("\n")
    var i, item
    var items = []
    for (i = 0; i < lines.length; i++) {
      item = (function() {
        let values = lines[i].trim().split("\t")
        function strip(index) {
          return values[index] ? values[index] : ""
        }
        return {
          number: strip(0),
          date: strip(1),
          parcel: strip(2),
          trench: strip(3),
          object: strip(4),
          context: strip(5),
          material: strip(6),
          type: strip(7),
          comment: strip(8),
        }
      })()
      if (item.number) items.push(item)
    }
    return items
  }()

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

  var i
  var item

  var margin_top
  var margin_left

  for (i = 0; i < items.length; i++) {
    item = items[i]

    margin_top = 20 + (Math.floor((i % 9) / 3) * (card_height + 4))
    margin_left = 15 + ((i % 3) * (card_width + 4))

    // Put 9 cards on every page
    if (i != 0 && i % 9 == 0) {
      doc.addPage()
    }

    // Set default font
    doc.setFont('LiberationSans')
    doc.setFontType('normal')
    doc.setFontSize(7)

    // Top label
    doc.text(margin_left+1,margin_top+2.9, "Maßnahme/Nr.")

    doc.setFontSize(10)

    // Address
    doc.text(margin_left+1,margin_top+7.3, document.getElementById('form_pp').value)
    doc.text(margin_left+1,margin_top+12, document.getElementById('form_kg').value)

    doc.setFontType('bold')

    // Project
    doc.text(margin_left+1,margin_top+16.5, document.getElementById('form_mn').value)

    doc.setFontSize(14)

    // Project ID
    doc.text(margin_left+1,margin_top+22.5, document.getElementById('form_mnr').value)

    doc.setFontType('normal')
    doc.setFontSize(7)

    // Left column labels
    doc.text(margin_left+1,margin_top+card_height-(line_height*1)+2.7, "Fund-Nr.")
    doc.text(margin_left+1,margin_top+card_height-(line_height*2)+2.7, "Anmerkung")
    doc.text(margin_left+1,margin_top+card_height-(line_height*3)+2.7, "Material")
    doc.text(margin_left+1,margin_top+card_height-(line_height*4)+2.7, "Fläche-Nr.")
    doc.text(margin_left+1,margin_top+card_height-(line_height*5)+2.7, "Datum")
    doc.text(margin_left+1,margin_top+card_height-(line_height*6)+2.7, "Grundstück-Nr.")

    // Right column labels
    doc.text(margin_left+col_0+1,margin_top+card_height-(line_height*3)+2.7, "Fundbezeichnung")
    doc.text(margin_left+col_2+1,margin_top+card_height-(line_height*4)+2.7, "SE-Nr.")
    doc.text(margin_left+col_1+1,margin_top+card_height-(line_height*5)+2.7, "Objekt-Nr.")
    doc.text(margin_left+col_0+1,margin_top+card_height-(line_height*6)+2.7, "Institution")

    doc.setFontType('normal')
    doc.setFontSize(10)

    // Left column values
    doc.text(margin_left+card_width-1.5, margin_top+card_height-(line_height*6)+6.5, document.getElementById('form_institution').value, 'right')
    doc.text(margin_left+card_width-1.5, margin_top+card_height-(line_height*5)+6.5, item.object, 'right')
    doc.text(margin_left+card_width-1.5, margin_top+card_height-(line_height*4)+6.5, item.context, 'right')
    doc.text(margin_left+card_width-1.5, margin_top+card_height-(line_height*3)+6.5, item.type, 'right')

    // Right column values
    doc.text(margin_left+col_0-1.5, margin_top+card_height-(line_height*6)+6.5, item.parcel, 'right')
    doc.text(margin_left+col_1-1.5, margin_top+card_height-(line_height*5)+6.5, item.date, 'right')
    doc.text(margin_left+col_2-1.5, margin_top+card_height-(line_height*4)+6.5, item.trench, 'right')
    doc.text(margin_left+col_0-1.5, margin_top+card_height-(line_height*3)+6.5, item.material, 'right')

    // Comment
    doc.text(margin_left+card_width-1.5,margin_top+card_height-(line_height*2)+6.5, item.comment, {align: 'right', maxWidth: card_width-5})

    doc.setFontSize(20)

    // Find number
    doc.text(margin_left+card_width-2, margin_top+card_height-1.8, item.number, 'right')

    doc.setLineWidth(0.35)
    doc.setDrawColor(0)

    // Card rect
    doc.rect(margin_left, margin_top, card_width, card_height, 'S')

    doc.setLineWidth(0.22)

    // Horizontal lines
    doc.line(margin_left, margin_top+card_height-line_height, margin_left+card_width, margin_top+card_height-line_height)
    doc.line(margin_left, margin_top+card_height-(line_height*2), margin_left+card_width, margin_top+card_height-(line_height*2))
    doc.line(margin_left, margin_top+card_height-(line_height*3), margin_left+card_width, margin_top+card_height-(line_height*3))
    doc.line(margin_left, margin_top+card_height-(line_height*4), margin_left+card_width, margin_top+card_height-(line_height*4))
    doc.line(margin_left, margin_top+card_height-(line_height*5), margin_left+card_width, margin_top+card_height-(line_height*5))
    doc.line(margin_left, margin_top+card_height-(line_height*6), margin_left+card_width, margin_top+card_height-(line_height*6))

    // Vertical lines
    doc.line(margin_left+col_0, margin_top+card_height-(line_height*5), margin_left+col_0, margin_top+card_height-(line_height*6))
    doc.line(margin_left+col_1, margin_top+card_height-(line_height*4), margin_left+col_1, margin_top+card_height-(line_height*5))
    doc.line(margin_left+col_2, margin_top+card_height-(line_height*3), margin_left+col_2, margin_top+card_height-(line_height*4))
    doc.line(margin_left+col_0, margin_top+card_height-(line_height*2), margin_left+col_0, margin_top+card_height-(line_height*3))
  }

  // Write output
  doc.output('dataurlnewwindow')
}
