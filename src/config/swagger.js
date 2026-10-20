const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Loja Pet API',
      version: '1.0.0',
      description:
        'API Express para cadastro de produtos de pet shop. A autenticação usa `access_token` no login e cookie de sessão (`connect.sid`).',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Login, sessão e perfil' },
      { name: 'Produtos', description: 'CRUD e exportação CSV' },
      { name: 'Util', description: 'Health check e debug' },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
          description: 'Cookie de sessão criado após POST /api/login',
        },
      },
      schemas: {
        Produto: {
          type: 'object',
          required: ['id', 'nome', 'categoria', 'preco'],
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Ração Golden 15kg' },
            categoria: {
              type: 'string',
              enum: [
                'alimentação',
                'acessório',
                'higiene',
                'saúde e farmácia',
                'brinquedos',
              ],
              example: 'alimentação',
            },
            preco: { type: 'number', exclusiveMinimum: 0, example: 189.9 },
          },
        },
        ProdutoInput: {
          type: 'object',
          required: ['nome', 'categoria', 'preco'],
          properties: {
            nome: { type: 'string', example: 'Coleira ajustável M' },
            categoria: {
              type: 'string',
              enum: [
                'alimentação',
                'acessório',
                'higiene',
                'saúde e farmácia',
                'brinquedos',
              ],
              example: 'acessório',
            },
            preco: { type: 'number', exclusiveMinimum: 0, example: 39.9 },
          },
        },
        Erro: {
          type: 'object',
          required: ['erro'],
          properties: {
            erro: { type: 'string' },
          },
        },
        Mensagem: {
          type: 'object',
          properties: {
            mensagem: { type: 'string', example: 'sessão iniciada com sucesso' },
          },
        },
      },
      responses: {
        TokenInvalido: {
          description: 'Token inválido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Erro' },
              example: { erro: 'access_token inválido' },
            },
          },
        },
        NaoAutenticado: {
          description: 'Sem sessão',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Erro' },
              example: { erro: 'Faça login para continuar' },
            },
          },
        },
        FalhaLogout: {
          description: 'Falha ao destruir a sessão',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Erro' },
              example: { erro: 'erro ao encerrar sessão' },
            },
          },
        },
        ProdutoInvalido: {
          description: 'Dados inválidos para criação',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Erro' },
              example: { erro: 'Produto inválido' },
            },
          },
        },
        DadosInvalidos: {
          description: 'Dados inválidos para atualização',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Erro' },
              example: { erro: 'dados inválidos' },
            },
          },
        },
        ProdutoNaoEncontrado: {
          description: 'Produto não encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Erro' },
              example: { erro: 'Produto não encontrado' },
            },
          },
        },
      },
      parameters: {
        ProdutoId: {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' },
          description: 'Identificador do produto',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const spec = swaggerJsdoc(options);

module.exports = spec;
