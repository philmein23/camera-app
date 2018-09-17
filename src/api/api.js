export class Api {
  async getUserMediaInfo(constraints) {
    return await navigator.mediaDevices.getUserMedia(constraints);
  }
}
