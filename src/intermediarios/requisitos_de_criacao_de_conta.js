const { id, banco, contas, saques, depositos, transferencias } = require('../banco_de_dados/banco_de_dados')

const validarCpf = (req, res, next) => {
    const { cpf } = req.body;
    if (cpf.length !== 11) {
        return res.status(400).json({ mensagem: 'O servidor não entendeu a requisição pois está com uma sintaxe/formato inválido' });
    }
    next();
};

const validarDados = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'O servidor não entendeu a requisição pois está com uma sintaxe/formato inválido' });
    }

    next();
};

const verificarCpfDuplicado = (req, res, next) => {
    const { cpf } = req.body;
    const cpfRepetido = contas.find((conta) => {
        return conta.usuario.cpf === cpf
    });

    if (cpfRepetido !== undefined) {
        return res.status(400).json({ mensagem: 'Cpf Duplicado' })
    }
    next();
};

const verificarEmailDuplicado =(req,res,next) =>{
    const { email } = req.body;
    const emailRepetido = contas.find((conta) => {
        return conta.usuario.email === email
    });

    if (emailRepetido !== undefined) {
        return res.status(400).json({ mensagem: 'Email Duplicado' })
    }
    next();
};

module.exports = {
    validarCpf,
    validarDados,
    verificarCpfDuplicado,
    verificarEmailDuplicado
};

