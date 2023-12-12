const { format,addHours } = require('date-fns');
let { id, banco, contas, saques, depositos, transferencias } = require('../banco_de_dados/banco_de_dados')

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    const conta = contas.find((conta) => {
        return conta.id === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'O usuário não existe.' });
    }

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'Informe o número da conta.' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'Informe o valor a ser depositado.' });
    }

    if (valor == 0 || valor < 0) {
        return res.status(400).json({ mensagem: 'Valor informado de forma incorreta, informe um valor válido' });
    }

    const valorDeDeposito = Number(valor);
    
    conta.saldo = conta.saldo += valorDeDeposito;

    const data = new Date();
    const fuso = 'America/Sao_Paulo';

    const dataDeposito = addHours(data, -3);

    const formatoPadrao = 'YYYY-MM-DD HH:mm:ss';
    const dataDeDepositoFormatada = format(dataDeposito, formatoPadrao);

    const registroDeDeposito = {
        data: dataDeDepositoFormatada,
        numero_conta: numero_conta.toString(),
        valor: valorDeDeposito,
    };

    depositos.push(registroDeDeposito);

    return res.status(201).json({ mensagem: 'Deposito realizado com sucesso' });
};

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    
    const conta = contas.find((conta) => {
        return conta.id === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'O usuário não existe.' });
    }

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'Informe o número da conta.' });
    }

    if(senha != conta.usuario.senha){
        return res.status(403).json({ mensagem: 'Senha incorreta' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'Informe o valor a ser retirado.' });
    }

    const valorDeSaque = Number(valor);

    if (valorDeSaque <= conta.saldo) {
        conta.saldo = conta.saldo -= valorDeSaque;
    } else {
        return res.status(403).json({ mensagem: 'Valor informado excede o valor em conta' });
    }
    
    const data = new Date();
    const fuso = 'America/Sao_Paulo';

    const dataSaque = addHours(data, -3);

    const formatoPadrao = 'YYYY-MM-DD HH:mm:ss';
    const dataDeSaqueFormatada = format(dataSaque, formatoPadrao);

    const registroDeSaque = {
        data: dataDeSaqueFormatada,
        numero_conta: numero_conta.toString(),  
        valor: valorDeSaque,
    };

    saques.push(registroDeSaque);

    return res.status(201).json({ mensagem: 'Saque realizado com sucesso' });
};

const transferir =(req,res) =>{
    const { numero_conta_origem, numero_conta_destino,valor, senha } = req.body;
    
    const contaOrigem = contas.find((contaOrigem) => {
        return contaOrigem.id === Number(numero_conta_origem);
    });

    const contaDestino = contas.find((contaDestino) => {
        return contaDestino.id === Number(numero_conta_destino);
    });
    
    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'O usuário não existe.' });
    }
    
    if (!contaDestino) {
        return res.status(404).json({ mensagem: 'O usuário não existe.' });
    }

    if(senha != contaOrigem.usuario.senha){
        return res.status(403).json({ mensagem: 'Senha incorreta' });
    }

    if (numero_conta_origem == numero_conta_destino){
        return res.status(400).json({ mensagem: 'A conta de origem não pode ser a mesma que a conta de destino' });
    }
    
    if (!numero_conta_origem) {
        return res.status(400).json({ mensagem: 'Informe o número da conta de origem.' });
    }

    if (!numero_conta_destino) {
        return res.status(400).json({ mensagem: 'Informe o número da conta de destino.' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'Informe o valor a ser retirado.' });
    }
    
    const valorDeTransferencia = Number(valor);

    if (valorDeTransferencia <= contaOrigem.saldo) {
        contaOrigem.saldo = contaOrigem.saldo -= valorDeTransferencia;
        contaDestino.saldo = contaDestino.saldo += valorDeTransferencia;
    } else {
        return res.status(403).json({ mensagem: 'Valor informado excede o valor em conta' });
    }

    const data = new Date();
    const fuso = 'America/Sao_Paulo';

    const dataTransferencia = addHours(data, -3);

    const formatoPadrao = 'YYYY-MM-DD HH:mm:ss';
    const dataDeTransferenciaFormatada = format(dataTransferencia, formatoPadrao);

    const registroDeTransferencia = {
        data: dataDeTransferenciaFormatada,
        numero_conta_origem: numero_conta_origem.toString(),
        numero_conta_destino: numero_conta_destino.toString(),
        valor: valorDeTransferencia,
    };

    transferencias.push(registroDeTransferencia);
    return res.status(201).json({ mensagem: 'Transferencia realizada com sucesso' });
    
};

module.exports = {
    depositar,
    sacar,
    transferir
}
