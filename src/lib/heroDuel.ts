/**
 * What the wyverns' duel in the hero's sky (dragon/HeroDragons) sends to the rest of the hero,
 * written once a frame by its director and read by whoever needs it in their own frame loop:
 *
 *  - gust: the clash's blast wind reaching the courier, 0..1. His cape and hair stream with it
 *    (HeroCourierCloth) and his mat ripples and shakes (HeroCarpet); he himself never moves.
 *  - tremor: how hard the frame trembles, 0..1 while the pressure builds, up to about 2 on
 *    the impact. The desert's camera (HeroPanorama) and the sky's shake with it.
 *
 * Plain mutable numbers rather than React state: they change every frame.
 */
export const duelFx = { gust: 0, tremor: 0 };
