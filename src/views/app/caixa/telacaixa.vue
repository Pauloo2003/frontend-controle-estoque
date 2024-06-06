<template>
  <div>
    <b-card class="mb-0">
      <b-row cols="12">
        <b-col class="12">
          <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand>CHECKOUT - Supermercado PAULOGOAT</b-navbar-brand>
          </b-navbar>
        </b-col>
      </b-row>
    </b-card>
    <b-card>
      <b-row cols="12">
        <b-col cols="8" class="mt-3 bg-dark">
          <b-list-group>
            <b-list-group-item v-for="item in cart" :key="item.id">
              <div class="d-flex justify-content-between">
                <span>{{ item.name }} - {{ item.price | currency }}</span>
                <span>x{{ item.quantity }}</span>
              </div>
            </b-list-group-item>
          </b-list-group>
          <h3 class="total mt-3 mb-0">
            Total: {{ calculateTotal() | currency }}
          </h3>
        </b-col>
        <b-col cols="4" class="d-flex align-content-end mt-3 bg-info">
          <b-form-input
              class="scanner-input mb-0"
              type="text"
              placeholder="Escaneie o código de barras aqui"
              @keyup.enter="addProduct"
              autofocus
          ></b-form-input>
        </b-col>
      </b-row>
    </b-card>
  </div>




</template>


<script>
export default {
  data() {
    return {
      cart: [
        { id: '123', name: 'Maçã Gala', price: 0.30, quantity: 3 },
        { id: '124', name: 'Pão Francês', price: 0.50, quantity: 10 }
      ],
      products: [
        { id: '123', name: 'Maçã Gala', price: 0.30 },
        { id: '124', name: 'Pão Francês', price: 0.50 },
        { id: '125', name: 'Leite Integral 1L', price: 1.20 },
        { id: '126', name: 'Ovos Dúzia', price: 2.50 },
        { id: '127', name: 'Queijo Minas 500g', price: 5.00 }
      ]
    };
  },
  methods: {
    addProduct(event) {
      const barcode = event.target.value;
      const product = this.products.find(p => p.id === barcode);
      if (product) {
        const cartItem = this.cart.find(item => item.id === product.id);
        if (cartItem) {
          cartItem.quantity += 1;
        } else {
          this.cart.push({ ...product, quantity: 1 });
        }
      } else {
        alert("Produto não encontrado!");
      }
      event.target.value = ''; // Clear input after adding
    },
    calculateTotal() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }
  },
  filters: {
    currency(value) {
      return `$${value.toFixed(2)}`;
    }
  }
}
</script>

<style scoped>

</style>

