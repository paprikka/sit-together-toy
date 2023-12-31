import type { FeatureToggles } from '$lib/feature-toggles';
import { Howl, Howler, type HowlOptions } from 'howler';

export const initAudio = async (featureToggles: FeatureToggles) => {
	Howler.autoUnlock = true;
	Howler.volume(featureToggles.volume);

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
		}),
		load('gong', {
			src: '/sfx/gong.mp3',
			volume: 0.2
		}),
		...Array(5)
			.fill(null)
			.map((_, ind) =>
				load(`key_${ind + 1}`, {
					src: `/sfx/key_${ind + 1}.mp3`,
					volume: 0.4
				})
			)
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
