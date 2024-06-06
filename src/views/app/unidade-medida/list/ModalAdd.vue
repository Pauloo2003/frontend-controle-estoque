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
        descricao: '',
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
        descricao: '',
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
                label="Descrição"
                label-for="descricao"
            >
              <validation-provider
                  #default="{ errors }"
                  name="Descrição"
                  rules="required"
              >
                <b-form-input
                    v-model="dataForm.descricao"
                    id="descricao"
                    :state="errors.length > 0 ? false : null"
                    placeholder="Digite a descricao"
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
