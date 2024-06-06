<script>
import {ValidationProvider, ValidationObserver} from 'vee-validate'
import {BModal, BButton, BAlert, BRow, BCol, BFormGroup, BFormCheckbox,AlertPlugin} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { required, email } from '@validations'
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
        bar_code: '',
        purchase_price: '',
        description: '',
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
  methods: {
    async validateForm() {
      this.$emit('ok', this.dataForm)
      this.$bvModal.hide(this.idModal)
      this.dataForm = {
        bar_code: '',
        purchase_price: '',
        sale_price: '',
        description: '',
        stock: '',
      }
    },
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
                label-for="bar_code"
            >
              <validation-provider
                  #default="{ errors }"
                  name="Descrição"
                  rules="required"
              >
                <b-form-input
                    v-model="dataForm.bar_code"
                    id="bar_code"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Digite a ação"
                    :disabled="dataForm.isDefault"
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
                label="Preço de Compra"
                label-for="PreçoCompra"
            >
              <validation-provider
                  #default="{ errors }"
                  name="Preço de Compra"
                  rules="required"
              >
                <b-form-input
                    v-model="dataForm.purchase_price"
                    id="PreçoCompra"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Digite o Preço de Compra"
                    :disabled="dataForm.isDefault"
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
                label="Preço"
                label-for="Preço"
            >
              <validation-provider
                  #default="{ errors }"
                  name="Preço"
                  rules="required"
              >
                <b-form-input
                    v-model="dataForm.sale_price"
                    id="Preço"
                    :state="errors.length > 0 ? false:null"
                    placeholder="Digite o Preço"
                    :disabled="dataForm.isDefault"
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
                label="Descrição"
                label-for="description"
            >
              <validation-provider
                  #default="{ errors }"
                  name="description"
                  rules="required"
              >
                <b-form-input
                    v-model="dataForm.description"
                    id="description"
                    :state="errors.length > 0 ? false : null"
                    :disabled="dataForm.isDefault"
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
                label="Estoque"
                label-for="stock"
            >
              <validation-provider
                  #default="{ errors }"
                  name="stock"
                  rules="required"
              >
                <b-form-input
                    v-model="dataForm.stock"
                    id="stock"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                    :disabled="dataForm.isDefault"
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
