import Feature from './feature.js';
import ProductService from '../services/product-service.js';

export default class Product {
	constructor() {
		this.feature = new Feature();
		this.productService = new ProductService();
		this.productList = new Array();
		this.comparedProductList = new Array();
		this.getProductsAndFeatures();
	}

	stopLoading() {
		var mainContainer = document.querySelector(".main-container");
		var loadingDiv = document.querySelector(".loading");
		mainContainer.style.display = "block";
		loadingDiv.style.display = "none";
	}

	loadShowDiffOnly() {
		let element = document.getElementById("show-differences");
		element.addEventListener("change", (event)=> {
			if(event.target.checked) {
				this.findProductDiff();
			}
		})
	}

	getProductsAndFeatures() {
		this.productService.getProducts().then((responseData)=> {
			this.stopLoading();
			this.loadShowDiffOnly();
			this.setProducts(responseData.products);
			this.feature.setFeature(responseData.products.featuresList);
		});
	};

	findProductDiff() {
		var diffObj = {};
		this.comparedProductList.forEach((product)=>{
			console.log("testing ", product.feature);
			for(let key in product.feature) {
				if(diffObj.hasOwnProperty(key)) {
					console.log("coming 1", diffObj[key]);
					console.log("coming 2", product.feature[key]);
					diffObj[key] = diffObj[key] !== product.feature[key] ? true: false;
				} else {
					diffObj[key] = product.feature[key];
				}
				
				console.log(`checking ${key} , ${product.feature[key]}`);
			}
		});
		console.log("diffObj ", diffObj);
	}

	setProducts(responseData) {

		for(let subkey in responseData["compareSummary"]["images"]) {
			this.productList.push({id: subkey}); /* just setting up the id for products */
		}

		this.productList = this.productList.map((product)=>{
			product["images"] = responseData["compareSummary"]["images"][product.id];
			product["subtitle"] = responseData["compareSummary"]["titles"][product.id].subtitle;
			product["title"] = responseData["compareSummary"]["titles"][product.id].title;
			product["finalPrice"] = responseData["compareSummary"]["productPricingSummary"][product.id].finalPrice;
			product["price"] = responseData["compareSummary"]["productPricingSummary"][product.id].price;
			product["totalDiscount"] = responseData["compareSummary"]["productPricingSummary"][product.id].totalDiscount;
			product["feature"] = {};
			return product;
		});

		responseData["featuresList"].forEach((data)=> {
			data.features.forEach((feature)=> {
				for(let nestedKey in feature.values) {
					this.productList = this.productList.map((product)=> {
						if(product.id === nestedKey) {
							let featureName = feature["featureName"].split(' ')[0];
							product.feature[featureName] = feature.values[nestedKey];
						}
						return product;
					});					
				}
			});
		});

		/* initially comparing two products */
		this.compareProduct(2) 
	}

	compareProduct(numberOfProducts) {
		this.comparedProductList = this.productList.slice(0,numberOfProducts);
		document.getElementById("item-selected").innerHTML = this.comparedProductList.length;

		var productListDOM = document.querySelector("#product-list");
		var renderDOM = "";
		for (var i = 0; i < numberOfProducts; i++) {
			renderDOM = renderDOM + `
				<div class="col-xs-${numberOfProducts === 2? '4' : numberOfProducts === 3 ? '3' : '2'}">
					${ this.renderProduct(this.comparedProductList[i]) }
				</div>
			`;
		}
		productListDOM.innerHTML = renderDOM;

		this.closeProduct();

	}

	closeProduct() {
		document.querySelectorAll('.close').forEach((closeDOMelement) => {
            closeDOMelement.addEventListener('click', () => {

            	this.comparedProductList = this.comparedProductList.filter((element)=>{
                	return element.id !== closeDOMelement.getAttribute("id");
                });

                console.log("this is the comparedProductList ", this.comparedProductList);

                var productArea  = document.getElementById(`product_area_${closeDOMelement.getAttribute("id")}`);
                productArea.innerHTML = `
                	<div> 
                		<label>Add a product </label>
                		<select class="select-product" placeholder="Choose a Product">
                			${this.generateOption()}
                		</select>
                	</div>
                `;
                document.getElementById("item-selected").innerHTML = this.comparedProductList.length;
                this.selectProduct(`product_area_${closeDOMelement.getAttribute("id")}`);
            });
        });
	}

	selectProduct(DOM_Id) {
		document.querySelectorAll('.select-product').forEach((selectDOMelement) => {
            selectDOMelement.addEventListener('change', () => {
            	console.log("event ", selectDOMelement.value);
	        	let product = this.productList.find((data)=> {
	        		return data.id === selectDOMelement.value;
	        	});
	        	var productArea  = document.getElementById(DOM_Id);
	        	productArea.innerHTML = this.renderProduct(product);
	        	this.comparedProductList.push(product);
	        	document.getElementById("item-selected").innerHTML = this.comparedProductList.length;
	        	this.closeProduct();
            });
        });
	}

	generateOption(element) {
		var temp = this.productList.filter(obj => {
			if(this.comparedProductList.indexOf(obj) === -1) {
				return true;
			}
		});
		let option = "";
		temp.forEach( (product) => {
			option += `<option value="${product.id}"> ${product.title} </option>`;
		})
		return option;
	}

	renderProduct(product) {
		return `<div class="box-area" id="product_area_${product.id}">
					<div class="product-item">
						<div>
							<div class="close" id="${product.id}">X</div>
							<img src="${product.images}" class="img-responsive product-image"/>
							<p class="text-wrap"> ${product.title} </p>
							<label> ${product.finalPrice} </label>
						</div>
					</div>

					<div class="hide-label"> 
						<h4 class="desc-title text-wrap"> 
							<label>temp</label> 
						</h4> 
					</div>

					<h5 class="text-wrap Size"> ${product.feature.Size} </h5>
					<h5 class="text-wrap Screen"> ${product.feature.Screen} </h5>
					<h5 class="text-wrap HD"> ${product.feature.HD} </h5>
					<h5 class="text-wrap 3D"> ${product.feature['3D']} </h5>

					<div class="hide-label"> 
						<h4 class="desc-title text-wrap"> 
							<label>temp</label> 
						</h4> 
					</div>
					<h5 class="text-wrap Smart"> ${product.feature.Smart} </h5>
					<h5 class="text-wrap Curve"> ${product.feature.Curve} </h5>
					<h5 class="text-wrap Touchscreen"> ${product.feature.Touchscreen} </h5>
					<h5 class="text-wrap Motion"> ${product.feature.Motion} </h5>
					<h5 class="text-wrap Launch"> ${product.feature.Launch} </h5>

					<div class="hide-label"> 
						<h4 class="desc-title text-wrap"> 
							<label>temp</label> 
						</h4> 
					</div>
					<h5 class="text-wrap Built"> ${product.feature.Built} </h5>
					<h5 class="text-wrap 3G"> ${product.feature['3G']} </h5>
					<h5 class="text-wrap Ethernet"> ${product.feature.Ethernet} </h5>
					<h5 class="text-wrap Wireless"> ${product.feature.Wireless} </h5>	
				</div>`;
	}

}
