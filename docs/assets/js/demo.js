$('input[name="number"]').mask('00000.00000 00000.000000 00000.000000 0 00000000000000')

function generate() {
  $('#demo-svg').empty();

  try {
    $('input[name="number"], button[type="submit"]').removeClass('error');

    var number = $('input[name="number"]').val();

    boleto = new Boleto(number);
    boleto.toSVG('#demo-svg');

    $('#number').html(boleto.number());
    $('#pretty-number').html(boleto.prettyNumber());
    $('#amount').html(boleto.amount());
    $('#expiration-date').html(boleto.expirationDate().toISOString().slice(0, 10).split('-').reverse().join('/'));
    $('#pretty-amount').html(boleto.prettyAmount());
    $('#bank').html(boleto.bank());
    $('#currency').html(JSON.stringify(boleto.currency()));
    $('#checksum').html(boleto.checksum());
    $('#barcode').html(boleto.barcode());
  } catch(e) {
    $('input[name="number"], button[type="submit"]').addClass('error');

    var error = document.createElement('span');
    error.innerHTML = 'Invalid bank slip number';

    $('#demo-svg').append(error);
    $('#number, #pretty-number, #amount, #expiration-date, #pretty-amount, #bank, #currency, #checksum, #barcode').html('&nbsp;');
  }
}

generate();
