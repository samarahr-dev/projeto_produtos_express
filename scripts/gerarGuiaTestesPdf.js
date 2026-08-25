const fs = require('fs');
const path = require('path');

const output = path.resolve(__dirname, '..', 'guia-testes-api.pdf');
const pages = [
  [
    ['Guia de testes da API de Produtos', 20, true],
    ['Backend Node.js com Express, Jest e SQLite.', 11],
    ['', 8],
    ['1. Como executar', 14, true],
    ['npm test', 10],
    ['npm test -- --runInBand', 10],
    ['O primeiro comando executa todas as suites. O segundo executa uma suite por vez.', 10],
    ['', 6],
    ['2. Organizacao e objetivo', 14, true],
    ['- src/models/Produto.test.js: testa validar com dados reais, sem mocks.', 10],
    ['- src/services/ProdutoService.test.js: testa regras de negocio isolando dependencias.', 10],
    ['- src/controllers/ProdutoController.test.js: testa respostas HTTP e delegacao ao servico.', 10],
    ['Um teste unitario exercita uma unidade pequena e substitui dependencias externas.', 10],
    ['', 6],
    ['3. Testes do modelo', 14, true],
    ['A funcao validar aceita produto com nome, categoria permitida e preco numerico maior que zero.', 10],
    ['Casos: produto correto; nome vazio; preco negativo; categoria fora da lista.', 10],
    ['', 6],
    ['Exemplo', 11, true],
    ["test('rejeita preco invalido', () => {", 9],
    ["  expect(validar({ nome: 'Racao', categoria: 'alimentacao', preco: -10 }))", 9],
    ['    .toBe(false);', 9],
    ['});', 9],
    ['', 6],
    ['4. Testes do servico', 14, true],
    ['ProdutoService chama o repositorio, valida dados e lanca HttpError quando necessario.', 10],
    ['O repositorio e o modelo sao mocks porque SQLite nao e responsabilidade dessa camada.', 10],
    ['Casos: listagem com filtro, busca encontrada, 404, criacao valida/invalida,', 10],
    ['atualizacao valida/inexistente e exclusao de produto existente.', 10],
  ],
  [
    ['Guia de testes da API de Produtos', 16, true],
    ['', 7],
    ['5. Testes do controller', 14, true],
    ['O controller recebe req e res simples. Nao e preciso iniciar o Express no teste unitario.', 10],
    ['criarResposta cria mocks para status, json, send e set.', 10],
    ['Casos: listagem incrementa a sessao e retorna 200; criacao retorna 201;', 10],
    ['erros seguem para next(erro); exportacao define text/csv e envia o conteudo CSV.', 10],
    ['', 7],
    ['6. Recursos do Jest usados', 14, true],
    ['test(nome, funcao): declara um caso independente.', 10],
    ['expect(valor): inicia uma verificacao.', 10],
    ['toBe(valor): compara primitivos ou a mesma referencia.', 10],
    ['toEqual(valor): compara conteudo de objetos e arrays.', 10],
    ['toThrow(texto ou classe): confirma que uma funcao lanca erro.', 10],
    ['jest.mock(caminho, factory): substitui modulo importado por uma versao controlada.', 10],
    ['jest.fn(): cria funcao simulada e registra suas chamadas.', 10],
    ['mockReturnValue(valor): define o retorno do mock.', 10],
    ['mockImplementation(funcao): define comportamento, por exemplo lancar erro.', 10],
    ['mockReturnThis(): permite res.status(...).json(...) no mock de resposta.', 10],
    ['toHaveBeenCalledWith(...): confere argumentos de uma chamada.', 10],
    ['not.toHaveBeenCalled(): confirma que uma chamada proibida nao ocorreu.', 10],
    ['jest.clearAllMocks(): limpa o historico dos mocks antes de cada teste.', 10],
    ['', 7],
    ['7. Fluxo para criar um novo teste', 14, true],
    ['1. Escolha uma regra: exemplo, produto inexistente retorna 404.', 10],
    ['2. Faca mock apenas das dependencias da camada.', 10],
    ['3. Prepare entradas e retornos dos mocks.', 10],
    ['4. Execute a funcao e verifique retorno, status HTTP ou erro.', 10],
    ['5. Verifique argumentos e chamadas que nao devem ocorrer.', 10],
    ['', 7],
    ['Use Supertest para testes de integracao de rota, middleware, sessao e Express.', 10],
    ['Os testes atuais sao unitarios: rapidos, isolados e chamam controller/service diretamente.', 10],
  ],
];

function escapePdf(text) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function pageContent(lines) {
  let y = 800;
  const commands = ['BT'];
  for (const [text, size, bold] of lines) {
    commands.push(`/${bold ? 'F2' : 'F1'} ${size} Tf`);
    commands.push(`1 0 0 1 54 ${y} Tm (${escapePdf(text)}) Tj`);
    y -= size + 7;
  }
  commands.push('ET');
  return commands.join('\n');
}

const objects = ['<< /Type /Catalog /Pages 2 0 R >>', null, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'];
const pageIds = [];

for (const lines of pages) {
  const content = pageContent(lines);
  const contentId = objects.push(`<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`);
  const pageId = objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
  pageIds.push(pageId);
}

objects[1] = `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] >>`;
let pdf = '%PDF-1.4\n';
const offsets = [0];
objects.forEach((object, index) => {
  offsets.push(Buffer.byteLength(pdf, 'latin1'));
  pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
});
const xref = Buffer.byteLength(pdf, 'latin1');
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let index = 1; index < offsets.length; index += 1) {
  pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
fs.writeFileSync(output, Buffer.from(pdf, 'latin1'));
console.log(`PDF criado em ${output}`);
