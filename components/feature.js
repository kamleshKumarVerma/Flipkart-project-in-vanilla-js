export default class Feature {
	constructor() {
		this.featureList = new Array();
	}

	setFeature(featuresList) {
		featuresList.forEach((data)=> {
			let featureObj = {};
			let newKey = data["title"];
			featureObj[newKey] = [];
			data.features.forEach((feature)=> {
				featureObj[newKey].push(feature.featureName);
			});
			this.featureList.push(featureObj);
		});
		this.renderDescSection();
	}


	renderDescSection() {
		var descSection = document.querySelector(".desc-section");
		descSection.innerHTML = `
			<div>
				${this.featureList.map(this.renderDescTitle).join('')}
			</div>
		`;
	}

	renderDescTitle(element) {
		for(var key in element) {
			return `
				<div> 
					<h4 class="desc-title text-wrap"> 
						<label> ${key} </label> 
					</h4> 
				</div>
				${element[key].map(renderDescSubtitle).join('')}
			`;
		}

		function renderDescSubtitle(element) {
			return `<h5 class="text-wrap"> ${element} </h5>`;
		}
	}
}
