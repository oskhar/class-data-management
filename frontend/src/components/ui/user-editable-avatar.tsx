import * as React from 'react';
import { ImageIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { getFileBase64 } from '~/features/mahasiswa/api/update-mahasiswa-avatar';
import { toast } from 'sonner';
import { Button } from './button';
import { cn } from '~/utils/shadcn';

export type UserEditableAvatarProps = {
	imageSrc: string;
	alt: string;
	onSubmit: (uploadedImage: string | null) => void;
	className: string;
};

export function UserEditableAvatar(props: UserEditableAvatarProps) {
	const { imageSrc, onSubmit, className, alt } = props;

	const id = React.useId();
	const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
	const [isEditing, setIsEditing] = React.useState(false);

	async function handleUploadedImage(file: File | null) {
		if (!file) {
			setUploadedImage(null);
			toast.error('Tidak ada gambar yang dipilih!');
			return;
		}

		const isSupported = file.type === 'image/png' || file.type === 'image/jpeg';

		if (!isSupported) {
			toast.error('File yang anda upload tidak disupport!');
			return;
		}

		if (file.size > 500_000) {
			toast.error('Size gambar harus kurang dari 500kb');
			return;
		}

		const base64Str = await getFileBase64(file);
		setUploadedImage(base64Str);
	}

	async function handleUpdateAvatar() {
		try {
			await onSubmit(uploadedImage);
		} catch (error) {
			console.log(error);
			setUploadedImage(null);
		} finally {
			setIsEditing(false);
		}
	}

	return (
		<div className="flex flex-col items-center w-full">
			<div className={cn('relative', className)}>
				<label
					htmlFor={id}
					onClick={() => setIsEditing(true)}
					className="absolute inset-0 z-10 flex items-center justify-center gap-3 p-2 duration-300 rounded-full opacity-0 cursor-pointer hover:backdrop-blur-sm hover:opacity-100 hover:bg-slate-100/30"
				>
					<ImageIcon className="w-6 h-6" />
					<span className="sr-only">Change Picture</span>
				</label>

				<Avatar className="w-full h-full">
					<AvatarImage
						src={
							imageSrc !== uploadedImage && typeof uploadedImage === 'string'
								? uploadedImage
								: imageSrc
						}
						alt={alt}
					/>
					<AvatarFallback>{alt}</AvatarFallback>
				</Avatar>

				<input
					multiple={false}
					onChange={e => handleUploadedImage(e.target.files?.[0] ?? null)}
					id={id}
					type="file"
					className="hidden"
				/>
			</div>

			{isEditing && (
				<div className="flex items-center gap-2 mt-2">
					<Button
						size="sm"
						type="button"
						variant="ghost"
						onClick={() => {
							setIsEditing(false);
							setUploadedImage(null);
						}}
					>
						Cancel
					</Button>
					<Button size="sm" type="button" onClick={handleUpdateAvatar}>
						Simpan
					</Button>
				</div>
			)}
		</div>
	);
}