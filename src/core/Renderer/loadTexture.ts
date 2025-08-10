export function loadTexture(
	gl: WebGLRenderingContext,
	src: string,
	pixel: boolean = false
) {
	const texture = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texture)

	// Временная текстура
	const level = 0
	const internalFormat = gl.RGBA
	const pixelData = new Uint8Array([0, 0, 0, 0]) // полностью прозрачный черный
	gl.texImage2D(
		gl.TEXTURE_2D,
		level,
		internalFormat,
		1,
		1,
		0,
		gl.RGBA,
		gl.UNSIGNED_BYTE,
		pixelData
	)

	const image = new Image()
	image.crossOrigin = 'anonymous'
	image.onload = () => {
		gl.bindTexture(gl.TEXTURE_2D, texture)

		const canvas = document.createElement('canvas')
		canvas.width = image.width
		canvas.height = image.height
		const ctx = canvas.getContext('2d')!
		ctx.drawImage(image, 0, 0)
		const imageData = ctx.getImageData(0, 0, image.width, image.height)
		const data = imageData.data

		// Premultiply alpha
		for (let i = 0; i < data.length; i += 4) {
			const alpha = data[i + 3] / 255
			data[i] = Math.floor(data[i] * alpha)
			data[i + 1] = Math.floor(data[i + 1] * alpha)
			data[i + 2] = Math.floor(data[i + 2] * alpha)
		}

		ctx.putImageData(imageData, 0, 0)

		gl.texImage2D(
			gl.TEXTURE_2D,
			level,
			internalFormat,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			canvas
		)

		if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
			gl.generateMipmap(gl.TEXTURE_2D)
			gl.texParameteri(
				gl.TEXTURE_2D,
				gl.TEXTURE_MIN_FILTER,
				pixel ? gl.NEAREST : gl.LINEAR_MIPMAP_LINEAR
			)
			gl.texParameteri(
				gl.TEXTURE_2D,
				gl.TEXTURE_MAG_FILTER,
				pixel ? gl.NEAREST : gl.LINEAR
			)
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
			gl.texParameteri(
				gl.TEXTURE_2D,
				gl.TEXTURE_MIN_FILTER,
				pixel ? gl.NEAREST : gl.LINEAR
			)
			gl.texParameteri(
				gl.TEXTURE_2D,
				gl.TEXTURE_MAG_FILTER,
				pixel ? gl.NEAREST : gl.LINEAR
			)
		}
	}
	image.src = src

	return texture
}

function isPowerOf2(value: number) {
	return (value & (value - 1)) === 0
}
