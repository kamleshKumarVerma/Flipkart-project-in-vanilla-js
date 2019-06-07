class renderProducts {
	constructor() {
		this.container = document.querySelector(".container");

		this.container.addEventListener("click", (event) => {
			if(event.target.className === "close") {
				var id = event.target.parentNode.parentNode.getAttribute("id");
				event.target.parentNode.parentNode.innerHTML = "";
				this.onRemoveCallBack(id);
				event.target.parentNode.remove();
			}
		});
	}

	renderList(productList, onRemoveCallBack) {
		this.onRemoveCallBack = onRemoveCallBack;
		for (var i = 0; i < this.container.childNodes.length; i++) {
			this.container.childNodes[i].innerHTML = this.renderProduct(productList[i]);
		}
	}

	renderProduct(product) {
		return `
			<div>
				<div class="close"> X </div>
				<img class="img-responsive" src="${product.images}"/>
				<div>
					<label class="text-wrap"> ${product.titles.title} </label>
				</div>
				<div class="price">
					<span class="main-price"> Rs. ${product.productPricingSummary.price} </span>
					<span class="final-price"> Rs. ${product.productPricingSummary.finalPrice} </span>
					<span class="total-discount"> ${product.productPricingSummary.totalDiscount} % off </span>
				</div>
				<hr>
				${Object.keys(product.featuresList).map((key) => {
						return `
							<div class="section">
								${key}
							</div>
							${product.featuresList[key].map((feature) => {
								for(let featureName in feature) {
									return `
										<div class="sub-section"> 
											<div> ${featureName} </div>
											<div> ${feature[featureName]} </div>
										</div>
									`;
								}
							}).join("")}
						`;
				}).join("")}
			</div>
		`;
	}


}

export default renderProducts;