<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
        <vuexy-logo />

        <h2 class="brand-text text-primary ml-1">
          Vuexy
        </h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col
          lg="8"
          class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
              fluid
              :src="imgUrl"
              alt="Forgot password V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Forgot password-->
      <b-col
          lg="4"
          class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
            sm="8"
            md="6"
            lg="12"
            class="px-xl-2 mx-auto"
        >
          <b-card-title
              title-tag="h2"
              class="font-weight-bold mb-1"
          >
            Verificar
            seu e-mail ✉️
          </b-card-title>
          <b-card-text class="mb-2">
            As instruções para a redefinição de senha foram enviadas para seu e-mail
          </b-card-text>
          <div class="col d-flex justify-content-center">
            <b-button
                @click="voltar()"
                variant="primary"
            >Voltar e fazer login</b-button>
          </div>
          <b-card-text class="text-center mt-2">
            <span> Não recebeu o e-mail? </span>
            <b-link @click="reenviarEmail()">
              Reenviar
            </b-link>
          </b-card-text>
        </b-col>
      </b-col>
      <!-- /Forgot password-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
  BRow, BCol, BLink, BCardTitle, BCardText, BImg, BForm, BFormGroup, BFormInput, BButton,
} from 'bootstrap-vue'
import { required, email } from '@validations'
import { useApi } from '@/composables/useApi'
import store from '@/store/index'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import Notifier from "@/libs/Notifier";
const notify = new Notifier()
const apiBack = useApi()
export default {
  components: {
    VuexyLogo,
    BRow,
    BCol,
    BLink,
    BImg,
    BForm,
    BButton,
    BFormGroup,
    BFormInput,
    BCardTitle,
    BCardText,
  },
  data() {
    return {
      userEmail: '',
      sideImg: require('@/assets/images/pages/forgot-password-v2.svg'),
      // validation
      required,
      email,
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/forgot-password-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
   async reenviarEmail() {
   const email =  localStorage.getItem('verifyEmail')
    await apiBack.post(`/seguranca/esqueciSenha`, {
      usuario_email: email
    })
        .then(() => {
          notify.success('Email enviado com sucesso!')
        })
        .catch(error => {
          console.log('error', error)
        })
    },
    async voltar(){
       localStorage.removeItem('verifyEmail')
       this.$router.push({ name: 'login' })
    }
    },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
