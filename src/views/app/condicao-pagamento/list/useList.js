import {ref, watch, computed} from '@vue/composition-api'
import store from '@/store'
import {formatDateBr} from '@core/utils/filter'
import FormapagamentoService from "@/services/cadastros/formapagamento.service";
// Notification
import {useToast} from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useUsersList(nameModule) {
    // Use toast
    const toast = useToast()
    const sLSCondicaoPagamentoService = new FormapagamentoService();
    const refCondicaoPagamentoListTable = ref(null)

    // Table Handlers
    const tableColumns = [
        {key: 'condicaopagamentoid', label: 'Codigo', sortable: false},
        {key: 'condicaopagamentodescricao', label: 'Descrição', sortable: true},
        {key: 'condicaopagamentoprazomedio', label: 'Prazo Medio', sortable: true},
        {key: 'portador.portadornome', label: 'Portador', sortable: true},
        {key: 'condicaopagamentodescricao', label: 'Modalidade', sortable: true},
        {key: 'actions', label: 'Ações', sortable: false},
    ]
    const perPage = ref(10)
    const totalCondicaoPagamento = ref(0)
    const currentPage = ref(1)
    const perPageOptions = [10, 25, 50, 100]
    const searchQuery = ref('')
    const sortBy = ref('condicaopagamentoid')
    const isSortDirDesc = ref(false)
    const statusFilter = ref(null)

    const dataMeta = computed(() => {
        const localItemsCount = refCondicaoPagamentoListTable.value ? refCondicaoPagamentoListTable.value.localItems.length : 0
        return {
            from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
            to: perPage.value * (currentPage.value - 1) + localItemsCount,
            of: totalCondicaoPagamento.value,
        }
    })

    const refetchData = () => {
        refCondicaoPagamentoListTable.value.refresh()
    }

    watch([currentPage, perPage, searchQuery, statusFilter], () => {
        refetchData()
    })

    const fetchCondicaoPagamento = (ctx, callback) => {
        sLSCondicaoPagamentoService.index({
            q: searchQuery.value,
            perPage: perPage.value,
            page: currentPage.value,
            sortBy: sortBy.value,
            sortDesc: isSortDirDesc.value,
            fullObject: true,
        }).then(response => {
            const {data, total} = response
            callback(data)
            perPage.value = response.perPage
            currentPage.value = response.page
            totalCondicaoPagamento.value = total
        })
            .catch(error => {
                toast({
                    component: ToastificationContent,
                    props: {
                        title: 'Error fetching users list',
                        icon: 'AlertTriangleIcon',
                        variant: 'danger',
                    },
                })
            })
    }

    const create = async (body) => {
            await sLSCondicaoPagamentoService.store(body)
        refetchData()
    }
    const Updated = async (body) => {
            await sLSCondicaoPagamentoService.update(body.condicaopagamentoid, body)
        refetchData()
    }

    const removerData = async (id) => {
        await sLSCondicaoPagamentoService.destroy(id)
        refetchData()
    }

    const resolveTypeFieldText = type => {
        if (type === 'VARCHAR') return 'Texto'
        if (type === 'BOOLEAN') return 'Verdadeiro/Falso'
        if (type === 'DATE') return 'Data'
        if (type === 'DATETIME') return 'Data e Hora'
        if (type === 'DECIMAL') return 'Monetário'
        if (type === 'TEXT') return 'Texto Longo'
        if (type === 'INTEGER' || type === 'INT') return 'Númerico'
        return 'Sem Tipo'
    }
    const resolveTypeFieldIcon = type => {
        if (type === 'VARCHAR') return 'tabler:abc'
        if (type === 'BOOLEAN') return 'Verdadeiro/Falso'
        if (type === 'DATE') return 'system-uicons:calendar-date'
        if (type === 'DATETIME') return 'formkit:datetime'
        if (type === 'TEXT') return 'mdi:text-long'
        if (type === 'DECIMAL') return 'tabler:decimal'
        if (type === 'DECIMAL' || type === 'INTEGER' || type === 'INT') return 'tabler:123'
        return 'nonicons:type-16'
    }

    const resolveItemStatusVariant = status => {
        if (status === 'PENDING') return 'light-warning'
        if (status === 'ATIVO') return 'light-success'
        if (status === 'INATIVO') return 'light-danger'
        return 'primary'
    }

    return {
        fetchCondicaoPagamento,
        tableColumns,
        perPage,
        currentPage,
        totalCondicaoPagamento,
        dataMeta,
        perPageOptions,
        searchQuery,
        sortBy,
        isSortDirDesc,
        refCondicaoPagamentoListTable,

        resolveTypeFieldText,
        resolveTypeFieldIcon,
        resolveItemStatusVariant,
        refetchData,
        create,
        Updated,

        // Extra Filters
        statusFilter,
        removerData,
    }
}
