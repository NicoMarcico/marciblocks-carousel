import { __ } from "@wordpress/i18n";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Placeholder, Button } from "@wordpress/components";

export default function Block(props) {
	const { attributes, onSelectImage, blockProps } = props;
	const { pictureId, pictureUrl, pictureAlt } = attributes;

	return (
		<div {...blockProps}>
			{!pictureId ? ( // If no picture, display media modal via set button
				<MediaUploadCheck>
					<MediaUpload
						onSelect={onSelectImage} // Function which sets image attributes
						allowedTypes={["image"]}
						value={pictureId}
						render={({ open }) => (
							<Placeholder
								icon="images-alt"
								label={__("Picture", "marciblocks-carousel")}
								instructions={__("Select image", "marciblocks-carousel")}
							>
								<Button
									variant="secondary"
									isLarge
									onClick={open}
									icon="upload"
								>
									{__("Import", "marciblocks-carousel")}
								</Button>
							</Placeholder>
						)}
					/>
				</MediaUploadCheck>
			) : (
				// Picture is set, we display it
				<img src={pictureUrl} alt={pictureAlt} />
			)}
		</div>
	);
}
