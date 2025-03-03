import { __ } from "@wordpress/i18n";
import { InspectorControls, PanelColorSettings } from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	SelectControl,
} from "@wordpress/components";

export default function Inspector(props) {
	const {
		imageFit,
		isCaption,
		isDescription,
		isRadius,
		radius,
		aspectRatio,
		highlightColor,
		backgroundColor,
		captionColor,
		descriptionColor,
		setAttributes,
	} = props;

	return (
		<InspectorControls>
			<PanelBody // Section for image fit
				title={__("Image adjustment", "marciblocks-carousel")}
			>
				<SelectControl
					label={__("Type of adjustment", "marciblocks-carousel")}
					value={imageFit}
					options={[
						{
							label: __("None", "marciblocks-carousel"),
							value: "none",
						},
						{
							label: __("Cover", "marciblocks-carousel"),
							value: "cover",
						},
						{
							label: __("Contain", "marciblocks-carousel"),
							value: "contain",
						},
						{
							label: __("Fill", "marciblocks-carousel"),
							value: "fill",
						},
					]}
					onChange={(imageFit) => setAttributes({ imageFit })}
				/>

				<SelectControl
					label={__("Display ratio", "marciblocks-carousel")}
					value={aspectRatio}
					options={[
						{
							label: "21/9",
							value: "21/9",
						},
						{
							label: "16/9",
							value: "16/9",
						},
						{
							label: "4/3",
							value: "4/3",
						},
						{
							label: "1/1",
							value: "1/1",
						},
						{
							label: "9/16",
							value: "9/16",
						},
					]}
					onChange={(aspectRatio) => setAttributes({ aspectRatio })}
				/>
			</PanelBody>

			<PanelBody // Section for border radius
				title={__("Border radius", "marciblocks-carousel")}
			>
				<ToggleControl // Set isRadius boolean, default to true
					label={__("Radius", "marciblocks-carousel")}
					checked={isRadius}
					onChange={() => setAttributes({ isRadius: !isRadius })}
				/>
				{isRadius && ( // If isRadius, we display radius range selection default to 14px
					<RangeControl
						value={radius}
						onChange={(radius) => setAttributes({ radius })}
						min={0}
						max={30}
						beforeIcon="arrow-down"
						afterIcon="arrow-up"
					/>
				)}
			</PanelBody>

			<PanelBody // Section for text display
				title={__("Texts", "marciblocks-carousel")}
			>
				<ToggleControl // Set isCaption boolean, default to false
					label={__("Caption", "marciblocks-carousel")}
					checked={isCaption}
					onChange={() => setAttributes({ isCaption: !isCaption })}
				/>
				<ToggleControl // Set isDescription boolean, default to false
					label={__("Description", "marciblocks-carousel")}
					checked={isDescription}
					onChange={() => setAttributes({ isDescription: !isDescription })}
				/>
			</PanelBody>

			<PanelColorSettings // Section for highlight color of selected tab
				title={__("Colors", "marciblocks-carousel")}
				colorSettings={[
					{
						value: highlightColor,
						onChange: (highlightColor) => setAttributes({ highlightColor }),
						label: __("Highlight color", "marciblocks-carousel"),
					},
					{
						value: backgroundColor,
						onChange: (backgroundColor) => setAttributes({ backgroundColor }),
						label: __("Background color", "marciblocks-carousel"),
					},
					isCaption && {
						value: captionColor,
						onChange: (captionColor) => setAttributes({ captionColor }),
						label: __("Caption color", "marciblocks-carousel"),
					},
					isDescription && {
						value: descriptionColor,
						onChange: (descriptionColor) => setAttributes({ descriptionColor }),
						label: __("Description color", "marciblocks-carousel"),
					},
				]}
			/>
		</InspectorControls>
	);
}
