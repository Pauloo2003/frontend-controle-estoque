<script>
import {ValidationProvider, ValidationObserver} from 'vee-validate'
import {BModal, BButton, BAlert, BRow, BCol, BFormGroup, BFormCheckbox,AlertPlugin} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { required, email } from '@core/utils/validations/validations'
import axios from "@/libs/axios";

export default {
  components: {
    BModal,
    BButton,
    BAlert,
    vSelect,
    BRow,
    BCol,
    BFormGroup,
    BFormCheckbox,
    ValidationProvider,
    ValidationObserver
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        condicaopagamentoid: '',
        condicaopagamentodescricao: '',
      }),
      require: true
    },
    titleModal: {
      type: String,
      default: null,
      require: false
    },
    idModal: {
      type: String,
      default: null,
      require: false
    },
    labelBtnOk: {
      type: String,
      default: null,
      require: false
    },
  },
  computed: {
    dataForm: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
  },
  data() {
    return {
      dataFromApiPortadorId: '',
    }
  },
  mounted() {
    this.fetchDataFromPortador()
  },
  methods: {
    async fetchDataFromPortador() {
      try {
        const response = await axios.get('/portador');
        this.dataFromApiPortadorId = response.data.data;
      } catch (error) {
        console.error('Erro ao chamar a API:', error);
      }
    },
    async validateForm() {
        this.$emit('ok', this.dataForm)
        this.$bvModal.hide(this.idModal)
      }
    },
}
</script>

<template>
  <b-modal
      no-close-on-backdrop
      no-close-on-esc
      size="md"
      :id="idModal"
      :title="titleModal"
      :ok-disabled="dataForm.isDefault || dataForm.condicaopagamentodescricao === ''"
      :ok-title="labelBtnOk"
      ok-variant="success"
      cancel-variant="secondary"
      body-bg-variant="light"
      cancel-title="Cancelar"
      @ok="validateForm"
      @cancel="$emit('cancel')"
      @close="$emit('cancel')"
  >
    <validation-observer ref="refFormData">
      <b-form @submit.prevent>
        <b-row>
          <b-col
              cols="12"
              class="mb-1"
          >
            <b-form-group
                label="Codigo"
                label-for="condicaopagamentoid"
            >
              <validation-provider
                  #default="{ errors }"
                  name="Descrição"
                  rules="required"
              >
                <b-form-input
                    v-model="dataForm.condicaopagamentoid"
                    id="condicaopagamentoid"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Digite o id"
                    disabled
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col
              cols="12"
              class="mb-1"
          >
            <b-form-group
                label="Descrição *"
                label-for="condicaopagamentodescricao"
            >
              <validation-provider
                  #default="{ errors }"
                  name="Descrição"
                  rules="required"
              >
                <b-form-input
                    v-model="dataForm.condicaopagamentodescricao"
                    id="condicaopagamentodescricao"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Digite a descrição"
                    disabled
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col
              cols="12"
              class="mb-1"
          >
            <b-form-group
                label="Observações"
                label-for="condicaopagamentoobservacao"
            >
              <validation-provider
                  #default="{ errors }"
                  name="Descrição"
                  rules="required"
              >
                <b-form-textarea
                    v-model="dataForm.condicaopagamentoobservacao"
                    id="condicaopagamentoobservacao"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Digite a descrição"
                    disabled
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col
              cols="12"
              class="mb-1"
          >
            <b-form-group
                label="Prazo Medio"
                label-for="condicaopagamentoprazomedio"
            >
              <validation-provider
                  #default="{ errors }"
                  name="Descrição"
                  rules="required"
              >
                <b-form-input
                    v-model="dataForm.condicaopagamentoprazomedio"
                    id="condicaopagamentoprazomedio"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Digite a descrição"
                    disabled
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col
              cols="12"
              class="mb-1"
          >
            <b-form-group
                label="Portador"
                label-for="portadorid"
            >
              <validation-provider
                  #default="{ errors }"
                  name="Descrição"
                  rules="required"
              >
                <b-form-select
                    v-model="dataForm.portadorid"
                    id="portadorid"
                    :state="errors.length > 0 ? false:null"
                    :options="dataFromApiPortadorId"
                    value-field="portadorid"
                    text-field="portadornome"
                    placeholder="Digite o id"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </b-modal>
</template>
