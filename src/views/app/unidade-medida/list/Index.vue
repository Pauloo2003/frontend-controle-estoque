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
                  placeholder="Pesquisar pela descricao"
              />
              <b-button
                  variant="primary"
                  v-b-modal.modal-add-UnidadeMedida
                  @click="resetFormData"
              >
                <div class="d-flex" style="gap: 5px">
                  <iconfy icon="mdi:plus"/>
                  <span class="">UnidadeMedida</span>
                </div>
              </b-button>
            </div>
          </b-col>
        </b-row>

      </div>

      <b-table
          ref="refUnidadeMedidaListTable"
          class="position-relative"
          :items="fetchUnidadeMedida"
          responsive
          :fields="tableColumns"
          primary-key="id"
          :sort-by.sync="sortBy"
          show-empty
          empty-text="No matching records found"
          :sort-desc.sync="isSortDirDesc"
      >

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

            <b-button
                variant="gradient-danger"
                class="btn-icon"
                @click="openModalDeleteCustomField(data.item)"
            >
              <feather-icon icon="TrashIcon"/>
            </b-button>
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
                :total-rows="totalUnidadeMedida"
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
        idModal="modal-add-UnidadeMedida"
        titleModal="Criar UnidadeMedida"
        :labelBtnOk="'Adicionar'"
        v-model="dataUnidadeMedida"
        @ok="create($event)"
        @hidden="resetFormData()"
    />
    <ModalAtt
        idModal="modal-att-UnidadeMedida"
        titleModal="Atualizar UnidadeMedida"
        :labelBtnOk="'Atualizar'"
        v-model="dataUnidadeMedida"
        @ok="Updated($event)"
        @cancel="resetFormData()"
    />

    <modal-confirmation
        v-model="isDeleteModal"
        id-modal="modal-delete-UnidadeMedida"
        title="Deletar UnidadeMedida"
        btn-cancel-label="Cancelar"
        btn-ok-label="Sim, deletar"
        @ok="handleRemover(deletedCustomField.id)"
        @cancel="resetFormData()"
    >
      <template #message>
        <div>
          <p>Tem certeza que deseja deletar essa UnidadeMedida?</p>
        </div>
      </template>
    </modal-confirmation>


  </div>
</template>

<script>
import { ref} from '@vue/composition-api'
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
import ModalAdd from "./ModalAdd.vue";
import ModalAtt from "./ModalAtt.vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    ModalAdd,
    ModalAtt,
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
        id: null,
        action: '',
        subject: '',
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
          text: 'UnidadeMedida deletado com sucesso',
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
      this.dataUnidadeMedida = data
      this.$bvModal.show('modal-att-cadastros')
    },
    resetFormData() {
      console.log('resetFormData')
      this.deletedCustomField = {
        id: null,
        descricao: '',
      }
      this.dataUnidadeMedida = {
        id: null,
        descricao: '',
      }
      this.isDeleteModal = false
    },

  },
  setup() {
    const customFields = ref([])
    const dataUnidadeMedida = ref({
      id: '',
      descricao: '',
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
      totalUnidadeMedida,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      tableColumns,
      refUnidadeMedidaListTable,
      fetchUnidadeMedida,
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
      currentTab,
      dataUnidadeMedida,
      typeOptionsCustomFields,
      customFields,
      resolveTypeFieldText,
      resolveTypeFieldIcon,
      resolveItemStatusVariant,
      resolverDefaultValues,
      perPage,
      currentPage,
      totalUnidadeMedida,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      fetchUnidadeMedida,
      tableColumns,
      refUnidadeMedidaListTable,
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
