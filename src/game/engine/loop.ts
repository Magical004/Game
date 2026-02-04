export interface InputEvent<T> {
  at: number;
  value: T;
}

export interface InputBuffer<T> {
  enqueue: (value: T, at?: number) => void;
  drain: (upToTime: number) => InputEvent<T>[];
  clear: () => void;
  size: () => number;
}

export const createInputBuffer = <T>(capacity = 128): InputBuffer<T> => {
  const buffer: InputEvent<T>[] = [];

  const enqueue = (value: T, at = performance.now()) => {
    if (buffer.length >= capacity) {
      buffer.shift();
    }
    buffer.push({ at, value });
    if (buffer.length > 1 && buffer[buffer.length - 2].at > at) {
      buffer.sort((a, b) => a.at - b.at);
    }
  };

  const drain = (upToTime: number) => {
    if (buffer.length === 0) {
      return [];
    }
    let count = 0;
    while (count < buffer.length && buffer[count].at <= upToTime) {
      count += 1;
    }
    if (count === 0) {
      return [];
    }
    return buffer.splice(0, count);
  };

  const clear = () => {
    buffer.length = 0;
  };

  const size = () => buffer.length;

  return { enqueue, drain, clear, size };
};

export interface FixedLoopOptions<T> {
  stepMs: number;
  update: (dtMs: number, inputs: InputEvent<T>[], simTime: number) => void;
  render?: (alpha: number, now: number) => void;
  maxFrameMs?: number;
  inputBuffer?: InputBuffer<T>;
  now?: () => number;
  requestFrame?: (cb: FrameRequestCallback) => number;
  cancelFrame?: (id: number) => void;
}

export interface FixedLoop<T> {
  start: () => void;
  stop: () => void;
  enqueueInput: (value: T, at?: number) => void;
  isRunning: () => boolean;
  getBufferSize: () => number;
}

export const createFixedLoop = <T>(options: FixedLoopOptions<T>): FixedLoop<T> => {
  const stepMs = options.stepMs;
  const maxFrameMs = options.maxFrameMs ?? 100;
  const inputBuffer = options.inputBuffer ?? createInputBuffer<T>();
  const now = options.now ?? (() => performance.now());
  const requestFrame = options.requestFrame ?? requestAnimationFrame;
  const cancelFrame = options.cancelFrame ?? cancelAnimationFrame;

  let running = false;
  let acc = 0;
  let lastTime = 0;
  let simTime = 0;
  let frameId = 0;
  let inFrame = false;

  const scheduleFrame = () => {
    frameId = requestFrame((time) => {
      if (inFrame) {
        queueMicrotask(() => frame(time));
        return;
      }

      inFrame = true;
      frame(time);
      inFrame = false;
    });
  };

  const frame: FrameRequestCallback = (time) => {
    if (!running) {
      return;
    }
    const delta = time - lastTime;
    if (delta <= 0) {
      scheduleFrame();
      return;
    }

    const elapsed = Math.min(delta, maxFrameMs);
    lastTime = time;
    acc += elapsed;

    while (acc >= stepMs) {
      simTime += stepMs;
      const inputs = inputBuffer.drain(simTime);
      options.update(stepMs, inputs, simTime);
      acc -= stepMs;
    }

    if (options.render) {
      options.render(acc / stepMs, time);
    }

    scheduleFrame();
  };

  const start = () => {
    if (running) {
      return;
    }
    running = true;
    lastTime = now();
    simTime = lastTime;
    acc = 0;
    scheduleFrame();
  };

  const stop = () => {
    if (!running) {
      return;
    }
    running = false;
    cancelFrame(frameId);
  };

  const enqueueInput = (value: T, at?: number) => {
    inputBuffer.enqueue(value, at);
  };

  const isRunning = () => running;
  const getBufferSize = () => inputBuffer.size();

  return { start, stop, enqueueInput, isRunning, getBufferSize };
};
