document.addEventListener("DOMContentLoaded", () => {
	document
		.querySelectorAll(".wp-block-marciblocks-carousel")
		.forEach((carousel) => {
			// Store selectors in variables
			const items = carousel.querySelectorAll(
				".marciblocks-carousel-items__item",
			);
			const tabs = carousel.querySelectorAll(".marciblocks-carousel-tabs__tab");
			const descriptions = carousel.querySelectorAll(
				".marciblocks-carousel-descs__desc",
			);
			const prevBtn = carousel.querySelector(
				".marciblocks-carousel-controls__control--prev",
			);
			const nextBtn = carousel.querySelector(
				".marciblocks-carousel-controls__control--next",
			);

			// Initial validation check
			if (!items.length || !tabs.length) {
				console.warn("Incomplet Carousel");
				return;
			}

			// Initial index set
			let activeIndex = 0;

			// src set on click method
			const newUpdateCarousel = (newIndex) => {
				const oldItem = items[activeIndex];
				const newItem = items[newIndex];
				const newImage = newItem.querySelector("img");
				const oldTab = tabs[activeIndex];
				const newTab = tabs[newIndex];
				// Modification ici : vérifier si descriptions existe avant d'accéder aux indices
				const oldDesc = descriptions?.length ? descriptions[activeIndex] : null;
				const newDesc = descriptions?.length ? descriptions[newIndex] : null;

				// Check if src is set...
				if (!newImage.src || newImage.src === window.location.href) {
					// ...If src is not set, set it from data-src attribute
					newImage.src = newImage.dataset.src;

					// Listen for the loading of the image
					// Throw error
					newImage.addEventListener(
						"error",
						() => {
							console.error("Image not found:", newImage.dataset.src);
						},
						{ once: true },
					);

					// Do items stuff when loaded
					newImage.addEventListener(
						"load",
						() => {
							switchActiveItem();
							// Modifier la condition d'appel
							if (descriptions?.length) {
								switchActiveDesc();
							}
						},
						{ once: true },
					);
				} else {
					// ...If src is already set, do items stuff directly
					switchActiveItem();
					// Modifier la condition d'appel
					if (descriptions?.length) {
						switchActiveDesc();
					}
				}

				/**
				 * Function that switches active state of old and new items
				 */
				function switchActiveItem() {
					oldItem.classList.remove("active");
					newItem.classList.add("active");
				}

				/**
				 * Function that switches active state of old and new descriptions
				 *
				 * This function is only called if descriptions are present
				 */
				function switchActiveDesc() {
					if (!oldDesc || !newDesc) return;

					oldDesc.classList.remove("active");
					oldDesc.setAttribute("aria-hidden", true);
					newDesc.classList.add("active");
					newDesc.setAttribute("aria-hidden", false);
				}

				// Tabs stuff
				oldTab.setAttribute("tabindex", "-1");
				oldTab.setAttribute("aria-selected", false);
				oldTab.classList.remove("active");

				newTab.removeAttribute("tabindex");
				newTab.setAttribute("aria-selected", true);
				newTab.classList.add("active");

				// Set new index as active one
				activeIndex = newIndex;
			};

			tabs.forEach((tab, index) => {
				tab.addEventListener("click", () => newUpdateCarousel(index));
			});

			prevBtn.addEventListener("click", () => {
				newUpdateCarousel((activeIndex - 1 + tabs.length) % tabs.length);
			});

			nextBtn.addEventListener("click", () => {
				newUpdateCarousel((activeIndex + 1) % tabs.length);
			});

			// Initializing the carousel with the first image
			newUpdateCarousel(activeIndex);
		});
});
