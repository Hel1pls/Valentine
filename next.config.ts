import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		turbo: {
			loaders: {
				'\\.mp3$': 'file',
			},
		},
	},
	webpack(config) {
		// Add asset handling for audio files for Webpack builds
		config.module.rules.push({
			test: /\.(mp3|wav|ogg)$/i,
			type: 'asset/resource',
			generator: {
				filename: 'static/media/[name].[hash][ext]',
			},
		})
		return config
	},
}

export default nextConfig
