class formatProductData {
	constructor() {
		this.products = {};
	}

	formatData(response) {
		this.formatCompareSummary(response.products.compareSummary, this.products);
		this.formatFeaturesList(response.products.featuresList, this.products);
		return this.products;
	}

	formatCompareSummary(compareSummary, products) {
		for(var key in compareSummary) {
			for(var subkey in compareSummary[key]) {
				if(!products.hasOwnProperty(subkey)) {
					products[subkey] = {};
				}
				products[subkey][key] = compareSummary[key][subkey];
			}
		}
	}

	formatFeaturesList(featuresList, products) {
		featuresList.forEach((list) => {
			list.features.forEach((feature) => {
				for(var key in feature.values) {
					if(!products[key].hasOwnProperty("featuresList")) {
						products[key]["featuresList"] = {};
					}
					if(products[key]["featuresList"][list.title] === undefined) {
						products[key]["featuresList"][list.title] = [];
					}
					products[key]["featuresList"][list.title].push({[feature.featureName]: feature.values[key]});
				}
			});
		});
	}



}

export default formatProductData;