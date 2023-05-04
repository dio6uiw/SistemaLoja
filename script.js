// Variáveis para acesso aos elementos HTML
const form = document.querySelector('form');
const nomeClienteInput = document.querySelector('#nome-cliente');
const formaPagamentoSelect = document.querySelector('#forma-pagamento');
const quantidadeParcelasInput = document.querySelector('#quantidade-parcelas');
const mesInicioInput = document.querySelector('#mes-inicio');
const tabelaVendasBody = document.querySelector('#tabela-vendas tbody');
const mesFiltroInput = document.querySelector('#mes-filtro');

// Verifica se o localStorage já tem as vendas cadastradas
let vendas = [];
if (localStorage.getItem('vendas')) {
  vendas = JSON.parse(localStorage.getItem('vendas'));
}

// Função para atualizar a tabela de vendas
function atualizarTabelaVendas() {
  // Limpa a tabela de vendas antes de atualizar
  tabelaVendasBody.innerHTML = '';

  // Filtra as vendas pelo mês, se houver filtro aplicado
  const mesFiltro = mesFiltroInput.value;
  const vendasFiltradas = mesFiltro ?
    vendas.filter(venda => venda.mesInicio === mesFiltro) :
    vendas;

  // Atualiza a tabela com as vendas filtradas
  vendasFiltradas.forEach(venda => {
    const tr = document.createElement('tr');

    const tdNomeCliente = document.createElement('td');
    tdNomeCliente.textContent = venda.nomeCliente;
    tr.appendChild(tdNomeCliente);

    const tdFormaPagamento = document.createElement('td');
    tdFormaPagamento.textContent = venda.formaPagamento;
    tr.appendChild(tdFormaPagamento);

    const tdQuantidadeParcelas = document.createElement('td');
    tdQuantidadeParcelas.textContent = venda.quantidadeParcelas;
    tr.appendChild(tdQuantidadeParcelas);

    const tdMesInicio = document.createElement('td');
    tdMesInicio.textContent = venda.mesInicio;
    tr.appendChild(tdMesInicio);

    const valorParcela = venda.valorTotal / venda.quantidadeParcelas;
    const tdValorParcela = document.createElement('td');
    tdValorParcela.textContent = valorParcela.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    tr.appendChild(tdValorParcela);

    const tdValorTotal = document.createElement('td');
    tdValorTotal.textContent = venda.valorTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    tr.appendChild(tdValorTotal);

    const valorDevido = venda.quantidadeParcelas * valorParcela;
    const mesesPassados = (new Date() - new Date(venda.mesInicio + '-01')) / (1000 * 60 * 60 * 24 * 30.5);
    const parcelasPagas = Math.floor(mesesPassados);
    const valorPago = parcelasPagas * valorParcela;
    const tdValorDevido = document.createElement('td');
    tdValorDevido.textContent = (valorDevido - valorPago).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    tr.appendChild(tdValorDevido);

    tabelaVendasBody.appendChild(tr);
  });
}

// Atualiza a tabela de vendas com as vendas já cadastradas
atualizarTabelaVendas();

// Adiciona um listener para o evento "submit" do formulário de vendas
form.addEventListener('submit', event => {
  event.preventDefault();

  const nomeCliente = nomeClienteInput.value;
  const formaPagamento = formaPagamentoSelect.value;
  const quantidadeParcelas = parseInt(quantidadeParcelasInput.value);
  const mesInicio = mesInicioInput.value;
  const valorTotal = parseFloat(prompt('Digite o valor total da venda:'));
  
  // Adiciona a nova venda ao array de vendas e atualiza o localStorage
  const novaVenda = {
  nomeCliente,
  formaPagamento,
  quantidadeParcelas,
  mesInicio,
  valorTotal,
  };
  vendas.push(novaVenda);
  localStorage.setItem('vendas', JSON.stringify(vendas));
  
  // Atualiza a tabela de vendas com a nova venda
  atualizarTabelaVendas();
  
  // Limpa os campos do formulário de vendas
  nomeClienteInput.value = '';
  formaPagamentoSelect.value = '';
  quantidadeParcelasInput.value = '';
  mesInicioInput.value = '';
  });
  
  // Adiciona um listener para o evento "input" do filtro de meses
  mesFiltroInput.addEventListener('input', atualizarTabelaVendas);
