# boleto.js

[![npm version](https://badge.fury.io/js/boleto.js.svg)](https://badge.fury.io/js/boleto.js)
[![Build Status](https://travis-ci.org/guilhermearaujo/boleto.js.svg?branch=master)](https://travis-ci.org/guilhermearaujo/boleto.js)
[![Code Climate](https://codeclimate.com/github/guilhermearaujo/boleto.js/badges/gpa.svg)](https://codeclimate.com/github/guilhermearaujo/boleto.js)
[![Test Coverage](https://codeclimate.com/github/guilhermearaujo/boleto.js/badges/coverage.svg)](https://codeclimate.com/github/guilhermearaujo/boleto.js/coverage)
[![Inline docs](http://inch-ci.org/github/guilhermearaujo/boleto.js.svg?branch=master)](http://inch-ci.org/github/guilhermearaujo/boleto.js)

Renderizador de código de barras para boletos bancários

## Utilização

Inclua o script da biblioteca

```html
<script src="dist/boleto.min.js"></script>
```

Crie uma instância de `Boleto` passando o número do boleto e o seletor do elemento onde ele deve ser renderizado.

```html
<div id="boleto"></div>

<script>
  var number = '34195.00008 01233.203189 64221.470004 5 84410000002000';
  new Boleto(number).toSVG('#boleto');
</script>
```

Alternativamente, você pode retornar a representação HTML da imagem do código de barras:

```html
<script>
  var number = '34195.00008 01233.203189 64221.470004 5 84410000002000';
  var svg = new Boleto(number).toSVG();
  console.log(svg); // Veja o código HTML no console
</script>
```

O número do boleto pode conter apenas os números ou estar formatado com pontos e espaços.
O boleto.js irá filtrar apenas os dígitos e validá-los antes de mostrar o código de barras.

## Resultado

O código será renderizado em SVG, com boa nitidez em diversos tamanhos.
Por trabalhar com vetores, e não imagens, é uma excelente ferramenta para páginas com layout responsivo.

![Exemplo de código de barras](https://cl.ly/0l3s1R3V2A2M/download/Image%202016-07-17%20at%2000.06.46.png)

## Métodos adicionais

Além de renderizar o código de barras, o boleto.js também possui alguns métodos que podem facilitar a exibição de dados.

```javascript
// Numeração da linha digitável
.number()         // 34195000080123320318964221470004584410000002000
.prettyNumber()   // 34195.00008 01233.203189 64221.470004 5 84410000002000

// Numeração do código de barras
.barcode()        // 34195844100000020005000001233203186422147000
.checksum()       // 5

// Informações sobre a cobrança
.amount()         // 120.00
.prettyAmount()   // R$ 120,00
.bank()           // Itaú
.currency()       // { code: 'BRL', symbol: 'R$', decimal: ',' }
.expirationDate() // Sun Nov 15 2020 22:00:00 GMT-0200 (BRST)
```
## Licença

MIT © Guilherme Araújo
