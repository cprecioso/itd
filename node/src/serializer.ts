export const arrayTypes = {
  i8: Int8Array,
  i16: Int16Array,
  i32: Int32Array,
  u8: Uint8Array,
  u16: Uint16Array,
  u32: Uint32Array
}

export type TypedArrayConstructor = typeof arrayTypes[keyof (typeof arrayTypes)]

export type TypedArrayOfConstructor<
  T extends TypedArrayConstructor
> = ReturnType<T["from"]>

export type TypedArray = TypedArrayOfConstructor<TypedArrayConstructor>

export type ConstructorOfTypedArray<T extends TypedArray> = Extract<
  TypedArrayConstructor,
  { from: (...args: any[]) => T }
>

export type TypedNumber = [TypedArrayConstructor, number] | Buffer
export type SerializedCommand = TypedNumber[]

export default function getBuffer(command: SerializedCommand) {
  return Buffer.concat(
    command.map(bufOrTypedNumber => {
      if (bufOrTypedNumber instanceof Buffer) return bufOrTypedNumber
      const [c, n] = bufOrTypedNumber
      return Buffer.from(c.from([n]).buffer)
    })
  )
}
