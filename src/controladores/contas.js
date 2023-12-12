let { id, banco, contas, saques, depositos, transferencias } = require('../banco_de_dados/banco_de_dados')
const listarContas = (req, res) => {
    try {
        const numeroDeContas = contas.length
        if (numeroDeContas === 0) {
            return res.status(204).json('Requisição bem sucedida, sem conteúdo no corpo da resposta.');
        }
        res.status(200).json(contas);
    } catch (erro) {
        res.status(500).json('Erro inesperado do servidor');
    }
};

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    id++
    const conta = {
        id,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
        }
    }
    contas.push(conta);
    return res.status(201).json(contas)
};

const atualizarConta = (req, res) => {
    try {
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
        const { numeroConta } = req.params;

        const conta = contas.find((conta) => {
            return conta.id === Number(numeroConta);
        });

        if (!conta) {
            return res.status(404).json({ mensagem: 'O usuário não existe.' });
        }

        if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
            return res.status(400).json({ mensagem: 'É necessario alguma alteração' });
        }

        if (nome) {
            conta.usuario.nome = nome;
        }

        if (cpf) {
            conta.usuario.cpf = cpf;
        }

        if (data_nascimento) {
            conta.usuario.data_nascimento = data_nascimento;
        }

        if (telefone) {
            conta.usuario.telefone = telefone;
        }

        if (email) {
            conta.usuario.email = email;
        }

        if (senha) {
            conta.usuario.senha = senha;
        }

        return res.status(200).json({ mensagem: 'Conta atualizada com sucesso' });
    }
    catch (error) {
        return res.status(500).json('Erro inesperado do servidor');
    }
};

const deletarConta = (req,res) =>{
    const { numeroConta } = req.params;
    const conta = contas.find((conta) => {
        return conta.id === Number(numeroConta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'O usuário não existe.' });
    }
    
    contas = contas.filter((instrutor)=>{
        return instrutor.id !== Number(numeroConta);
    });
    
    return res.status(204).json({ mensagem: 'Conta deletada com sucesso' });
}; 

const consultarSaldo =(req,res)=>{
    const { numero_conta, senha } = req.query;
    const conta = contas.find((conta) => {
        return conta.id === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'O usuário não existe.' });
    }
    
    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'Informe o número da conta.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'Informe a senha.' });
    }    
    const senhaCorreta = conta.usuario.senha;
    
    if(senhaCorreta != senha){
        return res.status(403).json({ mensagem: 'Senha incorreta' })
    }

    return res.status(200).json({ mensagem: `{ saldo: ${conta.saldo} }` });
};

const extrato = (req,res) => {
    const { numero_conta, senha } = req.query;
    
    const conta = contas.find((conta) => {
        return conta.id === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'O usuário não existe.' });
    }
    
    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'Informe o número da conta.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'Informe a senha.' });
    }    
    const senhaCorreta = conta.usuario.senha;
    
    if(senhaCorreta != senha){
        return res.status(403).json({ mensagem: 'Senha incorreta' })
    }
    
    const depositosDaConta = depositos.filter((depositos) => {
        return depositos.numero_conta == numero_conta;
    });

    const saquesDaConta = saques.filter((saques) => {
        return saques.numero_conta == numero_conta;
    });

    const transferenciasEnviadas = transferencias.filter((transaferencia) => {
        return transaferencia.numero_conta_origem == numero_conta;
    });
    const transferenciasRecebidas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino == numero_conta;
    });
    
    const extratoindividual = {
        depositosDaConta,
        saquesDaConta,
        transferenciasEnviadas,
        transferenciasRecebidas
    }

    return res.status(200).json(extratoindividual);
}

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    deletarConta,
    consultarSaldo,
    extrato
};
