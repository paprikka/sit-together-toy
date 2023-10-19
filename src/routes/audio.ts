import { Howl, type HowlOptions, Howler } from 'howler';

export const initAudio = async () => {
	Howler.autoUnlock = true;

	const load = (id: string, options: HowlOptions): Promise<Howl> =>
		new Promise((resolve, reject) => {
			const sound = new Howl({
				...options,
				onload: () => {
					resolve(sound);
				},
				onloaderror: reject
			});

			allSounds.set(id, sound);
			return sound;
		});

	const allSounds = new Map<string, Howl>();

	const soundAssets = await Promise.all([
		load('bg', {
			src: '/sfx/bg.mp3',
			loop: true,
			volume: 0.4
		}),
		load('enter', {
			src: '/sfx/enter.mp3',
			volume: 0.4
		}),
		load('leave', {
			src: '/sfx/leave.mp3',
			volume: 0.4
		}),
		load('chirp', {
			src: '/sfx/chirp.mp3',
			volume: 0.4
		})
	]);

	const dispose = () => {
		soundAssets.forEach((_) => _.unload());
	};

	return {
		dispose,
		getSound: (id: string): Howl | undefined => {
			return allSounds.get(id);
		}
	};
};

export type Audio = Awaited<ReturnType<typeof initAudio>>;
