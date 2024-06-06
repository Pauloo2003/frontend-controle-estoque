import axios from '@/libs/axios';
import {ErrorMessage} from "@/libs/Error";

export default class UnidadeMedidaClient {
    constructor() {
        this.api = axios;
        this.error = new ErrorMessage();
    }

    async getItems(queries= {}) {
        try {
            const { data } = await this.api.get('/unidade-medida');
            return data;
        } catch (error) {
            throw this.error.message(error, 'Erro ao listar as Unidade Medida');
        }
    }

    async index(queries= {}) {
        try {
            return await this.api.get('/unidade-medida/findAll', { params: queries });
        } catch (error) {
            throw this.error.message(error, 'Erro ao listar as Unidade Medida');
        }
    }

    async store(data) {
        try {
            const { data: response } = await this.api.post('/unidade-medida/create', data);
            return response;
        } catch (error) {
            throw this.error.message(error, 'Erro ao criar as Unidade Medida');
        }
    }

    async show(id) {
        try {
            const { data } = await this.api.get(`/unidade-medida/findOne/${id}`);
            return data;
        } catch (error) {
            throw this.error.message(error, 'Erro ao buscar a Unidade Medida');
        }
    }

    async update(data) {
        try {
            const { data: response } = await this.api.put(`/unidade-medida/update`, data);
            return response;
        } catch (error) {
            throw this.error.message(error, 'Erro ao atualizar a Unidade Medida');
        }
    }

    async destroy(id) {
        try {
            const { data: response } = await this.api.delete(`/unidade-medida/delete/${id}`);
            return response;
        } catch (error) {
            throw this.error.message(error, 'Erro ao deletar a Unidade Medida');
        }
    }
}
