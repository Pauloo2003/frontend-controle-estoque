import ProdutoClient from "@/api/cadastros/produto.client";


import {ErrorMessage} from "@/libs/Error";

export default class ProdutosService {
    constructor() {
        this.client = new ProdutoClient();
        this.error = new ErrorMessage();
    }

    async index(queries) {
        try {
            const { data } = await this.client.index(queries);
            return data;
        } catch (error) {
            this.error.message(error, 'Erro ao listar os items')
        }
    }

    async store(data) {
        try {
            const { data: response } = await this.client.store(data);
            return response;
        } catch (error) {
            this.error.message(error, 'Erro ao criar Produto')
        }
    }

    async show(id) {
        try {
            const { data } = await this.client.show(id);
            return data;
        } catch (error) {
            this.error.message(error, 'Erro ao buscar Produto')
        }
    }

    async update(data) {
        try {
            const { data: response } = await this.client.update(data);
            return response;
        } catch (error) {
            this.error.message(error, 'Erro ao atualizar Produto')
        }
    }

    async destroy(id) {
        try {
            const { data: response } = await this.client.destroy(id);
            return response;
        } catch (error) {
            this.error.message(error, 'Erro ao deletar Produto')
        }
    }
}
