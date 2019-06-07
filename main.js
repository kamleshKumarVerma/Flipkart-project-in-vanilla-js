import getProductsDetail from "./services/get-products-detail.js";
import formatProductData from "./components/format-product-data.js";
import renderProducts from "./components/render-products.js"

class Main {
	constructor() {
		this.formatProductData = new formatProductData();
		this.renderProducts = new renderProducts();
		this.productList = {};
		this.currentProductsId = [];
		this.getProducts();

		document.querySelector(".compare-product").addEventListener("change",  (event) => {
			this.renderProductListContainer(parseInt(event.target.value));
		});
	}

	renderProductListContainer(numberOfProducts) {
		this.currentProductsId = Object.keys(this.productList).slice(0,numberOfProducts);

		let container = document.querySelector(".container");
		container.innerHTML = "";
		let width = Math.round(100/numberOfProducts);

		for (var i = 0; i < this.currentProductsId.length; i++) {
			let div = document.createElement("div");
			div.setAttribute("id", this.currentProductsId[i]);
			div.style.width = `${width}%`;
			div.classList.add("product-list");
			container.appendChild(div);
		}

		let list = this.currentProductsId.map(productId => this.productList[productId] );
		this.renderProducts.renderList(list, this.onRemoveCallBack.bind(this));
	}

	onRemoveCallBack(productId) {
		document.getElementById(productId).appendChild(this.addSelectDropdown(productId));
	}

	addSelectDropdown(productId) {
		this.currentProductsId = this.currentProductsId.filter( id => id !== productId);
		let selectElement = document.createElement("select");
		selectElement.onchange = (event) => {
			event.target.parentNode.innerHTML = this.renderProducts.renderProduct(this.productList[event.target.value]);
		}
		let list = Object.keys(this.productList);
		list = list.filter(id => this.currentProductsId.indexOf(id) === -1);
		selectElement.innerHTML = `${list.map((key) => {
	       return `<option value="${key}"> ${this.productList[key].titles.title} </option>`           
	   	}).join("")}`;
		return selectElement;
	}

	getProducts() {
		getProductsDetail.getProducts()
			.then((response) => {
				this.productList = this.formatProductData.formatData(response);
				console.log("final formatted product list", this.productList);
				this.renderProductListContainer(2);
			});
	}

}

let main = new Main();