Project Description
A modern, low-lag, memory-efficient Snake duel game featuring a player snake and an AI bot, with polished visuals and responsive controls.

Core Features
- Two snakes: one player-controlled, one AI-controlled.
- Snake color customization.
- Food increases snake size.
- Poison food decreases snake size.
- Wall pass-through via teleportation entry/exit only.
- If snakes collide, the game ends.
- 30-second round timer; largest snake wins.

Project Principles
- Prioritize smooth gameplay and responsiveness.
- Keep logic and rendering memory-efficient.
- Maintain modern, polished visuals with clear feedback.
- Favor readable UI and consistent animations.

Feature Enhancements
- Bot difficulty levels (easy/medium/hard).
- Power-ups (speed boost, shield, slow-time).
- Arena themes or subtle background patterns.
- Sound effects toggle plus minimal music loop.
- Local high-score and match history.

Edge Cases

- What happens when both snakes collide in the same moment?
sol-Time of collison the larger size snake win
- What happens when a snake size would drop below the minimum due to poison?
sol-clamp size to a minimum of 1 segment
- What happens if a teleport exit is occupied by another snake segment?
sol-their should be multiple entry and exit point 
- How are overlapping power-up effects handled when collected back-to-back?
sol-use a priority + stacking rule