export const fps = 60

export const serial = { port: "COM5", baudRate: 115200 }

export const game = { time: 30 }

export const food = { max: 10 }

export const topLed = {
  // Values will animation from the min to the max
  breatheLength: [2, 0.1], //seconds
  hue: 0, // degrees
  sat: 0, // %
  val: [70, 100] // %
}

export const bottomLed = {
  // Values will animation from the min to the max
  breatheLength: [2, 0.1], //seconds
  hue: [0, 108], // degrees
  sat: [100, 60], // %
  val: [70, 100] // %
}

export const processingStage = {
  breatheLength: 2, // seconds
  hue: 234, // degrees
  sat: 100, // %
  val: [0, 100] // %
}

export const colorValues = ["red", "white", "green", "#24388a"]
