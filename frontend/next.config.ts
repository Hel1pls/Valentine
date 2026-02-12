const nextConfig = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	webpack(config: any) {
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
