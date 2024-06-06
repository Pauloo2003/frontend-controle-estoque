import axios from '@/libs/axios';
import {ErrorMessage} from "@/libs/Error";

export default class ProdutoClient {
    constructor() {
        this.api = axios;
        this.error = new ErrorMessage();
    }

    async getItems(queries= {}) {
        try {
            const { data } = await this.api.get('/produtos');
            return data;
        } catch (error) {
            throw this.error.message(error, 'Erro ao listar as Produto');
        }
    }

    async index(queries= {}) {
        try {
            return await this.api.get('/produtos/findAll', { params: queries });
        } catch (error) {
            throw this.error.message(error, 'Erro ao listar as Produto');
        }
    }

    async store(data) {
        try {
            const { data: response } = await this.api.post('/produtos/create', data);
            return response;
        } catch (error) {
            throw this.error.message(error, 'Erro ao criar as Produto');
        }
    }

    async show(id) {
        try {
            const { data } = await this.api.get(`/produtos/findOne/${id}`);
            return data;
        } catch (error) {
            throw this.error.message(error, 'Erro ao buscar a Produto');
        }
    }

    async update(data) {
        try {
            const { data: response } = await this.api.put(`/produtos/update`, data);
            return response;
        } catch (error) {
            throw this.error.message(error, 'Erro ao atualizar a Produto');
        }
    }

    async destroy(id) {
        try {
            const { data: response } = await this.api.delete(`/produtos/delete/${id}`);
            return response;
        } catch (error) {
            throw this.error.message(error, 'Erro ao deletar a Produto');
        }
    }
}
