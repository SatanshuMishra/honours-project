export default function binaryUuidToString(binaryUuid: any) {
  return [
    binaryUuid.subarray(0, 4).toString("hex"),
    binaryUuid.subarray(4, 6).toString("hex"),
    binaryUuid.subarray(6, 8).toString("hex"),
    binaryUuid.subarray(8, 10).toString("hex"),
    binaryUuid.subarray(10, 16).toString("hex"),
  ].join("-");
}
