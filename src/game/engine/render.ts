export interface CanvasSize {
  width: number;
  height: number;
  scale: number;
}

export interface RenderSurface {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  size: CanvasSize;
}

export interface RenderPipeline {
  resize: (width?: number, height?: number) => CanvasSize;
  render: (draw: (ctx: CanvasRenderingContext2D, size: CanvasSize) => void) => void;
  clear: () => void;
  getSurface: () => RenderSurface;
}

export interface RenderTheme {
  background: string;
  player: string;
  bot: string;
  food: string;
  poison: string;
  powerup: string;
  hud: string;
}

const measureCanvas = (canvas: HTMLCanvasElement) => {
  const rect = canvas.getBoundingClientRect();
  return {
    width: Math.max(1, Math.floor(rect.width)),
    height: Math.max(1, Math.floor(rect.height)),
  };
};

export const resizeCanvas = (canvas: HTMLCanvasElement, width?: number, height?: number): CanvasSize => {
  const { width: measuredWidth, height: measuredHeight } = measureCanvas(canvas);
  const displayWidth = width ?? measuredWidth;
  const displayHeight = height ?? measuredHeight;
  const scale = window.devicePixelRatio || 1;

  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${displayHeight}px`;
  canvas.width = Math.floor(displayWidth * scale);
  canvas.height = Math.floor(displayHeight * scale);

  return { width: displayWidth, height: displayHeight, scale };
};

export const createRenderPipeline = (canvas: HTMLCanvasElement): RenderPipeline => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context unavailable");
  }

  let size = resizeCanvas(canvas);

  const resize = (width?: number, height?: number) => {
    size = resizeCanvas(canvas, width, height);
    ctx.setTransform(size.scale, 0, 0, size.scale, 0, 0);
    return size;
  };

  const clear = () => {
    ctx.clearRect(0, 0, size.width, size.height);
  };

  const render = (draw: (ctx: CanvasRenderingContext2D, size: CanvasSize) => void) => {
    draw(ctx, size);
  };

  const getSurface = () => ({ canvas, ctx, size });

  resize();

  return { resize, render, clear, getSurface };
};

export const defaultTheme: RenderTheme = {
  background: "#0e1a1f",
  player: "#5fd38d",
  bot: "#ff9f68",
  food: "#f7d154",
  poison: "#ff6b6b",
  powerup: "#6ea8ff",
  hud: "#e9f1f7",
};

export const renderGame = (
  ctx: CanvasRenderingContext2D,
  size: CanvasSize,
  state: {
    grid: { width: number; height: number };
    player: { segments: { x: number; y: number }[] };
    bot: { segments: { x: number; y: number }[] };
    items: { position: { x: number; y: number }; type: "food" | "poison" | "powerup" }[];
    match: { remainingSec: number; winner: string | null; state: string };
  },
  theme: RenderTheme = defaultTheme,
) => {
  const cellSize = Math.min(size.width / state.grid.width, size.height / state.grid.height);

  if (cellSize <= 0) {
    console.error("Cell size is <= 0, cannot render", { size, grid: state.grid, cellSize });
    return;
  }

  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, size.width, size.height);

  const drawCell = (coord: { x: number; y: number }, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(coord.x * cellSize, coord.y * cellSize, cellSize, cellSize);
  };

  state.items.forEach((item) => {
    const color =
      item.type === "food"
        ? theme.food
        : item.type === "poison"
          ? theme.poison
          : theme.powerup;
    drawCell(item.position, color);
  });

  state.player.segments.forEach((segment) => drawCell(segment, theme.player));
  state.bot.segments.forEach((segment) => drawCell(segment, theme.bot));

  ctx.fillStyle = theme.hud;
  ctx.font = "14px sans-serif";
  ctx.fillText(`Time: ${Math.ceil(state.match.remainingSec)}`, 8, 18);
  if (state.match.state === "ended" && state.match.winner) {
    ctx.fillText(`Winner: ${state.match.winner}`, 8, 36);
  }
};
