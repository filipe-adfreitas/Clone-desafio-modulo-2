const { id, banco, contas, saques, depositos, transferencias } = require('../banco_de_dados/banco_de_dados');
const senhaDoBanco = banco.senha;

const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query;
    if (!senha_banco) {
        return res.status(400).send({ mensagem: 'O servidor não entendeu a requisição pois está com uma sintaxe/formato inválido' });
    }

    if (senha_banco !== senhaDoBanco) {
        return res.status(401).send({ mensagem: 'O usuário não está autenticado (logado)' });
    }

    next();
};

module.exports = {
    validarSenha
};

