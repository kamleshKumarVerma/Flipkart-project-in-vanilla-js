const getProductsDetail = {
	getProducts: () => {
		return fetch(`https://flipkart-mock-product.now.sh/`)
			.then(res=> {
				document.querySelector(".loading").remove();
				document.querySelector(".display-none").style.display = "block";
				return res.json();
			});
	}
}

export default getProductsDetail;