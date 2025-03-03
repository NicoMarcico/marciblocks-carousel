import { __ } from "@wordpress/i18n";
import { BlockControls, MediaUpload } from "@wordpress/block-editor";
import { ToolbarGroup, ToolbarItem, Button } from "@wordpress/components";

export default function Toolbar(props) {
	const { imagesIds, onSelectImages } = props;

	return (
		<BlockControls>
			<ToolbarGroup>
				{imagesIds && ( // If images are set, display media modal via change button
					<MediaUpload
						onSelect={onSelectImages} // Function that sets inner images blocks
						allowedTypes={["image"]}
						multiple="add"
						value={imagesIds}
						render={({ open }) => (
							<ToolbarItem>
								{({ isDisabled }) => (
									<Button
										onClick={open}
										isDisabled={isDisabled}
										icon="edit"
										label={__("Edit images", "marciblocks-carousel")}
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
