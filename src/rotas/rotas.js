const express = require('express');
const rotas = express();
const { id, banco, contas, saques, depositos, transferencias } = require('../banco_de_dados/banco_de_dados');
const { listarContas, criarConta,atualizarConta,deletarConta,consultarSaldo,extrato } = require('../controladores/contas');
const{ depositar,sacar,transferir } = require('../controladores/transacoes')
const { validarSenha } = require('../intermediarios/validador_de_senha');
const { validarDados, validarCpf,verificarCpfDuplicado, verificarEmailDuplicado} = require('../intermediarios/requisitos_de_criacao_de_conta');

rotas.get('/contas', validarSenha, listarContas);
rotas.post('/contas', validarCpf, verificarCpfDuplicado,verificarEmailDuplicado,validarDados,criarConta);
rotas.put('/contas/:numeroConta/usuario',verificarCpfDuplicado,verificarEmailDuplicado,atualizarConta);  
rotas.delete('/contas/:numeroConta',deletarConta);
rotas.post('/transacoes/depositar',depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir',transferir);
rotas.get('/contas/saldo',consultarSaldo);
rotas.get('/contas/extrato',extrato);

module.exports = rotas; 
