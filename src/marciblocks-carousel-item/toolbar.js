import { __ } from "@wordpress/i18n";
import { BlockControls, MediaUpload } from "@wordpress/block-editor";
import { ToolbarGroup, ToolbarItem, Button } from "@wordpress/components";

export default function Toolbar(props) {
	const { pictureId, onSelectImage } = props;

	return (
		<BlockControls>
			<ToolbarGroup>
				{pictureId && ( // If image is set, display media modal via change button
					<MediaUpload
						onSelect={onSelectImage} // Function which sets image attributes
						allowedTypes={["image"]}
						value={pictureId}
						render={({ open }) => (
							<ToolbarItem>
								{({ isDisabled }) => (
									<Button
										onClick={open}
										isDisabled={isDisabled}
										icon="edit"
										label={__("Edit image", "marciblocks-carousel")}
									/>
								)}
							</ToolbarItem>
						)}
					/>
				)}
			</ToolbarGroup>
		</BlockControls>
	);
}
