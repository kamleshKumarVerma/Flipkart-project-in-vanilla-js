import Product from './components/product.js';

class Main {
	constructor() {
		this.product = new Product();
	}

	compareProduct(numberOfProducts) {
		this.product.compareProduct(numberOfProducts);
	}
}

var main = new Main();

document.getElementById("compare2Product").addEventListener("click", function(){
	main.compareProduct(2);
});

document.getElementById("compare3Product").addEventListener("click", function(){
	main.compareProduct(3);
});

document.getElementById("compare4Product").addEventListener("click", function(){
	main.compareProduct(4);
});
