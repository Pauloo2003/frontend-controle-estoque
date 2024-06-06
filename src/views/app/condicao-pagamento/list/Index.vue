<template>

  <div>
    <b-card
        no-body
        class="mb-0"
    >
      <div class="m-2">
        <!-- Table Top -->
        <b-row>
          <!-- Per Page -->
          <b-col
              cols="12"
              md="6"
              class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Show</label>
            <v-select
                v-model="perPage"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="perPageOptions"
                :clearable="false"
                class="per-page-selector d-inline-block mx-50"
            />
            <label>entries</label>
          </b-col>

          <b-col
              cols="12"
              md="6"
          >
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                  v-model="searchQuery"
                  class="d-inline-block mr-1"
                  placeholder="Pesquisar..."
              />
<!--              <b-button-->
<!--                  variant="primary"-->
<!--                  v-b-modal.modal-add-condicao-pagamento-->
<!--                  @click="resetFormData"-->
<!--              >-->
<!--                <div class="d-flex" style="gap: 5px">-->
<!--                  <iconfy icon="mdi:plus"/>-->
<!--                  <span class="">Condicao Pagamento</span>-->
<!--                </div>-->
<!--              </b-button>-->
            </div>
          </b-col>
        </b-row>

      </div>

      <b-table
          ref="refCondicaoPagamentoListTable"
          class="position-relative"
          :items="fetchCondicaoPagamento"
          responsive
          :fields="tableColumns"
          primary-key="id"
          :sort-by.sync="sortBy"
          show-empty
          empty-text="No matching records found"
          :sort-desc.sync="isSortDirDesc"
      >

        <template #cell(familia_comercial)="data">
          <span>{{ data.item.familia_comercial.condicaopagamentodescricao }}</span>
        </template>

        <template #cell(familia_comercial)="data">
          <span>{{ data.item.familia_comercial.condicaopagamentodescricao}}</span>
        </template>

        <template #cell(familia_material)="data">
          <span>{{ data.item.familia_material.familia_material_descricao}}</span>
        </template>

        <template #cell(item_situacao)="data">
          <b-badge
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              :variant="resolveItemStatusVariant(data.item.item_situacao)"
              class="text-primary"
          >
            {{ data.item.item_situacao }}
          </b-badge>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <div>
            <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="gradient-primary"
                class="btn-icon mr-1"
                @click="openEditModal(data.item)"
            >
              <feather-icon icon="EyeIcon"/>
            </b-button>

<!--            <b-button-->
<!--                variant="gradient-danger"-->
<!--                class="btn-icon"-->
<!--                @click="openModalDeleteCustomField(data.item)"-->
<!--            >-->
<!--              <feather-icon icon="TrashIcon"/>-->
<!--            </b-button>-->
          </div>

        </template>

      </b-table>
      <div class="mx-2 mb-2">
        <b-row>
          <b-col
              cols="12"
              sm="6"
              class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <span class="text-muted">Showing {{ dataMeta.from }} to {{ dataMeta.to }} of {{
                dataMeta.of
              }} entries</span>
          </b-col>
          <!-- Pagination -->
          <b-col
              cols="12"
              sm="6"
              class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >
            <b-pagination
                v-model="currentPage"
                :total-rows="totalCondicaoPagamento"
                :per-page="perPage"
                first-number
                last-number
                class="mb-0 mt-1 mt-sm-0"
                prev-class="prev-item"
                next-class="next-item"
            >
              <template #prev-text>
                <feather-icon
                    icon="ChevronLeftIcon"
                    size="18"
                />
              </template>
              <template #next-text>
                <feather-icon
                    icon="ChevronRightIcon"
                    size="18"
                />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>

    <ModalAdd
        idModal="modal-add-condicao-pagamento"
        titleModal="Atualizar Condição Pagamento"
        labelBtnOk="Atualizar"
        v-model="dataCondicaoPagamento"
        @ok="Updated($event)"
        @cancel="resetFormData()"
    />

    <modal-confirmation
        v-model="isDeleteModal"
        id-modal="modal-delete-condicao-pagamento"
        title="Deletar Condicao Pagamento"
        btn-cancel-label="Cancelar"
        btn-ok-label="Sim, deletar"
        @ok="handleRemover(deletedCustomField.condicaopagamentoid)"
        @cancel="resetFormData()"
    >
      <template #message>
        <div>
          <p>Tem certeza que deseja deletar essa Condicao Pagamento?</p>
        </div>
      </template>
    </modal-confirmation>


  </div>
</template>

<script>
import {onMounted, ref} from '@vue/composition-api'
import {
  BButton,
  BCard,
  BCardBody,
  BCardImg,
  BCardSubTitle,
  BCardText,
  BCardTitle,
  BCol,
  BRow,
  BListGroup,
  BListGroupItem,
  BTable,
  VBToggle,
  VBModal,
  BMedia,
  BLink,
  BAvatar,
  VBTooltip
} from 'bootstrap-vue'
import {avatarText} from '@core/utils/filter'
import useList from './useList'
import ModalConfirmation from "@/components/ModalConfirmation.vue";
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import ModalAdd from "@/views/app/condicao-pagamento/list/ModalAdd.vue";

import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    ModalAdd,
    BAvatar,
    BLink,
    BMedia,
    ModalConfirmation,
    BButton,
    BCard,
    BCardBody,
    BCardImg,
    BCardSubTitle,
    BCardText,
    BCardTitle,
    BCol,
    BRow,
    AppCollapse,
    AppCollapseItem,
    BListGroup,
    BListGroupItem,
    BTable
  },
  directives: {
    'b-toggle': VBToggle,
    'b-modal': VBModal,
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      isDeleteModal: false,
      deletedCustomField: {
        condicaopagamentoid: null,
        condicaopagamentodescricao: '',
        familia_comercial_un: '',
      },
    }
  },
  methods: {
    handleRemover(id) {
      this.removerData(id)
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Sucesso',
          text: 'Condicao Pagamento deletado com sucesso',
          icon: 'CheckIcon',
          variant: 'success',
        },
      })
      this.isDeleteModal = false
    },
    openModalDeleteCustomField(data) {
      this.deletedCustomField = data
      this.isDeleteModal = true
    },
    openEditModal(data) {
      this.dataCondicaoPagamento = data
      this.$bvModal.show('modal-add-condicao-pagamento')
    },
    resetFormData() {
      this.deletedCustomField = {
        condicaopagamentoid: null,
        condicaopagamentodescricao: '',
      }
      this.dataCondicaoPagamento = {
        condicaopagamentoid: null,
        condicaopagamentodescricao: '',
      }
      this.isDeleteModal = false
    },

  },
  setup() {
    const sLSitemExService = new SLSitemExService()
    const customFields = ref([])
    const dataCondicaoPagamento = ref({
      condicaopagamentoid: null,
      condicaopagamentodescricao: '',
    })
    // 'VARCHAR', 'INTEGER', 'TIMESTAMP', 'BOOLEAN', 'DATETIME', 'DATE', 'ENUM_OPTIONS', 'TEXT'
    const typeOptionsCustomFields = ref([
      {label: 'Texto', value: 'VARCHAR'},
      {label: 'Númerico', value: 'INTEGER'},
      {label: 'Monetário', value: 'DECIMAL'},
      {label: 'Data', value: 'DATE'},
      {label: 'Data e hora', value: 'DATETIME'},
      {label: 'Texto Longo', value: 'TEXT'},
    ])
    const currentTab = ref(0)
    const spanderAll = ref(false)
    const refCollapeseCamposPadrao = ref(null)
    const refCollapeseCamposPersonalizados = ref(null)

    const listarCustomFields = async () => {
      customFields.value = await sLSitemExService.index()
    }

    onMounted(async () => {
      await listarCustomFields()
    })
    const toggleCollapseALl = () => {
      spanderAll.value = !spanderAll.value
      console.log(refCollapeseCamposPadrao.value)
    }
    const headerCustomFields = [
      {key: 'id', label: ''},
      {key: 'label', label: 'Nome'},
      {key: 'quality_rules', label: 'Regras de qualidade'},
      {key: 'actions', label: 'Ações'},
    ]
    const customFieldsOptions = [
      {
        id: '1',
        label: 'Nome',
        type: 'text',
      },
      {
        id: '1',
        label: 'Nome',
        type: 'text',
      },
      {
        id: '1',
        label: 'Nome',
        type: 'text',
      },
      {
        id: '1',
        label: 'Nome',
        type: 'text',
      }
    ]

    const planOptions = [
      {label: 'Basic', value: 'basic'},
      {label: 'Company', value: 'company'},
      {label: 'Enterprise', value: 'enterprise'},
      {label: 'Team', value: 'team'},
    ]

    const statusOptions = [
      {label: 'Pending', value: 'pending'},
      {label: 'Active', value: 'active'},
      {label: 'Inactive', value: 'inactive'},
    ]

    const {
      perPage,
      currentPage,
      totalCondicaoPagamento,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      tableColumns,
      refCondicaoPagamentoListTable,
      fetchCondicaoPagamento,
      resolveTypeFieldText,
      resolveTypeFieldIcon,
      resolveItemStatusVariant,
      resolverDefaultValues,
      create,
      Updated,
      removerData,
    } = useList()

    return {
      // Filter
      avatarText,
      planOptions,
      statusOptions,

      headerCustomFields,
      customFieldsOptions,
      spanderAll,
      refCollapeseCamposPadrao,
      refCollapeseCamposPersonalizados,
      toggleCollapseALl,
      currentTab,
      dataCondicaoPagamento,
      typeOptionsCustomFields,
      listarCustomFields,
      customFields,
      resolveTypeFieldText,
      resolveTypeFieldIcon,
      resolveItemStatusVariant,
      resolverDefaultValues,

      perPage,
      currentPage,
      totalCondicaoPagamento,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      fetchCondicaoPagamento,
      tableColumns,
      refCondicaoPagamentoListTable,
      create,
      Updated,
      removerData,
    }
  }
  ,
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.bg-header-collapse {
  background-color: #6c757d !important;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select';
</style>
