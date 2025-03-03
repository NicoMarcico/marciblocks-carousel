import { __ } from "@wordpress/i18n";
import {
	InnerBlocks,
	store as blockStore,
	MediaUpload,
	MediaUploadCheck,
} from "@wordpress/block-editor";
import { Fragment } from "@wordpress/element";
import { Placeholder, Button } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";

export default function Block(props) {
	const {
		imagesIds,
		images,
		imageFit,
		isCaption,
		isDescription,
		carouselNumber,
		isRadius,
		radius,
		aspectRatio,
		highlightColor,
		backgroundColor,
		captionColor,
		descriptionColor,
		setAttributes,
		onSelectImages,
		isSelected,
		clientId,
		blockProps,
	} = props;

	/**
	 * Retrieve and subscribe:
	 * - in-depth child selection status
	 * - meta of children
	 * - index of current carousel among carousels of current publication
	 *
	 * Only one call to the same store "core/block-editor"
	 */
	const { childrenSelectedStates, innerBlocks, carouselIndex } = useSelect(
		(select) => {
			if (!clientId) {
				return;
			}

			const store = select(blockStore);

			return {
				childrenSelectedStates: store
					.getClientIdsOfDescendants(clientId)
					.map((descendantId) => {
						return store.isBlockSelected(descendantId);
					}),
				innerBlocks: store.getBlock(clientId).innerBlocks,
				carouselIndex: store
					.getBlocks()
					.filter((block) => block.name === "marciblocks/carousel")
					.findIndex((block) => block.clientId === clientId),
			};
		},
		[clientId],
	);

	// Set carouselNumber on carouselCount change
	useEffect(() => {
		setAttributes({ carouselNumber: carouselIndex + 1 });
	}, [carouselIndex]);

	/**
	 * Set imagesIds with innerBlocks Ids
	 *
	 * Used for displaying updated carousel in front
	 *
	 * IMPORTANT: We initiate the function only when block or child are selected
	 * => avoid setAttributes modifying block state on (re)render (e.g. page update)
	 */
	const getIds = () => {
		if (isSelected || childrenSelectedStates.includes(true)) {
			setAttributes({
				imagesIds: innerBlocks.map(
					(innerBlock) => innerBlock.attributes.pictureId,
				),
			});
		}
	};

	/**
	 * For each innerBlock, fetch image data from core store
	 * Set images attribute
	 *
	 * Used for displaying updated carousel in editor
	 *
	 * IMPORTANT: We initiate the function only when block or child are selected
	 * => avoid setAttributes modifying block state on (re)render (e.g. page update)
	 */
	const getImages = async () => {
		if (isSelected || childrenSelectedStates.includes(true)) {
			try {
				// Returns array of promises
				const newImages = innerBlocks.map(async (newImage) => {
					if (!newImage.attributes?.pictureId) {
						return null;
					}

					const data = await apiFetch({
						path: `/wp/v2/media/${newImage.attributes.pictureId}`,
					});

					// Creation of image object
					// For urls we provide a fallback with the base one
					const filteredData = {
						id: data.id,
						title: data.title.rendered,
						alt: data.alt_text ?? "",
						caption: extractTextFromHtml(data.caption?.rendered) ?? "",
						description: extractTextFromHtml(data.description?.rendered) ?? "",
						urlFull:
							data.media_details.sizes.full?.source_url ??
							data.source_url ??
							"",
						urlLarge:
							data.media_details.sizes.large?.source_url ??
							data.source_url ??
							"",
						urlMedium:
							data.media_details.sizes.medium?.source_url ??
							data.source_url ??
							"",
					};
					return filteredData;
				});

				// Wait for all promises to resolve
				const results = await Promise.all(newImages);
				const validResults = results.filter((result) => result !== null);

				setAttributes({ images: validResults });
			} catch (error) {
				console.error("Carousel getImages() error: ", error);
			}
		}
	};

	// Trigger getImagesIds && getImages on innerBlocks change
	useEffect(() => {
		getIds();
		getImages();
	}, [innerBlocks]);

	/**
	 * Function that extracts text from HTML and removes newline characters
	 *
	 * @param {string} html
	 * @returns {string} textContent
	 */
	function extractTextFromHtml(html) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");
		let textContent = doc.body.textContent || "";
		// Remove newline characters
		textContent = textContent.trim().replace(/\n/g, "");
		return textContent;
	}

	return (
		<div {...blockProps}>
			{!imagesIds ||
				(!imagesIds.length ? ( // If no image, display media modal via set button
					<MediaUploadCheck>
						<MediaUpload
							title="Carousel d'images"
							allowedTypes={["image"]}
							multiple="add"
							value={imagesIds}
							onSelect={onSelectImages} // Function that sets inner images blocks
							render={({ open }) => (
								<Placeholder
									icon="images-alt"
									label={__("Carousel", "marciblocks-carousel")}
									instructions={__("Select images", "marciblocks-carousel")}
								>
									<Button onClick={open} variant="secondary" isLarge>
										{__("Select", "marciblocks-carousel")}
									</Button>
								</Placeholder>
							)}
						/>
					</MediaUploadCheck>
				) : (
					// images are set, we display inner blocks
					<Fragment>
						<div
							// Here we define styles variables defined in the inspector
							// in order to use them in editor.scss
							style={{
								"--carousel-custom-radius": isRadius ? radius + "px" : "none",
								"--carousel-custom-ratio": aspectRatio,
								"--carousel-custom-fit": imageFit,
								"--carousel-custom-background-color": backgroundColor,
								"--carousel-custom-highlight-color": highlightColor,
								"--carousel-custom-caption-color": captionColor,
								"--carousel-custom-description-color": descriptionColor,
							}}
						>
							<div className="marciblocks-carousel-main">
								<div className="marciblocks-carousel-items">
									<div className="marciblocks-carousel-items__item">
										<img src={images.length > 0 && images[0].urlLarge} alt="" />

										{isCaption && images[0].caption && (
											<h3 className="marciblocks-carousel-items__item__caption">
												{images[0].caption}
											</h3>
										)}
									</div>
								</div>

								<div className="marciblocks-carousel-controls">
									<button className="marciblocks-carousel-controls__control marciblocks-carousel-controls__control--prev">
										<span className="marciblocks-carousel-controls__control-arrow"></span>
									</button>
									<button className="marciblocks-carousel-controls__control marciblocks-carousel-controls__control--next">
										<span className="marciblocks-carousel-controls__control-arrow"></span>
									</button>
								</div>
							</div>

							{isDescription && images[0].description && (
								<div className="marciblocks-carousel-descs">
									<p className="marciblocks-carousel-descs__desc">
										{images[0].description}
									</p>
								</div>
							)}

							<InnerBlocks renderAppender={false} orientation="horizontal" />
						</div>
					</Fragment>
				))}
		</div>
	);
}
