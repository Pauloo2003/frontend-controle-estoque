import {ref, watch, computed} from '@vue/composition-api'
import store from '@/store'
import {formatDateBr} from '@core/utils/filter'
import UnidadeMedidaService from "@/services/cadastros/unidade-medida.service";
// Notification
import {useToast} from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useUnidadeMedidaList(nameModule) {
    // Use toast
    const toast = useToast()
    const unidadeMedidaService = new UnidadeMedidaService();
    const refUnidadeMedidaListTable = ref(null)

    // Table Handlers
    const tableColumns = [
        { key: 'id', label: 'Codigo', sortable: true },
        { key: 'descricao', label: 'Descricao', sortable: true },
        { key: 'actions' , label: 'Ações',},
    ]

    const perPage = ref(10)
    const totalUnidadeMedida = ref(0)
    const currentPage = ref(1)
    const perPageOptions = [10, 25, 50, 100]
    const searchQuery = ref('')
    const sortBy = ref('id')
    const isSortDirDesc = ref(true)
    const statusFilter = ref(null)

    const dataMeta = computed(() => {
        const localItemsCount = refUnidadeMedidaListTable.value ? refUnidadeMedidaListTable.value.localItems.length : 0
        return {
            from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
            to: perPage.value * (currentPage.value - 1) + localItemsCount,
            of: totalUnidadeMedida.value,
        }
    })

    const refetchData = () => {
        refUnidadeMedidaListTable.value.refresh()
    }

    watch([currentPage, perPage, searchQuery, statusFilter], () => {
        refetchData()
    })

    const fetchUnidadeMedida = (ctx, callback) => {
        unidadeMedidaService.index({
            q: searchQuery.value,
            perPage: perPage.value,
            page: currentPage.value,
            sortBy: sortBy.value,
            sortDesc: isSortDirDesc.value,
            fullObject: true,
        }).then(response => {
            const {data, total} = response
            console.log(data)
            callback(data)
            perPage.value = response.perPage
            currentPage.value = response.page
            totalUnidadeMedida.value = total
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
        await unidadeMedidaService.store(body)
        refetchData()
    }
    const Updated = async (body) => {
        await unidadeMedidaService.update(body)
        refetchData()
    }

    const removerData = async (id) => {
        await unidadeMedidaService.destroy(id)
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
        fetchUnidadeMedida,
        tableColumns,
        perPage,
        currentPage,
        totalUnidadeMedida,
        dataMeta,
        perPageOptions,
        searchQuery,
        sortBy,
        isSortDirDesc,
        refUnidadeMedidaListTable,

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
